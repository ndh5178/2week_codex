const meongseokElements = {
  root: document.querySelector(".meongseok-game"),
  modeAiButton: document.getElementById("modeAiButton"),
  modePvpButton: document.getElementById("modePvpButton"),
  difficultyGroup: document.getElementById("difficultyGroup"),
  difficultyEasyButton: document.getElementById("difficultyEasyButton"),
  difficultyNormalButton: document.getElementById("difficultyNormalButton"),
  difficultyHardButton: document.getElementById("difficultyHardButton"),
  aiStrategyStatus: document.getElementById("aiStrategyStatus"),
  startMatchButton: document.getElementById("startMatchButton"),
  loadTeamButton: document.getElementById("loadTeamButton"),
  createRoomButton: document.getElementById("createRoomButton"),
  joinRoomButton: document.getElementById("joinRoomButton"),
  leaveRoomButton: document.getElementById("leaveRoomButton"),
  inviteCodeInput: document.getElementById("inviteCodeInput"),
  resolveRoundButton: document.getElementById("resolveRoundButton"),
  resetLogButton: document.getElementById("resetLogButton"),
  matchStatus: document.getElementById("matchStatus"),
  importStatus: document.getElementById("importStatus"),
  syncStatus: document.getElementById("syncStatus"),
  importedTeamPreview: document.getElementById("importedTeamPreview"),
  roomCodeDisplay: document.getElementById("roomCodeDisplay"),
  roomRoleDisplay: document.getElementById("roomRoleDisplay"),
  aiRankingList: document.getElementById("aiRankingList"),
  pvpRankingList: document.getElementById("pvpRankingList"),
  roundIndicator: document.getElementById("roundIndicator"),
  turnIndicator: document.getElementById("turnIndicator"),
  roundResult: document.getElementById("roundResult"),
  matchBanner: document.getElementById("matchBanner"),
  matchBannerTitle: document.getElementById("matchBannerTitle"),
  matchBannerCopy: document.getElementById("matchBannerCopy"),
  leftPlayerLabel: document.getElementById("leftPlayerLabel"),
  rightPlayerLabel: document.getElementById("rightPlayerLabel"),
  leftPlayerScore: document.getElementById("leftPlayerScore"),
  rightPlayerScore: document.getElementById("rightPlayerScore"),
  leftPlayerDeckCount: document.getElementById("leftPlayerDeckCount"),
  rightPlayerDeckCount: document.getElementById("rightPlayerDeckCount"),
  leftPanelTitle: document.getElementById("leftPanelTitle"),
  rightPanelTitle: document.getElementById("rightPanelTitle"),
  leftSelectionState: document.getElementById("leftSelectionState"),
  rightSelectionState: document.getElementById("rightSelectionState"),
  leftHand: document.getElementById("leftHand"),
  rightHand: document.getElementById("rightHand"),
  leftBattleCard: document.getElementById("leftBattleCard"),
  rightBattleCard: document.getElementById("rightBattleCard"),
  battleLog: document.getElementById("battleLog")
};

const TYPE_LABEL = {
  normal: "노말", fire: "불꽃", water: "물", electric: "전기", grass: "풀", ice: "얼음",
  fighting: "격투", poison: "독", ground: "땅", flying: "비행", psychic: "에스퍼",
  bug: "벌레", rock: "바위", ghost: "고스트", dragon: "드래곤", dark: "악", steel: "강철", fairy: "페어리"
};

const TYPE_ADVANTAGE = {
  fire: ["grass", "bug", "ice"], water: ["fire", "ground", "rock"], grass: ["water", "ground", "rock"],
  electric: ["water", "flying"], psychic: ["fighting", "poison"], fighting: ["dark", "rock", "ice", "normal", "steel"],
  dragon: ["dragon"], dark: ["psychic", "ghost"]
};

const EXTERNAL_TEAM_KEYS = ["teamBuilderTeam", "pokedexTeamBuilderTeam", "pokemonTeamBuilderTeam", "selectedBattleTeam", "selectedPokemonTeam"];
const RANKING_KEY = "meongseok-game-rankings-v1";

const DEFAULT_POOL = [
  { id: 6, name: "리자몽", types: ["fire"], hp: 82, attack: 94, speed: 100, skill: 88, image: artwork(6), summary: "폭발적인 화력으로 짧은 승부에 강합니다." },
  { id: 9, name: "거북왕", types: ["water"], hp: 90, attack: 83, speed: 78, skill: 86, image: artwork(9), summary: "탄탄한 방어와 안정적인 밸런스를 갖춘 카드입니다." },
  { id: 3, name: "이상해꽃", types: ["grass"], hp: 88, attack: 82, speed: 80, skill: 90, image: artwork(3), summary: "지속력과 제어력이 좋은 카드입니다." },
  { id: 25, name: "피카츄", types: ["electric"], hp: 60, attack: 72, speed: 112, skill: 84, image: artwork(25), summary: "빠른 선공으로 흐름을 가져옵니다." },
  { id: 150, name: "뮤츠", types: ["psychic"], hp: 106, attack: 110, speed: 100, skill: 120, image: artwork(150), summary: "전설급 스탯을 가진 강력한 카드입니다." },
  { id: 149, name: "망나뇽", types: ["dragon"], hp: 96, attack: 104, speed: 80, skill: 92, image: artwork(149), summary: "높은 공격력으로 후반 역전에 강합니다." },
  { id: 94, name: "팬텀", types: ["ghost", "poison"], hp: 66, attack: 88, speed: 110, skill: 94, image: artwork(94), summary: "변수 창출에 특화된 카드입니다." },
  { id: 448, name: "루카리오", types: ["fighting", "steel"], hp: 78, attack: 104, speed: 90, skill: 88, image: artwork(448), summary: "공격과 순발력을 겸비했습니다." },
  { id: 445, name: "한카리아스", types: ["dragon", "ground"], hp: 108, attack: 118, speed: 92, skill: 84, image: artwork(445), summary: "정면 승부에서 매우 강합니다." },
  { id: 658, name: "개굴닌자", types: ["water", "dark"], hp: 72, attack: 95, speed: 122, skill: 90, image: artwork(658), summary: "가장 빠른 축에 드는 기습형 카드입니다." }
];

