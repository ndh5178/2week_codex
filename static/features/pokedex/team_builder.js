const ARTWORK_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
const CSV_BASE = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv";
const CSV_URLS = {
  pokemon: `${CSV_BASE}/pokemon.csv`,
  species: `${CSV_BASE}/pokemon_species.csv`,
  speciesNames: `${CSV_BASE}/pokemon_species_names.csv`,
  stats: `${CSV_BASE}/pokemon_stats.csv`,
  types: `${CSV_BASE}/pokemon_types.csv`
};

const TYPE_NAME_KO = {
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

const TYPE_KEYS = Object.keys(TYPE_NAME_KO);
const STAT_KEY_BY_ID = {
  1: "hp",
  2: "attack",
  3: "defense",
  4: "specialAttack",
  5: "specialDefense",
  6: "speed"
};

const DEFENSE_CHART = {
  normal: { weakTo: ["fighting"], resists: [], immuneTo: ["ghost"] },
  fire: { weakTo: ["water", "ground", "rock"], resists: ["fire", "grass", "ice", "bug", "steel", "fairy"], immuneTo: [] },
  water: { weakTo: ["electric", "grass"], resists: ["fire", "water", "ice", "steel"], immuneTo: [] },
  electric: { weakTo: ["ground"], resists: ["electric", "flying", "steel"], immuneTo: [] },
  grass: { weakTo: ["fire", "ice", "poison", "flying", "bug"], resists: ["water", "electric", "grass", "ground"], immuneTo: [] },
  ice: { weakTo: ["fire", "fighting", "rock", "steel"], resists: ["ice"], immuneTo: [] },
  fighting: { weakTo: ["flying", "psychic", "fairy"], resists: ["bug", "rock", "dark"], immuneTo: [] },
  poison: { weakTo: ["ground", "psychic"], resists: ["grass", "fighting", "poison", "bug", "fairy"], immuneTo: [] },
  ground: { weakTo: ["water", "grass", "ice"], resists: ["poison", "rock"], immuneTo: ["electric"] },
  flying: { weakTo: ["electric", "ice", "rock"], resists: ["grass", "fighting", "bug"], immuneTo: ["ground"] },
  psychic: { weakTo: ["bug", "ghost", "dark"], resists: ["fighting", "psychic"], immuneTo: [] },
  bug: { weakTo: ["fire", "flying", "rock"], resists: ["grass", "fighting", "ground"], immuneTo: [] },
  rock: { weakTo: ["water", "grass", "fighting", "ground", "steel"], resists: ["normal", "fire", "poison", "flying"], immuneTo: [] },
  ghost: { weakTo: ["ghost", "dark"], resists: ["poison", "bug"], immuneTo: ["normal", "fighting"] },
  dragon: { weakTo: ["ice", "dragon", "fairy"], resists: ["fire", "water", "electric", "grass"], immuneTo: [] },
  dark: { weakTo: ["fighting", "bug", "fairy"], resists: ["ghost", "dark"], immuneTo: ["psychic"] },
  steel: { weakTo: ["fire", "fighting", "ground"], resists: ["normal", "grass", "ice", "flying", "psychic", "bug", "rock", "dragon", "steel", "fairy"], immuneTo: ["poison"] },
  fairy: { weakTo: ["poison", "steel"], resists: ["fighting", "bug", "dark"], immuneTo: ["dragon"] }
};

const CUTE_BONUS_IDS = new Set([25, 35, 36, 37, 39, 52, 54, 58, 133, 172, 173, 174, 175, 183, 300, 312, 427, 446, 447, 702, 759, 778, 868, 926]);
const COLOR_BONUS_IDS = new Set([6, 8, 10]);
const bootstrap = window.teamBuilderBootstrap || {};

const STYLE_CONFIGS = {
  offense: {
    label: "공격형 팀",
    summary: "높은 공격 지표와 스피드로 압박을 거는 방향으로 구성했습니다.",
    filter: (pokemon) => pokemon.total >= 470,
    baseScore: (pokemon) => Math.max(pokemon.stats.attack, pokemon.stats.specialAttack) * 1.35 + pokemon.stats.speed * 1.2 + pokemon.total * 0.32
  },
  cute: {
    label: "귀여운 팀",
    summary: "귀여운 인상과 실전성을 동시에 챙기는 포켓몬 위주로 골랐습니다.",
    filter: (pokemon) => !pokemon.isLegendary && !pokemon.isMythical,
    baseScore: (pokemon) => pokemon.cuteScore * 1.4 + pokemon.total * 0.18 + pokemon.bulkScore * 0.2
  },
  water: {
    label: "물 타입 중심 팀",
    summary: "물 타입 코어를 먼저 세우고 전기와 풀 약점을 막아 줄 보조 멤버를 섞었습니다.",
    filter: (pokemon) => pokemon.total >= 420,
    baseScore: (pokemon) => (pokemon.types.includes("water") ? 210 : 0) + pokemon.total * 0.25 + pokemon.bulkScore * 0.3
  },
  no_legend: {
    label: "전설 제외 팀",
    summary: "전설과 환상 포켓몬 없이도 화력과 안정성을 모두 갖추도록 조합했습니다.",
    filter: (pokemon) => !pokemon.isLegendary && !pokemon.isMythical,
    baseScore: (pokemon) => pokemon.total * 0.34 + pokemon.offenseScore * 0.45 + pokemon.bulkScore * 0.38
  },
  beginner: {
    label: "초보자 추천 팀",
    summary: "역할이 분명하고 교체 운용이 쉬운 포켓몬 위주로 배치했습니다.",
    filter: (pokemon) => !pokemon.isLegendary && !pokemon.isMythical && pokemon.total >= 430 && pokemon.total <= 590,
    baseScore: (pokemon) => pokemon.bulkScore * 0.55 + pokemon.offenseScore * 0.4 + pokemon.stats.speed * 0.25 + pokemon.stabilityScore
  }
};

const builderStatus = document.getElementById("builderStatus");
const teamTitle = document.getElementById("teamTitle");
const summaryBadges = document.getElementById("summaryBadges");
const insightList = document.getElementById("insightList");
const teamGrid = document.getElementById("teamGrid");
const styleGrid = document.getElementById("styleGrid");
const generateTeamButton = document.getElementById("generateTeamButton");
const teamCardTemplate = document.getElementById("teamCardTemplate");
const saveStatusPill = document.getElementById("saveStatusPill");
const saveCurrentTeamButton = document.getElementById("saveCurrentTeamButton");
const saveInlineStatus = document.getElementById("saveInlineStatus");
const savedTeamList = document.getElementById("savedTeamList");
const savedEmptyText = document.getElementById("savedEmptyText");
const savedTeamItemTemplate = document.getElementById("savedTeamItemTemplate");
const teamBoard = document.getElementById("teamBoard");
const teamNameInput = document.getElementById("teamNameInput");
const saveTeamButton = document.getElementById("saveTeamButton");
const teamBuilderConfig = window.teamBuilderConfig || { isLoggedIn: false, endpoints: {} };

const state = {
  selectedStyle: "offense",
  pokemonPool: [],
  isLoading: false,
  isSaving: false,
  hasLoaded: false,
  isLoggedIn: Boolean(bootstrap.isLoggedIn),
  saveEnabled: Boolean(bootstrap.saveEnabled),
  saveApi: bootstrap.saveApi || "/api/pokedex/team-builder/save",
  savedApi: bootstrap.savedApi || "/api/pokedex/team-builder/saved",
  currentTeam: [],
  currentSummary: null,
  savedTeams: []
};

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current);
      current = "";
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      continue;
    }

    current += char;
  }

  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((dataRow) => Object.fromEntries(headers.map((header, index) => [header, dataRow[index] ?? ""])));
}

