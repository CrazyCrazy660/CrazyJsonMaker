// -------- ITEMS & STATE --------
const items = [
  { name: "Apple", id: "item_apple", category: "misc" },
  { name: "Banana", id: "item_banana", category: "food" },
  { name: "Anti Gravity Grenade", id: "item_anti_gravity_grenade", category: "explosives" },
  // ... add your full items list
];
items.sort((a, b) => a.name.localeCompare(b.name));

const bodyParts = ["leftHand","rightHand","leftHip","rightHip","back"];
let currentSlot = bodyParts[0];
const slotData = {};
const adminPassword = "CrazyJson";

// -------- UI Element Refs --------
const positionsBar = document.getElementById("positionsBar");
const itemSearch = document.getElementById("itemSearch");
const categoriesBar = document.getElementById("categories");
const itemGrid = document.getElementById("itemGrid");
const swatchList = document.getElementById("swatchList");
const hueSlider = document.getElementById("hueSlider");
const satSlider = document.getElementById("satSlider");
const scaleSlider = document.getElementById("scaleSlider");
const hueVal = document.getElementById("hueVal");
const satVal = document.getElementById("satVal");
const scaleVal = document.getElementById("scaleVal");
const selectedItemName = document.getElementById("selectedItemName");
const stateInput = document.getElementById("stateInput");
const countInput = document.getElementById("countInput");
const outputEl = document.getElementById("output");
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

// -------- INITIAL SETUP --------
adminPanel.style.display = "none";
if (catUnreleasedBtn) catUnreleasedBtn.style.display = "none";
document.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
document.querySelector(`.pos-btn[data-slot="${currentSlot}"]`)?.classList.add("active");

// -------- BUILD BLOCK & CHILD SUPPORT --------
function makeSlider(label, min, max, def = 0, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";
  const labelElem = document.createElement("label");
  const spanVal = document.createElement("span"); spanVal.textContent = def;
  labelElem.textContent = label + ": ";
  labelElem.appendChild(spanVal);

  const input = document.createElement("input");
  input.type = "range"; input.min = min; input.max = max; input.value = def;
  input.oninput = () => { spanVal.textContent = input.value; onChange(); };

  const randBtn = document.createElement("button");
  randBtn.textContent = "🎲";
  randBtn.onclick = () => {
    input.value = Math.floor(Math.random() * (max - min + 1)) + parseInt(min);
    input.dispatchEvent(new Event("input"));
  };

  wrapper.append(labelElem, input, randBtn);
  return { wrapper, input };
}

function createItemBlock(data) {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const select = document.createElement("select");
  select.innerHTML = `<option value="">-- None --</option>`;
  items.forEach(it => {
    const opt = document.createElement("option");
    opt.value = it.id; opt.textContent = it.name;
    select.appendChild(opt);
  });

  const slidersRow = document.createElement("div"); slidersRow.className = "input-row";
  const hue = makeSlider("Hue", 0, 240, data?.colorHue || 0, updateRoot);
  const sat = makeSlider("Saturation", -120, 200, data?.colorSaturation || 0, updateRoot);
  const scale = makeSlider("Scale", -128, 127, data?.scale || 0, updateRoot);
  slidersRow.append(hue.wrapper, sat.wrapper, scale.wrapper);

  const childrenContainer = document.createElement("div");
  childrenContainer.className = "children";

  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "Add Child";
  addChildBtn.onclick = () => {
    const childBlock = createItemBlock();
    childrenContainer.appendChild(childBlock);
    updateRoot();
  };

  wrapper.append(select, slidersRow, addChildBtn, childrenContainer);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    const obj = {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
    const kids = Array.from(childrenContainer.children)
      .map(c => c.toJSON())
      .filter(Boolean);
    if (kids.length) obj.children = kids;
    return obj;
  };

  if (data) {
    select.value = data.itemID;
    hue.input.value = data.colorHue;
    sat.input.value = data.colorSaturation;
    scale.input.value = data.scale;
    (data.children || []).forEach(cd => {
      const cb = createItemBlock(cd);
      childrenContainer.appendChild(cb);
    });
  }

  select.onchange = updateRoot;
  return wrapper;
}

function renderSlotUI() {
  bodyParts.forEach(b => {
    const slotDiv = document.querySelector(`[data-slot="${b}"]`);
    slotDiv && slotDiv.querySelectorAll(".item-block").forEach(el => el.remove());
  });

  const slotDiv = document.querySelector(`[data-slot="${currentSlot}"]`);
  const block = createItemBlock(slotData[currentSlot]?.root);
  slotDiv.append(block);
}

function updateRoot() {
  const slotDiv = document.querySelector(`[data-slot="${currentSlot}"] .item-block`);
  if (!slotDiv) return;
  const js = slotDiv.toJSON();
  slotData[currentSlot] = { root: js };
  updateOutput();
}

