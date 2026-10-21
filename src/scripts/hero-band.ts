/**
 * Hero: the curved band of project cards, drawn with WebGL.
 * The band drifts on its own, reacts to scroll direction and can be dragged.
 * Until every texture has loaded (or if WebGL is missing) the CSS fallback ring stays visible.
 *
 * Page-load intro: the cards start as one stack in the centre and fan out along the band
 * to their slots. Once they are mostly out, the `intro` class comes off <html> and the
 * header and hero copy play their own entrance animations.
 */
const VERT = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FRAG = `precision highp float;
varying vec2 v;
uniform vec2 uRes;uniform float uF;uniform float uD;uniform float uN;uniform float uU;uniform float uT;uniform float uI;
uniform sampler2D t0;uniform sampler2D t1;uniform sampler2D t2;uniform sampler2D t3;uniform sampler2D t4;uniform sampler2D t5;uniform sampler2D t6;uniform sampler2D t7;
uniform vec4 c0;uniform vec4 c1;uniform vec4 c2;uniform vec4 c3;uniform vec4 c4;uniform vec4 c5;uniform vec4 c6;uniform vec4 c7;
vec4 tx(float k,vec2 uv){
if(k<.5)return texture2D(t0,c0.zw+uv*c0.xy);
if(k<1.5)return texture2D(t1,c1.zw+uv*c1.xy);
if(k<2.5)return texture2D(t2,c2.zw+uv*c2.xy);
if(k<3.5)return texture2D(t3,c3.zw+uv*c3.xy);
if(k<4.5)return texture2D(t4,c4.zw+uv*c4.xy);
if(k<5.5)return texture2D(t5,c5.zw+uv*c5.xy);
if(k<6.5)return texture2D(t6,c6.zw+uv*c6.xy);
return texture2D(t7,c7.zw+uv*c7.xy);}
vec4 card(float w0,float Y){
float w=mod(w0-uT+5.,80.);
float k=floor(w/10.);float lo=mod(w,10.)-5.;
float hw=4.72;
float vy=.5+Y/(34.5*uU);
if(abs(lo)>hw||vy<0.||vy>1.)return vec4(0.);
vec2 uv=vec2(.5-lo/(2.*hw),vy);
return vec4(tx(k,uv).rgb,1.);}
float wr(float x){return mod(x+40.,80.)-40.;}
vec4 cardIntro(float w0,float Y){
float a=smoothstep(0.,.45,uI);
float sg=1.-pow(1.-clamp(uI/1.5,0.,1.),3.);
float best=99.;float bk=0.;vec2 buv=vec2(0.);
for(int i=0;i<8;i++){
float fk=float(i);
float ck=wr(uT+fk*10.);
float q=clamp((uI-.3-abs(ck)*.012)/1.25,0.,1.);
float e=1.-pow(1.-q,4.);
float sc=mix(.42,1.,sg);
float hw=4.72*sc;
float lo=w0-ck*e;
float vy=.5+Y/(34.5*uU*sc);
if(abs(lo)<=hw&&vy>=0.&&vy<=1.&&abs(ck)<best){best=abs(ck);bk=fk;buv=vec2(.5-lo/(2.*hw),vy);}
}
if(best>98.)return vec4(0.);
return vec4(tx(bk,buv).rgb,1.)*a;}
vec4 band(float w0,float Y){return uI<2.?cardIntro(w0,Y):card(w0,Y);}
void main(){
vec2 px=(v-.5)*uRes;
float ax=abs(px.x)/(uRes.x*.5);
float e=smoothstep(.86,1.,ax);
float f=uF*uU;
float R=uN*55.704*uU;float d=uD*R;
float th=atan(px.x,f);
float c=cos(th),s=sin(th);
float t=d*c+sqrt(R*R-d*d*s*s);
float hx=t*s,hz=t*c-d;
float ph=atan(hx,hz);
float dep=t*c;
float te=d*cos(atan(uRes.x*.5,f))+sqrt(R*R-d*d*pow(sin(atan(uRes.x*.5,f)),2.));float de=te*cos(atan(uRes.x*.5,f));
float kf=max(1.,(34.5*uU*f/de)/(uRes.y*.99));
float Y=px.y*dep/f*kf;
float w0=-ph*R/(5.*uU);
float sp=e*e*.46;
float ca=e*e*.15;
vec4 acc=vec4(0.);
for(int i=0;i<9;i++){
float o=(float(i)/8.-.5)*sp;
vec4 r=band(w0+o+ca,Y);vec4 g=band(w0+o,Y);vec4 b=band(w0+o-ca,Y);
acc+=vec4(r.r,g.g,b.b,(r.a+g.a+b.a)/3.);}
acc/=9.;
gl_FragColor=acc;}`;

