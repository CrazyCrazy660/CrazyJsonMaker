// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Loadout / Stash toggle
  document.querySelectorAll("input[name='modeToggle']").forEach(radio =>
    radio.addEventListener("change", updateOutputJSON)
  );

  // Button handlers
  document.getElementById("presetDropdown").addEventListener("change", e => {
    if (e.target.value === "galaxy") applyGalaxyPreset();
    else if (e.target.value === "clear") clearBuilder();
    e.target.value = ""; // reset dropdown
  });
  document.getElementById("downloadBtn").addEventListener("click", downloadJSON);
  document.getElementById("filenameInput").addEventListener("input", updateOutputJSON);

  // Theme control
  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener("change", e => applyTheme(e.target.value));
  const savedTheme = localStorage.getItem("theme") || "dark";
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  // Build slots
  bodyParts.forEach(createSlot);
  updateOutputJSON();
});

const bodyParts = ["leftHand", "rightHand", "leftHip", "rightHip", "back"];
let currentMode = "loadout";

const items = [
  { name: "Banana", id: "item_banana" },
  { name: "Backpack", id: "item_backpack" },
  { name: "Grenade", id: "item_grenade" },
  { name: "RPG Ammo", id: "item_rpg_ammo" },
  { name: "Gold Coin", id: "item_goldcoin" },
  { name: "Camera", id: "item_disposable_camera" }
];

function createSlot(slot) {
  const container = document.getElementById("builder");
  const div = document.createElement("div");
  div.dataset.slot = slot;

  const h2 = document.createElement("h2");
  h2.textContent = slot;
  div.appendChild(h2);

  const block = createItemBlock();
  div.appendChild(block);
  container.appendChild(div);
}

function createItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const select = document.createElement("select");
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "-- Select Item --";
  select.appendChild(none);

  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name;
    select.appendChild(opt);
  });

  const hue = makeSlider("Hue", 0, 240, 0);
  const sat = makeSlider("Saturation", -120, 200, 0);
  const scale = makeSlider("Scale", -128, 127, 0);
  const state = makeNumberInput("State", 0);
  const count = makeNumberInput("Count", 1);

  [select, hue.input, sat.input, scale.input, state.input, count.input]
    .forEach(el => el.addEventListener("input", updateOutputJSON));

  wrapper.append(select, hue.wrapper, sat.wrapper, scale.wrapper, state.wrapper, count.wrapper);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    return {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
  };

  wrapper.toStash = () => {
    if (!select.value) return null;
    return {
      itemID: select.value,
      state: +state.input.value,
      count: +count.input.value
    };
  };

  return wrapper;
}

function makeSlider(label, min, max, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const labelEl = document.createElement("label");
  labelEl.textContent = `${label}: `;
  const span = document.createElement("span");
  span.textContent = defaultVal;
  labelEl.append(span);

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = defaultVal;

  input.oninput = () => {
    span.textContent = input.value;
    updateOutputJSON();
  };

  wrapper.append(labelEl, input);
  return { wrapper, input };
}

function makeNumberInput(label, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const labelEl = document.createElement("label");
  labelEl.textContent = `${label}: `;
  const input = document.createElement("input");
  input.type = "number";
  input.value = defaultVal;
  labelEl.append(input);

  input.addEventListener("input", updateOutputJSON);
  wrapper.append(labelEl);
  return { wrapper, input };
}

function collectData() {
  if (currentMode === "loadout") {
    const result = { version: 1 };
    bodyParts.forEach(slot => {
      const block = document.querySelector(`[data-slot="${slot}"] .item-block`);
      const data = block?.toJSON?.();
      result[slot] = data || {};
    });
    return result;
  } else {
    const result = { itemList: [] };
    bodyParts.forEach(slot => {
      const block = document.querySelector(`[data-slot="${slot}"] .item-block`);
      const data = block?.toStash?.();
      if (data) result.itemList.push(data);
    });
    return result;
  }
}

function updateOutputJSON() {
  currentMode = document.querySelector("input[name='modeToggle']:checked").value;
  const json = collectData();
  document.getElementById("output").textContent = JSON.stringify(json, null, 2);
  localStorage.setItem("animalCompanyJson", document.getElementById("output").textContent);
}

function downloadJSON() {
  const data = document.getElementById("output").textContent;
  const filename = (document.getElementById("filenameInput").value || "output") + ".json";
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function clearBuilder() {
  if (!confirm("Clear all slots?")) return;
  document.getElementById("builder").innerHTML = "";
  bodyParts.forEach(createSlot);
  updateOutputJSON();
}

function applyGalaxyPreset() {
  // Example: set random values
  document.querySelectorAll(".item-block").forEach(block => {
    const sliders = block.querySelectorAll("input[type=range]");
    sliders.forEach(s => {
      const val = Math.floor(Math.random() * (s.max - s.min)) + +s.min;
      s.value = val;
      s.dispatchEvent(new Event("input"));
    });
  });
}

function applyTheme(theme) {
  document.body.classList.remove("light", "dark", "animal");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}