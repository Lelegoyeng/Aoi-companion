// ===========================================================
// character.js — FACADE KARAKTER
// ------------------------------------------------------------
// Ekspor publik (dipakai scene.js / main.js):
//   createPlaceholder()  -> karakter darurat statis (jika VRM gagal)
//   loadVRM(path)        -> karakter VRM + semua animasi dari public/animations/
//   loadModel(path)      -> model GLTF/GLB biasa (tanpa animasi)
//
// Semua karakter mengekspos API yang sama:
//   group            : THREE.Object3D siap ditambahkan ke scene
//   update(dt, el)   : dipanggil tiap frame
//   triggerAction(name, duration) : hanya 'greeting' yang berfungsi
//   setTalking(bool)
// ===========================================================

import * as THREE from "three";
import { createVRMAnimationPlayer } from "./animation/VRMAnimationPlayer.js";

// ---------- Warna placeholder ----------
const SKIN = 0xfde0d0;
const HAIR = 0x4a3060;
const EYE = 0x3020a0;
const EYE_WHITE = 0xffffff;
const OUTLINE = 0x2a1a40;
const DRESS = 0xc8a0e8;
const DRESS_ACCENT = 0xe0b0ff;
const SHOE = 0x3a2050;

// ===========================================================
// PLACEHOLDER CHARACTER (fallback statis)
// Hanya dipakai bila model VRM gagal dimuat. Tidak ada gerakan.
// ===========================================================
export function createPlaceholder() {
  const group = new THREE.Group();
  const parts = {};

  const skinMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.4 });
  const dressMat = new THREE.MeshStandardMaterial({ color: DRESS, roughness: 0.5 });
  const accentMat = new THREE.MeshStandardMaterial({ color: DRESS_ACCENT, roughness: 0.5 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: SHOE });

  // -- Kepala --
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), skinMat);
  head.position.y = 1.65;
  head.castShadow = true;
  group.add(head);
  parts.head = head;

  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 32), hairMat);
  hairBack.position.set(0, 1.68, -0.02);
  hairBack.scale.set(1.05, 1.05, 1.1);
  group.add(hairBack);

  const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.15), hairMat);
  bangs.position.set(0, 1.8, 0.12);
  bangs.rotation.x = 0.15;
  group.add(bangs);

  const sideHairGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.35, 8);
  const sideHairL = new THREE.Mesh(sideHairGeo, hairMat);
  sideHairL.position.set(-0.22, 1.45, 0.05);
  sideHairL.rotation.z = 0.15;
  group.add(sideHairL);
  const sideHairR = new THREE.Mesh(sideHairGeo, hairMat);
  sideHairR.position.set(0.22, 1.45, 0.05);
  sideHairR.rotation.z = -0.15;
  group.add(sideHairR);

  function createEye(x) {
    const eyeGroup = new THREE.Group();
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), new THREE.MeshStandardMaterial({ color: EYE_WHITE }));
    white.scale.set(1, 1.2, 0.5);
    eyeGroup.add(white);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), new THREE.MeshStandardMaterial({ color: EYE, roughness: 0.2 }));
    iris.position.z = 0.02;
    iris.scale.set(1, 1.2, 0.6);
    eyeGroup.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshStandardMaterial({ color: OUTLINE }));
    pupil.position.z = 0.035;
    eyeGroup.add(pupil);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    shine.position.set(0.012, 0.015, 0.04);
    eyeGroup.add(shine);
    eyeGroup.position.set(x, 1.67, 0.18);
    return eyeGroup;
  }

  parts.eyeL = createEye(-0.08);
  parts.eyeR = createEye(0.08);
  group.add(parts.eyeL);
  group.add(parts.eyeR);

  parts.mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.012, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xd08080 })
  );
  parts.mouth.position.set(0, 1.59, 0.2);
  group.add(parts.mouth);

  // -- Leher, tubuh, rok --
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 16), skinMat);
  neck.position.y = 1.43;
  group.add(neck);

  parts.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.45, 16), dressMat);
  parts.torso.position.y = 1.13;
  parts.torso.castShadow = true;
  group.add(parts.torso);

  parts.skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.22, 0.35, 16), accentMat);
  parts.skirt.position.y = 0.73;
  parts.skirt.castShadow = true;
  group.add(parts.skirt);

  // -- Lengan --
  const armGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.35, 8);
  const armL = new THREE.Group();
  const armMeshL = new THREE.Mesh(armGeo, skinMat);
  armMeshL.position.y = -0.175;
  armL.add(armMeshL);
  armL.position.set(-0.2, 1.25, 0);
  armL.rotation.z = 0.15;
  group.add(armL);
  parts.armL = armL;

  const armR = new THREE.Group();
  const armMeshR = new THREE.Mesh(armGeo, skinMat);
  armMeshR.position.y = -0.175;
  armR.add(armMeshR);
  armR.position.set(0.2, 1.25, 0);
  armR.rotation.z = -0.15;
  group.add(armR);
  parts.armR = armR;

  // -- Kaki & sepatu --
  const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.35, 8);
  parts.legL = new THREE.Mesh(legGeo, skinMat);
  parts.legL.position.set(-0.08, 0.38, 0);
  parts.legL.castShadow = true;
  group.add(parts.legL);
  parts.legR = new THREE.Mesh(legGeo, skinMat);
  parts.legR.position.set(0.08, 0.38, 0);
  parts.legR.castShadow = true;
  group.add(parts.legR);

  const shoeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.12);
  parts.shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  parts.shoeL.position.set(-0.08, 0.17, 0.02);
  group.add(parts.shoeL);
  parts.shoeR = new THREE.Mesh(shoeGeo, shoeMat);
  parts.shoeR.position.set(0.08, 0.17, 0.02);
  group.add(parts.shoeR);

  // Fallback statis: tidak ada gerakan sama sekali.
  return {
    group,
    parts,
    update() { },
    triggerAction() { },
    setTalking() { },
  };
}

