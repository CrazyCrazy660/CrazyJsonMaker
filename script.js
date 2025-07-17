document.addEventListener("DOMContentLoaded", () => {
  const themeDropdown = document.getElementById("themeDropdown");
  const savedTheme = localStorage.getItem("theme") || "default";
  themeDropdown.value = savedTheme;
  applyTheme(savedTheme);

  themeDropdown.addEventListener("change", () => {
    applyTheme(themeDropdown.value);
  });

  document.getElementById("adminBtn").addEventListener("click", () => {
    const password = prompt("Enter admin password:");
    if (password === "CrazyJson") {
      document.getElementById("adminPanel").style.display = "block";
      alert("Access granted.");
    } else {
      alert("Incorrect password.");
    }
  });

  document.getElementById("addNewItemBtn").addEventListener("click", () => {
    const name = document.getElementById("newItemName").value;
    const id = document.getElementById("newItemID").value;
    const cat = document.getElementById("newItemCategory").value || "uncategorized";
    if (!name || !id) return alert("Enter name and ID!");
    items.push({ name, id, category: cat });
    renderItems();
  });

  document.getElementById("itemSearch").addEventListener("input", renderItems);

  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems();
    });
  });

  ["hueSlider", "satSlider", "scaleSlider", "stateInput", "countInput"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      if (selectedItem) updateOutput(selectedItem);
    });
  });

  document.querySelectorAll(".pos-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  renderItems();
});

let selectedItem = null;

const items = [
  { name: "Banana", id: "item_banana", category: "food" },
  { name: "Backpack", id: "item_backpack", category: "backpacks" },
  { name: "Grenade", id: "item_grenade", category: "explosives" },
  { name: "RPG Ammo", id: "item_rpg_ammo", category: "ammo" },
  { name: "Gold Coin", id: "item_goldcoin", category: "currency" },
  { name: "Camera", id: "item_disposable_camera", category: "misc" }
];

function renderItems() {
  const grid = document.getElementById("itemGrid");
  const filterCat = document.querySelector(".cat-btn.active")?.dataset.cat || "all";
  const search = document.getElementById("itemSearch").value.toLowerCase();
  grid.innerHTML = "";
  items
    .filter(i => (filterCat === "all" || i.category === filterCat))
    .filter(i => i.name.toLowerCase().includes(search))
    .forEach(item => {
      const btn = document.createElement("button");
      btn.className = "item-button";
      btn.textContent = item.name;
      btn.onclick = () => selectItem(item);
      grid.appendChild(btn);
    });
}

function selectItem(item) {
  selectedItem = item;
  document.getElementById("selectedItemName").textContent = item.name;
  updateOutput(item);
}

function updateOutput(item) {
  const hue = +document.getElementById("hueSlider").value;
  const sat = +document.getElementById("satSlider").value;
  const scale = +document.getElementById("scaleSlider").value;
  const state = +document.getElementById("stateInput").value;
  const count = +document.getElementById("countInput").value;

  const pos = document.querySelector(".pos-btn.active")?.dataset.pos || "back";

  const output = {
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

  document.getElementById("output").textContent = JSON.stringify(output, null, 2);
}

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