import { initScene, getCharacter } from "./scene.js";
import { showBubble } from "./chat.js";
import {
  initSpeech,
  startListening,
  stopListening,
  toggleListening,
  speak,
} from "./speech.js";

let currentMode = "chat";
let character = null;
let showBodyInterval = null;

const GREETINGS = [
  "Hai! Aku Aoi~ Ada yang bisa aku bantu?",
  "Halo! Senang bertemu denganmu!",
  "Konnichiwa! Aoi di sini~",
];

const IDLE_RESPONSES = [
  "Hmm, menarik sekali!",
  "Oh begitu ya~",
  "Aku mengerti!",
  "Wah, keren!",
  "Boleh cerita lagi?",
  "Hehe, lucu ya~",
  "Aoi juga begitu pikirnya!",
];

// Reaction triggers based on keywords in user input.
// id animasi = nama file .vrma di public/animations/ (terdaftar di character.js).
const REACTION_KEYWORDS = {
  greeting: ["hai", "halo", "hey", "hi", "konichiwa", "pagi", "siang", "malam"],
  smile: ["bagus", "keren", "hebat", "cantik", "indah", "suka", "sayang"],
  nod: ["ya", "oke", "benar", "setuju", "paham", "mengerti", "betul"],
  thinking: ["kenapa", "mengapa", "gimana", "bagaimana", "kapan", "dimana", "apa"],
  shy: ["malu", "gemes", "lucu banget", "imut"],
  reactionLove: ["sayang", "cinta", "love", "suka banget", "cantik banget"],
  reactionSurprise: ["wow", "wah", "serius", "beneran", "asli", "gila"],
  reactionSad: ["sedih", "kesepian", "galau", "kecewa", "susah"],
  lean: ["dekat", "sini", "kemari", "mendekat"],
  stretch: ["bosan", "capek", "lelah", "istirahat"],
  sleepy: ["ngantuk", "mengantuk", "nguap"],
  goodbye: ["bye", "dadah", "dah", "sampai jumpa", "sampai nanti", "selamat tinggal", "pamit"],
  excited: ["hore", "yey", "yay", "yes", "menang", "asik", "seru banget"],
  angry: ["marah", "kesal", "dongkol", "sebel", "bete", "geram"],
  spin: ["putar", "muter", "berputar", "putaran", "spin"],
  squat: ["jongkok"],
  showBody: ["tampil", "pamer", "gaya", "perlihatkan"],
  peace: ["damai", "peace", "tanda damai"],
  shoot: ["tembak", "dor", "bang", "pew"],
  lookAround: ["cari", "mencari", "lihat-lihat"],
  modelPose: ["selfie", "foto", "berpose", "strike a pose"],
};

// Response text + animasi per reaksi. Semua id mengacu ke file .vrma yang
// sudah didaftarkan di character.js; null berarti hanya teks tanpa gerakan.
const REACTION_RESPONSES = {
  greeting: { text: "Hai juga~ Senang lihat kamu lagi!", anim: "greeting" },
  smile: { text: "Makasih ya~ Aoi senang!", anim: "clapping" },
  nod: { text: "Oke! Aoi ngerti~", anim: null },
  thinking: { text: "Hmm, Aoi pikirkan dulu ya...", anim: "thinking" },
  shy: { text: "Eh?! Jangan begitu dong~ *malu*", anim: "blush" },
  reactionLove: { text: "Aoi juga sayang kamu~!", anim: "peace-sign" },
  reactionSurprise: { text: "Wah, serius?! Keren ya!", anim: "surprised" },
  reactionSad: { text: "Aoi di sini buat kamu, ya~", anim: "sad" },
  lean: { text: "Aoi mendekat nih~", anim: null },
  stretch: { text: "Aoi juga mau meregangkan badan~", anim: "relax" },
  sleepy: { text: "Aoi mulai ngantuk juga...", anim: "sleepy" },
  goodbye: { text: "Sampai jumpa lagi ya~!", anim: "goodbye" },
  excited: { text: "Horeee~ Senangnya!", anim: "jump" },
  angry: { text: "Hmm, Aoi sebel juga dengernya!", anim: "angry" },
  spin: { text: "Wush~ Aoi berputar!", anim: "spin" },
  squat: { text: "Aoi jongkok dulu deh~", anim: "squat" },
  showBody: { text: "Nih, lihat Aoi tampil~", anim: "show-full-body" },
  peace: { text: "Peace~! ✌️", anim: "peace-sign" },
  shoot: { text: "Dor dor! Aoi jago nembak~", anim: "shoot" },
  lookAround: { text: "Aoi lihat-lihat dulu ya...", anim: "look-around" },
  modelPose: { text: "Cheese~! Pose dulu dong!", anim: "model-pose" },
};

