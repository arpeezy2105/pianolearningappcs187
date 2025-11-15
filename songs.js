function toggleHeartIcon(icon) {
    icon.classList.toggle('active'); 
    
    if (icon.classList.contains('active')) {
        icon.innerText = '♥'; 
        console.log("Song Saved!");
    } else {
        icon.innerText = '♡'; 
        console.log("Song Unsaved!");
    }
}

function selectSongRow(row) {
    const songName = row.cells[0].innerText;
    localStorage.setItem('selectedSong', songName);
    console.log('Selected song: ' + songName);
    window.location.href = 'index.html';
}

function findAuthorInMidi(midi) {
    try {
        const events = midi.track[0].event;
        for (const event of events) {
            if (event.type === 3) {
                return event.string; 
            }
            if (event.type === 1 && (event.string.toLowerCase().includes('by ') || event.string.toLowerCase().includes('composer'))) {
                return event.string;
            }
        }
    } catch (e) {
        console.error('Error parsing MIDI metadata:', e);
    }
    return 'N/A';
}

function addUploadedSongRow(fileName, author) {
    const tableBody = document.getElementById('uploaded-songs-body');
    if (!tableBody) return; 

    const newRow = document.createElement('tr');
    
    const cellName = document.createElement('td');
    cellName.innerText = fileName;
    
    const cellAuthor = document.createElement('td');
    cellAuthor.innerText = author; 
    
    const cellDate = document.createElement('td');
    const today = new Date(); 
    cellDate.innerText = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    
    const cellSave = document.createElement('td');
    const heartIcon = document.createElement('span');
    heartIcon.className = 'heart-icon';
    heartIcon.innerText = '♡';
    cellSave.appendChild(heartIcon);

    newRow.appendChild(cellName);
    newRow.appendChild(cellAuthor);
    newRow.appendChild(cellDate);
    newRow.appendChild(cellSave);

    tableBody.appendChild(newRow);
    addListenersToRow(newRow);
}


function addListenersToRow(row) {
    row.addEventListener('click', () => {
        selectSongRow(row);
    });

    const heartIcon = row.querySelector('.heart-icon');
    if (heartIcon) {
        heartIcon.addEventListener('click', (event) => {
            event.stopPropagation(); 
            toggleHeartIcon(heartIcon);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {

    console.log("Song list page JS is running!");

    const allSongRows = document.querySelectorAll('.song-table tbody tr');
    allSongRows.forEach(row => {
        addListenersToRow(row);
    });


    const uploadButton = document.querySelector('.upload-btn');

    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.mid, .midi'; 
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                console.log('File selected:', file.name);

                const reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        const arrayBuffer = e.target.result;
                        const uint8Array = new Uint8Array(arrayBuffer);
                        
                        const midi = MidiParser.parse(uint8Array);
                        
                        const author = findAuthorInMidi(midi);
                        
                        addUploadedSongRow(file.name, author);

                    } catch (err) {
                        console.error('Error parsing MIDI file:', err);
                        addUploadedSongRow(file.name, 'N/A');
                    }
                };

                reader.readAsArrayBuffer(file);
            });
            
            fileInput.click();
        });
    }

    const searchBar = document.querySelector('.search-bar');
    const allSongTables = document.querySelectorAll('.song-table tbody'); 

    if (searchBar && allSongTables.length > 0) {
        searchBar.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase(); 

            allSongTables.forEach(tableBody => {
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
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

});