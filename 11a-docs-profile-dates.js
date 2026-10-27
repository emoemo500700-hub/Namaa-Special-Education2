/* ===== الاستمارات والتقارير =====
   نموذج وسيط (IR) تُبنى منه كل المخرجات: معاينة، PDF، HTML للطباعة، Word (.docx حقيقي)، طباعة مباشرة.
   كتلة IR:  {t:'p',x,b,c} · {t:'h',x} · {t:'tbl',h,r,w,fill,nb} · {t:'ln',n,fill}
   الخلية: نص أو {x,c:'l|lb|ci|co|cw|gh|bx',bar}  ·  doc={title,date,meta:[[k,v]],goal,blocks} */

const P2=s=>s.split('}').filter(Boolean).map(r=>{const[i,b]=r.split('{');return i.split(',').map(x=>'.nd '+x.trim()).join(',')+'{'+b+'}'}).join('');

/* ---- ملف الأخصائي (يظهر في كل استمارة) ---- */
const PROF=()=>Object.assign({n:'عماد عبد العزيز',l:'الأخصائي',s:'مدارس الريادة النموذجية',m1:'منيف الشمري',m2:'سامية المطيري'},S.prof||{});
const SPEC=()=>PROF().l+'/ '+PROF().n;
const pfCard=()=>`<h2 class="st" style="margin-top:0">بيانات الأخصائي (تظهر في الاستمارات والتقارير)</h2><div class="card"><label>الاسم<input id="pfn" value="${esc(PROF().n)}"></label><label>المسمى<input id="pfl" value="${esc(PROF().l)}"></label><label>المدرسة<input id="pfs" value="${esc(PROF().s)}"></label><label>مدير المدارس (يظهر أسفل الاستمارات)<input id="pm1" value="${esc(PROF().m1)}"></label><label>مديرة التربية الخاصة<input id="pm2" value="${esc(PROF().m2)}"></label><button class="btn" onclick="savePf()">حفظ</button></div>`;
async function savePf(){S.prof={n:$('#pfn').value.trim()||'عماد عبد العزيز',l:$('#pfl').value.trim()||'الأخصائي',s:$('#pfs').value.trim()||'مدارس الريادة النموذجية',m1:$('#pm1').value.trim()||'منيف الشمري',m2:$('#pm2').value.trim()||'سامية المطيري'};await save();toast('تم الحفظ')}
{const _me=VIEWS.me;VIEWS.me=()=>pfCard()+_me()}