function titleCaseName(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function getTypeMultiplier(defenderTypes, attackType) {
  return defenderTypes.reduce((multiplier, defenderType) => {
    const chart = DEFENSE_CHART[defenderType];
    if (!chart) {
      return multiplier;
    }
    if (chart.immuneTo.includes(attackType)) {
      return 0;
    }
    if (chart.weakTo.includes(attackType)) {
      return multiplier * 2;
    }
    if (chart.resists.includes(attackType)) {
      return multiplier * 0.5;
    }
    return multiplier;
  }, 1);
}

function getWeaknessProfile(types) {
  return TYPE_KEYS
    .map((type) => ({ type, multiplier: getTypeMultiplier(types, type) }))
    .filter((entry) => entry.multiplier > 1)
    .sort((left, right) => right.multiplier - left.multiplier);
}

function getResistanceProfile(types) {
  return TYPE_KEYS.filter((type) => getTypeMultiplier(types, type) < 1);
}

function fetchText(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`데이터를 가져오지 못했습니다: ${url}`);
    }
    return response.text();
  });
}

async function loadPokemonPool() {
  const [pokemonCsv, speciesCsv, namesCsv, statsCsv, typesCsv] = await Promise.all([
    fetchText(CSV_URLS.pokemon),
    fetchText(CSV_URLS.species),
    fetchText(CSV_URLS.speciesNames),
    fetchText(CSV_URLS.stats),
    fetchText(CSV_URLS.types)
  ]);

  const pokemonRows = parseCsv(pokemonCsv);
  const speciesRows = parseCsv(speciesCsv);
  const speciesNameRows = parseCsv(namesCsv);
  const statRows = parseCsv(statsCsv);
  const typeRows = parseCsv(typesCsv);

  const speciesMap = new Map(speciesRows.map((row) => [Number(row.id), row]));
  const koreanNameMap = new Map(
    speciesNameRows
      .filter((row) => row.local_language_id === "3")
      .map((row) => [Number(row.pokemon_species_id), row.name])
  );

  const statMap = new Map();
  for (const row of statRows) {
    const pokemonId = Number(row.pokemon_id);
    if (!statMap.has(pokemonId)) {
      statMap.set(pokemonId, {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0
      });
    }
    const statKey = STAT_KEY_BY_ID[Number(row.stat_id)];
    if (statKey) {
      statMap.get(pokemonId)[statKey] = Number(row.base_stat);
    }
  }

  const typeMap = new Map();
  for (const row of typeRows) {
    const pokemonId = Number(row.pokemon_id);
    if (!typeMap.has(pokemonId)) {
      typeMap.set(pokemonId, []);
    }
    typeMap.get(pokemonId).push({ slot: Number(row.slot), type: getTypeKeyFromId(Number(row.type_id)) });
  }

  return pokemonRows
    .filter((row) => row.is_default === "1")
    .map((row) => {
      const id = Number(row.id);
      const speciesId = Number(row.species_id);
      const species = speciesMap.get(speciesId);
      const stats = statMap.get(id);
      const types = (typeMap.get(id) || [])
        .sort((left, right) => left.slot - right.slot)
        .map((entry) => entry.type)
        .filter(Boolean);

      if (!species || !stats || types.length === 0 || speciesId > 1025) {
        return null;
      }

      const total = Object.values(stats).reduce((sum, value) => sum + value, 0);
      const offenseScore = Math.max(stats.attack, stats.specialAttack) + stats.speed;
      const bulkScore = stats.hp + stats.defense + stats.specialDefense;
      const cuteScore = Number(species.base_happiness || 0)
        + (species.is_baby === "1" ? 80 : 0)
        + (CUTE_BONUS_IDS.has(speciesId) ? 55 : 0)
        + (COLOR_BONUS_IDS.has(Number(species.color_id)) ? 22 : 0)
        + types.reduce((sum, type) => sum + (["fairy", "normal", "grass", "water", "psychic"].includes(type) ? 18 : 0), 0);
      const weaknessCount = getWeaknessProfile(types).length;
      const stabilityScore = Math.max(0, 90 - weaknessCount * 10) + (types.length === 1 ? 12 : 0);

      return {
        id,
        speciesId,
        slug: row.identifier,
        displayName: koreanNameMap.get(speciesId) || titleCaseName(row.identifier),
        imageUrl: `${ARTWORK_BASE}/${id}.png`,
        types,
        stats,
        total,
        offenseScore,
        bulkScore,
        cuteScore,
        stabilityScore,
        isLegendary: species.is_legendary === "1",
        isMythical: species.is_mythical === "1",
        weaknesses: getWeaknessProfile(types),
        resistances: getResistanceProfile(types)
      };
    })
    .filter(Boolean);
}

