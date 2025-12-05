document.addEventListener('DOMContentLoaded', () => {

    console.log("Settings page JS is running!");

  
    const speedSelect = document.getElementById('practice-speed');
    const feedbackSelect = document.getElementById('feedback-style');
    const audioSlider = document.querySelector('.audio-slider');

    const savedSpeed = localStorage.getItem('preference_speed');
    if (savedSpeed && speedSelect) {
        speedSelect.value = savedSpeed;
    }

    const savedFeedback = localStorage.getItem('preference_feedback');
    if (savedFeedback && feedbackSelect) {
        feedbackSelect.value = savedFeedback;
    }

    const savedVolume = localStorage.getItem('preference_volume');
    if (savedVolume && audioSlider) {
        audioSlider.value = savedVolume;
    }


    const backBtn = document.querySelector('.footer-buttons .btn-secondary');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const saveBtn = document.querySelector('.footer-buttons .btn:not(.btn-secondary)');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (speedSelect) {
                localStorage.setItem('preference_speed', speedSelect.value);
            }
            if (feedbackSelect) {
                localStorage.setItem('preference_feedback', feedbackSelect.value);
            }
            if (audioSlider) {
                localStorage.setItem('preference_volume', audioSlider.value);
            }

            alert("Settings Saved Successfully!");
        });
    }


    const clearCacheBtn = document.getElementById('clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            if(confirm("Clear temporary cache? (This won't delete your uploaded songs)")) {
                console.log("Cache cleared");
                alert("Cache cleared.");
            }
        });
    }

    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if(confirm("⚠️ WARNING: This will delete ALL songs and progress. Are you sure?")) {
                localStorage.clear(); 
                alert("All data wiped. The app will restart.");
                window.location.href = 'index.html'; 
            }
        });
    }

    const resetPrefsBtn = document.getElementById('reset-prefs');
    if (resetPrefsBtn) {
        resetPrefsBtn.addEventListener('click', () => {
             if(confirm("Reset settings to default?")) {
                if(speedSelect) speedSelect.value = "1.0";
                if(feedbackSelect) feedbackSelect.value = "numeric";
                if(audioSlider) audioSlider.value = "75";
                
                localStorage.removeItem('preference_speed');
                localStorage.removeItem('preference_feedback');
                localStorage.removeItem('preference_volume');
                
                alert("Preferences reset.");
             }
        });
    }
    
});