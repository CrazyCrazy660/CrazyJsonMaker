const items = JSON.parse(localStorage.getItem("customItems")) || [
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

const SHA256_HASH = "c1f0cf8a4cfca0c3f7fda7cc2b02e1f06be39b18f52b3424fd4cfc2c15576a69"; // "ACJsonPassword"

const bodyParts = ["leftHand", "rightHand", "leftHip", "rightHip", "back"];
const builder = document.getElementById("builder");
const output = document.getElementById("output");
let selectedBlock = null;

function updateOutputJSON() {
  const result = { version: 1 };
  document.querySelectorAll("[data-slot]").forEach(section => {
    const block = section.querySelector(".item-block");
    if (block) result[section.dataset.slot] = block.toJSON() || {};
  });
  output.textContent = JSON.stringify(result, null, 2);
  localStorage.setItem("animalCompanyJson", output.textContent);
}

function makeSlider(label, min, max, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.title = `Auto-randomize ${label}`;

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

  input.oninput = () => {
    valueSpan.textContent = input.value;
    updateOutputJSON();
  };

  wrapper.append(labelElem, input, toggle);
  return { input, toggle, wrapper };
}

function applyAutoRandom(sliders) {
  if (!sliders) return;
  sliders.forEach(s => {
    if (s.toggle.checked) {
      const label = s.wrapper.querySelector("label").textContent;
      let val = 0;
      if (label.includes("Hue")) val = Math.floor(Math.random() * 241);
      if (label.includes("Saturation")) val = Math.floor(Math.random() * 321) - 120;
      if (label.includes("Scale")) val = Math.floor(Math.random() * 256) - 128;
      s.input.value = val;
      s.input.dispatchEvent(new Event("input"));
    }
  });
}

function createItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const select = document.createElement("select");
  const none = document.createElement("option");
  none.textContent = "-- None --";
  none.value = "";
  select.appendChild(none);
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
  const sliders = [hue, sat, scale];
  row.append(hue.wrapper, sat.wrapper, scale.wrapper);

  const children = document.createElement("div");
  children.className = "children";

  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "➕ Add Child";
  addChildBtn.onclick = () => {
    const child = createItemBlock();
    children.appendChild(child);
    updateOutputJSON();
  };

  applyAutoRandom(sliders);

  wrapper.append(select, row, addChildBtn, children);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    const obj = {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
    const kids = [...children.children].map(c => c.toJSON()).filter(Boolean);
    if (kids.length) obj.children = kids;
    return obj;
  };

  wrapper.onclick = e => {
    e.stopPropagation();
    if (selectedBlock) selectedBlock.style.outline = "";
    selectedBlock = wrapper;
    wrapper.style.outline = "2px solid red";
  };

  return wrapper;
}

function createSlot(slot) {
  const div = document.createElement("div");
  div.dataset.slot = slot;

  const title = document.createElement("h2");
  title.textContent = slot;
  div.appendChild(title);

  const block = createItemBlock();
  div.appendChild(block);
  builder.appendChild(div);
}

bodyParts.forEach(createSlot);
updateOutputJSON();

document.getElementById("presetGalaxyBtn").onclick = () => {
  if (!selectedBlock) return alert("Select an item first.");
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
  const name = document.getElementById("filenameInput").value || "CrazyJsons";
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name + ".json";
  a.click();
};

async function hashPassword(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

document.getElementById("adminBtn").onclick = async () => {
  const pass = prompt("Enter admin password:");
  const hashed = await hashPassword(pass);
  if (hashed === SHA256_HASH) {
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin access granted!");
  } else {
    alert("Incorrect password.");
  }
};

document.getElementById("addItemBtn").onclick = () => {
  const name = prompt("Item name:");
  const id = prompt("Item ID:");
  if (name && id) {
    items.push({ name, id });
    items.sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem("customItems", JSON.stringify(items));
    alert(`Added "${name}" (${id})! Reload to see in dropdown.`);
  }
};
