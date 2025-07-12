// ---------------- ITEMS ----------------
const items = [
  { name: "Anti Gravity Grenade", id: "item_anti_gravity_grenade", category: "explosives" },
  { name: "Arrow", id: "item_arrow", category: "weapons" },
  { name: "Backpack", id: "item_backpack", category: "backpacks" },
  { name: "Baseball Bat", id: "item_baseball_bat", category: "weapons" },
  { name: "Balloon", id: "item_balloon", category: "misc" },
  { name: "Banana", id: "item_banana", category: "food" },
  { name: "Big Mob Loot Box", id: "item_randombox_mobloot_big", category: "misc" },
  { name: "Bone Shield", id: "item_shield_bones", category: "weapons" },
  { name: "CEO Plaque", id: "item_ceo_plaque", category: "misc" },
  { name: "Cola", id: "item_cola", category: "food" },
  { name: "Company Ration", id: "item_company_ration", category: "food" },
  { name: "Crossbow", id: "item_crossbow", category: "weapons" },
  { name: "Dynamite", id: "item_dynamite", category: "explosives" },
  { name: "Egg RPG Ammo", id: "item_rpg_ammo_egg", category: "ammo" },
  { name: "Gameboy", id: "item_gameboy", category: "misc" },
  { name: "Golden Coin", id: "item_goldcoin", category: "misc" },
  { name: "Grenade", id: "item_grenade", category: "explosives" },
  { name: "Heart Gun", id: "item_heart_gun", category: "weapons" },
  { name: "Landmine", id: "item_landmine", category: "explosives" },
  { name: "Large Basketball Backpack", id: "item_backpack_large_basketball", category: "backpacks" },
  { name: "Pokémon Card", id: "item_rare_card", category: "misc" },
  { name: "Revolver Ammo", id: "item_revolver_ammo", category: "ammo" },
  { name: "Shotgun Ammo", id: "item_shotgun_ammo", category: "ammo" },
  { name: "Spear RPG Ammo", id: "item_rpg_ammo_spear", category: "ammo" },
  { name: "Turkey", id: "item_turkey_whole", category: "food" }
];
items.sort((a, b) => a.name.localeCompare(b.name));

// -------------- STATE & UI REFS --------------
const bodyParts = ["leftHand","rightHand","leftHip","rightHip","back"];
let currentSlot = bodyParts[0];
const slotData = {};
const adminPassword = "CrazyJson";

const positionsBar = document.getElementById("positionsBar");
const categoriesBar = document.getElementById("categories");
const itemGrid = document.getElementById("itemGrid");
const itemSearch = document.getElementById("itemSearch");
const selectedItemName = document.getElementById("selectedItemName");
const randomizeSelected = document.getElementById("randomizeSelected");
const swatchList = document.getElementById("swatchList");
const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const scaleSlider = document.getElementById("scaleSlider");
const hueVal = document.getElementById("hueVal");
const satVal = document.getElementById("satVal");
const scaleVal = document.getElementById("scaleVal");
const stateInput = document.getElementById("stateInput");
const countInput = document.getElementById("countInput");
const outputEl = document.getElementById("output");
const addChildBtn = document.getElementById("addChildBtn");
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const overrideHue = document.getElementById("overrideHue");
const overrideSat = document.getElementById("overrideSaturation");
const overrideScale = document.getElementById("overrideScale");
const overrideHueVal = document.getElementById("hueMaxVal");
const overrideSatVal = document.getElementById("satMaxVal");
const overrideScaleVal = document.getElementById("scaleMaxVal");
const adminOverrideBtn = document.getElementById("adminOverrideBtn");
const newItemName = document.getElementById("newItemName");
const newItemID = document.getElementById("newItemID");
const newItemCategory = document.getElementById("newItemCategory");
const addNewItemBtn = document.getElementById("addNewItemBtn");
const lockPresets = document.getElementById("lockPresets");
const lockDownloadBtn = document.getElementById("lockDownloadBtn");
const catUnreleasedBtn = document.getElementById("catUnreleased");
if (catUnreleasedBtn) catUnreleasedBtn.style.display = "none";

