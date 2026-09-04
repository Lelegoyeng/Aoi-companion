import * as THREE from "three";

const SKIN = 0xfde0d0;
const HAIR = 0x4a3060;
const EYE = 0x3020a0;
const EYE_WHITE = 0xffffff;
const OUTLINE = 0x2a1a40;
const DRESS = 0xc8a0e8;
const DRESS_ACCENT = 0xe0b0ff;
const SHOE = 0x3a2050;

export function createPlaceholder() {
  const group = new THREE.Group();
  const parts = {};

  const headGeo = new THREE.SphereGeometry(0.22, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.6 });
  parts.head = new THREE.Mesh(headGeo, headMat);
  parts.head.position.y = 1.65;
  parts.head.castShadow = true;
  group.add(parts.head);

  const hairMainGeo = new THREE.SphereGeometry(0.26, 32, 32);
  const hairMat = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.4 });
  parts.hairBack = new THREE.Mesh(hairMainGeo, hairMat);
  parts.hairBack.position.y = 1.68;
  parts.hairBack.position.z = -0.02;
  parts.hairBack.scale.set(1.05, 1.05, 1.1);
  group.add(parts.hairBack);

  const bangGeo = new THREE.BoxGeometry(0.44, 0.1, 0.15);
  const bangMat = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.4 });
  parts.bangs = new THREE.Mesh(bangGeo, bangMat);
  parts.bangs.position.set(0, 1.8, 0.12);
  parts.bangs.rotation.x = 0.15;
  group.add(parts.bangs);

  const sideHairGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.35, 8);
  parts.sideHairL = new THREE.Mesh(sideHairGeo, hairMat);
  parts.sideHairL.position.set(-0.22, 1.45, 0.05);
  parts.sideHairL.rotation.z = 0.15;
  group.add(parts.sideHairL);

  parts.sideHairR = new THREE.Mesh(sideHairGeo, hairMat);
  parts.sideHairR.position.set(0.22, 1.45, 0.05);
  parts.sideHairR.rotation.z = -0.15;
  group.add(parts.sideHairR);

  function createEye(x) {
    const eyeGroup = new THREE.Group();

    const whiteGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const whiteMat = new THREE.MeshStandardMaterial({ color: EYE_WHITE });
    const white = new THREE.Mesh(whiteGeo, whiteMat);
    white.scale.set(1, 1.2, 0.5);
    eyeGroup.add(white);

    const irisGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const irisMat = new THREE.MeshStandardMaterial({ color: EYE, roughness: 0.2 });
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.z = 0.02;
    iris.scale.set(1, 1.2, 0.6);
    eyeGroup.add(iris);

    const pupilGeo = new THREE.SphereGeometry(0.015, 8, 8);
    const pupilMat = new THREE.MeshStandardMaterial({ color: OUTLINE });
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.z = 0.035;
    eyeGroup.add(pupil);

    const shineGeo = new THREE.SphereGeometry(0.008, 8, 8);
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const shine = new THREE.Mesh(shineGeo, shineMat);
    shine.position.set(0.012, 0.015, 0.04);
    eyeGroup.add(shine);

    eyeGroup.position.set(x, 1.67, 0.18);
    return eyeGroup;
  }

  parts.eyeL = createEye(-0.08);
  parts.eyeR = createEye(0.08);
  group.add(parts.eyeL);
  group.add(parts.eyeR);

  const mouthGeo = new THREE.BoxGeometry(0.04, 0.012, 0.01);
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0xd08080 });
  parts.mouth = new THREE.Mesh(mouthGeo, mouthMat);
  parts.mouth.position.set(0, 1.59, 0.2);
  group.add(parts.mouth);

  const neckGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.1, 16);
  const neckMat = new THREE.MeshStandardMaterial({ color: SKIN });
  const neck = new THREE.Mesh(neckGeo, neckMat);
  neck.position.y = 1.43;
  group.add(neck);

  const torsoGeo = new THREE.CylinderGeometry(0.14, 0.1, 0.45, 16);
  const dressMat = new THREE.MeshStandardMaterial({ color: DRESS, roughness: 0.5 });
  parts.torso = new THREE.Mesh(torsoGeo, dressMat);
  parts.torso.position.y = 1.13;
  parts.torso.castShadow = true;
  group.add(parts.torso);

  const skirtGeo = new THREE.CylinderGeometry(0.1, 0.22, 0.35, 16);
  const skirtMat = new THREE.MeshStandardMaterial({ color: DRESS_ACCENT, roughness: 0.5 });
  parts.skirt = new THREE.Mesh(skirtGeo, skirtMat);
  parts.skirt.position.y = 0.73;
  parts.skirt.castShadow = true;
  group.add(parts.skirt);

  const armGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.35, 8);
  const armMat = new THREE.MeshStandardMaterial({ color: SKIN });

  parts.armL = new THREE.Group();
  const armMeshL = new THREE.Mesh(armGeo, armMat);
  armMeshL.position.y = -0.175;
  parts.armL.add(armMeshL);
  parts.armL.position.set(-0.2, 1.25, 0);
  parts.armL.rotation.z = 0.15;
  group.add(parts.armL);

  parts.armR = new THREE.Group();
  const armMeshR = new THREE.Mesh(armGeo, armMat);
  armMeshR.position.y = -0.175;
  parts.armR.add(armMeshR);
  parts.armR.position.set(0.2, 1.25, 0);
  parts.armR.rotation.z = -0.15;
  group.add(parts.armR);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.35, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: SKIN });

  parts.legL = new THREE.Mesh(legGeo, legMat);
  parts.legL.position.set(-0.08, 0.38, 0);
  parts.legL.castShadow = true;
  group.add(parts.legL);

  parts.legR = new THREE.Mesh(legGeo, legMat);
  parts.legR.position.set(0.08, 0.38, 0);
  parts.legR.castShadow = true;
  group.add(parts.legR);

  const shoeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.12);
  const shoeMat = new THREE.MeshStandardMaterial({ color: SHOE });

  parts.shoeL = new THREE.Mesh(shoeGeo, shoeMat);
  parts.shoeL.position.set(-0.08, 0.17, 0.02);
  group.add(parts.shoeL);

  parts.shoeR = new THREE.Mesh(shoeGeo, shoeMat);
  parts.shoeR.position.set(0.08, 0.17, 0.02);
  group.add(parts.shoeR);

  let isTalking = false;
  let isWaving = false;
  let blinkTimer = 0;
  let isBlinking = false;

  return {
    group,
    parts,
    setTalking(val) { isTalking = val; },
    setWaving(val) { isWaving = val; },

    update(delta, elapsed) {
      const bob = Math.sin(elapsed * 2) * 0.02;
      parts.head.position.y = 1.65 + bob;
      parts.hairBack.position.y = 1.68 + bob;
      parts.bangs.position.y = 1.8 + bob;
      parts.eyeL.position.y = 1.67 + bob;
      parts.eyeR.position.y = 1.67 + bob;
      parts.mouth.position.y = 1.59 + bob;
      parts.sideHairL.position.y = 1.45 + bob;
      parts.sideHairR.position.y = 1.45 + bob;

      parts.torso.rotation.z = Math.sin(elapsed * 1.5) * 0.01;
      parts.armL.rotation.x = Math.sin(elapsed * 1.8) * 0.05;
      parts.armR.rotation.x = Math.sin(elapsed * 1.8 + 0.5) * 0.05;

      if (isTalking) {
        parts.mouth.scale.y = 1 + Math.abs(Math.sin(elapsed * 12)) * 1.5;
      } else {
        parts.mouth.scale.y = 1;
      }

      blinkTimer += delta;
      if (!isBlinking && blinkTimer > 3 + Math.random() * 2) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking) {
        parts.eyeL.scale.y = Math.max(0.1, parts.eyeL.scale.y - delta * 15);
        parts.eyeR.scale.y = Math.max(0.1, parts.eyeR.scale.y - delta * 15);
        if (parts.eyeL.scale.y <= 0.1) {
          isBlinking = false;
        }
      } else {
        parts.eyeL.scale.y = Math.min(1, parts.eyeL.scale.y + delta * 10);
        parts.eyeR.scale.y = Math.min(1, parts.eyeR.scale.y + delta * 10);
      }

      if (isWaving) {
        parts.armR.rotation.z = -1.5 + Math.sin(elapsed * 8) * 0.3;
        parts.armR.rotation.x = -0.3;
      } else {
        parts.armR.rotation.z = THREE.MathUtils.lerp(parts.armR.rotation.z, -0.15, delta * 3);
        parts.armR.rotation.x = THREE.MathUtils.lerp(parts.armR.rotation.x, 0, delta * 3);
      }
    },
  };
}

