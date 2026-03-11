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
const OFFICIAL_FORM_POKEDEX_DATA_URL = "/static/features/pokedex/official-form-pokedex-data.json";
const TEAM_DRAFT_ENDPOINT = "/api/pokedex/team-builder/draft";
const TEAM_DRAFT_MEMBER_ENDPOINT = "/api/pokedex/team-builder/draft/members";
const TEAM_DRAFT_LIMIT = 6;

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

const HISUI_REGION_INFO = { key: "hisui", label: "Hisui", nameKo: "\uD788\uC2A4\uC774 \uC9C0\uBC29" };

const REGION_DISPLAY_ORDER = [
  ...Object.values(REGION_INFO).filter((regionInfo) => regionInfo.key !== "paldea"),
  HISUI_REGION_INFO,
  REGION_INFO[9]
];

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

const ABILITY_TEXT_OVERRIDES = {
  "lingering-aroma": {
    "name": "\uac00\uc2dc\uc9c0\uc54a\ub294\ud5a5\uae30",
    "description": "\uc811\ucd09 \uae30\uc220\uc744 \uc4f4 \uc0c1\ub300\uc758 \ud2b9\uc131\uc744 \uac00\uc2dc\uc9c0\uc54a\ub294\ud5a5\uae30\ub85c \ub9cc\ub4e0\ub2e4."
  },
  "seed-sower": {
    "name": "\ub118\uce58\ub294\uc528",
    "description": "\uacf5\uaca9\uc744 \ubc1b\uc73c\uba74 \ud544\ub4dc\ub97c \uadf8\ub798\uc2a4\ud544\ub4dc\ub85c \ub9cc\ub4e0\ub2e4."
  },
  "thermal-exchange": {
    "name": "\uc5f4\uad50\ud658",
    "description": "\ubd88\uaf43\ud0c0\uc785 \uae30\uc220\ub85c \uacf5\uaca9\ubc1b\uc73c\uba74 \uacf5\uaca9\uc774 \uc62c\ub77c\uac04\ub2e4.\n\ud654\uc0c1 \uc0c1\ud0dc\uac00 \ub418\uc9c0 \uc54a\ub294\ub2e4."
  },
  "anger-shell": {
    "name": "\ubd84\ub178\uc758\uaecd\uc9c8",
    "description": "\uc0c1\ub300\uc758 \uacf5\uaca9\uc5d0 \uc758\ud574 HP\uac00 \uc808\ubc18\uc774 \ub418\uba74\n\ud654\uac00 \ub098\uc11c \ubc29\uc5b4\uc640 \ud2b9\uc218\ubc29\uc5b4\uac00 \ub5a8\uc5b4\uc9c0\uc9c0\ub9cc\n\uacf5\uaca9, \ud2b9\uc218\uacf5\uaca9, \uc2a4\ud53c\ub4dc\uac00 \uc62c\ub77c\uac04\ub2e4."
  },
  "purifying-salt": {
    "name": "\uc815\ud654\uc758\uc18c\uae08",
    "description": "\uae68\ub057\ud55c \uc18c\uae08\uc5d0 \uc758\ud574 \uc0c1\ud0dc \uc774\uc0c1\uc774 \ub418\uc9c0 \uc54a\ub294\ub2e4.\n\uace0\uc2a4\ud2b8\ud0c0\uc785 \uae30\uc220\uc758 \ub370\ubbf8\uc9c0\ub97c \ubc18\uac10\uc2dc\ud0a8\ub2e4."
  },
  "well-baked-body": {
    "name": "\ub178\ub987\ub178\ub987\ubc14\ub514",
    "description": "\ubd88\uaf43\ud0c0\uc785 \uae30\uc220\ub85c \uacf5\uaca9\ubc1b\uc73c\uba74\n\ub370\ubbf8\uc9c0\ub97c \uc785\uc9c0 \uc54a\uace0\n\ubc29\uc5b4\uac00 \ud06c\uac8c \uc62c\ub77c\uac04\ub2e4."
  },
  "wind-rider": {
    "name": "\ubc14\ub78c\ud0c0\uae30",
    "description": "\uc21c\ud48d\uc774 \ubd88\uac70\ub098 \ubc14\ub78c \uae30\uc220\ub85c \uacf5\uaca9\ubc1b\uc73c\uba74\n\ub370\ubbf8\uc9c0\ub97c \ubc1b\uc9c0 \uc54a\uace0 \uacf5\uaca9\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "guard-dog": {
    "name": "\ud30c\uc218\uacac",
    "description": "\uc704\ud611\uc744 \ubc1b\uc73c\uba74 \uacf5\uaca9\uc774 \uc62c\ub77c\uac04\ub2e4.\n\ud3ec\ucf13\ubaac\uc744 \uad50\uccb4\uc2dc\ud0a4\ub294 \uae30\uc220\uc774\ub098 \ub3c4\uad6c\uc758 \ud6a8\uacfc\ub97c \ubc1b\uc9c0 \uc54a\ub294\ub2e4."
  },
  "rocky-payload": {
    "name": "\ubc14\uc704\ub098\ub974\uae30",
    "description": "\ubc14\uc704\ud0c0\uc785 \uae30\uc220\uc758 \uc704\ub825\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "wind-power": {
    "name": "\ud48d\ub825\ubc1c\uc804",
    "description": "\ubc14\ub78c \uae30\uc220\ub85c \uacf5\uaca9\ubc1b\uc73c\uba74 \ucda9\uc804 \uc0c1\ud0dc\uac00 \ub41c\ub2e4."
  },
  "zero-to-hero": {
    "name": "\ub9c8\uc774\ud2f0\uccb4\uc778\uc9c0",
    "description": "\uc9c0\ub2cc \ud3ec\ucf13\ubaac\uc73c\ub85c \ub3cc\uc544\uc624\uba74 \ub9c8\uc774\ud2f0\ud3fc\uc73c\ub85c \ubcc0\ud55c\ub2e4."
  },
  "commander": {
    "name": "\uc0ac\ub839\ud0d1",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uac19\uc740 \ud3b8\uc5d0 \uc5b4\uc368\ub7ec\uc154\uac00 \uc788\uc73c\uba74 \uc785\uc18d\uc5d0 \ub4e4\uc5b4\uac00 \uc548\uc5d0\uc11c \uc9c0\uc2dc\ub97c \ub0b4\ub9b0\ub2e4."
  },
  "electromorphosis": {
    "name": "\uc804\uae30\ub85c\ubc14\uafb8\uae30",
    "description": "\ub370\ubbf8\uc9c0\ub97c \ubc1b\uc73c\uba74 \ucda9\uc804 \uc0c1\ud0dc\uac00 \ub41c\ub2e4."
  },
  "protosynthesis": {
    "name": "\uace0\ub300\ud65c\uc131",
    "description": "\ubd80\uc2a4\ud2b8\uc5d0\ub108\uc9c0\ub97c \uc9c0\ub2c8\uace0 \uc788\uac70\ub098 \ub0a0\uc528\uac00 \ub9d1\uc744 \ub54c \uac00\uc7a5 \ub192\uc740 \ub2a5\ub825\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "quark-drive": {
    "name": "\ucffc\ud06c\ucc28\uc9c0",
    "description": "\ubd80\uc2a4\ud2b8\uc5d0\ub108\uc9c0\ub97c \uc9c0\ub2c8\uace0 \uc788\uac70\ub098 \uc77c\ub809\ud2b8\ub9ad\ud544\ub4dc\uc77c \ub54c \uac00\uc7a5 \ub192\uc740 \ub2a5\ub825\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "good-as-gold": {
    "name": "\ud669\uae08\ubab8",
    "description": "\uc0b0\ud654\ud558\uc9c0 \uc54a\ub294 \ud2bc\ud2bc\ud55c \ud669\uae08\ubab8 \ub355\ubd84\uc5d0 \uc0c1\ub300\uc758 \ubcc0\ud654 \uae30\uc220\uc758 \uc601\ud5a5\uc744 \ubc1b\uc9c0 \uc54a\ub294\ub2e4."
  },
  "vessel-of-ruin": {
    "name": "\uc7ac\uc559\uc758\uadf8\ub987",
    "description": "\uc7ac\uc559\uc744 \ubd80\ub974\ub294 \uadf8\ub987\uc758 \ud798\uc73c\ub85c \uc790\uc2e0\uc744 \uc81c\uc678\ud55c \ubaa8\ub4e0 \ud3ec\ucf13\ubaac\uc758 \ud2b9\uc218 \uacf5\uaca9\uc744 \uc57d\ud558\uac8c \ub9cc\ub4e0\ub2e4."
  },
  "sword-of-ruin": {
    "name": "\uc7ac\uc559\uc758\uac80",
    "description": "\uc7ac\uc559\uc744 \ubd80\ub974\ub294 \uac80\uc758 \ud798\uc73c\ub85c \uc790\uc2e0\uc744 \uc81c\uc678\ud55c \ubaa8\ub4e0 \ud3ec\ucf13\ubaac\uc758 \ubc29\uc5b4\ub97c \uc57d\ud558\uac8c \ub9cc\ub4e0\ub2e4."
  },
  "tablets-of-ruin": {
    "name": "\uc7ac\uc559\uc758\ubaa9\uac04",
    "description": "\uc7ac\uc559\uc744 \ubd80\ub974\ub294 \ubaa9\uac04\uc758 \ud798\uc73c\ub85c \uc790\uc2e0\uc744 \uc81c\uc678\ud55c \ubaa8\ub4e0 \ud3ec\ucf13\ubaac\uc758 \uacf5\uaca9\uc744 \uc57d\ud558\uac8c \ub9cc\ub4e0\ub2e4."
  },
  "beads-of-ruin": {
    "name": "\uc7ac\uc559\uc758\uad6c\uc2ac",
    "description": "\uc7ac\uc559\uc744 \ubd80\ub974\ub294 \uace1\uc625\uc758 \ud798\uc73c\ub85c \uc790\uc2e0\uc744 \uc81c\uc678\ud55c \ubaa8\ub4e0 \ud3ec\ucf13\ubaac\uc758 \ud2b9\uc218\ubc29\uc5b4\ub97c \uc57d\ud558\uac8c \ub9cc\ub4e0\ub2e4."
  },
  "orichalcum-pulse": {
    "name": "\uc9c4\ud64d\ube5b\uace0\ub3d9",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \ub0a0\uc528\ub97c \ub9d1\uc74c\uc73c\ub85c \ub9cc\ub4e0\ub2e4.\n\ud587\uc0b4\uc774 \uac15\ud558\uba74 \uace0\ub300\uc758 \uace0\ub3d9\uc5d0 \uc758\ud574 \uacf5\uaca9\uc774 \uac15\ud654\ub41c\ub2e4."
  },
  "hadron-engine": {
    "name": "\ud558\ub4dc\ub860\uc5d4\uc9c4",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uc77c\ub809\ud2b8\ub9ad\ud544\ub4dc\ub97c \uc804\uac1c\ud55c\ub2e4.\n\uc77c\ub809\ud2b8\ub9ad\ud544\ub4dc\uc77c \ub54c \ubbf8\ub798 \uae30\uad00\uc5d0 \uc758\ud574 \ud2b9\uc218\uacf5\uaca9\uc774 \uac15\ud654\ub41c\ub2e4."
  },
  "opportunist": {
    "name": "\ud3b8\uc2b9",
    "description": "\uc0c1\ub300\uc758 \ub2a5\ub825\uc774 \uc62c\ub77c\uac00\uba74 \uc790\uc2e0\ub3c4 \ud3b8\uc2b9\ud574\uc11c \ub611\uac19\uc774 \uc790\uc2e0\ub3c4 \uc62c\ub9b0\ub2e4."
  },
  "cud-chew": {
    "name": "\ub418\uc0c8\uae40\uc9c8",
    "description": "\ud55c \ubc88\uc5d0 \ud55c\ud558\uc5ec \ub098\ubb34\uc5f4\ub9e4\ub97c \uba39\uc73c\uba74 \ub2e4\uc74c \ud134\uc774 \ub05d\ub0a0 \ub54c \uc704\uc5d0\uc11c \uaebc\ub0b4\uc11c \ub610 \uba39\ub294\ub2e4."
  },
  "sharpness": {
    "name": "\uc608\ub9ac\ud568",
    "description": "\uc0c1\ub300\ub97c \ubca0\ub294 \uae30\uc220\uc758 \uc704\ub825\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "supreme-overlord": {
    "name": "\ucd1d\ub300\uc7a5",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uc9c0\uae08\uae4c\uc9c0 \uc4f0\ub7ec\uc9c4 \uac19\uc740 \ud3b8\uc758 \uc218\uac00 \ub9ce\uc744\uc218\ub85d \uc870\uae08\uc529 \uacf5\uaca9\uacfc \ud2b9\uc218\uacf5\uaca9\uc774 \uc62c\ub77c\uac04\ub2e4."
  },
  "costar": {
    "name": "\ud611\uc5f0",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uac19\uc740 \ud3b8\uc758 \ub2a5\ub825 \ubcc0\ud654\ub97c \ubcf5\uc0ac\ud55c\ub2e4."
  },
  "toxic-debris": {
    "name": "\ub3c5\uce58\uc7a5",
    "description": "\ubb3c\ub9ac \uae30\uc220\ub85c \ub370\ubbf8\uc9c0\ub97c \ubc1b\uc73c\uba74 \uc0c1\ub300\uc758 \ubc1c\ubc11\uc5d0 \ub3c5\uc555\uc815\uc744 \ubfcc\ub9b0\ub2e4."
  },
  "armor-tail": {
    "name": "\ud14c\uc77c\uc544\uba38",
    "description": "\uc0c1\ub300 \ud3ec\ucf13\ubaac\uc774 \uc120\uc81c \uae30\uc220\uc744 \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uac8c \ud55c\ub2e4."
  },
  "earth-eater": {
    "name": "\ud759\uba39\uae30",
    "description": "\ub545\ud0c0\uc785\uc758 \uae30\uc220\ub85c \uacf5\uaca9\ubc1b\uc73c\uba74 \ub370\ubbf8\uc9c0\ub97c \ubc1b\uc9c0 \uc54a\uace0 \ud68c\ubcf5\ud55c\ub2e4."
  },
  "mycelium-might": {
    "name": "\uade0\uc0ac\uc758\ud798",
    "description": "\ubcc0\ud654 \uae30\uc220\uc744 \uc0ac\uc6a9\ud560 \ub54c \ubc18\ub4dc\uc2dc \ud589\ub3d9\uc774 \ub290\ub824\uc9c0\uc9c0\ub9cc \uc0c1\ub300 \ud2b9\uc131\uc5d0 \ubc29\ud574\ubc1b\uc9c0 \uc54a\ub294\ub2e4."
  },
  "minds-eye": {
    "name": "\uc2ec\uc548",
    "description": "\ub178\ub9d0\ud0c0\uc785\uacfc \uaca9\ud22c\ud0c0\uc785 \uae30\uc220\uc744 \uace0\uc2a4\ud2b8\ud0c0\uc785\uc5d0\uac8c \ub9de\ud790 \uc218 \uc788\ub2e4.\n\uc0c1\ub300\uc758 \ud68c\ud53c\uc728 \ubcc0\ud654\ub97c \ubb34\uc2dc\ud558\uace0 \uba85\uc911\ub960\ub3c4 \ub5a8\uc5b4\uc9c0\uc9c0 \uc54a\ub294\ub2e4."
  },
  "supersweet-syrup": {
    "name": "\uac10\ubbf8\ub85c\uc6b4\uafc0",
    "description": "\ucc98\uc74c \ub4f1\uc7a5\ud588\uc744 \ub54c \uac10\ubbf8\ub85c\uc6b4 \uafc0\uc758 \ud5a5\uae30\ub97c \ud769\ubfcc\ub824\uc11c \uc0c1\ub300\uc758 \ud68c\ud53c\uc728\uc744 \ub5a8\uc5b4\ub728\ub9b0\ub2e4."
  },
  "hospitality": {
    "name": "\ub300\uc811",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uac19\uc740 \ud3b8\uc744 \ub300\uc811\ud574\uc11c HP\ub97c \uc870\uae08 \ud68c\ubcf5\uc2dc\ud0a8\ub2e4."
  },
  "toxic-chain": {
    "name": "\ub3c5\uc0ac\uc2ac",
    "description": "\ub3c5\uc18c\ub97c \uba38\uae08\uc740 \uc0ac\uc2ac\uc758 \ud798\uc73c\ub85c \uae30\uc220\uc5d0 \ub9de\uc740 \uc0c1\ub300\ub97c \ub9f9\ub3c5 \uc0c1\ud0dc\ub85c \ub9cc\ub4e4 \ub54c\uac00 \uc788\ub2e4."
  },
  "tera-shift": {
    "name": "\ud14c\ub77c\uccb4\uc778\uc9c0",
    "description": "\ub4f1\uc7a5\ud588\uc744 \ub54c \uc8fc\uc704\uc758 \uc5d0\ub108\uc9c0\ub97c \ud761\uc218\ud558\uc5ec \ud14c\ub77c\uc2a4\ud0c8\ud3fc\uc73c\ub85c \ubcc0\ud55c\ub2e4."
  },
  "tera-shell": {
    "name": "\ud14c\ub77c\uc178",
    "description": "\uccb4\ub825\uc774 \ubaa8\ub450 \ucc28\uc788\uc744 \ub54c \uc0c1\ub300\ubc29\uc774 \uc0ac\uc6a9\ud558\ub294 \uae30\uc220\uc758 \ub370\ubbf8\uc9c0\uac00 \ubc18\uac10\ub41c\ub2e4."
  },
  "teraform-zero": {
    "name": "\uc81c\ub85c\ud3ec\ubc0d",
    "description": "\ub0a0\uc528\uc640 \ud544\ub4dc\uc5d0 \uc801\uc6a9\ub418\uc5b4 \uc788\ub294 \ud6a8\uacfc\ub97c \ubaa8\ub450 \ubb34\uc2dc\ud55c\ub2e4."
  },
  "poison-puppeteer": {
    "name": "\ub3c5\uc870\uc885",
    "description": "\ubcf5\uc22d\uc545\ub3d9\uc758 \uae30\uc220\uc5d0 \uc758\ud574 \ub3c5 \uc0c1\ud0dc\uac00 \ub41c \uc0c1\ub300\ub294 \ud63c\ub780 \uc0c1\ud0dc\ub3c4 \ub418\uc5b4 \ubc84\ub9b0\ub2e4."
  }
};

