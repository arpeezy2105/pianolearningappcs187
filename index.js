document.addEventListener("DOMContentLoaded", () => {
    console.log("Piano mapping C#3 → C6");

    // notes
    const noteOrder = [
        "C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
        "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
        "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
        "C6"
    ];

    // mapping
    const noteToFile = {
        "C#3": "d3.mp3",
        "D3":  "csh3.mp3",
        "D#3": "e3.mp3",
        "E3":  "dsh3.mp3",
        "F3":  "f3.mp3",
        "F#3": "g3.mp3",
        "G3":  "fsh3.mp3",
        "G#3": "a3.mp3",
        "A3":  "gsh3.mp3",
        "A#3": "b3.mp3",
        "B3":  "ash3.mp3",

        "C4":  "c4.mp3",
        "C#4": "d4.mp3",
        "D4":  "csh4.mp3",
        "D#4": "e4.mp3",
        "E4":  "dsh4.mp3",
        "F4":  "f4.mp3",
        "F#4": "g4.mp3",
        "G4":  "fsh4.mp3",
        "G#4": "a4.mp3",
        "A4":  "gsh4.mp3",
        "A#4": "b4.mp3",
        "B4":  "ash4.mp3",

        "C5":  "c5.mp3",
        "C#5": "d5.mp3",
        "D5":  "csh5.mp3",
        "D#5": "e5.mp3",
        "E5":  "dsh5.mp3",
        "F5":  "f5.mp3",
        "F#5": "g5.mp3",
        "G5":  "fsh5.mp3",
        "G#5": "a5.mp3",
        "A5":  "gsh5.mp3",
        "A#5": "b5.mp3",
        "B5":  "ash5.mp3",

        "C6":  "c6.mp3"
    };

    const keys = Array.from(document.querySelectorAll(".keyboard .key"));

    if (keys.length !== noteOrder.length) {
        console.warn("Key count and note count differ:",
            "keys =", keys.length, "notes =", noteOrder.length);
    }

    // Assign each key a musical note
    keys.forEach((key, i) => {
        const note = noteOrder[i];
        key.dataset.note = note;
    });

    // Styling for pressed key
    const style = document.createElement("style");
    style.textContent = `
        .active-ui {
            background-color: var(--color-accent) !important;
            box-shadow: 0 0 12px var(--color-accent);
        }
    `;
    document.head.appendChild(style);

    function playNote(note) {
        const file = noteToFile[note];
        if (!file) return;
        const audio = new Audio("piano/" + file);
        audio.currentTime = 0;
        audio.play();
    }

    // Mouse → play
    keys.forEach(key => {
        key.addEventListener("mousedown", () => {
            const note = key.dataset.note;
            key.classList.add("active-ui");
            playNote(note);
        });

        key.addEventListener("mouseup", () =>
            key.classList.remove("active-ui")
        );
        key.addEventListener("mouseleave", () =>
            key.classList.remove("active-ui")
        );
    });

    // Computer keyboard mapping around 4th octave
    const keyMap = {
        a: "C4",
        w: "C#4",
        s: "D4",
        e: "D#4",
        d: "E4",
        f: "F4",
        t: "F#4",
        g: "G4",
        y: "G#4",
        h: "A4",
        u: "A#4",
        j: "B4",
        k: "C5"
    };

    document.addEventListener("keydown", (e) => {
        const note = keyMap[e.key];
        if (!note) return;
        const keyEl = keys.find(k => k.dataset.note === note);
        if (keyEl) keyEl.classList.add("active-ui");
        playNote(note);
    });

    document.addEventListener("keyup", (e) => {
        const note = keyMap[e.key];
        if (!note) return;
        const keyEl = keys.find(k => k.dataset.note === note);
        if (keyEl) keyEl.classList.remove("active-ui");
    });



//midi support below


function midiToNoteName(midiNumber) {
    const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = Math.floor(midiNumber / 12) - 1;
    const name = names[midiNumber % 12];
    return name + octave;
}

// mapping swaps cuz of weird keyboard html
const midiSwap = {
    "C#": "D",
    "D":  "C#",
    "D#": "E",
    "E":  "D#",
    "F":  "F",
    "F#": "G",
    "G":  "F#",
    "G#": "A",
    "A":  "G#",
    "A#": "B",
    "B":  "A#"
};

// Apply swap, keeping octave correct
function applyCustomSwap(noteName) {
    const match = noteName.match(/^([A-G]#?)(\d)$/);
    if (!match) return noteName;

    const [, pitch, octave] = match;
    const swappedPitch = midiSwap[pitch] || pitch;

    return swappedPitch + octave;
}

// Highlight UI key
function highlightKey(note) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) key.classList.add("active-ui");
}

// Remove highlight
function unhighlightKey(note) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) key.classList.remove("active-ui");
}

// Handle incoming MIDI messages
function onMIDIMessage(message) {
    const [status, noteNumber, velocity] = message.data;

    let noteName = midiToNoteName(noteNumber);

    // apply swaps
    noteName = applyCustomSwap(noteName);

    // Key down
    if (status === 144 && velocity > 0) {
        playNote(noteName);
        highlightKey(noteName);
    }

    // Key up
    if (status === 128 || (status === 144 && velocity === 0)) {
        unhighlightKey(noteName);
    }
}

function onMIDISuccess(midiAccess) {
    console.log("MIDI ready!");

    for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    console.warn("Could not access MIDI devices.");
}

// Request MIDI Access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    console.warn("WebMIDI not supported in this browser.");
}


});