/* ===== التواريخ: ميلادي + هجري (أم القرى) ===== */
const arn=s=>String(s).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const dstr=d=>typeof d==='string'&&/^\d{4}-\d\d-\d\d$/.test(d)?d:ymd(d);
const dG=d=>{const[y,m,x]=dstr(d).split('-');return arn(x+'/'+m+'/'+y)};
const hjFmt=(d,o)=>{try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab',o).format(new Date(dstr(d)+'T12:00:00'))}catch(e){return''}};
const dH=d=>hjFmt(d,{day:'numeric',month:'long',year:'numeric'});
const dHs=d=>hjFmt(d,{day:'numeric',month:'numeric',year:'numeric'});
const dBoth=d=>{const h=dH(d);return(h?h+' الموافق ':'')+dG(d)+'م'};
const addD=(d,n)=>{const x=new Date(dstr(d)+'T12:00:00');x.setDate(x.getDate()+n);return ymd(x)};
const WD=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const dDay=d=>WD[new Date(dstr(d)+'T12:00:00').getDay()];
/* خلية جدول بتاريخين: ميلادي (أساسي) وتحته اليوم + الهجري */
const dCell=d=>`<b>${dG(d)}</b><small>${dDay(d)} · <bdi>${esc(dHs(d))}</bdi></small>`;

/* ===== الأوقات ===== */
const pad2=n=>String(n).padStart(2,'0');
const tHM=ts=>{const x=new Date(ts);return pad2(x.getHours())+':'+pad2(x.getMinutes())};
const okHM=s=>/^\d\d:\d\d$/.test(s||'');
/* ١٤:٣٠ ← ٠٢:٣٠ م */
const tAr=hm=>{if(!okHM(hm))return'';const[h,m]=hm.split(':').map(Number);return arn(pad2(h%12||12)+':'+pad2(m))+(h<12?' ص':' م')};
/* طابع زمني (ms) لتاريخ YYYY-MM-DD ووقت HH:MM، مع إزاحة بالدقائق */
const tsOf=(d,hm,addMin=0)=>new Date(dstr(d)+'T'+(okHM(hm)?hm:'09:00')+':00').getTime()+addMin*6e4;
/* وقت بدء الجلسة: المحفوظ يدوياً، وإلا من لحظة البدء الفعلية t0 */
const sessTm=z=>okHM(z.tm)?z.tm:(z.t0?tHM(z.t0):'');
const sessEnd=z=>{const s=sessTm(z);return s&&z.dur?tHM(tsOf(z.d,s,z.dur)):''};
const sessSpan=z=>{const s=sessTm(z);return s?tAr(s)+(sessEnd(z)?' – '+tAr(sessEnd(z)):''):'—'};
/* تاريخ كامل بالتقويمين + اليوم + الوقت */
const dFull=(d,tm)=>dDay(d)+' '+dBoth(d)+(okHM(tm)?' · '+tAr(tm):'');

/* ===== الأثر الرجعي: ربط المحاولات بتاريخ الجلسة ووقتها ===== */
/* كل محاولات جلسة (من خطة طالبها) */
const sessAtt=z=>sgs(z.sid).flatMap(sg=>(sg.log||[]).filter(a=>a.s===z.id).map(a=>({sg,a})));
const sgOf=(sid,id)=>sgs(sid).find(x=>x.id===id);
/* حالة الهدف الفرعي من آخر محاولة (نفس قاعدة logA لكن على السجل المرتّب زمنياً) */
function restat(sg){const L=sg.log||[],a=L[L.length-1];if(!a)return;const n=sg.need||3,t=L.slice(-n),ok=a.r==='m'&&t.length>=n&&t.every(x=>x.r==='m');
 sg.status=a.r==='n'?'not':a.r==='p'?'prompted':(ok||sg.status==='mastered')?'mastered':'progress'}
/* يضع نتيجة واحدة لهدف فرعي ضمن الجلسة (يُبقي المحاولات الحالية إن كانت نفس النتيجة) */
function setResult(z,sg,r,i){const mine=(sg.log||[]).filter(a=>a.s===z.id),last=mine[mine.length-1];
 if(last&&last.r===r)return;
 sg.log=(sg.log||[]).filter(a=>a.s!==z.id).concat({r,t:tsOf(z.d,sessTm(z),i),s:z.id}).sort((a,b)=>a.t-b.t).slice(-400);restat(sg)}
/* تثبيت الجلسة على محورها الزمني: تحريك محاولاتها إلى تاريخها (عند تغيير التاريخ/الوقت أو عدم التطابق) */
function normSess(z,force){const tm=sessTm(z);if(tm)z.tm=tm;const t0=tsOf(z.d,tm),A=sessAtt(z).sort((x,y)=>x.a.t-y.a.t);
 if(A.length&&(force||A.some(x=>ymd(x.a.t)!==z.d))){const b=A[0].a.t;A.forEach(x=>{x.a.t=t0+(x.a.t-b)});new Set(A.map(x=>x.sg)).forEach(sg=>{sg.log.sort((p,q)=>p.t-q.t);restat(sg)})}
 if(!z.open&&tm)z.t0=t0;
 if(z.d<ymd())z.bf=1;else delete z.bf}
/* عند إنهاء جلسة حيّة بتاريخ سابق: تُنقل محاولاتها لتاريخها تلقائياً */
{const _end=endSess;endSess=async function(){const z=S.sess.find(x=>x.id===S.run);if(z)z.tm=sessTm(z)||tHM(Date.now());await _end();if(z){normSess(z);await save()}}}
/* حذف جلسة يحذف معها محاولاتها (لا تبقى بيانات يتيمة في التقارير) */
delSess=function(id,b){const z=S.sess.find(x=>x.id===id);arm('x'+id,b,'',async()=>{if(z)sessAtt(z).forEach(({sg})=>{sg.log=sg.log.filter(a=>a.s!==id);restat(sg)});S.sess=S.sess.filter(x=>x.id!==id);await save();go(T)})};

/* ===== نموذج تسجيل/تعديل جلسة سابقة ===== */
let PF=null;
function openSess(sid,id){const z=id&&S.sess.find(x=>x.id===id),s0=z?z.sid:(sid||(T==='st'?CUR:(S.students[0]||{}).id));
 if(!s0||!S.students.some(s=>s.id===s0))return toast('أضف طالباً أولاً');
 PF={sid:s0,id:z?z.id:null,att:z?z.att:'p',gs:new Set(z?z.gs:[]),res:{}};
 if(z)sessAtt(z).forEach(({sg,a})=>{PF.res[sg.id]=a.r});
 const tm=z?sessTm(z):'',durs=[...new Set([15,20,30,40,45,60,90].concat(z&&z.dur?[z.dur]:[]))].sort((a,b)=>a-b);
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><form class="sh pf" onsubmit="pfSave(event)">
  <div class="mh"><b>${z?'تعديل بيانات جلسة':'تسجيل جلسة سابقة'}</b><button type="button" class="ed" onclick="closeSheet()" aria-label="إغلاق">✕</button></div>
  <label>الطالب<select id="pf_s" ${z?'disabled':''} onchange="pfStu(+this.value)">${S.students.map(s=>`<option value="${s.id}"${s.id===s0?' selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
  <div class="row2"><label>تاريخ الجلسة<input id="pf_d" type="date" required max="${ymd()}" value="${z?z.d:ymd()}" oninput="pfPv()"></label>
  <label>وقت البدء<input id="pf_t" type="time" required value="${tm}" oninput="pfPv()"></label></div>
  <div class="dd" id="pf_pv" aria-live="polite"></div>
  <div class="row2"><label>الحضور<select id="pf_a" onchange="PF.att=this.value;pfGoals()">${[['p','حضر'],['a','غاب'],['e','غاب بعذر']].map(([k,l])=>`<option value="${k}"${PF.att===k?' selected':''}>${l}</option>`).join('')}</select></label>
  <label>المدة (دقيقة)<select id="pf_m">${durs.map(n=>`<option${n===(z?z.dur:45)?' selected':''}>${n}</option>`).join('')}</select></label></div>
  <div id="pf_g"></div>
  <label>ملاحظة<input id="pf_n" placeholder="اختياري" value="${esc(z?z.note||'':'')}"></label>
  <button class="btn">${z?'حفظ التعديلات':'حفظ الجلسة'}</button></form></div>`;
 pfPv();pfGoals()}
const editSess=id=>openSess(null,id);
function pfPv(){const d=$('#pf_d').value,e=$('#pf_pv');e.textContent=d?dFull(d,$('#pf_t').value):''}
function pfStu(id){PF.sid=id;PF.gs=new Set();PF.res={};pfGoals()}
function pfTog(id,on){on?PF.gs.add(id):PF.gs.delete(id);pfGoals()}
function pfGoals(){const ie=S.iep[PF.sid]||{},p=PF.att==='p';
 const h=Object.entries(ie).filter(([k,x])=>x.shortTermGoals.length).map(([k,x])=>`<h3 class="st" style="margin:10px 0 2px;font-size:calc(13px*var(--fs))">📚 ${esc(k)}</h3>`+x.shortTermGoals.map(g=>{const on=PF.gs.has(g.id);
  return`<div class="pfg"><label class="ck2"><input type="checkbox"${on?' checked':''} onchange="pfTog('${g.id}',this.checked)">${esc(g.title)}</label>`+(on&&p?`<div class="pfs">${g.subGoals.map(s=>`<div class="pfr"><span>${esc(s.title)}</span><select aria-label="نتيجة: ${esc(s.title)}" onchange="PF.res['${s.id}']=this.value"><option value="">بدون نتيجة</option>${['m','p','n'].map(r=>`<option value="${r}"${PF.res[s.id]===r?' selected':''}>${RL[r]}</option>`).join('')}</select></div>`).join('')}</div>`:'')+'</div>'}).join('')).join('');
 $('#pf_g').innerHTML=`<p class="mut" style="text-align:right;margin:10px 0 0">الأهداف التي عُمل عليها${p?' ونتائجها (اختياري، تُسجَّل بتاريخ الجلسة ووقتها)':''}:</p>`+(h||'<p class="mut">لا توجد خطة لهذا الطالب بعد.</p>')}
async function pfSave(e){e.preventDefault();const d=$('#pf_d').value,tm=$('#pf_t').value,sid=PF.sid;
 if(!d||d>ymd())return toast('اختر تاريخاً سابقاً أو اليوم');if(!okHM(tm))return toast('أدخل وقت بدء الجلسة');
 if(S.sess.some(x=>x.sid===sid&&x.id!==PF.id&&x.d===d&&sessTm(x)===tm))return toast('توجد جلسة لنفس الطالب في هذا التاريخ والوقت');
 let z=PF.id&&S.sess.find(x=>x.id===PF.id);const old=z&&{d:z.d,tm:sessTm(z)};
 if(!z){z={id:uid(),sid};S.sess.push(z)}
 Object.assign(z,{d,tm,dur:+$('#pf_m').value,att:PF.att,gs:[...PF.gs],note:$('#pf_n').value.trim()});
 normSess(z,old&&(old.d!==d||old.tm!==tm));/* أولاً: تحريك المحاولات القائمة إلى التاريخ/الوقت الجديد */
 if(z.att==='p'){let i=0;Object.entries(PF.res).forEach(([id,r])=>{const sg=sgOf(sid,id),g=sg&&Object.values(S.iep[sid]).flatMap(x=>x.shortTermGoals).find(x=>x.subGoals.includes(sg));
  if(sg&&r&&g&&PF.gs.has(g.id))setResult(z,sg,r,i++)})}
 normSess(z);
 await save();closeSheet();go(T);toast(PF.id?'تم تعديل الجلسة وتحديث التقارير':'تم تسجيل الجلسة بتاريخها: '+dG(d))}
