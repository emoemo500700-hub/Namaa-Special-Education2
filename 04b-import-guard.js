/* ===== حارس الاستيراد (أمان) =====
   أي نسخة احتياطية تمر من cleanBackup() قبل أن تصير الحالة S. السبب: معرّفات الأهداف والجلسات تدخل في خصائص onclick،
   فملف معدّل خبيثاً كان يستطيع حقن كود. هنا: تحقق من الهيكل + حدود الأطوال + تنقية المعرّفات + حذف أي مفاتيح غير معروفة. */
const SAFE_ID=/^[A-Za-z0-9_-]{1,48}$/,BAD_KEY=new Set(['__proto__','constructor','prototype']),ISO_D=/^\d{4}-\d\d-\d\d$/,ST_OK=new Set(['mastered','progress','prompted','not','new']);
const gStr=(v,n=500)=>typeof v==='string'?v.slice(0,n):'';
const gNum=(v,d=0)=>Number.isFinite(+v)?+v:d;
const gInt=v=>Number.isFinite(+v)?Math.trunc(+v):null;
const gArr=v=>Array.isArray(v)?v:[];
function idMapper(){const m=new Map();return v=>{v=String(v==null?'':v);if(SAFE_ID.test(v))return v;if(!m.has(v))m.set(v,'x'+Math.random().toString(36).slice(2,10));return m.get(v)}}
/* نسخة عميقة آمنة لبيانات حرة (إعدادات/حزم): بلا مفاتيح خطرة ولا دوال ولا أعماق مفرطة */
function gPlain(v,d=0){if(d>6)return null;if(typeof v==='string')return v.slice(0,2000);if(typeof v==='number'||typeof v==='boolean'||v===null)return v;
 if(Array.isArray(v))return v.slice(0,500).map(x=>gPlain(x,d+1));
 if(v&&typeof v==='object'){const o={};for(const k of Object.keys(v)){if(!BAD_KEY.has(k)&&k.length<80)o[k]=gPlain(v[k],d+1)}return o}return null}
const gPrim=o=>{const r={};if(o&&typeof o==='object')for(const k of Object.keys(o)){if(BAD_KEY.has(k)||k.length>60)continue;const v=o[k];if(typeof v==='string')r[k]=v.slice(0,1000);else if(typeof v==='number'||typeof v==='boolean')r[k]=v}return r};
function cleanSubGoal(z,id){return Object.assign(gPrim(z),{id:id(z.id||uid()),title:gStr(z.title,500),status:ST_OK.has(z.status)?z.status:'new',need:Math.min(5,Math.max(2,gInt(z.need)||3)),
 log:gArr(z.log).slice(-400).map(a=>({r:'mpn'.includes(a&&a.r)&&a.r?a.r:'n',t:gNum(a&&a.t),s:a&&a.s!=null?id(a.s):undefined}))})}
function cleanShortGoal(g,id){const o=Object.assign(gPrim(g),{id:id(g.id||uid()),title:gStr(g.title,500),subGoals:gArr(g.subGoals).filter(z=>z&&typeof z==='object').map(z=>cleanSubGoal(z,id))});
 if(Array.isArray(g.items))o.items=g.items.slice(0,40).map(i=>({e:gStr(i&&i.e,16),w:gStr(i&&i.w,60)}));return o}
function cleanIep(iep,sids,id){const out={};for(const sid of Object.keys(iep&&typeof iep==='object'?iep:{})){if(!sids.has(+sid))continue;out[+sid]={};
 for(const sub of Object.keys(iep[sid]||{})){const x=iep[sid][sub];if(BAD_KEY.has(sub)||!x||typeof x!=='object')continue;
  out[+sid][sub.slice(0,120)]=Object.assign(gPrim(x),{longTermGoal:gStr(x.longTermGoal,1000),shortTermGoals:gArr(x.shortTermGoals).filter(g=>g&&typeof g==='object').map(g=>cleanShortGoal(g,id))})}}return out}
function cleanSessions(a,sids,id){return gArr(a).filter(z=>z&&typeof z==='object'&&sids.has(gInt(z.sid))&&ISO_D.test(z.d)).map(z=>({id:id(z.id||uid()),sid:gInt(z.sid),d:z.d,dur:Math.min(1000,Math.max(0,gNum(z.dur))),att:'pae'.includes(z.att)&&z.att?z.att:'p',
 gs:gArr(z.gs).map(id),note:gStr(z.note,2000),t0:gNum(z.t0),open:z.open?1:0}))}
function cleanSnaps(a){return gArr(a).slice(-80).filter(x=>x&&ISO_D.test(x.d)).map(x=>{const m={};for(const k of Object.keys(x.m||{})){const v=x.m[k];if(/^\d+$/.test(k)&&Array.isArray(v))m[k]=[gNum(v[0]),gNum(v[1])]}return{t:gNum(x.t),d:x.d,m}})}
function cleanBackup(d){if(!d||typeof d!=='object'||!Array.isArray(d.students))throw new Error('هيكل النسخة غير صالح');
 const id=idMapper(),students=d.students.filter(s=>s&&gInt(s.id)!=null&&gStr(s.name,200)).map(s=>Object.assign(gPrim(s),{id:gInt(s.id),name:gStr(s.name,200),grade:gStr(s.grade,100),dx:gStr(s.dx,200)})),sids=new Set(students.map(s=>s.id));
 const sess=cleanSessions(d.sess,sids,id),out={v:1,students,iep:cleanIep(d.iep,sids,id),sess,snap:cleanSnaps(d.snap)};
 out.run=d.run&&sess.some(z=>z.id===id(d.run))?id(d.run):null;
 if(Array.isArray(d.acts))out.acts=d.acts.filter(a=>a&&typeof a==='object').slice(0,200).map(a=>({id:id(a.id||uid()),name:gStr(a.name,100),t:gStr(a.t,200),cfg:gPlain(a.cfg)}));
 if(Array.isArray(d.packs))out.packs=d.packs.filter(p=>p&&typeof p==='object').slice(0,100).map(p=>({id:id(p.id||uid()),name:gStr(p.name,100),kw:gStr(p.kw,300),items:gArr(p.items).slice(0,60).map(i=>({e:gStr(i&&i.e,16),w:gStr(i&&i.w,60)}))}));
 if(Array.isArray(d.runs))out.runs=d.runs.slice(-300).filter(r=>r&&gInt(r.sid)!=null).map(r=>Object.assign(gPrim(r),{sid:gInt(r.sid),g:r.g?id(r.g):null,sg:r.sg?id(r.sg):undefined,pl:gArr(r.pl).slice(0,20).map(x=>gStr(x,30))}));
 if(d.cfg&&typeof d.cfg==='object')out.cfg=gPlain(d.cfg);
 if(d.prof&&typeof d.prof==='object')out.prof=gPrim(d.prof);
 if(Number.isFinite(+d.lb))out.lb=+d.lb;
 return out}