const state = {
  mode: "ai",
  difficulty: "easy",
  round: 0,
  maxRounds: 6,
  started: false,
  importedTeam: [],
  importedTeamSource: null,
  players: [
    { name: "플레이어 1", score: 0, deck: [], selectedId: null },
    { name: "AI", score: 0, deck: [], selectedId: null }
  ],
  battleCards: [null, null],
  displayBattleCards: [null, null],
  log: [],
  latestRoundSummary: null,
  latestMatchOutcome: null,
  rankings: loadRankings(),
  room: { code: null, role: "offline", channel: null, hostReady: false }
};

function artwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function loadRankings() {
  const fallback = {
    ai: { rating: 1000, played: 0, wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 },
    pvp: { rating: 1000, played: 0, wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0 }
  };
  try {
    const raw = window.localStorage.getItem(RANKING_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (_error) {
    return fallback;
  }
}

function saveRankings() {
  window.localStorage.setItem(RANKING_KEY, JSON.stringify(state.rankings));
}

function updateRanking(modeKey, outcome) {
  const ranking = state.rankings[modeKey];
  ranking.played += 1;
  if (outcome === "win") {
    ranking.wins += 1;
    ranking.rating += 24;
    ranking.streak += 1;
    ranking.bestStreak = Math.max(ranking.bestStreak, ranking.streak);
  } else if (outcome === "loss") {
    ranking.losses += 1;
    ranking.rating = Math.max(800, ranking.rating - 16);
    ranking.streak = 0;
  } else {
    ranking.draws += 1;
    ranking.rating += 4;
    ranking.streak = 0;
  }
  saveRankings();
}

function cloneCard(card) {
  return {
    ...card,
    types: [...card.types],
    used: false,
    maxHp: card.maxHp ?? card.hp,
    currentHp: card.currentHp ?? card.hp
  };
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildRandomDeck(size) {
  return shuffle(DEFAULT_POOL).slice(0, size).map(cloneCard);
}

function buildPlayerDeck(size) {
  if (state.importedTeam.length === 0) return buildRandomDeck(size);

  const imported = state.importedTeam.map(cloneCard);
  const importedIds = new Set(imported.map((card) => card.id));
  const fillers = shuffle(DEFAULT_POOL)
    .filter((card) => !importedIds.has(card.id))
    .slice(0, Math.max(0, size - imported.length))
    .map(cloneCard);

  return [...imported, ...fillers].slice(0, size);
}

function normalizeTypes(value) {
  if (Array.isArray(value) && value.length) return value.map((type) => String(type).toLowerCase());
  if (typeof value === "string" && value.trim()) return value.split(",").map((type) => type.trim().toLowerCase()).filter(Boolean);
  return ["normal"];
}

function normalizeExternalMember(member, index) {
  const stats = member.stats || {};
  const types = normalizeTypes(member.types || member.typeNames || member.type);
  const id = Number(member.id ?? member.pokemonId ?? member.dexNumber ?? index + 1);
  return {
    id,
    name: String(member.displayName ?? member.name ?? `팀 카드 ${index + 1}`),
    types,
    hp: Number(member.hp ?? stats.hp ?? stats.HP ?? 70),
    attack: Number(member.attack ?? stats.attack ?? stats.Attack ?? stats.specialAttack ?? 75),
    speed: Number(member.speed ?? stats.speed ?? stats.Speed ?? 70),
    skill: Number(member.skill ?? stats.specialAttack ?? stats.specialDefense ?? stats.SpecialAttack ?? 75),
    image: String(member.imageUrl ?? member.image ?? artwork(id)),
    summary: `${types.map((type) => TYPE_LABEL[type] || type).join("/")} 타입 팀 빌더 연동 카드`
  };
}

function extractTeamArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.team)) return raw.team;
  if (raw && Array.isArray(raw.members)) return raw.members;
  if (raw && Array.isArray(raw.pokemon)) return raw.pokemon;
  return [];
}

function importTeamFromPayload(payload, sourceLabel) {
  const team = extractTeamArray(payload).slice(0, 6).map(normalizeExternalMember);
  if (team.length === 0) return false;
  state.importedTeam = team;
  state.importedTeamSource = sourceLabel;
  return true;
}

