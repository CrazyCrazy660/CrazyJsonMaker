window.addEventListener('DOMContentLoaded', () => {
  // ---------------- ITEMS ----------------
  const items = [
    { name: "Anti Gravity Grenade", id: "item_anti_gravity_grenade", category: "explosives" },
    { name: "Arrow", id: "item_arrow", category: "weapons" },
    { name: "Backpack", id: "item_backpack", category: "backpacks" },
    { name: "Baseball Bat", id: "item_baseball_bat", category: "weapons" },
    { name: "Balloon", id: "item_balloon", category: "misc" },
    { name: "Banana", id: "item_banana", category: "food" },
    { name: "Big Mob Loot Box", id: "item_randombox_mobloot_big", category: "misc" },
    { name: "Bone Shield", id: "item_shield_bones", category: "weapons" },
    { name: "CEO Plaque", id: "item_ceo_plaque", category: "misc" },
    { name: "Cola", id: "item_cola", category: "food" },
    { name: "Company Ration", id: "item_company_ration", category: "food" },
    { name: "Crossbow", id: "item_crossbow", category: "weapons" },
    { name: "Dynamite", id: "item_dynamite", category: "explosives" },
    { name: "Egg RPG Ammo", id: "item_rpg_ammo_egg", category: "ammo" },
    { name: "Gameboy", id: "item_gameboy", category: "misc" },
    { name: "Golden Coin", id: "item_goldcoin", category: "misc" },
    { name: "Grenade", id: "item_grenade", category: "explosives" },
    { name: "Heart Gun", id: "item_heart_gun", category: "weapons" },
    { name: "Landmine", id: "item_landmine", category: "explosives" },
    { name: "Large Basketball Backpack", id: "item_backpack_large_basketball", category: "backpacks" },
    { name: "Pokémon Card", id: "item_rare_card", category: "misc" },
    { name: "Revolver Ammo", id: "item_revolver_ammo", category: "ammo" },
    { name: "Shotgun Ammo", id: "item_shotgun_ammo", category: "ammo" },
    { name: "Spear RPG Ammo", id: "item_rpg_ammo_spear", category: "ammo" },
    { name: "Turkey", id: "item_turkey_whole", category: "food" }
  ];
  items.sort((a,b) => a.name.localeCompare(b.name));

  // --------------- STATE & UI ELEMENTS ---------------
  const bodyParts = ["leftHand","rightHand","leftHip","rightHip","back"];
  let currentSlot = bodyParts[0];
  const slotData = {};
  const adminPassword = "CrazyJson";

  const positionsBar = document.getElementById("positionsBar");
  const categoriesBar = document.getElementById("categories");
  const itemGrid = document.getElementById("itemGrid");
  const itemSearch = document.getElementById("itemSearch");
  const selectedItemName = document.getElementById("selectedItemName");
  const randomItemsBtn = document.getElementById("randomItemsBtn");
  const addChildBtn = document.getElementById("addChildBtn");
  const swatchList = document.getElementById("swatchList");
  const hueSlider = document.getElementById("hueSlider");
  const satSlider = document.getElementById("satSlider");
  const scaleSlider = document.getElementById("scaleSlider");
  const hueVal = document.getElementById("hueVal");
  const satVal = document.getElementById("satVal");
  const scaleVal = document.getElementById("scaleVal");
  const stateInput = document.getElementById("stateInput");
  const countInput = document.getElementById("countInput");
  const outputEl = document.getElementById("output");
  const adminBtn = document.getElementById("adminBtn");
  const adminPanel = document.getElementById("adminPanel");
  const overrideHue = document.getElementById("overrideHue");
  const overrideSat = document.getElementById("overrideSaturation");
  const overrideScale = document.getElementById("overrideScale");
  const overrideHueVal = document.getElementById("hueMaxVal");
  const overrideSatVal = document.getElementById("satMaxVal");
  const overrideScaleVal = document.getElementById("scaleMaxVal");
  const adminOverrideBtn = document.getElementById("adminOverrideBtn");
  const newItemName = document.getElementById("newItemName");
  const newItemID = document.getElementById("newItemID");
  const newItemCategory = document.getElementById("newItemCategory");
  const addNewItemBtn = document.getElementById("addNewItemBtn");
  const lockPresets = document.getElementById("lockPresets");
  const lockDownloadBtn = document.getElementById("lockDownloadBtn");
  const catUnreleasedBtn = document.getElementById("catUnreleased");
  if (catUnreleasedBtn) catUnreleasedBtn.style.display = "none";

  // ------------ HELPERS & JSON OUTPUT ------------
  function updateOutputJSON(){
    const result = { version: 1 };
    bodyParts.forEach(slot => {
      const d = slotData[slot];
      if (d?.itemID) result[slot] = { ...d };
    });
    outputEl.textContent = JSON.stringify(result, null, 2);
  }

  function saveSlot() {
    const d = slotData[currentSlot] || {};
    d.itemID = d.itemID || "";
    d.colorHue = +hueSlider.value;
    d.colorSaturation = +satSlider.value;
    d.scale = +scaleSlider.value;
    d.state = +stateInput.value;
    d.count = +countInput.value;
    slotData[currentSlot] = d;
    updateOutputJSON();
  }

  function loadSlot(slot) {
    const d = slotData[slot] || {};
    selectedItemName.textContent = d.itemID || "No item selected";
    hueSlider.value = d.colorHue ?? 0;
    satSlider.value = d.colorSaturation ?? 0;
    scaleSlider.value = d.scale ?? 0;
    hueVal.textContent = hueSlider.value;
    satVal.textContent = satSlider.value;
    scaleVal.textContent = scaleSlider.value;
    stateInput.value = d.state ?? 0;
    countInput.value = d.count ?? 1;
  }

  // ----------- RENDER ITEM GRID -----------
  function renderItemGrid(filter = "", cat = "all"){
    itemGrid.innerHTML = "";
    items.filter(it =>
      (cat === "all" || it.category === cat) &&
      it.name.toLowerCase().includes(filter.toLowerCase())
    ).forEach(it => {
      const btn = document.createElement("button");
      btn.textContent = it.name;
      btn.onclick = () => {
        slotData[currentSlot] = slotData[currentSlot] || {};
        slotData[currentSlot].itemID = it.id;
        loadSlot(currentSlot);
        saveSlot();
      };
      itemGrid.append(btn);
    });
  }

  // ----------- INITIALIZE UI EVENT LISTENERS -----------
  positionsBar.querySelectorAll(".pos-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      positionsBar.querySelectorAll(".pos-btn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      currentSlot = btn.dataset.slot;
      loadSlot(currentSlot);
    });
  });

  categoriesBar.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      categoriesBar.querySelectorAll(".cat-btn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      renderItemGrid(itemSearch.value, btn.dataset.cat);
    });
  });

  itemSearch.addEventListener("input", () => {
    const activeCat = categoriesBar.querySelector(".cat-btn.active")?.dataset.cat || "all";
    renderItemGrid(itemSearch.value, activeCat);
  });

  randomItemsBtn.addEventListener("click", () => {
    const btns = Array.from(itemGrid.querySelectorAll("button"));
    if (!btns.length) return;
    btns[Math.floor(Math.random()*btns.length)].click();
  });

  [hueSlider, satSlider, scaleSlider].forEach(sl => {
    sl.addEventListener("input", () => {
      hueVal.textContent = hueSlider.value;
      satVal.textContent = satSlider.value;
      scaleVal.textContent = scaleSlider.value;
    });
    sl.addEventListener("change", saveSlot);
  });
  stateInput.addEventListener("change", saveSlot);
  countInput.addEventListener("change", saveSlot);

  addChildBtn.addEventListener("click", () => {
    const d = slotData[currentSlot] || {};
    if (!d.itemID) return alert("Select a main item first.");
    d.children = d.children || [];
    d.children.push({ itemID: "", colorHue:0, colorSaturation:0, scale:0 });
    saveSlot();
    alert("Child added.");
  });

  adminBtn.addEventListener("click", () => {
    const pass = prompt("Enter admin password:");
    if (pass === adminPassword) {
      adminPanel.style.display = "block";
      if (catUnreleasedBtn) catUnreleasedBtn.style.display = "inline-block";
      alert("Admin access granted!");
    } else {
      alert("Incorrect password.");
    }
  });

  overrideHue.addEventListener("input", () => overrideHueVal.textContent = overrideHue.value);
  overrideSat.addEventListener("input", () => overrideSatVal.textContent = overrideSat.value);
  overrideScale.addEventListener("input", () => overrideScaleVal.textContent = overrideScale.value);

  adminOverrideBtn.addEventListener("click", () => {
    const d = slotData[currentSlot];
    if (!d?.itemID) return alert("Assign a main item first.");
    hueSlider.max = +overrideHue.value;
    satSlider.max = +overrideSat.value;
    scaleSlider.max = +overrideScale.value;
    hueSlider.value= hueSlider.max;
    satSlider.value= satSlider.max;
    scaleSlider.value= scaleSlider.max;
    [hueSlider, satSlider, scaleSlider].forEach(s => s.dispatchEvent(new Event('input')));
    saveSlot();
    alert("Overrides applied!");
  });

  addNewItemBtn.addEventListener("click", () => {
    const name = newItemName.value.trim();
    const id = newItemID.value.trim();
    const cat = newItemCategory.value;
    if (!name || !id) return alert("Please fill both name & id");
    if (items.some(x=>x.id===id)) return alert("Duplicate id");
    items.push({ name, id, category: cat });
    items.sort((a,b)=>a.name.localeCompare(b.name));
    const activeCat = categoriesBar.querySelector(".cat-btn.active")?.dataset.cat || "all";
    renderItemGrid(itemSearch.value, activeCat);
    alert(`Added item: ${name}`);
    newItemName.value="";
    newItemID.value="";
  });

  lockPresets.addEventListener("change", () => randomItemsBtn.disabled = lockPresets.checked);
  lockDownloadBtn.addEventListener("change", () => outputEl.style.display = lockDownloadBtn.checked ? "none":"block");

  // ------------ THEME DROPDOWN w/ persistence -------------
  const themeSelect = document.createElement("select");
  themeSelect.id = "themeDropdown";
  ["default","light","animalcompany"].forEach(theme => {
    const opt = document.createElement("option");
    opt.value = theme;
    opt.textContent = theme.charAt(0).toUpperCase()+theme.slice(1);
    themeSelect.appendChild(opt);
  });
  themeSelect.addEventListener("change", () => {
    document.body.classList.remove("light-mode","theme-animalcompany");
    if (themeSelect.value==="light") document.body.classList.add("light-mode");
    if (themeSelect.value==="animalcompany") document.body.classList.add("theme-animalcompany");
    localStorage.setItem("selectedTheme", themeSelect.value);
  });
  document.body.appendChild(themeSelect);
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    themeSelect.value = savedTheme;
    themeSelect.dispatchEvent(new Event("change"));
  }

  // ----------- INIT -----------
  renderItemGrid("", "all");
  loadSlot(currentSlot);
  updateOutputJSON();
});