const TYPE_ACCENT_MAP = {
  normal: "#94a3b8",
  fire: "#f97316",
  water: "#2563eb",
  electric: "#facc15",
  grass: "#16a34a",
  ice: "#06b6d4",
  fighting: "#b91c1c",
  poison: "#9333ea",
  ground: "#a16207",
  flying: "#6366f1",
  psychic: "#ec4899",
  bug: "#65a30d",
  rock: "#78716c",
  ghost: "#7c3aed",
  dragon: "#4338ca",
  dark: "#1c1917",
  steel: "#64748b",
  fairy: "#db2777"
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
  "combat-breed": "컴뱃종",
  "blaze-breed": "블레이즈종",
  "aqua-breed": "아쿠아종",
  totem: "토템폼",
  active: "액티브모드",
  neutral: "릴랙스모드",
  primal: "원시회귀",
  natural: "내추럴컷",
  heart: "하트컷",
  star: "스타컷",
  diamond: "다이아컷",
  debutante: "레이디컷",
  matron: "마담컷",
  dandy: "젠틀컷",
  "la-reine": "퀸컷",
  kabuki: "가부키컷",
  pharaoh: "킹컷"
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
let fullPokemon = [];
let hasLoadedForms = false;
let cardEntries = [];
let koreanNameMap = new Map();
let regionMap = new Map();
let pokemonTypeMap = new Map();
let pokemonMetaMap = new Map();
let formMetaMap = new Map();
let formNameMap = new Map();
let abilityInfoCache = new Map();
let officialFormDescriptionMap = new Map();
let currentModalPokemonId = null;
let currentDexMode = "normal";
const expandedRegions = new Set();

async function fetchTeamDraft() {
  const response = await fetch(TEAM_DRAFT_ENDPOINT);
  if (!response.ok) {
    throw new Error("team-draft-fetch-failed");
  }
  const data = await response.json();
  return Array.isArray(data.team) ? data.team : [];
}

async function addPokemonToTeamDraft(pokemonSummary) {
  const response = await fetch(TEAM_DRAFT_MEMBER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pokemonSummary)
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      reason: data.reason || "error",
      count: Array.isArray(data.team) ? data.team.length : 0
    };
  }

  return {
    ok: true,
    reason: "added",
    count: Number(data.count || 0)
  };
}

