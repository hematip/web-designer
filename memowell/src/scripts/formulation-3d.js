// Formulation signature scene (v3), real-time 3D. White-first branch: matte, calm, daylight (Kondor Brain review).
// Story, scrubbed by the pinned scroll range (state.p 0 → 1):
//   01 a tear of Boswellia resin, lit like a studio product shot
//   02 the resin disintegrates into micronized dust that spins into a vortex
//   03 the dust snaps into a rotating microcrystalline lattice (crystals + unit-cell lines)
//   04 the lattice condenses into a capsule-shaped cloud; the two capsule halves slide shut around it
//   05 the closed cream capsule turns in the light (hero frame)
// Everything is procedural (no external models). Copy stays in HTML; this canvas is decorative.
// One clock: frames are drawn from the GSAP ticker that already drives Lenis.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { gsap } from './motion.js';

// ---------------------------------------------------------------- helpers
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const smooth = (x) => x * x * (3 - 2 * x);
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
const inOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const bump = (p, a, b) => { const t = seg(p, a, b); return Math.sin(t * Math.PI); };
const lerp = THREE.MathUtils.lerp;

// Simplex 3D noise: Ian McEwan, Stefan Gustavson (Ashima Arts), MIT licence, github.com/ashima/webgl-noise
const NOISE_GLSL = /* glsl */ `
vec3 fm289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 fm289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 fperm(vec4 x){return fm289(((x*34.0)+10.0)*x);}
vec4 ftis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float fsnoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=fm289(i);
  vec4 p=fperm(fperm(fperm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=ftis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
// Where the resin surface gives way first (bottom → top, broken up by noise). Shared by the
// resin's dissolve and the particles' birth so every grain leaves exactly where the surface opens.
float dissolveField(vec3 p){ return clamp(0.5 + fsnoise(p*1.7)*0.30 + p.y*0.17, 0.0, 1.0); }
`;

// ---------------------------------------------------------------- geometry
function resinGeometry(noise) {
  let g = new THREE.IcosahedronGeometry(1, 40);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const theta = Math.acos(THREE.MathUtils.clamp(v.y, -1, 1)); // 0 = tip, PI = base
    const phi = Math.atan2(v.z, v.x);
    const r = Math.sin(theta) * Math.pow(Math.sin(theta / 2), 1.05) * 1.1;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    const y = Math.cos(theta) * 1.3 - 0.1;
    // Organic, lumpy surface of a natural resin tear.
    const n = noise.noise3d(x * 1.3, y * 1.3, z * 1.3) * 0.08 + noise.noise3d(x * 3.4 + 7, y * 3.4, z * 3.4) * 0.025;
    pos.setXYZ(i, x + v.x * n, y + v.y * n * 0.6, z + v.z * n);
  }
  g.computeVertexNormals();
  return g;
}