function tryLoadImportedTeam() {
  for (const key of EXTERNAL_TEAM_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      if (importTeamFromPayload(JSON.parse(raw), `localStorage:${key}`)) return true;
    } catch (_error) {
      continue;
    }
  }
  return false;
}

function getTypeBonus(attackerTypes, defenderTypes) {
  for (const type of attackerTypes) {
    if ((TYPE_ADVANTAGE[type] || []).some((winner) => defenderTypes.includes(winner))) {
      return 12;
    }
  }
  return 0;
}

function estimateValue(card, opponent) {
  const typeBonus = opponent ? getTypeBonus(card.types, opponent.types) : 0;
  const effectiveHp = card.currentHp ?? card.hp;
  return card.attack * 1.15 + card.speed + card.skill + effectiveHp * 0.45 + typeBonus;
}

function estimateCounterScore(card, opponent) {
  if (!opponent) return estimateValue(card, null);
  const myPressure = estimateValue(card, opponent);
  const enemyPressure = estimateValue(opponent, card);
  const speedEdge = card.speed > opponent.speed ? 10 : card.speed === opponent.speed ? 4 : 0;
  const effectiveHp = card.currentHp ?? card.hp;
  const hpBuffer = Math.max(0, effectiveHp - opponent.attack * 0.4);
  return myPressure - enemyPressure * 0.45 + speedEdge + hpBuffer * 0.08;
}

function getSelectedCard(playerIndex) {
  const selectedId = state.players[playerIndex].selectedId;
  return state.players[playerIndex].deck.find((card) => card.id === selectedId && !card.used) || null;
}

function hasActiveBattle() {
  return Boolean(state.battleCards[0] && state.battleCards[1]);
}

function getRemainingCards(playerIndex) {
  return state.players[playerIndex].deck.filter((card) => !card.used);
}

function getCurrentBattleCard(playerIndex) {
  return state.battleCards[playerIndex] || getSelectedCard(playerIndex);
}

function clearBattleSelections() {
  state.players[0].selectedId = null;
  state.players[1].selectedId = null;
  state.battleCards = [null, null];
}

function ensureBattleCards() {
  const leftCard = getSelectedCard(0);
  const rightCard = getSelectedCard(1);
  if (!leftCard || !rightCard) return null;
  state.battleCards = [leftCard, rightCard];
  state.displayBattleCards = [leftCard, rightCard];
  return state.battleCards;
}

function canSelectCard(playerIndex, card) {
  if (card.used || !state.started) return false;
  if (hasActiveBattle()) {
    return state.players[playerIndex].selectedId === card.id;
  }
  return true;
}

function calculateDamage(attacker, defender) {
  const typeBonus = getTypeBonus(attacker.types, defender.types);
  const base = attacker.attack * 0.34 + attacker.skill * 0.24 + attacker.speed * 0.12 + typeBonus;
  return Math.max(8, Math.round(base));
}

function getBattleOrder(leftCard, rightCard) {
  if (leftCard.speed === rightCard.speed) {
    return leftCard.skill >= rightCard.skill ? [0, 1] : [1, 0];
  }
  return leftCard.speed > rightCard.speed ? [0, 1] : [1, 0];
}

function handleKnockout(winnerIndex, loserIndex) {
  state.round += 1;
  state.players[winnerIndex].score += 1;
  state.battleCards[loserIndex].used = true;
  state.battleCards[loserIndex].currentHp = 0;
  state.latestRoundSummary = winnerIndex === 0
    ? { result: "win", title: "ROUND WIN", copy: `${state.battleCards[winnerIndex].name}이(가) ${state.battleCards[loserIndex].name}을 쓰러뜨렸습니다.` }
    : { result: "lose", title: "ROUND LOSE", copy: `${state.battleCards[loserIndex].name}이(가) 쓰러졌습니다. 다음 포켓몬을 준비하세요.` };

  const loserHasNext = getRemainingCards(loserIndex).length > 0;
  const winnerHasNext = getRemainingCards(winnerIndex).length > 0;

  if (!loserHasNext || !winnerHasNext || state.players[winnerIndex].score >= state.maxRounds) {
    finalizeMatchOutcome();
    return;
  }

  clearBattleSelections();
  if (state.mode === "ai") {
    state.players[1].selectedId = chooseAiCardId();
  }
}

function handleDoubleKnockout() {
  state.round += 1;
  state.battleCards[0].used = true;
  state.battleCards[1].used = true;
  state.battleCards[0].currentHp = 0;
  state.battleCards[1].currentHp = 0;
  state.latestRoundSummary = { result: "draw", title: "DOUBLE KO", copy: `${state.battleCards[0].name}과 ${state.battleCards[1].name}이(가) 동시에 쓰러졌습니다.` };

  const leftHasNext = getRemainingCards(0).length > 0;
  const rightHasNext = getRemainingCards(1).length > 0;

  if (!leftHasNext && !rightHasNext) {
    finalizeMatchOutcome();
    return;
  }

  if (!leftHasNext) {
    state.players[1].score += 1;
    finalizeMatchOutcome();
    return;
  }

  if (!rightHasNext) {
    state.players[0].score += 1;
    finalizeMatchOutcome();
    return;
  }

  clearBattleSelections();
  if (state.mode === "ai") {
    state.players[1].selectedId = chooseAiCardId();
  }
}