function renderTeamDraftStatus(message, isError = false) {
  const statusNode = document.getElementById("modalTeamDraftStatus");
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.classList.toggle("is-error", isError);
}

async function refreshModalTeamDraftButton(pokemonSummary) {
  const button = document.getElementById("addPokemonToTeamButton");
  if (!button) {
    return;
  }

  let teamDraft = [];
  try {
    teamDraft = await fetchTeamDraft();
  } catch (error) {
    console.error(error);
  }
  const alreadyAdded = teamDraft.some((member) => member.id === pokemonSummary.id);
  const isFull = teamDraft.length >= TEAM_DRAFT_LIMIT;

  button.disabled = alreadyAdded || isFull;
  button.textContent = alreadyAdded ? "이미 팀에 담겼어요" : `팀에 추가 (${teamDraft.length}/${TEAM_DRAFT_LIMIT})`;

  if (alreadyAdded) {
    renderTeamDraftStatus("이 포켓몬은 이미 팀 후보에 담겨 있습니다.");
    return;
  }

  if (isFull) {
    renderTeamDraftStatus("팀 후보가 가득 찼습니다. 팀 빌더에서 정리해 주세요.", true);
    return;
  }

  renderTeamDraftStatus("포켓몬을 최대 6마리까지 팀 후보에 담을 수 있습니다.");
}

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
    /^raticate-totem-alola$/,
    /-totem$/,
    /^(pumpkaboo|gourgeist)-(small|large|super)$/,
    /^aegislash-blade$/,
    /^meloetta-pirouette$/,
    /^wishiwashi-school$/,
    /^mimikyu-busted$/,
    /^cramorant-(gulping|gorging)$/,
    /^morpeko-hangry$/,
    /^eiscue-noice-face$/,
    /^darmanitan(-galar)?-zen$/
  ];

  return excludedPatterns.some((pattern) => pattern.test(identifier));
}

