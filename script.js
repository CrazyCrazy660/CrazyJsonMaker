window.addEventListener("DOMContentLoaded", () => {
  const adminPassword = "CrazyJson";

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

  const slotData = {};
  let currentSlot = "leftHand";

  const items = [
    { name: "Banana", id: "item_banana", category: "food" },
    { name: "Grenade", id: "item_grenade", category: "explosives" },
    { name: "Gameboy", id: "item_gameboy", category: "misc" },
    { name: "Crossbow", id: "item_crossbow", category: "weapons" }
  ];

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

  function updateOutput() {
    const outputObj = { version: 1, ...slotData };
    output.textContent = JSON.stringify(outputObj, null, 2);
  }

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

  randomItemsBtn.addEventListener("click", () => {
    const btns = Array.from(itemGrid.querySelectorAll("button"));
    if (!btns.length) return;
    const choice = btns[Math.floor(Math.random() * btns.length)];
    choice.click();
  });

  adminBtn.addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === adminPassword) {
      adminPanel.style.display = "block";
      alert("Admin access granted!");
    } else {
      alert("Incorrect password.");
    }
  });

  positionsBar.querySelectorAll(".pos-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      positionsBar.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSlot = btn.dataset.slot;
      const d = slotData[currentSlot] || {};
      selectedItemName.textContent = d.itemID || "No item selected";
    });
  });

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

  // THEME SELECTOR
  const themeDropdown = document.getElementById("themeDropdown");
  themeDropdown.addEventListener("change", () => {
    document.body.classList.remove("light-mode", "theme-animalcompany");
    if (themeDropdown.value === "light") {
      document.body.classList.add("light-mode");
    } else if (themeDropdown.value === "animalcompany") {
      document.body.classList.add("theme-animalcompany");
    }
    localStorage.setItem("selectedTheme", themeDropdown.value);
  });

  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    themeDropdown.value = savedTheme;
    themeDropdown.dispatchEvent(new Event("change"));
  }

  // Init
  renderItems();
  updateOutput();
});