function getTypeKeyFromId(typeId) {
  const map = {
    1: "normal",
    2: "fighting",
    3: "flying",
    4: "poison",
    5: "ground",
    6: "rock",
    7: "bug",
    8: "ghost",
    9: "steel",
    10: "fire",
    11: "water",
    12: "grass",
    13: "electric",
    14: "psychic",
    15: "ice",
    16: "dragon",
    17: "dark",
    18: "fairy"
  };
  return map[typeId] || "";
}

function setStatus(message) {
  builderStatus.textContent = message;
}

function setSaveStatus(message, tone = "neutral") {
  if (saveStatusPill) {
    saveStatusPill.textContent = message;
    saveStatusPill.classList.remove("is-success", "is-warning", "is-error");
    if (tone === "success") {
      saveStatusPill.classList.add("is-success");
    }
    if (tone === "warning") {
      saveStatusPill.classList.add("is-warning");
    }
    if (tone === "error") {
      saveStatusPill.classList.add("is-error");
    }
  }
  if (saveInlineStatus) {
    saveInlineStatus.textContent = message;
  }
}

function setActiveStyle(styleKey) {
  state.selectedStyle = styleKey;
  for (const button of styleGrid.querySelectorAll(".style-card")) {
    button.classList.toggle("is-active", button.dataset.style === styleKey);
  }
}

