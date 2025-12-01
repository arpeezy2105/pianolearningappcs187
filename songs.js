const NOTE_ORDER = [
    "C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
    "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
    "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
    "C6"
];

const NOTE_TO_FILE = {
    "C#3":"csh3.mp3","D3":"d3.mp3","D#3":"dsh3.mp3","E3":"e3.mp3",
    "F3":"f3.mp3","F#3":"fsh3.mp3","G3":"g3.mp3","G#3":"gsh3.mp3",
    "A3":"a3.mp3","A#3":"ash3.mp3","B3":"b3.mp3",

    "C4":"c4.mp3","C#4":"csh4.mp3","D4":"d4.mp3","D#4":"dsh4.mp3",
    "E4":"e4.mp3","F4":"f4.mp3","F#4":"fsh4.mp3","G4":"g4.mp3",
    "G#4":"gsh4.mp3","A4":"a4.mp3","A#4":"ash4.mp3","B4":"b4.mp3",

    "C5":"c5.mp3","C#5":"csh5.mp3","D5":"d5.mp3","D#5":"dsh5.mp3",
    "E5":"e5.mp3","F5":"f5.mp3","F#5":"fsh5.mp3","G5":"g5.mp3",
    "G#5":"gsh5.mp3","A5":"a5.mp3","A#5":"ash5.mp3","B5":"b5.mp3",

    "C6":"c6.mp3"
};

function playSampleNote(note) {
    const file = NOTE_TO_FILE[note];
    if (!file) return;
    const audio = new Audio("piano/" + file);
    audio.currentTime = 0;
    audio.play();
}

const LOWEST_MIDI = 49;

function midiNumberToNote(midiNote) {
    const index = midiNote - LOWEST_MIDI;
    if (index < 0 || index >= NOTE_ORDER.length) return null;
    return NOTE_ORDER[index];
}

async function playMidi(midi) {
    console.log("Playing MIDI with custom samples");

    let now = 0; // seconds from start

    midi.track.forEach(track => {
        track.event.forEach(event => {
            if (event.type === 9 && event.data[1] > 0) {
                const midiNote = event.data[0];
                const noteName = midiNumberToNote(midiNote);
                if (noteName) {
                    setTimeout(() => playSampleNote(noteName), now * 1000);
                }
            }

            if (event.deltaTime) {
                now += event.deltaTime / 1000;
            }
        });
    });
}
        