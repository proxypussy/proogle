import { useState, useRef, useEffect, useCallback } from 'react';
import { ViewportConfig } from '../types';

export interface RecordedVideoData {
  blob: Blob;
  url: string;
  duration: number;
  sizeBytes: number;
  mimeType: string;
  width: number;
  height: number;
}

export function useScreenRecorder(frameData: string | null, viewport: ViewportConfig) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<RecordedVideoData | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderLoopRef = useRef<number | null>(null);
  const currentImgRef = useRef<HTMLImageElement | null>(null);
  const isRecordingRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Update current frame image in memory
  useEffect(() => {
    if (!frameData) return;
    const img = new Image();
    img.onload = () => {
      currentImgRef.current = img;
    };
    img.src = `data:image/jpeg;base64,${frameData}`;
  }, [frameData]);

  const getSupportedMimeType = (): string => {
    const candidates = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
    ];
    for (const mime of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return 'video/webm';
  };

  const startRecording = useCallback(() => {
    if (isRecordingRef.current) return;

    // Discard any previous video
    if (recordedVideo?.url) {
      URL.revokeObjectURL(recordedVideo.url);
      setRecordedVideo(null);
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvasRef.current = canvas;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Fill background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Start 30fps continuous render loop onto canvas
      const render = () => {
        if (!isRecordingRef.current) return;
        if (currentImgRef.current && currentImgRef.current.complete) {
          ctx.drawImage(currentImgRef.current, 0, 0, canvas.width, canvas.height);
        }
        renderLoopRef.current = requestAnimationFrame(render);
      };
      renderLoopRef.current = requestAnimationFrame(render);

      // Capture stream from canvas
      const stream = canvas.captureStream(30);
      const mimeType = getSupportedMimeType();

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 3000000, // 3 Mbps for crisp video
      });

      recordedChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (renderLoopRef.current) {
          cancelAnimationFrame(renderLoopRef.current);
          renderLoopRef.current = null;
        }

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

        setRecordedVideo({
          blob,
          url,
          duration,
          sizeBytes: blob.size,
          mimeType,
          width: viewport.width,
          height: viewport.height,
        });

        setIsRecording(false);
        setIsPaused(false);
        isRecordingRef.current = false;
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };

      recorder.start(1000); // 1-second timeslice
      startTimeRef.current = Date.now();
      isRecordingRef.current = true;
      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('[ScreenRecorder] Failed to start recording:', err);
    }
  }, [viewport.width, viewport.height, recordedVideo]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const discardRecording = useCallback(() => {
    if (recordedVideo?.url) {
      URL.revokeObjectURL(recordedVideo.url);
    }
    setRecordedVideo(null);
    setRecordingSeconds(0);
  }, [recordedVideo]);

  const downloadRecording = useCallback((customFilename?: string) => {
    if (!recordedVideo) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(
      now.getHours()
    )}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const ext = recordedVideo.mimeType.includes('mp4') ? 'mp4' : 'webm';
    const filename = customFilename || `cloudcast-recording_${timestamp}.${ext}`;

    const a = document.createElement('a');
    a.href = recordedVideo.url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [recordedVideo]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (renderLoopRef.current) cancelAnimationFrame(renderLoopRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedVideo?.url) URL.revokeObjectURL(recordedVideo.url);
    };
  }, [recordedVideo]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    isRecording,
    isPaused,
    recordingSeconds,
    formattedTime: formatTime(recordingSeconds),
    recordedVideo,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    discardRecording,
    downloadRecording,
  };
}
