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
let selectedBlock = null;
let autoRandomize = false;

const toggleRandomBtn = document.createElement("button");
toggleRandomBtn.textContent = "🎲 Auto Random: OFF";
toggleRandomBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleRandomBtn.textContent = "🎲 Auto Random: " + (autoRandomize ? "ON" : "OFF");
  saveBuilderState();
};
document.body.insertBefore(toggleRandomBtn, builder);

function updateOutputJSON() {
  const result = { version: 1 };
  document.querySelectorAll("[data-slot]").forEach(section => {
    const block = section.querySelector(".item-block");
    if (block) {
      result[section.dataset.slot] = block.toJSON() || {};
    }
  });
  const jsonStr = JSON.stringify(result, null, 2);
  output.textContent = jsonStr;
  localStorage.setItem("animalCompanyJson", jsonStr);
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
  inputs[0].value = Math.floor(Math.random() * 241);
  inputs[1].value = Math.floor(Math.random() * 321) - 120;
  inputs[2].value = Math.floor(Math.random() * 256) - 128;
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

  const btnRow = document.createElement("div");
  btnRow.style.marginTop = "10px";
  btnRow.style.display = "flex";
  btnRow.style.gap = "10px";

  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "➕ Add Child";
  addChildBtn.onclick = () => {
    const child = createItemBlock();
    children.appendChild(child);
    updateOutputJSON();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️ Delete";
  deleteBtn.onclick = () => {
    if (wrapper.parentElement.classList.contains("children")) {
      wrapper.remove();
      updateOutputJSON();
    } else {
      alert("You can't delete the root item block of a body part.");
    }
  };

  btnRow.appendChild(addChildBtn);
  btnRow.appendChild(deleteBtn);

  wrapper.append(select, row, btnRow, children);

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

function saveBuilderState() {
  updateOutputJSON();
}

function loadSavedBuilder() {
  const saved = localStorage.getItem("animalCompanyJson");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.version === 1) {
        builder.innerHTML = "";
        bodyParts.forEach(slot => {
          const container = document.createElement("div");
          container.dataset.slot = slot;
          const title = document.createElement("h2");
          title.textContent = slot;
          container.appendChild(title);
          const block = createItemBlock();
          container.appendChild(block);
          builder.appendChild(container);

          if (data[slot]) {
            const s = block.querySelector("select");
            s.value = data[slot].itemID;
            const sliders = block.querySelectorAll("input[type=range]");
            sliders[0].value = data[slot].colorHue;
            sliders[1].value = data[slot].colorSaturation;
            sliders[2].value = data[slot].scale;
          }
        });
        updateOutputJSON();
      }
    } catch (e) {
      console.error("Error loading saved JSON", e);
    }
  } else {
    bodyParts.forEach(createSlot);
    updateOutputJSON();
  }
}

const ADMIN_PASSWORD_HASH = "dcbd7e4580ef2bdc5ce8aa3583fd4554b11e260fc7a99fdb18366e58a4edc0e5";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

document.getElementById("adminBtn").addEventListener("click", () => {
  setTimeout(async () => {
    const pass = prompt("Enter admin password:");
    if (!pass) return;
    const hash = await hashPassword(pass);
    if (hash === ADMIN_PASSWORD_HASH) {
      document.getElementById("adminPanel").style.display = "block";
      alert("Admin access granted!");
    } else {
      alert("Incorrect password.");
    }
  }, 50);
});

document.getElementById("presetGalaxyBtn").onclick = () => {
  if (!selectedBlock) return alert("Select an item block first.");
  const inputs = selectedBlock.querySelectorAll("input[type=range]");
  inputs[0].value = 180;
  inputs[1].value = 117;
  inputs.forEach(i => i.dispatchEvent(new Event("input")));
};

document.getElementById("clearBtn")?.addEventListener("click", () => {
  if (!confirm("Clear everything?")) return;
  builder.innerHTML = "";
  bodyParts.forEach(createSlot);
  output.textContent = "";
  selectedBlock = null;
  localStorage.removeItem("animalCompanyJson");
});

document.getElementById("downloadBtn").onclick = () => {
  const json = output.textContent;
  const filename = (document.getElementById("filenameInput").value || "CrazyJsons") + ".json";
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

loadSavedBuilder();
