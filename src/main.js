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

// Reaction triggers based on keywords in user input
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
  stretch: ["bosan", "capek", "lelah", "ngantuk", "istirahat"],
};

// Response text per reaction. SATU-SATUNYA gerakan yang ada adalah
// "greeting" (dari greeting.vrma); reaksi lain hanya teks, tanpa animasi.
const REACTION_RESPONSES = {
  greeting: { text: "Hai juga~ Senang lihat kamu lagi!", anim: "greeting" },
  smile: { text: "Makasih ya~ Aoi senang!", anim: null },
  nod: { text: "Oke! Aoi ngerti~", anim: null },
  thinking: { text: "Hmm, Aoi pikirkan dulu ya...", anim: null },
  shy: { text: "Eh?! Jangan begitu dong~ *malu*", anim: null },
  reactionLove: { text: "Aoi juga sayang kamu~!", anim: null },
  reactionSurprise: { text: "Wah, serius?! Keren ya!", anim: null },
  reactionSad: { text: "Aoi di sini buat kamu, ya~", anim: null },
  lean: { text: "Aoi mendekat nih~", anim: null },
  stretch: { text: "Aoi juga mau meregangkan badan~", anim: null },
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
}

function handleSend() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  processUserInput(text);
}

function processUserInput(text) {
  const { text: response, anim } = getLocalResponse(text);

  // Trigger reaction animation if detected
  if (anim && character) {
    character.triggerAction(anim, 4);
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

  // Greeting on startup (satu-satunya gerakan karakter)
  setTimeout(() => {
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    showBubble(greeting, 6000);
    character?.triggerAction("greeting");
  }, 500);
}

document.addEventListener("DOMContentLoaded", init);
