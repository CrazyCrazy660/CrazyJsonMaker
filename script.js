window.addEventListener("DOMContentLoaded", () => {
  const adminPassword = "CrazyJson";

  // Elements
  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const randomItemsBtn = document.getElementById("randomItemsBtn");
  const output = document.getElementById("output");
  const itemGrid = document.getElementById("itemGrid");
  const itemSearch = document.getElementById("itemSearch");
  const categories = document.getElementById("categories");
  const positionsBar = document.getElementById("positionsBar");
  const selectedItemName = document.getElementById("selectedItemName");

  const hueSlider = document.getElementById("hueSlider");
  const satSlider = document.getElementById("satSlider");
  const scaleSlider = document.getElementById("scaleSlider");
  const hueVal = document.getElementById("hueVal");
  const satVal = document.getElementById("satVal");
  const scaleVal = document.getElementById("scaleVal");
  const stateInput = document.getElementById("stateInput");
  const countInput = document.getElementById("countInput");

  // Data
  const slotData = {};
  let currentSlot = "leftHand";

  const items = [
    { name: "Banana", id: "item_banana", category: "food" },
    { name: "Grenade", id: "item_grenade", category: "explosives" },
    { name: "Gameboy", id: "item_gameboy", category: "misc" },
    { name: "Crossbow", id: "item_crossbow", category: "weapons" }
  ];

  // Load item into slot
  function selectItem(item) {
    slotData[currentSlot] = {
      itemID: item.id,
      colorHue: 0,
      colorSaturation: 0,
      scale: 0,
      state: 0,
      count: 1
    };
    selectedItemName.textContent = item.name;
    updateOutput();
  }

  // Output JSON
  function updateOutput() {
    const outputObj = { version: 1, ...slotData };
    output.textContent = JSON.stringify(outputObj, null, 2);
  }

  // Render grid
  function renderItems(filter = "", category = "all") {
    itemGrid.innerHTML = "";
    items.filter(item =>
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(filter.toLowerCase())
    ).forEach(item => {
      const btn = document.createElement("button");
      btn.textContent = item.name;
      btn.addEventListener("click", () => selectItem(item));
      itemGrid.appendChild(btn);
    });
  }

  // Random item
  randomItemsBtn.addEventListener("click", () => {
    const btns = Array.from(itemGrid.querySelectorAll("button"));
    if (!btns.length) return;
    const choice = btns[Math.floor(Math.random() * btns.length)];
    choice.click();
  });

  // Admin login
  adminBtn.addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === adminPassword) {
      adminPanel.style.display = "block";
      alert("Admin access granted!");
    } else {
      alert("Incorrect password.");
    }
  });

  // Slot selection
  positionsBar.querySelectorAll(".pos-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      positionsBar.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSlot = btn.dataset.slot;
      const d = slotData[currentSlot] || {};
      selectedItemName.textContent = d.itemID || "No item selected";
    });
  });

  // Category filter
  categories.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      categories.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems(itemSearch.value, btn.dataset.cat);
    });
  });

  itemSearch.addEventListener("input", () => {
    const activeCat = categories.querySelector(".cat-btn.active")?.dataset.cat || "all";
    renderItems(itemSearch.value, activeCat);
  });

  // Slider update
  [hueSlider, satSlider, scaleSlider].forEach(sl => {
    sl.addEventListener("input", () => {
      hueVal.textContent = hueSlider.value;
      satVal.textContent = satSlider.value;
      scaleVal.textContent = scaleSlider.value;

      const d = slotData[currentSlot];
      if (d) {
        d.colorHue = +hueSlider.value;
        d.colorSaturation = +satSlider.value;
        d.scale = +scaleSlider.value;
        updateOutput();
      }
    });
  });

  [stateInput, countInput].forEach(input => {
    input.addEventListener("input", () => {
      const d = slotData[currentSlot];
      if (d) {
        d.state = +stateInput.value;
        d.count = +countInput.value;
        updateOutput();
      }
    });
  });

  // Initialize
  renderItems();
  updateOutput();
});