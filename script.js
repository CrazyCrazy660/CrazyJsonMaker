const items = [
  { name: "Apple", id: "item_apple" },
  { name: "Backpack", id: "item_backpack" },
  { name: "CEO Plaque", id: "item_ceo_plaque" },
  { name: "D29", id: "item_d29" },
  { name: "Finger Board", id: "item_finger_board" },
  { name: "Gameboy", id: "item_gameboy" },
  { name: "Golden Coin", id: "item_goldcoin" },
  { name: "Golden Grenade", id: "item_grenade_gold" },
  { name: "Heart Gun", id: "item_heart_gun" },
  { name: "Landmine", id: "item_landmine" },
  { name: "Large Backpack", id: "item_backpack_large_base" },
  { name: "Pokémon Card", id: "item_rare_card" },
  { name: "Small Backpack", id: "item_backpack_small_base" },
  { name: "Teleport Gun", id: "item_teleport_gun" }
].sort((a, b) => a.name.localeCompare(b.name));

const bodyParts = ["leftHand", "rightHand", "leftHip", "rightHip", "back"];
const builder = document.getElementById("builder");
const output = document.getElementById("output");
const presetSelect = document.getElementById("presetSelect");
let selectedBlock = null;
let autoRandomize = false;
let isAdmin = false;
let lockedFeatures = {
  presets: false,
};

function updateOutputJSON() {
  const result = { version: 1 };
  document.querySelectorAll("[data-slot]").forEach(section => {
    const block = section.querySelector(".item-block");
    if (block) {
      result[section.dataset.slot] = block.toJSON() || {};
    }
  });
  output.textContent = JSON.stringify(result, null, 2);
  localStorage.setItem("animalCompanyJson", output.textContent);
}

function makeSlider(label, min, max, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = defaultVal;

  const labelElem = document.createElement("label");
  labelElem.textContent = label + ": ";
  const valueSpan = document.createElement("span");
  valueSpan.textContent = input.value;
  labelElem.appendChild(valueSpan);

  const btn = document.createElement("button");
  btn.textContent = "🎲";
  btn.onclick = () => {
    const val = (label === "Scale")
      ? Math.floor(Math.random() * 256) - 128
      : (label === "Saturation")
        ? Math.floor(Math.random() * 321) - 120
        : Math.floor(Math.random() * 241);
    input.value = val;
    input.dispatchEvent(new Event("input"));
  };

  input.oninput = () => {
    valueSpan.textContent = input.value;
    updateOutputJSON();
  };

  wrapper.append(labelElem, input, btn);
  return { input, wrapper };
}

function applyRandomization(inputs) {
  if (!inputs || inputs.length < 3) return;
  inputs[0].value = Math.floor(Math.random() * 241); // hue
  inputs[1].value = Math.floor(Math.random() * 321) - 120; // sat
  inputs[2].value = Math.floor(Math.random() * 256) - 128; // scale
  inputs.forEach(i => i.dispatchEvent(new Event("input")));
}

function originalCreateItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const select = document.createElement("select");
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "-- None --";
  select.appendChild(empty);
  items.forEach(({ name, id }) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    select.appendChild(opt);
  });

  const row = document.createElement("div");
  row.className = "input-row";

  const hue = makeSlider("Hue", 0, 240, 0);
  const sat = makeSlider("Saturation", -120, 200, 0);
  const scale = makeSlider("Scale", -128, 127, 0);
  row.append(hue.wrapper, sat.wrapper, scale.wrapper);

  const children = document.createElement("div");
  children.className = "children";

  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "Add Child";
  addChildBtn.onclick = () => {
    const child = createItemBlock();
    children.appendChild(child);
    updateOutputJSON();
  };

  wrapper.append(select, row, addChildBtn, children);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    const json = {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
    const kids = Array.from(children.children)
      .map(c => c.toJSON())
      .filter(Boolean);
    if (kids.length) json.children = kids;
    return json;
  };

  wrapper.onclick = e => {
    e.stopPropagation();
    if (selectedBlock) selectedBlock.style.outline = "";
    selectedBlock = wrapper;
    wrapper.style.outline = "2px solid red";
  };

  return wrapper;
}