function getAiStrategyDescription() {
  if (state.mode !== "ai") return "플레이어 대전에서는 AI 전략이 비활성화됩니다.";
  if (state.difficulty === "easy") return "Easy 난이도는 남은 카드 중 하나를 랜덤으로 선택합니다.";
  if (state.difficulty === "normal") return "Normal 난이도는 유리한 카드 후보 2장 중 하나를 확률적으로 선택합니다.";
  return "Hard 난이도는 상대 카드 상성과 스탯을 계산해 가장 유리한 카드를 선택합니다.";
}

function chooseAiCardId() {
  const available = state.players[1].deck.filter((card) => !card.used);
  if (!available.length) return null;

  if (state.difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)].id;
  }

  const opponent = getSelectedCard(0);
  const ranked = available
    .map((card) => ({ card, score: estimateCounterScore(card, opponent) }))
    .sort((left, right) => right.score - left.score);

  if (state.difficulty === "normal") {
    const pool = ranked.slice(0, Math.min(2, ranked.length));
    const pick = Math.random() < 0.7 ? pool[0] : pool[Math.floor(Math.random() * pool.length)];
    return pick.card.id;
  }

  return ranked[0].card.id;
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function closeChannel() {
  if (state.room.channel) {
    state.room.channel.close();
  }
  state.room = { code: null, role: "offline", channel: null, hostReady: false };
}

function openChannel(code, role) {
  closeChannel();
  const channel = new BroadcastChannel(`meongseok-room-${code}`);
  state.room = { code, role, channel, hostReady: role === "host" };
  channel.addEventListener("message", handleRoomMessage);
  renderRoomStatus();
}

function serializeState() {
  return {
    mode: state.mode,
    difficulty: state.difficulty,
    round: state.round,
    maxRounds: state.maxRounds,
    started: state.started,
    players: state.players,
    battleCards: state.battleCards,
    displayBattleCards: state.displayBattleCards,
    log: state.log,
    latestRoundSummary: state.latestRoundSummary,
    latestMatchOutcome: state.latestMatchOutcome,
    importedTeam: state.importedTeam,
    importedTeamSource: state.importedTeamSource
  };
}

function applyRemoteState(payload) {
  state.mode = payload.mode;
  state.difficulty = payload.difficulty;
  state.round = payload.round;
  state.maxRounds = payload.maxRounds;
  state.started = payload.started;
  state.players = payload.players;
  state.battleCards = payload.battleCards;
  state.displayBattleCards = payload.displayBattleCards || payload.battleCards || [null, null];
  state.log = payload.log;
  state.latestRoundSummary = payload.latestRoundSummary || null;
  state.latestMatchOutcome = payload.latestMatchOutcome || null;
  state.importedTeam = payload.importedTeam || [];
  state.importedTeamSource = payload.importedTeamSource || null;
  renderAll();
}

function broadcast(type, payload = {}) {
  if (!state.room.channel) return;
  state.room.channel.postMessage({ type, payload, roomCode: state.room.code, role: state.room.role });
}

function handleRoomMessage(event) {
  const message = event.data;
  if (!message || message.roomCode !== state.room.code) return;

  if (state.room.role === "host") {
    if (message.type === "join-request") {
      state.room.hostReady = true;
      broadcast("state-sync", serializeState());
      renderRoomStatus();
    }
    if (message.type === "select-card") {
      selectCard(1, message.payload.cardId, true);
    }
    if (message.type === "start-match") {
      startMatch(Boolean(message.payload.useImportedTeam), true);
    }
    if (message.type === "resolve-round") {
      resolveRound(true);
    }
    return;
  }

  if (message.type === "state-sync") {
    applyRemoteState(message.payload);
    state.room.hostReady = true;
    renderRoomStatus();
  }
}

function createRoom() {
  openChannel(generateRoomCode(), "host");
  renderAll();
}

function joinRoom() {
  const code = meongseokElements.inviteCodeInput.value.trim().toUpperCase();
  if (!code) {
    meongseokElements.syncStatus.textContent = "초대 코드를 먼저 입력하세요.";
    return;
  }
  openChannel(code, "guest");
  broadcast("join-request");
}

function leaveRoom() {
  closeChannel();
  renderRoomStatus();
}

function renderRoomStatus() {
  meongseokElements.roomCodeDisplay.textContent = state.room.code || "미연결";
  meongseokElements.roomRoleDisplay.textContent = state.room.role === "host" ? "호스트" : state.room.role === "guest" ? "게스트" : "오프라인";
  meongseokElements.syncStatus.textContent = state.room.role === "host"
    ? (state.room.hostReady ? "게스트가 연결되었습니다." : "초대 코드를 공유해 게스트를 기다리는 중입니다.")
    : state.room.role === "guest"
      ? "호스트 상태를 기다리는 중입니다."
      : "실시간 방에 연결되지 않았습니다.";
}

function resetMatchPresentation() {
  state.latestRoundSummary = null;
  state.latestMatchOutcome = null;
}

