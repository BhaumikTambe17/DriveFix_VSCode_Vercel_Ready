const USERS="drivefix_users",SESSION="drivefix_session";
let vehicle=null, selected=null;

const data={
puncture:{name:"Tyre puncture / flat tyre",level:"Medium",cost:"₹150 – ₹800",parts:"₹50 – ₹500",labour:"₹100 – ₹300",solution:"If the tyre has only lost air, inflate it to the recommended pressure. If there is a small repairable tread puncture, have it properly repaired. If the sidewall is damaged or the tyre is unsafe, replace the tyre.",steps:["Check pressure and find the leak.","Repair a suitable tread puncture.","Inflate to recommended pressure.","Replace the tyre if the sidewall is damaged."],note:"Avoid driving fast on a flat tyre."},
battery:{name:"Dead / weak battery",level:"Medium",cost:"₹500 – ₹6,000",parts:"₹300 – ₹5,000",labour:"₹200 – ₹1,000",solution:"Check the battery terminals and charge level. A jump-start can be temporary assistance, but the battery and alternator should be tested. Replace the battery if it cannot hold charge.",steps:["Inspect terminals.","Test battery and alternator.","Charge or replace battery.","Check why the battery discharged."],note:"Repeated jump-starting without diagnosis may leave you stranded."},
brake:{name:"Brake system problem",level:"High",cost:"₹800 – ₹8,000+",parts:"₹500 – ₹6,500+",labour:"₹300 – ₹1,500+",solution:"Have the braking system inspected before normal driving. Depending on the fault, brake pads, discs, fluid or hydraulic components may need service or replacement.",steps:["Inspect pads and discs.","Check brake fluid and leaks.","Check pedal feel.","Repair worn or faulty components."],note:"If braking is weak or the pedal feels abnormal, avoid driving."},
overheat:{name:"Engine overheating",level:"High",cost:"₹500 – ₹12,000+",parts:"₹200 – ₹9,000+",labour:"₹300 – ₹3,000+",solution:"Stop safely and let the engine cool. When safe, check coolant level. A workshop should inspect the radiator, thermostat, cooling fan, water pump and possible leaks.",steps:["Stop safely.","Let the engine cool.","Never open a hot radiator cap.","Inspect the cooling system."],note:"Do not continue driving while the temperature warning remains."},
engine:{name:"Engine starting / performance issue",level:"Medium",cost:"₹500 – ₹15,000+",parts:"₹200 – ₹12,000+",labour:"₹300 – ₹3,000+",solution:"Begin with battery, fuel and dashboard-warning checks. A diagnostic scan can identify ignition, sensor, fuel-system or engine faults before parts are replaced.",steps:["Check battery and fuel.","Observe warning lights.","Run a diagnostic scan.","Inspect the relevant system."],note:"Smoke, fuel smell or severe mechanical noise needs urgent attention."},
ac:{name:"AC not cooling",level:"Low",cost:"₹500 – ₹8,000+",parts:"₹200 – ₹6,000+",labour:"₹300 – ₹2,000+",solution:"Check the cabin filter, blower, compressor and refrigerant pressure. If refrigerant is low, identify leaks before recharging the system.",steps:["Check cabin filter.","Test blower and compressor.","Check refrigerant pressure.","Repair leaks before recharge."],note:"Repeated refrigerant top-ups without leak diagnosis are not a long-term repair."},
oil:{name:"Oil leak / low engine oil",level:"High",cost:"₹300 – ₹10,000+",parts:"₹100 – ₹7,000+",labour:"₹200 – ₹3,000+",solution:"Check the engine oil level and locate the leak. A gasket, seal, hose or component may need repair. If the oil level is dangerously low, do not operate the engine.",steps:["Check oil level safely.","Locate the leak.","Repair the seal, gasket or component.","Recheck oil level."],note:"Low engine oil can cause serious engine damage."},
electrical:{name:"Lights / electrical issue",level:"Low",cost:"₹150 – ₹4,000",parts:"₹50 – ₹3,000",labour:"₹100 – ₹1,000",solution:"Check the bulb, fuse, connector and wiring. Replace failed components with the correct specification. Repeated failures need electrical diagnosis.",steps:["Check bulb.","Check fuse.","Inspect connectors and wiring.","Test the circuit if the fault returns."],note:"Use only the correct fuse rating."}
};

