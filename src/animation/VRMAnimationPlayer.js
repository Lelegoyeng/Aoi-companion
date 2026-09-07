// ============================================================
// VRM ANIMATION PLAYER (pemutar animasi .vrma)
// ------------------------------------------------------------
// Memutar animasi VRM Animation (.vrma) pada karakter VRM.
//
// Cara pakai:
//   createVRMAnimationPlayer(vrm, [
//     { id: "idle",     url: "/animations/idle.vrma",     loop: true  },
//     { id: "greeting", url: "/animations/greeting.vrma", loop: false },
//     ...tambahkan animasi lain di sini (lihat public/animations/)...
//   ])
//
// Perilaku:
//   - Clip ber-`loop: true` (mis. idle) otomatis diputar terus-menerus.
//   - Clip sekali putar (mis. greeting) dipicu lewat triggerAction(id),
//     lalu otomatis kembali ke idle setelah selesai.
//   - Semua pergantian clip memakai CROSSFADE halus (bukan potong langsung),
//     jadi transisi greeting -> idle terlihat natural.
//   - Efek wajah kecil yang tetap hidup: berkedip (ekspresi "blink") dan
//     mulut bergerak saat bicara (aa/ih/ou/ee/oh).
//
// API:
//   update(delta, elapsed)  -> panggil tiap frame
//   triggerAction(id)       -> putar clip sekali putar / pindah ke clip lain
//   setTalking(bool)
// ============================================================

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
  VRMLookAtQuaternionProxy,
} from "@pixiv/three-vrm-animation";

const VISEMES = ["aa", "ih", "ou", "ee", "oh"];

// Durasi crossfade antar animasi (detik). Nilai ini juga dipakai untuk
// memudar kembali ke idle setelah clip sekali-putar selesai.
const FADE_TIME = 0.4;

/**
 * @param {import("@pixiv/three-vrm").VRM} vrm
 * @param {{ id: string, url: string, loop?: boolean }[]} clipSpecs
 */