function startMatch(useImportedTeam, fromRemote = false) {
  state.started = true;
  state.round = 0;
  state.log = [];
  state.battleCards = [null, null];
  state.displayBattleCards = [null, null];
  state.players[0].score = 0;
  state.players[1].score = 0;
  state.players[0].selectedId = null;
  state.players[1].selectedId = null;
  resetMatchPresentation();
  state.players[0].deck = useImportedTeam ? buildPlayerDeck(6) : buildRandomDeck(6);
  state.players[1].deck = buildRandomDeck(6);
  state.players[1].name = state.mode === "ai" ? "AI" : (state.room.role === "host" ? "게스트" : "플레이어 2");
  if (state.mode === "ai") state.players[1].selectedId = chooseAiCardId();
  state.log.unshift("새 매치 시작: 포켓몬이 HP 0이 될 때까지 계속 전투하고, 쓰러지면 다음 포켓몬으로 이어집니다.");
  renderAll();
  if (state.room.role === "host" && !fromRemote) broadcast("state-sync", serializeState());
}

function setMode(mode) {
  state.mode = mode;
  state.players[1].name = mode === "ai" ? "AI" : (state.room.role === "host" ? "게스트" : "플레이어 2");
  resetMatchPresentation();
  renderAll();
  if (state.room.role === "host") broadcast("state-sync", serializeState());
}

function setDifficulty(level) {
  state.difficulty = level;
  if (state.mode === "ai" && state.started && !hasActiveBattle()) {
    state.players[1].selectedId = chooseAiCardId();
  }
  renderAll();
  if (state.room.role === "host") broadcast("state-sync", serializeState());
}

function selectCard(playerIndex, cardId, fromRemote = false) {
  if (!state.started || hasActiveBattle()) return;
  const card = state.players[playerIndex].deck.find((entry) => entry.id === cardId && !entry.used);
  if (!card) return;

  // Clear the previous KO/result presentation when the next Pokemon is chosen.
  state.latestRoundSummary = null;
  if (!state.latestMatchOutcome) {
    state.displayBattleCards = [null, null];
  }

  state.players[playerIndex].selectedId = cardId;
  if (state.mode === "ai" && playerIndex === 0) state.players[1].selectedId = chooseAiCardId();

  const leftPreviewCard = getSelectedCard(0);
  const rightPreviewCard = getSelectedCard(1);
  if (leftPreviewCard && rightPreviewCard) {
    state.displayBattleCards = [leftPreviewCard, rightPreviewCard];
  }

  renderAll();
  if (state.room.role === "host" && !fromRemote) broadcast("state-sync", serializeState());
}

function buildOutcomeState(result, title, copy) {
  return { result, title, copy };
}

function getHpPercent(card) {
  const currentHp = card.currentHp ?? card.hp;
  const maxHp = card.maxHp ?? card.hp;
  return Math.max(0, Math.min(100, Math.round((currentHp / Math.max(1, maxHp)) * 100)));
}

function getPrimaryType(card) {
  return card.types[0] || "normal";
}

function getHpFillClass(card) {
  const percent = getHpPercent(card);
  const typeClass = `is-${getPrimaryType(card)}`;
  if (percent <= 33) return `meongseok-game__hp-fill ${typeClass} is-low`;
  if (percent <= 66) return `meongseok-game__hp-fill ${typeClass} is-mid`;
  return `meongseok-game__hp-fill ${typeClass} is-high`;
}

function renderHpMeter(card, hidden = false) {
  if (hidden) {
    return `
      <div class="meongseok-game__hp-meter">
        <div class="meongseok-game__hp-row"><span>HP</span><strong>?</strong></div>
        <div class="meongseok-game__hp-track"><div class="meongseok-game__hp-fill is-mid" style="width: 50%"></div></div>
      </div>
    `;
  }

  const percent = getHpPercent(card);
  const fillClass = getHpFillClass(card);
  return `
    <div class="meongseok-game__hp-meter">
      <div class="meongseok-game__hp-row"><span>HP</span><strong>${card.currentHp ?? card.hp} / ${card.maxHp ?? card.hp}</strong></div>
      <div class="meongseok-game__hp-track"><div class="${fillClass}" style="width: ${percent}%"></div></div>
    </div>
  `;
}

function getBattleOverlayState(playerIndex) {
  if (!state.latestRoundSummary) return null;
  if (state.latestRoundSummary.result === "draw") {
    return { label: "DRAW", className: "is-draw" };
  }
  if (state.latestRoundSummary.result === "continue") {
    return null;
  }
  if (state.latestRoundSummary.result === "win") {
    return playerIndex === 0
      ? { label: "WIN", className: "is-win" }
      : { label: "LOSE", className: "is-lose" };
  }
  if (state.latestRoundSummary.result === "lose") {
    return playerIndex === 0
      ? { label: "LOSE", className: "is-lose" }
      : { label: "WIN", className: "is-win" };
  }
  return null;
}