function shouldFlattenToBaseForm(identifier, formSlug, formLabel, isDefault) {
  if (/^(pumpkaboo|gourgeist)-average$/.test(identifier) && formSlug === "average") {
    return true;
  }

  if (isDefault && /^(koraidon|miraidon)$/.test(identifier)) {
    return true;
  }

  if (/^(kyogre|groudon|arceus|xerneas)$/.test(identifier)) {
    return true;
  }

  if (/^furfrou-natural$/.test(identifier) && formSlug === "natural") {
    return true;
  }

  return false;
}

function shouldPreferTranslatedFormName(formName) {
  return !formName || /^[A-Za-z0-9 .''\-:]+$/.test(formName);
}
function translateFormSlug(slug) {
  return slug
    .split("-")
    .map((part) => FORM_LABEL_MAP[part] || titleCaseName(part))
    .join(" ");
}

function getRegionalFormDisplayName(baseName, formSlug) {
  const slugParts = (formSlug || "").split("-").filter(Boolean);
  const regionalPart = slugParts.find((part) => PREFIX_FORM_LABELS[part]);
  if (!regionalPart) {
    return null;
  }

  const remainingParts = slugParts.filter((part) => part !== regionalPart);
  const translatedSuffix = remainingParts
    .map((part) => FORM_LABEL_MAP[part] || titleCaseName(part))
    .join(" ")
    .trim();

  return translatedSuffix
    ? `${PREFIX_FORM_LABELS[regionalPart]} ${baseName} ${translatedSuffix}`.trim()
    : `${PREFIX_FORM_LABELS[regionalPart]} ${baseName}`;
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
  return REGION_INFO[generationId] || { key: "other", label: "Other", nameKo: "??" };
}

