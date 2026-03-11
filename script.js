const API_BASE = "https://pokeapi.co/api/v2";
const ARTWORK_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";
const HOME_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";
const FALLBACK_IMAGE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const SHINY_FALLBACK_IMAGE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny";
const SPECIES_NAMES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv";
const SPECIES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species.csv";
const POKEMON_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv";
const POKEMON_TYPES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_types.csv";
const POKEMON_FORMS_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_forms.csv";
const POKEMON_FORM_NAMES_CSV_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_form_names.csv";

const REGION_INFO = {
  1: { key: "kanto", label: "Kanto", nameKo: "관동 지방" },
  2: { key: "johto", label: "Johto", nameKo: "성도 지방" },
  3: { key: "hoenn", label: "Hoenn", nameKo: "호연 지방" },
  4: { key: "sinnoh", label: "Sinnoh", nameKo: "신오 지방" },
  5: { key: "unova", label: "Unova", nameKo: "하나 지방" },
  6: { key: "kalos", label: "Kalos", nameKo: "칼로스 지방" },
  7: { key: "alola", label: "Alola", nameKo: "알로라 지방" },
  8: { key: "galar", label: "Galar", nameKo: "가라르 지방" },
  9: { key: "paldea", label: "Paldea", nameKo: "팔데아 지방" }
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

const TYPE_ID_TO_KEY = {
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

const PREFIX_FORM_LABELS = {
  alola: "알로라",
  galar: "가라르",
  hisui: "히스이",
  paldea: "팔데아"
};

const FORM_LABEL_MAP = {
  alola: "알로라폼",
  galar: "가라르폼",
  hisui: "히스이폼",
  paldea: "팔데아폼",
  origin: "오리진폼",
  attack: "어택폼",
  defense: "디펜스폼",
  speed: "스피드폼",
  normal: "노말폼",
  plant: "플랜트폼",
  sandy: "샌디폼",
  trash: "트래쉬폼",
  heat: "히트폼",
  wash: "워시폼",
  frost: "프로스트폼",
  fan: "스핀폼",
  mow: "커트폼",
  sky: "스카이폼",
  land: "랜드폼",
  therian: "영물폼",
  incarnate: "화신폼",
  pirouette: "스텝폼",
  aria: "보이스폼",
  resolute: "각오폼",
  ordinary: "보통폼",
  school: "군집폼",
  solo: "단독폼",
  midnight: "미드나잇폼",
  midday: "미드데이폼",
  dusk: "황혼폼",
  red: "레드코어",
  blue: "블루코어",
  white: "화이트컬러",
  orange: "오렌지플라워",
  yellow: "옐로플라워",
  "blue-striped": "블루스트라이프",
  "white-striped": "화이트스트라이프",
  black: "블랙폼",
  white: "화이트폼",
  zen: "달마모드",
  standard: "스탠다드폼",
  eternal: "이터널폼",
  female: "암컷폼",
  male: "수컷폼",
  blade: "블레이드폼",
  shield: "실드폼",
  complete: "퍼펙트폼",
  completee: "퍼펙트폼",
  10: "10%폼",
  50: "50%폼",
  completee50: "퍼펙트폼",
  bailed: "폼",
  small: "소형폼",
  average: "보통폼",
  large: "대형폼",
  super: "특대형폼",
  "pom-pom": "퐁퐁스타일",
  pau: "훌라스타일",
  sensu: "부채스타일",
  disguished: "변장한모습",
  busted: "들킨모습",
  "ice-face": "아이스페이스",
  "noice-face": "노이스페이스",
  hangry: "배고픈모습",
  gulping: "꿀꺽폼",
  gorging: "포식폼",
  "low-key": "로우키폼",
  amped: "하이텐션폼",
  "single-strike": "일격의태세",
  "rapid-strike": "연격의태세",
  hero: "히어로폼",
  "family-of-three": "세식구폼",
  "family-of-four": "네식구폼",
  curly: "컬리폼",
  droopy: "드룹폼",
  stretch: "스트레치폼",
  "combat-breed": "컴뱃폼",
  "blaze-breed": "블레이즈폼",
  "aqua-breed": "아쿠아폼"
};

const dataStatus = document.getElementById("dataStatus");
const dailyPokemonCard = document.getElementById("dailyPokemonCard");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const regionFilter = document.getElementById("regionFilter");
const formFilter = document.getElementById("formFilter");
const normalDexButton = document.getElementById("normalDexButton");
const shinyDexButton = document.getElementById("shinyDexButton");
const visibleCount = document.getElementById("visibleCount");
const totalCount = document.getElementById("totalCount");
const regionSections = document.getElementById("regionSections");
const pokemonCardTemplate = document.getElementById("pokemonCardTemplate");
const regionSectionTemplate = document.getElementById("regionSectionTemplate");
const pokemonModalBackdrop = document.getElementById("pokemonModalBackdrop");
const modalBody = document.getElementById("modalBody");
const modalCloseButton = document.getElementById("modalCloseButton");

let allPokemon = [];
let basePokemon = [];
let cardEntries = [];
let koreanNameMap = new Map();
let regionMap = new Map();
let pokemonTypeMap = new Map();
let pokemonMetaMap = new Map();
let formMetaMap = new Map();
let formNameMap = new Map();
let abilityInfoCache = new Map();
let currentModalPokemonId = null;
let currentDexMode = "normal";

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

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
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

function getPokemonIdFromUrl(url) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function formatPokemonNumber(id) {
  return id > 9999 ? `Form.${id}` : `No.${String(id).padStart(4, "0")}`;
}

function titleCaseName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function getFormCategoryFromName(identifier) {
  if (identifier.includes("-gmax")) {
    return "gmax";
  }
  if (identifier.includes("-mega")) {
    return "mega";
  }
  return "forms";
}

function shouldExcludeSpecialForm(identifier) {
  const excludedPatterns = [
    /-cap$/,
    /-original-cap$/,
    /-hoenn-cap$/,
    /-sinnoh-cap$/,
    /-unova-cap$/,
    /-kalos-cap$/,
    /-alola-cap$/,
    /-partner-cap$/,
    /-world-cap$/,
    /-rock-star$/,
    /-belle$/,
    /-pop-star$/,
    /-phd$/,
    /-libre$/,
    /-cosplay$/,
    /-starter$/,
    /-partner$/,
    /-spiky-eared$/,
    /-battle-bond$/,
    /-ash$/,
    /-totem$/
  ];

  return excludedPatterns.some((pattern) => pattern.test(identifier));
}
function translateFormSlug(slug) {
  return slug
    .split("-")
    .map((part) => FORM_LABEL_MAP[part] || titleCaseName(part))
    .join(" ");
}

function getPrimaryImageUrl(id, mode) {
  return mode === "shiny" ? `${HOME_BASE}/shiny/${id}.png` : `${ARTWORK_BASE}/${id}.png`;
}

function getFallbackImageUrl(id, mode) {
  return mode === "shiny" ? `${SHINY_FALLBACK_IMAGE_BASE}/${id}.png` : `${FALLBACK_IMAGE_BASE}/${id}.png`;
}

function setPokemonImage(img, id, mode, altText) {
  img.src = getPrimaryImageUrl(id, mode);
  img.alt = altText;
  img.onerror = () => {
    img.onerror = null;
    img.src = getFallbackImageUrl(id, mode);
  };
}

function getDateKeyInSeoul() {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(new Date());
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getDailyIndex(length) {
  const dateKey = getDateKeyInSeoul();
  let hash = 0;

  for (const char of dateKey) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }

  return hash % length;
}

function getKoreanDateLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(new Date());
}

function getRegionInfo(generationId) {
  return REGION_INFO[generationId] || { key: "other", label: "Other", nameKo: "기타" };
}

function getRegionLabelForPokemon(pokemon) {
  return getRegionInfo(regionMap.get(pokemon.speciesId)).nameKo;
}

function getKoreanSpeciesDescription(species, fallbackText) {
  const koreanEntry = species.flavor_text_entries.find((entry) => entry.language.name === "ko");
  return (koreanEntry?.flavor_text || fallbackText).replace(/\f|\n|\r/g, " ");
}

function getKoreanGenus(species) {
  return species.genera.find((entry) => entry.language.name === "ko")?.genus || "포켓몬";
}

function getPokemonDisplayName(pokemon) {
  const baseName = koreanNameMap.get(pokemon.speciesId) || titleCaseName(pokemon.name);
  if (!pokemon.isForm) {
    return baseName;
  }

  if (pokemon.formCategory === "mega") {
    if (pokemon.name.endsWith("-mega-x")) {
      return `메가${baseName} X`;
    }
    if (pokemon.name.endsWith("-mega-y")) {
      return `메가${baseName} Y`;
    }
    return `메가${baseName}`;
  }

  if (pokemon.formCategory === "gmax") {
    return `거다이맥스 ${baseName}`;
  }

  const explicitFormName = formNameMap.get(pokemon.formId) || pokemon.formName;
  const regionalPrefix = PREFIX_FORM_LABELS[pokemon.formSlug];
  if (regionalPrefix) {
    return `${regionalPrefix} ${baseName}`;
  }

  if (explicitFormName) {
    return `${baseName} ${explicitFormName}`.trim();
  }

  return `${baseName} ${translateFormSlug(pokemon.formSlug || "form")}`.trim();
}

function hydratePokemonTypes(typeRows) {
  const groupedTypes = new Map();
  for (const row of typeRows) {
    const pokemonId = Number(row.pokemon_id);
    const typeKey = TYPE_ID_TO_KEY[Number(row.type_id)];
    if (!typeKey) {
      continue;
    }
    if (!groupedTypes.has(pokemonId)) {
      groupedTypes.set(pokemonId, []);
    }
    groupedTypes.get(pokemonId).push({ slot: Number(row.slot), type: typeKey });
  }

  pokemonTypeMap = new Map(
    [...groupedTypes.entries()].map(([pokemonId, types]) => [pokemonId, types.sort((a, b) => a.slot - b.slot).map((entry) => entry.type)])
  );
}

function hydratePokemonMeta(pokemonRows, formRows, formNameRows) {
  pokemonMetaMap = new Map(
    pokemonRows.map((row) => [Number(row.id), {
      id: Number(row.id),
      speciesId: Number(row.species_id),
      identifier: row.identifier,
      isDefault: row.is_default === "1"
    }])
  );

  formMetaMap = new Map(
    formRows.map((row) => [Number(row.pokemon_id), {
      formId: Number(row.id),
      formIdentifier: row.form_identifier,
      isDefault: row.is_default === "1",
      isBattleOnly: row.is_battle_only === "1",
      isMega: row.is_mega === "1"
    }])
  );

  formNameMap = new Map(
    formNameRows
      .filter((row) => row.local_language_id === "3")
      .map((row) => [Number(row.pokemon_form_id), row.form_name || row.pokemon_name || ""])
  );
}

function populateFilterOptions() {
  const typeKeys = [...new Set([...pokemonTypeMap.entries()].filter(([id]) => allPokemon.some((pokemon) => pokemon.id === id)).flatMap(([, value]) => value))];
  typeFilter.innerHTML = '<option value="">전체 타입</option>';
  for (const typeKey of typeKeys) {
    const option = document.createElement("option");
    option.value = typeKey;
    option.textContent = TYPE_NAME_KO[typeKey] || typeKey;
    typeFilter.appendChild(option);
  }

  regionFilter.innerHTML = '<option value="">전체 지역</option>';
  for (const regionInfo of Object.values(REGION_INFO)) {
    const option = document.createElement("option");
    option.value = regionInfo.key;
    option.textContent = regionInfo.nameKo;
    regionFilter.appendChild(option);
  }
}

async function loadReferenceData() {
  const [speciesNamesResponse, speciesResponse, pokemonResponse, typesResponse, formsResponse, formNamesResponse] = await Promise.all([
    fetch(SPECIES_NAMES_CSV_URL),
    fetch(SPECIES_CSV_URL),
    fetch(POKEMON_CSV_URL),
    fetch(POKEMON_TYPES_CSV_URL),
    fetch(POKEMON_FORMS_CSV_URL),
    fetch(POKEMON_FORM_NAMES_CSV_URL)
  ]);

  if (![speciesNamesResponse, speciesResponse, pokemonResponse, typesResponse, formsResponse, formNamesResponse].every((response) => response.ok)) {
    throw new Error("포켓몬 참고 데이터를 불러오지 못했습니다.");
  }

  const [speciesNamesCsv, speciesCsv, pokemonCsv, pokemonTypesCsv, pokemonFormsCsv, pokemonFormNamesCsv] = await Promise.all([
    speciesNamesResponse.text(),
    speciesResponse.text(),
    pokemonResponse.text(),
    typesResponse.text(),
    formsResponse.text(),
    formNamesResponse.text()
  ]);

  koreanNameMap = new Map(
    parseCsv(speciesNamesCsv)
      .filter((row) => row.local_language_id === "3")
      .map((row) => [Number(row.pokemon_species_id), row.name])
  );

  regionMap = new Map(parseCsv(speciesCsv).map((row) => [Number(row.id), Number(row.generation_id)]));
  hydratePokemonTypes(parseCsv(pokemonTypesCsv));
  hydratePokemonMeta(parseCsv(pokemonCsv), parseCsv(pokemonFormsCsv), parseCsv(pokemonFormNamesCsv));
}

function buildPokemonEntry(result) {
  const id = getPokemonIdFromUrl(result.url);
  const meta = pokemonMetaMap.get(id);
  if (!meta || meta.speciesId > 1025 || shouldExcludeSpecialForm(meta.identifier)) {
    return null;
  }

  const formMeta = formMetaMap.get(id);
  const formLabel = formMeta ? formNameMap.get(formMeta.formId) || "" : "";
  const isForm = Boolean(formMeta && (!meta.isDefault || formMeta.formIdentifier || formLabel));
  const formCategory = isForm ? getFormCategoryFromName(meta.identifier) : "base";

  return {
    id,
    name: result.name,
    speciesId: meta.speciesId,
    isDefault: meta.isDefault,
    isForm,
    formId: formMeta?.formId || null,
    formSlug: formMeta?.formIdentifier || "",
    formName: formLabel,
    formCategory,
    regionKey: getRegionInfo(regionMap.get(meta.speciesId)).key
  };
}

async function getAbilityInfo(abilityEntry) {
  if (abilityInfoCache.has(abilityEntry.ability.name)) {
    return {
      ...abilityInfoCache.get(abilityEntry.ability.name),
      isHidden: abilityEntry.is_hidden
    };
  }

  const response = await fetch(abilityEntry.ability.url);
  if (!response.ok) {
    const fallback = { name: titleCaseName(abilityEntry.ability.name), description: "한국어 특성 설명이 아직 없어요." };
    abilityInfoCache.set(abilityEntry.ability.name, fallback);
    return { ...fallback, isHidden: abilityEntry.is_hidden };
  }

  const data = await response.json();
  const koreanName = data.names.find((entry) => entry.language.name === "ko")?.name || titleCaseName(abilityEntry.ability.name);
  const effectEntry = data.effect_entries.find((entry) => entry.language.name === "ko");
  const shortEntry = data.flavor_text_entries?.find((entry) => entry.language.name === "ko");
  const description = (effectEntry?.short_effect || shortEntry?.flavor_text || "한국어 특성 설명이 아직 없어요.").replace(/\f|\n|\r/g, " ");
  const abilityInfo = { name: koreanName, description };
  abilityInfoCache.set(abilityEntry.ability.name, abilityInfo);
  return { ...abilityInfo, isHidden: abilityEntry.is_hidden };
}

function buildAbilityMarkup(abilityInfoList) {
  return abilityInfoList.map((abilityInfo) => `
    <article class="ability-item">
      <div class="ability-heading">
        <h3 class="ability-name">${abilityInfo.name}</h3>
        ${abilityInfo.isHidden ? '<span class="hidden-ability-badge">숨겨진 특성</span>' : ''}
      </div>
      <p class="ability-description">${abilityInfo.description}</p>
    </article>
  `).join("");
}

async function renderDailyPokemon(pokemon) {
  const [detailResponse, speciesResponse] = await Promise.all([
    fetch(`${API_BASE}/pokemon/${pokemon.id}`),
    fetch(`${API_BASE}/pokemon-species/${pokemon.speciesId}`)
  ]);

  if (!detailResponse.ok || !speciesResponse.ok) {
    throw new Error("오늘의 포켓몬 상세 정보를 가져오지 못했습니다.");
  }

  const [detail, species] = await Promise.all([detailResponse.json(), speciesResponse.json()]);
  const displayName = getPokemonDisplayName(pokemon);
  const description = getKoreanSpeciesDescription(species, "한국어 도감 설명이 아직 없어요.");
  const typeMarkup = detail.types.map((entry) => `<span class="type-chip type-${entry.type.name}">${TYPE_NAME_KO[entry.type.name] || entry.type.name}</span>`).join("");
  const modeLabel = currentDexMode === "shiny" ? "이로치 오늘의 포켓몬" : "오늘의 포켓몬";

  dailyPokemonCard.classList.remove("loading");
  dailyPokemonCard.innerHTML = `
    <div class="daily-image-wrap">
      <img id="dailyPokemonImage" alt="${displayName} 이미지">
    </div>
    <div class="daily-info">
      <div class="daily-title-row">
        <span class="daily-number">${formatPokemonNumber(pokemon.id)}</span>
        <h2 class="daily-name">${displayName}</h2>
      </div>
      <p class="daily-date">${getKoreanDateLabel()} 기준 ${modeLabel}</p>
      <div class="daily-tags">${typeMarkup}</div>
      <p class="daily-desc">${description}</p>
    </div>
  `;

  setPokemonImage(document.getElementById("dailyPokemonImage"), pokemon.id, currentDexMode, `${displayName} 이미지`);
}

function createPokemonCard(pokemon) {
  const fragment = pokemonCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".pokemon-card");
  const number = fragment.querySelector(".pokemon-number");
  const image = fragment.querySelector(".pokemon-image");
  const koreanName = fragment.querySelector(".pokemon-korean-name");
  const displayName = getPokemonDisplayName(pokemon);

  number.textContent = formatPokemonNumber(pokemon.id);
  koreanName.textContent = displayName;
  setPokemonImage(image, pokemon.id, currentDexMode, `${displayName} 이미지`);

  card.dataset.id = String(pokemon.id);
  card.dataset.name = pokemon.name.toLowerCase();
  card.dataset.koreanName = displayName.toLowerCase();
  card.dataset.number = String(pokemon.id);
  card.dataset.region = pokemon.regionKey;
  card.dataset.types = (pokemonTypeMap.get(pokemon.id) || []).join("|");
  card.dataset.form = pokemon.formCategory;

  card.addEventListener("click", () => openPokemonModal(pokemon.id));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPokemonModal(pokemon.id);
    }
  });

  return card;
}

