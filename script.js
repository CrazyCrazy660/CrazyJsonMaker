// === Item List Example (Replace with your full item list) ===
const items = [
  { name: "Apple", id: "item_apple" },
  { name: "Anti Gravity Grenade", id: "item_anti_gravity_grenade" },
  { name: "Armbone Stick", id: "item_stick_armbones" },
  { name: "Arrow", id: "item_arrow" },
  { name: "Backpack", id: "item_backpack" },
  { name: "Backpack w/ Flashlight", id: "item_backpack_with_flashlight" },
  { name: "Balloon", id: "item_balloon" },
  { name: "Banana", id: "item_banana" },
  { name: "Baseball Bat", id: "item_baseball_bat" },
  { name: "Big Cup", id: "item_big_cup" },
  { name: "Big Mob Loot Box", id: "item_randombox_mobloot_big" },
  { name: "Black Backpack", id: "item_backpack_black" },
  { name: "Boombox", id: "item_boombox" },
  { name: "Bone Shield", id: "item_shield_bones" },
  { name: "Bone Stick", id: "item_stick_bone" },
  { name: "Box Fan", id: "item_box_fan" },
  { name: "Broccoli Grenade", id: "item_broccoli_grenade" },
  { name: "Calculator", id: "item_calculator" },
  { name: "Camera", id: "item_disposable_camera" },
  { name: "Cardboard Box", id: "item_cardboard_box" },
  { name: "CEO Plaque", id: "item_ceo_plaque" },
  { name: "Clapper", id: "item_clapper" },
  { name: "Clover Umbrella", id: "item_umbrella_clover" },
  { name: "Cluster Grenade", id: "item_cluster_grenade" },
  { name: "Cola", id: "item_cola" },
  { name: "Company Ration", id: "item_company_ration" },
  { name: "Cracker", id: "item_cracker" },
  { name: "Crossbow", id: "item_crossbow" },
  { name: "Cube Dynamite", id: "item_dynamite_cube" },
  { name: "Cube Pickaxe", id: "item_pickaxe_cube" },
  { name: "D29", id: "item_d29" },
  { name: "Disc", id: "item_disc" },
  { name: "Dynamite", id: "item_dynamite" },
  { name: "Easter Rpg", id: "item_rpg_easter" },
  { name: "Egg RPG Ammo", id: "item_rpg_ammo_egg" },
  { name: "Egg🤑", id: "item_egg" },
  { name: "Empty Toilet Paper Roll", id: "toilet_paper_roll_empty" },
  { name: "Fart", id: "Item_Fart" },
  { name: "Finger Board", id: "item_finger_board" },
  { name: "Flashbang", id: "item_flashbang" },
  { name: "Flashlight", id: "item_flashlight" },
  { name: "Flaregun", id: "item_flaregun" },
  { name: "Floating Shield", id: "item_shield" },
  { name: "Floppy3", id: "item_floppy3" },
  { name: "Floppy5", id: "item_floppy5" },
  { name: "Football", id: "item_football" },
  { name: "Frying Pan", id: "item_frying_pan" },
  { name: "Galaxy Ukelele", id: "item_ukulele_gold" },
  { name: "Gameboy", id: "item_gameboy" },
  { name: "Glowstick", id: "item_glowstick" },
  { name: "Golden Coin", id: "item_goldcoin" },
  { name: "Golden Grenade", id: "item_grenade_gold" },
  { name: "Gold Bar", id: "item_goldbar" },
  { name: "Gold Revolver", id: "item_revolver_gold" },
  { name: "Goop Stick", id: "item_goop_stick" },
  { name: "Green Backpack", id: "item_backpack_green" },
  { name: "Grenade", id: "item_grenade" },
  { name: "Haunted House Key", id: "item_hh_key" },
  { name: "Heart Arrow", id: "item_arrow_heart" },
  { name: "Heart Balloon", id: "item_balloon_heart" },
  { name: "Heart Chocolate Box", id: "item_heartchocolatebox" },
  { name: "Heart Crossbow", id: "item_crossbow_heart" },
  { name: "Heart Gun", id: "item_heart_gun" },
  { name: "Heart Quiver", id: "item_quiver_heart" },
  { name: "Healing Ration", id: "item_company_ration_heal" },
  { name: "Hell Ore", id: "item_ore_hell" },
  { name: "Hookshot", id: "item_hookshot" },
  { name: "Hookshot Sword", id: "item_hookshot_sword" },
  { name: "Hoverpad", id: "item_hoverpad" },
  { name: "Impulse Grenade", id: "item_impulse_grenade" },
  { name: "Jetpack", id: "item_jetpack" },
  { name: "Keycard", id: "item_keycard" },
  { name: "Lance", id: "item_lance" },
  { name: "Landmine", id: "item_landmine" },
  { name: "Large Backpack", id: "item_backpack_large_base" },
  { name: "Large Banana", id: "item_large_banana" },
  { name: "Large Basketball Backpack", id: "item_backpack_large_basketball" },
  { name: "Large Clover Backpack", id: "item_backpack_large_clover" },
  { name: "Large Cola", id: "item_cola_large" },
  { name: "Large Copper Ore", id: "ore_copper_l" },
  { name: "Large Gold Ore", id: "item_ore_gold_l" },
  { name: "Large Silver Ore", id: "item_ore_silver_l" },
  { name: "Large Uranium Chunk", id: "item_uranium_chunk_l" },
  { name: "Lightbulb Arrow", id: "item_arrow_lightbulb" },
  { name: "Medium Copper Ore", id: "item_ore_copper_m" },
  { name: "Medium Gold Ore", id: "item_ore_gold_m" },
  { name: "Medium Mob Loot Box", id: "item_randombox_mobloot_medium" },
  { name: "Medium Silver Ore", id: "item_ore_silver_m" },
  { name: "Medium Uranium Chunk", id: "item_uranium_chunk_m" },
  { name: "Mega Flashlight", id: "item_flashlight_mega" },
  { name: "Mega Toilet Paper", id: "item_toilet_paper_mega" },
  { name: "Mug", id: "item_mug" },
  { name: "Neon Boombox", id: "item_boombox_neon" },
  { name: "Nut", id: "item_nut" },
  { name: "Nut Drop", id: "item_nut_drop" },
  { name: "Ogre Hands", id: "item_ogre_hands" },
  { name: "Painting Canvas", id: "item_painting_canvas" },
  { name: "Paperpack", id: "item_paperpack" },
  { name: "Pelican Case", id: "item_pelican_case" },
  { name: "Pickaxe", id: "item_pickaxe" },
  { name: "Pickaxe (CNY)", id: "item_pickaxe_cny" },
  { name: "Pinata Bat", id: "item_pinata_bat" },
  { name: "Pipe", id: "item_pipe" },
  { name: "Plunger", id: "item_plunger" },
  { name: "Pokémon Card", id: "item_rare_card" },
  { name: "Police Baton", id: "item_police_baton" },
  { name: "Police Shield", id: "item_shield_police" },
  { name: "Pogostick", id: "item_pogostick" },
  { name: "Pumpkin Pie", id: "item_pumpkin_pie" },
  { name: "Pumpkinjack", id: "item_pumpkinjack" },
  { name: "Purple Broccoli", id: "item_radioactive_broccoli" },
  { name: "Purple Broccoli Grenade", id: "item_broccoli_shrink_grenade" },
  { name: "Quest VHS", id: "item_quest_vhs" }, // ✅ NEW ITEM
  { name: "Quiver", id: "item_quiver" },
  { name: "Revolver", id: "item_revolver" },
  { name: "Revolver Ammo", id: "item_revolver_ammo" },
  { name: "Robo Monke", id: "item_robo_monke" },
  { name: "Rope", id: "item_rope" },
  { name: "Rpg", id: "item_rpg" },
  { name: "RPG (CNY)", id: "item_rpg_cny" },
  { name: "Ruby", id: "item_ruby" },
  { name: "Rubber Ducky", id: "item_rubberducky" },
  { name: "Saddle", id: "item_saddle" },
  { name: "Scanner", id: "item_scanner" },
  { name: "Scissors", id: "item_scissors" },
  { name: "Shield", id: "item_shield" },
  { name: "Shotgun", id: "item_shotgun" },
  { name: "Shotgun Ammo", id: "item_shotgun_ammo" },
  { name: "Shrinking Broccoli", id: "item_shrinking_broccoli" },
  { name: "Silver Ore (Small)", id: "item_ore_silver_s" },
  { name: "Small Backpack", id: "item_backpack_small_base" },
  { name: "Small Copper Ore", id: "item_ore_copper_s" },
  { name: "Small Gold Ore", id: "item_ore_gold_s" },
  { name: "Small Uranium Chunk", id: "item_uranium_chunk_s" },
  { name: "Snowball", id: "item_snowball" },
  { name: "Spear RPG", id: "tem_rpg_spear" },
  { name: "Spear RPG Ammo", id: "item_rpg_ammo_spear" },
  { name: "Stash Grenade", id: "item_stash_grenade" },
  { name: "Stapler", id: "item_stapler" },
  { name: "Sticker Dispenser", id: "item_sticker_dispenser" },
  { name: "Stick", id: "item_treestick" },
  { name: "Stinky Cheese", id: "item_stinky_cheese" },
  { name: "Suitcase", id: "item_pelican_case" },
  { name: "Table", id: "item_tablet" },
  { name: "Tape Dispenser", id: "item_tapedispenser" },
  { name: "Teleport Grenade", id: "item_tele_grenade" },
  { name: "Teleport Gun", id: "item_teleport_gun" },
  { name: "Theremin", id: "item_theremin" },
  { name: "Time Bomb", id: "item_timebomb" },
  { name: "Toilet Paper", id: "item_toilet_paper" },
  { name: "Tripwire Explosive", id: "item_tripwire_explosive" },
  { name: "Trophy", id: "item_trophy" },
  { name: "Turkey", id: "item_turkey_whole" },
  { name: "Turkey Leg", id: "item_turkey_leg" },
  { name: "Ukelele", id: "item_ukulele" },
  { name: "Umbrella", id: "item_umbrella" },
  { name: "Upsidedown Loot", id: "item_upsidedown_loot" },
  { name: "Viking Hammer", id: "item_viking_hammer" },
  { name: "Viking Shield 1", id: "item_shield_viking_1" },
  { name: "Viking Shield 2", id: "item_shield_viking_2" },
  { name: "Viking Shield 3", id: "item_shield_viking_3" },
  { name: "Viking Shield 4", id: "item_shield_viking_4" },
  { name: "Weapons Mob Loot Box", id: "item_randombox_mobloot_weapons" },
  { name: "White Backpack", id: "item_backpack_white" },
  { name: "Whoopie Cushion", id: "item_whoopie" },
  { name: "Zombie Meat", id: "item_zombie_meat" },
  { name: "Zombie Mob Loot Box", id: "item_randombox_mobloot_zombie" }
];
].sort((a, b) => a.name.localeCompare(b.name));