function getRegionInfoForPokemon(pokemon) {
  if (pokemon.formSlug === "hisui") {
    return HISUI_REGION_INFO;
  }

  return getRegionInfo(regionMap.get(pokemon.speciesId));
}

function getRegionLabelForPokemon(pokemon) {
  return getRegionInfoForPokemon(pokemon).nameKo;
}

function getKoreanSpeciesDescription(species, fallbackText) {
  const koreanEntry = species.flavor_text_entries.find((entry) => entry.language.name === "ko");
  return (koreanEntry?.flavor_text || fallbackText).replace(/\f|\n|\r/g, " ");
}

function getOfficialDescriptionEntry(pokemon) {
  return officialFormDescriptionMap.get(pokemon.id) || officialFormDescriptionMap.get(pokemon.speciesId) || null;
}

function getOfficialPokemonDescription(pokemon) {
  return getOfficialDescriptionEntry(pokemon)?.description || "";
}

function getPokemonDescription(pokemon, species, fallbackText) {
  const officialDescription = getOfficialPokemonDescription(pokemon);
  if (officialDescription) {
    return officialDescription;
  }

  if (pokemon.formCategory === "mega" || pokemon.formCategory === "gmax") {
    return "공식 폼 도감 설명을 아직 불러오지 못했어요.";
  }

  return getKoreanSpeciesDescription(species, fallbackText);
}

