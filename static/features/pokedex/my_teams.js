const myTeamsConfig = window.myTeamsConfig || { isLoggedIn: false, endpoints: {} };

const draftStatus = document.getElementById("draftStatus");
const draftTeamsList = document.getElementById("draftTeamsList");
const savedTeamsList = document.getElementById("savedTeamsList");
const savedTeamItemTemplate = document.getElementById("savedTeamItemTemplate");
const draftTeamItemTemplate = document.getElementById("draftTeamItemTemplate");
const clearDraftButton = document.getElementById("clearDraftButton");
const draftTeamNameInput = document.getElementById("draftTeamNameInput");
const saveDraftTeamButton = document.getElementById("saveDraftTeamButton");

let currentDraftMembers = [];

function abilityLabel(member) {
  if (!member.ability?.name) {
    return "특성 없음";
  }
  return `${member.ability.name}${member.ability.isHidden ? " (숨특)" : ""}`;
}

function createInfoChip(label, value) {
  const chip = document.createElement("span");
  chip.className = "saved-member-chip";
  chip.textContent = `${label} · ${value}`;
  return chip;
}

function createMemberSummary(member) {
  const wrapper = document.createElement("div");
  wrapper.className = "saved-team-member-summary";

  const title = document.createElement("p");
  title.className = "saved-team-member-name";
  title.textContent = member.displayName;
  wrapper.appendChild(title);

  const chipRow = document.createElement("div");
  chipRow.className = "saved-team-members";
  chipRow.appendChild(createInfoChip("특성", abilityLabel(member)));
  if (Array.isArray(member.types)) {
    member.types.forEach((type) => {
      chipRow.appendChild(createInfoChip("타입", type));
    });
  }
  wrapper.appendChild(chipRow);

  return wrapper;
}

function getDraftTeamName() {
  const typedName = draftTeamNameInput?.value.trim();
  if (typedName) {
    return typedName;
  }
  if (!currentDraftMembers.length) {
    return "도감 후보 팀";
  }
  return `${currentDraftMembers[0].displayName} 중심 팀`;
}

function getTotalStat(member) {
  return Object.values(member.stats || {}).reduce((sum, value) => sum + Number(value || 0), 0);
}

async function loadDraftTeams() {
  try {
    const response = await fetch(myTeamsConfig.endpoints.draftList);
    if (!response.ok) {
      throw new Error("draft-fetch-failed");
    }
    const data = await response.json();
    currentDraftMembers = Array.isArray(data.team) ? data.team : [];
    renderDraftTeams(currentDraftMembers);
  } catch (error) {
    console.error(error);
    draftStatus.textContent = "팀 후보를 불러오지 못했습니다.";
    draftTeamsList.innerHTML = '<article class="saved-team-empty">팀 후보를 불러오지 못했습니다.</article>';
  }
}

function renderDraftTeams(draftMembers) {
  draftTeamsList.innerHTML = "";
  if (!draftMembers.length) {
    draftStatus.textContent = "아직 도감에서 담은 팀 후보가 없습니다.";
    draftTeamsList.innerHTML = '<article class="saved-team-empty">아직 팀 후보가 없습니다.</article>';
    return;
  }

  draftStatus.textContent = `현재 팀 후보 ${draftMembers.length}마리입니다. 각 포켓몬의 타입과 특성을 함께 확인할 수 있습니다.`;

  draftMembers.forEach((member) => {
    const fragment = draftTeamItemTemplate.content.cloneNode(true);
    fragment.querySelector(".saved-team-name").textContent = member.displayName;
    fragment.querySelector(".saved-team-meta").textContent = `${member.region || "지역 정보 없음"} · 종족값 합계 ${getTotalStat(member)}`;

    const members = fragment.querySelector(".saved-team-members");
    members.innerHTML = "";
    members.appendChild(createMemberSummary(member));

    draftTeamsList.appendChild(fragment);
  });
}

async function loadSavedTeams() {
  if (!myTeamsConfig.isLoggedIn || !savedTeamsList) {
    return;
  }

  try {
    const response = await fetch(myTeamsConfig.endpoints.list);
    if (!response.ok) {
      throw new Error("saved-fetch-failed");
    }
    const data = await response.json();
    const savedTeams = Array.isArray(data.teams) ? data.teams : [];
    renderSavedTeams(savedTeams);
  } catch (error) {
    console.error(error);
    savedTeamsList.innerHTML = '<article class="saved-team-empty">내 저장 팀을 불러오지 못했습니다.</article>';
  }
}

function renderSavedTeams(savedTeams) {
  savedTeamsList.innerHTML = "";
  if (!savedTeams.length) {
    savedTeamsList.innerHTML = '<article class="saved-team-empty">아직 저장한 팀이 없습니다.</article>';
    return;
  }

  savedTeams.forEach((team) => {
    const fragment = savedTeamItemTemplate.content.cloneNode(true);
    fragment.querySelector(".saved-team-style").textContent = team.style || "저장 팀";
    fragment.querySelector(".saved-team-name").textContent = team.team_name;
    fragment.querySelector(".saved-team-meta").textContent = `팀 멤버 ${team.members.length}마리`;

    const members = fragment.querySelector(".saved-team-members");
    members.innerHTML = "";
    team.members.forEach((member) => {
      members.appendChild(createMemberSummary(member));
    });

    fragment.querySelector(".delete-team-button").addEventListener("click", async () => {
      try {
        const response = await fetch(`${myTeamsConfig.endpoints.deleteBase}/${team.id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("saved-delete-failed");
        }
        await loadSavedTeams();
      } catch (error) {
        console.error(error);
      }
    });

    savedTeamsList.appendChild(fragment);
  });
}

async function saveDraftAsTeam() {
  if (!myTeamsConfig.isLoggedIn || !saveDraftTeamButton) {
    return;
  }
  if (currentDraftMembers.length !== 6) {
    draftStatus.textContent = "도감에서 담은 팀 후보가 6마리일 때만 저장할 수 있습니다.";
    return;
  }

  saveDraftTeamButton.disabled = true;
  const teamName = getDraftTeamName();

  try {
    const response = await fetch(myTeamsConfig.endpoints.create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_name: teamName,
        style: "draft",
        members: currentDraftMembers,
        summary: {
          title: "도감에서 담은 팀 후보",
          badges: ["직접 선택한 조합", "도감 후보 저장"],
          insights: ["도감에서 직접 선택한 6마리를 저장 팀으로 옮겼습니다."]
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "draft-save-failed");
    }

    draftStatus.textContent = `'${teamName}' 팀으로 저장했습니다.`;
    await loadSavedTeams();
  } catch (error) {
    console.error(error);
    draftStatus.textContent = "팀 후보를 저장 팀으로 옮기지 못했습니다.";
  } finally {
    saveDraftTeamButton.disabled = false;
  }
}

clearDraftButton?.addEventListener("click", async () => {
  try {
    const response = await fetch(myTeamsConfig.endpoints.draftClear, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("draft-clear-failed");
    }
    await loadDraftTeams();
  } catch (error) {
    console.error(error);
    draftStatus.textContent = "팀 후보를 비우지 못했습니다.";
  }
});

saveDraftTeamButton?.addEventListener("click", () => {
  saveDraftAsTeam();
});

loadDraftTeams();
loadSavedTeams();
