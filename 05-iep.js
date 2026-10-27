/* ===== المرحلة 3: ملف الطالب + الخطة الفردية + بنك الأهداف ===== */
const BANK=[
{d:'نطق',k:'الصوت المستهدف',l:'أن ينطق {الاسم} الصوت {ص} بشكل صحيح في بداية الكلمة ووسطها ونهايتها بنسبة إتقان ٨٠٪ في ٣ جلسات متتالية.',s:'نطق الصوت {ص} في مقاطع وكلمات',g:['ينطق الصوت {ص} منفرداً عند المحاكاة','ينطق الصوت {ص} في مقاطع (صوت + حركة)','ينطق الصوت {ص} في بداية كلمات من مقطعين']},
{d:'نطق',k:'وضوح الكلام',l:'أن يزيد {الاسم} وضوح كلامه ليفهمه المستمع في ٨٠٪ من المحاولات خلال فصل دراسي.',s:'نطق الكلمات بوضوح في جمل قصيرة',g:['ينطق ٥ كلمات متكررة بوضوح','يكوّن جملة من ٣ كلمات بنطق واضح','يتحدث بوضوح في موقف حواري قصير']},
{d:'لغة',k:'المفردات',l:'أن يسمّي {الاسم} ١٠٠ مفردة من الفئات المألوفة بنسبة ٨٠٪ خلال فصل دراسي.',s:'تسمية المفردات المألوفة',g:['يسمّي ١٠ أشياء من الصور','يسمّي أفراد الأسرة والأدوات المدرسية','يستخدم المفردة في جملة قصيرة']},
{d:'لغة',k:'اتباع التعليمات',l:'أن ينفّذ {الاسم} تعليمات لفظية من خطوتين باستقلالية في ٤ من ٥ محاولات.',s:'تنفيذ التعليمات اللفظية',g:['ينفّذ تعليمة من خطوة بمساعدة','ينفّذ تعليمة من خطوتين بتلميح','ينفّذ تعليمة من خطوتين باستقلالية']},
{d:'سلوك',k:'الجلوس والانتباه',l:'أن يحافظ {الاسم} على الجلوس والانتباه للمهمة ٥ دقائق متواصلة في ٤ من ٥ جلسات.',s:'زيادة مدة الانتباه',g:['ينتبه للمهمة دقيقتين بتعزيز','ينتبه للمهمة ٣ دقائق','ينتبه للمهمة ٥ دقائق']},
{d:'سلوك',k:'طلب المساعدة',l:'أن يطلب {الاسم} المساعدة بالكلمات أو الإشارة بدلاً من السلوك غير المناسب في ٨٠٪ من المواقف.',s:'التواصل الوظيفي لطلب المساعدة',g:['يشير لطلب المساعدة عند التلقين','يقول «ساعدني» عند التلقين','يطلب المساعدة تلقائياً']},
{d:'مهارات حياة',k:'غسل اليدين',l:'أن يغسل {الاسم} يديه باستقلالية باتباع جميع الخطوات في ٤ من ٥ محاولات.',s:'تسلسل خطوات غسل اليدين',g:['يبلّل يديه ويضع الصابون','يفرك يديه ويشطفهما','يجفف يديه ويغلق الصنبور']},
{d:'أكاديمي',k:'الحروف الهجائية',l:'أن يتعرف {الاسم} على الحروف الهجائية ويربط كل حرف بصوته بنسبة ٨٠٪.',s:'التعرف على الحروف وأصواتها',g:['يميز ١٠ حروف','يربط الحرف بصوته','يقرأ مقطعاً بسيطاً']}];
const SL={mastered:['متقن','var(--teal)'],progress:['قيد الإتقان','var(--teal)'],prompted:['بمساعدة','#C9971C'],not:['لم يتقن','#e11d48'],new:['جديد','var(--mut)']};
let CUR=null;
const uid=()=>'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const stu=()=>S.students.find(s=>s.id===CUR);
const sgs=id=>Object.values(S.iep[id]||{}).flatMap(x=>x.shortTermGoals).flatMap(g=>g.subGoals);
function openSt(id){CUR=id;go('st')}
function redraw(){const y=scrollY;$('#v').innerHTML=VIEWS[T]();scrollTo(0,y);count()}
function findSg(id){for(const x of Object.values(S.iep[CUR]||{}))for(const g of x.shortTermGoals)for(const sg of g.subGoals)if(sg.id===id)return[sg,g]}
const evIn=sg=>{const z=S.run&&(S.sess||[]).find(x=>x.id===S.run);return z?(sg.log||[]).filter(a=>a.s===z.id).slice(-1)[0]:null};
/* قاعدة ٠٫٩٫٤: التقييم يتم داخل جلسة مفتوحة فقط، لطالبها ولأهدافها */
const RMSG={no:'التقييم يتم داخل الجلسة فقط. ابدأ جلسة من قسم الجلسات أو من صفحة الطالب.',stu:'هناك جلسة جارية لطالب آخر. ارجع إليها أو أنهِها أولاً.',goal:'هذا الهدف ليس ضمن أهداف الجلسة الجارية.'};
const rateCtx=sgId=>{const z=S.run&&(S.sess||[]).find(x=>x.id===S.run);if(!z)return{ok:0,why:'no'};if(z.sid!==CUR)return{ok:0,why:'stu'};
 const f=sgId&&findSg(sgId);if(f&&!(z.gs||[]).includes(f[1].id))return{ok:0,why:'goal'};return{ok:1,z}};