function finalizeMatchOutcome() {
  const left = state.players[0].score;
  const right = state.players[1].score;
  const modeKey = state.mode === "ai" ? "ai" : "pvp";

  if (left > right) {
    updateRanking(modeKey, "win");
    state.latestMatchOutcome = buildOutcomeState("win", "WIN", `${state.players[0].name}이(가) ${left} : ${right}로 토너먼트 승리했습니다.`);
  } else if (right > left) {
    updateRanking(modeKey, "loss");
    state.latestMatchOutcome = buildOutcomeState("loss", "LOSE", `${state.players[1].name}에게 ${left} : ${right}로 토너먼트 패배했습니다.`);
  } else {
    updateRanking(modeKey, "draw");
    state.latestMatchOutcome = buildOutcomeState("draw", "DRAW", `최종 스코어 ${left} : ${right}로 승부를 가리지 못했습니다.`);
  }

  state.log.unshift(`최종 결과: ${state.latestMatchOutcome.copy}`);
}

function resolveRound(fromRemote = false) {
  const battle = hasActiveBattle() ? state.battleCards : ensureBattleCards();
  if (!battle) return;

  const leftCard = battle[0];
  const rightCard = battle[1];
  state.displayBattleCards = [leftCard, rightCard];
  const order = getBattleOrder(leftCard, rightCard);
  const turnLogs = [];

  for (const attackerIndex of order) {
    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const attacker = state.battleCards[attackerIndex];
    const defender = state.battleCards[defenderIndex];
    if (!attacker || !defender || attacker.currentHp <= 0 || defender.currentHp <= 0) continue;

    const damage = calculateDamage(attacker, defender);
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    turnLogs.push(`${attacker.name}의 공격! ${defender.name}에게 ${damage} 데미지, 남은 HP ${defender.currentHp}`);

    if (defender.currentHp <= 0) break;
  }

  state.latestRoundSummary = null;

  if (state.battleCards[0].currentHp <= 0 && state.battleCards[1].currentHp <= 0) {
    handleDoubleKnockout();
  } else if (state.battleCards[1].currentHp <= 0) {
    handleKnockout(0, 1);
  } else if (state.battleCards[0].currentHp <= 0) {
    handleKnockout(1, 0);
  } else {
    state.latestRoundSummary = {
      result: "continue",
      title: "BATTLE CONTINUES",
      copy: `${state.battleCards[0].name} HP ${state.battleCards[0].currentHp} / ${state.battleCards[0].maxHp}, ${state.battleCards[1].name} HP ${state.battleCards[1].currentHp} / ${state.battleCards[1].maxHp}`
    };
  }

  state.log.unshift(...turnLogs.reverse());
  meongseokElements.roundResult.textContent = turnLogs[turnLogs.length - 1] || "전투를 계속 진행하세요.";
  renderAll();
  if (state.room.role === "host" && !fromRemote) broadcast("state-sync", serializeState());
}

function renderImportedTeamPreview() {
  meongseokElements.importedTeamPreview.innerHTML = "";
  if (state.importedTeam.length === 0) {
    meongseokElements.importedTeamPreview.innerHTML = '<p class="meongseok-game__empty">불러온 팀이 없으면 랜덤 덱으로 플레이합니다.</p>';
    return;
  }
  for (const card of state.importedTeam) {
    const chip = document.createElement("div");
    chip.className = "meongseok-game__import-chip";
    chip.textContent = `${card.name} · ${card.types.map((type) => TYPE_LABEL[type] || type).join("/")}`;
    meongseokElements.importedTeamPreview.appendChild(chip);
  }
}

function renderRankingList(target, ranking) {
  target.innerHTML = "";
  const lines = [
    `레이팅 ${ranking.rating}`,
    `전적 ${ranking.wins}승 ${ranking.losses}패 ${ranking.draws}무`,
    `플레이 ${ranking.played}판`,
    `최고 연승 ${ranking.bestStreak}`
  ];
  for (const line of lines) {
    const item = document.createElement("li");
    item.textContent = line;
    target.appendChild(item);
  }
}

function renderStatus() {
  meongseokElements.matchStatus.textContent = state.started
    ? (state.importedTeam.length > 0 ? "내 팀 또는 랜덤 덱으로 게임이 진행 중입니다." : "랜덤 덱으로 게임이 진행 중입니다.")
    : "게임을 시작하면 덱이 준비됩니다.";
  meongseokElements.importStatus.textContent = state.importedTeamSource
    ? `불러온 팀 소스: ${state.importedTeamSource}`
    : "아직 외부 팀 데이터가 연결되지 않았습니다.";
  meongseokElements.aiStrategyStatus.textContent = getAiStrategyDescription();
}

function renderScoreboard() {
  meongseokElements.leftPlayerLabel.textContent = "플레이어 1";
  meongseokElements.rightPlayerLabel.textContent = state.players[1].name;
  meongseokElements.leftPanelTitle.textContent = state.importedTeam.length > 0 ? "플레이어 1 · 내 팀" : "플레이어 1";
  meongseokElements.rightPanelTitle.textContent = state.players[1].name;
  meongseokElements.leftPlayerScore.textContent = String(state.players[0].score);
  meongseokElements.rightPlayerScore.textContent = String(state.players[1].score);
  meongseokElements.leftPlayerDeckCount.textContent = `남은 포켓몬 ${getRemainingCards(0).length}마리`;
  meongseokElements.rightPlayerDeckCount.textContent = `남은 포켓몬 ${getRemainingCards(1).length}마리`;
  meongseokElements.roundIndicator.textContent = `KO ${state.round} / ${state.maxRounds}`;
  meongseokElements.turnIndicator.textContent = hasActiveBattle()
    ? `${state.battleCards[0].name} vs ${state.battleCards[1].name} 전투 중`
    : state.mode === "ai"
      ? `AI ${state.difficulty.toUpperCase()} 난이도`
      : state.room.role === "host"
        ? "호스트가 경기 진행 중"
        : state.room.role === "guest"
          ? "게스트가 실시간 동기화 중"
          : "플레이어 대전";
  meongseokElements.leftSelectionState.textContent = hasActiveBattle()
    ? `전투 중 · HP ${state.battleCards[0].currentHp}`
    : getSelectedCard(0) ? "선택 완료" : "카드를 선택하세요.";
  meongseokElements.rightSelectionState.textContent = hasActiveBattle()
    ? `전투 중 · HP ${state.battleCards[1].currentHp}`
    : state.mode === "ai"
      ? (getSelectedCard(1) ? "AI 선택 완료" : "AI 대기 중")
      : (getSelectedCard(1) ? "선택 완료" : "카드를 선택하세요.");
}

