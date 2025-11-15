document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, JS is running!");

    // --- 检查歌曲选择 ---
    const currentSongElement = document.querySelector('.current-song');
    const selectedSong = localStorage.getItem('selectedSong');
    
    if (selectedSong && currentSongElement) {
        currentSongElement.innerText = selectedSong;
        // localStorage.removeItem('selectedSong'); 
    }

    // --- 主页 (index.html) 专属功能 ---
    
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const progressHandle = document.querySelector('.progress-handle');

    if (progressBarContainer && progressBar && progressHandle) {
        let isDragging = false; 

        function updateProgressBar(event) {
            const rect = progressBarContainer.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerLeft = rect.left;
            
            let mouseX = event.clientX - containerLeft;

            if (mouseX < 0) mouseX = 0;
            if (mouseX > containerWidth) mouseX = containerWidth;
            
            const newWidthPercent = (mouseX / containerWidth) * 100;
            
            progressBar.style.width = newWidthPercent + '%';
            progressHandle.style.left = newWidthPercent + '%'; 
        }

        progressBarContainer.addEventListener('mousedown', (event) => {
            isDragging = true; 
            updateProgressBar(event); 
            progressHandle.style.opacity = 1;
            progressHandle.style.transition = 'none';
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                updateProgressBar(event);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false; 
                progressHandle.style.opacity = ''; 
                progressHandle.style.transition = ''; 
            }
        });
        
        document.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                progressHandle.style.opacity = '';
                progressHandle.style.transition = '';
            }
        });
    }

    // --- 模式按钮 ---
    const modeButtons = document.querySelectorAll('.mode-controls button');
    if (modeButtons.length > 0) {
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                console.log("Mode switched to: " + button.innerText);
            });
        });
    }

    // --- 速度选择 ---
    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
        speedSelect.addEventListener('change', () => {
            const newSpeed = speedSelect.value;
            console.log("Speed switched to: " + newSpeed);
        });
    }

    // --- 钢琴键 ---
    const pianoKeys = document.querySelectorAll('.key');
    if (pianoKeys.length > 0) {
        pianoKeys.forEach(key => {
            key.addEventListener('mousedown', () => {
                const note = key.dataset.key; 
                console.log("Key down: " + note);
            });
            
            key.addEventListener('mouseup', () => {
                const note = key.dataset.key;
            });
        });
    }

});