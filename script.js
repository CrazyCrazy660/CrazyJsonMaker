// script.js
document.addEventListener("DOMContentLoaded", () => {
  const themeDropdown = document.getElementById("themeDropdown");
  const savedTheme = localStorage.getItem("theme") || "default";
  themeDropdown.value = savedTheme;
  applyTheme(savedTheme);

  themeDropdown.addEventListener("change", () => applyTheme(themeDropdown.value));

  document.getElementById("adminBtn").addEventListener("click", async () => {
    const pass = prompt("Enter admin password:");
    if (pass === "CrazyJson") {
      document.getElementById("adminPanel").style.display = "block";
      alert("Access granted.");
    } else {
      alert("Incorrect password.");
    }
  });

  document.getElementById("addNewItemBtn").addEventListener("click", () => {
    const name = document.getElementById("newItemName").value.trim();
    const id = document.getElementById("newItemID").value.trim();
    if (!name || !id) return alert("Enter both name & ID!");
    items.push({ name, id, category: "uncategorized" });
    renderItems();
  });

  document.getElementById("itemSearch").addEventListener("input", renderItems);

  document.querySelectorAll(".cat-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems();
    })
  );

  document.querySelectorAll(".pos-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (selectedItem) updateOutput(selectedItem);
    })
  );

  renderItems();
});

// GLOBALS
let selectedItem = null;
const items = [
  { name: "Banana", id: "item_banana", category: "food" },
  { name: "Backpack", id: "item_backpack", category: "backpacks" },
  { name: "Grenade", id: "item_grenade", category: "explosives" },
  { name: "RPG Ammo", id: "item_rpg_ammo", category: "ammo" },
  { name: "Gold Coin", id: "item_goldcoin", category: "currency" },
  { name: "Camera", id: "item_disposable_camera", category: "misc" }
];

// THEME HANDLER
function applyTheme(theme) {
  document.body.classList.remove("light-mode", "theme-animalcompany");
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else if (theme === "animalcompany") {
    document.body.classList.add("theme-animalcompany");
    document.body.style.setProperty("--gridSpeed", "37s");
  } else {
    document.body.style.removeProperty("--gridSpeed");
  }
  localStorage.setItem("theme", theme);
}

// RENDER ITEMS
function renderItems() {
  const grid = document.getElementById("itemGrid");
  const filterCat = document.querySelector(".cat-btn.active")?.dataset.cat || "all";
  const search = document.getElementById("itemSearch").value.toLowerCase();
  grid.innerHTML = "";

  items
    .filter(i => filterCat === "all" || i.category === filterCat)
    .filter(i => i.name.toLowerCase().includes(search))
    .forEach(item => {
      const btn = document.createElement("button");
      btn.className = "item-button";
      btn.textContent = item.name;
      btn.onclick = () => selectItem(item);
      grid.append(btn);
    });
}

// SELECT ITEM
function selectItem(item) {
  selectedItem = item;
  document.getElementById("selectedItemName").textContent = item.name;
  if (!document.querySelector(".pos-btn.active")) {
    document.querySelector(".pos-btn")?.classList.add("active");
  }
  updateOutput(item);
}

// UPDATE OUTPUT JSON
function updateOutput(item) {
  const hue = +document.getElementById("hueSlider").value;
  const sat = +document.getElementById("satSlider").value;
  const scale = +document.getElementById("scaleSlider").value;
  const state = +document.getElementById("stateInput").value;
  const count = +document.getElementById("countInput").value;
  const pos = document.querySelector(".pos-btn.active")?.dataset.slot || "back";

  const payload = {
    version: 1,
    [pos]: {
      itemID: item.id,
      colorHue: hue,
      colorSaturation: sat,
      scale: scale,
      state: state,
      count: count
    }
  };
  document.getElementById("output").textContent = JSON.stringify(payload, null, 2);
}

// SLIDER BUILDER (if used for dynamic slots)
function makeSlider(label, min, max, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const labelElem = document.createElement("label");
  labelElem.textContent = label + ": ";
  const valueSpan = document.createElement("span");
  valueSpan.textContent = defaultVal;
  labelElem.append(valueSpan);

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = defaultVal;
  input.oninput = () => {
    valueSpan.textContent = input.value;
    if (selectedItem) updateOutput(selectedItem);
  };

  const btn = document.createElement("button");
  btn.textContent = "🎲";
  btn.onclick = () => {
    const val = label === "Scale"
      ? Math.floor(Math.random() * 256) - 128
      : label === "Saturation"
        ? Math.floor(Math.random() * 321) - 120
        : Math.floor(Math.random() * 241);
    input.value = val;
    input.dispatchEvent(new Event("input"));
  };

  wrapper.append(labelElem, input, btn);
  return { input, wrapper };
}