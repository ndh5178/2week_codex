const meongseokElements = {
  root: document.querySelector(".meongseok-game"),
  modeAiButton: document.getElementById("modeAiButton"),
  modePvpButton: document.getElementById("modePvpButton"),
  difficultyGroup: document.getElementById("difficultyGroup"),
  difficultyEasyButton: document.getElementById("difficultyEasyButton"),
  difficultyNormalButton: document.getElementById("difficultyNormalButton"),
  difficultyHardButton: document.getElementById("difficultyHardButton"),
  startMatchButton: document.getElementById("startMatchButton"),
  resolveRoundButton: document.getElementById("resolveRoundButton"),
  resetLogButton: document.getElementById("resetLogButton"),
  matchStatus: document.getElementById("matchStatus"),
  roundIndicator: document.getElementById("roundIndicator"),
  turnIndicator: document.getElementById("turnIndicator"),
  roundResult: document.getElementById("roundResult"),
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
  battleLog: document.getElementById("battleLog"),
  battleArena: document.getElementById("battleArena"),
  versusBadge: document.getElementById("versusBadge"),
  skillTooltip: document.getElementById("skillTooltip"),
  resultModalBackdrop: document.getElementById("resultModalBackdrop"),
  resultModalText: document.getElementById("resultModalText"),
  closeResultModalButton: document.getElementById("closeResultModalButton"),
  restartMatchButton: document.getElementById("restartMatchButton")
};

const TYPE_LABEL = {
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  psychic: "에스퍼",
  fighting: "격투",
  dragon: "드래곤",
  dark: "다크"
};

const TYPE_ADVANTAGE = {
  fire: ["grass"],
  water: ["fire"],
  grass: ["water"],
  electric: ["water"],
  psychic: ["fighting"],
  fighting: ["dark"],
  dragon: ["dragon"],
  dark: ["psychic"]
};

const HIDDEN_IMAGE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