function getKoreanGenus(species) {
  return species.genera.find((entry) => entry.language.name === "ko")?.genus || "\uD3EC\uCF13\uBAAC";
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
  const regionalFormDisplayName = getRegionalFormDisplayName(baseName, pokemon.formSlug);
  if (regionalFormDisplayName) {
    return regionalFormDisplayName;
  }

  if (explicitFormName && !shouldPreferTranslatedFormName(explicitFormName)) {
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
      isMega: row.is_mega === "1",
      introducedInVersionGroupId: Number(row.introduced_in_version_group_id)
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
  for (const regionInfo of REGION_DISPLAY_ORDER) {
    const option = document.createElement("option");
    option.value = regionInfo.key;
    option.textContent = regionInfo.nameKo;
    regionFilter.appendChild(option);
  }
}

async function loadReferenceData() {
  const [speciesNamesResponse, speciesResponse, pokemonResponse, typesResponse, formsResponse, formNamesResponse, officialFormResponse] = await Promise.all([
    fetch(SPECIES_NAMES_CSV_URL),
    fetch(SPECIES_CSV_URL),
    fetch(POKEMON_CSV_URL),
    fetch(POKEMON_TYPES_CSV_URL),
    fetch(POKEMON_FORMS_CSV_URL),
    fetch(POKEMON_FORM_NAMES_CSV_URL),
    fetch(OFFICIAL_FORM_POKEDEX_DATA_URL)
  ]);

  if (![speciesNamesResponse, speciesResponse, pokemonResponse, typesResponse, formsResponse, formNamesResponse, officialFormResponse].every((response) => response.ok)) {
    throw new Error("\uD3EC\uCF13\uBAAC \uCC38\uACE0 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
  }

  const [speciesNamesCsv, speciesCsv, pokemonCsv, pokemonTypesCsv, pokemonFormsCsv, pokemonFormNamesCsv, officialFormData] = await Promise.all([
    speciesNamesResponse.text(),
    speciesResponse.text(),
    pokemonResponse.text(),
    typesResponse.text(),
    formsResponse.text(),
    formNamesResponse.text(),
    officialFormResponse.json()
  ]);

  koreanNameMap = new Map(
    parseCsv(speciesNamesCsv)
      .filter((row) => row.local_language_id === "3")
      .map((row) => [Number(row.pokemon_species_id), row.name])
  );

  regionMap = new Map(parseCsv(speciesCsv).map((row) => [Number(row.id), Number(row.generation_id)]));
  hydratePokemonTypes(parseCsv(pokemonTypesCsv));
  hydratePokemonMeta(parseCsv(pokemonCsv), parseCsv(pokemonFormsCsv), parseCsv(pokemonFormNamesCsv));
  officialFormDescriptionMap = new Map(Object.entries(officialFormData).map(([pokemonId, entry]) => [Number(pokemonId), entry]));
}

function buildPokemonEntry(result) {
  const id = getPokemonIdFromUrl(result.url);
  const meta = pokemonMetaMap.get(id);
  if (!meta || meta.speciesId > 1025 || shouldExcludeSpecialForm(meta.identifier)) {
    return null;
  }

  const formMeta = formMetaMap.get(id);
  if (formMeta?.isMega && formMeta.introducedInVersionGroupId === 31) {
    return null;
  }

  if (/^koraidon-.*-build$/.test(meta.identifier) || /^miraidon-.*-mode$/.test(meta.identifier)) {
    return null;
  }

  const rawFormLabel = formMeta ? formNameMap.get(formMeta.formId) || "" : "";
  const rawFormSlug = formMeta?.formIdentifier || "";
  const flattenToBaseForm = shouldFlattenToBaseForm(meta.identifier, rawFormSlug, rawFormLabel, meta.isDefault);
  const formLabel = flattenToBaseForm ? "" : rawFormLabel;
  const formSlug = flattenToBaseForm ? "" : rawFormSlug;
  const isForm = flattenToBaseForm
    ? false
    : Boolean(formMeta && (!meta.isDefault || rawFormSlug || rawFormLabel));
  const formCategory = isForm ? getFormCategoryFromName(meta.identifier) : "base";

  return {
    id,
    name: result.name,
    speciesId: meta.speciesId,
    isDefault: meta.isDefault,
    isForm,
    formId: formMeta?.formId || null,
    formSlug,
    formName: formLabel,
    formCategory,
    regionKey: getRegionInfoForPokemon({ speciesId: meta.speciesId, formSlug }).key
  };
}
function buildPokemonList(results, includeForms = false) {
  return results
    .map(buildPokemonEntry)
    .filter((pokemon) => Boolean(pokemon) && (includeForms || !pokemon.isForm))
    .sort((a, b) => a.id - b.id);
}

async function ensureAllFormsLoaded() {
  if (hasLoadedForms) {
    return;
  }

  dataStatus.textContent = "? ???? ??? ???? ????...";
  const response = await fetch(`${API_BASE}/pokemon?limit=2000&offset=0`);
  if (!response.ok) {
    throw new Error("? ?? ??? ???? ?????.");
  }

  const data = await response.json();
  fullPokemon = data.results
    .map(buildPokemonEntry)
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);
  allPokemon = fullPokemon;
  basePokemon = allPokemon.filter((pokemon) => !pokemon.isForm);
  hasLoadedForms = true;
  totalCount.textContent = String(allPokemon.length);
  populateFilterOptions();
  dataStatus.textContent = `${getKoreanDateLabel()} ?? ?? ${basePokemon.length}??, ? ?? ? ${allPokemon.length}??? ??????.`;
}


async function getAbilityInfo(abilityEntry) {
  if (abilityInfoCache.has(abilityEntry.ability.name)) {
    return {
      ...abilityInfoCache.get(abilityEntry.ability.name),
      isHidden: abilityEntry.is_hidden
    };
  }

  const localOverride = ABILITY_TEXT_OVERRIDES[abilityEntry.ability.name];
  const response = await fetch(abilityEntry.ability.url);
  if (!response.ok) {
    const fallback = {
      name: localOverride?.name || titleCaseName(abilityEntry.ability.name),
      description: localOverride?.description || "\ud2b9\uc131 \uc124\uba85\uc744 \uc544\uc9c1 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694."
    };
    abilityInfoCache.set(abilityEntry.ability.name, fallback);
    return { ...fallback, isHidden: abilityEntry.is_hidden };
  }

  const data = await response.json();
  const koreanName = data.names.find((entry) => entry.language.name === "ko")?.name;
  const englishName = data.names.find((entry) => entry.language.name === "en")?.name;
  const effectEntry = data.effect_entries.find((entry) => entry.language.name === "ko");
  const shortEntry = data.flavor_text_entries?.find((entry) => entry.language.name === "ko");
  const englishEffectEntry = data.effect_entries.find((entry) => entry.language.name === "en");
  const englishShortEntry = data.flavor_text_entries?.find((entry) => entry.language.name === "en");
  const description = (
    localOverride?.description
    || effectEntry?.short_effect
    || shortEntry?.flavor_text
    || englishEffectEntry?.short_effect
    || englishShortEntry?.flavor_text
    || "\ud2b9\uc131 \uc124\uba85\uc744 \uc544\uc9c1 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694."
  ).replace(/\f|\n|\r/g, " ");
  const abilityInfo = {
    name: koreanName || localOverride?.name || englishName || titleCaseName(abilityEntry.ability.name),
    description
  };
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

function getBaseStatMap(detail) {
  const statMap = {};
  for (const statEntry of detail.stats) {
    statMap[statEntry.stat.name] = statEntry.base_stat;
  }
  return {
    hp: statMap.hp || 0,
    attack: statMap.attack || 0,
    defense: statMap.defense || 0,
    specialAttack: statMap["special-attack"] || 0,
    specialDefense: statMap["special-defense"] || 0,
    speed: statMap.speed || 0
  };
}

function getBaseStatTotal(baseStats) {
  return Object.values(baseStats).reduce((sum, value) => sum + Number(value || 0), 0);
}

function getCaptureChance(baseStatTotal) {
  return Math.max(0.22, Math.min(0.78, 0.95 - baseStatTotal / 900));
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
  const description = getPokemonDescription(pokemon, species, "\uD55C\uAD6D\uC5B4 \uB3C4\uAC10 \uC124\uBA85\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694.");
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

function getFilteredPokemon() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedRegion = regionFilter.value;
  const selectedForm = formFilter.value;

  return allPokemon.filter((pokemon) => {
    const displayName = getPokemonDisplayName(pokemon).toLowerCase();
    const pokemonTypes = pokemonTypeMap.get(pokemon.id) || [];
    const matchesText = !query || pokemon.name.includes(query) || displayName.includes(query) || String(pokemon.id).includes(query);
    const matchesType = !selectedType || pokemonTypes.includes(selectedType);
    const matchesRegion = !selectedRegion || pokemon.regionKey === selectedRegion;
    const matchesForm = selectedForm === "all" || pokemon.formCategory === selectedForm;
    return matchesText && matchesType && matchesRegion && matchesForm;
  });
}

function renderRegionCards(regionGrid, pokemonGroup, cards) {
  const fragment = document.createDocumentFragment();
  for (const pokemon of pokemonGroup) {
    const card = createPokemonCard(pokemon);
    cards.push(card);
    fragment.appendChild(card);
  }
  regionGrid.innerHTML = "";
  regionGrid.appendChild(fragment);
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
  const availableRegions = REGION_DISPLAY_ORDER.filter((regionInfo) => grouped.has(regionInfo.key));

  if (availableRegions.length === 0) {
    regionSections.innerHTML = `
      <section class="region-section region-empty-state">
        <div class="region-heading">
          <div>
            <p class="section-label region-label">No Results</p>
            <h3 class="region-name">??? ?? ???? ???</h3>
          </div>
        </div>
        <p class="section-copy">???? ??? ???? ?? ??? ???.</p>
      </section>
    `;
    cardEntries = [];
    visibleCount.textContent = "0";
    return;
  }

  for (const regionInfo of availableRegions) {
    const group = grouped.get(regionInfo.key) || [];
    const sectionFragment = regionSectionTemplate.content.cloneNode(true);
    sectionFragment.querySelector(".region-label").textContent = regionInfo.label;
    sectionFragment.querySelector(".region-name").textContent = regionInfo.nameKo;
    const section = sectionFragment.querySelector(".region-section");
    const toggleButton = sectionFragment.querySelector(".region-toggle");
    const regionContent = sectionFragment.querySelector(".region-content");
    const regionGrid = sectionFragment.querySelector(".region-grid");
    const isExpanded = expandedRegions.has(regionInfo.key);

    section.dataset.region = regionInfo.key;
    toggleButton.dataset.region = regionInfo.key;
    toggleButton.setAttribute("aria-expanded", String(isExpanded));

    if (isExpanded) {
      regionContent.classList.remove("is-hidden");
      renderRegionCards(regionGrid, group, cards);
    }

    toggleButton.addEventListener("click", () => {
      const willExpand = regionContent.classList.contains("is-hidden");
      regionContent.classList.toggle("is-hidden", !willExpand);
      toggleButton.setAttribute("aria-expanded", String(willExpand));

      if (willExpand) {
        expandedRegions.add(regionInfo.key);
        if (!regionGrid.children.length) {
          renderRegionCards(regionGrid, group, cards);
        }
      } else {
        expandedRegions.delete(regionInfo.key);
        regionGrid.innerHTML = "";
      }
    });

    fragment.appendChild(section);
  }

  regionSections.innerHTML = "";
  regionSections.appendChild(fragment);
  cardEntries = cards;
  visibleCount.textContent = String(pokemonList.length);
}

function filterPokemon() {
  renderRegionSections(getFilteredPokemon());
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
    const description = getPokemonDescription(pokemon, species, "\uD55C\uAD6D\uC5B4 \uB3C4\uAC10 \uC124\uBA85\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694.");
    const genus = getKoreanGenus(species);
    const regionName = getRegionLabelForPokemon(pokemon);
    const typeMarkup = detail.types.map((entry) => `<span class="type-chip type-${entry.type.name}">${TYPE_NAME_KO[entry.type.name] || entry.type.name}</span>`).join("");
    const abilityInfoList = await Promise.all(detail.abilities.map((entry) => getAbilityInfo(entry)));
    const baseStats = getBaseStatMap(detail);
    const baseStatTotal = getBaseStatTotal(baseStats);
    const normalAbilities = abilityInfoList.filter((ability) => !ability.isHidden);
    const hiddenAbilities = abilityInfoList.filter((ability) => ability.isHidden);
    const abilityOptionsMarkup = normalAbilities.map((ability, index) => `
      <option value="${index}">${ability.name}</option>
    `).join("");
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
            <span class="modal-fact">종족값 합계: ${baseStatTotal}</span>
          </div>
          <p class="modal-description">${description}</p>
          <div class="abilities-list">${buildAbilityMarkup(abilityInfoList)}</div>
          <div class="modal-feature-area">
            <div class="modal-team-actions">
              <label class="modal-ability-field" for="modalAbilitySelect">
                <span>추가할 특성</span>
                <select id="modalAbilitySelect" ${normalAbilities.length ? "" : "disabled"}>
                  ${abilityOptionsMarkup || '<option value="">일반 특성이 없습니다</option>'}
                </select>
              </label>
              <div class="modal-team-button-row">
                <button class="modal-nav-button modal-team-button" id="addPokemonToTeamButton" type="button" ${normalAbilities.length ? "" : "disabled"}>일반 추가</button>
                <button class="modal-nav-button modal-catch-button" id="catchPokemonButton" type="button">포획하기</button>
              </div>
              <p class="modal-team-status" id="modalTeamDraftStatus" aria-live="polite"></p>
            </div>
            <button class="modal-nav-button modal-wallpaper-button" id="openWallpaperGeneratorButton" type="button">배경화면 생성하기</button>
          </div>
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
    const teamButton = document.getElementById("addPokemonToTeamButton");
    const catchButton = document.getElementById("catchPokemonButton");
    const abilitySelect = document.getElementById("modalAbilitySelect");
    const pokemonSummary = {
      id: pokemon.id,
      name: pokemon.name,
      displayName,
      imageUrl: getPrimaryImageUrl(pokemon.id, "normal"),
      types: detail.types.map((entry) => entry.type.name),
      region: regionName,
      stats: baseStats
    };

    await refreshModalTeamDraftButton(pokemonSummary);
    teamButton?.addEventListener("click", async () => {
      const selectedAbility = normalAbilities[Number(abilitySelect?.value || 0)];
      if (!selectedAbility) {
        renderTeamDraftStatus("일반 특성을 먼저 선택해 주세요.", true);
        return;
      }
      const result = await addPokemonToTeamDraft({
        ...pokemonSummary,
        ability: {
          name: selectedAbility.name,
          description: selectedAbility.description,
          isHidden: false
        }
      });
      if (result.ok) {
        renderTeamDraftStatus(`'${displayName}'을(를) ${selectedAbility.name} 특성과 함께 팀 후보에 추가했습니다. (${result.count}/${TEAM_DRAFT_LIMIT})`);
      } else if (result.reason === "duplicate") {
        renderTeamDraftStatus("이 포켓몬은 이미 팀 후보에 담겨 있습니다.", true);
      } else if (result.reason === "full") {
        renderTeamDraftStatus("팀 후보가 가득 찼습니다. 팀 빌더에서 정리해 주세요.", true);
      } else {
        renderTeamDraftStatus("팀 후보에 추가하지 못했습니다. 잠시 후 다시 시도해 주세요.", true);
      }
      await refreshModalTeamDraftButton(pokemonSummary);
    });
    catchButton?.addEventListener("click", async () => {
      const captureChance = getCaptureChance(baseStatTotal);
      const captured = Math.random() < captureChance;
      if (!captured) {
        renderTeamDraftStatus(`포획에 실패했습니다. 포획 확률은 ${Math.round(captureChance * 100)}%였습니다.`, true);
        return;
      }

      const selectedNormal = normalAbilities[Math.floor(Math.random() * Math.max(1, normalAbilities.length))] || null;
      const selectedHidden = hiddenAbilities[Math.floor(Math.random() * Math.max(1, hiddenAbilities.length))] || null;
      const useHidden = Boolean(selectedHidden && selectedNormal && Math.random() < 0.5);
      const chosenAbility = useHidden ? selectedHidden : (selectedNormal || selectedHidden);

      if (!chosenAbility) {
        renderTeamDraftStatus("얻을 수 있는 특성 정보가 없습니다.", true);
        return;
      }

      const result = await addPokemonToTeamDraft({
        ...pokemonSummary,
        ability: {
          name: chosenAbility.name,
          description: chosenAbility.description,
          isHidden: Boolean(chosenAbility.isHidden)
        }
      });

      if (result.ok) {
        renderTeamDraftStatus(`포획 성공. '${displayName}'의 ${chosenAbility.isHidden ? "숨겨진 " : ""}${chosenAbility.name} 특성을 획득했습니다. (${result.count}/${TEAM_DRAFT_LIMIT})`);
      } else if (result.reason === "duplicate") {
        renderTeamDraftStatus("이 포켓몬은 이미 팀 후보에 담겨 있습니다.", true);
      } else if (result.reason === "full") {
        renderTeamDraftStatus("팀 후보가 가득 찼습니다. 팀 빌더에서 정리해 주세요.", true);
      } else {
        renderTeamDraftStatus("포획 결과를 팀 후보에 반영하지 못했습니다.", true);
      }
      await refreshModalTeamDraftButton(pokemonSummary);
    });
    document.dispatchEvent(new CustomEvent("pokemon-modal-rendered", {
      detail: {
        pokemon: {
          id: pokemon.id,
          slug: pokemon.name,
          name: titleCaseName(pokemon.name),
          name_ko: displayName,
          image: getPrimaryImageUrl(pokemon.id, currentDexMode),
          fallbackImage: getFallbackImageUrl(pokemon.id, currentDexMode),
          accent: TYPE_ACCENT_MAP[detail.types[0]?.type.name] || "#f97316"
        }
      }
    }));
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
  expandedRegions.clear();
  filterPokemon();
  await renderDailyPokemon(basePokemon[getDailyIndex(basePokemon.length)]);
  dataStatus.textContent = `${getKoreanDateLabel()} 기준 기본 ${basePokemon.length}마리, 폼 포함 총 ${allPokemon.length}마리를 불러왔습니다.`;
}

searchInput.addEventListener("input", filterPokemon);
typeFilter.addEventListener("change", filterPokemon);
regionFilter.addEventListener("change", filterPokemon);
formFilter.addEventListener("change", async () => {
  if (formFilter.value !== "base" && !hasLoadedForms) {
    try {
      await ensureAllFormsLoaded();
    } catch (error) {
      console.error(error);
      dataStatus.textContent = "? ???? ???? ?????. ?? ??? ??????.";
      formFilter.value = "base";
    }
  }
  filterPokemon();
});
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

















