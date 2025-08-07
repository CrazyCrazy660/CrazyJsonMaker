// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Loadout / Stash toggle
  document.querySelectorAll("input[name='modeToggle']").forEach(radio =>
    radio.addEventListener("change", updateOutputJSON)
  );

  // Button handlers
  document.getElementById("presetDropdown").addEventListener("change", e => {
    if (e.target.value === "galaxy") applyGalaxyPreset();
    else if (e.target.value === "clear") clearBuilder();
    e.target.value = ""; // reset dropdown
  });
  document.getElementById("downloadBtn").addEventListener("click", downloadJSON);
  document.getElementById("filenameInput").addEventListener("input", updateOutputJSON);

  // Theme control
  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener("change", e => applyTheme(e.target.value));
  const savedTheme = localStorage.getItem("theme") || "dark";
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  // Build slots
  bodyParts.forEach(createSlot);
  updateOutputJSON();
});

const bodyParts = ["leftHand", "rightHand", "leftHip", "rightHip", "back"];
let currentMode = "loadout";

const items = [
  { name: "Anti Gravity Grenade", id: "item_anti_gravity_grenade" },
  { name: "Apple", id: "item_apple" },
  { name: "Arena Pistol", id: "item_arena_pistol" },
  { name: "Arena Shotgun", id: "item_arena_shotgun" },
  { name: "Arrow", id: "item_arrow" },
  { name: "Arrow Bomb", id: "item_arrow_bomb" },
  { name: "Arrow Heart", id: "item_arrow_heart" },
  { name: "Arrow Lightbulb", id: "item_arrow_lightbulb" },
  { name: "Arrow Teleport", id: "item_arrow_teleport" },
  { name: "Backpack", id: "item_backpack" },
  { name: "Backpack Black", id: "item_backpack_black" },
  { name: "Backpack Green", id: "item_backpack_green" },
  { name: "Backpack Large Base", id: "item_backpack_large_base" },
  { name: "Backpack Large Basketball", id: "item_backpack_large_basketball" },
  { name: "Backpack Large Clover", id: "item_backpack_large_clover" },
  { name: "Backpack Pink", id: "item_backpack_pink" },
  { name: "Backpack Small Base", id: "item_backpack_small_base" },
  { name: "Backpack White", id: "item_backpack_white" },
  { name: "Backpack with Flashlight", id: "item_backpack_with_flashlight" },
  { name: "Balloon", id: "item_balloon" },
  { name: "Balloon Heart", id: "item_balloon_heart" },
  { name: "Banana", id: "item_banana" },
  { name: "Baseball Bat", id: "item_baseball_bat" },
  { name: "Big Cup", id: "item_big_cup" },
  { name: "Boombox", id: "item_boombox" },
  { name: "Boombox Neon", id: "item_boombox_neon" },
  { name: "Box Fan", id: "item_box_fan" },
  { name: "Brain Chunk", id: "item_brain_chunk" },
  { name: "Broccoli Grenade", id: "item_broccoli_grenade" },
  { name: "Broccoli Shrink Grenade", id: "item_broccoli_shrink_grenade" },
  { name: "Calculator", id: "item_calculator" },
  { name: "Cardboard Box", id: "item_cardboard_box" },
  { name: "CEO Plaque", id: "item_ceo_plaque" },
  { name: "Clapper", id: "item_clapper" },
  { name: "Cluster Grenade", id: "item_cluster_grenade" },
  { name: "Cola", id: "item_cola" },
  { name: "Cola Large", id: "item_cola_large" },
  { name: "Company Ration", id: "item_company_ration" },
  { name: "Company Ration Heal", id: "item_company_ration_heal" },
  { name: "Cracker", id: "item_cracker" },
  { name: "Crate", id: "item_crate" },
  { name: "Crossbow", id: "item_crossbow" },
  { name: "Crossbow Heart", id: "item_crossbow_heart" },
  { name: "Crowbar", id: "item_crowbar" },
  { name: "Cutie Dead", id: "item_cutie_dead" },
  { name: "D20", id: "item_d20" },
  { name: "Disc", id: "item_disc" },
  { name: "Disposable Camera", id: "item_disposable_camera" },
  { name: "Drill", id: "item_drill" },
  { name: "Dynamite", id: "item_dynamite" },
  { name: "Dynamite Cube", id: "item_dynamite_cube" },
  { name: "Egg", id: "item_egg" },
  { name: "Electrical Tape", id: "item_electrical_tape" },
  { name: "Eraser", id: "item_eraser" },
  { name: "Finger Board", id: "item_finger_board" },
  { name: "Flaregun", id: "item_flaregun" },
  { name: "Flashbang", id: "item_flashbang" },
  { name: "Flashlight", id: "item_flashlight" },
  { name: "Flashlight Mega", id: "item_flashlight_mega" },
  { name: "Flashlight Red", id: "item_flashlight_red" },
  { name: "Floppy3", id: "item_floppy3" },
  { name: "Floppy5", id: "item_floppy5" },
  { name: "Football", id: "item_football" },
  { name: "Friend Launcher", id: "item_friend_launcher" },
  { name: "Frying Pan", id: "item_frying_pan" },
  { name: "Gameboy", id: "item_gameboy" },
  { name: "Glowstick", id: "item_glowstick" },
  { name: "Gold Bar", id: "item_goldbar" },
  { name: "Gold Coin", id: "item_goldcoin" },
  { name: "Goop", id: "item_goop" },
  { name: "Goopfish", id: "item_goopfish" },
  { name: "Grenade", id: "item_grenade" },
  { name: "Grenade Gold", id: "item_grenade_gold" },
  { name: "Grenade Launcher", id: "item_grenade_launcher" },
  { name: "Hard Drive", id: "item_harddrive" },
  { name: "Hawaiian Drum", id: "item_hawaiian_drum" },
  { name: "Heart Chunk", id: "item_heart_chunk" },
  { name: "Heart Gun", id: "item_heart_gun" },
  { name: "Heart Chocolate Box", id: "item_heartchocolatebox" },
  { name: "Haunted House Key", id: "item_hh_key" },
  { name: "Hookshot", id: "item_hookshot" },
  { name: "Hookshot Sword", id: "item_hookshot_sword" },
  { name: "Hoverpad", id: "item_hoverpad" },
  { name: "Impulse Grenade", id: "item_impulse_grenade" },
  { name: "Jetpack", id: "item_jetpack" },
  { name: "Keycard", id: "item_keycard" },
  { name: "Lance", id: "item_lance" },
  { name: "Landmine", id: "item_landmine" },
  { name: "Large Banana", id: "item_large_banana" },
  { name: "Mug", id: "item_mug" },
  { name: "Nut", id: "item_nut" },
  { name: "Nut Drop", id: "item_nut_drop" },
  { name: "Ogre Hands", id: "item_ogre_hands" },
  { name: "Painting Canvas", id: "item_painting_canvas" },
  { name: "Paperpack", id: "item_paperpack" },
  { name: "Pelican Case", id: "item_pelican_case" },
  { name: "Pickaxe", id: "item_pickaxe" },
  { name: "Pickaxe CNY", id: "item_pickaxe_cny" },
  { name: "Pickaxe Cube", id: "item_pickaxe_cube" },
  { name: "Pinata Bat", id: "item_pinata_bat" },
  { name: "Pipe", id: "item_pipe" },
  { name: "Plunger", id: "item_plunger" },
  { name: "Pogostick", id: "item_pogostick" },
  { name: "Police Baton", id: "item_police_baton" },
  { name: "Portable Teleporter", id: "item_portable_teleporter" },
  { name: "Pumpkin Pie", id: "item_pumpkin_pie" },
  { name: "Pumpkinjack", id: "item_pumpkinjack" },
  { name: "Pumpkinjack Small", id: "item_pumpkinjack_small" },
  { name: "Quiver", id: "item_quiver" },
  { name: "Quiver Heart", id: "item_quiver_heart" },
  { name: "Radioactive Broccoli", id: "item_radioactive_broccoli" },
  { name: "Random Box Mobloot Big", id: "item_randombox_mobloot_big" },
  { name: "Random Box Mobloot Medium", id: "item_randombox_mobloot_medium" },
  { name: "Random Box Mobloot Small", id: "item_randombox_mobloot_small" },
  { name: "Random Box Mobloot Weapons", id: "item_randombox_mobloot_weapons" },
  { name: "Random Box Mobloot Zombie", id: "item_randombox_mobloot_zombie" },
  { name: "Rare Card", id: "item_rare_card" },
  { name: "Revolver", id: "item_revolver" },
  { name: "Revolver Ammo", id: "item_revolver_ammo" },
  { name: "Revolver Gold", id: "item_revolver_gold" },
  { name: "Robo Monke", id: "item_robo_monke" },
  { name: "Rope", id: "item_rope" },
  { name: "RPG", id: "item_rpg" },
  { name: "RPG Ammo", id: "item_rpg_ammo" },
  { name: "RPG CNY", id: "item_rpg_cny" },
  { name: "Ruby", id: "item_ruby" },
  { name: "Rubber Ducky", id: "item_rubberducky" },
  { name: "Saddle", id: "item_saddle" },
  { name: "Scanner", id: "item_scanner" },
  { name: "Scissors", id: "item_scissors" },
  { name: "Shield", id: "item_shield" },
  { name: "Shield Bones", id: "item_shield_bones" },
  { name: "Shield Police", id: "item_shield_police" },
  { name: "Shield Viking 1", id: "item_shield_viking_1" },
  { name: "Shield Viking 2", id: "item_shield_viking_2" },
  { name: "Shield Viking 3", id: "item_shield_viking_3" },
  { name: "Shield Viking 4", id: "item_shield_viking_4" },
  { name: "Shotgun", id: "item_shotgun" },
  { name: "Shotgun Ammo", id: "item_shotgun_ammo" },
  { name: "Shrinking Broccoli", id: "item_shrinking_broccoli" },
  { name: "Silver Ore S", id: "item_ore_silver_s" },
  { name: "Silver Ore M", id: "item_ore_silver_m" },
  { name: "Silver Ore L", id: "item_ore_silver_l" },
  { name: "Small Gold Ore", id: "item_ore_gold_s" },
  { name: "Medium Gold Ore", id: "item_ore_gold_m" },
  { name: "Large Gold Ore", id: "item_ore_gold_l" },
  { name: "Small Uranium Chunk", id: "item_uranium_chunk_s" },
  { name: "Medium Uranium Chunk", id: "item_uranium_chunk_m" },
  { name: "Large Uranium Chunk", id: "item_uranium_chunk_l" },
  { name: "Small Copper Ore", id: "item_ore_copper_s" },
  { name: "Medium Copper Ore", id: "item_ore_copper_m" },
  { name: "Large Copper Ore", id: "item_ore_copper_l" },
  { name: "Snowball", id: "item_snowball" },
  { name: "Spear RPG", id: "item_rpg_spear" },
  { name: "Spear RPG Ammo", id: "item_rpg_ammo_spear" },
  { name: "Stash Grenade", id: "item_stash_grenade" },
  { name: "Stapler", id: "item_stapler" },
  { name: "Sticker Dispenser", id: "item_sticker_dispenser" },
  { name: "Stick", id: "item_treestick" },
  { name: "Stick Armbones", id: "item_stick_armbones" },
  { name: "Stick Bone", id: "item_stick_bone" },
  { name: "Stinky Cheese", id: "item_stinky_cheese" },
  { name: "Suitcase", id: "item_pelican_case" },
  { name: "Tablet", id: "item_tablet" },
  { name: "Tape Dispenser", id: "item_tapedispenser" },
  { name: "Teleport Grenade", id: "item_tele_grenade" },
  { name: "Teleport Gun", id: "item_teleport_gun" },
  { name: "Theremin", id: "item_theremin" },
  { name: "Time Bomb", id: "item_timebomb" },
  { name: "Toilet Paper", id: "item_toilet_paper" },
  { name: "Toilet Paper Mega", id: "item_toilet_paper_mega" },
  { name: "Toilet Paper Roll Empty", id: "toilet_paper_roll_empty" },
  { name: "Tripwire Explosive", id: "item_tripwire_explosive" },
  { name: "Trophy", id: "item_trophy" },
  { name: "Turkey", id: "item_turkey_whole" },
  { name: "Turkey Leg", id: "item_turkey_leg" },
  { name: "Ukelele", id: "item_ukulele" },
  { name: "Ukelele Gold", id: "item_ukulele_gold" },
  { name: "Umbrella", id: "item_umbrella" },
  { name: "Umbrella Clover", id: "item_umbrella_clover" },
  { name: "Upsidedown Loot", id: "item_upsidedown_loot" },
  { name: "Viking Hammer", id: "item_viking_hammer" },
  { name: "Weapons Mob Loot Box", id: "item_randombox_mobloot_weapons" },
  { name: "Whoopie Cushion", id: "item_whoopie" },
  { name: "Zombie Meat", id: "item_zombie_meat" },
  { name: "Zombie Mob Loot Box", id: "item_randombox_mobloot_zombie" }
];

