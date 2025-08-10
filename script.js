// === Item List Example (Replace with your full item list) ===
const items = [
    { name: "Apple", id: "item_apple" },
    { name: "Banana", id: "item_banana" },
    { name: "Backpack", id: "item_backpack" },
    { name: "Grenade", id: "item_grenade" }
];

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