const DB={residents:[],welcoming:[],officers:[],former:[]};let currentModule=null,editIndex=null,deleteTarget={module:null,index:null};function showPanel(e,t){document.querySelectorAll(".panel").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".nav-item").forEach(e=>e.classList.remove("active")),document.getElementById("panel-"+e).classList.add("active"),t?t.classList.add("active"):document.querySelectorAll(".nav-item").forEach(t=>{t.textContent.toLowerCase().includes(e.split("-")[0])&&t.classList.add("active")}),document.getElementById("topbarTitle").textContent=({dashboard:"DASHBOARD",residents:"RESIDENTS",welcoming:"WELCOMING",officers:"OFFICERS",former:"FORMER OFFICERS"})[e]||e.toUpperCase(),setBottomNav(e),closeSidebar()}function toggleSidebar(){document.getElementById("sidebar").classList.toggle("open"),document.getElementById("overlayBg").classList.toggle("open")}function closeSidebar(){document.getElementById("sidebar").classList.remove("open"),document.getElementById("overlayBg").classList.remove("open")}const FIELDS={residents:[{id:"fullname",label:"Full Name",type:"text",placeholder:"e.g. Juan Dela Cruz",full:!0},{id:"alias",label:"Alexis",type:"text",placeholder:"Alexis"},{id:"bday",label:"Birthdate",type:"date"},{id:"gtname",label:"GT Name",type:"text",placeholder:"GT Name",full:!0}],welcoming:[{id:"fullname",label:"Full Name",type:"text",placeholder:"e.g. Juan Dela Cruz",full:!0},{id:"alias",label:"Alexis",type:"text",placeholder:"Alexis"},{id:"bday",label:"Birthdate",type:"date"}],officers:[{id:"fullname",label:"Full Name",type:"text",placeholder:"e.g. Juan Dela Cruz",full:!0},{id:"alias",label:"Alexis",type:"text",placeholder:"Alexis"},{id:"position",label:"Position",type:"select",options:["Grand Triskelion","Deputy Grand Triskelion","Secretary General","Treasurer","Auditor","PRO","Sergeant-at-Arms","Chaplain","Other"]},{id:"bday",label:"Birthdate",type:"date"},{id:"year",label:"Year",type:"text",placeholder:"e.g. 2024"}],former:[{id:"fullname",label:"Full Name",type:"text",placeholder:"e.g. Juan Dela Cruz",full:!0},{id:"alias",label:"Alexis",type:"text",placeholder:"Alexis"},{id:"position",label:"Position",type:"select",options:["Grand Triskelion","Deputy Grand Triskelion","Secretary General","Treasurer","Auditor","PRO","Sergeant-at-Arms","Chaplain","Other"]},{id:"bday",label:"Birthdate",type:"date"},{id:"year",label:"Year Served",type:"text",placeholder:"e.g. 2020–2021"}]};function openModal(e,t=null){currentModule=e,editIndex=t;let l=null!==t;document.getElementById("modalTitle").textContent=(l?"Edit ":"Add ")+({residents:"Resident",welcoming:"Welcoming Member",officers:"Officer",former:"Former Officer"})[e];let n=FIELDS[e],o=l?DB[e][t]:{},d="";n.forEach(e=>{let t=e.full?" full":"",l="";if("select"===e.type){let t=e.options.map(t=>`<option value="${t}" ${o[e.id]===t?"selected":""}>${t}</option>`).join("");l=`<select id="field-${e.id}"><option value="">\u{2014} Select \u{2014}</option>${t}</select>`}else l=`<input id="field-${e.id}" type="${e.type}" placeholder="${e.placeholder||""}" value="${o[e.id]||""}">`;d+=`<div class="form-group${t}"><label>${e.label}</label>${l}</div>`}),document.getElementById("formFields").innerHTML=d,document.getElementById("modalOverlay").classList.add("open")}function closeModal(){document.getElementById("modalOverlay").classList.remove("open"),currentModule=null,editIndex=null}function saveRecord(){let e=FIELDS[currentModule],t={};for(let l of e){let e=document.getElementById("field-"+l.id);t[l.id]=e?e.value.trim():""}t.fullname?(null!==editIndex?(DB[currentModule][editIndex]=t,showToast("✅ Record updated!")):(DB[currentModule].push(t),showToast("✅ Record added!")),closeModal(),renderAll()):showToast("⚠️ Full Name is required!")}function deleteRecord(e,t){deleteTarget={module:e,index:t},document.getElementById("confirmOverlay").classList.add("open")}function closeConfirm(){document.getElementById("confirmOverlay").classList.remove("open")}function confirmDelete(){DB[deleteTarget.module].splice(deleteTarget.index,1),closeConfirm(),renderAll(),showToast("🗑️ Record deleted.")}function renderAll(){renderResidents(),renderWelcoming(),renderOfficers(),renderFormer(),updateStats()}function escape(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function renderResidents(e=null){let t=e||DB.residents,l=document.getElementById("tbody-residents");if(!t.length){l.innerHTML='<tr><td colspan="6"><div class="empty-state"><div class="icon">🏘</div><p>No residents yet. Add the first one!</p></div></td></tr>';return}l.innerHTML=t.map((e,t)=>`
    <tr>
      <td>${t+1}</td>
      <td><span class="fullname">${escape(e.fullname)}</span></td>
      <td><span class="alias">${escape(e.alias)}</span></td>
      <td>${escape(e.bday)}</td>
      <td>${escape(e.gtname)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('residents',${DB.residents.indexOf(e)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('residents',${DB.residents.indexOf(e)})">Delete</button>
      </div></td>
    </tr>`).join("")}function renderWelcoming(e=null){let t=e||DB.welcoming,l=document.getElementById("tbody-welcoming");if(!t.length){l.innerHTML='<tr><td colspan="5"><div class="empty-state"><div class="icon">🤝</div><p>No welcoming members yet.</p></div></td></tr>';return}l.innerHTML=t.map((e,t)=>`
    <tr>
      <td>${t+1}</td>
      <td><span class="fullname">${escape(e.fullname)}</span></td>
      <td><span class="alias">${escape(e.alias)}</span></td>
      <td>${escape(e.bday)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('welcoming',${DB.welcoming.indexOf(e)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('welcoming',${DB.welcoming.indexOf(e)})">Delete</button>
      </div></td>
    </tr>`).join("")}function renderOfficers(e=null){let t=e||DB.officers,l=document.getElementById("tbody-officers");if(!t.length){l.innerHTML='<tr><td colspan="7"><div class="empty-state"><div class="icon">⭐</div><p>No officers yet.</p></div></td></tr>';return}l.innerHTML=t.map((e,t)=>`
    <tr>
      <td>${t+1}</td>
      <td><span class="fullname">${escape(e.fullname)}</span></td>
      <td><span class="alias">${escape(e.alias)}</span></td>
      <td><span class="badge-pos">${escape(e.position)}</span></td>
      <td>${escape(e.bday)}</td>
      <td>${escape(e.year)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('officers',${DB.officers.indexOf(e)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('officers',${DB.officers.indexOf(e)})">Delete</button>
      </div></td>
    </tr>`).join("")}function renderFormer(e=null){let t=e||DB.former,l=document.getElementById("tbody-former");if(!t.length){l.innerHTML='<tr><td colspan="7"><div class="empty-state"><div class="icon">📜</div><p>No former officers yet.</p></div></td></tr>';return}l.innerHTML=t.map((e,t)=>`
    <tr>
      <td>${t+1}</td>
      <td><span class="fullname">${escape(e.fullname)}</span></td>
      <td><span class="alias">${escape(e.alias)}</span></td>
      <td><span class="badge-pos badge-former">${escape(e.position)}</span></td>
      <td>${escape(e.bday)}</td>
      <td>${escape(e.year)}</td>
      <td><div class="action-btns">
        <button class="btn-edit" onclick="openModal('former',${DB.former.indexOf(e)})">Edit</button>
        <button class="btn-del"  onclick="deleteRecord('former',${DB.former.indexOf(e)})">Delete</button>
      </div></td>
    </tr>`).join("")}function filterTable(e,t){let l=t.toLowerCase(),n=DB[e].filter(e=>Object.values(e).some(e=>String(e).toLowerCase().includes(l)));"residents"===e&&renderResidents(n),"welcoming"===e&&renderWelcoming(n),"officers"===e&&renderOfficers(n),"former"===e&&renderFormer(n)}function updateStats(){let e=DB.residents.length,t=DB.welcoming.length,l=DB.officers.length,n=DB.former.length,o=e+t+l+n;["r","w","o","f"].forEach((o,d)=>{let a=[e,t,l,n][d];document.getElementById("stat-"+["residents","welcoming","officers","former"][d]).textContent=a,document.getElementById("badge-"+["residents","welcoming","officers","former"][d]).textContent=a,document.getElementById("qdash-"+o).textContent=a}),document.getElementById("stat-total").textContent=o}function showToast(e){let t=document.getElementById("toast");t.textContent=e,t.style.display="block",setTimeout(()=>{t.style.display="none"},2800)}function setBottomNav(e){document.querySelectorAll(".bnav-item").forEach(e=>e.classList.remove("active"));let t=document.getElementById("bnav-"+e);t&&t.classList.add("active")}function confirmLogout(){document.getElementById("logoutOverlay").classList.add("open")}function closeLogout(){document.getElementById("logoutOverlay").classList.remove("open")}function doLogout(){closeLogout(),document.body.innerHTML=`
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
    </div>`}updateStats();
//# sourceMappingURL=tgp.edc0d267.js.map