// Two-piece capsule, built along +X. Cream body and cap, same colour as the approved product photo.
const CAP = { rBody: 0.5, rCap: 0.52, bodyTip: -1.45, bodyOpen: 0.45, capOpen: -0.05, capTip: 1.45 };
function halfProfile({ r, tipY, openY, dir, rim }) {
  // Lathe profile (x = radius, y = axis) from the dome tip to the open end.
  const pts = [];
  const domeBase = tipY - dir * r; // where the dome meets the cylinder
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.sin(a) * r, domeBase + dir * Math.cos(a) * r));
  }
  pts.push(new THREE.Vector2(r, openY));
  if (rim) pts.push(new THREE.Vector2(r - 0.018, openY));
  if (dir > 0) pts.reverse(); // keep the lathe profile running bottom → top for consistent normals
  return pts;
}
function capsuleHalf(kind) {
  const isCap = kind === 'cap';
  const pts = isCap
    ? halfProfile({ r: CAP.rCap, tipY: CAP.capTip, openY: CAP.capOpen, dir: 1, rim: true })
    : halfProfile({ r: CAP.rBody, tipY: CAP.bodyTip, openY: CAP.bodyOpen, dir: -1, rim: false });
  const g = new THREE.LatheGeometry(pts, 96);
  g.rotateZ(-Math.PI / 2); // lathe axis Y → capsule axis X
  return g;
}
function insideCapsule(x, y, z, margin) {
  const r = CAP.rBody * margin;
  const half = (CAP.capTip - CAP.rBody) * margin; // straight section half-length
  const cx = Math.max(-half, Math.min(half, x));
  return (x - cx) ** 2 + y * y + z * z <= r * r;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grd.addColorStop(0.6, 'rgba(255,255,255,0.08)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------- particle shaders
const PARTICLE_VERT = /* glsl */ `
${NOISE_GLSL}
attribute vec3 aStart;   // point on the resin surface (resin object space)
attribute vec4 aBurst;   // vortex: radius, angle, height, angular speed
attribute vec3 aLattice; // lattice node (lattice group space)
attribute vec3 aCap;     // point inside the capsule (capsule space)
attribute vec4 aRand;    // size, colour, phase, stagger
uniform float uTime, uDissolve, uBurst, uLattice, uCapsule, uFade;
uniform mat4 uResinMat, uLatMat, uCapMat;
uniform float uSize, uProjScale, uFocus, uAperture;
uniform vec3 uAmber, uGold, uIce, uCream;
varying vec3 vColor; varying float vAlpha; varying float vBlur;
float ioc(float x){ return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) / 2.0; }
void main(){
  float n = dissolveField(aStart);
  float th = uDissolve * 1.08;
  float born = smoothstep(n - 0.015, n + 0.03, th);
  vec3 start = (uResinMat * vec4(aStart, 1.0)).xyz;

  // 02 micronized: grains lift off as the surface opens, then join one slow vortex
  float tb = max(smoothstep(0.0, 0.55, th - n), uBurst);
  tb = 1.0 - pow(1.0 - tb, 3.0);
  float ang = aBurst.y + uTime * 0.12 * aBurst.w + uBurst * 1.2 / (0.5 + aBurst.x * 0.35);
  vec3 vortex = vec3(cos(ang) * aBurst.x, aBurst.z + sin(uTime * 0.7 + aRand.z * 6.2831) * 0.06, sin(ang) * aBurst.x);
  vec3 pos = mix(start, vortex, tb);
  pos += normalize(start + vec3(0.0001)) * sin(tb * 3.14159) * 0.14 * aRand.w;

  // 03 microcrystalline: ordered lattice (staggered arrival)
  float tl = ioc(smoothstep(aRand.w * 0.35, aRand.w * 0.35 + 0.65, uLattice));
  pos = mix(pos, (uLatMat * vec4(aLattice, 1.0)).xyz, tl);

  // 04 K-Vie: condense into the capsule volume
  float tc = ioc(smoothstep(aRand.z * 0.3, aRand.z * 0.3 + 0.7, uCapsule));
  pos = mix(pos, (uCapMat * vec4(aCap, 1.0)).xyz, tc);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = max(-mv.z, 0.1);
  float blur = clamp(abs(dist - uFocus) * uAperture, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(uSize * aRand.x * (1.0 - 0.35 * tl) * (1.0 - 0.3 * tc) * (1.0 + blur * 2.6) * uProjScale / dist, 64.0);

  vec3 col = mix(uAmber, uGold, aRand.y);
  col = mix(col, uIce, tl * 0.85);
  col = mix(col, uCream, tc);
  vColor = col; // matte grains: no sparkle (no "glowing particles as science")
  vAlpha = born * 0.78 * (1.0 - blur * 0.72) * (1.0 - 0.25 * tl) * (1.0 - 0.45 * tc) * (1.0 - uFade);
  vBlur = blur;
}`;

const BOKEH_VERT = /* glsl */ `
attribute vec4 aRand;
uniform float uTime, uProjScale, uOpacity;
uniform vec3 uA, uB, uC;
varying vec3 vColor; varying float vAlpha; varying float vBlur;
void main(){
  vec3 pos = position;
  pos.y += sin(uTime * 0.15 + aRand.z * 6.2831) * 0.35;
  pos.x += cos(uTime * 0.11 + aRand.z * 4.0) * 0.25;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min((0.22 + aRand.x * 0.5) * uProjScale / dist, 90.0);
  vColor = aRand.y < 0.45 ? uA : (aRand.y < 0.8 ? uB : uC);
  vAlpha = (0.10 + aRand.w * 0.22) * uOpacity;
  vBlur = 1.0;
}`;

const SOFT_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha; varying float vBlur;
void main(){
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float soft = mix(0.35, 0.95, vBlur);
  float a = (1.0 - smoothstep(1.0 - soft, 1.0, r)) * vAlpha;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vColor, a);
  #include <colorspace_fragment>
}`;

// ---------------------------------------------------------------- scene
export function createFormulationScene({ section, canvas, frame, state, mode: initialMode, onReady, onFail }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    onFail?.(e);
    return null;
  }
  const small = window.matchMedia('(max-width: 56.24rem)').matches;
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.6;
  room.dispose();
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  // Lights: warm key, brand-blue rim, soft fill, and a glint that sweeps the closed capsule.
  const key = new THREE.DirectionalLight(0xffe0b5, 2.2); key.position.set(3.5, 4.5, 5);
  const rim = new THREE.DirectionalLight(0x6d82ff, 3.2); rim.position.set(-4.5, 2.5, -4);
  const fill = new THREE.HemisphereLight(0xaab8ff, 0x140c2e, 0.35);
  const glint = new THREE.DirectionalLight(0xffffff, 0); glint.position.set(-3, 2, 4);
  scene.add(key, rim, fill, glint);

  const noise = new SimplexNoise();
  const shared = { uTime: { value: 0 } };

  // ---- 01 resin tear
  const resinGeo = resinGeometry(noise);
  const resinMat = new THREE.MeshPhysicalMaterial({
    // White-first / Kondor Brain: a matte, natural resin — no emissive glow, no glossy "product shot" sheen.
    color: 0xb9762a, roughness: 0.68, metalness: 0, clearcoat: 0.12, clearcoatRoughness: 0.6,
    sheen: 0.15, sheenColor: new THREE.Color(0xe0b07a), sheenRoughness: 0.8, envMapIntensity: 0.8,
  });
  const resinU = { uDissolve: { value: 0 }, uEdge: { value: new THREE.Color(0x8a5a22).multiplyScalar(0.25) }, uGlow: { value: new THREE.Color(0x000000) } };
  resinMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, resinU);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vObjPos;\nuniform float uDissolve;\nuniform vec3 uEdge, uGlow;\n${NOISE_GLSL}`)
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
        float dField = dissolveField(vObjPos);
        float dTh = uDissolve * 1.08;
        if (dField < dTh) discard;
        float dEdge = (1.0 - smoothstep(dTh, dTh + 0.07, dField)) * step(0.001, uDissolve);`)
      .replace('#include <opaque_fragment>', `
        outgoingLight += uGlow * pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.2);
        outgoingLight += uEdge * dEdge;
        #include <opaque_fragment>`);
  };
  resinMat.customProgramCacheKey = () => 'memowell-resin';
  const resinRoot = new THREE.Group();
  const resin = new THREE.Mesh(resinGeo, resinMat);
  resinRoot.add(resin);
  scene.add(resinRoot);

  // Warm/cool light bloom behind the subject (cheap stand-in for a bloom pass on a transparent canvas).
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), color: 0xffb04a, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(6);
  glow.position.set(0, 0, -1.2);
  glow.renderOrder = -2;
  glow.visible = false; // additive bloom has no place on a white field
  scene.add(glow);

  // ---- 03 lattice group (crystals + unit-cell lines); particles read its matrix
  const lattice = new THREE.Group();
  scene.add(lattice);
  const L_SIZE = 2.6;
  const M = 4; // crystals per side
  const crystalGeo = new THREE.OctahedronGeometry(0.075, 0);
  crystalGeo.scale(1, 1.7, 1);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xc4cbe6, roughness: 0.42, metalness: 0, clearcoat: 0.25, flatShading: true,
    transparent: true, opacity: 0.9, envMapIntensity: 1.0,
  });
  const crystals = new THREE.InstancedMesh(crystalGeo, crystalMat, M * M * M);
  const crystalData = [];
  for (let i = 0; i < M ** 3; i++) {
    const ix = i % M, iy = Math.floor(i / M) % M, iz = Math.floor(i / (M * M));
    const p = new THREE.Vector3(ix, iy, iz).subScalar((M - 1) / 2).multiplyScalar(L_SIZE / (M - 1));
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3));
    crystalData.push({ p, q, d: p.length() / (L_SIZE * 0.87) });
  }
  lattice.add(crystals);
  const linePos = [];
  const step = L_SIZE / (M - 1), h = L_SIZE / 2;
  for (let a = 0; a < M; a++) for (let b = 0; b < M; b++) {
    const u = -h + a * step, w = -h + b * step;
    linePos.push(-h, u, w, h, u, w); // along x
    linePos.push(u, -h, w, u, h, w); // along y
    linePos.push(u, w, -h, u, w, h); // along z
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5866b8, transparent: true, opacity: 0, depthWrite: false });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  lattice.add(lines);

  // ---- 04/05 capsule
  const capRoot = new THREE.Group();
  const capIdle = new THREE.Group();
  capRoot.add(capIdle);
  scene.add(capRoot);
  const capsuleMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6b88e, roughness: 0.42, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.16,
    sheen: 0.25, sheenColor: new THREE.Color(0xffe3c4), sheenRoughness: 0.6, envMapIntensity: 0.55,
    side: THREE.DoubleSide, // the open ends show while the halves fly in
  });
  capsuleMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vObjPos;\n${NOISE_GLSL}`)
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= 1.0 + fsnoise(vObjPos * 42.0) * 0.022 + fsnoise(vObjPos * 7.0) * 0.018;');
  };
  capsuleMat.customProgramCacheKey = () => 'memowell-capsule';
  const body = new THREE.Mesh(capsuleHalf('body'), capsuleMat);
  const cap = new THREE.Mesh(capsuleHalf('cap'), capsuleMat);
  capIdle.add(body, cap);

  // ---- particles
  const n = small ? 13 : 19; // n - 1 divisible by M - 1, so crystals sit on particle nodes
  const N = n * n * n;
  const sampler = new MeshSurfaceSampler(resin).build();
  const aStart = new Float32Array(N * 3), aBurst = new Float32Array(N * 4), aLattice = new Float32Array(N * 3);
  const aCap = new Float32Array(N * 3), aRand = new Float32Array(N * 4);
  const tmp = new THREE.Vector3();
  const sp = L_SIZE / (n - 1);
  for (let i = 0; i < N; i++) {
    sampler.sample(tmp);
    aStart.set([tmp.x, tmp.y, tmp.z], i * 3);
    const R = 1.1 + Math.pow(Math.random(), 0.8) * 1.7;
    aBurst.set([R, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 1.1 * (1 - (R - 1.1) * 0.25), 0.5 + Math.random() * 0.7], i * 4);
    const ix = i % n, iy = Math.floor(i / n) % n, iz = Math.floor(i / (n * n));
    aLattice.set([(ix - (n - 1) / 2) * sp, (iy - (n - 1) / 2) * sp, (iz - (n - 1) / 2) * sp], i * 3);
    let x, y, z;
    do {
      x = (Math.random() * 2 - 1) * CAP.capTip; y = (Math.random() * 2 - 1) * CAP.rBody; z = (Math.random() * 2 - 1) * CAP.rBody;
    } while (!insideCapsule(x, y, z, 0.9));
    aCap.set([x, y, z], i * 3);
    aRand.set([0.55 + Math.random() * 1.0, Math.random(), Math.random(), Math.random()], i * 4);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(aStart, 3));
  pGeo.setAttribute('aStart', new THREE.BufferAttribute(aStart, 3));
  pGeo.setAttribute('aBurst', new THREE.BufferAttribute(aBurst, 4));
  pGeo.setAttribute('aLattice', new THREE.BufferAttribute(aLattice, 3));
  pGeo.setAttribute('aCap', new THREE.BufferAttribute(aCap, 3));
  pGeo.setAttribute('aRand', new THREE.BufferAttribute(aRand, 4));
  const pU = {
    uTime: shared.uTime, uDissolve: resinU.uDissolve, uBurst: { value: 0 }, uLattice: { value: 0 }, uCapsule: { value: 0 }, uFade: { value: 0 },
    uResinMat: { value: new THREE.Matrix4() }, uLatMat: { value: new THREE.Matrix4() }, uCapMat: { value: new THREE.Matrix4() },
    uSize: { value: small ? 0.03 : 0.024 }, uProjScale: { value: 600 }, uFocus: { value: 7 }, uAperture: { value: 0.26 },
    uAmber: { value: new THREE.Color(0x9a6a36) }, uGold: { value: new THREE.Color(0xbf9a6c) },
    uIce: { value: new THREE.Color(0x4d5aa6) }, uCream: { value: new THREE.Color(0xc8ad88) },
  };
  const pMat = new THREE.ShaderMaterial({
    uniforms: pU, vertexShader: PARTICLE_VERT, fragmentShader: SOFT_FRAG,
    transparent: true, depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  particles.frustumCulled = false;
  scene.add(particles);

  // ---- distant bokeh for depth
  const B = small ? 90 : 200;
  const bPos = new Float32Array(B * 3), bRand = new Float32Array(B * 4);
  for (let i = 0; i < B; i++) {
    const r = 7 + Math.random() * 9, a = Math.random() * Math.PI * 2, y = (Math.random() - 0.5) * 9;
    bPos.set([Math.cos(a) * r, y, Math.sin(a) * r - 3], i * 3);
    bRand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  bGeo.setAttribute('aRand', new THREE.BufferAttribute(bRand, 4));
  const bU = {
    uTime: shared.uTime, uProjScale: pU.uProjScale, uOpacity: { value: 1 },
    uA: { value: new THREE.Color(0xb9c2f2) }, uB: { value: new THREE.Color(0xb3e3e8) }, uC: { value: new THREE.Color(0xe6d4bb) },
  };
  const bokeh = new THREE.Points(bGeo, new THREE.ShaderMaterial({
    uniforms: bU, vertexShader: BOKEH_VERT, fragmentShader: SOFT_FRAG, transparent: true, depthWrite: false,
  }));
  bokeh.frustumCulled = false;
  bokeh.renderOrder = -3;
  scene.add(bokeh);

  // ---------------------------------------------------------------- camera path (keyed to story progress)
  const keys = [
    { p: 0.0, pos: [0.0, 0.25, 7.6], tgt: [0, 0.15, 0] },
    { p: 0.14, pos: [1.6, 0.55, 5.4], tgt: [0, 0.2, 0] },
    { p: 0.3, pos: [0.5, 1.3, 8.2], tgt: [0, 0.3, 0] },
    { p: 0.42, pos: [-2.2, 4.6, 7.2], tgt: [0, 0, 0] },
    { p: 0.56, pos: [-4.6, 2.0, 6.4], tgt: [0, 0, 0] },
    { p: 0.66, pos: [-3.0, 1.3, 6.8], tgt: [0, 0, 0] },
    { p: 0.8, pos: [0.9, 0.5, 6.4], tgt: [0, 0, 0] },
    { p: 1.0, pos: [0.15, 0.25, 5.3], tgt: [0, 0, 0] },
  ];
  const posCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.pos)), false, 'centripetal');
  const tgtCurve = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k.tgt)), false, 'centripetal');
  const keyU = (p) => {
    for (let i = 0; i < keys.length - 1; i++) {
      if (p <= keys[i + 1].p) return (i + seg(p, keys[i].p, keys[i + 1].p)) / (keys.length - 1);
    }
    return 1;
  };
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3();
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  // ---------------------------------------------------------------- evaluate the whole frame from (p, t)
  const m4 = new THREE.Matrix4(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const amberGlow = new THREE.Color(0xffa63c), iceGlow = new THREE.Color(0x7d8cff), creamGlow = new THREE.Color(0xffe2bd);
  let mode = initialMode;

  function evaluate(p, t) {
    const motion = mode !== 'static';
    const time = motion ? t : 0;
    shared.uTime.value = time;

    const d = seg(p, 0.13, 0.33);
    const burst = inOutCubic(seg(p, 0.22, 0.42));
    const L = seg(p, 0.38, 0.55);
    const C = seg(p, 0.64, 0.8);
    const S = outCubic(seg(p, 0.72, 0.86));
    const fade = seg(p, 0.83, 0.88);
    const H = inOutCubic(seg(p, 0.86, 1));
    const flash = bump(p, 0.85, 0.885);

    // resin
    resinU.uDissolve.value = d;
    resin.visible = d < 1;
    resin.rotation.set(0.12, time * 0.15 + p * 1.6, -0.08);
    resinRoot.position.y = Math.sin(time * 0.8) * 0.04;
    resinRoot.updateMatrixWorld(true);
    pU.uResinMat.value.copy(resin.matrixWorld);

    // lattice
    lattice.rotation.set(0.42, -0.7 + 1.25 * smooth(seg(p, 0.36, 0.74)) + time * 0.02, 0.08);
    lattice.updateMatrixWorld(true);
    pU.uLatMat.value.copy(lattice.matrixWorld);
    const crystalOut = smooth(seg(p, 0.63, 0.73));
    for (let i = 0; i < crystalData.length; i++) {
      const c = crystalData[i];
      const k = outCubic(clamp01(L * 1.6 - c.d * 0.6)) * (1 - crystalOut);
      s3.setScalar(Math.max(k, 0.0001));
      v3.copy(c.p).multiplyScalar(1 - crystalOut * 0.6);
      m4.compose(v3, c.q, s3);
      crystals.setMatrixAt(i, m4);
    }
    crystals.instanceMatrix.needsUpdate = true;
    crystals.visible = L > 0 && crystalOut < 1;
    lineMat.opacity = 0.26 * smooth(seg(p, 0.44, 0.56)) * (1 - seg(p, 0.62, 0.7));
    lines.visible = lineMat.opacity > 0.001;

    // capsule
    capRoot.rotation.set(0.12, lerp(0.7, -0.32, smooth(seg(p, 0.66, 1))), -0.38);
    capIdle.position.y = motion ? Math.sin(time * 0.9) * 0.035 : 0;
    capIdle.rotation.y = motion ? Math.sin(time * 0.35) * 0.06 * (0.4 + H) : 0;
    body.position.set(lerp(-1.9, 0, S), lerp(0.45, 0, S), lerp(1.6, 0, S));
    cap.position.set(lerp(1.9, 0, S), lerp(-0.45, 0, S), lerp(-1.6, 0, S));
    body.rotation.set((1 - S) * 1.4, 0, (1 - S) * 0.35);
    cap.rotation.set(-(1 - S) * 1.4, 0, -(1 - S) * 0.35);
    body.visible = cap.visible = p > 0.72;
    capRoot.updateMatrixWorld(true);
    pU.uCapMat.value.copy(capIdle.matrixWorld);

    // particles
    pU.uBurst.value = burst;
    pU.uLattice.value = L;
    pU.uCapsule.value = C;
    pU.uFade.value = fade;
    particles.visible = d > 0 && fade < 1;

    // light: rim pulse when the halves close, glint sweeping the finished capsule
    rim.intensity = 3.2 + flash * 1.2;
    glint.intensity = 3.2 * Math.sin(H * Math.PI);
    glint.position.set(lerp(-5, 5, H), 2.5, 4);
    key.intensity = 2.2 + H * 0.4;

    // glow behind the subject
    const gc = glowMat.color;
    if (p < 0.4) gc.copy(amberGlow).lerp(iceGlow, seg(p, 0.3, 0.4));
    else if (p < 0.66) gc.copy(iceGlow);
    else gc.copy(iceGlow).lerp(creamGlow, seg(p, 0.66, 0.8));
    glowMat.opacity = (0.5 - 0.15 * seg(p, 0.2, 0.4) + 0.12 * seg(p, 0.7, 0.86)) + flash * 0.5;

    // camera
    const u = keyU(p);
    posCurve.getPoint(u, camPos);
    tgtCurve.getPoint(u, camTgt);
    if (motion && mode === 'desktop') {
      pointer.sx += (pointer.x - pointer.sx) * 0.04;
      pointer.sy += (pointer.y - pointer.sy) * 0.04;
      camPos.x += pointer.sx * 0.35;
      camPos.y -= pointer.sy * 0.2;
    }
    camera.position.copy(camPos);
    camera.lookAt(camTgt);
    pU.uFocus.value = camPos.distanceTo(camTgt);
  }

  // ---------------------------------------------------------------- sizing (canvas = paint area, frame = composition box)
  function resize() {
    const w = canvas.clientWidth, hgt = canvas.clientHeight;
    if (!w || !hgt) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(w, hgt, false);
    const c = canvas.getBoundingClientRect(), f = frame.getBoundingClientRect();
    const fh = f.height;
    const dx = f.left + f.width / 2 - (c.left + w / 2);
    const dy = f.top + fh / 2 - (c.top + hgt / 2);
    camera.aspect = w / hgt;
    camera.setViewOffset(w, hgt, -dx, -dy, w, hgt);
    camera.zoom = THREE.MathUtils.clamp((Math.min(f.width, fh) / hgt) * 0.95, 0.18, 1.1);
    camera.updateProjectionMatrix();
    pU.uProjScale.value = ((hgt * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))) * camera.zoom;
    dirty = true;
    if (mode === 'static') draw(0);
  }

  // ---------------------------------------------------------------- loop
  // Ambient life (swirl, drift, float) advances only while the visitor scrolls and settles ~1.5 s after,
  // so nothing keeps moving on its own (WCAG 2.2.2). Idle frames are not redrawn.
  let visible = false, ready = false, lost = false, dirty = true;
  let lastTime = 0, sceneTime = 0, activity = 1, lastP = -1;
  function draw(t) {
    if (lost) return;
    evaluate(mode === 'static' ? 1 : state.p, t);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady?.();
    }
  }
  const onTick = (time) => {
    const dt = lastTime ? Math.min(0.1, time - lastTime) : 1 / 60;
    lastTime = time;
    if (mode === 'static' || !visible || document.hidden) return;
    if (Math.abs(state.p - lastP) > 1e-5) {
      activity = 1;
      lastP = state.p;
    } else {
      activity = Math.max(0, activity - dt / 1.5);
    }
    const pointerMoving = mode === 'desktop' && Math.abs(pointer.x - pointer.sx) + Math.abs(pointer.y - pointer.sy) > 0.002;
    if (activity <= 0 && !pointerMoving && !dirty) return;
    sceneTime += dt * activity;
    dirty = false;
    draw(sceneTime);
  };
  gsap.ticker.add(onTick);

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    dirty = true;
  }, { rootMargin: '10% 0px' });
  io.observe(section);
  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  ro.observe(frame);
  const onLost = (e) => { e.preventDefault(); lost = true; onFail?.(e); };
  canvas.addEventListener('webglcontextlost', onLost);

  // Compile shaders before the first visible frame so the scene does not hitch on entry.
  renderer.compile(scene, camera);
  resize();
  draw(0);

  return {
    setMode(next) {
      mode = next;
      resize();
      draw(sceneTime);
    },
    resize,
    dispose() {
      gsap.ticker.remove(onTick);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('webglcontextlost', onLost);
      scene.traverse((o) => {
        o.geometry?.dispose();
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
      });
      envRT.dispose();
      renderer.dispose();
    },
  };
}
