import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createPlaceholder, loadVRM } from "./character.js";

let scene, camera, renderer, character, controls;
let clock = new THREE.Clock();

// Posisi karakter di sumbu Z (mundur dari kamera supaya tidak terlalu
// besar di layar saat baru mulai). Kamera berada di z = +3.5.
const CHARACTER_Z = -0.3;

export async function initScene() {
  const container = document.getElementById("scene-container");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.3, 2.3); // Dekat seperti videocall
  camera.lookAt(0, 1.1, CHARACTER_Z);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 1.1, CHARACTER_Z); // Orbit around center of character
  controls.minDistance = 1.0;
  controls.maxDistance = 3.5;
  controls.maxPolarAngle = Math.PI / 2.2; // Batasi sudut agar tidak terlalu ke bawah

  const ambientLight = new THREE.AmbientLight(0xffeeff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(2, 4, 3);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const rimLight = new THREE.PointLight(0xe0b0ff, 0.6, 10);
  rimLight.position.set(-2, 2, -1);
  scene.add(rimLight);

  // Lantai dihapus agar tidak terlihat (zoom ke atas)

  try {
    character = await loadVRM("/models/character1.vrm");
    character.group.scale.set(1.0, 1.0, 1.0); // Normal scale untuk videocall
    scene.add(character.group);
    console.log("VRM model loaded successfully");
  } catch (err) {
    console.warn("Failed to load VRM, using placeholder:", err);
    character = createPlaceholder();
    scene.add(character.group);
  }

  // Karakter diposisikan di tengah layar
  character.group.position.set(0, 0, CHARACTER_Z);

  window.addEventListener("resize", onResize);

  animate();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  if (character) {
    character.update(delta, elapsed);
  }

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

export function getCharacter() {
  return character;
}