const POKEMON_POOL = [
  { id: 6, name: "리자몽", type: "fire", hp: 82, attack: 94, speed: 100, skill: 88, skillName: "블레이즈 차지", skillText: "첫 공격 피해 +14", skillEffect: "opening-burst", flavor: "폭발적인 화력으로 짧은 승부에 강합니다." },
  { id: 9, name: "거북왕", type: "water", hp: 90, attack: 83, speed: 78, skill: 86, skillName: "하드 셸", skillText: "받는 첫 피해 -12", skillEffect: "shield", flavor: "탄탄한 방어와 안정적인 밸런스를 갖춘 카드입니다." },
  { id: 3, name: "이상해꽃", type: "grass", hp: 88, attack: 82, speed: 80, skill: 90, skillName: "그린 리프", skillText: "라운드 종료 시 체력 +10", skillEffect: "heal", flavor: "지속력과 제어력이 좋아 긴 싸움에 어울립니다." },
  { id: 25, name: "피카츄", type: "electric", hp: 60, attack: 72, speed: 112, skill: 84, skillName: "퀵 스타트", skillText: "속도 우위면 추가 피해 +10", skillEffect: "speed-burst", flavor: "매우 빠른 선공형 카드입니다." },
  { id: 150, name: "뮤츠", type: "psychic", hp: 106, attack: 110, speed: 100, skill: 120, skillName: "사이코 브레이크", skillText: "스킬 차이만큼 피해 +최대 18", skillEffect: "skill-break", flavor: "거의 모든 면에서 강력한 전설 카드입니다." },
  { id: 149, name: "망나뇽", type: "dragon", hp: 96, attack: 104, speed: 80, skill: 92, skillName: "드래곤 하트", skillText: "체력이 50% 이하면 공격 +12", skillEffect: "last-stand", flavor: "높은 공격력으로 후반 역전에 강합니다." },
  { id: 94, name: "팬텀", type: "dark", hp: 66, attack: 88, speed: 110, skill: 94, skillName: "팬텀 트릭", skillText: "랜덤으로 피해 0~16 추가", skillEffect: "random-trick", flavor: "트릭 전술로 변수 창출에 특화되어 있습니다." },
  { id: 448, name: "루카리오", type: "fighting", hp: 78, attack: 104, speed: 90, skill: 88, skillName: "오라 집중", skillText: "공격 피해가 항상 안정적으로 +8", skillEffect: "steady-strike", flavor: "공격과 순발력을 겸비한 압박형 카드입니다." },
  { id: 700, name: "님피아", type: "psychic", hp: 95, attack: 76, speed: 80, skill: 110, skillName: "매혹의 리본", skillText: "상대 첫 공격 피해 -10", skillEffect: "soft-guard", flavor: "스킬 수치가 높아 전략 전개에 유리합니다." },
  { id: 445, name: "한카리아스", type: "dragon", hp: 108, attack: 118, speed: 92, skill: 84, skillName: "샌드 러시", skillText: "선공이면 피해 +12", skillEffect: "first-hit", flavor: "정면 승부에서 매우 높은 파괴력을 냅니다." },
  { id: 658, name: "개굴닌자", type: "water", hp: 72, attack: 95, speed: 122, skill: 90, skillName: "닌자 스텝", skillText: "첫 피해를 절반으로 감소", skillEffect: "evade", flavor: "가장 빠른 축에 드는 기습형 카드입니다." },
  { id: 282, name: "가디안", type: "psychic", hp: 86, attack: 78, speed: 84, skill: 116, skillName: "미래 예지", skillText: "상대 타입 우위를 무효화", skillEffect: "anti-type", flavor: "높은 스킬 수치로 역전 확률을 올립니다." },
  { id: 257, name: "번치코", type: "fire", hp: 80, attack: 108, speed: 88, skill: 82, skillName: "파이어 킥", skillText: "공격 기본 피해 +10", skillEffect: "steady-strike", flavor: "강한 일격으로 흐름을 가져오는 카드입니다." },
  { id: 260, name: "대짱이", type: "water", hp: 100, attack: 92, speed: 72, skill: 78, skillName: "머드 가드", skillText: "받는 첫 피해 -12", skillEffect: "shield", flavor: "버티기에 특화된 중후한 카드입니다." },
  { id: 923, name: "파모트", type: "electric", hp: 78, attack: 86, speed: 105, skill: 80, skillName: "전광 대시", skillText: "속도 우위면 추가 피해 +10", skillEffect: "speed-burst", flavor: "빠르게 몰아붙이는 전개에 특화되어 있습니다." },
  { id: 706, name: "미끄래곤", type: "dragon", hp: 104, attack: 88, speed: 80, skill: 96, skillName: "재생 점액", skillText: "라운드 종료 시 체력 +10", skillEffect: "heal", flavor: "오래 버티며 판을 뒤집는 카드입니다." }
];

const INITIAL_STATE = {
  mode: "ai",
  difficulty: "easy",
  round: 0,
  maxRounds: 3,
  started: false,
  gameOver: false,
  turnOwner: 0,
  players: [
    { id: 0, name: "플레이어 1", hand: [], score: 0, selectedCardId: null },
    { id: 1, name: "AI", hand: [], score: 0, selectedCardId: null }
  ],
  battleCards: [null, null],
  lastWinner: null,
  log: [],
  resultText: "양쪽 플레이어가 카드를 고르면 라운드가 시작됩니다."
};

let meongseokState = cloneInitialState();

function cloneInitialState() {
  return {
    mode: INITIAL_STATE.mode,
    difficulty: INITIAL_STATE.difficulty,
    round: INITIAL_STATE.round,
    maxRounds: INITIAL_STATE.maxRounds,
    started: INITIAL_STATE.started,
    gameOver: INITIAL_STATE.gameOver,
    turnOwner: INITIAL_STATE.turnOwner,
    players: INITIAL_STATE.players.map((player) => ({ ...player, hand: [] })),
    battleCards: [...INITIAL_STATE.battleCards],
    lastWinner: INITIAL_STATE.lastWinner,
    log: [],
    resultText: INITIAL_STATE.resultText
  };
}

function createArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function randomizeDeck(size) {
  return shuffle(POKEMON_POOL).slice(0, size).map((pokemon) => ({
    ...pokemon,
    image: createArtworkUrl(pokemon.id),
    used: false,
    currentHp: pokemon.hp,
    effects: {
      shieldReady: pokemon.skillEffect === "shield",
      softGuardReady: pokemon.skillEffect === "soft-guard",
      evadeReady: pokemon.skillEffect === "evade"
    }
  }));
}

