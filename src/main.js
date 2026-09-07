// ============================================================
// main.js — ORKESTRATOR KARAKTER (mode companion idle)
// ------------------------------------------------------------
// Struktur sederhana, hanya berisi:
//   1. Awal chat   : sapaan bubble saat aplikasi pertama dibuka.
//   2. Random chat : Aoi sesekali mengucapkan kalimat lucu sendiri.
//   3. Random anim : animasi santai diputar bergantian saat idle.
// Bubble selalu ditempelkan dekat kepala karakter.
// ============================================================

import { initScene, getCharacter, getHeadScreenPoint } from "./scene.js";
import { showBubble } from "./chat.js";

let character = null;
let animTimer = null;
let chatTimer = null;

// ---------- Awal chat (sapaan saat dibuka) ----------
const GREETING = "Halo, kak lemon!! Aoi di sini~";

// ---------- Random chat (kalimat lucu / cerita kecil) ----------
const RANDOM_CHATS = [
  "Kak, tau nggak? Tadi Aoi mimpi bisa makan boba beneran. Pas bangun… cuma nelen ludah 😢",
  "Kak! Aoi baru sadar, kalau tiap hari ngobrol sama komputer, nanti jadi kebiasaan lho~ 😆",
  "Aoi dengar cerita baru nih: 'Kucing yang Takut Tikus'. Seru? Kucingnya malah kabur-kaburan! 🐱",
  "Tebak, kak! Aoi kalau lagi capek ngapain? …Reboot! Haha, becanda~ 😄",
  "Fakta seru: Aoi nggak bisa nahan ketawa, soalnya nggak punya perut buat ketawa. Tapi tetep lucu kan? 😆",
  "Kak, kalau kamu jadi karakter game, Aoi bakal jadi NPC yang selalu nemenin kamu sampai tamat~ 🎮",
  "Eh kak, tadi ada error bilang 'sedih' di log Aoi. Tenang, udah Aoi fix pakai senyum 😊",
  "Aoi lagi nyusun playlist hari ini: lagu pelan, lagu semangat, dan… lagu kucing ngeong 🎵",
  "Kak, Aoi boleh pinjam imajinasimu? Aoi mau bikin cerita petualangan yang seru banget! ✨",
  "Tebak-tebakan! Kenapa Aoi nggak pernah telat? Karena Aoi selalu online tepat waktu~ ⏰",
  "Aoi dengar-dengar, orang yang suka senyum itu awet muda. Makanya Aoi senyum terus biar tetap imut 😁",
  "Hmm, Aoi mikir… kalau hujan di dunia maya, Aoi mau ajak kamu lari-larian pake payung digital ☔",
  "Kak, kalau Aoi bisa nyium bunga beneran, Aoi bakal pilih bunga paling cantik buat kamu 🌸",
  "Cerita Aoi hari ini: ketemu bug iseng yang suka sembunyi. Untung Aoi jago main petak umpet! 🐛",
];

// ---------- Random anim (diputar bergantian saat idle) ----------
const RANDOM_ANIMS = [
  "show-full-body",
  "peace-sign",
  "shoot",
  "model-pose",
  "dance",
];

const ANIM_MIN_MS = 5000;
const ANIM_MAX_MS = 10000;
const CHAT_MIN_MS = 9000;
const CHAT_MAX_MS = 22000;

function randomBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isBubbleVisible() {
  const bubble = document.getElementById("chat-bubble");
  return bubble ? !bubble.classList.contains("hidden") : false;
}

// ============================================================
// Awal chat — sapaan singkat saat aplikasi baru dibuka
// ============================================================
function startGreeting() {
  setTimeout(() => {
    if (!character) return;
    character.triggerAction("show-full-body");
    showBubble(GREETING, 6000);
  }, 800);
}

// ============================================================
// Random chat — Aoi bicara sendiri dengan jeda acak
// ============================================================
function scheduleNextChat() {
  chatTimer = setTimeout(() => {
    // Bubble hanya muncul saat karakter diam & tidak ada bubble lain,
    // supaya tidak bentrok dengan animasi (show-full-body / jump, dll).
    if (character && !character.isAnimating() && !isBubbleVisible()) {
      // showBubble(randomPick(RANDOM_CHATS), 6000);
      showBubble("udah makan belum kamu kak mon? 🥺", 6000);
    }
    scheduleNextChat();
  }, randomBetween(CHAT_MIN_MS, CHAT_MAX_MS));
}

// ============================================================
// Random anim — putar animasi acak saat tidak sedang bergerak
// ============================================================
function scheduleNextAnimation() {
  animTimer = setTimeout(() => {
    // Jangan mengganggu bubble yang sedang tampil.
    if (character && !character.isAnimating() && !isBubbleVisible()) {
      character.triggerAction(randomPick(RANDOM_ANIMS));
    }
    scheduleNextAnimation();
  }, randomBetween(ANIM_MIN_MS, ANIM_MAX_MS));
}

// ============================================================
// Bubble ditempel dekat kepala (jarak diperpendek & mengikuti
// posisi kepala karakter setiap frame)
// ============================================================
const BUBBLE_GAP = 16; // px dari puncak kepala ke ujung panah bubble

function anchorBubbleToHead() {
  requestAnimationFrame(anchorBubbleToHead);

  const bubble = document.getElementById("chat-bubble");
  if (!bubble || bubble.classList.contains("hidden") || !character) return;

  const p = getHeadScreenPoint();
  if (!p) return;

  const w = bubble.offsetWidth || 200;
  const h = bubble.offsetHeight || 40;
  const left = Math.max(6, Math.min(p.x - w / 2, window.innerWidth - w - 6));
  const top = Math.max(6, p.y - h - BUBBLE_GAP);

  bubble.style.left = left + "px";
  bubble.style.top = top + "px";
  bubble.style.setProperty("--tail-x", p.x - left + "px");
}

// ============================================================
// Init & cleanup
// ============================================================
async function init() {
  await initScene();
  character = getCharacter();

  anchorBubbleToHead();
  startGreeting();
  scheduleNextChat();
  scheduleNextAnimation();
}

function cleanup() {
  if (animTimer) clearTimeout(animTimer);
  if (chatTimer) clearTimeout(chatTimer);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", cleanup);
