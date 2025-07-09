// — DATA & SETUP
let items = [
  { name: "Apple", id: "item_apple" },
  /* ... your full original items list ... */
  { name: "Zombie Mob Loot Box", id: "item_randombox_mobloot_zombie" }
].sort((a,b)=>a.name.localeCompare(b.name));

const bodyParts = ["leftHand","rightHand","leftHip","rightHip","back"];
const builder = document.getElementById("builder");
const output = document.getElementById("output");
let selectedBlock = null, autoRandomize = false;

// — AUTO‑RANDOM TOGGLE
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "🎲 Auto Random: OFF";
toggleBtn.onclick = () => {
  autoRandomize = !autoRandomize;
  toggleBtn.textContent = `🎲 Auto Random: ${autoRandomize?"ON":"OFF"}`;
  saveBuilderState();
};
document.body.insertBefore(toggleBtn, builder);

// — JSON OUTPUT & SAVE
function updateOutputJSON(){
  const res={version:1};
  document.querySelectorAll("[data-slot]").forEach(s=>{
    const b=s.querySelector(".item-block");
    if(b) res[s.dataset.slot] = b.toJSON() || {};
  });
  const jsonStr = JSON.stringify(res,null,2);
  output.textContent = jsonStr;
  localStorage.setItem("animalCompanyJson", jsonStr);
}

// — SLIDER CREATOR
function makeSlider(label, min, max, def){
  const w=document.createElement("div"), inp=document.createElement("input");
  w.className="input-column";
  inp.type="range"; inp.min=min; inp.max=max; inp.value=def;
  const lbl=document.createElement("label"), span=document.createElement("span");
  lbl.textContent=`${label}: `; span.textContent=inp.value; lbl.append(span);
  const btn=document.createElement("button"); btn.textContent="🎲";
  btn.onclick=()=>{
    const v = label==="Scale"
      ? Math.floor(Math.random()*256)-128
      : label==="Saturation"
        ? Math.floor(Math.random()*321)-120
        : Math.floor(Math.random()*241);
    inp.value=v; inp.dispatchEvent(new Event("input"));
  };
  inp.oninput = ()=>{ span.textContent=inp.value; updateOutputJSON(); };
  w.append(lbl, inp, btn);
  return { input: inp, wrapper: w };
}

// — ITEM BLOCK WITH SEARCH
function originalCreateItemBlock(){
  const wrapper = document.createElement("div");
  wrapper.className="item-block";

  // Search & Select
  const sd=document.createElement("div");
  sd.style.display="flex"; sd.style.flexDirection="column";
  const search=document.createElement("input");
  search.placeholder="Search items..."; search.style.marginBottom="4px";
  const select=document.createElement("select");
  const opts = [];
  const noneOption = document.createElement("option");
  noneOption.value=""; noneOption.textContent="-- None --";
  select.append(noneOption); opts.push(noneOption);
  items.forEach(it => { const o=document.createElement("option"); o.value=it.id; o.textContent=it.name; select.append(o); opts.push(o); });
  search.oninput = ()=>{
    const q = search.value.toLowerCase();
    select.innerHTML = "";
    opts.forEach(o => {
      if(!o.value || o.textContent.toLowerCase().includes(q)) select.append(o);
    });
  };
  sd.append(search, select);

  // Sliders
  const row = document.createElement("div"); row.className="input-row";
  const hue = makeSlider("Hue",0,240,0),
        sat = makeSlider("Saturation",-120,200,0),
        scale = makeSlider("Scale",-128,127,0);
  row.append(hue.wrapper, sat.wrapper, scale.wrapper);

  // Children & Buttons
  const children = document.createElement("div"); children.className="children";
  const ctrl = document.createElement("div");
  ctrl.style="margin-top:10px; display:flex; gap:10px";
  const addBtn = document.createElement("button"); addBtn.textContent="➕ Add Child";
  addBtn.onclick = ()=>{
    children.appendChild(createItemBlock());
    updateOutputJSON();
  };
  const delBtn = document.createElement("button"); delBtn.textContent="🗑️ Delete";
  delBtn.onclick = ()=>{
    if(wrapper.parentElement.classList.contains("children")){
      wrapper.remove(); updateOutputJSON();
    } else alert("Can't delete root block.");
  };
  ctrl.append(addBtn, delBtn);

  wrapper.append(sd, row, ctrl, children);

  wrapper.toJSON = ()=>{
    if(!select.value) return null;
    const json = {
      itemID: select.value,
      colorHue: +hue.input.value,
      colorSaturation: +sat.input.value,
      scale: +scale.input.value
    };
    const kids = Array.from(children.children).map(c=>c.toJSON()).filter(Boolean);
    if(kids.length) json.children = kids;
    return json;
  };

  wrapper.onclick = e=>{
    e.stopPropagation();
    if(selectedBlock) selectedBlock.style.outline="";
    selectedBlock = wrapper;
    wrapper.style.outline="2px solid red";
  };

  return wrapper;
}
function createItemBlock(){
  const b = originalCreateItemBlock();
  if(autoRandomize) b.querySelectorAll("input[type=range]").forEach(i=>i.dispatchEvent(new Event("input")));
  return b;
}