function createItemBlock() {
  const block = originalCreateItemBlock();
  if (autoRandomize) {
    const sliders = block.querySelectorAll("input[type=range]");
    applyRandomization(sliders);
  }
  return block;
}

function createSlot(slot) {
  const container = document.createElement("div");
  container.dataset.slot = slot;

  const title = document.createElement("h2");
  title.textContent = slot;
  container.appendChild(title);

  const block = createItemBlock();
  container.appendChild(block);
  builder.appendChild(container);
}

function loadInitialJSON() {
  const saved = localStorage.getItem("animalCompanyJson");
  if (saved) {
    try {
      const json = JSON.parse(saved);
      builder.innerHTML = "";
      bodyParts.forEach(slot => {
        const container = document.createElement("div");
        container.dataset.slot = slot;

        const title = document.createElement("h2");
        title.textContent = slot;
        container.appendChild(title);

        const block = createItemBlock();
        if (json[slot]) {
          const item = json[slot];
          const select = block.querySelector("select");
          select.value = item.itemID;
          const sliders = block.querySelectorAll("input[type=range]");
          sliders[0].value = item.colorHue || 0;
          sliders[1].value = item.colorSaturation || 0;
          sliders[2].value = item.scale || 0;
          sliders.forEach(i => i.dispatchEvent(new Event("input")));
        }

        container.appendChild(block);
        builder.appendChild(container);
      });
    } catch {}
  } else {
    bodyParts.forEach(createSlot);
  }
}

document.getElementById("clearBtn").onclick = () => {
  if (!confirm("Clear everything?")) return;
  builder.innerHTML = "";
  bodyParts.forEach(createSlot);
  updateOutputJSON();
};

document.getElementById("downloadBtn").onclick = () => {
  const json = output.textContent;
  const filename = (document.getElementById("filenameInput").value || "CrazyJsons") + ".json";
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

document.getElementById("presetSelect").onchange = (e) => {
  if (lockedFeatures.presets && !isAdmin) return alert("This feature is admin-only.");
  const val = e.target.value;
  if (val === "galaxy") {
    if (!selectedBlock) return alert("Select an item block first.");
    const inputs = selectedBlock.querySelectorAll("input[type=range]");
    inputs[0].value = 180;
    inputs[1].value = 117;
    inputs.forEach(i => i.dispatchEvent(new Event("input")));
  } else if (val === "clear") {
    builder.innerHTML = "";
    bodyParts.forEach(createSlot);
    updateOutputJSON();
  }
  e.target.value = "";
};

document.getElementById("adminBtn").onclick = () => {
  const pass = prompt("Enter admin password:");
  if (pass === "ACJsonPassword") {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin access granted!");
  } else {
    alert("Incorrect password.");
  }
};

document.getElementById("lockPresets").onchange = (e) => {
  lockedFeatures.presets = e.target.checked;
  localStorage.setItem("lockedFeatures", JSON.stringify(lockedFeatures));
};

// Auto-randomize toggle
const toggleRandomBtn = document.createElement("button");
toggleRandomBtn.textContent = "🎲 Auto Random: OFF";
toggleRandomBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleRandomBtn.textContent = "🎲 Auto Random: " + (autoRandomize ? "ON" : "OFF");
};
document.body.insertBefore(toggleRandomBtn, builder);

// Release notes popup
window.addEventListener("load", () => {
  const seen = localStorage.getItem("seenReleaseNotes");
  if (!seen) {
    alert("v0.1\n- Added Every Item\n- Added Galaxy Preset\n- Added The Website\n- Made By @Crazy on Discord");
    localStorage.setItem("seenReleaseNotes", "yes");
  }
});
document.getElementById("releaseNotesBtn").onclick = () => {
  alert("v0.1\n- Added Every Item\n- Added Galaxy Preset\n- Added The Website\n- Made By @Crazy on Discord");
};

// Load initial state
const storedLocks = localStorage.getItem("lockedFeatures");
if (storedLocks) lockedFeatures = JSON.parse(storedLocks);
document.getElementById("lockPresets").checked = lockedFeatures.presets;
loadInitialJSON();