function evaluateCandidate(candidate, team, styleKey) {
  const config = STYLE_CONFIGS[styleKey];
  const currentWeaknesses = getTeamWeaknessRanking(team);
  const coveredTypes = currentWeaknesses.filter((entry) => getTypeMultiplier(candidate.types, entry.type) < 1).map((entry) => entry.type);
  const existingTypes = new Set(team.flatMap((member) => member.types));
  const newTypeCount = candidate.types.filter((type) => !existingTypes.has(type)).length;
  const overlapPenalty = team.filter((member) => member.types.some((type) => candidate.types.includes(type))).length * 12;
  const immunityBonus = currentWeaknesses.filter((entry) => getTypeMultiplier(candidate.types, entry.type) === 0).length * 22;
  const coverageBonus = coveredTypes.length * 18 + immunityBonus;
  const speedBonus = candidate.stats.speed >= 100 ? 18 : 0;
  const bulkBonus = candidate.bulkScore >= 260 ? 14 : 0;
  const samePrimaryPenalty = team.some((member) => member.types[0] === candidate.types[0]) ? 16 : 0;

  let score = config.baseScore(candidate) + coverageBonus + newTypeCount * 20 + speedBonus + bulkBonus - overlapPenalty - samePrimaryPenalty;

  if (styleKey === "water") {
    const waterCount = team.filter((member) => member.types.includes("water")).length;
    if (waterCount < 3) {
      score += candidate.types.includes("water") ? 80 : -40;
    }
    if (["grass", "electric"].some((type) => getTypeMultiplier(candidate.types, type) < 1)) {
      score += 24;
    }
  }

  if (styleKey === "cute") {
    score += candidate.cuteScore * 0.5;
  }

  if (styleKey === "beginner") {
    score += candidate.stabilityScore;
    if (candidate.weaknesses.length >= 5) {
      score -= 18;
    }
  }

  return {
    score,
    rationale: describeCandidateFit(candidate, styleKey, coveredTypes)
  };
}

function pickRandomCandidate(scoredCandidates) {
  const ranked = [...scoredCandidates].sort((left, right) => right.score - left.score);
  const shortlist = ranked.slice(0, Math.min(6, ranked.length));
  const minimumScore = shortlist[shortlist.length - 1]?.score ?? 0;
  const weighted = shortlist.map((entry) => ({
    ...entry,
    weight: Math.max(1, Math.round(entry.score - minimumScore + 4))
  }));
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry;
    }
  }

  return weighted[0] || null;
}