// === State ===
let currentSlot = null;
let loadout = {};
let children = [];
let hue = 0, saturation = 0, scale = 0;

// === Populate Item Dropdown ===
const itemSelect = document.getElementById("itemSelect");
items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name;
    itemSelect.appendChild(opt);
});

// === Slot Selection ===
document.querySelectorAll(".slot-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".slot-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSlot = btn.dataset.slot;
        if (!loadout[currentSlot]) {
            loadout[currentSlot] = { item: null, hue: 0, saturation: 0, scale: 0, children: [] };
        }
        updateJSONPreview();
    });
});

// === Search Filter ===
const itemSearch = document.getElementById("itemSearch");
itemSearch.addEventListener("input", () => {
    const searchValue = itemSearch.value.toLowerCase();
    const match = items.find(i => i.name.toLowerCase().includes(searchValue));
    if (match && currentSlot) {
        loadout[currentSlot].item = match.id;
        updateJSONPreview();
    }
});

// === Manual Item Select ===
itemSelect.addEventListener("change", () => {
    if (currentSlot && itemSelect.value) {
        loadout[currentSlot].item = itemSelect.value;
        updateJSONPreview();
    }
});

// === Sliders ===
document.getElementById("scaleSlider").addEventListener("input", e => {
    scale = parseInt(e.target.value);
    document.getElementById("scaleValue").textContent = scale;
    if (currentSlot) {
        loadout[currentSlot].scale = scale;
        updateJSONPreview();
    }
});

