const meongseokElements = {
  root: document.querySelector(".meongseok-game"),
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
  skillTooltip: document.getElementById("skillTooltip"),
  resultModalBackdrop: document.getElementById("resultModalBackdrop"),
  resultModalText: document.getElementById("resultModalText"),
  closeResultModalButton: document.getElementById("closeResultModalButton"),
  restartMatchButton: document.getElementById("restartMatchButton"),
  teamDraftStatus: document.getElementById("teamDraftStatus"),
  teamDraftBadges: document.getElementById("teamDraftBadges")
};

const DRAFT_TEAM_ENDPOINT = "/api/pokedex/team-builder/draft";
const TYPE_LABEL = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리"
};

const TYPE_ADVANTAGE = {
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  grass: ["water", "ground", "rock"],
  electric: ["water", "flying"],
  fighting: ["normal", "rock", "steel", "dark", "ice"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  psychic: ["fighting", "poison"],
  ice: ["grass", "ground", "flying", "dragon"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["ghost", "psychic"],
  dragon: ["dragon"],
  dark: ["ghost", "psychic"],
  fairy: ["fighting", "dragon", "dark"],
  flying: ["grass", "fighting", "bug"],
  poison: ["grass", "fairy"],
  bug: ["grass", "psychic", "dark"],
  steel: ["ice", "rock", "fairy"]
};

const AI_POOL = [
  { id: 6, name: "리자몽", type: "fire", hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", ability: { name: "맹화", description: "체력이 낮을 때 화력이 오른다.", isHidden: false } },
  { id: 9, name: "거북왕", type: "water", hp: 79, attack: 83, defense: 100, specialAttack: 85, specialDefense: 105, speed: 78, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", ability: { name: "급류", description: "체력이 낮을 때 물 기술이 강해진다.", isHidden: false } },
  { id: 3, name: "이상해꽃", type: "grass", hp: 80, attack: 82, defense: 83, specialAttack: 100, specialDefense: 100, speed: 80, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png", ability: { name: "심록", description: "체력이 낮을 때 풀 기술이 강해진다.", isHidden: false } },
  { id: 25, name: "피카츄", type: "electric", hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", ability: { name: "정전기", description: "빠르게 전기를 모아 반격한다.", isHidden: false } },
  { id: 150, name: "뮤츠", type: "psychic", hp: 106, attack: 110, defense: 90, specialAttack: 154, specialDefense: 90, speed: 130, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", ability: { name: "프레셔", description: "압도적인 정신력으로 상대를 몰아붙인다.", isHidden: false } },
  { id: 149, name: "망나뇽", type: "dragon", hp: 91, attack: 134, defense: 95, specialAttack: 100, specialDefense: 100, speed: 80, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png", ability: { name: "정신력", description: "흔들리지 않는 집중력으로 버틴다.", isHidden: false } },
  { id: 94, name: "팬텀", type: "ghost", hp: 60, attack: 65, defense: 60, specialAttack: 130, specialDefense: 75, speed: 110, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", ability: { name: "저주받은바디", description: "기묘한 기운으로 상대를 방해한다.", isHidden: false } },
  { id: 448, name: "루카리오", type: "fighting", hp: 70, attack: 110, defense: 70, specialAttack: 115, specialDefense: 70, speed: 90, imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png", ability: { name: "불굴의마음", description: "배틀이 길어질수록 기세가 오른다.", isHidden: false } }
];

const INITIAL_STATE = {
  difficulty: "easy",
  round: 0,
  maxRounds: 6,
  started: false,
  gameOver: false,
  players: [
    { id: 0, name: "내 팀", hand: [], score: 0, selectedCardId: null },
    { id: 1, name: "AI 팀", hand: [], score: 0, selectedCardId: null }
  ],
  battleCards: [null, null],
  lastWinner: null,
  log: [],
  resultText: "내 팀에서 카드를 고르면 라운드가 시작됩니다.",
  draftTeam: []
};

let meongseokState = cloneInitialState();

function cloneInitialState() {
  return {
    difficulty: INITIAL_STATE.difficulty,
    round: 0,
    maxRounds: INITIAL_STATE.maxRounds,
    started: false,
    gameOver: false,
    players: INITIAL_STATE.players.map((player) => ({ ...player, hand: [] })),
    battleCards: [null, null],
    lastWinner: null,
    log: [],
    resultText: INITIAL_STATE.resultText,
    draftTeam: []
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

function getStatTotal(card) {
  return (card.hp || 0) + (card.attack || 0) + (card.defense || 0) + (card.specialAttack || 0) + (card.specialDefense || 0) + (card.speed || 0);
}

function getAbilityEffect(ability) {
  const name = (ability?.name || "").toLowerCase();
  if (ability?.isHidden) {
    return {
      key: "hidden-power",
      label: ability.name,
      text: "숨겨진 특성 보너스로 스킬 수치 +16"
    };
  }
  const effects = [
    { key: "steady", text: "공격 보정 +8" },
    { key: "swift", text: "속도 우위 시 추가 피해 +10" },
    { key: "guard", text: "받는 첫 피해 -10" },
    { key: "heal", text: "라운드 종료 후 체력 +10" },
    { key: "burst", text: "첫 공격 추가 피해 +12" },
    { key: "focus", text: "스킬 수치가 높을수록 추가 피해 증가" }
  ];
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % effects.length;
  }
  return {
    key: effects[hash].key,
    label: ability?.name || "기본 특성",
    text: effects[hash].text
  };
}

function normalizeDraftCard(member) {
  const stats = member.stats || {};
  const ability = member.ability || { name: "기본 특성", description: "선택된 특성이 없습니다.", isHidden: false };
  const abilityEffect = getAbilityEffect(ability);
  return {
    id: Number(member.id),
    name: member.displayName,
    type: member.types?.[0] || "normal",
    secondaryTypes: member.types || ["normal"],
    hp: stats.hp || 60,
    attack: Math.max(stats.attack || 50, stats.specialAttack || 50),
    defense: Math.max(stats.defense || 50, stats.specialDefense || 50),
    specialAttack: stats.specialAttack || 50,
    specialDefense: stats.specialDefense || 50,
    speed: stats.speed || 50,
    image: member.imageUrl,
    flavor: `${member.region || "포켓몬 세계"} 출신. ${ability.description || ""}`.trim(),
    ability,
    skillName: abilityEffect.label,
    skillText: abilityEffect.text,
    skillEffect: abilityEffect.key,
    used: false,
    currentHp: stats.hp || 60
  };
}

function normalizeAiCard(card) {
  const abilityEffect = getAbilityEffect(card.ability);
  return {
    id: Number(card.id),
    name: card.name,
    type: card.type,
    secondaryTypes: [card.type],
    hp: card.hp,
    attack: Math.max(card.attack, card.specialAttack),
    defense: Math.max(card.defense, card.specialDefense),
    specialAttack: card.specialAttack,
    specialDefense: card.specialDefense,
    speed: card.speed,
    image: card.imageUrl,
    flavor: card.ability.description,
    ability: card.ability,
    skillName: abilityEffect.label,
    skillText: abilityEffect.text,
    skillEffect: abilityEffect.key,
    used: false,
    currentHp: card.hp
  };
}

async function fetchDraftTeam() {
  const response = await fetch(DRAFT_TEAM_ENDPOINT);
  if (!response.ok) {
    throw new Error("draft-team-fetch-failed");
  }
  const data = await response.json();
  return Array.isArray(data.team) ? data.team : [];
}

function getAvailableCards(playerIndex) {
  return meongseokState.players[playerIndex].hand.filter((card) => !card.used);
}

function findCardById(playerIndex, cardId) {
  return meongseokState.players[playerIndex].hand.find((card) => card.id === cardId && !card.used) || null;
}

function chooseAiCardId() {
  const availableCards = getAvailableCards(1);
  const opponentCard = findCardById(0, meongseokState.players[0].selectedCardId);
  if (!availableCards.length) {
    return null;
  }

  if (meongseokState.difficulty === "easy") {
    return availableCards[Math.floor(Math.random() * availableCards.length)].id;
  }

  const ranked = availableCards
    .map((card) => {
      const typeBonus = opponentCard ? (TYPE_ADVANTAGE[card.type]?.includes(opponentCard.type) ? 12 : 0) : 0;
      return {
        card,
        score: card.attack * 1.2 + card.speed + card.specialAttack * 0.4 + card.currentHp * 0.3 + typeBonus
      };
    })
    .sort((left, right) => right.score - left.score);

  if (meongseokState.difficulty === "normal") {
    return ranked[Math.floor(Math.random() * Math.min(2, ranked.length))].card.id;
  }

  return ranked[0].card.id;
}

function addLog(message) {
  meongseokState.log.unshift(message);
}

function applySkillBonus(attacker, defender, isFirstAttack) {
  const logs = [];
  let bonus = 0;
  switch (attacker.skillEffect) {
    case "hidden-power":
      bonus += 16;
      logs.push(`${attacker.name}의 숨겨진 특성이 발동해 스킬 보너스 +16`);
      break;
    case "steady":
      bonus += 8;
      logs.push(`${attacker.name}의 ${attacker.skillName} 효과로 공격 보정 +8`);
      break;
    case "swift":
      if (attacker.speed > defender.speed) {
        bonus += 10;
        logs.push(`${attacker.name}의 ${attacker.skillName} 효과로 추가 피해 +10`);
      }
      break;
    case "guard":
      break;
    case "heal":
      break;
    case "burst":
      if (isFirstAttack) {
        bonus += 12;
        logs.push(`${attacker.name}의 ${attacker.skillName} 효과로 첫 공격 피해 +12`);
      }
      break;
    case "focus": {
      const extra = Math.max(0, Math.floor((attacker.specialAttack - defender.specialDefense) / 4));
      bonus += extra;
      logs.push(`${attacker.name}의 ${attacker.skillName} 효과로 추가 피해 +${extra}`);
      break;
    }
    default:
      break;
  }
  return { bonus, logs };
}

function applyDefenseBonus(defender, damage, logs) {
  if (defender.skillEffect === "guard" && !defender.guardUsed) {
    defender.guardUsed = true;
    logs.push(`${defender.name}의 ${defender.skillName} 효과로 받은 피해 -10`);
    return Math.max(0, damage - 10);
  }
  return damage;
}

function resolveAttack(attacker, defender, isFirstAttack) {
  const logs = [];
  const baseDamage = Math.max(14, Math.floor(attacker.attack * 0.45 + attacker.specialAttack * 0.2));
  const typeBonus = TYPE_ADVANTAGE[attacker.type]?.includes(defender.type) ? 12 : 0;
  const skillBonus = applySkillBonus(attacker, defender, isFirstAttack);
  let damage = baseDamage + typeBonus + skillBonus.bonus;
  logs.push(...skillBonus.logs);
  if (typeBonus > 0) {
    logs.push(`${attacker.name}이(가) 타입 상성 보너스 +${typeBonus}를 얻었습니다.`);
  }
  damage = applyDefenseBonus(defender, damage, logs);
  defender.currentHp = Math.max(0, defender.currentHp - damage);
  logs.push(`${attacker.name}이(가) ${defender.name}에게 ${damage}의 피해를 입혔습니다.`);
  return logs;
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

  const details = [];
  const leftFirst = leftCard.speed >= rightCard.speed;
  const order = leftFirst ? [[leftCard, rightCard], [rightCard, leftCard]] : [[rightCard, leftCard], [leftCard, rightCard]];
  details.push(leftFirst ? `${leftCard.name}이(가) 먼저 공격합니다.` : `${rightCard.name}이(가) 먼저 공격합니다.`);

  for (let index = 0; index < order.length; index += 1) {
    const [attacker, defender] = order[index];
    if (attacker.currentHp <= 0 || defender.currentHp <= 0) {
      continue;
    }
    details.push(...resolveAttack(attacker, defender, index === 0));
    if (defender.currentHp <= 0) {
      details.push(`${defender.name}이(가) 쓰러졌습니다.`);
      break;
    }
  }

  if (leftCard.currentHp > 0 && leftCard.skillEffect === "heal") {
    leftCard.currentHp = Math.min(leftCard.hp, leftCard.currentHp + 10);
    details.push(`${leftCard.name}이(가) 턴 종료 후 체력을 10 회복했습니다.`);
  }
  if (rightCard.currentHp > 0 && rightCard.skillEffect === "heal") {
    rightCard.currentHp = Math.min(rightCard.hp, rightCard.currentHp + 10);
    details.push(`${rightCard.name}이(가) 턴 종료 후 체력을 10 회복했습니다.`);
  }

  leftCard.used = true;
  rightCard.used = true;
  meongseokState.round += 1;
  meongseokState.battleCards = [leftCard, rightCard];
  meongseokState.players[0].selectedCardId = null;
  meongseokState.players[1].selectedCardId = null;

  if (leftCard.currentHp > rightCard.currentHp) {
    meongseokState.players[0].score += 1;
    meongseokState.lastWinner = 0;
  } else if (rightCard.currentHp > leftCard.currentHp) {
    meongseokState.players[1].score += 1;
    meongseokState.lastWinner = 1;
  } else {
    meongseokState.lastWinner = null;
  }

  const summary = meongseokState.lastWinner === 0
    ? `라운드 ${meongseokState.round}: 내 팀 승리`
    : meongseokState.lastWinner === 1
      ? `라운드 ${meongseokState.round}: AI 승리`
      : `라운드 ${meongseokState.round}: 무승부`;

  meongseokState.resultText = `${summary} / ${details.join(" / ")}`;
  addLog(meongseokState.resultText);

  if (meongseokState.round >= meongseokState.maxRounds) {
    meongseokState.gameOver = true;
    openResultModal(buildWinnerMessage());
  } else {
    meongseokState.players[1].selectedCardId = chooseAiCardId();
  }

  renderGame();
}

function canResolveRound() {
  return Boolean(
    meongseokState.started &&
    !meongseokState.gameOver &&
    meongseokState.players[0].selectedCardId &&
    meongseokState.players[1].selectedCardId
  );
}

function buildWinnerMessage() {
  const leftScore = meongseokState.players[0].score;
  const rightScore = meongseokState.players[1].score;
  if (leftScore > rightScore) {
    return `내 팀이 ${leftScore}:${rightScore}로 승리했습니다.`;
  }
  if (rightScore > leftScore) {
    return `AI 팀이 ${rightScore}:${leftScore}로 승리했습니다.`;
  }
  return `최종 결과는 ${leftScore}:${rightScore} 무승부입니다.`;
}

function renderDraftSummary() {
  if (!meongseokElements.teamDraftStatus || !meongseokElements.teamDraftBadges) {
    return;
  }
  meongseokElements.teamDraftBadges.innerHTML = "";
  const count = meongseokState.draftTeam.length;
  if (!count) {
    meongseokElements.teamDraftStatus.textContent = "아직 팀 후보가 없습니다. 도감에서 포켓몬을 6마리 담아와 주세요.";
    return;
  }
  meongseokElements.teamDraftStatus.textContent = `현재 팀 후보 ${count}마리. 6마리가 모두 모이면 배틀 시작 버튼으로 바로 대결할 수 있습니다.`;
  const tags = [
    `${count}/6마리`,
    count === 6 ? "배틀 가능" : `${6 - count}마리 더 필요`
  ];
  for (const tag of tags) {
    const span = document.createElement("span");
    span.className = "meongseok-game__theme-badge";
    span.textContent = tag;
    meongseokElements.teamDraftBadges.appendChild(span);
  }
}

function renderLog() {
  meongseokElements.battleLog.innerHTML = "";
  if (!meongseokState.log.length) {
    meongseokElements.battleLog.innerHTML = '<li class="meongseok-game__log-item is-empty">배틀을 시작하면 라운드 기록이 여기에 표시됩니다.</li>';
    return;
  }
  for (const entry of meongseokState.log) {
    const item = document.createElement("li");
    item.className = "meongseok-game__log-item";
    item.textContent = entry;
    meongseokElements.battleLog.appendChild(item);
  }
}

function getRarity(card) {
  const total = getStatTotal(card);
  if (total >= 520) {
    return { label: "Epic", className: "is-epic" };
  }
  if (total >= 420) {
    return { label: "Rare", className: "is-rare" };
  }
  return { label: "Common", className: "" };
}

function createHealthMarkup(card) {
  const percent = Math.max(0, Math.round((card.currentHp / card.hp) * 100));
  return `
    <div class="meongseok-game__health-row">
      <div class="meongseok-game__health-bar">
        <div class="meongseok-game__health-fill" style="width: ${percent}%;"></div>
      </div>
      <span class="meongseok-game__health-text">HP ${card.currentHp} / ${card.hp}</span>
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
  target.addEventListener("focus", show);
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
  container.innerHTML = "";

  for (const card of player.hand) {
    const rarity = getRarity(card);
    const selected = player.selectedCardId === card.id;
    const disabled = card.used || playerIndex === 1;
    const cardElement = document.createElement("article");
    cardElement.className = `meongseok-game__card${selected ? " is-selected" : ""}${card.used ? " is-used" : ""}`;
    cardElement.innerHTML = `
      <div class="meongseok-game__card-top">
        <div>
          <span class="meongseok-game__card-badge meongseok-game__type-${card.type}">${TYPE_LABEL[card.type] || card.type}</span>
          <h4 class="meongseok-game__card-name">${card.name}</h4>
        </div>
        <div>
          <span class="meongseok-game__rarity-badge ${rarity.className}">${rarity.label}</span>
          <button class="meongseok-game__skill-badge" type="button">${card.skillName}</button>
        </div>
      </div>
      <div class="meongseok-game__card-body">
        <div class="meongseok-game__card-image-wrap">
          <img class="meongseok-game__card-image" src="${card.image}" alt="${card.name} 이미지">
        </div>
        <div>
          <p class="meongseok-game__card-description">${card.flavor}</p>
          <div class="meongseok-game__story-tags">
            <span class="meongseok-game__theme-badge">${card.skillText}</span>
            ${card.ability?.isHidden ? '<span class="meongseok-game__rarity-badge is-epic">숨겨진 특성</span>' : ""}
          </div>
          ${createHealthMarkup(card)}
          <div class="meongseok-game__stat-grid">
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">ATK</span><span class="meongseok-game__stat-value">${card.attack}</span></div>
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">DEF</span><span class="meongseok-game__stat-value">${card.defense}</span></div>
            <div class="meongseok-game__stat"><span class="meongseok-game__stat-label">SPD</span><span class="meongseok-game__stat-value">${card.speed}</span></div>
          </div>
        </div>
      </div>
      <button class="meongseok-game__card-button${selected ? " is-selected" : ""}" type="button" ${disabled ? "disabled" : ""}>
        ${card.used ? "사용 완료" : selected ? "선택됨" : "이 카드 선택"}
      </button>
    `;

    const skillButton = cardElement.querySelector(".meongseok-game__skill-badge");
    attachTooltipEvents(skillButton, `${card.skillName}: ${card.skillText}`);
    if (!disabled) {
      cardElement.querySelector(".meongseok-game__card-button").addEventListener("click", () => {
        player.selectedCardId = card.id;
        meongseokState.players[1].selectedCardId = chooseAiCardId();
        renderGame();
      });
    }
    container.appendChild(cardElement);
  }
}

function renderBattleCard(card, container, placeholder, isWinner) {
  container.classList.toggle("is-winning", Boolean(card) && isWinner);
  if (!card) {
    container.innerHTML = `<p class="meongseok-game__battle-placeholder">${placeholder}</p>`;
    return;
  }

  const rarity = getRarity(card);
  container.innerHTML = `
    <div class="meongseok-game__battle-card-content">
      <div class="meongseok-game__battle-image-wrap">
        <img class="meongseok-game__battle-image" src="${card.image}" alt="${card.name} 이미지">
      </div>
      <div>
        <div class="meongseok-game__battle-top">
          <span class="meongseok-game__battle-badge meongseok-game__type-${card.type}">${TYPE_LABEL[card.type] || card.type}</span>
          <div>
            <span class="meongseok-game__rarity-badge ${rarity.className}">${rarity.label}</span>
            <button class="meongseok-game__skill-badge" type="button">${card.skillName}</button>
          </div>
        </div>
        <h4 class="meongseok-game__battle-name">${card.name}</h4>
        <p class="meongseok-game__battle-meta">${card.skillText}</p>
        ${createHealthMarkup(card)}
        <p class="meongseok-game__battle-meta">ATK ${card.attack} / DEF ${card.defense} / SPD ${card.speed}</p>
      </div>
    </div>
  `;
  attachTooltipEvents(container.querySelector(".meongseok-game__skill-badge"), `${card.skillName}: ${card.skillText}`);
}

function updateScoreboard() {
  meongseokElements.leftPlayerScore.textContent = String(meongseokState.players[0].score);
  meongseokElements.rightPlayerScore.textContent = String(meongseokState.players[1].score);
  meongseokElements.leftPlayerDeckCount.textContent = `남은 카드 ${getAvailableCards(0).length}장`;
  meongseokElements.rightPlayerDeckCount.textContent = `남은 카드 ${getAvailableCards(1).length}장`;
  meongseokElements.roundIndicator.textContent = `${meongseokState.round} / ${meongseokState.maxRounds}`;
  meongseokElements.leftSelectionState.textContent = meongseokState.players[0].selectedCardId ? "선택 완료" : "카드를 선택해 주세요.";
  meongseokElements.rightSelectionState.textContent = meongseokState.players[1].selectedCardId ? "AI 선택 완료" : "AI가 카드를 고르는 중입니다.";
  meongseokElements.turnIndicator.textContent = meongseokState.started
    ? `${meongseokState.difficulty.toUpperCase()} 난이도의 AI와 대결 중입니다.`
    : "배틀 시작 버튼을 누르면 6라운드가 시작됩니다.";
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
  meongseokElements.difficultyEasyButton.classList.toggle("is-active", meongseokState.difficulty === "easy");
  meongseokElements.difficultyNormalButton.classList.toggle("is-active", meongseokState.difficulty === "normal");
  meongseokElements.difficultyHardButton.classList.toggle("is-active", meongseokState.difficulty === "hard");
  meongseokElements.resolveRoundButton.disabled = !canResolveRound();
  meongseokElements.matchStatus.textContent = meongseokState.gameOver
    ? buildWinnerMessage()
    : meongseokState.started
      ? "내 팀 카드 하나를 선택하면 AI 카드와 라운드가 진행됩니다."
      : "도감에서 6마리를 담아오면 내 팀으로 배틀을 시작할 수 있습니다.";
  meongseokElements.roundResult.textContent = meongseokState.resultText;
  renderDraftSummary();
  updateScoreboard();
  renderHand(0);
  renderHand(1);
  renderBattleCard(meongseokState.battleCards[0], meongseokElements.leftBattleCard, "내 팀 카드 대기 중", meongseokState.lastWinner === 0);
  renderBattleCard(meongseokState.battleCards[1], meongseokElements.rightBattleCard, "AI 카드 대기 중", meongseokState.lastWinner === 1);
  renderLog();
}

async function hydrateDraftTeam() {
  try {
    meongseokState.draftTeam = await fetchDraftTeam();
  } catch (error) {
    console.error(error);
    meongseokState.draftTeam = [];
  }
  renderGame();
}

function buildAiDeck(size) {
  return shuffle(AI_POOL).slice(0, size).map(normalizeAiCard);
}

async function startMatch() {
  await hydrateDraftTeam();
  if (meongseokState.draftTeam.length !== 6) {
    meongseokState.started = false;
    meongseokState.resultText = "도감에서 정확히 6마리를 팀 후보에 담아와야 배틀을 시작할 수 있습니다.";
    renderGame();
    return;
  }

  const leftDeck = meongseokState.draftTeam.map(normalizeDraftCard);
  const rightDeck = buildAiDeck(6);
  meongseokState.started = true;
  meongseokState.gameOver = false;
  meongseokState.round = 0;
  meongseokState.maxRounds = 6;
  meongseokState.log = [];
  meongseokState.players[0] = { id: 0, name: "내 팀", hand: leftDeck, score: 0, selectedCardId: null };
  meongseokState.players[1] = { id: 1, name: "AI 팀", hand: rightDeck, score: 0, selectedCardId: chooseAiCardId() };
  meongseokState.battleCards = [null, null];
  meongseokState.lastWinner = null;
  meongseokState.resultText = "배틀이 시작되었습니다. 내 팀 카드 하나를 선택하세요.";
  closeResultModal();
  renderGame();
}

if (meongseokElements.root) {
  meongseokElements.difficultyEasyButton.addEventListener("click", () => {
    meongseokState.difficulty = "easy";
    renderGame();
  });
  meongseokElements.difficultyNormalButton.addEventListener("click", () => {
    meongseokState.difficulty = "normal";
    renderGame();
  });
  meongseokElements.difficultyHardButton.addEventListener("click", () => {
    meongseokState.difficulty = "hard";
    renderGame();
  });
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
  hydrateDraftTeam();
}