const sgRow=sg=>{const[lb,col]=SL[sg.status||'new']||SL.new,L=(sg.log||[]).slice(-5),e=evIn(sg);
 return `<tr class="sgr" onclick="openSg('${sg.id}')"><td class="gt">${esc(sg.title)}<br><small style="color:${col};font-weight:700">${lb}</small><span class="dots" style="display:inline-flex;margin:0 6px">${L.map(a=>`<i class="d${a.r}"></i>`).join('')}</span>${e?`<small class="cp" style="margin-right:4px">✔ قُيّم: ${RL[e.r]}</small>`:''}</td><td style="width:74px"><button class="btn g" style="margin:0;padding:7px 10px;font-size:calc(12px*var(--fs))" onclick="event.stopPropagation();openSg('${sg.id}')">فتح ›</button></td></tr>`};
/* شاشة الهدف الفرعي: التقييم يظهر هنا فقط، ويُحفظ تلقائياً، ولا يُعاد إلا بزر صريح */
let SGID=null;
function openSg(id,rev){const f=findSg(id);if(!f)return;SGID=id;const[sg,g]=f,e=evIn(sg),[lb,col]=SL[sg.status||'new']||SL.new,L=(sg.log||[]).slice(-8),locked=e&&!rev,rc=rateCtx(id),L5=(sg.log||[]).slice(-5),k5=L5.filter(a=>a.r==='m').length;
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh" style="max-height:92vh;overflow:auto"><div class="gm"><b class="in">${esc(sg.title)}</b><button class="ed" onclick="closeSheet()" aria-label="إغلاق">✕</button></div>
 <p class="mut" style="text-align:right;margin:2px 0 8px">الهدف القصير: ${esc(g.title)}</p>
 <div class="card"><b style="color:${col}">الحالة: ${lb}</b><span class="dots">${L.map(a=>`<i class="d${a.r}"></i>`).join('')}</span><small style="color:var(--mut)">الإتقان بعد ${ar(sg.need||3)} محاولات ناجحة متتالية <button class="lnk" style="margin:0" onclick="cycNeed('${id}').then(()=>openSg('${id}',${rev?1:0}))">تغيير</button></small><br><small style="color:var(--mut)">معيار الخطة: ٤ من ٥ محاولات · آخر ${ar(L5.length)}: ${ar(k5)} ناجحة${L5.length>=5?(k5>=4?' ✔ يتحقق المعيار':' · لم يتحقق بعد'):''}</small></div>
 ${!rc.ok?`<div class="card" style="text-align:center"><b>🔒 التقييم داخل الجلسة فقط</b><br><small style="color:var(--mut)">${RMSG[rc.why]}</small>${rc.why==='no'?`<button class="btn g" onclick="closeSheet();SSID=CUR;go('sess')">فتح قسم الجلسات</button>`:''}</div>`:locked?`<div class="card" style="text-align:center"><b>✔ قُيّم ${S.run?'في هذه الجلسة':'اليوم'}: ${RL[e.r]}</b><br><small style="color:var(--mut)">حُفظ التقييم تلقائياً</small><button class="btn g" onclick="openSg('${id}',1)">إعادة التقييم</button></div>`
 :`<h3 class="st" style="margin:6px 0">قيّم الهدف (يُحفظ فور الضغط)</h3><div class="evb">${['m','p','n'].map(r=>`<button class="ev ${r}" onclick="evalSg('${id}','${r}')"><b>${r==='n'?'✕':'✓'}</b><span>${RL[r]}</span></button>`).join('')}</div>`}
 <button class="btn" onclick="closeSheet();BG='${g.id}';SGACT='${id}';openCfg()">▶ نشاط لهذا الهدف الفرعي</button>
 <button class="btn g" onclick="closeSheet();openBag('${g.id}')">🎒 استمارات وأوراق عمل</button>
 ${S.run?'':`<button class="btn g" onclick="editSg('${id}')">✎ تعديل أو حذف الهدف الفرعي</button>`}</div></div>`}
async function evalSg(id,r){if(!rateCtx(id).ok)return toast('التقييم داخل الجلسة فقط');await logA(id,r);closeSheet();toast('✔ حُفظ التقييم: '+RL[r])}
let SGACT=null;
async function logA(id,r){const[sg,g]=findSg(id),need=sg.need||3,was=sg.status;
 const ss=(S.sess||[]).find(z=>z.id===S.run&&z.sid===CUR)||(S.sess||[]).find(z=>z.sid===CUR&&z.d===ymd());sg.log=(sg.log||[]).concat({r,t:Date.now(),s:ss?ss.id:undefined}).slice(-400);
 const L=sg.log.slice(-need),ok=r==='m'&&L.length>=need&&L.every(a=>a.r==='m');
 sg.status=r==='n'?'not':r==='p'?'prompted':(ok||was==='mastered')?'mastered':'progress';
 await save();redraw();
 if(sg.status==='mastered'&&was!=='mastered'){const nx=g.subGoals.find(z=>z.status!=='mastered');toast(nx?'🎉 أتقن! التالي: '+nx.title:'🎉 أتقن! اكتمل الهدف القصير')}}
async function cycNeed(id){const[sg]=findSg(id);let n=(sg.need||3)+1;sg.need=n>5?2:n;await save();redraw()}
async function saveSt(){const s=stu(),n=$('#pn').value.trim();if(!n)return toast('اكتب اسم الطالب');
 s.name=n;s.grade=$('#pg').value;s.dx=$('#pd').value.trim();await save();redraw();toast('تم حفظ البيانات')}
let SJ={},AK=null,AD=null;
const subj=()=>{const k=Object.keys(S.iep[CUR]||{});return k.includes(SJ[CUR])?SJ[CUR]:k[0]};
const cur=()=>S.iep[CUR][subj()];
function pickSubj(i){SJ[CUR]=Object.keys(S.iep[CUR])[i];redraw()}
function migrate(){let ch=0;for(const id in S.iep){const ie=S.iep[id];for(const k of Object.keys(ie)){if(!k.includes(' — '))continue;
 const d=k.split(' — ')[0];if(ie[d])ie[d].shortTermGoals.push(...ie[k].shortTermGoals);else ie[d]=ie[k];delete ie[k];ch=1}}if(ch)save()}
function ask(t,v,fn,ml,del){AK=fn;AD=del||null;$('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><form class="sh" onsubmit="askGo(event)">
 <h2 class="st" style="margin:0 0 4px">${t}</h2>${ml?`<textarea id="ak" rows="4" aria-label="${t}">${esc(v)}</textarea>`:`<input id="ak" value="${esc(v)}" aria-label="${t}">`}
 <button class="btn">حفظ</button>${del?'<button type="button" class="btn r" onclick="askDel(this)">حذف</button>':''}</form></div>`;$('#ak').focus()}