function buildTeam(styleKey) {
  const config = STYLE_CONFIGS[styleKey];
  const pool = state.pokemonPool.filter(config.filter);
  const selected = [];
  const usedIds = new Set();

  while (selected.length < 6 && selected.length < pool.length) {
    const candidates = [];

    for (const candidate of pool) {
      if (usedIds.has(candidate.id)) {
        continue;
      }
      const result = evaluateCandidate(candidate, selected, styleKey);
      candidates.push({
        candidate,
        score: result.score + Math.random() * 8,
        rationale: result.rationale
      });
    }

    const picked = pickRandomCandidate(candidates);
    if (!picked) {
      break;
    }

    usedIds.add(picked.candidate.id);
    selected.push({ ...picked.candidate, rationale: picked.rationale });
  }

  return selected;
}

function getTeamWeaknessRanking(team) {
  const weaknessCount = new Map(TYPE_KEYS.map((type) => [type, 0]));
  for (const member of team) {
    for (const weakness of member.weaknesses) {
      weaknessCount.set(weakness.type, weaknessCount.get(weakness.type) + 1);
    }
  }
  return [...weaknessCount.entries()]
    .map(([type, count]) => ({ type, count }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 4);
}

function describeCandidateFit(candidate, styleKey, coveredTypes) {
  if (styleKey === "water" && !candidate.types.includes("water") && coveredTypes.length > 0) {
    return `물 타입 코어의 ${formatTypeList(coveredTypes)} 약점을 받아 주는 보조 축입니다.`;
  }
  if (coveredTypes.length > 0) {
    return `팀의 ${formatTypeList(coveredTypes)} 약점을 줄여 주는 타입 조합입니다.`;
  }
  if (candidate.stats.speed >= 110 && Math.max(candidate.stats.attack, candidate.stats.specialAttack) >= 105) {
    return "빠른 스피드로 선공 압박과 마무리 역할을 맡깁니다.";
  }
  if (candidate.bulkScore >= 270) {
    return "교체로 받아내기 좋은 안정적인 버팀목 역할입니다.";
  }
  if (styleKey === "cute") {
    return "귀여운 인상과 전투 성능을 동시에 챙긴 픽입니다.";
  }
  if (styleKey === "beginner") {
    return "운용이 직관적이라 초보자도 역할을 이해하기 쉬운 멤버입니다.";
  }
  return "타입 분산을 넓혀 팀 밸런스를 맞추는 카드입니다.";
}

function formatTypeList(typeKeys) {
  return [...new Set(typeKeys)].slice(0, 3).map((type) => TYPE_NAME_KO[type] || type).join("/");
}

function summarizeTeam(team, styleKey) {
  const config = STYLE_CONFIGS[styleKey];
  const averageSpeed = Math.round(team.reduce((sum, member) => sum + member.stats.speed, 0) / team.length);
  const averageTotal = Math.round(team.reduce((sum, member) => sum + member.total, 0) / team.length);
  const averageBulk = Math.round(team.reduce((sum, member) => sum + member.bulkScore, 0) / team.length);
  const weaknessRanking = getTeamWeaknessRanking(team);
  const coverageStory = getCoverageStory(team, styleKey, weaknessRanking);

  const points = [config.summary, coverageStory];
  if (averageSpeed >= 95) {
    points.push("속도가 빠른 포켓몬 비중을 높여 선공권을 잡기 쉽게 만들었습니다.");
  } else if (averageBulk >= 250) {
    points.push("교체 받아내기 쉬운 포켓몬을 섞어 운영 안정감을 높였습니다.");
  } else {
    points.push("공격과 수비 중 한쪽으로 치우치지 않도록 중간 지점을 맞췄습니다.");
  }

  if (styleKey === "no_legend") {
    points.push("전설과 환상 포켓몬 없이도 평균 종족값과 타입 밸런스를 충분히 챙겼습니다.");
  }

  return {
    title: `${config.label} 추천 결과`,
    badges: [
      config.label,
      `평균 종족값 ${averageTotal}`,
      averageSpeed >= 95 ? "고속 전개" : averageBulk >= 250 ? "안정 운영" : "밸런스 운영"
    ],
    insights: points,
    style: {
      key: styleKey,
      label: config.label
    }
  };
}

function getCoverageStory(team, styleKey, weaknessRanking) {
  if (styleKey === "water") {
    const supportMembers = team.filter((member) => !member.types.includes("water"));
    const supportType = supportMembers[0]?.types || [];
    return supportType.length
      ? `전기와 풀 압박을 줄이려고 ${formatTypeList(supportType)} 타입 지원 멤버를 함께 넣었습니다.`
      : "물 타입끼리만 겹치지 않게 보조 타입을 분산했습니다.";
  }

  const topWeakness = weaknessRanking[0]?.type;
  if (!topWeakness) {
    return "약점이 한쪽으로 몰리지 않게 타입을 넓게 분산했습니다.";
  }

  const coverMembers = team.filter((member) => getTypeMultiplier(member.types, topWeakness) < 1).slice(0, 2);
  if (coverMembers.length > 0) {
    return `${TYPE_NAME_KO[topWeakness]} 약점을 보완하려고 ${formatTypeList(coverMembers.flatMap((member) => member.types))} 타입을 함께 넣었습니다.`;
  }

  return "같은 약점이 여러 번 겹치지 않도록 타입 조합을 흩어 배치했습니다.";
}

function normalizeTeamMember(member) {
  return {
    id: member.id,
    speciesId: member.speciesId || member.id,
    displayName: member.displayName || member.name || "포켓몬",
    imageUrl: member.imageUrl || `${ARTWORK_BASE}/${member.id}.png`,
    types: member.types || [],
    rationale: member.rationale || "저장된 추천 팀 멤버입니다.",
    stats: {
      hp: member.stats?.hp || 0,
      attack: member.stats?.attack || 0,
      specialAttack: member.stats?.specialAttack || 0,
      speed: member.stats?.speed || 0
    },
    total: member.total || 0
  };
}

function renderTeam(team, summary) {
  const normalizedTeam = team.map(normalizeTeamMember);
  state.currentTeam = normalizedTeam;
  state.currentSummary = summary;
  teamTitle.textContent = summary.title;
  summaryBadges.innerHTML = "";
  for (const badge of summary.badges) {
    const span = document.createElement("span");
    span.className = "summary-badge";
    span.textContent = badge;
    summaryBadges.appendChild(span);
  }

  insightList.innerHTML = "";
  for (const message of summary.insights) {
    const item = document.createElement("li");
    item.textContent = message;
    insightList.appendChild(item);
  }

  teamGrid.innerHTML = "";
  normalizedTeam.forEach((pokemon, index) => {
    const fragment = teamCardTemplate.content.cloneNode(true);
    fragment.querySelector(".team-number").textContent = `#${String(index + 1).padStart(2, "0")}`;
    const typeList = fragment.querySelector(".team-type-list");
    for (const type of pokemon.types) {
      const chip = document.createElement("span");
      chip.className = `type-chip type-${type}`;
      chip.textContent = TYPE_NAME_KO[type] || type;
      typeList.appendChild(chip);
    }

    const image = fragment.querySelector(".team-image");
    image.src = pokemon.imageUrl;
    image.alt = `${pokemon.displayName} 이미지`;
    fragment.querySelector(".team-name").textContent = pokemon.displayName;
    fragment.querySelector(".team-role").textContent = pokemon.rationale || "도감에서 직접 담은 포켓몬입니다.";

    const statBars = fragment.querySelector(".stat-bars");
    const displayedStats = [
      ["HP", pokemon.stats?.hp ?? 0],
      ["ATK", pokemon.stats?.attack ?? 0],
      ["SPA", pokemon.stats?.specialAttack ?? 0],
      ["SPD", pokemon.stats?.speed ?? 0]
    ];
    for (const [label, value] of displayedStats) {
      const row = document.createElement("div");
      row.className = "stat-row";
      row.innerHTML = `
        <span class="stat-caption">${label}</span>
        <div class="stat-track"><div class="stat-fill" style="width: ${Math.min(100, Math.round((value / 180) * 100))}%"></div></div>
        <span class="stat-value">${value}</span>
      `;
      statBars.appendChild(row);
    }

    teamGrid.appendChild(fragment);
  });
}

function renderSavedTeams(items) {
  if (!savedTeamList || !savedEmptyText || !savedTeamItemTemplate) {
    return;
  }

  state.savedTeams = items;
  savedTeamList.innerHTML = "";
  savedEmptyText.style.display = items.length ? "none" : "block";

  for (const item of items) {
    const fragment = savedTeamItemTemplate.content.cloneNode(true);
    fragment.querySelector(".saved-team-title").textContent = item.summary?.title || "저장된 추천 팀";
    fragment.querySelector(".saved-team-meta").textContent = formatSavedMeta(item);
    fragment.querySelector(".saved-team-style").textContent = item.style?.label || "추천 팀";

    const members = fragment.querySelector(".saved-team-members");
    for (const member of item.team || []) {
      const chip = document.createElement("span");
      chip.className = "saved-member-chip";
      chip.textContent = member.name || member.displayName || "포켓몬";
      members.appendChild(chip);
    }

    const button = fragment.querySelector(".saved-team-button");
    button.addEventListener("click", () => {
      restoreSavedTeam(item);
    });

    savedTeamList.appendChild(fragment);
  }
}

function formatSavedMeta(item) {
  const dateText = item.createdAt
    ? new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(item.createdAt))
    : "방금 저장";
  const badgeText = (item.summary?.badges || []).slice(0, 2).join(" · ");
  return badgeText ? `${dateText} · ${badgeText}` : dateText;
}

