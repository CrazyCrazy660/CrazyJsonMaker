// — DATA & SETUP
let items = [
  { name: "Apple", id: "item_apple" },
  /* …rest of your items... */
  { name: "Zombie Mob Loot Box", id: "item_randombox_mobloot_zombie" }
];
items.sort((a, b) => a.name.localeCompare(b.name));

const bodyParts = ["leftHand","rightHand","leftHip","rightHip","back"];
const builder = document.getElementById("builder");
const output = document.getElementById("output");
let selectedBlock = null, autoRandomize = false;

// — AUTO-RANDOM TOGGLE
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "🎲 Auto Random: OFF";
toggleBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleBtn.textContent = `🎲 Auto Random: ${autoRandomize ? "ON" : "OFF"}`;
  saveBuilderState();
};
document.body.insertBefore(toggleBtn, builder);

// — JSON OUTPUT & SAVE
function updateOutputJSON() {
  const res = { version: 1 };
  document.querySelectorAll("[data-slot]").forEach(slotDiv => {
    const blk = slotDiv.querySelector(".item-block");
    if (blk) res[slotDiv.dataset.slot] = blk.toJSON() || {};
  });
  const jsonStr = JSON.stringify(res, null, 2);
  output.textContent = jsonStr;
  localStorage.setItem("animalCompanyJson", jsonStr);
}

// — SLIDER BUILDER
function makeSlider(label, min, max, def) {
  const w = document.createElement("div"), inp = document.createElement("input");
  w.className = "input-column";
  inp.type = "range"; inp.min = min; inp.max = max; inp.value = def;
  const lbl = document.createElement("label"), span = document.createElement("span");
  lbl.textContent = `${label}: `; span.textContent = inp.value; lbl.append(span);
  const btn = document.createElement("button");
  btn.textContent = "🎲";
  btn.onclick = () => {
    inp.value = label === "Scale"
      ? Math.floor(Math.random() * 256) - 128
      : label === "Saturation"
        ? Math.floor(Math.random() * 321) - 120
        : Math.floor(Math.random() * 241);
    inp.dispatchEvent(new Event("input"));
  };
  inp.oninput = () => {
    span.textContent = inp.value;
    updateOutputJSON();
  };
  w.append(lbl, inp, btn);
  return { input: inp, wrapper: w };
}

// — ITEM BLOCK WITH AUTO-REGISTER
function originalCreateItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const sd = document.createElement("div");
  sd.style.cssText = "display:flex;flex-direction:column";
  const search = document.createElement("input");
  search.placeholder = "Search items...";
  search.style.marginBottom = "4px";
  const select = document.createElement("select");
  const options = [];
  const noneOpt = document.createElement("option");
  noneOpt.value = ""; noneOpt.textContent = "-- None --";
  select.append(noneOpt); options.push(noneOpt);

  items.forEach(it => {
    const o = document.createElement("option");
    o.value = it.id; o.textContent = it.name;
    select.append(o); options.push(o);
  });

  // 🔄 AUTO-REGISTER ON FIRST SELECTION
  let firstSelection = true;
  select.addEventListener("change", () => {
    if (!firstSelection || !select.value) return;
    firstSelection = false;
    updateOutputJSON(); // auto-save
  });

  search.oninput = () => {
    const q = search.value.toLowerCase();
    select.innerHTML = "";
    options.forEach(o => {
      if (!o.value || o.textContent.toLowerCase().includes(q)) select.append(o);
    });
  };
  sd.append(search, select);

  const row = document.createElement("div");
  row.className = "input-row";
  const hue = makeSlider("Hue", 0, 240, 0);
  const sat = makeSlider("Saturation", -120, 200, 0);
  const scale = makeSlider("Scale", -128, 127, 0);
  row.append(hue.wrapper, sat.wrapper, scale.wrapper);

  const children = document.createElement("div");
  children.className = "children";
  const ctrl = document.createElement("div");
  ctrl.style.cssText = "margin-top:10px;display:flex;gap:10px";
  const addBtn = document.createElement("button");
  addBtn.textContent = "➕ Add Child";
  addBtn.onclick = () => {
    children.appendChild(createItemBlock());
    updateOutputJSON();
  };
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️ Delete";
  delBtn.onclick = () => {
    if (wrapper.parentElement.classList.contains("children")) {
      wrapper.remove();
      updateOutputJSON();
    } else alert("Can't delete the root block.");
  };
  ctrl.append(addBtn, delBtn);

  wrapper.append(sd, row, ctrl, children);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    const json = {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
    const kidArr = Array.from(children.children)
      .map(c => c.toJSON())
      .filter(Boolean);
    if (kidArr.length) json.children = kidArr;
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
  const b = originalCreateItemBlock();
  if (autoRandomize) {
    b.querySelectorAll("input[type=range]").forEach(i => i.dispatchEvent(new Event("input")));
  }
  return b;
}

// — SLOTS & INIT
function createSlot(slotName) {
  const div = document.createElement("div");
  div.dataset.slot = slotName;
  const h2 = document.createElement("h2");
  h2.textContent = slotName;
  div.append(h2, createItemBlock());
  builder.append(div);
}

function loadSavedBuilder() {
  const sv = localStorage.getItem("animalCompanyJson");
  if (sv) {
    try {
      const data = JSON.parse(sv);
      if (data.version === 1) {
        builder.innerHTML = "";
        bodyParts.forEach(slot => {
          const div = document.createElement("div");
          div.dataset.slot = slot;
          const h2 = document.createElement("h2");
          h2.textContent = slot;
          div.append(h2, createItemBlock());
          builder.append(div);
          if (data[slot]) {
            const blk = div.querySelector(".item-block");
            blk.querySelector("select").value = data[slot].itemID;
            const sls = blk.querySelectorAll("input[type=range]");
            sls[0].value = data[slot].colorHue;
            sls[1].value = data[slot].colorSaturation;
            sls[2].value = data[slot].scale;
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

// — ADMIN PASSWORD, OVERRIDE, ADD ITEM, PRESETS... (no change from previous)
// [Rest of your script remains unchanged]
