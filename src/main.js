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

function getLocalResponse(_input) {
  return IDLE_RESPONSES[Math.floor(Math.random() * IDLE_RESPONSES.length)];
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
  const response = getLocalResponse(text);

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

  setTimeout(() => {
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    showBubble(greeting, 6000);
    character?.setTalking(true);
    character?.triggerAction("greeting", 4);
    setTimeout(() => {
      character?.setTalking(false);
    }, 3000);
  }, 500);
}

document.addEventListener("DOMContentLoaded", init);
