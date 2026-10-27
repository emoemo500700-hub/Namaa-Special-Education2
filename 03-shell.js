/* ===== المرحلة 2: الهيكل + الشريط السفلي + الرئيسية ===== */
const I={
 home:'<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.3c2 .6 3.5 2.3 3.5 5.7"/>',
 game:'<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18.5" cy="14" r=".8"/>',
 file:'<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
 moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'};
const ic=(n,w=22)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const TABS=[['home','الرئيسية','home'],['students','الطلاب','users'],['sess','الجلسات','cal'],['reports','التقارير','file'],['me','حسابي','user']];
const GR=['الأول','الثاني','الثالث','الرابع','الخامس','السادس'].map(x=>`الصف ${x} الابتدائي`).concat(['الأول','الثاني','الثالث'].map(x=>`الصف ${x} المتوسط`));
const ar=n=>n.toLocaleString('ar-EG');
const hj=o=>new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',o).format(new Date());
const today=()=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{weekday:'long'}).format(new Date())+' · '+hj({day:'numeric',month:'long'});
const subs=()=>Object.values(S.iep||{}).flatMap(s=>Object.values(s)).flatMap(x=>x.shortTermGoals||[]).flatMap(g=>g.subGoals||[]);
let T='home';

function shell(){
 migrate();S.sess=S.sess||[];S.snap=S.snap||[];document.body.innerHTML=`<header class="hd"><button class="ib mb" onclick="sb(1)" aria-label="القائمة">${ic('menu',20)}</button><div class="lg">🌱</div><div class="br"><b>نماء</b><small>التربية الخاصة والنطق</small></div>
 <span class="bd"><i class="dot"></i>${hj({year:'numeric'})}</span>
 <button class="ib" onclick="lockNow()" aria-label="قفل">${ic('lock',20)}</button>
 <button class="ib" onclick="toggleTheme()" aria-label="الوضع الليلي">${ic('moon',20)}</button></header>
 <aside id="sb"></aside><div id="sbo" onclick="sb(0)"></div><main id="v"></main><nav class="nv" id="nv"></nav><div id="sheet"></div>`;snap();navRestore()}

function go(t){T=t;
 $('#nv').innerHTML=TABS.map(([k,l,i])=>`<button class="${k===(T==='st'||T==='gp'?'students':T)?'on':''}" onclick="go('${k}')">${ic(i)}<span>${l}</span></button>`).join('');
 $('#sb').innerHTML=sbHTML();const v=$('#v');v.className='';v.innerHTML=VIEWS[T]();void v.offsetWidth;v.className='fade';scrollTo(0,0);count();navSave()}
let NAVPOP=0;
function navSave(){try{LW('namaa_nav',JSON.stringify({t:T,c:CUR,s:(CUR&&S.iep&&S.iep[CUR])?subj():null,q:SSID}));if(!NAVPOP)history.pushState({t:T},'')}catch(e){}}
function navRestore(){let n=null;try{n=JSON.parse(LS('namaa_nav')||'null')}catch(e){}
 if(!n||!VIEWS[n.t])return go('home');let t=n.t;
 if(n.c&&S.students.some(s=>s.id===n.c)){CUR=n.c;if(n.s&&S.iep[CUR]&&S.iep[CUR][n.s])SJ[CUR]=n.s}
 if(n.q)SSID=n.q;if(S.run)t='sess';
 if((t==='st'||t==='gp')&&!stu())t='home';if(t==='gp'&&!subj())t='st';go(t)}
addEventListener('popstate',e=>{if(e.state&&e.state.t&&VIEWS[e.state.t]&&S){NAVPOP=1;try{go(e.state.t)}finally{NAVPOP=0}}});