function renderMatchBanner() {
  const outcome = state.latestMatchOutcome;
  const roundSummary = state.latestRoundSummary;
  meongseokElements.matchBanner.classList.remove("is-win", "is-lose", "is-draw");

  if (outcome) {
    meongseokElements.matchBannerTitle.textContent = outcome.title;
    meongseokElements.matchBannerCopy.textContent = outcome.copy;
    meongseokElements.matchBanner.classList.add(`is-${outcome.result}`);
    return;
  }

  if (roundSummary) {
    meongseokElements.matchBannerTitle.textContent = roundSummary.title;
    meongseokElements.matchBannerCopy.textContent = roundSummary.copy;
    meongseokElements.matchBanner.classList.add(`is-${roundSummary.result}`);
    return;
  }

  meongseokElements.matchBannerTitle.textContent = "READY";
  meongseokElements.matchBannerCopy.textContent = "게임을 시작하면 최종 승패 결과가 여기에 표시됩니다.";
}

function renderHand(playerIndex) {
  const container = playerIndex === 0 ? meongseokElements.leftHand : meongseokElements.rightHand;
  const isAi = state.mode === "ai" && playerIndex === 1;
  const isGuestLocked = state.room.role === "guest" && playerIndex === 0;
  container.innerHTML = "";

  for (const card of state.players[playerIndex].deck) {
    const selected = state.players[playerIndex].selectedId === card.id;
    const hidden = isAi && !card.used && !selected;
    const article = document.createElement("article");
    article.className = "meongseok-game__card";
    article.innerHTML = `
      <div class="meongseok-game__card-top">
        <span class="meongseok-game__card-type">${hidden ? "???" : card.types.map((type) => TYPE_LABEL[type] || type).join("/")}</span>
        <span class="meongseok-game__card-badge">${hidden ? "비공개" : `ID ${card.id}`}</span>
      </div>
      <div class="meongseok-game__card-body">
        <div class="meongseok-game__card-image-wrap">
          <img class="meongseok-game__card-image" src="${hidden ? artwork(25) : card.image}" alt="${hidden ? "비공개 카드" : card.name}">
        </div>
        <div>
          <h4 class="meongseok-game__card-name">${hidden ? "미공개 카드" : card.name}</h4>
          <p class="meongseok-game__card-text">${hidden ? "상대 카드 정보는 공개되지 않습니다." : card.summary}</p>
          ${renderHpMeter(card, hidden)}
          <div class="meongseok-game__stat-list">
            <div class="meongseok-game__stat-item"><span>HP</span><strong>${hidden ? "?" : `${card.currentHp ?? card.hp} / ${card.maxHp ?? card.hp}`}</strong></div>
            <div class="meongseok-game__stat-item"><span>ATK</span><strong>${hidden ? "?" : card.attack}</strong></div>
            <div class="meongseok-game__stat-item"><span>SPD</span><strong>${hidden ? "?" : card.speed}</strong></div>
            <div class="meongseok-game__stat-item"><span>SKL</span><strong>${hidden ? "?" : card.skill}</strong></div>
          </div>
        </div>
      </div>
      <button class="meongseok-game__card-button${selected ? " is-selected" : ""}" type="button">${card.used ? "사용 완료" : selected ? "선택됨" : "선택"}</button>
    `;

    const button = article.querySelector(".meongseok-game__card-button");
    const disabled = !canSelectCard(playerIndex, card) || isAi || (state.mode === "pvp" && ((state.room.role === "guest" && playerIndex === 0) || (state.room.role === "host" && playerIndex === 1))) || isGuestLocked;
    if (disabled) button.disabled = true;
    else {
      button.addEventListener("click", () => {
        if (state.room.role === "guest") {
          broadcast("select-card", { cardId: card.id });
        } else if (state.room.role === "host" || state.room.role === "offline") {
          selectCard(playerIndex, card.id);
        }
      });
    }
    container.appendChild(article);
  }
}

