// ── STATE ──
const DB = {
    residents: [],
    welcoming: [],
    officers: [],
    former: []
};
let currentModule = null;
let editIndex = null;
let deleteTarget = {
    module: null,
    index: null
};
// ── NAV ──
function showPanel(name, navEl) {
    document.querySelectorAll(".panel").forEach((p)=>p.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach((n)=>n.classList.remove("active"));
    document.getElementById("panel-" + name).classList.add("active");
    if (navEl) navEl.classList.add("active");
    else document.querySelectorAll(".nav-item").forEach((n)=>{
        if (n.textContent.toLowerCase().includes(name.split("-")[0])) n.classList.add("active");
    });
    const labels = {
        dashboard: "DASHBOARD",
        residents: "RESIDENTS",
        welcoming: "WELCOMING",
        officers: "OFFICERS",
        former: "FORMER OFFICERS"
    };
    document.getElementById("topbarTitle").textContent = labels[name] || name.toUpperCase();
    setBottomNav(name);
    closeSidebar();
}
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("overlayBg").classList.toggle("open");
}
function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlayBg").classList.remove("open");
}
// ── MODAL ──
const FIELDS = {
    residents: [
        {
            id: "fullname",
            label: "Full Name",
            type: "text",
            placeholder: "e.g. Juan Dela Cruz",
            full: true
        },
        {
            id: "alias",
            label: "Alexis",
            type: "text",
            placeholder: "Alexis"
        },
        {
            id: "bday",
            label: "Birthdate",
            type: "date"
        },
        {
            id: "gtname",
            label: "GT Name",
            type: "text",
            placeholder: "GT Name",
            full: true
        }
    ],
    welcoming: [
        {
            id: "fullname",
            label: "Full Name",
            type: "text",
            placeholder: "e.g. Juan Dela Cruz",
            full: true
        },
        {
            id: "alias",
            label: "Alexis",
            type: "text",
            placeholder: "Alexis"
        },
        {
            id: "bday",
            label: "Birthdate",
            type: "date"
        }
    ],
    officers: [
        {
            id: "fullname",
            label: "Full Name",
            type: "text",
            placeholder: "e.g. Juan Dela Cruz",
            full: true
        },
        {
            id: "alias",
            label: "Alexis",
            type: "text",
            placeholder: "Alexis"
        },
        {
            id: "position",
            label: "Position",
            type: "select",
            options: [
                "Grand Triskelion",
                "Deputy Grand Triskelion",
                "Secretary General",
                "Treasurer",
                "Auditor",
                "PRO",
                "Sergeant-at-Arms",
                "Chaplain",
                "Other"
            ]
        },
        {
            id: "bday",
            label: "Birthdate",
            type: "date"
        },
        {
            id: "year",
            label: "Year",
            type: "text",
            placeholder: "e.g. 2024"
        }
    ],
    former: [
        {
            id: "fullname",
            label: "Full Name",
            type: "text",
            placeholder: "e.g. Juan Dela Cruz",
            full: true
        },
        {
            id: "alias",
            label: "Alexis",
            type: "text",
            placeholder: "Alexis"
        },
        {
            id: "position",
            label: "Position",
            type: "select",
            options: [
                "Grand Triskelion",
                "Deputy Grand Triskelion",
                "Secretary General",
                "Treasurer",
                "Auditor",
                "PRO",
                "Sergeant-at-Arms",
                "Chaplain",
                "Other"
            ]
        },
        {
            id: "bday",
            label: "Birthdate",
            type: "date"
        },
        {
            id: "year",
            label: "Year Served",
            type: "text",
            placeholder: "e.g. 2020\u20132021"
        }
    ]
};
function openModal(module, index = null) {
    currentModule = module;
    editIndex = index;
    const isEdit = index !== null;
    const titles = {
        residents: "Resident",
        welcoming: "Welcoming Member",
        officers: "Officer",
        former: "Former Officer"
    };
    document.getElementById("modalTitle").textContent = (isEdit ? "Edit " : "Add ") + titles[module];
    const fields = FIELDS[module];
    const record = isEdit ? DB[module][index] : {};
    let html = "";
    fields.forEach((f)=>{
        const cls = f.full ? " full" : "";
        let input = "";
        if (f.type === "select") {
            const opts = f.options.map((o)=>`<option value="${o}" ${record[f.id] === o ? "selected" : ""}>${o}</option>`).join("");
            input = `<select id="field-${f.id}"><option value="">\u{2014} Select \u{2014}</option>${opts}</select>`;
        } else input = `<input id="field-${f.id}" type="${f.type}" placeholder="${f.placeholder || ""}" value="${record[f.id] || ""}">`;
        html += `<div class="form-group${cls}"><label>${f.label}</label>${input}</div>`;
    });
    document.getElementById("formFields").innerHTML = html;
    document.getElementById("modalOverlay").classList.add("open");
}
function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    currentModule = null;
    editIndex = null;
}
function saveRecord() {
    const fields = FIELDS[currentModule];
    const record = {};
    for (const f of fields){
        const el = document.getElementById("field-" + f.id);
        record[f.id] = el ? el.value.trim() : "";
    }
    if (!record.fullname) {
        showToast("\u26A0\uFE0F Full Name is required!");
        return;
    }
    if (editIndex !== null) {
        DB[currentModule][editIndex] = record;
        showToast("\u2705 Record updated!");
    } else {
        DB[currentModule].push(record);
        showToast("\u2705 Record added!");
    }
    closeModal();
    renderAll();
}
// ── DELETE ──
function deleteRecord(module, index) {
    deleteTarget = {
        module,
        index
    };
    document.getElementById("confirmOverlay").classList.add("open");
}
function closeConfirm() {
    document.getElementById("confirmOverlay").classList.remove("open");
}
function confirmDelete() {
    DB[deleteTarget.module].splice(deleteTarget.index, 1);
    closeConfirm();
    renderAll();
    showToast("\uD83D\uDDD1\uFE0F Record deleted.");
}
// ── RENDER ──
function renderAll() {
    renderResidents();
    renderWelcoming();
    renderOfficers();
    renderFormer();
    updateStats();
}
function escape(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function renderResidents(data = null) {
    const rows = data || DB.residents;
    const tb = document.getElementById("tbody-residents");
    if (!rows.length) {
        tb.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="icon">\u{1F3D8}</div><p>No residents yet. Add the first one!</p></div></td></tr>`;
        return;
    }
    tb.innerHTML = rows.map((r, i)=>`
    <tr>
      <td>${i + 1}</td>
      <td><span class="fullname">${escape(r.fullname)}</span></td>
      <td><span class="alias">${escape(r.alias)}</span></td>
      <td>${escape(r.bday)}</td>
      <td>${escape(r.gtname)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('residents',${DB.residents.indexOf(r)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('residents',${DB.residents.indexOf(r)})">Delete</button>
      </div></td>
    </tr>`).join("");
}
function renderWelcoming(data = null) {
    const rows = data || DB.welcoming;
    const tb = document.getElementById("tbody-welcoming");
    if (!rows.length) {
        tb.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="icon">\u{1F91D}</div><p>No welcoming members yet.</p></div></td></tr>`;
        return;
    }
    tb.innerHTML = rows.map((r, i)=>`
    <tr>
      <td>${i + 1}</td>
      <td><span class="fullname">${escape(r.fullname)}</span></td>
      <td><span class="alias">${escape(r.alias)}</span></td>
      <td>${escape(r.bday)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('welcoming',${DB.welcoming.indexOf(r)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('welcoming',${DB.welcoming.indexOf(r)})">Delete</button>
      </div></td>
    </tr>`).join("");
}
function renderOfficers(data = null) {
    const rows = data || DB.officers;
    const tb = document.getElementById("tbody-officers");
    if (!rows.length) {
        tb.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="icon">\u{2B50}</div><p>No officers yet.</p></div></td></tr>`;
        return;
    }
    tb.innerHTML = rows.map((r, i)=>`
    <tr>
      <td>${i + 1}</td>
      <td><span class="fullname">${escape(r.fullname)}</span></td>
      <td><span class="alias">${escape(r.alias)}</span></td>
      <td><span class="badge-pos">${escape(r.position)}</span></td>
      <td>${escape(r.bday)}</td>
      <td>${escape(r.year)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('officers',${DB.officers.indexOf(r)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('officers',${DB.officers.indexOf(r)})">Delete</button>
      </div></td>
    </tr>`).join("");
}
function renderFormer(data = null) {
    const rows = data || DB.former;
    const tb = document.getElementById("tbody-former");
    if (!rows.length) {
        tb.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="icon">\u{1F4DC}</div><p>No former officers yet.</p></div></td></tr>`;
        return;
    }
    tb.innerHTML = rows.map((r, i)=>`
    <tr>
      <td>${i + 1}</td>
      <td><span class="fullname">${escape(r.fullname)}</span></td>
      <td><span class="alias">${escape(r.alias)}</span></td>
      <td><span class="badge-pos badge-former">${escape(r.position)}</span></td>
      <td>${escape(r.bday)}</td>
      <td>${escape(r.year)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('former',${DB.former.indexOf(r)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('former',${DB.former.indexOf(r)})">Delete</button>
      </div></td>
    </tr>`).join("");
}
// ── SEARCH ──
function filterTable(module, query) {
    const q = query.toLowerCase();
    const filtered = DB[module].filter((r)=>Object.values(r).some((v)=>String(v).toLowerCase().includes(q)));
    if (module === "residents") renderResidents(filtered);
    if (module === "welcoming") renderWelcoming(filtered);
    if (module === "officers") renderOfficers(filtered);
    if (module === "former") renderFormer(filtered);
}
// ── STATS ──
function updateStats() {
    const r = DB.residents.length;
    const w = DB.welcoming.length;
    const o = DB.officers.length;
    const f = DB.former.length;
    const t = r + w + o + f;
    [
        "r",
        "w",
        "o",
        "f"
    ].forEach((k, i)=>{
        const c = [
            r,
            w,
            o,
            f
        ][i];
        document.getElementById("stat-" + [
            "residents",
            "welcoming",
            "officers",
            "former"
        ][i]).textContent = c;
        document.getElementById("badge-" + [
            "residents",
            "welcoming",
            "officers",
            "former"
        ][i]).textContent = c;
        document.getElementById("qdash-" + k).textContent = c;
    });
    document.getElementById("stat-total").textContent = t;
}
// ── TOAST ──
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.display = "block";
    setTimeout(()=>{
        t.style.display = "none";
    }, 2800);
}
// ── BOTTOM NAV ──
function setBottomNav(name) {
    document.querySelectorAll(".bnav-item").forEach((b)=>b.classList.remove("active"));
    const el = document.getElementById("bnav-" + name);
    if (el) el.classList.add("active");
}
// ── LOGOUT ──
function confirmLogout() {
    document.getElementById("logoutOverlay").classList.add("open");
}
function closeLogout() {
    document.getElementById("logoutOverlay").classList.remove("open");
}
function doLogout() {
    closeLogout();
    document.body.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      background:#081a0e; font-family:'Rajdhani',sans-serif;
      gap:18px; text-align:center; padding:20px;
    ">
      <img src="logo.png" style="width:90px;height:90px;border-radius:50%;border:2px solid #c9a84c;box-shadow:0 0 20px rgba(201,168,76,.3);object-fit:cover;">
      <div style="color:#c9a84c;font-family:'Cinzel',serif;font-size:20px;font-weight:700;letter-spacing:2px;margin-top:4px;">
        Tau Gamma Phi
      </div>
      <div style="color:#9aa89e;font-size:13px;letter-spacing:1px;">
        Junji Triskelion Community Chapter
      </div>
      <div style="
        color:rgba(154,168,158,.5); font-size:11px; letter-spacing:2px;
        font-style:italic; font-family:'Cinzel',serif;
      ">"Kapatiran, Katapatan, Kadakilaan"</div>
      <div style="color:#3aad52;font-size:13px;letter-spacing:1px;margin-top:6px;">
        \u{2713} You have been logged out.
      </div>
      <button onclick="location.reload()" style="
        margin-top:6px;
        background:linear-gradient(135deg,#236b31,#3aad52);
        border:none; border-radius:9px; color:white;
        font-family:'Rajdhani',sans-serif; font-size:14px; font-weight:700;
        letter-spacing:1.5px; padding:11px 28px; cursor:pointer;
        box-shadow:0 4px 14px rgba(58,173,82,.3);
      ">\u{23FB} Login Again</button>
    </div>`;
}
// ── INIT ──
updateStats();

//# sourceMappingURL=tgp.7c0ccee6.js.map
