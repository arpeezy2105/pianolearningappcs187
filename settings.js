document.addEventListener('DOMContentLoaded', () => {

    console.log("Settings page JS is running!");

    const clearCacheBtn = document.getElementById('clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
            console.log("Clear Cache button clicked");
        });
    }

    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            console.log("Clear All Data button clicked");
        });
    }
    
});