function restoreSavedTeam(item) {
  const summary = {
    title: item.summary?.title || `${item.style?.label || "추천 팀"} 다시 보기`,
    badges: item.summary?.badges || [item.style?.label || "추천 팀"],
    insights: item.summary?.insights || ["저장된 추천 팀을 다시 불러왔습니다."],
    style: item.style || { key: "saved", label: item.style?.label || "저장 팀" }
  };
  const team = (item.team || []).map(normalizeTeamMember);
  renderTeam(team, summary);
  setStatus(`${item.style?.label || '저장된 추천 팀'}을 다시 불러왔습니다.`);
  setSaveStatus("저장된 추천 팀을 현재 결과 영역에 불러왔습니다.", "success");
  teamBoard?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadSavedTeams() {
  if (!state.isLoggedIn || !state.saveEnabled) {
    return;
  }

  try {
    const response = await fetch(state.savedApi, {
      headers: { "Accept": "application/json" }
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setSaveStatus(payload.message || "저장된 팀을 읽지 못했습니다.", "warning");
      return;
    }
    renderSavedTeams(payload.items || []);
  } catch (error) {
    console.error(error);
    setSaveStatus("저장된 팀을 읽어오는 중 문제가 생겼습니다.", "warning");
  }
}

async function saveRecommendedTeam() {
  if (!state.currentSummary || state.currentTeam.length !== 6) {
    setSaveStatus("먼저 추천 팀을 만든 뒤 저장해 주세요.", "warning");
    return;
  }
  if (!state.isLoggedIn) {
    setSaveStatus("로그인 후 현재 팀 저장 기능을 사용할 수 있습니다.", "warning");
    return;
  }
  if (!state.saveEnabled) {
    setSaveStatus("MongoDB 설정이 없어 현재 팀 저장을 진행할 수 없습니다.", "warning");
    return;
  }
  if (state.isSaving) {
    return;
  }

  state.isSaving = true;
  setSaveStatus("현재 팀을 DB에 저장하는 중입니다...", "warning");

  try {
    const response = await fetch(state.saveApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        style: state.currentSummary.style,
        summary: {
          title: state.currentSummary.title,
          badges: state.currentSummary.badges,
          insights: state.currentSummary.insights
        },
        team: state.currentTeam.map((member) => ({
          id: member.id,
          speciesId: member.speciesId,
          displayName: member.displayName,
          types: member.types,
          imageUrl: member.imageUrl,
          rationale: member.rationale,
          stats: member.stats,
          total: member.total
        }))
      })
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      setSaveStatus(payload.message || "현재 팀 저장에 실패했습니다.", "error");
      return;
    }

    const nextItems = [payload.item, ...state.savedTeams.filter((item) => item.id !== payload.item.id)].slice(0, 8);
    renderSavedTeams(nextItems);
    setSaveStatus(payload.message || "현재 팀을 저장했습니다.", "success");
  } catch (error) {
    console.error(error);
    setSaveStatus("현재 팀 저장 중 네트워크 오류가 발생했습니다.", "error");
  } finally {
    state.isSaving = false;
  }
}