const get=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2200)}
function msg(id,t,ok=true){const e=document.getElementById(id);e.textContent=t;e.style.color=ok?"#176534":"#b42318"}
function go(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.go===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
function openApp(){
 const u=get(SESSION,null);if(!u)return;
 document.getElementById("authPage").classList.add("hide");document.getElementById("appPage").classList.remove("hide");
 document.getElementById("userName").textContent=u.name;go("vehicle");
}
function logout(){localStorage.removeItem(SESSION);location.reload()}

document.getElementById("loginTab").onclick=()=>{
 document.getElementById("loginTab").classList.add("active");document.getElementById("signupTab").classList.remove("active");
 document.getElementById("loginForm").classList.remove("hide");document.getElementById("signupForm").classList.add("hide");
};
document.getElementById("signupTab").onclick=()=>{
 document.getElementById("signupTab").classList.add("active");document.getElementById("loginTab").classList.remove("active");
 document.getElementById("signupForm").classList.remove("hide");document.getElementById("loginForm").classList.add("hide");
};
document.getElementById("signupForm").onsubmit=e=>{
 e.preventDefault();const name=signupName.value.trim(),email=signupEmail.value.trim().toLowerCase(),password=signupPassword.value;
 const users=get(USERS);if(users.some(u=>u.email===email)){msg("signupMsg","Email already registered.",false);return}
 users.push({name,email,password});localStorage.setItem(USERS,JSON.stringify(users));msg("signupMsg","Account created. You can now log in.");e.target.reset();setTimeout(()=>document.getElementById("loginTab").click(),700)
};
document.getElementById("loginForm").onsubmit=e=>{
 e.preventDefault();const email=loginEmail.value.trim().toLowerCase(),password=loginPassword.value;
 const u=get(USERS).find(x=>x.email===email&&x.password===password);if(!u){msg("loginMsg","Invalid email or password.",false);return}
 localStorage.setItem(SESSION,JSON.stringify(u));toast("Welcome to DriveFix");setTimeout(openApp,300)
};
document.getElementById("logout").onclick=logout;

document.getElementById("vehicleForm").onsubmit=e=>{
 e.preventDefault();vehicle={owner:owner.value.trim(),phone:phone.value.trim(),type:type.value,fuel:fuel.value,make:make.value.trim(),model:model.value.trim(),year:year.value,reg:reg.value.trim().toUpperCase()};go("problem");toast("Vehicle saved")
};
document.querySelectorAll(".issue").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".issue").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=b.dataset.problem;document.getElementById("problemNext").disabled=false
});
document.getElementById("problemNext").onclick=()=>{
 const p=data[selected],d=document.getElementById("details").value.trim();
 document.getElementById("solutionContent").innerHTML=`
 <div class="solution-grid">
  <div class="solution-card"><span class="badge">${p.level} priority</span><h2>${p.name}</h2><p>${d?`<strong>Your note:</strong> ${esc(d)}`:"No additional note provided."}</p>
   <div class="solution-box"><b>Recommended solution</b><br>${p.solution}</div>
   <h3>Suggested steps</h3><ul>${p.steps.map(x=>`<li>${x}</li>`).join("")}</ul><small><b>Safety:</b> ${p.note}</small>
  </div>
  <div class="estimate"><small>ESTIMATED COST</small><div class="price">${p.cost}</div><p>Indicative range for common repairs in India. Actual cost depends on model, parts and workshop rates.</p>
   <div class="breakdown"><div><span>Parts / material</span><b>${p.parts}</b></div><div><span>Labour / service</span><b>${p.labour}</b></div></div>
  </div>
 </div>`;
 go("solution")
};
document.getElementById("saveRequest").onclick=()=>{
 const p=data[selected],d=document.getElementById("details").value.trim(),request={...vehicle,problem:p.name,priority:p.level,cost:p.cost,details:d,date:new Date().toLocaleString()};
 const r=get("drivefix_requests");r.push(request);localStorage.setItem("drivefix_requests",JSON.stringify(r));
 document.getElementById("summaryContent").innerHTML=`
 <div class="sum"><small>Vehicle</small><b>${esc(vehicle.make)} ${esc(vehicle.model)} (${vehicle.year})</b></div>
 <div class="sum"><small>Registration</small><b>${esc(vehicle.reg)}</b></div>
 <div class="sum"><small>Problem</small><b>${p.name}</b></div>
 <div class="sum"><small>Priority</small><b>${p.level}</b></div>
 <div class="sum cost"><small>Estimated cost</small><b>${p.cost}</b></div>
 <div class="sum"><small>Created</small><b>${request.date}</b></div>
 <div class="sum wide"><small>Your description</small><b>${esc(d||"No additional details provided.")}</b></div>`;
 go("summary");toast("Request saved")
};
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
document.getElementById("newRequest").onclick=()=>{selected=null;document.getElementById("details").value="";document.querySelectorAll(".issue").forEach(x=>x.classList.remove("selected"));document.getElementById("problemNext").disabled=true;go("vehicle")};
if(localStorage.getItem(SESSION))openApp();