// — SLOTS & INITIALIZATION
function createSlot(slot){
  const div = document.createElement("div");
  div.dataset.slot = slot;
  const title = document.createElement("h2");
  title.textContent = slot;
  div.append(title, createItemBlock());
  builder.append(div);
}
function loadSavedBuilder(){
  const saved = localStorage.getItem("animalCompanyJson");
  if(saved){
    try {
      const data = JSON.parse(saved);
      if(data.version===1){
        builder.innerHTML="";
        bodyParts.forEach(slot=>{
          const div = document.createElement("div");
          div.dataset.slot = slot;
          const title = document.createElement("h2");
          title.textContent = slot;
          div.append(title, createItemBlock());
          builder.append(div);
          if(data[slot]){
            const block = div.querySelector(".item-block");
            block.querySelector("select").value = data[slot].itemID;
            const sl = block.querySelectorAll("input[type=range]");
            sl[0].value = data[slot].colorHue;
            sl[1].value = data[slot].colorSaturation;
            sl[2].value = data[slot].scale;
          }
        });
        updateOutputJSON();
        return;
      }
    } catch {}
  }
  bodyParts.forEach(createSlot);
  updateOutputJSON();
}

// — ADMIN PASSWORD & OVERRIDE
const actualPassword = "CrazyJson";
const decoys = [
  "CrazyWaffle2930","CrazyRobot1832","CrazyBeard7890","CrazyStorm4921",
  /* … up to 50 items */
  "CrazyGlove1110"
];
decoys.splice(Math.floor(Math.random()*30)+10,0,actualPassword);
const validAdminPasswords = decoys;

document.getElementById("adminBtn").addEventListener("click", ()=>{
  setTimeout(()=>{
    const p = prompt("Enter admin password:");
    if(!p) return;
    if(validAdminPasswords.includes(p)){
      if(p===actualPassword){
        document.getElementById("adminPanel").style.display = "block";
        alert("Admin access granted!");
      } else alert("Nice try... wrong password 😅");
    } else alert("Incorrect password.");
  },50);
});

// — OVERRIDE BUTTON
document.getElementById("adminOverrideBtn").addEventListener("click", ()=>{
  if(!selectedBlock) return alert("Select a block first!");
  selectedBlock.querySelectorAll("input[type=range]").forEach(sl=>{
    sl.max = 1000; sl.value = 1000; sl.dispatchEvent(new Event("input"));
  });
  alert("🎉 Overridden to 1000!");
});

// — ADD ITEM via Admin Panel
document.getElementById("addNewItemBtn").addEventListener("click", ()=>{
  const name = document.getElementById("newItemName").value.trim();
  const id = document.getElementById("newItemID").value.trim();
  if(!name||!id) return alert("Please fill both fields.");
  if(items.some(it=>it.name===name||it.id===id)) return alert("Duplicate name or ID.");
  items.push({ name, id });
  items.sort((a,b)=>a.name.localeCompare(b.name));
  document.querySelectorAll(".item-block").forEach(block=>{
    const search = block.querySelector("input[placeholder='Search items...']");
    const select = block.querySelector("select");
    const opt = document.createElement("option");
    opt.value=id; opt.textContent=name;
    select.append(opt);
    Array.from(select.options)
      .sort((a,b)=>a.text.localeCompare(b.text))
      .forEach(o=>select.appendChild(o));
    search.dispatchEvent(new Event("input"));
  });
  alert(`Added "${name}".`);
  document.getElementById("newItemName").value = "";
  document.getElementById("newItemID").value = "";
  saveBuilderState();
});

// — PRESET, DOWNLOAD, CLEAR
document.getElementById("presetDropdown").addEventListener("change", e=>{
  const v=e.target.value;
  if(v==="galaxy"){
    if(!selectedBlock) return alert("Select a block first!");
    const sl = selectedBlock.querySelectorAll("input[type=range]");
    sl[0].value=180; sl[1].value=117;
    sl.forEach(i=>i.dispatchEvent(new Event("input")));
  } else if(v==="clear"){
    if(!confirm("Clear everything?")) return;
    builder.innerHTML=""; selectedBlock=null;
    bodyParts.forEach(createSlot);
    output.textContent="";
    localStorage.removeItem("animalCompanyJson");
  }
  e.target.value="";
});

document.getElementById("downloadBtn").onclick = ()=>{
  const j = output.textContent;
  const fn = (document.getElementById("filenameInput").value||"CrazyJsons") + ".json";
  const blob = new Blob([j],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fn;
  a.click();
};

document.getElementById("clearBtn")?.addEventListener("click", ()=>{
  if(!confirm("Clear everything?")) return;
  builder.innerHTML=""; selectedBlock=null;
  bodyParts.forEach(createSlot);
  output.textContent="";
  localStorage.removeItem("animalCompanyJson");
});

// — INIT —
loadSavedBuilder();