function resetStateForMode(mode) {
  const difficulty = meongseokState.difficulty;
  meongseokState = cloneInitialState();
  meongseokState.mode = mode;
  meongseokState.difficulty = difficulty;
  meongseokState.players[1].name = mode === "ai" ? "AI" : "플레이어 2";
  closeResultModal();
}

function setDifficulty(level) {
  meongseokState.difficulty = level;
  renderGame();
}

function getTypeBonus(attackerType, defenderType, defenderCard) {
  if (defenderCard && defenderCard.skillEffect === "anti-type") {
    return 0;
  }
  return TYPE_ADVANTAGE[attackerType]?.includes(defenderType) ? 12 : 0;
}

function findCardById(playerIndex, cardId) {
  return meongseokState.players[playerIndex].hand.find((card) => card.id === cardId && !card.used) || null;
}

function getAvailableCards(playerIndex) {
  return meongseokState.players[playerIndex].hand.filter((card) => !card.used);
}

function setMode(mode) {
  resetStateForMode(mode);
  renderGame();
}

function startMatch() {
  meongseokState.started = true;
  meongseokState.gameOver = false;
  meongseokState.round = 0;
  meongseokState.turnOwner = 0;
  meongseokState.lastWinner = null;
  meongseokState.log = [];
  meongseokState.battleCards = [null, null];
  meongseokState.resultText = "양쪽 플레이어가 카드를 고르면 라운드가 시작됩니다.";
  meongseokState.players = [
    { id: 0, name: "플레이어 1", hand: randomizeDeck(3), score: 0, selectedCardId: null },
    { id: 1, name: meongseokState.mode === "ai" ? "AI" : "플레이어 2", hand: randomizeDeck(3), score: 0, selectedCardId: null }
  ];

  if (meongseokState.mode === "ai") {
    meongseokState.players[1].selectedCardId = chooseAiCardId();
  }

  closeResultModal();
  renderGame();
}

function estimateBattleValue(card, opponentCard) {
  const typeBonus = opponentCard ? getTypeBonus(card.type, opponentCard.type, opponentCard) : 0;
  return card.attack * 1.2 + card.speed + card.skill + card.currentHp * 0.6 + typeBonus;
}

function chooseAiCardId() {
  const availableCards = getAvailableCards(1);
  const opponentCard = findCardById(0, meongseokState.players[0].selectedCardId);
  if (availableCards.length === 0) {
    return null;
  }

  if (meongseokState.difficulty === "easy") {
    return availableCards[Math.floor(Math.random() * availableCards.length)].id;
  }

  const ranked = availableCards
    .map((card) => ({ card, value: estimateBattleValue(card, opponentCard) }))
    .sort((left, right) => right.value - left.value);

  if (meongseokState.difficulty === "normal") {
    const topChoices = ranked.slice(0, Math.min(2, ranked.length));
    return topChoices[Math.floor(Math.random() * topChoices.length)].card.id;
  }

  return ranked[0].card.id;
}

function selectCard(playerIndex, cardId) {
  if (!meongseokState.started || meongseokState.gameOver) {
    return;
  }

  if (meongseokState.mode === "pvp" && meongseokState.turnOwner !== playerIndex) {
    return;
  }

  const player = meongseokState.players[playerIndex];
  const card = findCardById(playerIndex, cardId);
  if (!card) {
    return;
  }

  player.selectedCardId = card.id;

  if (meongseokState.mode === "pvp") {
    meongseokState.turnOwner = playerIndex === 0 ? 1 : 0;
  }

  if (meongseokState.mode === "ai" && playerIndex === 0) {
    meongseokState.players[1].selectedCardId = chooseAiCardId();
  }

  renderGame();
}