async function saveManagedTeam() {
  if (!teamBuilderConfig.isLoggedIn || !saveTeamButton) {
    return;
  }
  if (!state.currentSummary || state.currentTeam.length !== 6) {
    setStatus("먼저 추천 팀을 만든 뒤 저장해 주세요.");
    return;
  }

  const teamName = teamNameInput?.value.trim() || `${STYLE_CONFIGS[state.selectedStyle].label} 추천 팀`;
  saveTeamButton.disabled = true;

  try {
    const response = await fetch(teamBuilderConfig.endpoints.create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_name: teamName,
        style: state.selectedStyle,
        members: state.currentTeam.map((member) => ({
          id: member.id,
          speciesId: member.speciesId || member.id,
          displayName: member.displayName,
          imageUrl: member.imageUrl,
          types: member.types,
          rationale: member.rationale,
          ability: member.ability || null,
          stats: member.stats || null,
          region: member.region || "",
          name: member.name || ""
        })),
        summary: {
          title: state.currentSummary.title,
          badges: state.currentSummary.badges,
          insights: state.currentSummary.insights
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "save-failed");
    }

    if (teamNameInput) {
      teamNameInput.value = teamName;
    }
    setStatus(`'${teamName}' 팀을 저장했습니다.`);
  } catch (error) {
    console.error(error);
    setStatus("팀 저장에 실패했습니다. 로그인 상태와 입력값을 확인해 주세요.");
  } finally {
    saveTeamButton.disabled = false;
  }
}

