window.addEventListener("DOMContentLoaded", () => {
  const themeDropdown = document.getElementById("themeDropdown");
  const bgSpeedSlider = document.getElementById("bgSpeedSlider");
  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const newItemName = document.getElementById("newItemName");
  const newItemID = document.getElementById("newItemID");
  const newItemCategory = document.getElementById("newItemCategory");
  const addNewItemBtn = document.getElementById("addNewItemBtn");
  const itemSearch = document.getElementById("itemSearch");
  const itemGrid = document.getElementById("itemGrid");
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
  const randomItemsBtn = document.getElementById("randomItemsBtn");
  const output = document.getElementById("output");

  const ADMIN_PASSWORD = "CrazyJson";
  let currentSlot = "leftHand";
  const slotData = {};
  const items = []; // Preload or add via admin panel

  /*** THEME + GRID SPEED ***/
  function applyTheme(theme) {
    document.body.classList.remove("light-mode", "theme-animalcompany");
    if (theme === "light") document.body.classList.add("light-mode");
    if (theme === "animalcompany") document.body.classList.add("theme-animalcompany");
    localStorage.setItem("theme", theme);
  }

  function applyGridSpeed(speed) {
    document.body.style.setProperty("--gridSpeed", `${speed}s`);
    localStorage.setItem("acGridSpeed", speed);
  }

  themeDropdown.addEventListener("change", () => applyTheme(themeDropdown.value));
  bgSpeedSlider.addEventListener("input", () => applyGridSpeed(bgSpeedSlider.value));

  const savedTheme = localStorage.getItem("theme") || "default";
  themeDropdown.value = savedTheme;
  applyTheme(savedTheme);

  const savedSpeed = localStorage.getItem("acGridSpeed") || "60";
  bgSpeedSlider.value = savedSpeed;
  applyGridSpeed(savedSpeed);

  /*** ADMIN PANEL ***/
  adminBtn.addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === ADMIN_PASSWORD) {
      adminPanel.style.display = "block";
      alert("Admin access granted!");
    } else {
      alert("Incorrect password.");
    }
  });

  addNewItemBtn.addEventListener("click", () => {
    const name = newItemName.value.trim();
    const id = newItemID.value.trim();
    const cat = newItemCategory.value;
    if (!name || !id) return alert("Name & ID required.");
    items.push({ name, id, category: cat });
    renderItems(itemSearch.value, categories.querySelector(".cat-btn.active").dataset.cat);
    newItemName.value = "";
    newItemID.value = "";
  });

  /*** SLOT & ITEM SELECTION ***/
  positionsBar.querySelectorAll(".pos-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      positionsBar.querySelectorAll(".pos-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSlot = btn.dataset.slot;
      const d = slotData[currentSlot];
      selectedItemName.textContent = d?.itemName || "No item selected";
      if (d) {
        hueSlider.value = d.colorHue;
        satSlider.value = d.colorSaturation;
        scaleSlider.value = d.scale;
        hueVal.textContent = d.colorHue;
        satVal.textContent = d.colorSaturation;
        scaleVal.textContent = d.scale;
        stateInput.value = d.state;
        countInput.value = d.count;
      }
    })
  );

  function selectItem(item) {
    slotData[currentSlot] = {
      itemName: item.name,
      itemID: item.id,
      category: item.category,
      colorHue: 0,
      colorSaturation: 0,
      scale: 0,
      state: 0,
      count: 1
    };
    selectedItemName.textContent = item.name;
    updateOutputJSON();
  }

  function renderItems(filter = "", cat = "all") {
    itemGrid.innerHTML = "";
    items
      .filter(it => (cat === "all" || it.category === cat) && it.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = item.name;
        btn.addEventListener("click", () => selectItem(item));
        itemGrid.appendChild(btn);
      });
  }

  randomItemsBtn.addEventListener("click", () => {
    const btns = Array.from(itemGrid.children);
    if (!btns.length) return;
    btns[Math.floor(Math.random() * btns.length)].click();
  });

  categories.querySelectorAll(".cat-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      categories.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderItems(itemSearch.value, btn.dataset.cat);
    })
  );

  itemSearch.addEventListener("input", () => {
    const cat = categories.querySelector(".cat-btn.active").dataset.cat;
    renderItems(itemSearch.value, cat);
  });

  /*** SLIDER & INPUT HANDLING ***/
  [hueSlider, satSlider, scaleSlider].forEach(slider =>
    slider.addEventListener("input", () => {
      hueVal.textContent = hueSlider.value;
      satVal.textContent = satSlider.value;
      scaleVal.textContent = scaleSlider.value;
      const d = slotData[currentSlot];
      if (d) {
        d.colorHue = +hueSlider.value;
        d.colorSaturation = +satSlider.value;
        d.scale = +scaleSlider.value;
        updateOutputJSON();
      }
    })
  );

  [stateInput, countInput].forEach(input =>
    input.addEventListener("input", () => {
      const d = slotData[currentSlot];
      if (d) {
        d.state = +stateInput.value;
        d.count = +countInput.value;
        updateOutputJSON();
      }
    })
  );

  /*** OUTPUT JSON ***/
  function updateOutputJSON() {
    const out = { version: 1 };
    Object.entries(slotData).forEach(([slot, d]) => {
      out[slot] = {
        itemID: d.itemID,
        colorHue: d.colorHue,
        colorSaturation: d.colorSaturation,
        scale: d.scale,
        state: d.state,
        count: d.count
      };
    });
    output.textContent = JSON.stringify(out, null, 2);
  }

  /*** INIT ***/
  renderItems();
  updateOutputJSON();
});