function applySkillBeforeAttack(attacker, defender, attackOrderIndex) {
  let damageBonus = 0;
  const logs = [];

  if (attacker.skillEffect === "opening-burst" && attackOrderIndex === 0) {
    damageBonus += 14;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 첫 공격 피해 +14`);
  }
  if (attacker.skillEffect === "speed-burst" && attacker.speed > defender.speed) {
    damageBonus += 10;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 속도 우위 추가 피해 +10`);
  }
  if (attacker.skillEffect === "skill-break") {
    const bonus = Math.min(18, Math.max(0, Math.floor((attacker.skill - defender.skill) / 2)));
    if (bonus > 0) {
      damageBonus += bonus;
      logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 정신 타격 +${bonus}`);
    }
  }
  if (attacker.skillEffect === "last-stand" && attacker.currentHp <= Math.floor(attacker.hp / 2)) {
    damageBonus += 12;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 위기 상황 공격 +12`);
  }
  if (attacker.skillEffect === "random-trick") {
    const bonus = Math.floor(Math.random() * 17);
    damageBonus += bonus;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 변칙 피해 +${bonus}`);
  }
  if (attacker.skillEffect === "steady-strike") {
    damageBonus += 8;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 안정 피해 +8`);
  }
  if (attacker.skillEffect === "first-hit" && attackOrderIndex === 0) {
    damageBonus += 12;
    logs.push(`${attacker.name}의 ${attacker.skillName} 발동: 선공 추가 피해 +12`);
  }

  return { damageBonus, logs };
}

function applyDefenseEffects(defender, damage, logs) {
  let reduced = damage;

  if (defender.skillEffect === "shield" && defender.effects.shieldReady) {
    reduced = Math.max(0, reduced - 12);
    defender.effects.shieldReady = false;
    logs.push(`${defender.name}의 하드 셸 발동: 피해 -12`);
  }
  if (defender.skillEffect === "soft-guard" && defender.effects.softGuardReady) {
    reduced = Math.max(0, reduced - 10);
    defender.effects.softGuardReady = false;
    logs.push(`${defender.name}의 매혹의 리본 발동: 피해 -10`);
  }
  if (defender.skillEffect === "evade" && defender.effects.evadeReady) {
    reduced = Math.floor(reduced / 2);
    defender.effects.evadeReady = false;
    logs.push(`${defender.name}의 닌자 스텝 발동: 피해 절반 감소`);
  }

  return reduced;
}

function runSingleAttack(attacker, defender, attackOrderIndex) {
  const skillResult = applySkillBeforeAttack(attacker, defender, attackOrderIndex);
  const typeBonus = getTypeBonus(attacker.type, defender.type, defender);
  const baseDamage = Math.max(14, Math.floor(attacker.attack * 0.55 + attacker.skill * 0.25));
  let damage = baseDamage + typeBonus + skillResult.damageBonus;
  const logs = [...skillResult.logs];

  if (typeBonus > 0) {
    logs.push(`${attacker.name} 타입 상성 보너스 +${typeBonus}`);
  }

  damage = applyDefenseEffects(defender, damage, logs);
  defender.currentHp = Math.max(0, defender.currentHp - damage);
  logs.push(`${attacker.name}의 공격으로 ${defender.name}에게 ${damage} 피해`);

  return logs;
}

function applyEndOfRound(card, logs) {
  if (card.skillEffect === "heal" && card.currentHp > 0) {
    const before = card.currentHp;
    card.currentHp = Math.min(card.hp, card.currentHp + 10);
    const healed = card.currentHp - before;
    if (healed > 0) {
      logs.push(`${card.name}의 그린 리프 발동: 체력 ${healed} 회복`);
    }
  }
}

function resolveBattle(leftCard, rightCard) {
  const logs = [];
  const leftFirst = leftCard.speed >= rightCard.speed;
  const order = leftFirst ? [[leftCard, rightCard], [rightCard, leftCard]] : [[rightCard, leftCard], [leftCard, rightCard]];

  logs.push(leftFirst ? `${leftCard.name}가 더 빨라 선공합니다.` : `${rightCard.name}가 더 빨라 선공합니다.`);

  for (let index = 0; index < order.length; index += 1) {
    const attacker = order[index][0];
    const defender = order[index][1];
    if (attacker.currentHp <= 0 || defender.currentHp <= 0) {
      continue;
    }

    logs.push(...runSingleAttack(attacker, defender, index));

    if (defender.currentHp <= 0) {
      logs.push(`${defender.name} 전투 불능`);
      break;
    }
  }

  if (leftCard.currentHp > 0 && rightCard.currentHp > 0) {
    applyEndOfRound(leftCard, logs);
    applyEndOfRound(rightCard, logs);
  }

  return logs;
}