function renderBattleCard(card, element, emptyText, playerIndex) {
  if (!card) {
    element.innerHTML = `<p class="meongseok-game__empty">${emptyText}</p>`;
    return;
  }

  const overlayState = getBattleOverlayState(playerIndex);
  element.innerHTML = `
    ${overlayState ? `<div class="meongseok-game__battle-overlay ${overlayState.className}">${overlayState.label}</div>` : ""}
    <div class="meongseok-game__battle-body">
      <div class="meongseok-game__card-image-wrap">
        <img class="meongseok-game__card-image" src="${card.image}" alt="${card.name}">
      </div>
      <div>
        <div class="meongseok-game__battle-top">
          <span class="meongseok-game__card-type">${card.types.map((type) => TYPE_LABEL[type] || type).join("/")}</span>
          <span class="meongseok-game__card-badge">${card.name}</span>
        </div>
        <p class="meongseok-game__card-text">${card.summary}</p>
        ${renderHpMeter(card)}
        <div class="meongseok-game__stat-list">
          <div class="meongseok-game__stat-item"><span>ATK</span><strong>${card.attack}</strong></div>
          <div class="meongseok-game__stat-item"><span>SPD</span><strong>${card.speed}</strong></div>
          <div class="meongseok-game__stat-item"><span>SKL</span><strong>${card.skill}</strong></div>
        </div>
      </div>
    </div>
  `;
}

function renderLog() {
  meongseokElements.battleLog.innerHTML = "";
  if (state.log.length === 0) {
    meongseokElements.battleLog.innerHTML = '<li class="meongseok-game__empty">새 게임을 시작하면 전투 기록이 여기에 표시됩니다.</li>';
    return;
  }
  for (const entry of state.log) {
    const item = document.createElement("li");
    item.textContent = entry;
    meongseokElements.battleLog.appendChild(item);
  }
}

function renderAll() {
  meongseokElements.modeAiButton.classList.toggle("is-active", state.mode === "ai");
  meongseokElements.modePvpButton.classList.toggle("is-active", state.mode === "pvp");
  meongseokElements.difficultyGroup.style.display = state.mode === "ai" ? "block" : "none";
  meongseokElements.difficultyEasyButton.classList.toggle("is-active", state.difficulty === "easy");
  meongseokElements.difficultyNormalButton.classList.toggle("is-active", state.difficulty === "normal");
  meongseokElements.difficultyHardButton.classList.toggle("is-active", state.difficulty === "hard");
  meongseokElements.resolveRoundButton.disabled = !(hasActiveBattle() || (getSelectedCard(0) && getSelectedCard(1))) || Boolean(state.latestMatchOutcome);
  meongseokElements.roundResult.textContent = state.log[0] || "양쪽 플레이어가 카드를 고르면 전투가 시작되고, HP 0이 될 때까지 계속 교전합니다.";
  renderStatus();
  renderRoomStatus();
  renderImportedTeamPreview();
  renderScoreboard();
  renderMatchBanner();
  renderRankingList(meongseokElements.aiRankingList, state.rankings.ai);
  renderRankingList(meongseokElements.pvpRankingList, state.rankings.pvp);
  renderHand(0);
  renderHand(1);
  renderBattleCard((state.battleCards[0] || state.displayBattleCards[0]), meongseokElements.leftBattleCard, "플레이어 1의 카드 대기 중", 0);
  renderBattleCard((state.battleCards[1] || state.displayBattleCards[1]), meongseokElements.rightBattleCard, "상대 카드 대기 중", 1);
  renderLog();
}

window.addEventListener("team-builder:team-selected", (event) => {
  if (importTeamFromPayload(event.detail || {}, "event:team-builder:team-selected")) renderAll();
});

window.addEventListener("storage", () => {
  if (tryLoadImportedTeam()) renderAll();
});

if (meongseokElements.root) {
  tryLoadImportedTeam();
  meongseokElements.modeAiButton.addEventListener("click", () => setMode("ai"));
  meongseokElements.modePvpButton.addEventListener("click", () => setMode("pvp"));
  meongseokElements.difficultyEasyButton.addEventListener("click", () => setDifficulty("easy"));
  meongseokElements.difficultyNormalButton.addEventListener("click", () => setDifficulty("normal"));
  meongseokElements.difficultyHardButton.addEventListener("click", () => setDifficulty("hard"));
  meongseokElements.startMatchButton.addEventListener("click", () => {
    if (state.room.role === "guest") broadcast("start-match", { useImportedTeam: false });
    else startMatch(false);
  });
  meongseokElements.loadTeamButton.addEventListener("click", () => {
    if (!tryLoadImportedTeam()) {
      meongseokElements.importStatus.textContent = "아직 읽을 수 있는 외부 팀 데이터가 없습니다.";
      return;
    }
    if (state.room.role === "guest") broadcast("start-match", { useImportedTeam: true });
    else startMatch(true);
  });
  meongseokElements.createRoomButton.addEventListener("click", createRoom);
  meongseokElements.joinRoomButton.addEventListener("click", joinRoom);
  meongseokElements.leaveRoomButton.addEventListener("click", () => {
    leaveRoom();
    renderAll();
  });
  meongseokElements.resolveRoundButton.addEventListener("click", () => {
    if (state.room.role === "guest") broadcast("resolve-round");
    else resolveRound();
  });
  meongseokElements.resetLogButton.addEventListener("click", () => {
    state.log = [];
    renderLog();
    if (state.room.role === "host") broadcast("state-sync", serializeState());
  });
  renderAll();
}




