function count(){const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('[data-n]').forEach(e=>{const n=+e.dataset.n,s=e.dataset.s||'',t0=performance.now();
  const f=t=>{const k=rm?1:Math.min(1,(t-t0)/700);e.textContent=ar(Math.round(n*k))+s;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}

const kpi=(n,l,s='')=>`<div class="kpi"><b data-n="${n}" data-s="${s}">٠</b><span>${l}</span></div>`;
const stCard=(s,d)=>`<div class="cd" style="cursor:pointer" onclick="openSt(${s.id})"><div class="av">${esc(s.name[0])}</div><div class="in"><b>${esc(s.name)}</b><small>${esc(s.grade)}${s.dx?' · '+esc(s.dx):''}</small></div><span class="cp">STD-${100+s.id}</span>${d?`<button class="dl" onclick="event.stopPropagation();delSt(${s.id},this)">حذف</button>`:''}</div>`;
const soon=(e,t,d,p)=>`<div class="card gm" style="margin-bottom:10px"><em>${e}</em><div class="in"><b>${t}</b><small>${d}</small></div><span class="cp">${p}</span></div>`;

const VIEWS={
 students:()=>`<button class="btn" style="margin:0 0 14px" onclick="openAdd()">إضافة طالب</button>${S.students.map(s=>stCard(s,1)).join('')||'<p class="mut">لا يوجد طلاب بعد. اضغط «إضافة طالب» للبدء.</p>'}`,
 games:()=>`<h2 class="st" style="margin-top:0">ألعاب التدريب</h2>`+[['🎈','فقاعات الصوت','تدريب على نطق الأصوات'],['🚂','قطار المقاطع','تقطيع الكلمات إلى مقاطع'],['🃏','بطاقات الصور','تسمية الصور وتصنيفها'],['🏎️','سباق الكلمات','تكرار الكلمات بسرعة']].map(x=>soon(...x,'المرحلة ٥')).join(''),
 reports:()=>`<h2 class="st" style="margin-top:0">التقارير</h2>${soon('📄','تقرير الطالب الرسمي A4','معاينة وتكبير وتنزيل PDF','المرحلة ٤')}${soon('📲','مشاركة عبر واتساب','ملخص جاهز لولي الأمر','المرحلة ٤')}`,
 me:()=>`<h2 class="st" style="margin-top:0">الأمان</h2><div class="card"><p>${K?'🔒 البيانات مشفّرة برمز الدخول':'🔓 لا يوجد رمز حماية حالياً'}</p>${K&&!LS('namaa_rec')?'<p style="color:#e11d48;font-size:calc(12px*var(--fs));margin-top:6px">⚠️ لا يوجد مفتاح استرجاع. أدخل رمزك أدناه واضغط «تغيير الرمز» لإنشائه.</p>':''}
  <input id="pin" type="password" inputmode="numeric" maxlength="6" placeholder="رمز جديد من ٤ إلى ٦ أرقام" aria-label="رمز جديد">
  <button class="btn" onclick="setPin()">${K?'تغيير الرمز':'تفعيل الرمز'}</button>
  ${K?'<button class="btn g" onclick="rmPin()">إزالة الرمز</button><button class="btn g" onclick="lockNow()">قفل الآن</button>':''}</div>
  ${bkSection()}<h2 class="st">المظهر والبيانات</h2><div class="card"><p style="font-size:calc(12px*var(--fs));margin-bottom:6px">حجم الخط</p><div class="chs">${[['s','صغير'],['m','متوسط'],['l','كبير']].map(([k,l])=>`<button class="${(document.documentElement.dataset.fs||'m')===k?'on':''}" onclick="setFs('${k}')">${l}</button>`).join('')}</div><button class="btn g" onclick="toggleTheme()">تبديل الوضع الليلي</button>
  <button class="btn r" onclick="resetAll(this)">مسح كل البيانات</button></div>
  <p class="mut">نماء · الإصدار ٠٫٩٫٦ (أمان الاستيراد · تقسيم الوحدات · أداء)</p>`};

/* ===== إجراءات ===== */
function openAdd(){$('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><form class="sh" onsubmit="addSt(event)">
 <h2 class="st" style="margin:0 0 4px">إضافة طالب</h2>
 <input id="n" placeholder="اسم الطالب" required aria-label="اسم الطالب"><select id="g" aria-label="الصف">${GR.map(x=>`<option>${x}</option>`).join('')}</select>
 <input id="d" placeholder="التشخيص (اختياري)" aria-label="التشخيص"><button class="btn">حفظ الطالب</button></form></div>`;$('#n').focus()}
function closeSheet(){$('#sheet').innerHTML=''}
async function addSt(e){e.preventDefault();const id=Math.max(0,...S.students.map(s=>s.id))+1;
 S.students.push({id,name:$('#n').value.trim(),grade:$('#g').value,dx:$('#d').value.trim()});await save();closeSheet();go(T);toast('تمت إضافة الطالب')}
function delSt(id,b){arm('d'+id,b,'',async()=>{S.students=S.students.filter(s=>s.id!==id);delete S.iep[id];S.sess=(S.sess||[]).filter(z=>z.sid!==id);await save();go(T)})}
async function setPin(){const p=$('#pin').value;if(!/^\d{4,6}$/.test(p))return toast('الرمز يجب أن يكون ٤ إلى ٦ أرقام');
 salt=crypto.getRandomValues(new Uint8Array(16));K=await mk(p,salt);await save();const r=await mkRec(p);go('me');showRec(r)}
async function rmPin(){K=null;LD('namaa_rec');await save();toast('تمت إزالة الرمز');go('me')}
function lockNow(){if(!K)return toast('فعّل الرمز أولاً من حسابي');S=null;K=null;auth('lock')}
function resetAll(b){arm('r',b,'',async()=>{S={v:1,students:[],iep:{}};LD('namaa_rec');await save();go('home');toast('تم مسح البيانات')})}