function buildRoundSummary(leftCard, rightCard) {
  if (leftCard.currentHp > rightCard.currentHp) {
    meongseokState.players[0].score += 1;
    meongseokState.lastWinner = 0;
    return `${meongseokState.players[0].name} 승리, ${leftCard.name}가 ${leftCard.currentHp} HP를 남겼습니다.`;
  }
  if (rightCard.currentHp > leftCard.currentHp) {
    meongseokState.players[1].score += 1;
    meongseokState.lastWinner = 1;
    return `${meongseokState.players[1].name} 승리, ${rightCard.name}가 ${rightCard.currentHp} HP를 남겼습니다.`;
  }
  meongseokState.lastWinner = null;
  return "양쪽 카드가 끝까지 버텨 무승부가 되었습니다.";
}

function triggerBattleAnimation() {
  meongseokElements.battleArena.classList.remove("is-resolving");
  meongseokElements.roundResult.classList.remove("is-highlight");
  void meongseokElements.battleArena.offsetWidth;
  meongseokElements.battleArena.classList.add("is-resolving");
  meongseokElements.roundResult.classList.add("is-highlight");
  setTimeout(() => {
    meongseokElements.battleArena.classList.remove("is-resolving");
    meongseokElements.roundResult.classList.remove("is-highlight");
  }, 760);
}

function resolveRound() {
  if (!canResolveRound()) {
    return;
  }

  const leftCard = findCardById(0, meongseokState.players[0].selectedCardId);
  const rightCard = findCardById(1, meongseokState.players[1].selectedCardId);
  if (!leftCard || !rightCard) {
    return;
  }

  const details = resolveBattle(leftCard, rightCard);
  leftCard.used = true;
  rightCard.used = true;
  meongseokState.round += 1;
  meongseokState.turnOwner = 0;
  meongseokState.battleCards = [leftCard, rightCard];

  const summary = `라운드 ${meongseokState.round}: ${buildRoundSummary(leftCard, rightCard)}`;
  meongseokState.resultText = `${summary} ${details.join(" / ")}`;
  meongseokState.log.unshift(meongseokState.resultText);
  meongseokState.players[0].selectedCardId = null;
  meongseokState.players[1].selectedCardId = null;

  if (meongseokState.round >= meongseokState.maxRounds) {
    meongseokState.gameOver = true;
    openResultModal(buildWinnerMessage());
  } else if (meongseokState.mode === "ai") {
    meongseokState.players[1].selectedCardId = chooseAiCardId();
  }

  renderGame();
  triggerBattleAnimation();
}

function buildWinnerMessage() {
  const leftScore = meongseokState.players[0].score;
  const rightScore = meongseokState.players[1].score;

  if (leftScore > rightScore) {
    return `${meongseokState.players[0].name}가 ${leftScore}:${rightScore}로 최종 승리했습니다.`;
  }
  if (rightScore > leftScore) {
    return `${meongseokState.players[1].name}가 ${rightScore}:${leftScore}로 최종 승리했습니다.`;
  }
  return `최종 결과는 ${leftScore}:${rightScore} 무승부입니다.`;
}

function canResolveRound() {
  return Boolean(
    meongseokState.started &&
    !meongseokState.gameOver &&
    meongseokState.players[0].selectedCardId &&
    meongseokState.players[1].selectedCardId
  );
}


function getCardTheme(card) {
  const themeMap = {
    fire: "Blaze",
    water: "Wave",
    grass: "Forest",
    electric: "Volt",
    psychic: "Mystic",
    fighting: "Arena",
    dragon: "Sky",
    dark: "Shadow"
  };
  return themeMap[card.type] || "Core";
}

function getCardRarity(card) {
  const total = card.hp + card.attack + card.speed + card.skill;
  if (total >= 400) {
    return { label: "Epic", className: "is-epic" };
  }
  if (total >= 350) {
    return { label: "Rare", className: "is-rare" };
  }
  return { label: "Common", className: "" };
}
function createHealthMarkup(card, hidden) {
  const currentHp = hidden ? "?" : card.currentHp;
  const percent = hidden ? 0 : Math.max(0, Math.round((card.currentHp / card.hp) * 100));
  return `
    <div class="meongseok-game__health-row">
      <div class="meongseok-game__health-bar">
        <div class="meongseok-game__health-fill" style="width: ${percent}%;"></div>
      </div>
      <span class="meongseok-game__health-text">HP ${currentHp}${hidden ? "" : ` / ${card.hp}`}</span>
    </div>
  `;
}