export function loadVRM(path) {
  return new Promise(async (resolve, reject) => {
    try {
      const gltfModule = await import("three/addons/loaders/GLTFLoader.js");
      const vrmModule = await import("@pixiv/three-vrm");

      const loader = new gltfModule.GLTFLoader();
      loader.register((parser) => new vrmModule.VRMLoaderPlugin(parser));

      loader.load(
        path,
        (gltf) => {
          const vrm = gltf.userData.vrm;
          if (!vrm) {
            reject(new Error("No VRM data found in file"));
            return;
          }
          const model = vrm.scene;
          model.rotation.y = Math.PI;
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
            }
          });

          let isTalking = false;
          let isWaving = false;
          const humanoid = vrm.humanoid;
          const em = vrm.expressionManager;

          let currentAction = "idle";
          let actionTimer = 3 + Math.random() * 2;
          let actionProgress = 0;

          const lerp = (a, b, t) => a + (b - a) * Math.min(t, 1);

          const bones = {};
          ["head", "spine", "chest", "hips", "leftUpperArm", "leftLowerArm",
           "rightUpperArm", "rightLowerArm", "leftHand", "rightHand",
           "shoulders", "neck", "upperChest"].forEach((name) => {
            bones[name] = humanoid.getNormalizedBoneNode(name);
          });

          const setExp = (name, val) => {
            if (!em) return;
            try { em.setValue(name, val); } catch (_) {}
          };

          const resetAllBones = () => {
            Object.values(bones).forEach((b) => {
              if (b) {
                b.rotation.x = 0;
                b.rotation.y = 0;
                b.rotation.z = 0;
              }
            });
          };

          const smoothBone = (bone, tx, ty, tz, speed) => {
            if (!bone) return;
            bone.rotation.x = lerp(bone.rotation.x, tx, speed);
            bone.rotation.y = lerp(bone.rotation.y, ty, speed);
            bone.rotation.z = lerp(bone.rotation.z, tz, speed);
          };

          resolve({
            group: model,
            vrm,
            setTalking(val) { isTalking = val; },
            setWaving(val) { isWaving = val; },

            update(delta, elapsed) {
              vrm.update(delta);
              if (em) {
                try {
                  ["happy", "relaxed", "angry", "sad", "surprised",
                   "aa", "ih", "ou", "ee", "oh", "blink"].forEach((n) => {
                    em.setValue(n, 0);
                  });
                } catch (_) {}
              }

              actionTimer -= delta;
              actionProgress += delta;

              if (actionTimer <= 0) {
                const pool = ["idle", "idle", "shy", "smile", "hair", "tilt", "idle", "shy"];
                currentAction = pool[Math.floor(Math.random() * pool.length)];
                actionTimer = currentAction === "idle" ? 3 + Math.random() * 4
                            : currentAction === "shy" ? 4
                            : currentAction === "smile" ? 3.5
                            : currentAction === "hair" ? 5
                            : 3;
                actionProgress = 0;
              }

              smoothBone(bones.head, 0, 0, 0, delta * 3);
              smoothBone(bones.spine, 0, 0, 0, delta * 3);
              smoothBone(bones.chest, 0, 0, 0, delta * 3);
              smoothBone(bones.neck, 0, 0, 0, delta * 3);
              smoothBone(bones.shoulders, 0, 0, 0, delta * 3);
              smoothBone(bones.leftUpperArm, 0.4, 0, 0.3, delta * 3);
              smoothBone(bones.leftLowerArm, -0.7, 0, 0, delta * 3);
              smoothBone(bones.leftHand, 0, 0, 0, delta * 3);
              smoothBone(bones.rightUpperArm, 0.4, 0, -0.3, delta * 3);
              smoothBone(bones.rightLowerArm, -0.7, 0, 0, delta * 3);
              smoothBone(bones.rightHand, 0, 0, 0, delta * 3);

              const breath = (Math.sin(elapsed * 1.8) + Math.sin(elapsed * 2.5) * 0.3) * 0.012;
              const sway = (Math.sin(elapsed * 0.9) + Math.sin(elapsed * 1.4) * 0.4) * 0.015;
              const headSway = (Math.sin(elapsed * 0.8) + Math.sin(elapsed * 1.3) * 0.5) * 0.04;
              const lookAround = (Math.sin(elapsed * 0.5) * 0.05) + (Math.cos(elapsed * 0.3) * 0.03);

              if (currentAction === "idle") {
                smoothBone(bones.head, headSway, lookAround, sway, delta * 2);
                smoothBone(bones.neck, headSway * 0.5, lookAround * 0.5, 0, delta * 2);
                smoothBone(bones.spine, breath, 0, sway * 0.5, delta * 2);
                smoothBone(bones.chest, breath * 0.5, 0, 0, delta * 2);
                smoothBone(bones.leftUpperArm, 0.4, 0, 0.3 + Math.sin(elapsed * 1.2) * 0.03, delta * 2);
                smoothBone(bones.rightUpperArm, 0.4, 0, -0.3 + Math.sin(elapsed * 1.2 + 1) * 0.03, delta * 2);
                setExp("relaxed", 1);
              }

              if (currentAction === "shy") {
                const t = Math.min(actionProgress / 1.5, 1);
                const t2 = Math.min(actionProgress / 2.0, 1);

                smoothBone(bones.head, 0.15 + Math.sin(elapsed * 4) * 0.04, 0, 0.25, delta * 3);
                smoothBone(bones.neck, 0.08, 0, 0.1, delta * 3);
                smoothBone(bones.spine, 0.05, 0, 0.08, delta * 3);
                smoothBone(bones.chest, 0.03, 0, 0.05, delta * 3);

                smoothBone(bones.leftUpperArm, 0.4 - 1.0 * t, 0, 0.3 + 0.6 * t, delta * 4);
                smoothBone(bones.leftLowerArm, -0.7 - 0.5 * t, 0, 0, delta * 4);
                smoothBone(bones.leftHand, -0.3 * t, 0, 0, delta * 4);

                smoothBone(bones.rightUpperArm, 0.4 - 1.0 * t2, 0, -0.3 - 0.6 * t2, delta * 4);
                smoothBone(bones.rightLowerArm, -0.7 - 0.5 * t2, 0, 0, delta * 4);
                smoothBone(bones.rightHand, -0.3 * t2, 0, 0, delta * 4);

                smoothBone(bones.shoulders, 0.05 * t, 0, 0, delta * 3);

                setExp("relaxed", 0.5);
                setExp("happy", 0.3);
              }

              if (currentAction === "smile") {
                smoothBone(bones.head, -0.05 + Math.sin(elapsed * 2) * 0.03, 0, sway * 0.8, delta * 2);
                smoothBone(bones.neck, -0.02, 0, 0, delta * 2);
                smoothBone(bones.spine, breath, 0, sway * 0.3, delta * 2);
                smoothBone(bones.leftUpperArm, 0.4, 0, 0.3 + Math.sin(elapsed * 2) * 0.06, delta * 2);
                smoothBone(bones.rightUpperArm, 0.4, 0, -0.3 + Math.sin(elapsed * 2 + 1) * 0.06, delta * 2);

                setExp("happy", 1);
                setExp("relaxed", 0.8);
              }

              if (currentAction === "hair") {
                const t = Math.min(actionProgress / 1.5, 1);
                const sweep = Math.sin(elapsed * 2.5) * 0.15;

                smoothBone(bones.head, 0.05, 0, -0.08 + sweep, delta * 3);
                smoothBone(bones.neck, 0.03, 0, -0.04, delta * 3);
                smoothBone(bones.spine, 0.02, 0, -0.03, delta * 3);
                smoothBone(bones.chest, 0.01, 0, -0.02, delta * 3);

                smoothBone(bones.rightUpperArm, 0.4 - 1.2 * t, 0, -0.3 - 0.7 * t, delta * 3);
                smoothBone(bones.rightLowerArm, -0.7 - 0.8 * t + sweep, 0, 0.2 * t, delta * 3);
                smoothBone(bones.rightHand, -0.4 * t, 0, 0.1 * t, delta * 3);

                smoothBone(bones.shoulders, 0.03 * t, 0, -0.02 * t, delta * 3);

                setExp("relaxed", 1);
                setExp("happy", 0.6);
              }

              if (currentAction === "tilt") {
                smoothBone(bones.head, 0.06, 0, 0.2 + Math.sin(elapsed * 1.8) * 0.04, delta * 2);
                smoothBone(bones.neck, 0.03, 0, 0.1, delta * 2);
                smoothBone(bones.spine, breath, 0, 0.05, delta * 2);
                smoothBone(bones.hips, 0, 0, Math.sin(elapsed * 1.2) * 0.02, delta * 2);

                setExp("happy", 0.8);
                setExp("relaxed", 0.6);
              }

              if (isWaving) {
                const wave = Math.sin(elapsed * 8) * 0.4;
                smoothBone(bones.rightUpperArm, -0.5, 0, -2.0 + wave, delta * 6);
                smoothBone(bones.rightLowerArm, -0.3 + wave * 0.3, 0, 0, delta * 6);
                smoothBone(bones.rightHand, -0.2, 0, wave * 0.2, delta * 6);
                smoothBone(bones.head, 0, 0, 0.05, delta * 4);
                setExp("happy", 1);
              }

              if (isTalking && em) {
                try {
                  em.setValue("aa", 0.3 + Math.abs(Math.sin(elapsed * 12)) * 0.7);
                  em.setValue("happy", 0.4);
                } catch (_) {}
              }
            },
          });
        },
        (progress) => {
          console.log("Loading VRM...", Math.round((progress.loaded / progress.total) * 100) + "%");
        },
        (err) => {
          console.error("VRM load error:", err);
          reject(err);
        }
      );
    } catch (err) {
      console.error("VRM import error:", err);
      reject(err);
    }
  });
}

export function loadModel(path) {
  return new Promise((resolve, reject) => {
    import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(1, 1, 1);
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
            }
          });
          resolve(model);
        },
        undefined,
        reject
      );
    });
  });
}
