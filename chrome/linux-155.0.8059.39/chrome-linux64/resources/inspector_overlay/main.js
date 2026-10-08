"use strict";var InspectorOverlay=(()=>{var Ze=new CSSStyleSheet;Ze.replaceSync(`/*
 * Copyright 2019 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

body {
  margin: 0;
  padding: 0;
  font-size: 13px;
  color: #222;
}

body.platform-linux {
  font-family: "Google Sans Text", "Google Sans", system-ui, sans-serif;
}

body.platform-mac {
  color: rgb(48 57 66);
  font-family: system-ui, sans-serif;
}

body.platform-windows {
  font-family: system-ui, sans-serif;
}

.fill {
  position: absolute;
  inset: 0;
}

#canvas {
  pointer-events: none;
}

.hidden {
  display: none !important; /* stylelint-disable-line declaration-no-important */
}
`);var Qe=Ze;var L=class{viewportSize={width:800,height:600};viewportSizeForMediaQueries;deviceScaleFactor=1;emulationScaleFactor=1;pageScaleFactor=1;pageZoomFactor=1;scrollX=0;scrollY=0;style;canvas;canvasWidth=0;canvasHeight=0;platform;_window;_document;_context;_installed=!1;constructor(e,n=[]){this._window=e,this._document=e.document,Array.isArray(n)||(n=[n]),this.style=n}setCanvas(e){this.canvas=e,this._context=e.getContext("2d")}install(){for(let e of this.style)ze(e);this._installed=!0}uninstall(){for(let e of this.style)document.adoptedStyleSheets=document.adoptedStyleSheets.filter(n=>n!==e);this._installed=!1}reset(e){e&&(this.viewportSize=e.viewportSize,this.viewportSizeForMediaQueries=e.viewportSizeForMediaQueries,this.deviceScaleFactor=e.deviceScaleFactor,this.pageScaleFactor=e.pageScaleFactor,this.pageZoomFactor=e.pageZoomFactor,this.emulationScaleFactor=e.emulationScaleFactor,this.scrollX=Math.round(e.scrollX),this.scrollY=Math.round(e.scrollY)),this.resetCanvas()}resetCanvas(){!this.canvas||!this._context||(this.canvas.width=this.deviceScaleFactor*this.viewportSize.width,this.canvas.height=this.deviceScaleFactor*this.viewportSize.height,this.canvas.style.width=this.viewportSize.width+"px",this.canvas.style.height=this.viewportSize.height+"px",this._context.scale(this.deviceScaleFactor,this.deviceScaleFactor),this.canvasWidth=this.viewportSize.width,this.canvasHeight=this.viewportSize.height)}setPlatform(e){this.platform=e,this.document.body.classList.add("platform-"+e),this._installed||this.install()}dispatch(e){let n=e.shift();this[n].apply(this,e)}eventHasCtrlOrMeta(e){return this.platform==="mac"?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey}get context(){if(!this._context)throw new Error("Context object is missing");return this._context}get document(){if(!this._document)throw new Error("Document object is missing");return this._document}get window(){if(!this._window)throw new Error("Window object is missing");return this._window}get installed(){return this._installed}};function y(t,e,n){let o=K(e,n);return o.addEventListener("click",function(r){r.stopPropagation()},!1),t.appendChild(o),o}function he(t,e){let n=document.createTextNode(e);return t.appendChild(n),n}function K(t,e){let n=document.createElement(t);return e&&(n.className=e),n}function ke(t,e){return t.length<=e?String(t):t.substr(0,e-1)+"\u2026"}function Fe(t,e,n){return t<e?t=e:t>n&&(t=n),t}function ze(t){document.adoptedStyleSheets=[...document.adoptedStyleSheets,t]}function ot(t,e){let n=t[3];return[(1-n)*e[0]+n*t[0],(1-n)*e[1]+n*t[1],(1-n)*e[2]+n*t[2],n+e[3]*(1-n)]}function rt([t,e,n]){let o=Math.max(t,e,n),r=Math.min(t,e,n),i=o-r,a;return r===o?a=0:t===o?a=(1/6*(e-n)/i+1)%1:e===o?a=1/6*(n-t)/i+1/3:a=1/6*(t-e)/i+2/3,a}function it([t,e,n,o]){let r=Math.max(t,e,n),i=Math.min(t,e,n),a=r-i,s=r+i,l=rt([t,e,n]),d=.5*s,c;return d===0||d===1?c=0:d<=.5?c=a/s:c=a/(2-s),[l,c,d,o]}function st([t,e,n,o]){let r=rt([t,e,n]),i=Math.max(t,e,n),a=Math.min(t,e,n);return[r,a,1-i,o]}function pe([t,e,n]){let o=t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4),r=e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4),i=n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4);return .2126*o+.7152*r+.0722*i}function at(t,e){let n=ot(t,e),o=pe(n),r=pe(e);return(Math.max(o,r)+.05)/(Math.min(o,r)+.05)}var Ne=2.4,un=.56,gn=.57,fn=.65,yn=.62,je=.022,bn=1.414,vn=1.14,wn=1.14,$e=.027,qe=.1,xn=5e-4;function et([t,e,n]){let o=Math.pow(t,Ne),r=Math.pow(e,Ne),i=Math.pow(n,Ne);return .2126729*o+.7151522*r+.072175*i}function lt(t,e){let n=ot(t,e);return Tn(et(n),et(e))}function tt(t){return t>je?t:t+Math.pow(je-t,bn)}function Tn(t,e){if(t=tt(t),e=tt(e),Math.abs(t-e)<xn)return 0;let n=0;return e>t?(n=(Math.pow(e,un)-Math.pow(t,gn))*vn,n=n<qe?0:n-$e):(n=(Math.pow(e,fn)-Math.pow(t,yn))*wn,n=n>-qe?0:n+$e),n*100}var dt=[[12,-1,-1,-1,-1,100,90,80,-1,-1],[14,-1,-1,-1,100,90,80,60,60,-1],[16,-1,-1,100,90,80,60,55,50,50],[18,-1,-1,90,80,60,55,50,40,40],[24,-1,100,80,60,55,50,40,38,35],[30,-1,90,70,55,50,40,38,35,40],[36,-1,80,60,50,40,38,35,30,25],[48,100,70,55,40,38,35,30,25,20],[60,90,60,50,38,35,30,25,20,20],[72,80,55,40,35,30,25,20,20,20],[96,70,50,35,30,25,20,20,20,20],[120,60,40,30,25,20,20,20,20,20]];dt.reverse();function ct(t,e){let n=parseFloat(t.replace("px","")),o=parseFloat(e);for(let[r,...i]of dt)if(n>=r){for(let[a,s]of[900,800,700,600,500,400,300,200,100].entries())if(o>=s){let l=i[i.length-1-a];return l===-1?null:l}}return null}function An(t,e){let n=["bold","bolder"],o=parseFloat(t.replace("px","")),r=isNaN(Number(e))?n.includes(e):Number(e)>=600,i=o*72/96;return r?i>=14:i>=18}var nt={largeFont:{aa:3,aaa:4.5},normalFont:{aa:4.5,aaa:7}};function mt(t,e){return An(t,e)?nt.largeFont:nt.normalFont}function G(t,e,n,o=1){n?.color&&(t.save(),t.translate(.5,.5),t.lineWidth=o,n.pattern==="dashed"&&t.setLineDash([3,3]),n.pattern==="dotted"&&t.setLineDash([2,2]),t.strokeStyle=n.color,t.stroke(e),t.restore())}function V(t,e,n,o,r){r&&(t.save(),r.fillColor&&(t.fillStyle=r.fillColor,t.fill(e)),r.hatchColor&&oe(t,e,n,10,r.hatchColor,o,!1),t.restore())}function x(t,e,n){let o=0;function r(s){let l=[];for(let d=0;d<s;++d){let c=Math.round(t[o++]*n);e.maxX=Math.max(e.maxX,c),e.minX=Math.min(e.minX,c);let m=Math.round(t[o++]*n);e.maxY=Math.max(e.maxY,m),e.minY=Math.min(e.minY,m),e.leftmostXForY[m]=Math.min(e.leftmostXForY[m]||Number.MAX_VALUE,c),e.rightmostXForY[m]=Math.max(e.rightmostXForY[m]||Number.MIN_VALUE,c),e.topmostYForX[c]=Math.min(e.topmostYForX[c]||Number.MAX_VALUE,m),e.bottommostYForX[c]=Math.max(e.bottommostYForX[c]||Number.MIN_VALUE,m),e.allPoints.push({x:c,y:m}),l.push(c,m)}return l}let i=t.length,a=new Path2D;for(;o<i;)switch(t[o++]){case"M":a.moveTo.apply(a,r(1));break;case"L":a.lineTo.apply(a,r(1));break;case"C":a.bezierCurveTo.apply(a,r(3));break;case"Q":a.quadraticCurveTo.apply(a,r(2));break;case"Z":a.closePath();break}return a}function b(){return{minX:Number.MAX_VALUE,minY:Number.MAX_VALUE,maxX:-Number.MAX_VALUE,maxY:-Number.MAX_VALUE,leftmostXForY:{},rightmostXForY:{},topmostYForX:{},bottommostYForX:{},allPoints:[]}}function H(t,e){let n=new DOMPoint(t.x,t.y);return n=n.matrixTransform(e),{x:n.x,y:n.y}}var ht=5,Cn=3,ue,pt="";function oe(t,e,n,o,r,i,a){if((t.canvas.width<n.maxX-n.minX||t.canvas.height<n.maxY-n.minY)&&(n={minX:0,maxX:t.canvas.width,minY:0,maxY:t.canvas.height,allPoints:[]}),!ue||r!==pt){pt=r;let l=document.createElement("canvas");l.width=o,l.height=ht+Cn;let d=l.getContext("2d",{willReadFrequently:!0});d.clearRect(0,0,l.width,l.height),d.rect(0,0,1,ht),d.fillStyle=r,d.fill(),ue=t.createPattern(l,"repeat")}t.save();let s=new DOMMatrix;ue.setTransform(s.scale(a?-1:1,1).rotate(0,0,-45+i)),t.fillStyle=ue,t.fill(e),t.restore()}function We(t,e,n,o){let r=["M",t.p1.x,t.p1.y,"L",t.p2.x,t.p2.y,"L",t.p3.x,t.p3.y,"L",t.p4.x,t.p4.y];for(let i of e)r=[...r,"L",i.p4.x,i.p4.y,"L",i.p3.x,i.p3.y,"L",i.p2.x,i.p2.y,"L",i.p1.x,i.p1.y,"L",i.p4.x,i.p4.y,"L",t.p4.x,t.p4.y];return r.push("Z"),x(r,n,o)}function _e(t){return(t.match(/#(\w\w)(\w\w)(\w\w)(\w\w)/)||[]).slice(1).map(e=>parseInt(e,16)/255)}function Ye(t,e){if(e==="rgb"){let[n,o,r,i]=t;return`rgb(${(n*255).toFixed()} ${(o*255).toFixed()} ${(r*255).toFixed()}${i===1?"":" / "+Math.round(i*100)/100})`}if(e==="hsl"){let[n,o,r,i]=it(t);return`hsl(${Math.round(n*360)}deg ${Math.round(o*100)} ${Math.round(r*100)}${i===1?"":" / "+Math.round((i??1)*100)/100})`}if(e==="hwb"){let[n,o,r,i]=st(t);return`hwb(${Math.round(n*360)}deg ${Math.round(o*100)} ${Math.round(r*100)}${i===1?"":" / "+Math.round((i??1)*100)/100})`}throw new Error("NOT_REACHED")}function ut(t,e){return e==="rgb"||e==="hsl"||e==="hwb"?Ye(_e(t),e):t.endsWith("FF")?t.substr(0,7):t}function N(t,e,n,o,r,i,a){t.save();let s=x(e,i,a);return n&&(t.fillStyle=n,t.fill(s)),o&&(r==="dashed"&&t.setLineDash([3,3]),r==="dotted"&&t.setLineDash([2,2]),t.lineWidth=2,t.strokeStyle=o,t.stroke(s)),t.restore(),s}var I=3,M=20,gt=20,Ln=3,ft="#1A73E8",Pn="#121212";function wt(t,e,n,o,r,i,a=new DOMMatrix){let s=`grid-${r.gridLayerCounter++}-labels`,l=document.getElementById(s);if(!l){let g=document.getElementById("grid-label-container");if(!g)throw new Error("#grid-label-container is not found");l=y(g,"div"),l.id=s}let d=t.gridHighlightConfig?.rowLineColor?t.gridHighlightConfig.rowLineColor:ft,c=fe(d);l.style.setProperty("--row-label-color",d),l.style.setProperty("--row-label-text-color",c);let m=t.gridHighlightConfig?.columnLineColor?t.gridHighlightConfig.columnLineColor:ft,h=fe(m);l.style.setProperty("--column-label-color",m),l.style.setProperty("--column-label-text-color",h),l.innerText="";let u=y(l,"div","area-names"),p=y(l,"div","line-names"),f=y(l,"div","line-numbers"),A=y(l,"div","track-sizes"),v=Mn(t,e);t.gridHighlightConfig?.showLineNames?Dn(p,v,o,i,a,t.writingMode):En(f,v,o,i,a,t.writingMode),Sn(u,n,a,t.writingMode),t.columnTrackSizes&&bt(A,t.columnTrackSizes,"column",o,i,a,t.writingMode),t.rowTrackSizes&&bt(A,t.rowTrackSizes,"row",o,i,a,t.writingMode)}function*ge(t,e){let n=null;for(let[o,r]of t.entries()){let i=o===0,a=o===t.length-1,s=Math.abs(r[e]-(n?n[e]:0))>gt,l=!a&&Math.abs(t[t.length-1][e]-r[e])>gt;(i||a||s&&l)&&(yield[o,r],n=r)}}var Z=t=>t[t.length-1],Q=t=>t[0];function yt(t){let e=[],n=[];for(let{name:o,x:r,y:i}of t){let a=Math.round(r),s=Math.round(i),l=e.findIndex(({x:d,y:c})=>d===a&&c===s);l>-1?n[l].push(o):(e.push({x:a,y:s}),n.push([o]))}return{positions:e,names:n}}function Mn(t,e){let n=Math.round(e.maxX-e.minX),o=Math.round(e.maxY-e.minY),r={rows:{positive:{positions:[],hasFirst:!1,hasLast:!1},negative:{positions:[],hasFirst:!1,hasLast:!1}},columns:{positive:{positions:[],hasFirst:!1,hasLast:!1},negative:{positions:[],hasFirst:!1,hasLast:!1}},bounds:{minX:Math.round(e.minX),maxX:Math.round(e.maxX),minY:Math.round(e.minY),maxY:Math.round(e.maxY),allPoints:e.allPoints,width:n,height:o}};if(t.gridHighlightConfig?.showLineNames){let i=yt(t.rowLineNameOffsets||[]),a={positions:i.positions,names:i.names,hasFirst:i.positions.length?Q(i.positions).y===r.bounds.minY:!1,hasLast:i.positions.length?Z(i.positions).y===r.bounds.maxY:!1};r.rows.positive=a;let s=yt(t.columnLineNameOffsets||[]),l={positions:s.positions,names:s.names,hasFirst:s.positions.length?Q(s.positions).x===r.bounds.minX:!1,hasLast:s.positions.length?Z(s.positions).x===r.bounds.maxX:!1};r.columns.positive=l}else{let i=({x:a,y:s})=>({x:Math.round(a),y:Math.round(s)});t.positiveRowLineNumberPositions&&(r.rows.positive={positions:t.positiveRowLineNumberPositions.map(i),hasFirst:Math.round(Q(t.positiveRowLineNumberPositions).y)===r.bounds.minY,hasLast:Math.round(Z(t.positiveRowLineNumberPositions).y)===r.bounds.maxY}),t.negativeRowLineNumberPositions&&(r.rows.negative={positions:t.negativeRowLineNumberPositions.map(i),hasFirst:Math.round(Q(t.negativeRowLineNumberPositions).y)===r.bounds.minY,hasLast:Math.round(Z(t.negativeRowLineNumberPositions).y)===r.bounds.maxY}),t.positiveColumnLineNumberPositions&&(r.columns.positive={positions:t.positiveColumnLineNumberPositions.map(i),hasFirst:Math.round(Q(t.positiveColumnLineNumberPositions).x)===r.bounds.minX,hasLast:Math.round(Z(t.positiveColumnLineNumberPositions).x)===r.bounds.maxX}),t.negativeColumnLineNumberPositions&&(r.columns.negative={positions:t.negativeColumnLineNumberPositions.map(i),hasFirst:Math.round(Q(t.negativeColumnLineNumberPositions).x)===r.bounds.minX,hasLast:Math.round(Z(t.negativeColumnLineNumberPositions).x)===r.bounds.maxX})}return r}function En(t,e,n,o,r=new DOMMatrix,i="horizontal-tb"){if(!e.columns.positive.names)for(let[a,s]of ge(e.columns.positive.positions,"x")){let l=_(t,(a+1).toString(),"column");Tt(l,H(s,r),e,i,n,o)}if(!e.rows.positive.names)for(let[a,s]of ge(e.rows.positive.positions,"y")){let l=_(t,(a+1).toString(),"row");xt(l,H(s,r),e,i,n,o)}for(let[a,s]of ge(e.columns.negative.positions,"x")){let l=_(t,(e.columns.negative.positions.length*-1+a).toString(),"column");Hn(l,H(s,r),e,i,n,o)}for(let[a,s]of ge(e.rows.negative.positions,"y")){let l=_(t,(e.rows.negative.positions.length*-1+a).toString(),"row");On(l,H(s,r),e,i,n,o)}}function bt(t,e,n,o,r,i=new DOMMatrix,a="horizontal-tb"){let{main:s,cross:l}=re(a),{crossSize:d}=ie(a,o);for(let{x:c,y:m,computedSize:h,authoredSize:u}of e){let p=H({x:c,y:m},i),f=h.toFixed(2),A=`${f.endsWith(".00")?f.slice(0,-3):f}px`,v=_(t,`${u?u+"\xB7":""}${A}`,n),g=j(v,a),C=p[s]-g.mainSize<M;n==="column"&&(C=a==="vertical-rl"?d-p[l]-g.crossSize<M:p[l]-g.crossSize<M);let w=S(n==="column"?"bottom-mid":"right-mid",a);w=ae(w,C),se(v,w,p.x,p.y,g,r)}}function Dn(t,e,n,o,r=new DOMMatrix,i="horizontal-tb"){for(let[a,s]of e.columns.positive.positions.entries()){let l=e.columns.positive.names[a],d=_(t,vt(l),"column");Tt(d,H(s,r),e,i,n,o)}for(let[a,s]of e.rows.positive.positions.entries()){let l=e.rows.positive.names[a],d=_(t,vt(l),"row");xt(d,H(s,r),e,i,n,o)}}function vt(t){let e=document.createElement("ul"),n=t.slice(0,Ln);for(let o of n)y(e,"li","line-name").textContent=o;return e}function Sn(t,e,n=new DOMMatrix,o="horizontal-tb"){for(let{name:r,bounds:i}of e){let a=_(t,r,"row"),{width:s,height:l}=j(a,o),d=o==="vertical-rl"||o==="sideways-rl"?i.allPoints[3]:o==="sideways-lr"?i.allPoints[1]:i.allPoints[0],c=H(d,n),m=i.allPoints[1].x<i.allPoints[0].x,h=i.allPoints[3].y<i.allPoints[0].y;a.style.left=c.x-(m?s:0)+"px",a.style.top=c.y-(h?l:0)+"px"}}function _(t,e,n){let o=y(t,"div"),r=y(o,"div","grid-label-content");return r.dataset.direction=n,typeof e=="string"?r.textContent=e:r.appendChild(e),r}function ye(t,e,n){let[o,r,i,a]=t.allPoints;return e==="row"?n==="positive"?{start:o,end:a}:{start:r,end:i}:n==="positive"?{start:o,end:r}:{start:a,end:i}}function re(t){return le(t)?{main:"x",cross:"y"}:{main:"y",cross:"x"}}function ie(t,e){return le(t)?{mainSize:e.canvasWidth,crossSize:e.canvasHeight}:{mainSize:e.canvasHeight,crossSize:e.canvasWidth}}function xt(t,e,n,o,r,i){let{start:a,end:s}=ye(n.bounds,"row","positive"),{main:l,cross:d}=re(o),{crossSize:c}=ie(o,r),m=j(t,o),h=e[d]===a[d]&&n.columns?.positive.hasFirst,u=e[d]===s[d]&&n.columns?.negative.hasFirst,p=e[d]<M,f=c-e[d]<M,A=e[l]-m.mainSize<M;A&&(h||u)&&t.classList.add("inner-shared-corner");let v=S("right-mid",o);p||h?v=S("right-top",o):(f||u)&&(v=S("right-bottom",o)),v=ae(v,A),se(t,v,e.x,e.y,m,i)}function On(t,e,n,o,r,i){let{start:a,end:s}=ye(n.bounds,"row","negative"),{main:l,cross:d}=re(o),{mainSize:c,crossSize:m}=ie(o,r),h=j(t,o),u=e[d]===a[d]&&n.columns?.positive.hasLast,p=e[d]===s[d]&&n.columns?.negative.hasLast,f=e[d]<M,A=m-e[d]<M,v=c-e[l]-h.mainSize<M;v&&(u||p)&&t.classList.add("inner-shared-corner");let g=S("left-mid",o);f||u?g=S("left-top",o):(A||p)&&(g=S("left-bottom",o)),g=ae(g,v),se(t,g,e.x,e.y,h,i)}function Tt(t,e,n,o,r,i){let{start:a,end:s}=ye(n.bounds,"column","positive"),{main:l,cross:d}=re(o),{mainSize:c,crossSize:m}=ie(o,r),h=j(t,o),u=e[l]===a[l]&&n.rows?.positive.hasFirst,p=e[l]===s[l]&&n.rows?.negative.hasFirst,f=e[l]<M,A=c-e[l]<M,v=At(o)?m-e[d]-h.crossSize<M:e[d]-h.crossSize<M;v&&(u||p)&&t.classList.add("inner-shared-corner");let g=S("bottom-mid",o);f?g=S("bottom-left",o):A&&(g=S("bottom-right",o)),g=ae(g,v),se(t,g,e.x,e.y,h,i)}function Hn(t,e,n,o,r,i){let{start:a,end:s}=ye(n.bounds,"column","negative"),{main:l,cross:d}=re(o),{mainSize:c,crossSize:m}=ie(o,r),h=j(t,o),u=e[l]===a[l]&&n.rows?.positive.hasLast,p=e[l]===s[l]&&n.rows?.negative.hasLast,f=e[l]<M,A=c-e[l]<M,v=At(o)?e[d]-h.crossSize<M:m-e[d]-h.crossSize<M;v&&(u||p)&&t.classList.add("inner-shared-corner");let g=S("top-mid",o);f?g=S("top-left",o):A&&(g=S("top-right",o)),g=ae(g,v),se(t,g,e.x,e.y,h,i)}function se(t,e,n,o,r,i){let{contentLeft:a,contentTop:s}=Bn(e,n,o,r.width,r.height,i);t.classList.add(e),t.style.left=a+"px",t.style.top=s+"px"}function j(t,e){let n=In(t),o=t.getBoundingClientRect().height,r=le(e);return{width:n,height:o,mainSize:r?n:o,crossSize:r?o:n}}function In(t){let e=t.getBoundingClientRect().width;return e%2===1&&(e+=1,t.style.width=e+"px"),e}function ae(t,e){if(!e)return t;switch(t){case"left-top":return"right-top";case"left-mid":return"right-mid";case"left-bottom":return"right-bottom";case"right-top":return"left-top";case"right-mid":return"left-mid";case"right-bottom":return"left-bottom";case"top-left":return"bottom-left";case"top-mid":return"bottom-mid";case"top-right":return"bottom-right";case"bottom-left":return"top-left";case"bottom-mid":return"top-mid";case"bottom-right":return"top-right"}return t}function S(t,e){if(e==="vertical-lr")switch(t){case"left-top":return"top-left";case"left-mid":return"top-mid";case"left-bottom":return"top-right";case"top-left":return"left-top";case"top-mid":return"left-mid";case"top-right":return"left-bottom";case"right-top":return"bottom-right";case"right-mid":return"bottom-mid";case"right-bottom":return"bottom-left";case"bottom-left":return"right-top";case"bottom-mid":return"right-mid";case"bottom-right":return"right-bottom"}if(e==="vertical-rl"||e==="sideways-rl")switch(t){case"left-top":return"top-right";case"left-mid":return"top-mid";case"left-bottom":return"top-left";case"top-left":return"right-top";case"top-mid":return"right-mid";case"top-right":return"right-bottom";case"right-top":return"bottom-right";case"right-mid":return"bottom-mid";case"right-bottom":return"bottom-left";case"bottom-left":return"left-top";case"bottom-mid":return"left-mid";case"bottom-right":return"left-bottom"}if(e==="sideways-lr")switch(t){case"left-top":return"bottom-left";case"left-mid":return"bottom-mid";case"left-bottom":return"bottom-right";case"top-left":return"left-bottom";case"top-mid":return"left-mid";case"top-right":return"left-top";case"right-top":return"top-left";case"right-mid":return"top-mid";case"right-bottom":return"top-right";case"bottom-left":return"right-bottom";case"bottom-mid":return"right-mid";case"bottom-right":return"right-top"}return t}function Bn(t,e,n,o,r,i){let a=0,s=0;switch(e*=i,n*=i,t){case"left-top":a=n,s=e+I;break;case"left-mid":a=n-r/2,s=e+I;break;case"left-bottom":a=n-r,s=e+I;break;case"right-top":a=n,s=e-I-o;break;case"right-mid":a=n-r/2,s=e-I-o;break;case"right-bottom":a=n-r,s=e-o-I;break;case"top-left":a=n+I,s=e;break;case"top-mid":a=n+I,s=e-o/2;break;case"top-right":a=n+I,s=e-o;break;case"bottom-left":a=n-I-r,s=e;break;case"bottom-mid":a=n-I-r,s=e-o/2;break;case"bottom-right":a=n-I-r,s=e-o;break}return{contentTop:a,contentLeft:s}}function fe(t){let e=[],n=_e(t+"00");if(n.length===4)e=n.slice(0,3).map(o=>o);else{let o=t.match(/[0-9.]+/g);if(!o)return null;e=o.slice(0,3).map(r=>parseInt(r,10)/255)}return e.length?pe(e)>.2?Pn:"white":null}function le(t){return t.startsWith("horizontal")}function At(t){return t==="vertical-rl"||t==="sideways-rl"}var Mt=`
/* Grid row and column labels */
.grid-label-content {
  position: absolute;
  -webkit-user-select: none;
  padding: 2px;
  font-family: Menlo, monospace;
  font-size: 10px;
  min-width: 17px;
  min-height: 15px;
  border-radius: 2px;
  box-sizing: border-box;
  z-index: 1;
  background-clip: padding-box;
  pointer-events: none;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-label-content[data-direction=row] {
  background-color: var(--row-label-color, #1A73E8);
  color: var(--row-label-text-color, #121212);
}

.grid-label-content[data-direction=column] {
  background-color: var(--column-label-color, #1A73E8);
  color: var(--column-label-text-color,#121212);
}

.line-names ul,
.line-names .line-name {
  margin: 0;
  padding: 0;
  list-style: none;
}

.line-names .line-name {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-names .grid-label-content,
.line-numbers .grid-label-content,
.track-sizes .grid-label-content {
  border: 1px solid white;
  --inner-corner-avoid-distance: 15px;
}

.grid-label-content.top-left.inner-shared-corner,
.grid-label-content.top-right.inner-shared-corner {
  transform: translateY(var(--inner-corner-avoid-distance));
}

.grid-label-content.bottom-left.inner-shared-corner,
.grid-label-content.bottom-right.inner-shared-corner {
  transform: translateY(calc(var(--inner-corner-avoid-distance) * -1));
}

.grid-label-content.left-top.inner-shared-corner,
.grid-label-content.left-bottom.inner-shared-corner {
  transform: translateX(var(--inner-corner-avoid-distance));
}

.grid-label-content.right-top.inner-shared-corner,
.grid-label-content.right-bottom.inner-shared-corner {
  transform: translateX(calc(var(--inner-corner-avoid-distance) * -1));
}

.line-names .grid-label-content::before,
.line-numbers .grid-label-content::before,
.track-sizes .grid-label-content::before {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  content: "";
  width: 3px;
  height: 3px;
  border: 1px solid white;
  border-width: 0 1px 1px 0;
}

.line-names .grid-label-content[data-direction=row]::before,
.line-numbers .grid-label-content[data-direction=row]::before,
.track-sizes .grid-label-content[data-direction=row]::before {
  background: var(--row-label-color, #1A73E8);
}

.line-names .grid-label-content[data-direction=column]::before,
.line-numbers .grid-label-content[data-direction=column]::before,
.track-sizes .grid-label-content[data-direction=column]::before {
  background: var(--column-label-color, #1A73E8);
}

.grid-label-content.bottom-mid::before {
  transform: translateY(-1px) rotate(45deg);
  top: 100%;
}

.grid-label-content.top-mid::before {
  transform: translateY(-3px) rotate(-135deg);
  top: 0%;
}

.grid-label-content.left-mid::before {
  transform: translateX(-3px) rotate(135deg);
  left: 0%
}

.grid-label-content.right-mid::before {
  transform: translateX(3px) rotate(-45deg);
  right: 0%;
}

.grid-label-content.right-top::before {
  transform: translateX(3px) translateY(-1px) rotate(-90deg) skewY(30deg);
  right: 0%;
  top: 0%;
}

.grid-label-content.right-bottom::before {
  transform: translateX(3px) translateY(-3px) skewX(30deg);
  right: 0%;
  top: 100%;
}

.grid-label-content.bottom-right::before {
  transform:  translateX(1px) translateY(-1px) skewY(30deg);
  right: 0%;
  top: 100%;
}

.grid-label-content.bottom-left::before {
  transform:  translateX(-1px) translateY(-1px) rotate(90deg) skewX(30deg);
  left: 0%;
  top: 100%;
}

.grid-label-content.left-top::before {
  transform: translateX(-3px) translateY(-1px) rotate(180deg) skewX(30deg);
  left: 0%;
  top: 0%;
}

.grid-label-content.left-bottom::before {
  transform: translateX(-3px) translateY(-3px) rotate(90deg) skewY(30deg);
  left: 0%;
  top: 100%;
}

.grid-label-content.top-right::before {
  transform:  translateX(1px) translateY(-3px) rotate(-90deg) skewX(30deg);
  right: 0%;
  top: 0%;
}

.grid-label-content.top-left::before {
  transform:  translateX(-1px) translateY(-3px) rotate(180deg) skewY(30deg);
  left: 0%;
  top: 0%;
}

@media (forced-colors: active) {
  .grid-label-content {
      border-color: Highlight;
      background-color: Canvas;
      color: Text;
      forced-color-adjust: none;
  }
  .grid-label-content::before {
    background-color: Canvas;
    border-color: Highlight;
  }
}`;function be(t,e,n,o,r,i,a){let s=b(),l=x(t.gridBorder,s,i);e.save(),Gn(t.writingMode,s,e,t.writingModeRoot),t.gridHighlightConfig.gridBackgroundColor&&(e.fillStyle=t.gridHighlightConfig.gridBackgroundColor,e.fill(l)),t.gridHighlightConfig.gridBorderColor&&(e.save(),e.translate(.5,.5),e.lineWidth=0,t.gridHighlightConfig.gridBorderDash&&e.setLineDash([3,3]),e.strokeStyle=t.gridHighlightConfig.gridBorderColor,e.stroke(l),e.restore());let d=Ct(e,t,"row",i),c=Ct(e,t,"column",i);Pt(e,t.rowGaps,t.gridHighlightConfig.rowGapColor,t.gridHighlightConfig.rowHatchColor,t.rotationAngle,i,!0),Pt(e,t.columnGaps,t.gridHighlightConfig.columnGapColor,t.gridHighlightConfig.columnHatchColor,t.rotationAngle,i,!1);let m=Rn(e,t.areaNames,t.gridHighlightConfig.areaBorderColor,i),h=e.getTransform();h.scaleSelf(1/n),e.restore(),t.gridHighlightConfig.showGridExtensionLines&&(d&&Lt(e,d,t.gridHighlightConfig.rowLineColor,t.gridHighlightConfig.rowLineDash,h,o,r),c&&Lt(e,c,t.gridHighlightConfig.columnLineColor,t.gridHighlightConfig.columnLineDash,h,o,r)),wt(t,s,m,{canvasWidth:o,canvasHeight:r},a,i,h)}function Gn(t,e,n,o){if(le(t))return;let r=e.allPoints[0],i=e.allPoints[1],a=e.allPoints[3],s=o??r;n.translate(s.x,s.y),(t==="vertical-rl"||t==="sideways-rl")&&(n.rotate(90*Math.PI/180),n.translate(0,-(a.y-r.y))),t==="vertical-lr"&&(n.rotate(90*Math.PI/180),n.scale(1,-1)),t==="sideways-lr"&&(n.rotate(-90*Math.PI/180),n.translate(-(i.x-r.x),0)),n.translate(-s.x,-s.y)}function Ct(t,e,n,o){let r=e[`${n}s`],i=e.gridHighlightConfig[`${n}LineColor`],a=e.gridHighlightConfig[`${n}LineDash`];if(!i)return null;let s=b(),l=x(r,s,o);return t.save(),t.translate(.5,.5),a&&t.setLineDash([3,3]),t.lineWidth=0,t.strokeStyle=i,t.save(),t.stroke(l),t.restore(),t.restore(),s}function Lt(t,e,n,o,r,i,a){t.save(),t.strokeStyle=n,t.lineWidth=1,t.translate(.5,.5),o&&t.setLineDash([3,3]);for(let s=0;s<e.allPoints.length;s+=2){let l=H(e.allPoints[s],r),d=H(e.allPoints[s+1],r),c,m;if(l.x===d.x)c={x:l.x,y:0},m={x:l.x,y:a},d.y<l.y&&([l,d]=[d,l]);else if(l.y===d.y)c={x:0,y:l.y},m={x:i,y:l.y},d.x<l.x&&([l,d]=[d,l]);else{let h=(d.y-l.y)/(d.x-l.x),u=(l.y*d.x-d.y*l.x)/(d.x-l.x);c={x:0,y:u},m={x:i,y:i*h+u},d.x<l.x&&([l,d]=[d,l])}t.beginPath(),t.moveTo(c.x,c.y),t.lineTo(l.x,l.y),t.moveTo(d.x,d.y),t.lineTo(m.x,m.y),t.stroke()}t.restore()}function Rn(t,e,n,o){if(!e||!Object.keys(e).length)return[];t.save(),n&&(t.strokeStyle=n),t.lineWidth=2;let r=[];for(let i in e){let a=e[i],s=b(),l=x(a,s,o);t.stroke(l),r.push({name:i,bounds:s})}return t.restore(),r}function Pt(t,e,n,o,r,i,a){if(!n&&!o)return;t.save(),t.translate(.5,.5),t.lineWidth=0;let s=b(),l=x(e,s,i);n&&(t.fillStyle=n,t.fill(l)),o&&oe(t,l,s,10,o,r,a),t.restore()}var Et=new CSSStyleSheet;Et.replaceSync(`/*
 * Copyright 2026 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
/* eslint-disable color-named, plugin/use_theme_colors */

:root {
  --gemini-logo: url("data:image/svg+xml,%0A%3Csvg%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2065%2065%22%3E%3Cmask%20id%3D%22maskme%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2265%22%20height%3D%2265%22%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3C/mask%3E%3Cg%20mask%3D%22url(%23maskme)%22%3E%3Cpath%20fill%3D%22%234285F4%22%20d%3D%22M0%200h38.235L65%2027.66%2065%2065H0z%22/%3E%3Cpath%20fill%3D%22%23EA4335%22%20d%3D%22M26.765%200H65v38.235z%22/%3E%3Cpath%20fill%3D%22%2334A853%22%20d%3D%22M0%2026.765H38.235V65H0z%22/%3E%3Cpath%20fill%3D%22%23FBBC04%22%20d%3D%22M27.66%2065L65%2038.235V65z%22/%3E%3C/g%3E%3C/svg%3E");
  --open-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' /%3E%3Cpolyline points='15 3 21 3 21 9' /%3E%3Cline x1='10' y1='14' x2='21' y2='3' /%3E%3C/svg%3E");
}

#green-dev-anchors-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
}

.green-dev-anchor-minimal {
  position: absolute;
  width: 70px;
  height: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  pointer-events: auto;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  cursor: pointer;
}

.green-dev-anchor-icon-gemini {
  width: 24px;
  height: 24px;
  background-image: var(--gemini-logo);
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 5px;
}

.green-dev-anchor-icon-open {
  width: 20px;
  height: 20px;
  background-image: var(--open-icon);
  background-size: cover;
  background-repeat: no-repeat;
}
`);var Xe=Et;function Dt(t){window.InspectorOverlayHost.send({highlightType:"greenDevFloaty",command:"debugMessage",message:t})}var ve=class extends L{#e;#t=new Map;install(){Dt("GreenDevAnchorsOverlay.install() called"),this.document.body.classList.add("fill");let e=this.document.createElement("canvas");e.id="canvas",e.classList.add("fill"),e.style.pointerEvents="none",this.document.body.append(e);let n=this.document.createElement("div");n.id="green-dev-anchors-container",this.document.body.append(n),this.#e=n,this.setCanvas(e),super.install()}uninstall(){Dt("GreenDevAnchorsOverlay.uninstall() called"),this.document.body.classList.remove("fill"),this.#e&&this.#e.parentElement&&this.#e.parentElement.removeChild(this.#e),this.#t.clear(),super.uninstall()}drawGreenDevAnchors(e){if(this.#e&&!this.#e.isConnected){try{this.uninstall()}catch(o){console.error("Error during uninstall in drawGreenDevAnchors:",o)}this.install()}let n=new Map;for(let o of e){let{x:r,y:i,nodeId:a}=o,s=this.#t.get(a);if(s)s.style.left=`${r}px`,s.style.top=`${i}px`,this.#t.delete(a);else{let l=this.drawGreenDevAnchor(o);if(!l)continue;s=l,s.style.left=`${r}px`,s.style.top=`${i}px`,this.#e.append(s)}n.set(a,s)}for(let o of this.#t.values())o.remove();this.#t=n}drawGreenDevAnchor(e){let{nodeId:n}=e,o=this.document.createElement("div");o.classList.add("green-dev-anchor-minimal");let r=this.document.createElement("div");r.classList.add("green-dev-anchor-icon-gemini"),o.append(r);let i=this.document.createElement("div");i.classList.add("green-dev-anchor-icon-open"),o.append(i);let a=s=>{s.stopPropagation(),s.preventDefault()};return i.addEventListener("mousedown",a),i.addEventListener("mouseup",a),i.addEventListener("mousemove",a),i.addEventListener("mouseenter",a),i.addEventListener("mouseleave",a),i.addEventListener("click",s=>{a(s),window.InspectorOverlayHost.send({highlightType:"greenDevFloaty",command:"openDevTools",nodeId:n})}),o.addEventListener("mousedown",a),o.addEventListener("mouseup",a),o.addEventListener("mousemove",a),o.addEventListener("mouseenter",a),o.addEventListener("mouseleave",a),o.addEventListener("click",s=>{s.target!==o&&!o.contains(s.target)||(a(s),window.InspectorOverlayHost.send({highlightType:"greenDevFloaty",command:"restoreFloaty",nodeId:n}))}),o}};var St=new CSSStyleSheet;St.replaceSync(`/*
 * Copyright 2021 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

@media (forced-colors: active) {
  :root,
  body {
    background-color: transparent;
    forced-color-adjust: none;
  }
}
`);var Ot=St;var Ht=new CSSStyleSheet;Ht.replaceSync(`/*
 * Copyright 2021 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

body {
  --arrow-width: 15px;
  --arrow-height: 8px;
  --shadow-up: 5px;
  --shadow-down: -5px;
  --shadow-direction: var(--shadow-up);
  --arrow-down: polygon(0 0, 100% 0, 50% 100%);
  --arrow-up: polygon(50% 0, 0 100%, 100% 100%);
}

.px {
  color: rgb(128 128 128);
}

#element-title {
  position: absolute;
  z-index: 10;
}
/* Material */

.tooltip-content {
  position: absolute;
  user-select: none;
  background-color: #fff;
  padding: 5px 8px;
  border: 1px solid #fff;
  border-radius: 3px;
  box-sizing: border-box;
  min-width: 100px;
  max-width: min(300px, 100% - 4px);
  z-index: 2;
  background-clip: padding-box;
  will-change: transform;
  text-rendering: optimizelegibility;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 35%));
}

.tooltip-content::after {
  content: '';
  background: #fff;
  width: var(--arrow-width);
  height: var(--arrow-height);
  clip-path: var(--arrow);
  position: absolute;
  top: var(--arrow-top);
  left: var(--arrow-left);
  visibility: var(--arrow-visibility);
}

.element-info-section {
  margin-top: 12px;
  margin-bottom: 6px;
}

.section-name {
  color: #333;
  font-weight: 500;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 12px;
}

.element-info {
  display: flex;
  flex-direction: column;
}

.element-info-header {
  display: flex;
  align-items: center;
}

.element-info-body {
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  margin-top: 2px;
}

.element-info-row {
  display: flex;
  line-height: 19px;
}

.separator-container {
  display: flex;
  align-items: center;
  flex: auto;
  margin-left: 7px;
}

.separator {
  border-top: 1px solid #ddd;
  width: 100%;
}

.element-info-name {
  flex-shrink: 0;
  color: #666;
}

.element-info-gap {
  flex: auto;
}

.element-info-value-color {
  display: flex;
  color: rgb(48 57 66);
  margin-left: 10px;
  align-items: baseline;
}

.a11y-icon {
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  display: inline-block;
}

.element-info-value-contrast {
  display: flex;
  align-items: center;
  text-align: right;
  color: rgb(48 57 66);
  margin-left: 10px;
}

.element-info-value-contrast .a11y-icon {
  margin-left: 8px;
}

.element-info-value-icon {
  display: flex;
  align-items: center;
}

.element-info-value-text {
  text-align: right;
  color: rgb(48 57 66);
  margin-left: 10px;
  align-items: baseline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.color-swatch {
  display: flex;
  margin-right: 2px;
  width: 10px;
  height: 10px;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==');
  line-height: 10px;
}

.color-swatch-inner {
  flex: auto;
  border: 1px solid rgb(128 128 128 / 60%);
}

.element-layout-type {
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.element-layout-type.grid {
  background-image: url('data:image/svg+xml,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="4" height="4" stroke="%231A73E8"/><rect x="9.5" y="2.5" width="4" height="4" stroke="%231A73E8"/><rect x="9.5" y="9.5" width="4" height="4" stroke="%231A73E8"/><rect x="2.5" y="9.5" width="4" height="4" stroke="%231A73E8"/></svg>');
}

.element-layout-type.flex {
  background-image: url('data:image/svg+xml,<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 3.5h8v3H1v-3zm-1 0a1 1 0 011-1h8a1 1 0 011 1v3a1 1 0 01-1 1H1a1 1 0 01-1-1v-3zm12 0h3v3h-3v-3zm-1 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm-7 6H1v3h3v-3zm-3-1a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1H1zm6 4v-3h8v3H7zm-1-3a1 1 0 011-1h8a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 01-1-1v-3z" fill="%231A73E8"/></svg>');
}

.element-description {
  flex: 1 1;
  font-weight: bold;
  overflow-wrap: break-word;
  word-break: break-all;
}

.dimensions {
  color: var(--sys-color-outline);
  text-align: right;
  margin-left: 10px;
}

.material-node-width {
  margin-right: 2px;
}

.material-node-height {
  margin-left: 2px;
}

.material-tag-name {
  /* Keep this in sync with inspectorCommon.css (--override-dom-tag-name-color) */
  color: rgb(136 18 128);
}

.material-class-name,
.material-node-id {
  /* Keep this in sync with inspectorCommon.css (.webkit-html-attribute-value) */
  color: rgb(26 26 166);
}

.contrast-text {
  width: 16px;
  height: 16px;
  text-align: center;
  line-height: 16px;
  margin-right: 8px;
  border: 1px solid rgb(0 0 0 / 10%);
  padding: 0 1px;
}

.a11y-icon-not-ok {
  background-image: url('data:image/svg+xml,<svg fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m9 1.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13.5c-3.315 0-6-2.685-6-6 0-1.3875.4725-2.6625 1.2675-3.675l8.4075 8.4075c-1.0125.795-2.2875 1.2675-3.675 1.2675zm4.7325-2.325-8.4075-8.4075c1.0125-.795 2.2875-1.2675 3.675-1.2675 3.315 0 6 2.685 6 6 0 1.3875-.4725 2.6625-1.2675 3.675z" fill="%239e9e9e"/></svg>');
}

.a11y-icon-warning {
  background-image: url('data:image/svg+xml,<svg fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m8.25 11.25h1.5v1.5h-1.5zm0-6h1.5v4.5h-1.5zm.7425-3.75c-4.14 0-7.4925 3.36-7.4925 7.5s3.3525 7.5 7.4925 7.5c4.1475 0 7.5075-3.36 7.5075-7.5s-3.36-7.5-7.5075-7.5zm.0075 13.5c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" fill="%23e37400"/></svg>');
}

.a11y-icon-ok {
  background-image: url('data:image/svg+xml,<svg fill="none" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="m9 1.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13.5c-3.3075 0-6-2.6925-6-6s2.6925-6 6-6 6 2.6925 6 6-2.6925 6-6 6zm-1.5-4.35-1.95-1.95-1.05 1.05 3 3 6-6-1.05-1.05z" fill="%230ca40c"/></svg>');
}

@media (forced-colors: active) {
  :root,
  body {
    background-color: transparent;
    forced-color-adjust: none;
  }

  .tooltip-content {
    border-color: Highlight;
    background-color: canvas;
    forced-color-adjust: none;
  }

  .tooltip-content::after {
    background-color: Highlight;
  }

  .color-swatch-inner,
  .contrast-text,
  .separator {
    border-color: Highlight;
  }

  .section-name {
    color: Highlight;
  }

  .dimensions,
  .element-info-name,
  .element-info-value-color,
  .element-info-value-contrast,
  .element-info-value-icon,
  .element-info-value-text,
  .material-tag-name,
  .material-class-name,
  .material-node-id {
    color: canvastext;
  }
}
`);var It=Ht;function we(t,e,n){let o=t.containerQueryContainerHighlightConfig,r=b(),i=x(t.containerBorder,r,n);if(G(e,i,o.containerBorder,2),!!t.queryingDescendants)for(let a of t.queryingDescendants){let s=b(),l=x(a.descendantBorder,s,n);G(e,l,o.descendantBorder)}}var kn=2,Bt=5,xe=5,$=6,Gt=11,Rt=2,kt=1,Te=5;function Yt(t,e,n,o){let{baseSize:r,isHorizontalFlow:i}=t,a=ce(e),s=i?{p1:a.p1,p2:Ae(a.p1,a.p2,r),p3:Ae(a.p4,a.p3,r),p4:a.p4}:{p1:a.p1,p2:a.p2,p3:Ae(a.p2,a.p3,r),p4:Ae(a.p1,a.p4,r)};Fn(t,a,s,n,o),zn(t,a,s,n,o)}function Fn(t,e,n,o,r){let i=t.flexItemHighlightConfig,a=b(),s=x(Kn(n),a,r),l=Math.atan2(e.p4.y-e.p1.y,e.p4.x-e.p1.x)+Math.PI*45/180;V(o,s,a,l,i.baseSizeBox),G(o,s,i.baseSizeBorder)}function zn(t,e,n,o,r){let{isHorizontalFlow:i}=t,a=t.flexItemHighlightConfig;if(!a.flexibilityArrow)return;let s=i?{x:(n.p2.x+n.p3.x)/2,y:(n.p2.y+n.p3.y)/2}:{x:(n.p4.x+n.p3.x)/2,y:(n.p4.y+n.p3.y)/2},l=i?{x:(e.p2.x+e.p3.x)/2,y:(e.p2.y+e.p3.y)/2}:{x:(e.p4.x+e.p3.x)/2,y:(e.p4.y+e.p3.y)/2};if(l.x===s.x&&l.y===s.y)return;let d=Xt([s,l]);if(G(o,x(d,b(),r),a.flexibilityArrow,kt),!a.flexibilityArrow.color)return;let c=x(["M",l.x-Te,l.y-Te,"L",l.x,l.y,"L",l.x-Te,l.y+Te],b(),r),m=Math.atan2(l.y-s.y,l.x-s.x);o.save(),o.translate(l.x+.5,l.y+.5),o.rotate(m),o.translate(-l.x-.5,-l.y-.5),G(o,c,a.flexibilityArrow,kt),o.restore()}function Ce(t,e,n){let o=t.flexContainerHighlightConfig,r=b(),i=x(t.containerBorder,r,n),{isHorizontalFlow:a,isReverse:s,lines:l}=t;if(G(e,i,o.containerBorder),!l?.length)return;let d=Un(t.containerBorder,l,a,s);Nn(t,e,n,d,a),Wn(t,e,n,t.containerBorder,d),_n(t,e,n,d,l.map(c=>c.map(m=>m.baseline)))}function Nn(t,e,n,o,r){let i=t.flexContainerHighlightConfig,a=o.map((l,d)=>{let c=o[d+1]?.quad;return{path:r?zt(l.quad,c):Nt(l.quad,c),items:l.extendedItems.map((m,h)=>{let u=l.extendedItems[h+1]&&l.extendedItems[h+1];return r?Nt(m,u):zt(m,u)})}}),s=a.length>1;for(let{path:l,items:d}of a){for(let c of d)G(e,x(c,b(),n),i.itemSeparator);s&&G(e,x(l,b(),n),i.lineSeparator)}}function Wn(t,e,n,o,r){let{isHorizontalFlow:i}=t,{mainDistributedSpace:a,crossDistributedSpace:s,rowGapSpace:l,columnGapSpace:d}=t.flexContainerHighlightConfig,c=i?d:l,m=i?l:d,h=a&&!!(a.fillColor||a.hatchColor),u=r.length>1&&s&&!!(s.fillColor||s.hatchColor),p=c&&!!(c.fillColor||c.hatchColor),f=r.length>1&&m&&!!(m.fillColor||m.hatchColor),A=a&&s&&c&&m&&a.fillColor===s.fillColor&&a.hatchColor===s.hatchColor&&a.fillColor===c.fillColor&&a.hatchColor===c.hatchColor&&a.fillColor===m.fillColor&&a.hatchColor===m.hatchColor,v=ce(o);if(A){let C=r.map(w=>w.extendedItems).flat().map(w=>w);de(v,C,a,e,n);return}let g=Jn(t,r);if(u){let C=[...r.map(w=>w.quad),...f?g.crossGaps:[]];de(v,C,s,e,n)}if(h)for(let[C,w]of r.entries()){let D=[...w.extendedItems,...p?g.mainGaps[C]:[]];de(w.quad,D,a,e,n)}if(f)for(let C of g.crossGaps)de(C,[],m,e,n);if(p)for(let C of g.mainGaps)for(let w of C)de(w,[],c,e,n)}function _n(t,e,n,o,r){o.forEach(({quad:i,items:a},s)=>{Yn(t,e,n,i,a,r[s])})}function Yn(t,e,n,o,r,i){let{alignItemsStyle:a,isHorizontalFlow:s}=t,{crossAlignment:l}=t.flexContainerHighlightConfig;if(!l?.color)return;let d=[];switch(a){case"flex-start":d.push([s?o.p1:o.p4,s?o.p2:o.p1]);break;case"flex-end":d.push([s?o.p3:o.p2,s?o.p4:o.p3]);break;case"center":s?(d.push([{x:(o.p1.x+o.p4.x)/2,y:(o.p1.y+o.p4.y)/2},{x:(o.p2.x+o.p3.x)/2,y:(o.p2.y+o.p3.y)/2}]),d.push([{x:(o.p2.x+o.p3.x)/2,y:(o.p2.y+o.p3.y)/2},{x:(o.p1.x+o.p4.x)/2,y:(o.p1.y+o.p4.y)/2}])):(d.push([{x:(o.p1.x+o.p2.x)/2,y:(o.p1.y+o.p2.y)/2},{x:(o.p3.x+o.p4.x)/2,y:(o.p3.y+o.p4.y)/2}]),d.push([{x:(o.p3.x+o.p4.x)/2,y:(o.p3.y+o.p4.y)/2},{x:(o.p1.x+o.p2.x)/2,y:(o.p1.y+o.p2.y)/2}]));break;case"stretch":case"normal":d.push([s?o.p1:o.p4,s?o.p2:o.p1]),d.push([s?o.p3:o.p2,s?o.p4:o.p3]);break;case"baseline":if(s){let c=r[0],m=P([c.p1,c.p2],[o.p2,o.p3]),h=P([c.p1,c.p2],[o.p1,o.p4]),u=i[0],p=Math.atan2(c.p4.y-c.p1.y,c.p4.x-c.p1.x);d.push([{x:m.x+u*Math.cos(p),y:m.y+u*Math.sin(p)},{x:h.x+u*Math.cos(p),y:h.y+u*Math.sin(p)}])}break}for(let c of d){let m=Xt(c);G(e,x(m,b(),n),l,kn),Xn(t,e,n,c[0],c[1])}}function Xn(t,e,n,o,r){let{crossAlignment:i}=t.flexContainerHighlightConfig;if(!i?.color)return;let a=Math.atan2(r.y-o.y,r.x-o.x),s={x:-Rt*Math.cos(a-.5*Math.PI)+(o.x+r.x)/2,y:-Rt*Math.sin(a-.5*Math.PI)+(o.y+r.y)/2},l=x(["M",s.x,s.y,"L",s.x+Gt/2,s.y+$,"L",s.x+xe/2,s.y+$,"L",s.x+xe/2,s.y+$+Bt,"L",s.x-xe/2,s.y+$+Bt,"L",s.x-xe/2,s.y+$,"L",s.x-Gt/2,s.y+$,"Z"],b(),n);e.save(),e.translate(s.x,s.y),e.rotate(a),e.translate(-s.x,-s.y),e.fillStyle=i.color,e.fill(l),e.lineWidth=1,e.strokeStyle="white",e.stroke(l),e.restore()}function de(t,e,n,o,r){if(n){if(n.fillColor){let i=b(),a=We(t,e,i,r);o.fillStyle=n.fillColor,o.fill(a)}if(n.hatchColor){let i=Math.atan2(t.p2.y-t.p1.y,t.p2.x-t.p1.x)*180/Math.PI,a=b(),s=We(t,e,a,r);oe(o,s,a,10,n.hatchColor,i,!1)}}}function Un(t,e,n,o){let r=ce(t),i=[];for(let a of e){if(!a.length)continue;let s=ce(a[0].itemBorder),l=[];for(let{itemBorder:m}of a){let h=ce(m);s=s?Vn(s,h,n,o):h,l.push(h)}let d=e.length===1?r:Wt(s,r,n),c=l.map(m=>Wt(m,d,!n));i.push({quad:d,items:l,extendedItems:c})}return i}function Jn(t,e){let{crossGap:n,mainGap:o,isHorizontalFlow:r,isReverse:i}=t,a=[],s=[];if(n&&e.length>1)for(let l=0,d=l+1;l<e.length-1;l++,d=l+1){let c=e[l].quad,m=e[d].quad;s.push(Ft(c,m,n,r))}for(let{extendedItems:l}of e){let d=[];if(o)for(let c=0,m=c+1;c<l.length-1;c++,m=c+1){let h=l[c],u=l[m];d.push(Ft(h,u,o,!r,i))}a.push(d)}return{mainGaps:a,crossGaps:s}}function Ft(t,e,n,o,r){r&&([t,e]=[e,t]);let i=o?Math.atan2(t.p4.y-t.p1.y,t.p4.x-t.p1.x):Math.atan2(t.p2.y-t.p1.y,t.p2.x-t.p1.x),a=_t(o?t.p4:t.p2,e.p1),s=a/2-n/2,l=a/2+n/2;return o?{p1:{x:Math.round(t.p4.x+s*Math.cos(i)),y:Math.round(t.p4.y+s*Math.sin(i))},p2:{x:Math.round(t.p3.x+s*Math.cos(i)),y:Math.round(t.p3.y+s*Math.sin(i))},p3:{x:Math.round(t.p3.x+l*Math.cos(i)),y:Math.round(t.p3.y+l*Math.sin(i))},p4:{x:Math.round(t.p4.x+l*Math.cos(i)),y:Math.round(t.p4.y+l*Math.sin(i))}}:{p1:{x:Math.round(t.p2.x+s*Math.cos(i)),y:Math.round(t.p2.y+s*Math.sin(i))},p2:{x:Math.round(t.p2.x+l*Math.cos(i)),y:Math.round(t.p2.y+l*Math.sin(i))},p3:{x:Math.round(t.p3.x+l*Math.cos(i)),y:Math.round(t.p3.y+l*Math.sin(i))},p4:{x:Math.round(t.p3.x+s*Math.cos(i)),y:Math.round(t.p3.y+s*Math.sin(i))}}}function zt(t,e){let n=e&&t.p4.y===e.p1.y,o=["M",t.p1.x,t.p1.y,"L",t.p2.x,t.p2.y];return n?o:[...o,"M",t.p3.x,t.p3.y,"L",t.p4.x,t.p4.y]}function Nt(t,e){let n=e&&t.p2.x===e.p1.x,o=["M",t.p1.x,t.p1.y,"L",t.p4.x,t.p4.y];return n?o:[...o,"M",t.p3.x,t.p3.y,"L",t.p2.x,t.p2.y]}function Kn(t){return["M",t.p1.x,t.p1.y,"L",t.p2.x,t.p2.y,"L",t.p3.x,t.p3.y,"L",t.p4.x,t.p4.y,"Z"]}function Xt(t){return["M",t[0].x,t[0].y,"L",t[1].x,t[1].y]}function ce(t){return{p1:{x:t[1],y:t[2]},p2:{x:t[4],y:t[5]},p3:{x:t[7],y:t[8]},p4:{x:t[10],y:t[11]}}}function Vn(t,e,n,o){o&&([t,e]=[e,t]);let r=n?[t.p1,t.p4]:[t.p1,t.p2],i=n?[e.p2,e.p3]:[e.p4,e.p3],a=n?[t.p1,t.p2]:[t.p1,t.p4],s=n?[t.p4,t.p3]:[t.p2,t.p3],l=n?[e.p1,e.p2]:[e.p1,e.p4],d=n?[e.p4,e.p3]:[e.p2,e.p3],c,m,h,u;return n?(c=P(r,l),Y(r,c)&&(c=t.p1),m=P(i,a),Y(i,m)&&(m=e.p2),h=P(i,s),Y(i,h)&&(h=e.p3),u=P(r,d),Y(r,u)&&(u=t.p4)):(c=P(r,l),Y(r,c)&&(c=t.p1),m=P(r,d),Y(r,m)&&(m=t.p2),h=P(i,s),Y(i,h)&&(h=e.p3),u=P(i,a),Y(i,u)&&(u=e.p4)),{p1:c,p2:m,p3:h,p4:u}}function Wt(t,e,n){return{p1:n?P([e.p1,e.p4],[t.p1,t.p2]):P([e.p1,e.p2],[t.p1,t.p4]),p2:n?P([e.p2,e.p3],[t.p1,t.p2]):P([e.p1,e.p2],[t.p2,t.p3]),p3:n?P([e.p2,e.p3],[t.p3,t.p4]):P([e.p3,e.p4],[t.p2,t.p3]),p4:n?P([e.p1,e.p4],[t.p3,t.p4]):P([e.p3,e.p4],[t.p1,t.p4])}}function P([t,e],[n,o]){let r=((t.x*e.y-t.y*e.x)*(n.x-o.x)-(t.x-e.x)*(n.x*o.y-n.y*o.x))/((t.x-e.x)*(n.y-o.y)-(t.y-e.y)*(n.x-o.x)),i=((t.x*e.y-t.y*e.x)*(n.y-o.y)-(t.y-e.y)*(n.x*o.y-n.y*o.x))/((t.x-e.x)*(n.y-o.y)-(t.y-e.y)*(n.x-o.x));return{x:Object.is(r,-0)?0:r,y:Object.is(i,-0)?0:i}}function Y([t,e],n){return t.x<e.x&&(n.x<t.x||n.x>e.x)||t.x>e.x&&(n.x>t.x||n.x<e.x)||t.y<e.y&&(n.y<t.y||n.y>e.y)||t.y>e.y&&(n.y>t.y||n.y<e.y)?!1:(n.y-t.y)*(e.x-t.x)===(e.y-t.y)*(n.x-t.x)}function _t(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Ae(t,e,n){let o=(e.y-t.y)/(e.x-t.x),r=Math.atan(o);return{x:t.x+n*Math.cos(r),y:t.y+n*Math.sin(r)}}var Ut=new Map([["width","ew-resize"],["height","ns-resize"],["bidirection","nwse-resize"]]),Le=class{document;delegate;originX;originY;boundMousemove;boundMousedown;constructor(e,n){this.document=e,this.delegate=n,this.boundMousemove=this.onMousemove.bind(this),this.boundMousedown=this.onMousedown.bind(this)}install(){this.document.body.addEventListener("mousemove",this.boundMousemove),this.document.body.addEventListener("mousedown",this.boundMousedown)}uninstall(){this.document.body.removeEventListener("mousemove",this.boundMousemove),this.document.body.removeEventListener("mousedown",this.boundMousedown)}onMousemove(e){let n=this.delegate.getDraggable(e.clientX,e.clientY);if(!n){this.document.body.style.cursor="default";return}this.document.body.style.cursor=Ut.get(n.type)||"default"}onMousedown(e){let n=this.delegate.getDraggable(e.clientX,e.clientY);if(!n)return;let o=this.onDrag.bind(this,n);e.stopPropagation(),e.preventDefault(),n.initialWidth!==void 0&&(n.type==="width"||n.type==="bidirection")&&(this.originX={coord:Math.round(e.clientX),value:n.initialWidth}),n.initialHeight!==void 0&&(n.type==="height"||n.type==="bidirection")&&(this.originY={coord:Math.round(e.clientY),value:n.initialHeight}),this.document.body.removeEventListener("mousemove",this.boundMousemove),this.document.body.style.cursor=Ut.get(n.type)||"default";let r=i=>{i.stopPropagation(),i.preventDefault(),this.originX=void 0,this.originY=void 0,this.document.body.style.cursor="default",this.document.body.removeEventListener("mousemove",o),this.document.body.addEventListener("mousemove",this.boundMousemove)};this.document.body.addEventListener("mouseup",r,{once:!0}),window.addEventListener("mouseout",r,{once:!0}),this.document.body.addEventListener("mousemove",o)}onDrag(e,n){if(!this.originX&&!this.originY)return;let o,r;if(this.originX){let i=this.originX.coord-n.clientX;o=Math.round(this.originX.value-i)}if(this.originY){let i=this.originY.coord-n.clientY;r=Math.round(this.originY.value-i)}e.update({width:o,height:r})}};function Jt(t,e,n,o,r){let{currentX:i,currentY:a,currentWidth:s,currentHeight:l,highlightIndex:d}=t;e.save(),e.fillStyle=t.isolationModeHighlightConfig.maskColor,e.fillRect(0,0,n,o),e.clearRect(i,a,s,l),e.restore();let c=b(),m=x(t.widthResizerBorder,c,r);V(e,m,c,0,{fillColor:t.isolationModeHighlightConfig.resizerColor});let h=x(t.heightResizerBorder,c,r);V(e,h,c,0,{fillColor:t.isolationModeHighlightConfig.resizerColor});let u=x(t.bidirectionResizerBorder,c,r);return V(e,u,c,0,{fillColor:t.isolationModeHighlightConfig.resizerColor}),{widthPath:m,heightPath:h,bidirectionPath:u,currentWidth:s,currentHeight:l,highlightIndex:d}}function Zn(t,e){if(e==="start")return{x:(t.minX+t.maxX)/2,y:t.minY};if(e==="center")return{x:(t.minX+t.maxX)/2,y:(t.minY+t.maxY)/2};if(e==="end")return{x:(t.minX+t.maxX)/2,y:t.maxY}}function Qn(t,e){if(e==="start")return{x:t.minX,y:(t.minY+t.maxY)/2};if(e==="center")return{x:(t.minX+t.maxX)/2,y:(t.minY+t.maxY)/2};if(e==="end")return{x:t.maxX,y:(t.minY+t.maxY)/2}}var jn=5,$n="white",qn=6,eo="#4585f6",to=4;function Kt(t,e,n){let o=0,r=!0;e.x===n.minX?(o=-.5*Math.PI,r=!1):e.x===n.maxX?(o=.5*Math.PI,r=!1):e.y===n.minY?(o=0,r=!1):e.y===n.maxY&&(o=Math.PI,r=!1);let i=o+(r?2*Math.PI:Math.PI);t.save(),t.beginPath(),t.lineWidth=jn,t.strokeStyle=$n,t.arc(e.x,e.y,qn,o,i),t.stroke(),t.fillStyle=eo,t.arc(e.x,e.y,to,o,i),t.fill(),t.restore()}function no(t,e,n){N(e,t.paddingBox,t.scrollPaddingColor,void 0,void 0,b(),n),e.save(),e.globalCompositeOperation="destination-out",N(e,t.snapport,"white",void 0,void 0,b(),n),e.restore()}function oo(t,e,n){let o=[];for(let r of t.snapAreas){let i=b();N(e,r.path,t.scrollMarginColor,t.snapAreaBorder.color,t.snapAreaBorder.pattern,i,n),e.save(),e.globalCompositeOperation="destination-out",N(e,r.borderBox,"white",void 0,void 0,b(),n),e.restore(),o.push(i)}return o}function ro(t,e,n){for(let o=0;o<e.snapAreas.length;o++){let r=e.snapAreas[o],i=r.alignInline?Qn(t[o],r.alignInline):null,a=r.alignBlock?Zn(t[o],r.alignBlock):null;i&&Kt(n,i,t[o]),a&&Kt(n,a,t[o])}}function io(t,e,n){N(e,t.snapport,void 0,t.snapportBorder.color,void 0,b(),n)}function Vt(t,e,n){no(t,e,n);let o=oo(t,e,n);io(t,e,n),ro(o,t,e)}function so(t){return{getDraggable:(e,n)=>{let o=t.isPointInDraggablePath(e,n);if(o)return{type:o.type,initialWidth:o.initialWidth,initialHeight:o.initialHeight,id:o.highlightIndex,update:({width:r,height:i})=>{window.InspectorOverlayHost.send({highlightType:"isolatedElement",highlightIndex:o.highlightIndex,newWidth:`${r}px`,newHeight:`${i}px`,resizerType:o.type})}}}}}var q=class extends L{gridLabelState={gridLayerCounter:0};gridLabels;draggableBorders=new Map;dragHandler;greenDevAnchorsOverlay;setGreenDevAnchorsOverlay(e){this.greenDevAnchorsOverlay=e}reset(e){super.reset(e),this.gridLabelState.gridLayerCounter=0,this.gridLabels.innerHTML="",this.greenDevAnchorsOverlay?.reset(e)}renderGridMarkup(){let e=this.document.createElement("div");e.id="grid-label-container",this.document.body.append(e),this.gridLabels=e}install(){this.document.body.classList.add("fill");let e=this.document.createElement("canvas");e.id="canvas",e.classList.add("fill"),this.document.body.append(e),this.renderGridMarkup(),this.setCanvas(e),super.install(),this.dragHandler?.install()}uninstall(){this.document.body.classList.remove("fill"),this.document.body.innerHTML="",this.draggableBorders=new Map,super.uninstall(),this.dragHandler?.uninstall()}drawGridHighlight(e){this.context.save(),be(e,this.context,this.deviceScaleFactor,this.canvasWidth,this.canvasHeight,this.emulationScaleFactor,this.gridLabelState),this.context.restore()}drawFlexContainerHighlight(e){this.context.save(),Ce(e,this.context,this.emulationScaleFactor),this.context.restore()}drawScrollSnapHighlight(e){this.context.save(),Vt(e,this.context,this.emulationScaleFactor),this.context.restore()}drawContainerQueryHighlight(e){this.context.save(),we(e,this.context,this.emulationScaleFactor),this.context.restore()}drawGreenDevFloatyAnchors(e){this.greenDevAnchorsOverlay&&!this.greenDevAnchorsOverlay.installed&&this.greenDevAnchorsOverlay.install(),this.greenDevAnchorsOverlay?.drawGreenDevAnchors(e)}drawIsolatedElementHighlight(e){this.dragHandler||(this.dragHandler=new Le(this.document,so(this)),this.dragHandler.install()),this.context.save();let{widthPath:n,heightPath:o,bidirectionPath:r,currentWidth:i,currentHeight:a,highlightIndex:s}=Jt(e,this.context,this.canvasWidth,this.canvasHeight,this.emulationScaleFactor);this.draggableBorders.set(s,{widthPath:n,heightPath:o,bidirectionPath:r,highlightIndex:s,initialWidth:i,initialHeight:a}),this.context.restore()}isPointInDraggablePath(e,n){for(let{widthPath:o,heightPath:r,bidirectionPath:i,highlightIndex:a,initialWidth:s,initialHeight:l}of this.draggableBorders.values()){if(this.context.isPointInPath(o,e,n))return{type:"width",highlightIndex:a,initialWidth:s};if(this.context.isPointInPath(r,e,n))return{type:"height",highlightIndex:a,initialHeight:l};if(this.context.isPointInPath(i,e,n))return{type:"bidirection",highlightIndex:a,initialWidth:s,initialHeight:l}}}};function Pe(t){return t[3]===0}var Me=class extends L{tooltip;persistentOverlay;gridLabelState={gridLayerCounter:0};reset(e){super.reset(e),this.tooltip.innerHTML="",this.gridLabelState.gridLayerCounter=0,this.persistentOverlay&&this.persistentOverlay.reset(e)}install(){this.document.body.classList.add("fill");let e=this.document.createElement("canvas");e.id="canvas",e.classList.add("fill"),this.document.body.append(e);let n=this.document.createElement("div");n.id="tooltip-container",this.document.body.append(n),this.tooltip=n,this.persistentOverlay=new q(this.window),this.persistentOverlay.renderGridMarkup(),this.persistentOverlay.setCanvas(e),this.setCanvas(e),super.install()}uninstall(){this.document.body.classList.remove("fill"),this.document.body.innerHTML="",super.uninstall()}drawHighlight(e){this.context.save();let n=b(),o=null,r=null;for(let l=e.paths.slice();l.length;){let d=l.pop();d&&(this.context.save(),N(this.context,d.path,d.fillColor,d.outlineColor,void 0,n,this.emulationScaleFactor),l.length&&(this.context.globalCompositeOperation="destination-out",N(this.context,l[l.length-1].path,"red",void 0,void 0,n,this.emulationScaleFactor)),this.context.restore(),d.name==="content"&&(o=d.path),d.name==="border"&&(r=d.path))}this.context.restore(),this.context.save();let i=!!(e.paths.length&&e.showRulers&&n.minX<20&&n.maxX+20<this.canvasWidth),a=!!(e.paths.length&&e.showRulers&&n.minY<20&&n.maxY+20<this.canvasHeight);if(e.showRulers&&this.drawAxis(this.context,i,a),e.paths.length&&(e.showExtensionLines&&ho(this.context,n,i,a,void 0,!1,this.canvasWidth,this.canvasHeight),e.elementInfo&&co(e.elementInfo,e.colorFormat,n,this.canvasWidth,this.canvasHeight)),e.gridInfo)for(let l of e.gridInfo)be(l,this.context,this.deviceScaleFactor,this.canvasWidth,this.canvasHeight,this.emulationScaleFactor,this.gridLabelState);if(e.flexInfo)for(let l of e.flexInfo)Ce(l,this.context,this.emulationScaleFactor);if(e.containerQueryInfo)for(let l of e.containerQueryInfo)we(l,this.context,this.emulationScaleFactor);let s=e.flexInfo?.length&&e.flexInfo.some(l=>Object.keys(l.flexContainerHighlightConfig).length>0);if(e.flexItemInfo&&!s)for(let l of e.flexItemInfo){let d=l.boxSizing==="content"?o:r;d&&Yt(l,d,this.context,this.emulationScaleFactor)}return this.context.restore(),{bounds:n}}drawGridHighlight(e){this.persistentOverlay&&this.persistentOverlay.drawGridHighlight(e)}drawFlexContainerHighlight(e){this.persistentOverlay&&this.persistentOverlay.drawFlexContainerHighlight(e)}drawScrollSnapHighlight(e){this.persistentOverlay?.drawScrollSnapHighlight(e)}drawContainerQueryHighlight(e){this.persistentOverlay?.drawContainerQueryHighlight(e)}drawIsolatedElementHighlight(e){this.persistentOverlay?.drawIsolatedElementHighlight(e)}drawAxis(e,n,o){e.save();let r=this.pageZoomFactor*this.pageScaleFactor*this.emulationScaleFactor,i=this.scrollX*this.pageScaleFactor,a=this.scrollY*this.pageScaleFactor;function s(u){return Math.round(u*r)}function l(u){return Math.round(u/r)}let d=this.canvasWidth/r,c=this.canvasHeight/r,m=5,h=50;e.save(),e.fillStyle=jt,o?e.fillRect(0,s(c)-15,s(d),s(c)):e.fillRect(0,0,s(d),15),e.globalCompositeOperation="destination-out",e.fillStyle="red",n?e.fillRect(s(d)-15,0,s(d),s(c)):e.fillRect(0,0,15,s(c)),e.restore(),e.fillStyle=jt,n?e.fillRect(s(d)-15,0,s(d),s(c)):e.fillRect(0,0,15,s(c)),e.lineWidth=1,e.strokeStyle=Qt,e.fillStyle=Qt;{e.save(),e.translate(-i,.5-a);let u=c+l(a);for(let f=2*h;f<u;f+=2*h)e.save(),e.translate(i,s(f)),e.rotate(-Math.PI/2),e.fillText(String(f),2,n?s(d)-7:13),e.restore();e.translate(.5,-.5);let p=d+l(i);for(let f=2*h;f<p;f+=2*h)e.save(),e.fillText(String(f),s(f)+2,o?a+s(c)-7:a+13),e.restore();e.restore()}{e.save(),n&&(e.translate(s(d),0),e.scale(-1,1)),e.translate(-i,.5-a);let u=c+l(a);for(let p=h;p<u;p+=h){e.beginPath(),e.moveTo(i,s(p));let f=p%(h*2)?5:8;e.lineTo(i+f,s(p)),e.stroke()}e.strokeStyle=Zt;for(let p=m;p<u;p+=m)p%h&&(e.beginPath(),e.moveTo(i,s(p)),e.lineTo(i+m,s(p)),e.stroke());e.restore()}{e.save(),o&&(e.translate(0,s(c)),e.scale(1,-1)),e.translate(.5-i,-a);let u=d+l(i);for(let p=h;p<u;p+=h){e.beginPath(),e.moveTo(s(p),a);let f=p%(h*2)?5:8;e.lineTo(s(p),a+f),e.stroke()}e.strokeStyle=Zt;for(let p=m;p<u;p+=m)p%h&&(e.beginPath(),e.moveTo(s(p),a),e.lineTo(s(p),a+m),e.stroke());e.restore()}e.restore()}},Zt="rgba(0,0,0,0.2)",Qt="rgba(0,0,0,0.7)",jt="rgba(255, 255, 255, 0.8)";function ao(t){return t.layoutObjectName?.endsWith("Grid")?"grid":t.layoutObjectName?.endsWith("FlexibleBox")?"flex":null}function lo(t,e){let n=K("div","element-info"),o=y(n,"div","element-info-header"),r=ao(t);r&&y(o,"div",`element-layout-type ${r}`);let i=y(o,"div","element-description monospace"),a=y(i,"span","material-tag-name");a.textContent=t.tagName;let s=y(i,"span","material-node-id"),l=80;s.textContent=t.idValue?"#"+ke(t.idValue,l):"",s.classList.toggle("hidden",!t.idValue);let d=y(i,"span","material-class-name");s.textContent.length<l&&(d.textContent=ke(t.className||"",l-s.textContent.length)),d.classList.toggle("hidden",!t.className);let c=y(o,"div","dimensions");y(c,"span","material-node-width").textContent=String(Math.round(t.nodeWidth*100)/100),he(c,"\xD7"),y(c,"span","material-node-height").textContent=String(Math.round(t.nodeHeight*100)/100);let m=t.style||{},h;t.isLockedAncestor&&X("Showing content-visibility ancestor",""),t.isLocked&&X("Descendants are skipped due to content-visibility","");let u=m.color,p=m["color-unclamped-rgba"];u&&p&&!Pe(p)&&Ke("Color",m["color-css-text"]??u,m["color-css-text"]?"original":e);let f=m["font-family"],A=m["font-size"];f&&A!=="0px"&&X("Font",`${A} ${f}`);let v=m["background-color"],g=m["background-color-unclamped-rgba"];v&&g&&!Pe(g)&&Ke("Background",m["background-color-css-text"]??v,m["background-color-css-text"]?"original":e);let C=m.margin;C&&C!=="0px"&&X("Margin",C);let w=m.padding;w&&w!=="0px"&&X("Padding",w);let D=t.contrast?t.contrast.backgroundColorUnclampedRgba:null,J=p&&!Pe(p)&&D&&!Pe(D);t.showAccessibilityInfo&&(Je("Accessibility"),J&&m["color-unclamped-rgba"]&&t.contrast&&pn(m["color-unclamped-rgba"],t.contrast),X("Name",t.accessibleName),X("Role",t.accessibleRole),Re("Keyboard-focusable",t.isKeyboardFocusable?"a11y-icon a11y-icon-ok":"a11y-icon a11y-icon-not-ok"));function ee(){h||(h=y(n,"div","element-info-body"))}function Je(B){ee();let T=y(h,"div","element-info-row element-info-section"),R=y(T,"div","section-name");R.textContent=B,y(y(T,"div","separator-container"),"div","separator")}function z(B,T,R){ee();let k=y(h,"div","element-info-row");T&&k.classList.add(T);let W=y(k,"div","element-info-name");return W.textContent=B,y(k,"div","element-info-gap"),y(k,"div",R||"")}function Re(B,T){y(z(B,"","element-info-value-icon"),"div",T)}function X(B,T){he(z(B,"","element-info-value-text"),T)}function Ke(B,T,R){let k=z(B,"","element-info-value-color"),W=y(k,"div","color-swatch"),te=y(W,"div","color-swatch-inner");te.style.backgroundColor=T,he(k,ut(T,R))}function pn(B,T){let R=B.slice(),k=T.backgroundColorUnclampedRgba.slice();R[3]*=T.textOpacity;let W=z("Contrast","","element-info-value-contrast"),te=y(W,"div","contrast-text");te.style.color=Ye(R,"rgb"),te.style.backgroundColor=T.backgroundColorCssText,te.textContent="Aa";let Ve=y(W,"span");if(T.contrastAlgorithm==="apca"){let ne=lt(R,k),me=ct(T.fontSize,T.fontWeight);Ve.textContent=String(Math.floor(ne*100)/100)+"%",y(W,"div",me===null||Math.abs(ne)<me?"a11y-icon a11y-icon-warning":"a11y-icon a11y-icon-ok")}else if(T.contrastAlgorithm==="aa"||T.contrastAlgorithm==="aaa"){let ne=at(R,k),me=mt(T.fontSize,T.fontWeight)[T.contrastAlgorithm];Ve.textContent=String(Math.floor(ne*100)/100),y(W,"div",ne<me?"a11y-icon a11y-icon-warning":"a11y-icon a11y-icon-ok")}}return n}function co(t,e,n,o,r){let i=document.getElementById("tooltip-container");if(!i)throw new Error("#tooltip-container is not found");i.innerHTML="";let a=y(i,"div"),s=y(a,"div","tooltip-content"),l=lo(t,e);s.appendChild(l);let d=s.offsetWidth,c=s.offsetHeight,m=8,h=2,u=m*2,p=m+2,f=h+p,A=o-h-p-u,v=n.maxX-n.minX<u+2*p,g;if(v)g=(n.minX+n.maxX)*.5-m;else{let z=n.minX+p,Re=n.maxX-p-u;z>f&&z<A?g=z:g=Fe(f,z,Re)}let C=g<f||g>A,w=g-p;w=Fe(w,h,o-d-h);let D=n.minY-m-c,J=!0;D<0?(D=Math.min(r-c,n.maxY+m),J=!1):n.minY>r&&(D=r-m-c);let ee=w>=n.minX&&w+d<=n.maxX&&D>=n.minY&&D+c<=n.maxY;if(w<n.maxX&&w+d>n.minX&&D<n.maxY&&D+c>n.minY&&!ee){s.style.display="none";return}s.style.top=D+"px",s.style.left=w+"px",s.style.setProperty("--arrow-visibility",C||ee?"hidden":"visible"),!C&&(s.style.setProperty("--arrow",J?"var(--arrow-down)":"var(--arrow-up)"),s.style.setProperty("--shadow-direction",J?"var(--shadow-up)":"var(--shadow-down)"),s.style.setProperty("--arrow-top",(J?c-1:-m)+"px"),s.style.setProperty("--arrow-left",g-w+"px"))}var mo="rgba(128, 128, 128, 0.3)";function ho(t,e,n,o,r,i,a,s){t.save();let l=a,d=s;if(t.strokeStyle=r||mo,t.lineWidth=1,t.translate(.5,.5),i&&t.setLineDash([3,3]),n)for(let c in e.rightmostXForY)t.beginPath(),t.moveTo(l,Number(c)),t.lineTo(e.rightmostXForY[c],Number(c)),t.stroke();else for(let c in e.leftmostXForY)t.beginPath(),t.moveTo(0,Number(c)),t.lineTo(e.leftmostXForY[c],Number(c)),t.stroke();if(o)for(let c in e.bottommostYForX)t.beginPath(),t.moveTo(Number(c),d),t.lineTo(Number(c),e.topmostYForX[c]),t.stroke();else for(let c in e.topmostYForX)t.beginPath(),t.moveTo(Number(c),0),t.lineTo(Number(c),e.topmostYForX[c]),t.stroke();t.restore()}var $t=new CSSStyleSheet;$t.replaceSync(`/*
 * Copyright 2021 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

body {
  background-color: rgb(0 0 0 / 31%);
}

.controls-line {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.message-box {
  padding: 2px 4px;
  display: flex;
  align-items: center;
  cursor: default;
  overflow: hidden;
}

#paused-in-debugger {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.controls-line > * {
  background-color: rgb(255 255 194);
  border: 1px solid rgb(202 202 202);
  height: 22px;
  box-sizing: border-box;
}

.controls-line .button {
  width: 26px;
  margin-left: -1px;
  margin-right: 0;
  padding: 0;
  flex-shrink: 0;
  flex-grow: 0;
  cursor: pointer;
}

.controls-line .button .glyph {
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 75%);
  opacity: 80%;
  mask-repeat: no-repeat;
  mask-position: center;
  position: relative;
}

.controls-line .button:active .glyph {
  top: 1px;
  left: 1px;
}

#resume-button .glyph {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAKCAYAAABv7tTEAAAAAXNSR0IArs4c6QAAAFJJREFUKM+10bEJgGAMBeEPbR3BLRzEVdzEVRzELRzBVohVwEJ+iODBlQfhBeJhsmHU4C0KnFjQV6J0x1SNAhdWDJUoPTB3PvLLeaUhypM3n3sD/qc7lDrdpIEAAAAASUVORK5CYII=");
  mask-size: 13px 10px;
  background-color: rgb(66 129 235);
}

#step-over-button .glyph {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAKCAYAAAC5Sw6hAAAAAXNSR0IArs4c6QAAAOFJREFUKM+N0j8rhXEUB/DPcxW35CqhvIBrtqibkklhV8qkTHe4ZbdblcXgPVhuMdqUTUl5A2KRRCF5LGc4PT1P7qnfcr5/zu/8KdTHLFaxjHnc4RZXKI0QYxjgLQTVd42l/0wmg5iFX3iq5H6w22RS4DyRH7CB8cAXcBTGJT6xUmd0mEwuMdFQcA3fwXvGTAan8BrgPabTL9fRRyfx91PRMwyjGwcJ2EyCfsrfpPw2Pipz24NT/MZciiQYVshzOKnZ5Hturxt3k2MnCpS4SPkeHpPR8Sh3tYgttBoW9II2/AHiaEqvD2Fc0wAAAABJRU5ErkJggg==");
  mask-size: 18px 10px;
}
`);var qt=$t;var Ee=class extends L{container;constructor(e,n=[]){super(e,n),this.onKeyDown=this.onKeyDown.bind(this)}onKeyDown(e){e.key==="F8"||this.eventHasCtrlOrMeta(e)&&e.key==="\\"?this.window.InspectorOverlayHost.send("resume"):(e.key==="F10"||this.eventHasCtrlOrMeta(e)&&e.key==="'")&&this.window.InspectorOverlayHost.send("stepOver")}install(){let e=this.document.createElement("div");e.classList.add("controls-line");let n=this.document.createElement("div");n.classList.add("message-box");let o=this.document.createElement("div");o.id="paused-in-debugger",this.container=o,n.append(o),e.append(n);let r=this.document.createElement("div");r.id="resume-button",r.title="Resume script execution (F8).",r.classList.add("button");let i=this.document.createElement("div");i.classList.add("glyph"),r.append(i),e.append(r);let a=this.document.createElement("div");a.id="step-over-button",a.title="Step over next function call (F10).",a.classList.add("button");let s=this.document.createElement("div");s.classList.add("glyph"),a.append(s),e.append(a),this.document.body.append(e),this.document.addEventListener("keydown",this.onKeyDown),r.addEventListener("click",()=>this.window.InspectorOverlayHost.send("resume")),a.addEventListener("click",()=>this.window.InspectorOverlayHost.send("stepOver")),super.install()}uninstall(){this.document.body.innerHTML="",this.document.removeEventListener("keydown",this.onKeyDown),super.uninstall()}drawPausedInDebuggerMessage(e){this.container.textContent=e}};var en=new CSSStyleSheet;en.replaceSync(`/*
 * Copyright 2021 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

body {
  cursor: crosshair;
}

#zone {
  background-color: #0003;
  border: 1px solid #fffd;
  display: none;
  position: absolute;
}
`);var tn=en;var O=null,F=null,De=class extends L{zone;constructor(e,n=[]){super(e,n),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}install(){let e=this.document.documentElement;e.addEventListener("mousedown",this.onMouseDown,!0),e.addEventListener("mouseup",this.onMouseUp,!0),e.addEventListener("mousemove",this.onMouseMove,!0),e.addEventListener("keydown",this.onKeyDown,!0);let n=this.document.createElement("div");n.id="zone",this.document.body.append(n),this.zone=n,super.install()}uninstall(){this.document.body.innerHTML="";let e=this.document.documentElement;e.removeEventListener("mousedown",this.onMouseDown,!0),e.removeEventListener("mouseup",this.onMouseUp,!0),e.removeEventListener("mousemove",this.onMouseMove,!0),e.removeEventListener("keydown",this.onKeyDown,!0),super.uninstall()}onMouseDown(e){O={x:e.pageX,y:e.pageY},F=O,this.updateZone(),e.stopPropagation(),e.preventDefault()}onMouseUp(e){if(O&&F){let n=nn();n.width>=5&&n.height>=5&&this.window.InspectorOverlayHost.send(n)}on(),this.updateZone(),e.stopPropagation(),e.preventDefault()}onMouseMove(e){O&&e.buttons===1?F={x:e.pageX,y:e.pageY}:O=null,this.updateZone(),e.stopPropagation(),e.preventDefault()}onKeyDown(e){O&&e.key==="Escape"&&(on(),this.updateZone(),e.stopPropagation(),e.preventDefault())}updateZone(){let e=this.zone;if(!F||!O){e.style.display="none";return}e.style.display="block";let n=nn();e.style.left=n.x+"px",e.style.top=n.y+"px",e.style.width=n.width+"px",e.style.height=n.height+"px"}};function nn(){if(!O)throw new Error("Error calculating currentRect: no anchor was defined.");if(!F)throw new Error("Error calculating currentRect: no position was defined.");return{x:Math.min(O.x,F.x),y:Math.min(O.y,F.y),width:Math.abs(O.x-F.x),height:Math.abs(O.y-F.y)}}function on(){O=null,F=null}var rn=new CSSStyleSheet;rn.replaceSync(`/*
 * Copyright 2021 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:root {
  --border-radius: 4px;
}

.source-order-label-container {
  display: block;
  min-width: 20px;
  position: absolute;
  text-align: center;
  align-items: center;
  background-color: #fff;
  /* stylelint-disable-next-line plugin/use_monospace_font */
  font-family: Menlo, Consolas, monospace;
  font-size: 12px;
  font-weight: bold;
  padding: 2px;
  border: 1.5px solid;
}

.top-corner {
  border-bottom-right-radius: var(--border-radius);
}

.bottom-corner {
  border-top-right-radius: var(--border-radius);
}

.above-element {
  border-top-right-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
}

.below-element {
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

.above-element-wider {
  border-top-right-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.below-element-wider {
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
}

.bottom-corner-wider {
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

.bottom-corner-taller {
  border-top-right-radius: var(--border-radius);
  border-top-left-radius: var(--border-radius);
}

.bottom-corner-wider-taller {
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
`);var sn=rn;var Se=class extends L{sourceOrderContainer;reset(e){super.reset(e),this.sourceOrderContainer.textContent=""}install(){this.document.body.classList.add("fill");let e=this.document.createElement("canvas");e.id="canvas",e.classList.add("fill"),this.document.body.append(e);let n=this.document.createElement("div");n.id="source-order-container",this.document.body.append(n),this.sourceOrderContainer=n,this.setCanvas(e),super.install()}uninstall(){this.document.body.classList.remove("fill"),this.document.body.innerHTML="",super.uninstall()}drawSourceOrder(e){let n=e.sourceOrder||0,o=e.paths.slice().pop();if(!o)throw new Error("No path provided");this.context.save();let r=b(),i=o.outlineColor;return this.context.save(),fo(this.context,o.path,i,!!n,r,this.emulationScaleFactor),this.context.restore(),this.context.save(),n&&this.drawSourceOrderLabel(n,i,r),this.context.restore(),{bounds:r}}drawSourceOrderLabel(e,n,o){let r=this.sourceOrderContainer,i=r.children,a=y(r,"div","source-order-label-container");a.style.color=n,a.textContent=String(e);let s=a.offsetHeight,l=a.offsetWidth,d=go(o,s,l,i,this.canvasHeight),c=uo(d,o,s);a.classList.add(d),a.style.top=c.contentTop+"px",a.style.left=c.contentLeft+"px"}},po=300,E={topCorner:"top-corner",aboveElement:"above-element",belowElement:"below-element",aboveElementWider:"above-element-wider",belowElementWider:"below-element-wider",bottomCornerWider:"bottom-corner-wider",bottomCornerTaller:"bottom-corner-taller",bottomCornerWiderTaller:"bottom-corner-wider-taller"};function uo(t,e,n){let o=0;switch(t){case E.topCorner:o=e.minY;break;case E.aboveElement:case E.aboveElementWider:o=e.minY-n;break;case E.belowElement:case E.belowElementWider:o=e.maxY;break;case E.bottomCornerWider:case E.bottomCornerTaller:case E.bottomCornerWiderTaller:o=e.maxY-n;break}return{contentTop:o,contentLeft:e.minX}}function go(t,e,n,o,r){let i,a=t.minX+n>t.maxX,s=t.minY+e>t.maxY;if(!a&&!s||o.length>=po)return E.topCorner;let l=!1;for(let d=0;d<o.length;d++){let c=o[d],m=c.getBoundingClientRect();if(c.style.top===""&&c.style.left==="")continue;let h=t.minY-e<=m.top+m.height&&t.minY-e>=m.top,u=t.minY<=m.top+m.height&&t.minY>=m.top,p=t.minX>=m.left&&t.minX<=m.left+m.width,f=t.minX+n>=m.left&&t.minX+n<=m.left+m.width;if((p||f)&&(h||u)){l=!0;break}}return t.minY-e>0&&!l?(i=E.aboveElement,a&&(i=E.aboveElementWider)):t.maxY+e<r?(i=E.belowElement,a&&(i=E.belowElementWider)):a&&s?i=E.bottomCornerWiderTaller:a?i=E.bottomCornerWider:i=E.bottomCornerTaller,i}function fo(t,e,n,o,r,i){t.save();let a=x(e,r,i);return n&&(t.strokeStyle=n,t.lineWidth=2,o||t.setLineDash([3,3]),t.stroke(a)),t.restore(),a}var yo="rgba(0 0 0 / 0.7)",bo="rgba(255 255 255 / 0.8)";function an(t){return t%1?t.toFixed(2):String(t)}var Oe=class extends L{install(){this.document.body.classList.add("fill");let e=this.document.createElement("canvas");e.id="canvas",e.classList.add("fill"),this.document.body.append(e),this.setCanvas(e),super.install()}uninstall(){this.document.body.classList.remove("fill"),this.document.body.innerHTML="",super.uninstall()}drawViewSize(){let e=this.viewportSizeForMediaQueries||this.viewportSize,n=`${an(e.width)}px \xD7 ${an(e.height)}px`,o=this.canvasWidth||0;this.context.save(),this.context.font=`14px ${this.window.getComputedStyle(document.body).fontFamily}`;let r=this.context.measureText(n).width;this.context.fillStyle=bo,this.context.fillRect(o-r-12,0,o,25),this.context.fillStyle=yo,this.context.fillText(n,o-r-6,18),this.context.restore()}};var ln=new CSSStyleSheet;ln.replaceSync(`/*
 * Copyright 2023 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:root {
  --wco-theme-color: #121212;
  --wco-icon-color: #fff;
}

.image-group {
  display: flex;
  background-color: var(--wco-theme-color);
  align-items: center;
}

.image-group-left {
  float: left;
  justify-content: flex-start;
  gap: 4px;
  padding-left: 12px;
}

.image-group-right {
  float: right;
  justify-content: flex-end;
  gap: 2px;
  padding-right: 17px;
}

.windows-right-image-group {
  width: 238px;
  height: 33px;
}

.linux-right-image-group {
  width: 196px;
  height: 34px;
}

.mac-left-image-group {
  width: 74px;
  height: 40px;
}

.mac-right-image-group {
  width: 100px;
  height: 40px;
}

.image {
  width: 33px;
  height: 33px;
  background-color: var(--wco-icon-color);
}

#mac-chevron,
#mac-ellipsis {
  width: 40px;
  height: 40px;
  background-color: var(--wco-icon-color);
}

#close {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVBytIcchQneyiIuJUqlgEC6Wt0KqDyaUfQpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AXF2cFF2kxP8lhRYxHhz34929x907QGhUmGp2xQBVs4x0Ii7m8iti4BUBhDGEfsxKzNSTmYUsPMfXPXx8vYvyLO9zf44+pWAywCcSx5huWMTrxNObls55nzjEypJCfE48btAFiR+5Lrv8xrnksMAzQ0Y2PUccIhZLHSx3MCsbKvEUcURRNcoXci4rnLc4q5Uaa92TvzBY0JYzXKc5ggQWkUQKImTUsIEKLERp1Ugxkab9uIc/7PhT5JLJtQFGjnlUoUJy/OB/8Ltbszg54SYF40D3i21/jAKBXaBZt+3vY9tungD+Z+BKa/urDWDmk/R6W4scAQPbwMV1W5P3gMsdYPhJlwzJkfw0hWIReD+jb8oDg7dA76rbW2sfpw9AlrpaugEODoGxEmWveby7p7O3f8+0+vsB9f9y2zZ6P+8AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBxsWBAcQDgJxAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAPlJREFUWMPtlTFOxDAQRd8k5gYb+i1W6Si4/ym22wpatJHogWQo+JaMlAjZgS3QPClSIk/s55mxDEEQBME3rPYHdzcgAbOZLRsxnWLezcxr5u8aNpGAR2Bw935FpgfuFZNqJ28RmoFnYAQOpZTeB409KbZ6t3U1NlvcfVK5R4lMGs4yF2DaKumvCklqdverPkdl2oCTZK5mNt+kqTf65UFznYGXVpnWHlrblAGuZxdpZ3YGleksmdPXkDeXLO2UyQ2c+2kpGr1JKjXIdMChlMkLF6dtLDK1/HWGeuC4dpp0+rLUEXgF3m5xddwBHz9cHb1inCAIguAf8QkteHDWohPAIAAAAABJRU5ErkJggg==");
}

#maximize {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVBytIcchQneyiIuJUqlgEC6Wt0KqDyaUfQpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AXF2cFF2kxP8lhRYxHhz34929x907QGhUmGp2xQBVs4x0Ii7m8iti4BUBhDGEfsxKzNSTmYUsPMfXPXx8vYvyLO9zf44+pWAywCcSx5huWMTrxNObls55nzjEypJCfE48btAFiR+5Lrv8xrnksMAzQ0Y2PUccIhZLHSx3MCsbKvEUcURRNcoXci4rnLc4q5Uaa92TvzBY0JYzXKc5ggQWkUQKImTUsIEKLERp1Ugxkab9uIc/7PhT5JLJtQFGjnlUoUJy/OB/8Ltbszg54SYF40D3i21/jAKBXaBZt+3vY9tungD+Z+BKa/urDWDmk/R6W4scAQPbwMV1W5P3gMsdYPhJlwzJkfw0hWIReD+jb8oDg7dA76rbW2sfpw9AlrpaugEODoGxEmWveby7p7O3f8+0+vsB9f9y2zZ6P+8AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBxsWBACOapfSAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAGJJREFUWMPt07sNgDAMhOEzQhkHxqHK0GEcmp8NiGTJQHFf64culiKZmdm/RWYI2CVtk7YzIsYrrwA60B7qDeiZ3Uv6tBFXplYWqIoDOdBngWbfPrt3Tc4NSQcw6zEzM6t2A1K/HsQFSWEQAAAAAElFTkSuQmCC");
}

#minimize {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVBytIcchQneyiIuJUqlgEC6Wt0KqDyaUfQpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AXF2cFF2kxP8lhRYxHhz34929x907QGhUmGp2xQBVs4x0Ii7m8iti4BUBhDGEfsxKzNSTmYUsPMfXPXx8vYvyLO9zf44+pWAywCcSx5huWMTrxNObls55nzjEypJCfE48btAFiR+5Lrv8xrnksMAzQ0Y2PUccIhZLHSx3MCsbKvEUcURRNcoXci4rnLc4q5Uaa92TvzBY0JYzXKc5ggQWkUQKImTUsIEKLERp1Ugxkab9uIc/7PhT5JLJtQFGjnlUoUJy/OB/8Ltbszg54SYF40D3i21/jAKBXaBZt+3vY9tungD+Z+BKa/urDWDmk/R6W4scAQPbwMV1W5P3gMsdYPhJlwzJkfw0hWIReD+jb8oDg7dA76rbW2sfpw9AlrpaugEODoGxEmWveby7p7O3f8+0+vsB9f9y2zZ6P+8AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBxsWAzIJ/FCVAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAADNJREFUWMPt0LERACEMA0E5/+ZolO4+NiUwEDK78SlRAgC8rW5G3T2SfJvsr6rpYgCAMwvylgUCKbPyMgAAAABJRU5ErkJggg==");
}

#mac-ellipsis,
#ellipsis {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVBytIcchQneyiIuJUqlgEC6Wt0KqDyaUfQpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AXF2cFF2kxP8lhRYxHhz34929x907QGhUmGp2xQBVs4x0Ii7m8iti4BUBhDGEfsxKzNSTmYUsPMfXPXx8vYvyLO9zf44+pWAywCcSx5huWMTrxNObls55nzjEypJCfE48btAFiR+5Lrv8xrnksMAzQ0Y2PUccIhZLHSx3MCsbKvEUcURRNcoXci4rnLc4q5Uaa92TvzBY0JYzXKc5ggQWkUQKImTUsIEKLERp1Ugxkab9uIc/7PhT5JLJtQFGjnlUoUJy/OB/8Ltbszg54SYF40D3i21/jAKBXaBZt+3vY9tungD+Z+BKa/urDWDmk/R6W4scAQPbwMV1W5P3gMsdYPhJlwzJkfw0hWIReD+jb8oDg7dA76rbW2sfpw9AlrpaugEODoGxEmWveby7p7O3f8+0+vsB9f9y2zZ6P+8AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBxsTEiHYUPCwAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAEBJREFUWMPt0aENACAQBMENEnqj/24OjwISAmJHrrrPgyRJeitJS9JO2oqyOwboQE9Sd9qVQb++rM5XrzZJkiQY1Fw4YEmaUfMAAAAASUVORK5CYII=");
}

#mac-chevron,
#chevron {
  mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSJVBytIcchQneyiIuJUqlgEC6Wt0KqDyaUfQpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AXF2cFF2kxP8lhRYxHhz34929x907QGhUmGp2xQBVs4x0Ii7m8iti4BUBhDGEfsxKzNSTmYUsPMfXPXx8vYvyLO9zf44+pWAywCcSx5huWMTrxNObls55nzjEypJCfE48btAFiR+5Lrv8xrnksMAzQ0Y2PUccIhZLHSx3MCsbKvEUcURRNcoXci4rnLc4q5Uaa92TvzBY0JYzXKc5ggQWkUQKImTUsIEKLERp1Ugxkab9uIc/7PhT5JLJtQFGjnlUoUJy/OB/8Ltbszg54SYF40D3i21/jAKBXaBZt+3vY9tungD+Z+BKa/urDWDmk/R6W4scAQPbwMV1W5P3gMsdYPhJlwzJkfw0hWIReD+jb8oDg7dA76rbW2sfpw9AlrpaugEODoGxEmWveby7p7O3f8+0+vsB9f9y2zZ6P+8AAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBxsTEjCy4NBCAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKBJREFUWMPtk7sKAkEMRU/WRrtFv0hZ9J9VXD9psdFCiM0IFruYeZT3VDMh4R4yDAghhBBZWLTR3U9AB4xm9grOrIED8Dazc2Smy5BfATtgSEERmQHYpllaC92ACeiBo7tvAjI98ADuzZ9sIehiZs/cnmZC/wJrZYqEloIBr5UpFpqRmlL5e75Gf2IzoRkpajbTROhHap+uY+lmhBBCiEI+sBxN3vpZhO0AAAAASUVORK5CYII=");
}

#mac-close,
#mac-minimize,
#mac-maximize {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

#mac-close {
  background-color: #ff5f57;
}

#mac-minimize {
  background-color: #ffbd2e;
}

#mac-maximize {
  background-color: #28c941;
}
`);var dn=ln;var Ge=class extends L{windowsToolBar;linuxToolBar;macToolbarRight;macToolbarLeft;constructor(e,n=[]){super(e,n)}install(){let e=["chevron","ellipsis","minimize","maximize","close"],n=["mac-close","mac-minimize","mac-maximize"],o=["mac-chevron","mac-ellipsis"];this.windowsToolBar=Be("windows","right",e),this.linuxToolBar=Be("linux","right",e),this.macToolbarRight=Be("mac","right",o),this.macToolbarLeft=Be("mac","left",n),this.document.body.append(this.windowsToolBar,this.linuxToolBar,this.macToolbarLeft,this.macToolbarRight),super.install()}uninstall(){this.windowsToolBar.remove(),this.linuxToolBar.remove(),this.macToolbarRight.remove(),this.macToolbarLeft.remove(),super.uninstall()}drawWindowControlsOverlay(e){this.clearOverlays(),e.selectedPlatform==="Windows"?Ie(this.windowsToolBar):e.selectedPlatform==="Linux"?Ie(this.linuxToolBar):e.selectedPlatform==="Mac"&&(Ie(this.macToolbarLeft),Ie(this.macToolbarRight)),this.document.documentElement.style.setProperty("--wco-theme-color",e.themeColor),this.document.documentElement.style.setProperty("--wco-icon-color",fe(e.themeColor))}clearOverlays(){He(this.linuxToolBar),He(this.windowsToolBar),He(this.macToolbarLeft),He(this.macToolbarRight)}};function He(t){t.classList.add("hidden")}function Ie(t){t.classList.remove("hidden")}function vo(t){let e=K("div");for(let n of t){let o=K("div");o.id=n,o.classList.add("image"),e.append(o)}return e}function Be(t,e,n){let o=vo(n);return o.classList.add("image-group"),o.classList.add(`image-group-${e}`),o.classList.add(`${t}-${e}-image-group`),o.classList.add("hidden"),o}ze(Qe);var Ue=new CSSStyleSheet;Ue.replaceSync(Mt);var wo=new Me(window,[It,Ue]),mn=new q(window,[Ot,Xe,Ue]),xo=new Ee(window,qt),To=new De(window,tn),hn=new ve(window,Xe),Ao=new Se(window,sn),Co=new Oe(window),Lo=new Ge(window,[dn]);mn.setGreenDevAnchorsOverlay(hn);var Po={greenDevFloaty:hn,highlight:wo,persistent:mn,paused:xo,screenshot:To,sourceOrder:Ao,viewportSize:Co,windowControlsOverlay:Lo},U,cn,Mo=t=>{let e=t[0];if(e==="setOverlay"){let n=t[1];U&&U.uninstall(),U=Po[n],U.setPlatform(cn),U.installed||U.install()}else e==="setPlatform"?cn=t[1]:e==="drawingFinished"||U.dispatch(t)};window.dispatch=Mo;})();