// -------------- UTILS --------------
function updateOutputJSON() {
  const result = { version: 1 };
  bodyParts.forEach(s => {
    const d = slotData[s];
    if (d?.itemID) result[s] = d;
    if (d?.children) result[s].children = d.children;
  });
  outputEl.textContent = JSON.stringify(result, null, 2);
}

function saveSlotToData() {
  slotData[currentSlot] = slotData[currentSlot] || {};
  Object.assign(slotData[currentSlot], {
    itemID: slotData[currentSlot].itemID || "",
    colorHue: +hueSlider.value,
    colorSaturation: +satSlider.value,
    scale: +scaleSlider.value,
    state: +stateInput.value,
    count: +countInput.value
  });
  updateOutputJSON();
}

function loadSlotData(slot) {
  const d = slotData[slot] || {};
  selectedItemName.textContent = d.itemID || "No item selected";
  hueSlider.value = d.colorHue ?? 0;
  satSlider.value = d.colorSaturation ?? 0;
  scaleSlider.value = d.scale ?? 0;
  hueVal.textContent = hueSlider.value;
  satVal.textContent = satSlider.value;
  scaleVal.textContent = scaleSlider.value;
  stateInput.value = d.state ?? 0;
  countInput.value = d.count ?? 1;
}

function renderItemGrid(filterText = "", cat = "all") {
  itemGrid.innerHTML = "";
  items.filter(it =>
    (cat === "all" || it.category === cat) &&
    it.name.toLowerCase().includes(filterText.toLowerCase())
  ).forEach(it => {
    const btn = document.createElement("button");
    btn.textContent = it.name;
    btn.onclick = () => {
      slotData[currentSlot] = slotData[currentSlot] || {};
      slotData[currentSlot].itemID = it.id;
      loadSlotData(currentSlot);
      saveSlotToData();
    };
    itemGrid.append(btn);
  });
}

// -------------- EVENTS --------------
positionsBar.querySelectorAll(".pos-btn").forEach(b => {
  b.onclick = () => {
    positionsBar.querySelectorAll(".pos-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    currentSlot = b.dataset.slot;
    loadSlotData(currentSlot);
  };
});
categoriesBar.querySelectorAll(".cat-btn").forEach(b => {
  b.onclick = () => {
    categoriesBar.querySelectorAll(".cat-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderItemGrid(itemSearch.value, b.dataset.cat);
  };
});
itemSearch.oninput = () => {
  const cat = categoriesBar.querySelector(".cat-btn.active")?.dataset.cat || "all";
  renderItemGrid(itemSearch.value, cat);
};
randomizeSelected.onclick = () => {
  hueSlider.value = Math.floor(Math.random() * 211);
  satSlider.value = Math.floor(Math.random() * 121);
  scaleSlider.value = Math.floor(Math.random() * 256) - 128;
  hueSlider.dispatchEvent(new Event("input"));
  satSlider.dispatchEvent(new Event("input"));
  scaleSlider.dispatchEvent(new Event("input"));
  saveSlotToData();
};
[hueSlider, satSlider, scaleSlider].forEach(sl => {
  sl.oninput = () => {
    hueVal.textContent = hueSlider.value;
    satVal.textContent = satSlider.value;
    scaleVal.textContent = scaleSlider.value;
  };
  sl.onchange = saveSlotToData;
});
stateInput.onchange = saveSlotToData;
countInput.onchange = saveSlotToData;

// -------------- ADD CHILD BUTTON LOGIC --------------
addChildBtn.onclick = () => {
  const d = slotData[currentSlot];
  if (!d?.itemID) {
    return alert("Select a slot and assign a main item first.");
  }
  d.children = d.children || [];
  d.children.push({
    itemID: "",
    colorHue: 0,
    colorSaturation: 0,
    scale: 0
  });
  updateOutputJSON();
  alert("Child added. Edit it directly in the JSON output or extend UI later.");
};

// -------------- THEME DROPDOWN w/persistence --------------
const themeSelect = document.createElement('select');
themeSelect.id = 'themeDropdown';
["default","light","animalcompany"].forEach(val => {
  const opt = document.createElement("option");
  opt.value = val;
  opt.textContent = val.charAt(0).toUpperCase() + val.slice(1);
  themeSelect.appendChild(opt);
});
themeSelect.onchange = () => {
  document.body.classList.remove("light-mode", "theme-animalcompany");
  if (themeSelect.value === "light") document.body.classList.add("light-mode");
  if (themeSelect.value === "animalcompany") document.body.classList.add("theme-animalcompany");
  localStorage.setItem("selectedTheme", themeSelect.value);
};
document.body.appendChild(themeSelect);
const saved = localStorage.getItem("selectedTheme");
if (saved) {
  themeSelect.value = saved;
  themeSelect.dispatchEvent(new Event("change"));
}

// -------------- PRESET SWATCHES --------------
swatchList.querySelectorAll(".swatch").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".swatch").forEach(b => b.classList.remove('active-swatch'));
    btn.classList.add('active-swatch');
    hueSlider.value = btn.dataset.hue;
    satSlider.value = btn.dataset.sat;
    hueSlider.dispatchEvent(new Event('input'));
    satSlider.dispatchEvent(new Event('input'));
    saveSlotToData();
  };
});
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .swatch.active-swatch {
    outline: 3px solid yellow;
    transform: scale(1.1);
  }
