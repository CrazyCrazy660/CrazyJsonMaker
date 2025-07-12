// — DATA & SETUP
let items = [
  /* your full items array here, with some entries having category: "unreleased" */
];
items.sort((a, b) => a.name.localeCompare(b.name));

const bodyParts = ["leftHand", "rightHand", "leftHip", "rightHip", "back"];
let currentSlot = "leftHand";
const slotData = {};
const adminPassword = "CrazyJson";

// — UI References
const positionsBar = document.getElementById("positionsBar");
const itemSearch = document.getElementById("itemSearch");
const categoriesBar = document.getElementById("categories");
const itemGrid = document.getElementById("itemGrid");
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
const themeToggleBtn = document.getElementById("themeToggleBtn");

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

// — INITIAL STATE: hide unreleased category tab
if (catUnreleasedBtn) catUnreleasedBtn.style.display = "none";

// — HELPERS
function updateOutputJSON() {
  const res = { version: 1 };
  bodyParts.forEach(slot => {
    if (slotData[slot]?.itemID) res[slot] = slotData[slot];
  });
  outputEl.textContent = JSON.stringify(res, null, 2);
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

// — RENDER ITEM GRID
function renderItemGrid(filter = "", category = "all") {
  itemGrid.innerHTML = "";
  items.filter(it => {
    return (category === "all" || it.category === category) &&
           it.name.toLowerCase().includes(filter.toLowerCase());
  }).forEach(it => {
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

// — EVENT WIRING

// Category filter
categoriesBar.querySelectorAll(".cat-btn").forEach(b => {
  b.onclick = () => {
    categoriesBar.querySelectorAll(".cat-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderItemGrid(itemSearch.value, b.dataset.cat);
  };
});

// Search
itemSearch.oninput = () => {
  const activeCat = categoriesBar.querySelector(".cat-btn.active").dataset.cat;
  renderItemGrid(itemSearch.value, activeCat);
};

// Slot selection
positionsBar.querySelectorAll(".pos-btn").forEach(b => {
  b.onclick = () => {
    positionsBar.querySelectorAll(".pos-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    currentSlot = b.dataset.slot;
    loadSlotData(currentSlot);
  };
});

// Randomize
randomizeSelected.onclick = () => {
  hueSlider.value = Math.floor(Math.random() * 211);
  satSlider.value = Math.floor(Math.random() * 121);
  scaleSlider.value = Math.floor(Math.random() * 256) - 128;
  hueSlider.dispatchEvent(new Event("input"));
  satSlider.dispatchEvent(new Event("input"));
  scaleSlider.dispatchEvent(new Event("input"));
};

// Swatch presets
swatchList.querySelectorAll(".swatch").forEach(btn => {
  btn.onclick = () => {
    hueSlider.value = btn.dataset.hue;
    satSlider.value = btn.dataset.sat;
    hueSlider.dispatchEvent(new Event("input"));
    satSlider.dispatchEvent(new Event("input"));
  };
});

// Slider value updates
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

// Theme toggle
themeToggleBtn.onclick = () => document.body.classList.toggle("light-mode");

// — ADMIN PANEL BEHAVIOR

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

adminOverrideBtn.onclick = () => {
  if (!slotData[currentSlot]?.itemID) return alert("Assign an item first.");
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
  alert("Override applied for this slot!");
};

overrideHue.oninput = () => overrideHueVal.textContent = overrideHue.value;
overrideSat.oninput = () => overrideSatVal.textContent = overrideSat.value;
overrideScale.oninput = () => overrideScaleVal.textContent = overrideScale.value;

addNewItemBtn.onclick = () => {
  const name = newItemName.value.trim();
  const id = newItemID.value.trim();
  const cat = newItemCategory.value;
  if (!name || !id) return alert("Fill fields");
  if (items.some(x => x.id === id)) return alert("Duplicate ID");
  items.push({ name, id, category: cat });
  items.sort((a, b) => a.name.localeCompare(b.name));
  renderItemGrid(itemSearch.value, categoriesBar.querySelector(".cat-btn.active").dataset.cat);
  alert(`Added item: ${name}`);
  newItemName.value = "";
  newItemID.value = "";
};

// Feature Locks
lockPresets.onchange = () => randomizeSelected.disabled = lockPresets.checked;
lockDownloadBtn.onchange = () => outputEl.style.display = lockDownloadBtn.checked ? "none" : "block";

// — INITIALIZE
renderItemGrid("", "all");
loadSlotData(currentSlot);
updateOutputJSON();