/** Loop length in "slots": 8 works x 10 units each. */
const LOOP = 80;
const CARD_ASPECT = 1.333;
/** Intro clock (s) at which the header and hero copy are released. */
const INTRO_RELEASE = 0.95;
/** Intro clock (s) after which the shader switches back to the plain band. */
const INTRO_END = 2;

/** Lets the header and hero copy play their entrance animations. */
function releaseIntro() {
  document.documentElement.classList.remove('intro');
}

export function initHeroBand() {
  const scene = document.querySelector<HTMLElement>('.hero .scene');
  const cv = scene?.querySelector<HTMLCanvasElement>('.glc');
  const probe = scene?.querySelector<HTMLElement>('.probe');
  // Never hold the copy back for long, even if a texture is slow or the band can't run.
  const safety = window.setTimeout(releaseIntro, 2500);
  const bail = () => {
    window.clearTimeout(safety);
    releaseIntro();
  };
  if (!scene || !cv) return bail();
  const srcs = (scene.dataset.textures || '').split('|').filter(Boolean);
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl || !srcs.length) return bail();

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return bail();
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return bail();
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uF = U('uF'), uD = U('uD'), uN = U('uN'), uU = U('uU'), uT = U('uT'), uI = U('uI');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loaded = 0;
  let failed = false;
  /** null: waiting for textures, -1: start on the next frame, otherwise the start timestamp. */
  let introStart: number | null = null;
  let intro = reduce ? INTRO_END : 0;
  if (reduce) bail();
  srcs.forEach((src, i) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U('t' + i), i);
    gl.uniform4f(U('c' + i), 1, 1, 0, 0);
    const img = new Image();
    img.onload = () => {
      try {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        const r = img.naturalWidth / img.naturalHeight;
        if (r > CARD_ASPECT) {
          const sx = CARD_ASPECT / r;
          gl.uniform4f(U('c' + i), sx, 1, (1 - sx) / 2, 0);
        } else {
          const sy = r / CARD_ASPECT;
          gl.uniform4f(U('c' + i), 1, sy, 0, (1 - sy) / 2);
        }
        loaded++;
        if (loaded === srcs.length && !failed) {
          scene.dataset.gl = '';
          introStart = -1;
        }
      } catch {
        failed = true;
        bail();
      }
    };
    img.onerror = () => {
      failed = true;
      bail();
    };
    img.src = src;
  });
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  scene.style.cursor = 'grab';
  scene.style.touchAction = 'pan-y';

  let t = 0, last = 0, dir = 1, vel = reduce ? 1 : 0, lastY = window.scrollY || 0;
  let drag: { x: number; t: number; v: number } | null = null;
  const unit = () => (probe && probe.offsetWidth ? probe.offsetWidth / 48 : cv.clientWidth / 100);
  const wrap = (x: number) => ((x % LOOP) + LOOP) % LOOP;

  window.addEventListener('scroll', () => {
    const y = window.scrollY || 0, d = y - lastY;
    lastY = y;
    if (Math.abs(d) < 1) return;
    dir = d > 0 ? -1 : 1;
    vel += dir * Math.min(6, Math.abs(d) * 0.04);
  }, { passive: true });

  scene.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, t: performance.now(), v: 0 };
    scene.style.cursor = 'grabbing';
    try { scene.setPointerCapture(e.pointerId); } catch {}
  });
  scene.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now();
    const dts = Math.max(0.008, (now - drag.t) / 1000);
    const ds = -(e.clientX - drag.x) / (2 * unit());
    t = wrap(t + ds);
    drag.v = drag.v * 0.6 + (ds / dts) * 0.4;
    drag.x = e.clientX;
    drag.t = now;
  });
  const release = () => {
    if (!drag) return;
    if (performance.now() - drag.t > 120) drag.v = 0;
    vel = Math.max(-40, Math.min(40, drag.v));
    drag = null;
    scene.style.cursor = 'grab';
  };
  scene.addEventListener('pointerup', release);
  scene.addEventListener('pointercancel', release);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(scene);

  const frame = (now: number) => {
    requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (introStart === -1) introStart = now;
    if (introStart !== null && intro < INTRO_END) {
      intro = Math.min(INTRO_END, (now - introStart) / 1000);
      if (intro >= INTRO_RELEASE) bail();
    }
    // The band holds still while the cards fan out, then eases into its drift.
    if (!drag && !reduce && intro > 1.1) {
      vel += (dir - vel) * Math.min(1, dt * 2.2);
      t = wrap(t + vel * dt);
    }
    if (!visible) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uF, 48);
    gl.uniform1f(uD, 0.58);
    gl.uniform1f(uN, 1.05);
    gl.uniform1f(uU, unit());
    gl.uniform1f(uT, t);
    gl.uniform1f(uI, intro);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  requestAnimationFrame(frame);
}