function attachTooltipEvents(target, text) {
  if (!target || !text) {
    return;
  }

  const show = (event) => {
    meongseokElements.skillTooltip.textContent = text;
    meongseokElements.skillTooltip.classList.add("is-visible");
    moveTooltip(event);
  };
  const hide = () => {
    meongseokElements.skillTooltip.classList.remove("is-visible");
  };

  target.addEventListener("mouseenter", show);
  target.addEventListener("mousemove", moveTooltip);
  target.addEventListener("mouseleave", hide);
  target.addEventListener("focus", (event) => show(event));
  target.addEventListener("blur", hide);
}

function moveTooltip(event) {
  const x = (event.clientX || 0) + 14;
  const y = (event.clientY || 0) + 14;
  meongseokElements.skillTooltip.style.left = `${x}px`;
  meongseokElements.skillTooltip.style.top = `${y}px`;
}

function renderHand(playerIndex) {
  const player = meongseokState.players[playerIndex];
  const container = playerIndex === 0 ? meongseokElements.leftHand : meongseokElements.rightHand;
  const isAi = meongseokState.mode === "ai" && playerIndex === 1;
  const isHiddenPvp = meongseokState.mode === "pvp" && playerIndex === 1 && meongseokState.turnOwner === 0 && !player.selectedCardId;

  container.innerHTML = "";

  for (const card of player.hand) {
    const selected = player.selectedCardId === card.id;
    const hidden = (isAi || isHiddenPvp) && !card.used && !selected;
    const disabled = card.used || (meongseokState.mode === "ai" && playerIndex === 1) || (meongseokState.mode === "pvp" && meongseokState.turnOwner !== playerIndex);
    const cardElement = document.createElement("article");
    cardElement.className = `meongseok-game__card${selected ? " is-selected" : ""}${card.used ? " is-used" : ""}`;

    cardElement.innerHTML = `
      <div class="meongseok-game__card-top">
        <div>
          <span class="meongseok-game__card-badge meongseok-game__type-${card.type}">${hidden ? "???" : TYPE_LABEL[card.type]}</span>
          <h4 class="meongseok-game__card-name">${hidden ? "미공개 카드" : card.name}</h4>
        </div>
        <div><span class="meongseok-game__theme-badge">${hidden ? "???" : getCardTheme(card)}</span> <button class="meongseok-game__skill-badge" type="button">${hidden ? "정보 비공개" : card.skillName}</button></div>
      </div>
      <div class="meongseok-game__card-body">
        <div class="meongseok-game__card-image-wrap">
          <img class="meongseok-game__card-image" src="${hidden ? HIDDEN_IMAGE : card.image}" alt="${hidden ? "비공개 카드" : `${card.name} 이미지`}">
        </div>
        <div>
          <p class="meongseok-game__card-description">${hidden ? "상대가 아직 공개하지 않은 카드입니다." : `${card.flavor} 스킬: ${card.skillText}`}</p>
          <div class="meongseok-game__story-tags">
            <span class="meongseok-game__rarity-badge ${getCardRarity(card).className}">${hidden ? "???" : getCardRarity(card).label}</span>
            <span class="meongseok-game__theme-badge">${hidden ? "???" : getCardTheme(card)}</span>
          </div>
          ${createHealthMarkup(card, hidden)}
          <div class="meongseok-game__stat-grid">
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">ATK</span><span class="meongseok-game__stat-value">${hidden ? "?" : card.attack}</span></div>
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">SPD</span><span class="meongseok-game__stat-value">${hidden ? "?" : card.speed}</span></div>
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">SKL</span><span class="meongseok-game__stat-value">${hidden ? "?" : card.skill}</span></div>
          </div>
        </div>
      </div>
      <button class="meongseok-game__card-button${selected ? " is-selected" : ""}" type="button" ${disabled ? "disabled" : ""}>${card.used ? "사용 완료" : selected ? "선택됨" : hidden ? (isAi ? "AI 카드" : "비공개 카드") : "이 카드 선택"}</button>
    `;

    const actionButton = cardElement.querySelector(".meongseok-game__card-button");
    const skillButton = cardElement.querySelector(".meongseok-game__skill-badge");
    if (!disabled) {
      actionButton.addEventListener("click", () => selectCard(playerIndex, card.id));
    }
    attachTooltipEvents(skillButton, hidden ? "상대가 아직 공개하지 않은 카드입니다." : `${card.skillName}: ${card.skillText}`);

    container.appendChild(cardElement);
  }
}