// ===========================================================
// VRM CHARACTER (dengan animasi .vrma dari public/animations/)
// ===========================================================
export async function loadVRM(path) {
  const [{ GLTFLoader }, { VRMLoaderPlugin }] = await Promise.all([
    import("three/addons/loaders/GLTFLoader.js"),
    import("@pixiv/three-vrm"),
  ]);

  // Muat GLTF + parse VRM (progress dicatat untuk debug).
  const vrm = await new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(
      path,
      (gltf) => resolve(gltf.userData.vrm),
      (progress) => {
        const pct = progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0;
        console.log("Loading VRM...", pct + "%");
      },
      reject
    );
  });

  if (!vrm) throw new Error("No VRM data found in file");

  const model = vrm.scene;
  model.rotation.y = Math.PI; // sesuaikan arah hadap model ke kamera
  model.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });

  // Pemutar animasi VRMA: idle berjalan otomatis (loop); animasi lain dipicu
  // lewat triggerAction(id) lalu kembali ke idle dengan crossfade halus.
  // Semua file .vrma di public/animations/ didaftarkan di sini.
  const player = await createVRMAnimationPlayer(vrm, [
    { id: "idle", url: "/animations/idle.vrma", loop: true },
    { id: "greeting", url: "/animations/greeting.vrma", loop: false },
    { id: "thinking", url: "/animations/thinking.vrma", loop: false },
    { id: "surprised", url: "/animations/surprised.vrma", loop: false },
    { id: "sad", url: "/animations/sad.vrma", loop: false },
    { id: "blush", url: "/animations/blush.vrma", loop: false },
    { id: "clapping", url: "/animations/clapping.vrma", loop: false },
    { id: "goodbye", url: "/animations/goodbye.vrma", loop: false },
    { id: "jump", url: "/animations/jump.vrma", loop: false },
    { id: "angry", url: "/animations/angry.vrma", loop: false },
    { id: "spin", url: "/animations/spin.vrma", loop: false },
    { id: "squat", url: "/animations/squat.vrma", loop: false },
    { id: "relax", url: "/animations/relax.vrma", loop: false },
    { id: "sleepy", url: "/animations/sleepy.vrma", loop: false },
    { id: "look-around", url: "/animations/look-around.vrma", loop: false },
    { id: "show-full-body", url: "/animations/show-full-body.vrma", loop: false },
    { id: "peace-sign", url: "/animations/peace-sign.vrma", loop: false },
    { id: "shoot", url: "/animations/shoot.vrma", loop: false },
    { id: "model-pose", url: "/animations/model-pose.vrma", loop: false },
    { id: "dance", url: "/animations/dance.vrma", loop: false },
  ]);

  console.log("VRM model loaded:", vrm.meta?.title || path);
  return {
    group: model,
    vrm,
    update: (delta, elapsed) => player.update(delta, elapsed),
    triggerAction: (name) => player.triggerAction(name),
    setTalking: (val) => player.setTalking(val),
    isAnimating: () => player.isAnimating(),
  };
}

// ===========================================================
// MODEL GLTF/GLB BIASA (tanpa sistem animasi VRM)
// ===========================================================
export async function loadModel(path) {
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");

  const model = await new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
  });

  model.traverse((child) => {
    if (child.isMesh) child.castShadow = true;
  });
  return model;
}