async function askGo(e){e.preventDefault();const v=$('#ak').value.trim();if(!v)return;await AK(v);closeSheet();redraw()}
function askDel(b){arm('ad',b,'',async()=>{await AD();closeSheet();redraw()})}
function editLT(){ask('الهدف طويل المدى',cur().longTermGoal||'',async v=>{cur().longTermGoal=v;await save()},1)}
function addShort(){ask('هدف قصير المدى جديد','',async v=>{cur().shortTermGoals.push({id:uid(),title:v,subGoals:[]});PG[pgKey()]=cur().shortTermGoals.length-1;await save()})}
function editShort(id){const c=cur(),g=c.shortTermGoals.find(x=>x.id===id);
 ask('تعديل الهدف القصير',g.title,async v=>{g.title=v;await save()},0,async()=>{c.shortTermGoals=c.shortTermGoals.filter(x=>x.id!==id);await save()})}
function addSg(gid){const g=cur().shortTermGoals.find(x=>x.id===gid);
 ask('هدف فرعي جديد','',async v=>{g.subGoals.push({id:uid(),title:v,status:'new',log:[]});await save()})}
function editSg(id){const[sg,g]=findSg(id);
 ask('تعديل الهدف الفرعي',sg.title,async v=>{sg.title=v;await save()},0,async()=>{g.subGoals=g.subGoals.filter(z=>z.id!==id);await save()})}