function renderBattleCard(card, container, placeholder, isWinner) {
  container.classList.toggle("is-winning", Boolean(card) && isWinner);

  if (!card) {
    container.innerHTML = `<p class="meongseok-game__battle-placeholder">${placeholder}</p>`;
    return;
  }

  container.innerHTML = `
    <div class="meongseok-game__battle-card-content">
      <div class="meongseok-game__battle-image-wrap">
        <img class="meongseok-game__battle-image" src="${card.image}" alt="${card.name} 이미지">
      </div>
      <div>
        <div class="meongseok-game__battle-top">
          <span class="meongseok-game__battle-badge meongseok-game__type-${card.type}">${TYPE_LABEL[card.type]}</span>
          <div><span class="meongseok-game__rarity-badge ${getCardRarity(card).className}">${getCardRarity(card).label}</span> <button class="meongseok-game__skill-badge" type="button">${card.skillName}</button></div>
        </div>
        <h4 class="meongseok-game__battle-name">${card.name}</h4>
        <p class="meongseok-game__battle-meta">${card.skillText}</p>
        ${createHealthMarkup(card, false)}
        <p class="meongseok-game__battle-meta">ATK ${card.attack} / SPD ${card.speed} / SKL ${card.skill}</p>
      </div>
    </div>
  `;

    const skillButton = container.querySelector(".meongseok-game__skill-badge");
    attachTooltipEvents(skillButton, `${card.skillName}: ${card.skillText}`);
}

function renderLog() {
  meongseokElements.battleLog.innerHTML = "";

  if (meongseokState.log.length === 0) {
    meongseokElements.battleLog.innerHTML = '<li class="meongseok-game__log-item is-empty">새 게임을 시작하면 라운드 기록이 여기에 표시됩니다.</li>';
    return;
  }

  for (const entry of meongseokState.log) {
    const item = document.createElement("li");
    item.className = "meongseok-game__log-item";
    item.textContent = entry;
    meongseokElements.battleLog.appendChild(item);
  }
}

function getSelectionLabel(playerIndex) {
  const player = meongseokState.players[playerIndex];
  const selectedCard = findCardById(playerIndex, player.selectedCardId);

  if (!meongseokState.started) {
    return playerIndex === 0 ? "카드를 선택하세요." : meongseokState.mode === "ai" ? "AI가 준비 중입니다." : "카드를 선택하세요.";
  }
  if (selectedCard) {
    return meongseokState.mode === "ai" && playerIndex === 1 ? "AI 카드 선택 완료" : `${selectedCard.name} 선택 완료`;
  }
  if (meongseokState.gameOver) {
    return "전투 종료";
  }
  if (meongseokState.mode === "pvp") {
    return meongseokState.turnOwner === playerIndex ? "지금 선택할 차례입니다." : "상대 차례입니다.";
  }

  return playerIndex === 1 ? "AI가 카드 분석 중입니다." : "카드를 선택하세요.";
}