function updateOutput() {
  const result = { version: 1 };
  bodyParts.forEach(s => {
    if (slotData[s]?.root) {
      result[s] = slotData[s].root;
    }
  });
  outputEl.textContent = JSON.stringify(result, null, 2);
}

// -------- MAIN UI Logic --------
// Slot buttons
positionsBar.querySelectorAll(".pos-btn").forEach(b => {
  b.onclick = () => {
    positionsBar.querySelectorAll(".pos-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    currentSlot = b.dataset.slot;
    if (!slotData[currentSlot]) slotData[currentSlot] = { root: null };
    renderSlotUI();
  };
});

// Item grid & search
function renderItemGrid(filter = "", cat = "all") {
  itemGrid.innerHTML = "";
  items.filter(it => (cat === "all" || it.category === cat)
    && it.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(it => {
      const btn = document.createElement("button");
      btn.textContent = it.name;
      btn.onclick = () => {
        if (!slotData[currentSlot]) slotData[currentSlot] = { root: null };
        const root = { itemID: it.id, colorHue: 0, colorSaturation: 0, scale: 0 };
        slotData[currentSlot].root = root;
        renderSlotUI();
        updateOutput();
      };
      itemGrid.appendChild(btn);
    });
}

itemSearch.oninput = () => {
  const activeCat = categoriesBar.querySelector(".cat-btn.active")?.dataset.cat || "all";
  renderItemGrid(itemSearch.value, activeCat);
};

categoriesBar.querySelectorAll(".cat-btn").forEach(b => {
  b.onclick = () => {
    categoriesBar.querySelectorAll(".cat-btn").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    renderItemGrid(itemSearch.value, b.dataset.cat);
  };
});

// Theme dropdown
const themeSelect = document.createElement("select");
["default", "light", "animalcompany"].forEach(val => {
  const o = document.createElement("option");
  o.value = val; o.textContent = val.charAt(0).toUpperCase() + val.slice(1);
  themeSelect.appendChild(o);
});
themeSelect.id = "themeDropdown";
themeSelect.onchange = () => {
  document.body.classList.remove("light-mode","theme-animalcompany");
  if (themeSelect.value === "light") document.body.classList.add("light-mode");
  if (themeSelect.value === "animalcompany") document.body.classList.add("theme-animalcompany");
  localStorage.setItem("selectedTheme", themeSelect.value);
};
document.body.appendChild(themeSelect);
const saved = localStorage.getItem("selectedTheme");
if (saved) {
  themeSelect.value = saved;
  themeSelect.dispatchEvent(new Event('change'));
}

// Swatch presets
swatchList.querySelectorAll(".swatch").forEach(btn => {
  btn.onclick = () => {
    swatchList.querySelectorAll(".swatch").forEach(b => b.classList.remove("active-swatch"));
    btn.classList.add("active-swatch");
    hueSlider.value = btn.dataset.hue;
    satSlider.value = btn.dataset.sat;
    hueVal.textContent = hueSlider.value;
    satVal.textContent = satSlider.value;
    updateRoot();
  };
});
const styleTag = document.createElement("style");
styleTag.textContent = '.swatch.active-swatch { outline: 3px solid yellow; transform: scale(1.1); }';
document.head.appendChild(styleTag);

// Random items
document.getElementById("randomItemsBtn")?.onclick = () => {
  const btns = Array.from(itemGrid.querySelectorAll("button"));
  if (!btns.length) return;
  const choice = btns[Math.floor(Math.random() * btns.length)];
  choice.click();
};

// Admin logic
adminBtn.onclick = () => {
  const p = prompt("Enter admin password:");
  if (p === adminPassword) {
    adminPanel.style.display = "block";
    if (catUnreleasedBtn) catUnreleasedBtn.style.display = "inline-block";
    alert("Admin access granted!");
  } else alert("Incorrect password");
};

// Override sliders
overrideHue.oninput = () => overrideHueVal.textContent = overrideHue.value;
overrideSat.oninput = () => overrideSatVal.textContent = overrideSat.value;
overrideScale.oninput = () => overrideScaleVal.textContent = overrideScale.value;

adminOverrideBtn.onclick = () => {
  if (!slotData[currentSlot]?.root) return alert("No item to override");
  hueSlider.max = +overrideHue.value;
  satSlider.max = +overrideSat.value;
  scaleSlider.max = +overrideScale.value;
  hueSlider.value = hueSlider.max;
  satSlider.value = satSlider.max;
  scaleSlider.value = scaleSlider.max;
  hueVal.textContent = hueSlider.value;
  satVal.textContent = satSlider.value;
  scaleVal.textContent = scaleSlider.value;
  updateRoot();
  alert("Override applied");
};

// Feature locks
lockPresets?.addEventListener('change', () => {
  // assume random button id exists
});
lockDownloadBtn?.addEventListener('change', () => {
  outputEl.style.display = lockDownloadBtn.checked ? "none" : "block";
});

// -------- INITIAL RENDER --------
renderItemGrid();
renderSlotUI();
updateOutput();