`;
document.head.append(styleTag);

// -------------- RANDOM ITEM BUTTON --------------
document.getElementById("randomItemsBtn")?.addEventListener("click", () => {
  const btns = Array.from(document.querySelectorAll(".item-grid button"));
  if (!btns.length) return;
  const choice = btns[Math.floor(Math.random() * btns.length)];
  choice.click();
  choice.focus();
});

// -------------- ADMIN PANEL --------------
adminBtn.onclick = () => {
  const p = prompt("Enter admin password:");
  if (p === adminPassword) {
    adminPanel.style.display = "block";
    if (catUnreleasedBtn) catUnreleasedBtn.style.display = "inline-block";
    alert("Admin access granted!");
  } else {
    alert("Incorrect password.");
  }
};
overrideHue.oninput = () => overrideHueVal.textContent = overrideHue.value;
overrideSat.oninput = () => overrideSatVal.textContent = overrideSat.value;
overrideScale.oninput = () => overrideScaleVal.textContent = overrideScale.value;
adminOverrideBtn.onclick = () => {
  const d = slotData[currentSlot];
  if (!d?.itemID) return alert("Assign an item first.");
  hueSlider.max = +overrideHue.value;
  satSlider.max = +overrideSat.value;
  scaleSlider.max = +overrideScale.value;
  hueSlider.value = hueSlider.max;
  satSlider.value = satSlider.max;
  scaleSlider.value = scaleSlider.max;
  hueSlider.dispatchEvent(new Event("input"));
  satSlider.dispatchEvent(new Event("input"));
  scaleSlider.dispatchEvent(new Event("input"));
  saveSlotToData();
  alert("Override applied!");
};

addNewItemBtn.onclick = () => {
  const name = newItemName.value.trim();
  const id = newItemID.value.trim();
  const cat = newItemCategory.value;
  if (!name || !id) return alert("Fill both name & ID.");
  if (items.some(x => x.id === id)) return alert("Duplicate ID.");
  items.push({ name, id, category: cat });
  items.sort((a,b) => a.name.localeCompare(b.name));
  renderItemGrid(itemSearch.value, categoriesBar.querySelector(".cat-btn.active")?.dataset.cat || "all");
  alert(`Added: ${name}`);
  newItemName.value = "";
  newItemID.value = "";
};

lockPresets.onchange = () => randomizeSelected.disabled = lockPresets.checked;
lockDownloadBtn.onchange = () => outputEl.style.display = lockDownloadBtn.checked ? "none" : "block";

// -------------- INIT --------------
renderItemGrid("", "all");
loadSlotData(currentSlot);
updateOutputJSON();