function createSlot(slot) {
  const container = document.getElementById("builder");
  const div = document.createElement("div");
  div.dataset.slot = slot;

  const h2 = document.createElement("h2");
  h2.textContent = slot;
  div.appendChild(h2);

  const block = createItemBlock();
  div.appendChild(block);
  container.appendChild(div);
}

function createItemBlock() {
  const wrapper = document.createElement("div");
  wrapper.className = "item-block";

  const select = document.createElement("select");
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "-- Select Item --";
  select.appendChild(none);

  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name;
    select.appendChild(opt);
  });

  const hue = makeSlider("Hue", 0, 240, 0);
  const sat = makeSlider("Saturation", -120, 200, 0);
  const scale = makeSlider("Scale", -128, 127, 0);
  const state = makeNumberInput("State", 0);
  const count = makeNumberInput("Count", 1);

  [select, hue.input, sat.input, scale.input, state.input, count.input]
    .forEach(el => el.addEventListener("input", updateOutputJSON));

  wrapper.append(select, hue.wrapper, sat.wrapper, scale.wrapper, state.wrapper, count.wrapper);

  wrapper.toJSON = () => {
    if (!select.value) return null;
    return {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
  };

  wrapper.toStash = () => {
    if (!select.value) return null;
    return {
      itemID: select.value,
      state: +state.input.value,
      count: +count.input.value
    };
  };

  return wrapper;
}

