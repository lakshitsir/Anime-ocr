/* =======================
   3D BACKGROUND (THREE.JS)
======================= */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
camera.position.z = 30;

// Particles
const geo = new THREE.BufferGeometry();
const count = 1600;
const pos = [];

for (let i = 0; i < count; i++) {
  pos.push(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );
}

geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 0.45
});

const points = new THREE.Points(geo, mat);
scene.add(points);

(function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.0006;
  points.rotation.x += 0.0004;
  renderer.render(scene, camera);
})();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* =======================
   OCR + LEGENDARY CLEANING
======================= */
const fileInput = document.getElementById("file");
const preview = document.getElementById("preview");
const ctx = preview.getContext("2d");
const output = document.getElementById("output");

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  // Preview image
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    preview.style.display = "block";
    preview.width = img.width;
    preview.height = img.height;
    ctx.drawImage(img, 0, 0);

    output.textContent = "Scanning…";

    const res = await Tesseract.recognize(
      preview,
      "eng+hin+ara+chi_sim+jpn+kor+spa+fra",
      {
        preserve_interword_spaces: 1,
        tessedit_char_blacklist:
          "|[]{}<>~^_=`•°©®™"
      }
    );

    let text = res.data.text;

    /* ===== LEGENDARY CLEANING PIPELINE ===== */

    // Remove non-printable chars
    text = text.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");

    // Remove lines with only symbols
    text = text
      .split("\n")
      .filter(line =>
        /[A-Za-z0-9\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF]/.test(line)
      )
      .join("\n");

    // Remove repeated junk characters
    text = text.replace(/([|_\/\\\-])\1{2,}/g, "");

    // Normalize excessive spaces
    text = text.replace(/[ \t]{2,}/g, " ");

    // Trim empty edges
    text = text.replace(/^\s+|\s+$/g, "");

    output.textContent = text || "No readable text detected.";
  };
});