function detectReaction(input) {
  const lower = input.toLowerCase();
  for (const [reaction, keywords] of Object.entries(REACTION_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return reaction;
    }
  }
  return null;
}

function getLocalResponse(_input) {
  const reaction = detectReaction(_input);
  if (reaction && REACTION_RESPONSES[reaction]) {
    return REACTION_RESPONSES[reaction];
  }
  return { text: IDLE_RESPONSES[Math.floor(Math.random() * IDLE_RESPONSES.length)], anim: null };
}

function initModeToggle() {
  const btnChat = document.getElementById("btn-chat");
  const btnVoice = document.getElementById("btn-voice");
  const userInput = document.getElementById("user-input");
  const btnSend = document.getElementById("btn-send");
  const btnMic = document.getElementById("btn-mic");

  btnChat.addEventListener("click", () => {
    currentMode = "chat";
    btnChat.classList.add("active");
    btnVoice.classList.remove("active");
    userInput.classList.remove("hidden");
    btnSend.classList.remove("hidden");
    btnMic.classList.add("hidden");
    stopListening();
  });

  btnVoice.addEventListener("click", () => {
    currentMode = "voice";
    btnVoice.classList.add("active");
    btnChat.classList.remove("active");
    userInput.classList.add("hidden");
    btnSend.classList.add("hidden");
    btnMic.classList.remove("hidden");
  });

  btnMic.addEventListener("click", () => {
    toggleListening();
  });

  btnSend.addEventListener("click", handleSend);

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  // Animasi saat mengetik
  userInput.addEventListener("input", () => {
    if (character && userInput.value.length > 0) {
      // Ketika sedang mengetik, tampilkan animasi thinking/look-around
      character.triggerAction("thinking");
    }
  });

  // Interval untuk memutar show-full-body setiap 5 detik jika tidak ada animasi lain
  showBodyInterval = setInterval(() => {
    if (character && !character.isAnimating()) {
      character.triggerAction("show-full-body");
    }
  }, 5000);
}

function handleSend() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";

  // Animasi saat menjelaskan/menjawab (seperti sedang bicara/explaining)
  if (character) {
    character.triggerAction("surprised");  //
  }

  processUserInput(text);
}

function processUserInput(text) {
  const { text: response, anim } = getLocalResponse(text);

  // Trigger reaction animation if detected
  if (anim && character) {
    character.triggerAction(anim);
  }

  if (currentMode === "voice") {
    character?.setTalking(true);
    speak(response, () => {
      character?.setTalking(false);
    });
    showBubble(response);
  } else {
    character?.setTalking(true);
    showBubble(response, 6000);
    setTimeout(() => {
      character?.setTalking(false);
    }, 2000);
  }
}

function initSpeechCallbacks() {
  initSpeech((transcript) => {
    processUserInput(transcript);
  });
}

async function init() {
  await initScene();
  character = getCharacter();

  initModeToggle();
  initSpeechCallbacks();

  // Interval untuk memutar show-full-body setiap 5 detik jika tidak ada animasi lain
  showBodyInterval = setInterval(() => {
    if (character && !character.isAnimating()) {
      character.triggerAction("show-full-body");
    }
  }, 5000);

  // Greeting on startup
  setTimeout(() => {
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    showBubble(greeting, 6000);
    character?.triggerAction("show-full-body");
  }, 500);
}

function cleanup() {
  if (showBodyInterval) {
    clearInterval(showBodyInterval);
    showBodyInterval = null;
  }
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", cleanup);
