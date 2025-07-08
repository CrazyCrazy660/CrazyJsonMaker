// ————— DATA & ELEMENT SETUP —————
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

// ————— AUTO‑RANDOM TOGGLE —————
const toggleRandomBtn = document.createElement("button");
toggleRandomBtn.textContent = "🎲 Auto Random: OFF";
toggleRandomBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleRandomBtn.textContent = `🎲 Auto Random: ${autoRandomize ? "ON" : "OFF"}`;
  saveBuilderState();
};
document.body.insertBefore(toggleRandomBtn, builder);

// ————— JSON OUTPUT & SAVE —————
function updateOutputJSON() {
  const res = { version: 1 };
  document.querySelectorAll("[data-slot]").forEach(sec => {
    const blk = sec.querySelector(".item-block");
    if (blk) res[sec.dataset.slot] = blk.toJSON() || {};
  });
  const str = JSON.stringify(res, null, 2);
  output.textContent = str;
  localStorage.setItem("animalCompanyJson", str);
}

// ————— SLIDER CREATION —————
function makeSlider(label, min, max, def) {
  const w = document.createElement("div"), inp = document.createElement("input");
  w.className = "input-column";
  inp.type = "range"; inp.min = min; inp.max = max; inp.value = def;
  const lbl = document.createElement("label"), span = document.createElement("span");
  lbl.textContent = `${label}: `; span.textContent = inp.value; lbl.append(span);
  const btn = document.createElement("button"); btn.textContent = "🎲";
  btn.onclick = () => {
    const v = label === "Scale"
      ? Math.floor(Math.random() * 256) - 128
      : label === "Saturation"
        ? Math.floor(Math.random() * 321) - 120
        : Math.floor(Math.random() * 241);
    inp.value = v; inp.dispatchEvent(new Event("input"));
  };
  inp.oninput = () => (span.textContent = inp.value, updateOutputJSON());
  w.append(lbl, inp, btn);
  return { input: inp, wrapper: w };
}

// ————— RANDOMIZER —————
function applyRandomization(inputs) {
  if (!inputs || inputs.length < 3) return;
  inputs[0].value = Math.floor(Math.random() * 241);
  inputs[1].value = Math.floor(Math.random() * 321) - 120;
  inputs[2].value = Math.floor(Math.random() * 256) - 128;
  inputs.forEach(i => i.dispatchEvent(new Event("input")));
}

// ————— ITEM‑BLOCK CREATION —————
function originalCreateItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  // select
  const select = document.createElement("select");
  const none = document.createElement("option");
  none.value = ""; none.textContent = "-- None --";
  select.append(none);
  items.forEach(({ name, id }) => {
    const o = document.createElement("option");
    o.value = id; o.textContent = name;
    select.append(o);
  });

  // sliders row
  const row = document.createElement("div");
  row.className = "input-row";
  const hue = makeSlider("Hue", 0, 240, 0);
  const sat = makeSlider("Saturation", -120, 200, 0);
  const scale = makeSlider("Scale", -128, 127, 0);
  row.append(hue.wrapper, sat.wrapper, scale.wrapper);

  // children + controls
  const children = document.createElement("div");
  children.className = "children";
  const btnRow = document.createElement("div");
  btnRow.style = "margin-top:10px;display:flex;gap:10px";
  const addChildBtn = document.createElement("button");
  addChildBtn.textContent = "➕ Add Child";
  addChildBtn.onclick = () => {
    children.appendChild(createItemBlock());
    updateOutputJSON();
  };
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️ Delete";
  delBtn.onclick = () => {
    if (wrapper.parentElement.classList.contains("children")) {
      wrapper.remove(); updateOutputJSON();
    } else alert("Can't delete the root block.");
  };
  btnRow.append(addChildBtn, delBtn);

  // assemble
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
      .map(c => c.toJSON()).filter(Boolean);
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
    const s = block.querySelectorAll("input[type=range]");
    applyRandomization(s);
  }
  return block;
}
function createSlot(slot) {
  const cont = document.createElement("div");
  cont.dataset.slot = slot;
  const t = document.createElement("h2");
  t.textContent = slot;
  cont.append(t, createItemBlock());
  builder.append(cont);
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
          const cont = document.createElement("div");
          cont.dataset.slot = slot;
          const t = document.createElement("h2");
          t.textContent = slot;
          cont.append(t, createItemBlock());
          builder.append(cont);

          if (data[slot]) {
            const blk = cont.querySelector(".item-block");
            blk.querySelector("select").value = data[slot].itemID;
            const sl = blk.querySelectorAll("input[type=range]");
            sl[0].value = data[slot].colorHue;
            sl[1].value = data[slot].colorSaturation;
            sl[2].value = data[slot].scale;
          }
        });
        updateOutputJSON();
        return;
      }
    } catch {}
  }
  bodyParts.forEach(createSlot);
  updateOutputJSON();
}

// ————— ADMIN PASSWORD OBSCURATION —————
const actualPassword = "CrazyJson";
function generateDecoys(count = 500) {
  const adjectives = [
    "Laser","Waffle","Octopus","Chair","Wizard","Sloth","Toaster","Glitch",
    "Penguin","Yogurt","Tornado","Bagel","Fox","Train","Robot","Melon",
    "Cactus","Beard","Spoon","Dragon","Umbrella","Bubble","Sword","Jetpack",
    "Dino","Crayon","Kite","Hammer","Donut","Taco","Lamp","Parrot","Pizza",
    "Ladder","Helmet","Planet","Storm","Banana","Pickle","Unicorn","Toast",
    "Pineapple","Duck","Mushroom","Giraffe","Burrito","Waterfall","Llama",
    "Snake","Glove","Cannon","Rocket","Mango","Alien","Saucer"
  ];
  const set = new Set();
  while (set.size < count) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    set.add(`Crazy${adj}${Math.floor(Math.random() * 10000)}`);
  }
  return [...set];
}
const decoys = generateDecoys();
const idx = Math.floor(Math.random() * 301) + 100;
decoys.splice(idx, 0, actualPassword);
const validAdminPasswords = decoys;

// ————— ADMIN PANEL LOGIC —————
document.getElementById("adminBtn").addEventListener("click", () => {
  setTimeout(() => {
    const p = prompt("Enter admin password:");
    if (!p) return;
    if (validAdminPasswords.includes(p)) {
      if (p === actualPassword) {
        document.getElementById("adminPanel").style.display = "block";
        alert("Admin access granted!");
      } else alert("Nice try... wrong password 😅");
    } else alert("Incorrect password.");
  }, 50);
});

// ————— BUTTONS —————
document.getElementById("presetGalaxyBtn").onclick = () => {
  if (!selectedBlock) return alert("Select an item block first.");
  const sl = selectedBlock.querySelectorAll("input[type=range]");
  sl[0].value = 180; sl[1].value = 117;
  sl.forEach(i => i.dispatchEvent(new Event("input")));
};
document.getElementById("clearBtn")?.addEventListener("click", () => {
  if (!confirm("Clear everything?")) return;
  builder.innerHTML = ""; selectedBlock = null;
  bodyParts.forEach(createSlot);
  output.textContent = "";
  localStorage.removeItem("animalCompanyJson");
});
document.getElementById("downloadBtn").onclick = () => {
  const j = output.textContent;
  const fn = (document.getElementById("filenameInput").value || "CrazyJsons") + ".json";
  const blob = new Blob([j], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fn;
  a.click();
};

// ————— INITIALIZE —————
loadSavedBuilder();