document.getElementById("hueSlider").addEventListener("input", e => {
    hue = parseInt(e.target.value);
    document.getElementById("hueValue").textContent = hue + "°";
    updateColorPreview();
    if (currentSlot) {
        loadout[currentSlot].hue = hue;
        updateJSONPreview();
    }
});

document.getElementById("saturationSlider").addEventListener("input", e => {
    saturation = parseInt(e.target.value);
    document.getElementById("saturationValue").textContent = saturation;
    updateColorPreview();
    if (currentSlot) {
        loadout[currentSlot].saturation = saturation;
        updateJSONPreview();
    }
});

// === Color Preview Update ===
function updateColorPreview() {
    const rgb = hslToRgb((hue % 360) / 360, (saturation + 127) / 254, 0.5);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    document.getElementById("colorPreview").style.backgroundColor = hex;
    document.getElementById("hexCode").textContent = hex;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

// === Child Items ===
document.getElementById("addChildBtn").addEventListener("click", () => {
    if (currentSlot) {
        const childName = prompt("Enter child item name:");
        if (childName) {
            loadout[currentSlot].children.push(childName);
            updateChildList();
            updateJSONPreview();
        }
    }
});

function updateChildList() {
    const list = document.getElementById("childList");
    list.innerHTML = "";
    if (currentSlot && loadout[currentSlot].children) {
        loadout[currentSlot].children.forEach((c, i) => {
            const li = document.createElement("li");
            li.textContent = c;
            list.appendChild(li);
        });
    }
}

// === JSON Preview ===
function updateJSONPreview() {
    document.getElementById("jsonPreview").textContent = JSON.stringify(loadout, null, 2);
}

// === Theme Selector ===
const themeSelector = document.getElementById("themeSelector");
if (localStorage.getItem("theme")) {
    document.body.className = localStorage.getItem("theme");
    themeSelector.value = localStorage.getItem("theme");
}
themeSelector.addEventListener("change", () => {
    document.body.className = themeSelector.value;
    localStorage.setItem("theme", themeSelector.value);
});