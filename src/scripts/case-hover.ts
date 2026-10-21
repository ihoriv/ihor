/**
 * Work: on hover the project image smears toward the cursor with a slight RGB split (WebGL).
 * The canvas is created lazily on first hover, so nothing runs until it is needed.
 */
const VERT = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
const FRAG = `precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 uM;uniform vec2 uV;uniform vec4 uC;uniform float uA;
vec3 sm(vec2 uv){return texture2D(t,uC.zw+clamp(uv,0.,1.)*uC.xy).rgb;}
void main(){vec2 d=v-uM;d.x*=uA;float f=exp(-dot(d,d)/.09);vec2 o=uV*f;vec3 c=vec3(0.);
for(int i=0;i<16;i++){float k=float(i)/15.;c.r+=sm(v-o*k*1.08).r;c.g+=sm(v-o*k).g;c.b+=sm(v-o*k*.92).b;}
gl_FragColor=vec4(c/16.,1.);}`;

interface State {
  cv: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  uM: WebGLUniformLocation | null;
  uV: WebGLUniformLocation | null;
  uC: WebGLUniformLocation | null;
  uA: WebGLUniformLocation | null;
  mx: number; my: number; lx: number | null; ly: number | null; vx: number; vy: number;
  raf: number; inside: boolean;
}

export function initCaseHover() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll<HTMLElement>('.case-m').forEach((m) => {
    const img = m.querySelector('img');
    if (!img) return;
    let S: State | null = null;
    let broken = false;

    const setup = (): State | null => {
      if (S || broken) return S;
      const cv = document.createElement('canvas');
      cv.setAttribute('aria-hidden', 'true');
      m.insertBefore(cv, img.nextSibling);
      const gl = cv.getContext('webgl', { alpha: false, antialias: false });
      if (!gl) { broken = true; return null; }
      const sh = (ty: number, src: string) => {
        const o = gl.createShader(ty)!;
        gl.shaderSource(o, src);
        gl.compileShader(o);
        return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
      };
      const a = sh(gl.VERTEX_SHADER, VERT), b = sh(gl.FRAGMENT_SHADER, FRAG);
      if (!a || !b) { broken = true; return null; }
      const pr = gl.createProgram()!;
      gl.attachShader(pr, a);
      gl.attachShader(pr, b);
      gl.linkProgram(pr);
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const l = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      } catch {
        broken = true;
        return null;
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const U = (n: string) => gl.getUniformLocation(pr, n);
      S = { cv, gl, uM: U('uM'), uV: U('uV'), uC: U('uC'), uA: U('uA'), mx: 0.5, my: 0.5, lx: null, ly: null, vx: 0, vy: 0, raf: 0, inside: false };
      return S;
    };

    const draw = (s: State) => {
      const g = s.gl, w = s.cv.clientWidth, h = s.cv.clientHeight, dpr = Math.min(1.5, window.devicePixelRatio || 1);
      if (s.cv.width !== Math.round(w * dpr) || s.cv.height !== Math.round(h * dpr)) {
        s.cv.width = Math.round(w * dpr);
        s.cv.height = Math.round(h * dpr);
      }
      g.viewport(0, 0, s.cv.width, s.cv.height);
      const r = img.naturalWidth / img.naturalHeight, A = w / h;
      let c = [1, 1, 0, 0];
      if (r > A) { const sx = A / r; c = [sx, 1, (1 - sx) / 2, 0]; } else { const sy = r / A; c = [1, sy, 0, (1 - sy) / 2]; }
      g.uniform4f(s.uC, c[0], c[1], c[2], c[3]);
      g.uniform1f(s.uA, A);
      g.uniform2f(s.uM, s.mx, 1 - s.my);
      const L = Math.hypot(s.vx, s.vy), k = L > 0.014 ? 0.014 / L : 1;
      g.uniform2f(s.uV, s.vx * k, -s.vy * k);
      g.drawArrays(g.TRIANGLES, 0, 6);
    };
    const loop = () => {
      const s = S!;
      s.vx *= 0.9;
      s.vy *= 0.9;
      draw(s);
      if (s.inside || Math.hypot(s.vx, s.vy) > 0.0005) s.raf = requestAnimationFrame(loop);
      else { s.raf = 0; s.cv.classList.remove('on'); }
    };
    const kick = () => { if (S && !S.raf) S.raf = requestAnimationFrame(loop); };

    const move = (e: PointerEvent) => {
      if (!img.complete || !img.naturalWidth) return;
      const s = setup();
      if (!s) return;
      const r = m.getBoundingClientRect();
      const ux = (e.clientX - r.left) / r.width, uy = (e.clientY - r.top) / r.height;
      if (s.lx !== null && s.ly !== null) { s.vx += (ux - s.lx) * 0.2; s.vy += (uy - s.ly) * 0.2; }
      s.lx = ux; s.ly = uy; s.mx = ux; s.my = uy; s.inside = true;
      s.cv.classList.add('on');
      kick();
    };
    m.addEventListener('pointerenter', move);
    m.addEventListener('pointermove', move);
    m.addEventListener('pointerleave', () => { if (S) { S.inside = false; S.lx = null; kick(); } });
  });
}