async function ensureDataLoaded() {
  if (state.hasLoaded || state.isLoading) {
    return;
  }
  state.isLoading = true;
  setStatus("PokeAPI 기준 데이터를 불러오는 중입니다...");
  try {
    state.pokemonPool = await loadPokemonPool();
    state.hasLoaded = true;
    setStatus(`기본 포켓몬 ${state.pokemonPool.length}마리 데이터를 준비했습니다.`);
  } catch (error) {
    console.error(error);
    setStatus("팀 빌더 데이터를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.");
    throw error;
  } finally {
    state.isLoading = false;
  }
}

async function generateTeam() {
  try {
    await ensureDataLoaded();
    const team = buildTeam(state.selectedStyle);
    if (team.length < 6) {
      setStatus("조건에 맞는 포켓몬이 부족해서 6마리를 모두 채우지 못했습니다.");
      setSaveStatus("6마리 조합이 완성되지 않아 저장할 수 없습니다.", "warning");
      return;
    }
    const summary = summarizeTeam(team, state.selectedStyle);
    renderTeam(team, summary);
    setStatus(`${STYLE_CONFIGS[state.selectedStyle].label} 기준으로 랜덤 추천 팀 6마리를 조합했습니다.`);
    if (state.isLoggedIn) {
      setSaveStatus("현재 팀 저장 버튼을 누르면 이 추천 결과를 저장할 수 있습니다.", "success");
    } else {
      setSaveStatus("로그인 후 현재 팀 저장 기능을 사용할 수 있습니다.", "warning");
    }
  } catch (error) {
    console.error(error);
    setSaveStatus("팀 빌더 실행 중 오류가 발생했습니다.", "error");
  }
}

styleGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".style-card");
  if (!button) {
    return;
  }
  setActiveStyle(button.dataset.style);
  generateTeam();
});

generateTeamButton.addEventListener("click", () => {
  generateTeam();
});

if (saveCurrentTeamButton) {
  saveCurrentTeamButton.addEventListener("click", () => {
    saveRecommendedTeam();
  });
}

if (saveTeamButton) {
  saveTeamButton.addEventListener("click", () => {
    saveManagedTeam();
  });
}

setActiveStyle(state.selectedStyle);
if (state.isLoggedIn && state.saveEnabled) {
  setSaveStatus("현재 팀 저장 버튼으로 원하는 추천 결과를 저장할 수 있습니다.", "success");
} else if (state.isLoggedIn) {
  setSaveStatus("로그인되어 있지만 MongoDB 설정이 없어 현재 팀 저장은 비활성화 상태입니다.", "warning");
} else {
  setSaveStatus("로그인 후 현재 팀 저장 기능을 사용할 수 있습니다.", "warning");
}
loadSavedTeams();
generateTeam();

