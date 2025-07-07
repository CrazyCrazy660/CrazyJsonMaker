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
let isAdmin = false;

const toggleRandomBtn = document.createElement("button");
toggleRandomBtn.textContent = "🎲 Auto Random: OFF";
toggleRandomBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleRandomBtn.textContent = "🎲 Auto Random: " + (autoRandomize ? "ON" : "OFF");
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

bodyParts.forEach(createSlot);
updateOutputJSON();

document.getElementById("presetGalaxyBtn").onclick = () => {
  if (!selectedBlock) return alert("Select an item block first.");
  const inputs = selectedBlock.querySelectorAll("input[type=range]");
  inputs[0].value = 180;
  inputs[1].value = 117;
  inputs.forEach(i => i.dispatchEvent(new Event("input")));
};

document.getElementById("clearBtn").onclick = () => {
  if (!confirm("Clear everything?")) return;
  builder.innerHTML = "";
  bodyParts.forEach(createSlot);
  output.textContent = "";
  selectedBlock = null;
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

// Password: CrazyJson (SHA-256)
const correctHash = "ac3d7a4f6f8ad10554a0edc0f61b8a5a1c1bb7a0718e4ce5e47c6eb1be14c5d4";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

document.getElementById("adminBtn").onclick = async () => {
  const input = prompt("Enter admin password:");
  const hashedInput = await hashPassword(input);
  if (hashedInput === correctHash) {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin access granted!");
  } else {
    alert("Incorrect password.");
  }
};