function renderRegionSections(pokemonList) {
  const grouped = new Map();
  for (const pokemon of pokemonList) {
    if (!grouped.has(pokemon.regionKey)) {
      grouped.set(pokemon.regionKey, []);
    }
    grouped.get(pokemon.regionKey).push(pokemon);
  }

  const fragment = document.createDocumentFragment();
  const cards = [];

  for (const regionInfo of Object.values(REGION_INFO)) {
    const group = grouped.get(regionInfo.key);
    if (!group || group.length === 0) {
      continue;
    }

    const sectionFragment = regionSectionTemplate.content.cloneNode(true);
    sectionFragment.querySelector(".region-label").textContent = regionInfo.label;
    sectionFragment.querySelector(".region-name").textContent = regionInfo.nameKo;
    sectionFragment.querySelector(".region-count").textContent = `${group.length}마리`;
    const section = sectionFragment.querySelector(".region-section");
    const regionGrid = sectionFragment.querySelector(".region-grid");

    for (const pokemon of group) {
      const card = createPokemonCard(pokemon);
      cards.push(card);
      regionGrid.appendChild(card);
    }

    section.dataset.region = regionInfo.key;
    fragment.appendChild(section);
  }

  regionSections.innerHTML = "";
  regionSections.appendChild(fragment);
  cardEntries = cards;
  visibleCount.textContent = String(cards.length);
}

function filterPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedRegion = regionFilter.value;
  const selectedForm = formFilter.value;
  let matches = 0;

  for (const card of cardEntries) {
    const matchesText = !query || card.dataset.name.includes(query) || card.dataset.koreanName.includes(query) || card.dataset.number.includes(query);
    const matchesType = !selectedType || card.dataset.types.split("|").includes(selectedType);
    const matchesRegion = !selectedRegion || card.dataset.region === selectedRegion;
    const matchesForm = selectedForm === "all" || card.dataset.form === selectedForm;
    const isMatch = matchesText && matchesType && matchesRegion && matchesForm;
    card.classList.toggle("is-hidden", !isMatch);
    if (isMatch) {
      matches += 1;
    }
  }

  for (const section of regionSections.querySelectorAll(".region-section")) {
    const visibleCards = section.querySelectorAll(".pokemon-card:not(.is-hidden)").length;
    section.classList.toggle("is-hidden", visibleCards === 0);
    section.querySelector(".region-count").textContent = `${visibleCards}마리`;
  }

  visibleCount.textContent = String(matches);
}

async function openPokemonModal(pokemonId) {
  currentModalPokemonId = pokemonId;
  pokemonModalBackdrop.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";
  modalBody.innerHTML = `
    <div class="modal-loading">
      <div class="modal-image skeleton-box"></div>
      <div class="modal-content">
        <div class="daily-line skeleton-line"></div>
        <div class="daily-line short skeleton-line"></div>
        <div class="daily-desc skeleton-block"></div>
      </div>
    </div>
  `;

  const pokemon = allPokemon.find((entry) => entry.id === pokemonId);
  if (!pokemon) {
    return;
  }

  try {
    const [detailResponse, speciesResponse] = await Promise.all([
      fetch(`${API_BASE}/pokemon/${pokemon.id}`),
      fetch(`${API_BASE}/pokemon-species/${pokemon.speciesId}`)
    ]);

    if (!detailResponse.ok || !speciesResponse.ok) {
      throw new Error("상세 정보를 불러오지 못했습니다.");
    }

    const [detail, species] = await Promise.all([detailResponse.json(), speciesResponse.json()]);
    if (currentModalPokemonId !== pokemonId) {
      return;
    }

    const displayName = getPokemonDisplayName(pokemon);
    const description = getKoreanSpeciesDescription(species, "한국어 도감 설명이 아직 없어요.");
    const genus = getKoreanGenus(species);
    const regionName = getRegionLabelForPokemon(pokemon);
    const typeMarkup = detail.types.map((entry) => `<span class="type-chip type-${entry.type.name}">${TYPE_NAME_KO[entry.type.name] || entry.type.name}</span>`).join("");
    const abilityInfoList = await Promise.all(detail.abilities.map((entry) => getAbilityInfo(entry)));
    const height = `${detail.height / 10}m`;
    const weight = `${detail.weight / 10}kg`;

    modalBody.innerHTML = `
      <div class="modal-layout">
        <div class="modal-image">
          <img id="modalPokemonImage" alt="${displayName} 이미지">
        </div>
        <div class="modal-content">
          <div class="daily-title-row">
            <span class="modal-number">${formatPokemonNumber(pokemon.id)}</span>
            <span class="modal-region-badge">${regionName}</span>
          </div>
          <h2 class="modal-name" id="modalPokemonName">${displayName}</h2>
          <p class="modal-genus">${genus}</p>
          <div class="modal-tags">${typeMarkup}</div>
          <div class="modal-meta">
            <span class="modal-fact">키: ${height}</span>
            <span class="modal-fact">몸무게: ${weight}</span>
          </div>
          <p class="modal-description">${description}</p>
          <div class="abilities-list">${buildAbilityMarkup(abilityInfoList)}</div>
          <div class="modal-nav">
            <button class="modal-nav-button" id="modalPrevButton" type="button">이전 포켓몬</button>
            <button class="modal-nav-button" id="modalNextButton" type="button">다음 포켓몬</button>
          </div>
        </div>
      </div>
    `;

    setPokemonImage(document.getElementById("modalPokemonImage"), pokemon.id, currentDexMode, `${displayName} 이미지`);
    document.getElementById("modalPrevButton")?.addEventListener("click", () => navigatePokemonModal(-1));
    document.getElementById("modalNextButton")?.addEventListener("click", () => navigatePokemonModal(1));
  } catch (error) {
    if (currentModalPokemonId !== pokemonId) {
      return;
    }

    modalBody.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-name">불러오기 실패</h2>
        <p class="modal-description">포켓몬 상세 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      </div>
    `;
  }
}

function getCurrentPokemonIndex() {
  return allPokemon.findIndex((pokemon) => pokemon.id === currentModalPokemonId);
}

function navigatePokemonModal(direction) {
  const currentIndex = getCurrentPokemonIndex();
  if (currentIndex === -1 || allPokemon.length === 0) {
    return;
  }
  const nextIndex = (currentIndex + direction + allPokemon.length) % allPokemon.length;
  openPokemonModal(allPokemon[nextIndex].id);
}

function closePokemonModal() {
  currentModalPokemonId = null;
  pokemonModalBackdrop.classList.add("is-hidden");
  document.body.style.overflow = "";
}

async function refreshDexMode() {
  normalDexButton.classList.toggle("is-active", currentDexMode === "normal");
  shinyDexButton.classList.toggle("is-active", currentDexMode === "shiny");
  renderRegionSections(allPokemon);
  filterPokemon();
  const dailyPokemon = basePokemon[getDailyIndex(basePokemon.length)];
  if (dailyPokemon) {
    await renderDailyPokemon(dailyPokemon);
  }
  if (currentModalPokemonId !== null) {
    await openPokemonModal(currentModalPokemonId);
  }
}

async function loadPokemonDex() {
  dataStatus.textContent = "도감 데이터를 불러오는 중입니다...";
  await loadReferenceData();

  const response = await fetch(`${API_BASE}/pokemon?limit=2000&offset=0`);
  if (!response.ok) {
    throw new Error("도감 목록을 불러오지 못했습니다.");
  }

  const data = await response.json();
  allPokemon = data.results
    .map(buildPokemonEntry)
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);
  basePokemon = allPokemon.filter((pokemon) => !pokemon.isForm);

  totalCount.textContent = String(allPokemon.length);
  populateFilterOptions();
  renderRegionSections(allPokemon);
  await renderDailyPokemon(basePokemon[getDailyIndex(basePokemon.length)]);
  dataStatus.textContent = `${getKoreanDateLabel()} 기준 기본 ${basePokemon.length}마리, 폼 포함 총 ${allPokemon.length}마리를 불러왔습니다.`;
}

searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", filterPokemon);
regionFilter.addEventListener("change", filterPokemon);
formFilter.addEventListener("change", filterPokemon);
normalDexButton.addEventListener("click", () => {
  if (currentDexMode !== "normal") {
    currentDexMode = "normal";
    refreshDexMode();
  }
});
shinyDexButton.addEventListener("click", () => {
  if (currentDexMode !== "shiny") {
    currentDexMode = "shiny";
    refreshDexMode();
  }
});
modalCloseButton.addEventListener("click", closePokemonModal);
pokemonModalBackdrop.addEventListener("click", (event) => {
  if (event.target === pokemonModalBackdrop) {
    closePokemonModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (pokemonModalBackdrop.classList.contains("is-hidden")) {
    return;
  }
  if (event.key === "Escape") {
    closePokemonModal();
  }
  if (event.key === "ArrowLeft") {
    navigatePokemonModal(-1);
  }
  if (event.key === "ArrowRight") {
    navigatePokemonModal(1);
  }
});

loadPokemonDex().catch((error) => {
  console.error(error);
  dataStatus.textContent = "포켓몬 데이터를 불러오지 못했습니다. 인터넷 연결 상태를 확인해 주세요.";
  dailyPokemonCard.classList.remove("loading");
  dailyPokemonCard.innerHTML = `
    <div class="daily-info">
      <h2 class="daily-name">불러오기 실패</h2>
      <p class="daily-desc">포켓몬 API 또는 참고 데이터에 연결할 수 없어서 오늘의 포켓몬과 도감 목록을 가져오지 못했습니다.</p>
    </div>
  `;
});




