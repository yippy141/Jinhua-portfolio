// Deep-sea particle field — three.js
// Bioluminescent plankton drift, faint whale silhouette pass, depth fog.

(function () {
  const THREE = window.THREE;
  if (!THREE) return;

  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080a, 0.012);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 0, 60);

  // ───── plankton particle field ─────
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 220;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 180 - 20;
    sizes[i] = Math.random() * 1.6 + 0.4;
    phase[i] = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

  const vertex = `
    attribute float aSize;
    attribute float aPhase;
    uniform float uTime;
    varying float vAlpha;
    varying float vDepth;
    void main() {
      vec3 p = position;
      // gentle drift: rise + sway
      p.y += mod(uTime * 0.6 + aPhase * 4.0, 160.0) - 80.0;
      p.x += sin(uTime * 0.15 + aPhase) * 1.6;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = aSize * (220.0 / -mv.z);
      vAlpha = 0.45 + 0.55 * sin(uTime * 1.2 + aPhase * 2.0);
      vDepth = clamp(1.0 - (-mv.z / 180.0), 0.0, 1.0);
    }
  `;
  const fragment = `
    varying float vAlpha;
    varying float vDepth;
    void main() {
      vec2 c = gl_PointCoord - vec2(0.5);
      float d = length(c);
      if (d > 0.5) discard;
      float core = smoothstep(0.5, 0.0, d);
      float halo = smoothstep(0.5, 0.15, d) * 0.35;
      vec3 col = mix(vec3(0.55, 0.85, 0.78), vec3(0.85, 0.95, 0.92), core);
      float a = (core + halo) * vAlpha * (0.35 + vDepth * 0.85);
      gl_FragColor = vec4(col, a);
    }
  `;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ───── faint constellation grid (deep current lines) ─────
  const lineGeo = new THREE.BufferGeometry();
  const linePts = [];
  for (let i = 0; i < 14; i++) {
    const z = -60 - i * 8;
    const y = (Math.random() - 0.5) * 80;
    linePts.push(-200, y, z, 200, y + (Math.random() - 0.5) * 30, z);
  }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x1a3a35, transparent: true, opacity: 0.25 });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // ───── faint whale silhouette (low-poly) drifting through deep ─────
  const whaleShape = new THREE.Shape();
  // Stylized blue whale silhouette outline
  whaleShape.moveTo(-1.0, 0);
  whaleShape.bezierCurveTo(-0.95, 0.18, -0.55, 0.3, -0.05, 0.28);
  whaleShape.bezierCurveTo(0.45, 0.26, 0.78, 0.18, 0.92, 0.08);
  whaleShape.lineTo(1.0, 0.28); // tail upper
  whaleShape.lineTo(1.12, 0.05);
  whaleShape.lineTo(1.0, -0.18);
  whaleShape.bezierCurveTo(0.85, -0.22, 0.5, -0.28, 0.0, -0.26);
  whaleShape.bezierCurveTo(-0.5, -0.24, -0.85, -0.18, -1.0, 0);
  const whaleGeo = new THREE.ShapeGeometry(whaleShape);
  const whaleMat = new THREE.MeshBasicMaterial({
    color: 0x0a1c1c,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
  });
  const whale = new THREE.Mesh(whaleGeo, whaleMat);
  whale.scale.set(28, 28, 1);
  whale.position.set(-220, -10, -80);
  scene.add(whale);

  // ───── parallax mouse ─────
  const target = { x: 0, y: 0 };
  const ease = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ───── resize ─────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ───── loop ─────
  let paused = false;
  window.__particles = {
    pause() { paused = true; },
    resume() { paused = false; },
    toggle() { paused = !paused; return paused; },
  };

  const clock = new THREE.Clock();
  let elapsed = 0;
  function tick() {
    requestAnimationFrame(tick);
    const dt = clock.getDelta();
    if (!paused) elapsed += dt;
    mat.uniforms.uTime.value = elapsed;

    ease.x += (target.x - ease.x) * 0.04;
    ease.y += (target.y - ease.y) * 0.04;
    camera.position.x = ease.x * 5;
    camera.position.y = -ease.y * 3;
    camera.lookAt(0, 0, 0);

    // whale slow traverse
    whale.position.x = ((elapsed * 4) % 460) - 230;
    whale.position.y = -10 + Math.sin(elapsed * 0.2) * 6;
    whale.rotation.z = Math.sin(elapsed * 0.3) * 0.03;

    renderer.render(scene, camera);
  }
  tick();
})();
