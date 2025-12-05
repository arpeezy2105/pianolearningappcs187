const NOTE_ORDER = [
    "C3","C#3","D3","D#3","E3",
    "F3","F#3","G3","G#3","A3","A#3","B3",
    "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
    "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
    "C6"
];

const LOWEST_MIDI = 49;

function midiNumberToNote(midiNote) {
    const index = midiNote - LOWEST_MIDI;
    if (index < 0 || index >= NOTE_ORDER.length) return null;
    return NOTE_ORDER[index];
}

function buildPracticeSteps(midiJson) {
    const stepsMap = new Map();
    if (!midiJson.track) return [];

    midiJson.track.forEach(track => {
        let currentTime = 0;
        track.event.forEach(event => {
            currentTime += event.deltaTime || 0;
            if (event.type === 9 && event.data && event.data[1] > 0) {
                const midiNote = event.data[0];
                const noteName = midiNumberToNote(midiNote);
                if (!noteName) return;

                if (!stepsMap.has(currentTime)) {
                    stepsMap.set(currentTime, new Set());
                }
                stepsMap.get(currentTime).add(noteName);
            }
        });
    });

    const times = Array.from(stepsMap.keys()).sort((a, b) => a - b);
    return times.map(time => ({
        time,
        notes: Array.from(stepsMap.get(time))
    }));
}

function findAuthorInMidi(midi) {
    try {
        if(midi.track && midi.track[0] && midi.track[0].event) {
            for (const event of midi.track[0].event) {
                if (event.type === 3) return event.data; 
                if ((event.type === 1 || event.type === 2) && typeof event.data === 'string') {
                    if (event.data.toLowerCase().includes('by')) return event.data;
                }
            }
        }
    } catch (e) { console.warn(e); }
    return 'Unknown Artist'; 
}

function toggleHeartIcon(icon) {
    icon.classList.toggle('active'); 
    if (icon.classList.contains('active')) {
        icon.innerText = '♥'; 
    } else {
        icon.innerText = '♡'; 
    }
}

function loadSongAndPlay(songData) {
    if (!songData || !songData.steps || songData.steps.length === 0) {
        alert("This song has no playable data.");
        return;
    }
    localStorage.setItem("currentSongName", songData.fileName);
    localStorage.setItem("currentSongSteps", JSON.stringify(songData.steps));
    
    window.location.href = "index.html";
}

function addListenersToRow(row, songData) {
    row.addEventListener('click', () => {
        if (songData) {
            loadSongAndPlay(songData);
        } else {
            const name = row.cells[0].innerText;
            alert(`Selected ${name}. (Please upload a MIDI file to play)`);
        }
    });

    const heartIcon = row.querySelector('.heart-icon');
    if (heartIcon) {
        heartIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleHeartIcon(heartIcon);
        });
    }
}

function renderSongRow(songData) {
    const tbody = document.getElementById("uploaded-songs-body");
    if (!tbody) return;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${songData.fileName}</td>
        <td>${songData.author}</td>
        <td>${songData.date}</td>
        <td><span class="heart-icon">♡</span></td>
    `;
    
    tbody.appendChild(row);
    addListenersToRow(row, songData);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Songs JS (Session Storage Version) Ready");

    const recommendedRows = document.querySelectorAll('#recommended-songs-body tr');
    recommendedRows.forEach(row => addListenersToRow(row, null));

    const uploadedBody = document.getElementById("uploaded-songs-body");
    
    if (uploadedBody) {
        uploadedBody.innerHTML = ""; 
    }

    const sessionList = JSON.parse(sessionStorage.getItem("demoUploadedSongs")) || [];
    
    if (sessionList.length > 0) {
        sessionList.forEach(song => {
            renderSongRow(song);
        });
    }

    const searchBar = document.querySelector('.search-bar');
    const allSongTables = document.querySelectorAll('.song-table tbody'); 

    if (searchBar) {
        searchBar.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase(); 
            allSongTables.forEach(tableBody => {
                const rows = tableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    if(row.cells.length < 2) return;
                    const songName = row.cells[0].innerText.toLowerCase();
                    const author = row.cells[1].innerText.toLowerCase();

                    if (songName.includes(searchTerm) || author.includes(searchTerm)) {
                        row.style.display = ''; 
                    } else {
                        row.style.display = 'none'; 
                    }
                });
            });
        });
    }

    const uploadBtn = document.getElementById("upload-btn");
    
    if (uploadBtn) {
        uploadBtn.addEventListener("click", () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.mid, .midi';
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const uint8Array = new Uint8Array(e.target.result);
                        
                        const midiJson = MidiParser.parse(uint8Array);
                        const steps = buildPracticeSteps(midiJson);
                        const author = findAuthorInMidi(midiJson);
                        const date = new Date().toLocaleDateString();

                        if (steps.length === 0) {
                            alert("Warning: No playable notes found.");
                            return;
                        }

                        const newSong = { 
                            fileName: file.name, 
                            author: author, 
                            date: date, 
                            steps: steps 
                        };

                        const currentList = JSON.parse(sessionStorage.getItem("demoUploadedSongs")) || [];
                        if (!currentList.find(s => s.fileName === file.name)) {
                            currentList.push(newSong);
                            sessionStorage.setItem("demoUploadedSongs", JSON.stringify(currentList));
                            renderSongRow(newSong); 
                        }

                        if(confirm(`"${file.name}" uploaded! Play now?`)) {
                            loadSongAndPlay(newSong);
                        }

                    } catch (err) {
                        console.error('Error parsing MIDI:', err);
                        alert("Failed to parse MIDI file.");
                    }
                };
                reader.readAsArrayBuffer(file);
            });

            fileInput.click(); 
        });
    }
});