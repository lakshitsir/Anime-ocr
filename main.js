// THREE.JS SCENE
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 30;

// GLOWING ANIME PARTICLES
const geometry = new THREE.BufferGeometry();
const particles = 2000;
const positions = [];

for (let i = 0; i < particles; i++) {
  positions.push(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );
}

geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 0.4
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.0008;
  points.rotation.x += 0.0004;
  renderer.render(scene, camera);
}
animate();

// RESIZE SUPPORT (ANDROID)
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// OCR PART
const fileInput = document.getElementById("file");
const output = document.getElementById("output");

fileInput.addEventListener("change", async () => {
  output.textContent = "Scanning...";

  const file = fileInput.files[0];
  if (!file) return;

  const result = await Tesseract.recognize(
    file,
    "eng+hin+ara+chi_sim+jpn+kor+spa+fra",
    {
      preserve_interword_spaces: 1
    }
  );

  output.textContent = result.data.text;
});