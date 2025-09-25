// varlamore prayer calculator

document.addEventListener("DOMContentLoaded", async () => {
  const shard = { name: "Blessed Bone Shards", prayerXp: 6 };
  const bones = await fetchJson("bones.json");
  const levelXp = await fetchJson("levelXp.json");

  const elements = {
    boneSelect: document.getElementById("bone-select"),
    calculateBtn: document.getElementById("calculate-btn"),
    boneAmountInput: document.getElementById("bone-amount"),
    blessedWineCheckbox: document.getElementById("blessed-wine"),
    currentXpInput: document.getElementById("current-xp"),
    targetLevelInput: document.getElementById("target-level"),
    resultsDiv: document.getElementById("results"),
  };

  populateBoneSelect(elements.boneSelect, bones);

  elements.blessedWineCheckbox.addEventListener("change", () => {
    shard.prayerXp = elements.blessedWineCheckbox.checked ? 6 : 5;
  });

  elements.calculateBtn.addEventListener("click", () => {
    const currentXp = parseInt(elements.currentXpInput.value, 10) || 0;
    const targetLevel = parseInt(elements.targetLevelInput.value, 10) || 1;
    const targetXp = levelXp[targetLevel - 1] || 0;
    const xpRemaining = Math.max(targetXp - currentXp, 0);

    const results = bones.map((bone) => {
      const boneXp = bone.shards * shard.prayerXp;
      const bonesRequired = boneXp > 0 ? Math.ceil(xpRemaining / boneXp) : 0;
      const totalShards = bonesRequired * bone.shards;
      return {
        name: bone.name,
        bonesRequired,
        totalShards,
        totalXp: bonesRequired * boneXp,
      };
    });

    elements.resultsDiv.innerHTML = buildResultsTable(results);
  });
});

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  return response.json();
}

function populateBoneSelect(selectElement, bones) {
  selectElement.innerHTML = bones
    .map(
      (bone) =>
        `<option value="${bone.name}">${bone.name}</option>`
    )
    .join("");
}

function buildResultsTable(results) {
  return `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Bone Name</th>
          <th>Bones Required</th>
          <th>Total Shards</th>
          <th>Total XP</th>
        </tr>
      </thead>
      <tbody>
        ${results
          .map(
            (result) => `
          <tr>
            <td>${result.name}</td>
            <td>${result.bonesRequired}</td>
            <td>${result.totalShards}</td>
            <td>${result.totalXp}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