function updateScoreboard() {
  meongseokElements.leftPlayerLabel.textContent = meongseokState.players[0].name;
  meongseokElements.rightPlayerLabel.textContent = meongseokState.players[1].name;
  meongseokElements.leftPanelTitle.textContent = meongseokState.players[0].name;
  meongseokElements.rightPanelTitle.textContent = meongseokState.players[1].name;
  meongseokElements.leftPlayerScore.textContent = String(meongseokState.players[0].score);
  meongseokElements.rightPlayerScore.textContent = String(meongseokState.players[1].score);
  meongseokElements.leftPlayerDeckCount.textContent = `남은 카드 ${getAvailableCards(0).length}장`;
  meongseokElements.rightPlayerDeckCount.textContent = `남은 카드 ${getAvailableCards(1).length}장`;
  meongseokElements.roundIndicator.textContent = `${meongseokState.round} / ${meongseokState.maxRounds}`;
  meongseokElements.leftSelectionState.textContent = getSelectionLabel(0);
  meongseokElements.rightSelectionState.textContent = getSelectionLabel(1);
  meongseokElements.turnIndicator.textContent = meongseokState.mode === "ai"
    ? `플레이어 1이 카드를 고르면 AI가 ${meongseokState.difficulty.toUpperCase()} 난이도로 대응합니다.`
    : meongseokState.started
      ? `${meongseokState.players[meongseokState.turnOwner].name} 차례`
      : "카드를 선택하세요.";
}

function openResultModal(text) {
  meongseokElements.resultModalText.textContent = text;
  meongseokElements.resultModalBackdrop.classList.remove("is-hidden");
}

function closeResultModal() {
  meongseokElements.resultModalBackdrop.classList.add("is-hidden");
}

function renderGame() {
  if (!meongseokElements.root) {
    return;
  }

  meongseokElements.modeAiButton.classList.toggle("is-active", meongseokState.mode === "ai");
  meongseokElements.modePvpButton.classList.toggle("is-active", meongseokState.mode === "pvp");
  meongseokElements.difficultyGroup.style.display = meongseokState.mode === "ai" ? "block" : "none";
  meongseokElements.difficultyEasyButton.classList.toggle("is-active", meongseokState.difficulty === "easy");
  meongseokElements.difficultyNormalButton.classList.toggle("is-active", meongseokState.difficulty === "normal");
  meongseokElements.difficultyHardButton.classList.toggle("is-active", meongseokState.difficulty === "hard");

  if (meongseokState.gameOver) {
    meongseokElements.matchStatus.textContent = buildWinnerMessage();
  } else if (meongseokState.started) {
    meongseokElements.matchStatus.textContent = meongseokState.mode === "ai"
      ? `카드를 선택하면 AI가 ${meongseokState.difficulty.toUpperCase()} 난이도로 대응합니다.`
      : "플레이어 1과 플레이어 2가 번갈아 비공개로 카드를 고릅니다.";
  } else {
    meongseokElements.matchStatus.textContent = "게임을 시작하면 랜덤 덱이 준비됩니다.";
  }

  meongseokElements.roundResult.textContent = meongseokState.resultText;
  meongseokElements.resolveRoundButton.disabled = !canResolveRound();

  updateScoreboard();
  renderHand(0);
  renderHand(1);
  renderBattleCard(meongseokState.battleCards[0], meongseokElements.leftBattleCard, "플레이어 1의 카드 대기 중", meongseokState.lastWinner === 0);
  renderBattleCard(meongseokState.battleCards[1], meongseokElements.rightBattleCard, meongseokState.mode === "ai" ? "AI 카드 대기 중" : "플레이어 2의 카드 대기 중", meongseokState.lastWinner === 1);
  renderLog();
}

if (meongseokElements.root) {
  meongseokElements.modeAiButton.addEventListener("click", () => setMode("ai"));
  meongseokElements.modePvpButton.addEventListener("click", () => setMode("pvp"));
  meongseokElements.difficultyEasyButton.addEventListener("click", () => setDifficulty("easy"));
  meongseokElements.difficultyNormalButton.addEventListener("click", () => setDifficulty("normal"));
  meongseokElements.difficultyHardButton.addEventListener("click", () => setDifficulty("hard"));
  meongseokElements.startMatchButton.addEventListener("click", startMatch);
  meongseokElements.resolveRoundButton.addEventListener("click", resolveRound);
  meongseokElements.resetLogButton.addEventListener("click", () => {
    meongseokState.log = [];
    renderLog();
  });
  meongseokElements.closeResultModalButton.addEventListener("click", closeResultModal);
  meongseokElements.restartMatchButton.addEventListener("click", startMatch);
  meongseokElements.resultModalBackdrop.addEventListener("click", (event) => {
    if (event.target === meongseokElements.resultModalBackdrop) {
      closeResultModal();
    }
  });

  renderGame();
}