function delSubj(b){arm('ds',b,'',async()=>{delete S.iep[CUR][subj()];await save();redraw()})}
function openSubj(){const ie=S.iep[CUR]||{};$('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><form class="sh" onsubmit="addSubj(event)">
 <h2 class="st" style="margin:0 0 4px">إضافة مادة</h2>
 ${['نطق','لغة','سلوك','مهارات حياة','أكاديمي'].filter(n=>!ie[n]).map(n=>`<button type="button" class="btn g" onclick="mkSubj('${n}')">${n}</button>`).join('')}
 <input id="ak" placeholder="أو اكتب اسم مادة أخرى" aria-label="مادة أخرى"><button class="btn">إضافة</button></form></div>`}
function addSubj(e){e.preventDefault();const n=$('#ak').value.trim();if(n)mkSubj(n)}
async function mkSubj(n){S.iep[CUR]=S.iep[CUR]||{};if(!S.iep[CUR][n])S.iep[CUR][n]={longTermGoal:'',shortTermGoals:[]};SJ[CUR]=n;await save();redraw();editLT()}
function openBank(){$('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh" style="max-height:80vh;overflow:auto">
 <h2 class="st" style="margin:0 0 4px">بنك الأهداف</h2><input id="snd" placeholder="الصوت المستهدف (اختياري) مثل: س" aria-label="الصوت المستهدف">
 ${BANK.map((t,i)=>`<button class="btn g" style="text-align:right" onclick="addTpl(${i})"><small style="color:var(--goldt)">${t.d}</small><br>${t.k}</button>`).join('')}</div></div>`}
async function addTpl(i){const t=BANK[i],s=stu(),sn=$('#snd').value.trim(),
 fill=x=>x.replace(/\{الاسم\}/g,s.name.split(' ')[0]).replace(/\{ص\}/g,sn?`(${sn})`:'المستهدف'),ie=S.iep[CUR]=S.iep[CUR]||{};
 if(!ie[t.d])ie[t.d]={longTermGoal:fill(t.l),shortTermGoals:[]};
 if(ie[t.d].shortTermGoals.some(g=>g.title===fill(t.s)))return toast('هذا الهدف مضاف مسبقاً');
 ie[t.d].shortTermGoals.push({id:uid(),title:fill(t.s),items:(i===0&&sn&&sn!=='س')?[]:BW[i].map(([e,w])=>({e,w})),subGoals:t.g.map(z=>({id:uid(),title:fill(z),status:'new',log:[]}))});
 SJ[CUR]=t.d;await save();closeSheet();redraw();toast('تمت إضافة الهدف')}
