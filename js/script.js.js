const themeBtn = document.getElementById("theme-btn");
const thumb = document.querySelector(".thumb");

// ===========================
// THEME
// ===========================

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    if (thumb) {
        thumb.textContent = "🌙";
    }

} else {

    if (thumb) {
        thumb.textContent = "☀️";
    }

}

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            if (thumb) {
                thumb.textContent = "🌙";
            }

        } else {

            localStorage.setItem("theme", "light");

            if (thumb) {
                thumb.textContent = "☀️";
            }

        }

    });

}

// ===========================
// AUTO LANGUAGE VOICE
// ===========================

function createSpeech(text){

    const speech = new SpeechSynthesisUtterance(text);

    // Detect Spanish or English automatically
    const isSpanish =
        /[¿¡ñáéíóúü]/i.test(text) ||
        /\b(hola|gracias|buenos|buenas|adiós|hasta|por favor|cómo|estás|decidesE|casa|trabajo|día|mañana|sí|no|mucho gusto)\b/i.test(text);

    speech.lang = isSpanish ? "es-ES" : "en-US";

    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;

    const voices = speechSynthesis.getVoices();

    const voice = voices.find(v =>
        v.lang.startsWith(isSpanish ? "es" : "en")
    );

    if (voice) {
        speech.voice = voice;
    }

    return speech;

}

// ===========================
// SPEAK ONE PARAGRAPH
// ===========================

document.querySelectorAll(".lesson-section p").forEach(paragraph => {

    paragraph.style.cursor = "pointer";

    paragraph.addEventListener("click", () => {

        speechSynthesis.cancel();

        // Remove old highlight
        document.querySelectorAll(".lesson-section p").forEach(p => {

            p.classList.remove("active");

        });

        // Highlight clicked paragraph
        paragraph.classList.add("active");

        const speech = createSpeech(paragraph.textContent);

        speech.onend = () => {

            paragraph.classList.remove("active");

        };

        speechSynthesis.speak(speech);

    });

});

// ===========================
// PLAY WHOLE STORY
// ===========================

const audioBtn = document.getElementById("audio-btn");

let paragraphs = [];
let currentIndex = 0;

let isPlaying = false;
let isPaused = false;

if(audioBtn){

    audioBtn.addEventListener("click", () => {

        // Resume
        if(isPaused){

            speechSynthesis.resume();

            isPaused = false;
            isPlaying = true;

            audioBtn.textContent = "⏸ Pause";

            return;

        }

        // Pause
        if(isPlaying){

            speechSynthesis.pause();

            isPaused = true;
            isPlaying = false;

            audioBtn.textContent = "▶ Resume";

            return;

        }

        // Play
        speechSynthesis.cancel();

        paragraphs = [...document.querySelectorAll(".lesson-section p")];

        currentIndex = 0;

        speakNext();

    });

}

function speakNext(){

    if(currentIndex >= paragraphs.length){

        isPlaying = false;
        isPaused = false;

        if(audioBtn){

            audioBtn.textContent = "▶ Play Story";

        }

        return;

    }

    // Remove previous highlight
paragraphs.forEach(p => p.classList.remove("active"));

// Highlight current paragraph
paragraphs[currentIndex].classList.add("active");

// Scroll smoothly
paragraphs[currentIndex].scrollIntoView({

    behavior:"smooth",

    block:"center"

});
    
    const speech = createSpeech(paragraphs[currentIndex].textContent);

    isPlaying = true;
    isPaused = false;

    if(audioBtn){

        audioBtn.textContent = "⏸ Pause";

    }

    speech.onend = () => {

        currentIndex++;

        if(!isPaused){

            speakNext();

        }

    };

    speechSynthesis.speak(speech);

}


