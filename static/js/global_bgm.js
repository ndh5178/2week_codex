
(() => {
  if (window.__globalBgmMounted) {
    return;
  }
  window.__globalBgmMounted = true;

  const STORAGE_KEY = 'pokemonGlobalBgmState';
  const TRACK = {
    title: 'The 8-Bit Digger',
    artist: 'Eric Matyas',
    audioUrl: 'https://soundimage.org/wp-content/uploads/2017/03/The-8-Bit-Digger.mp3',
    sourceUrl: 'https://soundimage.org/chiptunes-4/',
    creditText: 'BGM: The 8-Bit Digger / Eric Matyas (Soundimage)'
  };

  const UI_TEXT = {
    meta: '\uac8c\uc784\ud48d \ubc30\uacbd\uc74c\uc545\uc744 \uc0ac\uc774\ud2b8 \uc804\uccb4\uc5d0\uc11c \uc774\uc5b4\uc11c \uc7ac\uc0dd\ud569\ub2c8\ub2e4.',
    play: '\uc7ac\uc0dd',
    stop: '\uc911\uc9c0',
    mute: '\uc74c\uc18c\uac70',
    unmute: '\uc74c\uc18c\uac70 \ud574\uc81c',
    volume: '\ubcfc\ub968',
    openSource: '\ucd9c\ucc98 \ubcf4\uae30',
    initialStatus: '\ube0c\ub77c\uc6b0\uc800 \uc815\ucc45 \ub54c\ubb38\uc5d0 \uccab \uc7ac\uc0dd\uc740 \uc9c1\uc811 \ub20c\ub7ec \uc8fc\uc138\uc694.',
    playingStatus: '\ubc30\uacbd\uc74c\uc545 \uc7ac\uc0dd \uc911\uc785\ub2c8\ub2e4. \ub2e4\ub978 \ud398\uc774\uc9c0\ub85c \uc774\ub3d9\ud574\ub3c4 \uc0c1\ud0dc\ub97c \uc774\uc5b4\ubc1b\uc2b5\ub2c8\ub2e4.',
    resumeHint: '\ud398\uc774\uc9c0\ub97c \ud55c \ubc88 \ud074\ub9ad\ud558\uba74 \uc74c\uc545\uc744 \ub2e4\uc2dc \uc2dc\uc791\ud569\ub2c8\ub2e4.',
    playFailed: '\uc7ac\uc0dd\uc744 \uc2dc\uc791\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \ub124\ud2b8\uc6cc\ud06c \uc0c1\ud0dc\ub098 \uc0ac\uc774\ud2b8 \uad8c\ud55c\uc744 \ud655\uc778\ud574 \uc8fc\uc138\uc694.',
    pausedStatus: '\ubc30\uacbd\uc74c\uc545\uc744 \uc911\uc9c0\ud588\uc2b5\ub2c8\ub2e4.',
    mutedStatus: '\ubc30\uacbd\uc74c\uc545\uc774 \uc74c\uc18c\uac70\ub418\uc5c8\uc2b5\ub2c8\ub2e4.',
    unmutedStatus: '\ubc30\uacbd\uc74c\uc545 \uc74c\uc18c\uac70\ub97c \ud574\uc81c\ud588\uc2b5\ub2c8\ub2e4.',
    volumeStatusPrefix: '\ubcfc\ub968\uc744 '
  };

  const defaultState = {
    enabled: false,
    muted: false,
    volume: 0.45,
    currentTime: 0
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        ...defaultState,
        ...parsed,
        volume: Number.isFinite(parsed.volume) ? Math.min(1, Math.max(0, parsed.volume)) : defaultState.volume,
        currentTime: Number.isFinite(parsed.currentTime) ? Math.max(0, parsed.currentTime) : defaultState.currentTime
      };
    } catch (_error) {
      return { ...defaultState };
    }
  }

  function saveState(nextState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  const state = loadState();
  const widget = document.createElement('section');
  widget.className = 'global-bgm-widget';
  widget.innerHTML = `
    <p class="global-bgm-widget__eyebrow">Site BGM</p>
    <h2 class="global-bgm-widget__title">${TRACK.title}</h2>
    <p class="global-bgm-widget__meta">${UI_TEXT.meta}</p>
    <div class="global-bgm-widget__controls">
      <button class="global-bgm-widget__button" type="button" id="globalBgmToggle">${UI_TEXT.play}</button>
      <button class="global-bgm-widget__button is-secondary" type="button" id="globalBgmMute">${UI_TEXT.mute}</button>
      <label class="global-bgm-widget__volume-wrap" for="globalBgmVolume">
        <span>${UI_TEXT.volume}</span>
        <input class="global-bgm-widget__volume" id="globalBgmVolume" type="range" min="0" max="1" step="0.01">
      </label>
    </div>
    <p class="global-bgm-widget__status" id="globalBgmStatus">${UI_TEXT.initialStatus}</p>
    <p class="global-bgm-widget__credit">${TRACK.creditText}. <a href="${TRACK.sourceUrl}" target="_blank" rel="noreferrer noopener">${UI_TEXT.openSource}</a></p>
  `;
  document.body.appendChild(widget);

  const audio = document.createElement('audio');
  audio.src = TRACK.audioUrl;
  audio.loop = true;
  audio.preload = 'none';
  audio.playsInline = true;
  document.body.appendChild(audio);

  const toggleButton = document.getElementById('globalBgmToggle');
  const muteButton = document.getElementById('globalBgmMute');
  const volumeSlider = document.getElementById('globalBgmVolume');
  const statusText = document.getElementById('globalBgmStatus');

  volumeSlider.value = String(state.volume);
  audio.volume = state.volume;
  audio.muted = state.muted;

  let resumeListenerAttached = false;

  function persist() {
    saveState({
      enabled: state.enabled,
      muted: audio.muted,
      volume: audio.volume,
      currentTime: audio.currentTime || 0
    });
  }

  function updateCompactMode() {
    widget.classList.toggle('is-compact', !audio.paused);
  }

  function updateButtons() {
    toggleButton.textContent = audio.paused ? UI_TEXT.play : UI_TEXT.stop;
    muteButton.textContent = audio.muted ? UI_TEXT.unmute : UI_TEXT.mute;
    updateCompactMode();
  }

  function updateStatus(message) {
    statusText.textContent = message;
  }

  function attachResumeOnGesture() {
    if (resumeListenerAttached) {
      return;
    }
    resumeListenerAttached = true;
    const resume = () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      resumeListenerAttached = false;
      if (state.enabled && audio.paused) {
        tryPlay(true);
      }
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  let restoreTimePending = state.currentTime > 0;

  audio.addEventListener('loadedmetadata', () => {
    if (restoreTimePending && Number.isFinite(state.currentTime) && state.currentTime > 0 && state.currentTime < audio.duration) {
      audio.currentTime = state.currentTime;
    }
    restoreTimePending = false;
  });

  let lastSavedAt = 0;
  audio.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastSavedAt > 1500) {
      lastSavedAt = now;
      persist();
    }
  });

  async function tryPlay(fromUserAction = false) {
    try {
      await audio.play();
      state.enabled = true;
      updateButtons();
      updateStatus(UI_TEXT.playingStatus);
      persist();
    } catch (_error) {
      state.enabled = fromUserAction ? false : state.enabled;
      updateButtons();
      if (fromUserAction) {
        updateStatus(UI_TEXT.playFailed);
      } else {
        updateStatus(UI_TEXT.resumeHint);
        attachResumeOnGesture();
      }
      persist();
    }
  }

  function stopAudio() {
    audio.pause();
    state.enabled = false;
    updateButtons();
    updateStatus(UI_TEXT.pausedStatus);
    persist();
  }

  toggleButton.addEventListener('click', () => {
    if (audio.paused) {
      tryPlay(true);
    } else {
      stopAudio();
    }
  });

  muteButton.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateButtons();
    updateStatus(audio.muted ? UI_TEXT.mutedStatus : UI_TEXT.unmutedStatus);
    persist();
  });

  volumeSlider.addEventListener('input', (event) => {
    const nextVolume = Number(event.target.value);
    audio.volume = nextVolume;
    if (nextVolume > 0 && audio.muted) {
      audio.muted = false;
    }
    updateButtons();
    updateStatus(`${UI_TEXT.volumeStatusPrefix}${Math.round(nextVolume * 100)}%\ub85c \uc870\uc808\ud588\uc2b5\ub2c8\ub2e4.`);
    persist();
  });

  window.addEventListener('beforeunload', () => {
    persist();
  });

  updateButtons();
  if (state.enabled) {
    tryPlay(false);
  } else {
    updateStatus(UI_TEXT.initialStatus);
  }
})();