function makeSlider(label, min, max, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const labelEl = document.createElement("label");
  labelEl.textContent = `${label}: `;
  const span = document.createElement("span");
  span.textContent = defaultVal;
  labelEl.append(span);

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.value = defaultVal;

  input.oninput = () => {
    span.textContent = input.value;
    updateOutputJSON();
  };

  wrapper.append(labelEl, input);
  return { wrapper, input };
}

function makeNumberInput(label, defaultVal) {
  const wrapper = document.createElement("div");
  wrapper.className = "input-column";

  const labelEl = document.createElement("label");
  labelEl.textContent = `${label}: `;
  const input = document.createElement("input");
  input.type = "number";
  input.value = defaultVal;
  labelEl.append(input);

  input.addEventListener("input", updateOutputJSON);
  wrapper.append(labelEl);
  return { wrapper, input };
}

function collectData() {
  if (currentMode === "loadout") {
    const result = { version: 1 };
    bodyParts.forEach(slot => {
      const block = document.querySelector(`[data-slot="${slot}"] .item-block`);
      const data = block?.toJSON?.();
      result[slot] = data || {};
    });
    return result;
  } else {
    const result = { itemList: [] };
    bodyParts.forEach(slot => {
      const block = document.querySelector(`[data-slot="${slot}"] .item-block`);
      const data = block?.toStash?.();
      if (data) result.itemList.push(data);
    });
    return result;
  }
}

function updateOutputJSON() {
  currentMode = document.querySelector("input[name='modeToggle']:checked").value;
  const json = collectData();
  document.getElementById("output").textContent = JSON.stringify(json, null, 2);
  localStorage.setItem("animalCompanyJson", document.getElementById("output").textContent);
}

function downloadJSON() {
  const data = document.getElementById("output").textContent;
  const filename = (document.getElementById("filenameInput").value || "output") + ".json";
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function clearBuilder() {
  if (!confirm("Clear all slots?")) return;
  document.getElementById("builder").innerHTML = "";
  bodyParts.forEach(createSlot);
  updateOutputJSON();
}

function applyGalaxyPreset() {
  // Example: set random values
  document.querySelectorAll(".item-block").forEach(block => {
    const sliders = block.querySelectorAll("input[type=range]");
    sliders.forEach(s => {
      const val = Math.floor(Math.random() * (s.max - s.min)) + +s.min;
      s.value = val;
      s.dispatchEvent(new Event("input"));
    });
  });
}

function applyTheme(theme) {
  document.body.classList.remove("light", "dark", "animal");
  document.body.classList.add(theme);
  localStorage.setItem("theme", theme);
}