export async function createVRMAnimationPlayer(vrm, clipSpecs) {
  const em = vrm.expressionManager;
  const humanoid = vrm.humanoid;

  const mixer = new THREE.AnimationMixer(vrm.scene);
  const actions = {}; // id -> AnimationAction
  const idleId = (clipSpecs.find((s) => s.loop) || clipSpecs[0])?.id;
  let activeOnce = null; // id clip sekali-putar yang sedang berjalan

  // ---- Keadaan ekspresi (blink & bicara) ----
  let isTalking = false;
  let blinkTimer = 0;
  let nextBlink = 2 + Math.random() * 3;
  let blinkValue = 0;
  let isBlinkingDown = false;

  const setExpression = (name, value) => {
    if (!em) return;
    try {
      em.setValue(name, Math.min(Math.max(value, 0), 1));
    } catch (_) {
      /* ekspresi tidak tersedia di model */
    }
  };

  // Sediakan proxy lookAt sekali saja supaya clip yang memakai track
  // lookAt tidak membuat proxy otomatis (sekaligus menekan warning).
  if (vrm.lookAt && !vrm.scene.getObjectByName("VRMLookAtQuaternionProxy")) {
    const lookAtProxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
    lookAtProxy.name = "VRMLookAtQuaternionProxy";
    vrm.scene.add(lookAtProxy);
  }

  // ---- Muat semua clip yang diminta ----
  async function loadClips() {
    for (const spec of clipSpecs) {
      try {
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
        const gltf = await loader.loadAsync(spec.url);
        const vrmAnimation = gltf.userData.vrmAnimations?.[0];
        if (!vrmAnimation) {
          console.warn(`[AnimPlayer] "${spec.id}" (${spec.url}) tidak berisi VRMAnimation.`);
          continue;
        }
        const clip = createVRMAnimationClip(vrmAnimation, vrm);
        const action = mixer.clipAction(clip);
        if (spec.loop) {
          action.loop = THREE.LoopRepeat;
        } else {
          action.loop = THREE.LoopOnce;
          action.clampWhenFinished = true; // tahan di pose terakhir sampai dihentikan
        }
        actions[spec.id] = action;
        console.log(`[AnimPlayer] "${spec.id}" siap (${clip.duration.toFixed(2)} dtk, ${spec.loop ? "loop" : "sekali putar"})`);
      } catch (err) {
        console.warn(`[AnimPlayer] Gagal memuat "${spec.id}" (${spec.url}):`, err);
      }
    }

    // Setelah muat: putar idle (atau clip pertama) sebagai kondisi awal.
    if (idleId && actions[idleId]) {
      startClip(idleId);
    }
  }

  // ---- Pemutaran clip ----
  let activeAction = null; // action yang sedang tampil (idle atau sekali-putar)

  /**
   * Ganti clip dengan crossfade: clip lama di-fade-out sementara clip baru
   * di-fade-in, jadi transisi antar animasi terlihat halus dan natural.
   */
  function startClip(id, fadeTime = FADE_TIME) {
    const action = actions[id];
    if (!action || action === activeAction) return;

    // Clip yang sedang tampil dipudarkan; clip baru masuk bersamaan.
    // (Action yang sudah fade-out tuntas otomatis di-disable oleh mixer.)
    const prev = activeAction && activeAction !== action && activeAction.enabled ? activeAction : null;
    if (prev) prev.fadeOut(fadeTime);

    action.reset();
    action.fadeIn(fadeTime);
    action.play();

    activeAction = action;
    activeOnce = id === idleId ? null : id;
  }

  // Saat clip sekali-putar selesai -> kembali ke idle.
  mixer.addEventListener("finished", (event) => {
    if (event.action === actions[activeOnce]) {
      if (idleId && actions[idleId]) startClip(idleId);
      else activeOnce = null;
    }
  });

  await loadClips();

  // ============================================================
  // API PUBLIK
  // ============================================================

  /** Pindah/putar animasi berdasarkan id (mis. "greeting"). */
  function triggerAction(id) {
    if (!actions[id]) return false;
    startClip(id);
    return true;
  }

  function setTalking(val) {
    isTalking = val;
  }

  function update(delta, elapsed) {
    // 1) Jalankan mixer (idle berjalan terus; greeting bila sedang aktif).
    mixer.update(delta);

    // 2) Berkedip (ekspresi, bukan gerakan tulang).
    blinkTimer += delta;
    if (!isBlinkingDown && blinkTimer >= nextBlink) {
      blinkTimer = 0;
      nextBlink = 2 + Math.random() * 4;
      isBlinkingDown = true;
    }
    if (isBlinkingDown) {
      blinkValue = Math.min(blinkValue + delta * 10, 1);
      if (blinkValue >= 1) isBlinkingDown = false;
    } else {
      blinkValue = Math.max(blinkValue - delta * 8, 0);
    }
    setExpression("blink", blinkValue);

    // 3) Mulut bergerak saat bicara.
    if (isTalking && em) {
      const visemeTime = elapsed * 12;
      const pattern = Math.floor(visemeTime) % VISEMES.length;
      const blend = visemeTime - Math.floor(visemeTime);
      const curr = VISEMES[pattern];
      const next = VISEMES[(pattern + 1) % VISEMES.length];
      const intensity = 0.3 + Math.abs(Math.sin(elapsed * 10)) * 0.7;
      const bv = blend < 0.5 ? 2 * blend * blend : 1 - Math.pow(-2 * blend + 2, 2) / 2;
      setExpression(curr, intensity * (1 - bv * 0.5));
      setExpression(next, intensity * bv * 0.5);
      setExpression("happy", 0.4);
    } else if (em) {
      // Matikan sisa viseme supaya mulut netral.
      VISEMES.forEach((v) => setExpression(v, 0));
    }

    // 4) vrm.update() PALING AKHIR: menyalin pose normalized bone ke tulang
    //    asli + menerapkan ekspresi ke mesh.
    vrm.update(delta);
  }

  return {
    update,
    triggerAction,
    setTalking,
    // Informasi untuk debugging.
    get loaded() {
      return Object.keys(actions);
    },
    get currentId() {
      return activeOnce ?? (idleId && actions[idleId]?.isRunning() ? idleId : null);
    },
    isAnimating() {
      // Kembalikan true jika ada animasi selain idle yang sedang berjalan
      return activeOnce !== null;
    },
  };
}
