document.addEventListener("DOMContentLoaded", () => {
    console.log("Piano mapping C#3 → C6");

    // ----------------------------
    // 1. 键盘与音频映射
    // ----------------------------

    const noteOrder = [
        "C3", "C#3", "D3", "D#3", "E3",
        "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
        "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
        "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
        "C6"
    ];

    const noteToFile = {
        // Octave 3
        "C3": "c3.mp3",
        "C#3": "csh3.mp3",
        "D3": "d3.mp3",
        "D#3": "dsh3.mp3",
        "E3": "e3.mp3",
        "F3": "f3.mp3",
        "F#3": "fsh3.mp3",
        "G3": "g3.mp3",
        "G#3": "gsh3.mp3",
        "A3": "a3.mp3",
        "A#3": "ash3.mp3",
        "B3": "b3.mp3",

        // Octave 4
        "C4": "c4.mp3",
        "C#4": "csh4.mp3",
        "D4": "d4.mp3",
        "D#4": "dsh4.mp3",
        "E4": "e4.mp3",
        "F4": "f4.mp3",
        "F#4": "fsh4.mp3",
        "G4": "g4.mp3",
        "G#4": "gsh4.mp3",
        "A4": "a4.mp3",
        "A#4": "ash4.mp3",
        "B4": "b4.mp3",

        // Octave 5
        "C5": "c5.mp3",
        "C#5": "csh5.mp3",
        "D5": "d5.mp3",
        "D#5": "dsh5.mp3",
        "E5": "e5.mp3",
        "F5": "f5.mp3",
        "F#5": "fsh5.mp3",
        "G5": "g5.mp3",
        "G#5": "gsh5.mp3",
        "A5": "a5.mp3",
        "A#5": "ash5.mp3",
        "B5": "b5.mp3",

        // Octave 6
        "C6": "c6.mp3"
    };

    const keys = Array.from(document.querySelectorAll(".keyboard .key"));

    if (keys.length !== noteOrder.length) {
        console.warn("Key count and note count differ:",
            "keys =", keys.length, "notes =", noteOrder.length);
    }

    // 给每个 key 一个 note
    keys.forEach((key, i) => {
        const note = noteOrder[i];
        key.dataset.note = note;
    });

    // 被按下时的高亮样式
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

    // ----------------------------
    // 2. 模式与 UI 相关 DOM
    // ----------------------------

    const playButton = document.querySelector(".play-button");
    const currentSongLabel = document.querySelector(".current-song");

    const practiceUI = document.querySelector(".practice-ui");
    const rhythmUI = document.querySelector(".rhythm-ui");
    const rhythmOverlay = document.getElementById("rhythm-overlay");
    const rhythmScoreEl = document.getElementById("rhythm-score");

    const modeButtons = document.querySelectorAll(".mode-controls button[data-mode]");
    const restartBtn = document.getElementById("restart-btn");

    const speedSelect = document.getElementById("speed-select");
    const progressBar = document.querySelector(".progress-bar");
    const progressHandle = document.querySelector(".progress-handle");
    const progressBarContainer = document.querySelector(".progress-bar-container");

    let currentMode = "practice";

    function setMode(mode) {
        currentMode = mode;

        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // 切换 UI：Practice 圆形按钮 vs Rhythm 落下条
        if (practiceUI && rhythmUI) {
            if (mode === "rhythm") {
                practiceUI.classList.add("hidden");
                rhythmUI.classList.remove("hidden");
            } else {
                practiceUI.classList.remove("hidden");
                rhythmUI.classList.add("hidden");
            }
        }

        // 停止正在进行的东西
        stopPractice();
        resetRhythmState();
    }

    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.mode;
            if (mode) {
                setMode(mode);
            }
        });
    });

    // ----------------------------
    // 3. 鼠标/键盘 触发音符 + 统一入口
    // ----------------------------

    // 下面会定义这两个函数
    function practiceHandleUserNote(note) { }
    function rhythmHandleUserNote(note) { }

    function handleUserPlayedNote(note) {
        if (currentMode === "rhythm") {
            rhythmHandleUserNote(note);
        } else {
            practiceHandleUserNote(note);
        }
    }

    // 鼠标点击钢琴键
    keys.forEach(key => {
        key.addEventListener("mousedown", () => {
            const note = key.dataset.note;
            key.classList.add("active-ui");
            playNote(note);
            handleUserPlayedNote(note);
        });

        key.addEventListener("mouseup", () =>
            key.classList.remove("active-ui")
        );
        key.addEventListener("mouseleave", () =>
            key.classList.remove("active-ui")
        );
    });

    // 电脑键盘映射
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
        handleUserPlayedNote(note);
    });

    document.addEventListener("keyup", (e) => {
        const note = keyMap[e.key];
        if (!note) return;
        const keyEl = keys.find(k => k.dataset.note === note);
        if (keyEl) keyEl.classList.remove("active-ui");
    });

    // ----------------------------
    // 4. MIDI 键盘支持（保持原来的）
    // ----------------------------

    function midiToNoteName(midiNumber) {
        const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const octave = Math.floor(midiNumber / 12) - 1;
        const name = names[midiNumber % 12];
        return name + octave;
    }

    const midiSwap = {
        "C#": "D",
        "D": "C#",
        "D#": "E",
        "E": "D#",
        "F": "F",
        "F#": "G",
        "G": "F#",
        "G#": "A",
        "A": "G#",
        "A#": "B",
        "B": "A#"
    };

    function applyCustomSwap(noteName) {
        const match = noteName.match(/^([A-G]#?)(\d)$/);
        if (!match) return noteName;
        const [, pitch, octave] = match;
        const swappedPitch = midiSwap[pitch] || pitch;
        return swappedPitch + octave;
    }

    function highlightKey(note) {
        const key = document.querySelector(`.key[data-note="${note}"]`);
        if (key) key.classList.add("active-ui");
    }

    function unhighlightKey(note) {
        const key = document.querySelector(`.key[data-note="${note}"]`);
        if (key) key.classList.remove("active-ui");
    }

    function onMIDIMessage(message) {
        const [status, noteNumber, velocity] = message.data;
        let noteName = midiToNoteName(noteNumber);
        noteName = applyCustomSwap(noteName);

        const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
        const isNoteOff = (status & 0xf0) === 0x80 || ((status & 0xf0) === 0x90 && velocity === 0);

        if (isNoteOn) {
            playNote(noteName);
            highlightKey(noteName);
            handleUserPlayedNote(noteName);
        } else if (isNoteOff) {
            unhighlightKey(noteName);
        }
    }

    function onMIDISuccess(midiAccess) {
        for (const input of midiAccess.inputs.values()) {
            input.onmidimessage = onMIDIMessage;
        }
    }

    function onMIDIFailure(msg) {
        console.warn("MIDI access failed:", msg);
    }

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }

    // ----------------------------
    // 5. Practice 模式（原来的节奏练习逻辑）
    // ----------------------------

    let practiceSteps = [];
    let currentStepIndex = 0;
    let isPracticeRunning = false;
    let practiceHits = 0;
    let practiceMisses = 0;

    function resetPracticeState() {
        isPracticeRunning = false;
        currentStepIndex = 0;
        practiceHits = 0;
        practiceMisses = 0;
    }

    function stopPractice() {
        isPracticeRunning = false;
    }

    function loadCurrentSongSteps() {
        const stepsString = localStorage.getItem("currentSongSteps");
        if (!stepsString) {
            alert("Please go to the Songs page and select/upload a song first.");
            return false;
        }

        try {
            const rawSteps = JSON.parse(stepsString);
            practiceSteps = Array.isArray(rawSteps) ? rawSteps : [];
        } catch (e) {
            console.error("Error parsing steps:", e);
            practiceSteps = [];
        }

        if (!practiceSteps.length) {
            alert("Current song has no notes to practice.");
            return false;
        }
        return true;
    }

    function startPracticeFromBeginning() {
        if (!loadCurrentSongSteps()) return;

        currentStepIndex = 0;
        practiceHits = 0;
        practiceMisses = 0;
        isPracticeRunning = true;

        updateProgressBar();
        showCurrentChordHint();
    }

    function getCurrentStep() {
        return practiceSteps[currentStepIndex];
    }

    function showCurrentChordHint() {
        const step = getCurrentStep();
        if (!step) return;

        keys.forEach(k => k.classList.remove("active-ui"));

        const songTempo = (parseFloat(speedSelect.value) || 1.0);
        step.notes.forEach(note => {
            const key = document.querySelector(`.key[data-note="${note}"]`);
            if (key) {
                key.style.boxShadow = "0 0 16px rgba(255,255,255,0.8)";
                key.style.outline = "2px solid rgba(255,255,255,0.6)";
                key.dataset._hint = "1";
            }
        });

        setTimeout(() => {
            document.querySelectorAll(".key[data-_hint='1']").forEach(k => {
                k.style.boxShadow = "";
                k.style.outline = "";
                delete k.dataset._hint;
            });
        }, 200 / songTempo);
    }

    function updateProgressBar() {
        if (!practiceSteps.length) return;
        const progress = currentStepIndex / practiceSteps.length;
        if (progressBar) progressBar.style.width = `${progress * 100}%`;
        if (progressHandle) progressHandle.style.left = `${progress * 100}%`;
    }

    // Practice 模式下用户按键时的逻辑
    practiceHandleUserNote = function (note) {
        if (!isPracticeRunning || !practiceSteps.length) return;

        const step = getCurrentStep();
        if (!step) return;

        const requiredNotes = new Set(step.notes);
        if (requiredNotes.size === 0) {
            currentStepIndex++;
            updateProgressBar();
            return;
        }

        const songTempo = (parseFloat(speedSelect.value) || 1.0);
        if (!step._playedNotes) step._playedNotes = new Set();
        step._playedNotes.add(note);

        if (requiredNotes.has(note)) {
            practiceHits++;
        } else {
            practiceMisses++;
        }

        let allPlayed = true;
        requiredNotes.forEach(n => {
            if (!step._playedNotes.has(n)) allPlayed = false;
        });

        if (allPlayed) {
            currentStepIndex++;
            updateProgressBar();
            if (currentStepIndex >= practiceSteps.length) {
                isPracticeRunning = false;
                alert(`Practice finished!\nHit: ${practiceHits}, Miss: ${practiceMisses}`);
            } else {
                setTimeout(showCurrentChordHint, 120 / songTempo);
            }
        }
    };

    // 进度条拖动：简单按比例跳 step
    if (progressBarContainer) {
        progressBarContainer.addEventListener("click", (e) => {
            if (!practiceSteps.length) return;
            const rect = progressBarContainer.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            currentStepIndex = Math.max(0, Math.min(practiceSteps.length - 1, Math.floor(ratio * practiceSteps.length)));
            updateProgressBar();
            showCurrentChordHint();
        });
    }

    // ----------------------------
    // 6. Rhythm 模式：falling bar 游戏
    // ----------------------------

    const RHYTHM_SPAWN_INTERVAL_BASE = 600; // ms
    const RHYTHM_FALL_DURATION = 2500;     // ms

    let rhythmQueue = [];
    let rhythmActiveNotes = [];
    let rhythmSpawnIndex = 0;
    let rhythmStartTime = null;
    let rhythmAnimationId = null;
    let rhythmHits = 0;
    let rhythmMisses = 0;
    let rhythmTotalNotes = 0;

    function rhythmSpeedMultiplier() {
        const v = parseFloat(speedSelect.value) || 1.0;
        return 1 / v; // 倍速越大，间隔越小
    }

    function resetRhythmState() {
        if (rhythmAnimationId) {
            cancelAnimationFrame(rhythmAnimationId);
            rhythmAnimationId = null;
        }
        rhythmQueue = [];
        rhythmActiveNotes = [];
        rhythmSpawnIndex = 0;
        rhythmStartTime = null;
        rhythmHits = 0;
        rhythmMisses = 0;
        rhythmTotalNotes = 0;
        if (rhythmOverlay) rhythmOverlay.innerHTML = "";
        updateRhythmScore();
    }

    function updateRhythmScore() {
        if (!rhythmScoreEl) return;
        const pct = rhythmTotalNotes
            ? Math.round((rhythmHits / rhythmTotalNotes) * 100)
            : 0;
        rhythmScoreEl.textContent = `Score: ${pct}% (Hit ${rhythmHits}, Miss ${rhythmMisses})`;
    }

    function createRhythmQueueFromSteps(steps) {
        const queue = [];
        steps.forEach(step => {
            (step.notes || []).forEach(n => {
                const idx = noteOrder.indexOf(n);
                if (idx !== -1) {
                    queue.push({ note: n, index: idx });
                }
            });
        });
        return queue;
    }

    function spawnRhythmNote(event, spawnIndex) {
        if (!rhythmOverlay) return;

        const bar = document.createElement("div");
        bar.className = "falling-note";

        const overlayWidth = rhythmOverlay.clientWidth || 1;
        const keyWidth = overlayWidth / noteOrder.length;
        const left = event.index * keyWidth;

        bar.style.left = (left + 2) + "px";
        bar.style.width = Math.max(10, keyWidth - 4) + "px";

        rhythmOverlay.appendChild(bar);

        rhythmActiveNotes.push({
            note: event.note,
            index: event.index,
            bar,
            startOffset: spawnIndex * RHYTHM_SPAWN_INTERVAL_BASE * rhythmSpeedMultiplier(),
            hit: false,
            missed: false,
            removed: false
        });
    }

    function rhythmLoop(time) {
        if (!rhythmOverlay) return;

        if (!rhythmStartTime) rhythmStartTime = time;
        const elapsed = time - rhythmStartTime;
        const spawnInterval = RHYTHM_SPAWN_INTERVAL_BASE * rhythmSpeedMultiplier();
        const fallDuration = RHYTHM_FALL_DURATION * rhythmSpeedMultiplier();

        const overlayHeight = rhythmOverlay.clientHeight || 1;
        const noteHeight = 220;      // 如果你的 CSS 里改成 260，这里也一起改成 260
        const hitLine = overlayHeight;   // 让柱子掉到 overlay 底部（贴近键盘）


        // 产生新的 note
        while (
            rhythmSpawnIndex < rhythmQueue.length &&
            elapsed >= rhythmSpawnIndex * spawnInterval
        ) {
            spawnRhythmNote(rhythmQueue[rhythmSpawnIndex], rhythmSpawnIndex);
            rhythmSpawnIndex++;
        }

        // 更新已有的 note 位置 & 判断 miss
        rhythmActiveNotes.forEach(obj => {
            if (obj.removed) return;

            const age = elapsed - obj.startOffset;
            const progress = age / fallDuration;

            if (progress >= 0) {
                const y = Math.min(hitLine, hitLine * progress);
                obj.bar.style.transform = `translateY(${y}px)`;
            }

            if (!obj.hit && !obj.missed && age > fallDuration + 180) {
                obj.missed = true;
                obj.bar.classList.add("miss");
                rhythmMisses++;
                updateRhythmScore();
                setTimeout(() => {
                    if (obj.bar && obj.bar.parentNode) {
                        obj.bar.parentNode.removeChild(obj.bar);
                    }
                }, 350);
                obj.removed = true;
            }
        });

        const anyActive = rhythmActiveNotes.some(n => !n.removed);
        if (rhythmSpawnIndex < rhythmQueue.length || anyActive) {
            rhythmAnimationId = requestAnimationFrame(rhythmLoop);
        } else {
            rhythmAnimationId = null;

            // 节奏模式结束时弹出总分
            const pct = rhythmTotalNotes
                ? Math.round((rhythmHits / rhythmTotalNotes) * 100)
                : 0;

            setTimeout(() => {
                alert(
                    `Rhythm session finished!\n` +
                    `Score: ${pct}%\n` +
                    `Hit: ${rhythmHits}\n` +
                    `Miss: ${rhythmMisses}`
                );
            }, 150);
        }

    }

    function startRhythmGame() {
        if (!loadCurrentSongSteps()) return;

        setMode("rhythm"); // 确保 UI 在 rhythm 模式

        resetRhythmState();
        rhythmQueue = createRhythmQueueFromSteps(practiceSteps);
        rhythmTotalNotes = rhythmQueue.length;

        if (!rhythmTotalNotes) {
            alert("This song has no playable notes for rhythm mode.");
            return;
        }

        rhythmStartTime = null;
        updateRhythmScore();
        rhythmAnimationId = requestAnimationFrame(rhythmLoop);
    }

    // Rhythm 模式下用户弹键
    rhythmHandleUserNote = function (note) {
        if (!rhythmQueue.length || !rhythmOverlay) return;

        const now = performance.now();
        if (!rhythmStartTime) return;

        const spawnInterval = RHYTHM_SPAWN_INTERVAL_BASE * rhythmSpeedMultiplier();
        const fallDuration = RHYTHM_FALL_DURATION * rhythmSpeedMultiplier();

        const candidates = rhythmActiveNotes.filter(o =>
            o.note === note && !o.hit && !o.missed && !o.removed
        );
        if (!candidates.length) return;

        let best = null;
        let bestDist = Infinity;

        candidates.forEach(o => {
            const age = (now - rhythmStartTime) - o.startOffset;
            const progress = age / fallDuration;
            const dist = Math.abs(progress - 1); // 1 ≈ 到达命中线
            if (dist < bestDist) {
                bestDist = dist;
                best = o;
            }
        });

        const HIT_WINDOW = 0.28; // 容错
        if (best && bestDist <= HIT_WINDOW) {
            best.hit = true;
            best.bar.classList.add("hit");
            rhythmHits++;
            updateRhythmScore();
            setTimeout(() => {
                if (best.bar && best.bar.parentNode) {
                    best.bar.parentNode.removeChild(best.bar);
                }
            }, 180);
            best.removed = true;
        }
    };

    // ----------------------------
    // 7. 按钮：Play / Restart
    // ----------------------------

    if (playButton) {
        playButton.addEventListener("click", () => {
            if (currentMode === "rhythm") {
                startRhythmGame();
            } else {
                startPracticeFromBeginning();
            }
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            if (currentMode === "rhythm") {
                startRhythmGame();
            } else {
                startPracticeFromBeginning();
            }
        });
    }

    // ----------------------------
    // 8. 初始：显示当前歌曲名字 & 默认 practice
    // ----------------------------

    const storedSongName = localStorage.getItem("currentSongName");
    if (storedSongName && currentSongLabel) {
        currentSongLabel.textContent = storedSongName;
    }

    setMode("practice");

    // 暴露给调试
    window.handleUserPlayedNote = handleUserPlayedNote;
});
