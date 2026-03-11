(function () {
  const backdrop = document.getElementById('wallpaperBackdrop');
  const canvas = document.getElementById('wallpaperCanvas');
  const keywordInput = document.getElementById('wallpaperKeywordInput');
  const generateButton = document.getElementById('wallpaperGenerateButton');
  const downloadButton = document.getElementById('wallpaperDownloadButton');
  const statusLabel = document.getElementById('wallpaperStatus');
  const closeButton = document.getElementById('wallpaperCloseButton');
  const currentPokemonLabel = document.getElementById('wallpaperCurrentPokemon');

  if (!backdrop || !canvas || !keywordInput || !generateButton || !downloadButton || !statusLabel || !closeButton || !currentPokemonLabel) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const state = {
    keywords: {},
    selectedPokemon: null,
    loadedImage: null,
  };

  function pickPreset(keyword, accent) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return {
        palette: ['#0f172a', accent || '#f97316', '#f8fafc'],
        pattern: 'glow',
      };
    }

    if (state.keywords[normalized]) {
      return state.keywords[normalized];
    }

    const matchedEntry = Object.entries(state.keywords).find(([presetKeyword]) => normalized.includes(presetKeyword.toLowerCase()));
    if (matchedEntry) {
      return matchedEntry[1];
    }

    return {
      palette: ['#0f172a', accent || '#f97316', '#f8fafc'],
      pattern: 'glow',
    };
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('image-load-failed'));
      image.src = src;
    });
  }

  function getWorkingImage(pokemon) {
    if (!pokemon) {
      return Promise.reject(new Error('missing-pokemon'));
    }

    return loadImage(pokemon.image).catch(() => {
      if (pokemon.fallbackImage) {
        return loadImage(pokemon.fallbackImage);
      }
      throw new Error('image-load-failed');
    });
  }

  function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawBackground(palette, pattern) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(0.5, palette[1]);
    gradient.addColorStop(1, palette[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = 0.15;

    if (pattern === 'stars') {
      for (let index = 0; index < 90; index += 1) {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (pattern === 'waves') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      for (let y = 220; y < canvas.height; y += 120) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
          const waveY = y + Math.sin((x + y) / 80) * 18;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }
    } else if (pattern === 'grid') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    } else if (pattern === 'spark') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      for (let index = 0; index < 12; index += 1) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.7;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + 30, startY + 80);
        ctx.lineTo(startX - 10, startY + 120);
        ctx.lineTo(startX + 20, startY + 180);
        ctx.stroke();
      }
    } else if (pattern === 'leaves') {
      ctx.fillStyle = '#ffffff';
      for (let index = 0; index < 35; index += 1) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI);
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (pattern === 'sunset') {
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 380, 180, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      for (let index = 0; index < 8; index += 1) {
        ctx.beginPath();
        ctx.arc(canvas.width * Math.random(), canvas.height * Math.random(), 90 + Math.random() * 120, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawFrame() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.restore();
  }

  function drawText(pokemon, keyword) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = '700 44px Noto Sans KR';
    ctx.fillText(keyword || 'My Pokemon Poster', 60, 110);

    ctx.font = '900 112px "Black Han Sans"';
    ctx.fillText(pokemon.name_ko, 60, 230);

    ctx.font = '600 34px Noto Sans KR';
    ctx.globalAlpha = 0.9;
    ctx.fillText(pokemon.name.toUpperCase(), 64, 282);
    ctx.globalAlpha = 1;
  }

  function drawPokemonImage(image) {
    const maxWidth = 620;
    const maxHeight = 620;
    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    const x = canvas.width / 2 - width / 2;
    const y = 360;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.24)';
    ctx.shadowBlur = 40;
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
  }

  function drawKeywordBlock(keyword, accent) {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(60, 1110, canvas.width - 120, 240, 30);
    ctx.fill();

    ctx.fillStyle = accent;
    roundRect(60, 1110, 240, 58, 18);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px Noto Sans KR';
    ctx.fillText('KEYWORD', 92, 1148);
    ctx.font = '700 52px Noto Sans KR';
    ctx.fillText(keyword || '직접 입력한 키워드', 80, 1255);
    ctx.font = '500 26px Noto Sans KR';
    ctx.fillText('포켓몬 분위기에 맞춘 로컬 생성형 배경화면', 82, 1315);
    ctx.restore();
  }

  async function renderWallpaper() {
    if (!state.selectedPokemon) {
      return;
    }

    const keyword = keywordInput.value.trim();
    const preset = pickPreset(keyword, state.selectedPokemon.accent);

    if (!state.loadedImage) {
      state.loadedImage = await getWorkingImage(state.selectedPokemon);
    }

    drawBackground(preset.palette, preset.pattern);
    drawFrame();
    drawText(state.selectedPokemon, keyword);
    drawPokemonImage(state.loadedImage);
    drawKeywordBlock(keyword, state.selectedPokemon.accent);
    statusLabel.textContent = `"${keyword || '기본'}" 분위기의 ${state.selectedPokemon.name_ko} 배경화면이 생성되었습니다.`;
  }

  function openWallpaperModal() {
    backdrop.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeWallpaperModal() {
    backdrop.classList.add('is-hidden');
    document.body.style.overflow = '';
  }

  async function bootstrapFeature() {
    const response = await fetch('/api/wallpaper/options');
    const data = await response.json();
    state.keywords = data.keywords || {};
  }

  generateButton.addEventListener('click', async () => {
    await renderWallpaper();
  });

  downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    const slug = state.selectedPokemon ? state.selectedPokemon.slug : 'pokemon';
    link.download = `${slug}-wallpaper.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  closeButton.addEventListener('click', closeWallpaperModal);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      closeWallpaperModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (backdrop.classList.contains('is-hidden')) {
      return;
    }

    if (event.key === 'Escape') {
      closeWallpaperModal();
    }
  });

  document.addEventListener('pokemon-modal-rendered', async (event) => {
    state.selectedPokemon = event.detail.pokemon;
    state.loadedImage = null;
    keywordInput.value = '노을';
    currentPokemonLabel.textContent = `${state.selectedPokemon.name_ko} 배경화면`;

    const trigger = document.getElementById('openWallpaperGeneratorButton');
    if (!trigger) {
      return;
    }

    trigger.onclick = async () => {
      openWallpaperModal();
      await renderWallpaper();
    };
  });

  bootstrapFeature().catch((error) => {
    console.error(error);
    statusLabel.textContent = '배경화면 생성기를 불러오지 못했습니다.';
  });
})();

