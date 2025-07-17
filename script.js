document.addEventListener("DOMContentLoaded", () => {
  const themeDropdown = document.getElementById("themeDropdown");

  // Apply saved theme or default
  const savedTheme = localStorage.getItem("theme") || "default";
  themeDropdown.value = savedTheme;
  applyTheme(savedTheme);

  // Set fixed background speed for AC theme
  document.body.style.setProperty("--gridSpeed", "37s");

  themeDropdown.addEventListener("change", () => {
    applyTheme(themeDropdown.value);
  });

  // Admin access
  document.getElementById("adminBtn").addEventListener("click", () => {
    const password = prompt("Enter admin password:");
    if (password === "CrazyJson") {
      document.getElementById("adminPanel").style.display = "block";
      alert("Access granted.");
    } else {
      alert("Wrong password.");
    }
  });

  // Add new item via admin panel
  document.getElementById("addNewItemBtn").addEventListener("click", () => {
    const name = document.getElementById("newItemName").value;
    const id = document.getElementById("newItemID").value;
    const category = document.getElementById("newItemCategory").value;
    if (!name || !id) return alert("Please enter name and ID");
    items.push({ name, id, category });
    renderItems();
  });

  // Render functions, slots, properties
  initializeUI();
});

// Apply theme to body
function applyTheme(theme) {
  document.body.classList.remove("light-mode", "theme-animalcompany");
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else if (theme === "animalcompany") {
    document.body.classList.add("theme-animalcompany");
  }
  localStorage.setItem("theme", theme);
}

// Example placeholder array for items
const items = [
  { name: "Banana", id: "item_banana", category: "food" },
  { name: "Backpack", id: "item_backpack", category: "backpacks" },
  { name: "Grenade", id: "item_grenade", category: "explosives" },
  { name: "RPG Ammo", id: "item_rpg_ammo", category: "ammo" }
];

// Populate item list and categories
function renderItems() {
  const itemGrid = document.getElementById("itemGrid");
  const selectedCategory = document.querySelector(".cat-btn.active")?.dataset.cat || "all";
  const searchTerm = document.getElementById("itemSearch").value.toLowerCase();

  itemGrid.innerHTML = "";

  items
    .filter(item => (selectedCategory === "all" || item.category === selectedCategory))
    .filter(item => item.name.toLowerCase().includes(searchTerm))
    .forEach(item => {
      const btn = document.createElement("button");
      btn.className = "item-button";
      btn.textContent = item.name;
      btn.onclick = () => selectItem(item);
      itemGrid.appendChild(btn);
    });
}

function selectItem(item) {
  document.getElementById("selectedItemName").textContent = item.name;
  updateOutput(item);
}

function updateOutput(item) {
  const hue = document.getElementById("hueSlider").value;
  const sat = document.getElementById("satSlider").value;
  const scale = document.getElementById("scaleSlider").value;
  const state = document.getElementById("stateInput").value;
  const count = document.getElementById("countInput").value;

  const output = {
    version: 1,
    back: {
      itemID: item.id,
      colorHue: +hue,
      colorSaturation: +sat,
      scale: +scale,
      state: +state,
      count: +count
    }
  };

  document.getElementById("output").textContent = JSON.stringify(output, null, 2);
}

function initializeUI() {
  // Search input
  document.getElementById("itemSearch").addEventListener("input", renderItems);

  // Category buttons
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems();
    });
  });

  // Sliders
  ["hueSlider", "satSlider", "scaleSlider", "stateInput", "countInput"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      const currentItemName = document.getElementById("selectedItemName").textContent;
      const selectedItem = items.find(i => i.name === currentItemName);
      if (selectedItem) updateOutput(selectedItem);
    });
  });

  // Slot button handling (leftHand, rightHand etc.)
  document.querySelectorAll(".pos-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  renderItems();
}