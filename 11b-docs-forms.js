/* ---- بيانات الجلسات المرتبطة بالاستمارات ---- */
const MK={m:'✓',p:'م',n:'✗'};
let DM='auto',DK='';
const attsOf=(sg,z)=>(sg.log||[]).filter(a=>!z||a.s===z.id||(a.s==null&&ymd(a.t)===z.d));
const sessOfGoal=g=>S.sess.filter(x=>x.sid===CUR&&x.gs&&x.gs.includes(g.id)).sort((a,b)=>b.d.localeCompare(a.d)||(b.t0||0)-(a.t0||0));
function dSess(g){const ss=sessOfGoal(g);
 if(DM==='blank')return{z:null,blank:1,ss};
 if(DM==='all')return{z:null,all:1,ss};
 if(DM!=='auto'){const z=S.sess.find(x=>x.id===DM&&x.sid===CUR);if(z)return{z,ss}}
 return{z:ss[0]||null,ss}}
const ordN=z=>S.sess.filter(x=>x.sid===z.sid).sort((a,b)=>a.d.localeCompare(b.d)||(a.t0||0)-(b.t0||0)).findIndex(x=>x.id===z.id)+1;
const stat=g=>{const a=g.subGoals,m=a.filter(z=>z.status==='mastered').length;return[m,a.length,a.length?Math.round(m/a.length*100):0]};
const recOf=sg=>{const need=sg.filter(s=>s.status!=='mastered');
 if(!sg.length)return'أضف أهدافاً فرعية لهذا الهدف.';
 if(!need.length)return'أتقن الطالب جميع الأهداف الفرعية. يُنتقل إلى الهدف القصير التالي.';
 const hard=need.filter(s=>s.status==='not'||(s.log||[]).slice(-3).some(a=>a.r==='n'));
 return'مواصلة التدريب على: '+need.slice(0,3).map(s=>s.title).join('، ')+(hard.length?'. مع تجزئة المهمة وتقديم دعم إضافي في: '+hard.slice(0,2).map(s=>s.title).join('، '):'')+'.'};
const dMeta=d=>dH(d)?[['التاريخ',dH(d)],['الموافق',dG(d)+'م']]:[['التاريخ',dG(d)+'م']];
const hdMeta=(date)=>[['الطالب',stu().name],['الصف',stu().grade],...dMeta(date),['',SPEC()]];
const weekOf=d=>{const x=new Date(dstr(d)+'T12:00:00'),k=(x.getDay()+1)%7;return addD(d,-k)};
const DAYS=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
const opts=(it,x)=>{const n=it.length,a=[it[x].w];for(let j=1;a.length<Math.min(3,n);j++)a.push(it[(x+j)%n].w);const r=x%a.length;return a.slice(r).concat(a.slice(0,r))};

/* ---- بناء محتوى الاستمارة (مع التعبئة التلقائية) ---- */
const sessKV=z=>({t:'tbl',h:null,w:[16,34,16,34],r:[[{x:'التاريخ',c:'lb'},dG(z.d),{x:'الجلسة',c:'lb'},'رقم '+arn(ordN(z))],[{x:'الحضور',c:'lb'},AT[z.att][0],{x:'المدة',c:'lb'},z.dur?arn(z.dur)+' دقيقة':'—']]});
const formCtx=g=>{const{z,blank,ss}=dSess(g);return{g,it:gI(g),sg:g.subGoals,z,blank,ss,date:z?z.d:ymd(),E:'',stu1:stu().name.split(' ')[0]}};
/* كل استمارة دالة مستقلة تُرجع كتل IR (أضف استمارة جديدة هنا فقط + TIT + زر في openBag) */
const FORMS={
 base:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  B.push({t:'tbl',fill:1,h:['الهدف الفرعي','١','٢','٣','٤','٥','النسبة'],w:[40,9,9,9,9,9,15],
   r:sg.map(s=>{const L=blank?[]:lg(s).slice(0,5);const ok=L.filter(a=>a.r==='m').length;
    return[{x:s.title,c:'l'},...[0,1,2,3,4].map(i=>L[i]?{x:MK[L[i].r],c:'mk'}:E),L.length?arn(Math.round(ok/L.length*100))+'٪':E]})});
  B.push({t:'p',x:'✓ استجابة مستقلة  ·  م بمساعدة  ·  ✗ خاطئة'+(blank?'':'  ·  تُعبَّأ من أول ٥ محاولات مسجّلة لكل هدف فرعي')});return B},
 note:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  if(z)B.push(sessKV(z));
  B.push({t:'tbl',fill:1,h:['الهدف الفرعي','المحاولات','النتيجة'],w:[40,14,46],
   r:sg.map(s=>{const L=z?attsOf(s,z):[],l=L.length?L[L.length-1].r:'';
    return[{x:s.title,c:'l'},L.length?arn(L.length):E,(l==='m'?'☑':'☐')+' أتقن   '+(l==='p'?'☑':'☐')+' بمساعدة   '+(l==='n'?'☑':'☐')+' لم يتقن']})});
  B.push({t:'p',x:'ملاحظات الأخصائي:',b:1,c:'l'});
  if(z&&z.note)B.push({t:'p',x:z.note,c:'l'});
  B.push({t:'ln',n:z&&z.note?2:3,fill:1});
  B.push({t:'p',x:'التوصية للجلسة القادمة:',b:1,c:'l'});
  B.push(blank?{t:'ln',n:2}:{t:'p',x:recOf(sg),c:'l'});return B},
 log:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  let A=[];if(!blank)sg.forEach(s=>(z?attsOf(s,z):lg(s)).forEach(a=>A.push({s,a})));
  A.sort((x,y)=>x.a.t-y.a.t);A=A.slice(-12);
  B.push({t:'tbl',fill:1,h:['#','التاريخ','الهدف الفرعي','✓','م','✗','ملاحظة'],w:[6,14,36,6,6,6,26],
   r:Array.from({length:12},(_,i)=>{const o=A[i];return[arn(i+1),o?dG(o.a.t):E,o?{x:o.s.title,c:'l'}:E,o&&o.a.r==='m'?{x:'✓',c:'mk'}:E,o&&o.a.r==='p'?{x:'✓',c:'mk'}:E,o&&o.a.r==='n'?{x:'✓',c:'mk'}:E,E]})});
  B.push({t:'p',x:'✓ مستقل  ·  م بمساعدة  ·  ✗ لم يتقن (تُعلَّم الخانة المناسبة)'});return B},
 par:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  const sc=S.sess.filter(x=>x.sid===CUR&&x.gs&&x.gs.includes(g.id)),pr=sc.filter(x=>x.att==='p'),[m,n,p]=stat(g),last=ss[0];
  B.push({t:'p',x:'عزيزي ولي الأمر، السلام عليكم ورحمة الله وبركاته. نوافيكم بمستوى ابنكم في الهدف أعلاه، ونأمل تعبئة الجزء الأخير بعد التدريب المنزلي.',c:'l'});
  if(!blank)B.push({t:'tbl',h:null,w:[22,28,22,28],r:[[{x:'جلسات الهدف',c:'lb'},arn(sc.length)+' (حضر '+arn(pr.length)+')',{x:'آخر جلسة',c:'lb'},last?dG(last.d):'—'],[{x:'الأهداف المتقنة',c:'lb'},arn(m)+' من '+arn(n),{x:'نسبة الإتقان',c:'lb'},{x:arn(p)+'٪',bar:p}]]});
  if(!blank)B.push({t:'tbl',h:['الهدف الفرعي','الحالة'],w:[70,30],r:sg.map(s=>[{x:s.title,c:'l'},SL[s.status||'new'][0]])});
  B.push({t:'tbl',fill:1,h:['السؤال','الإجابة'],w:[45,55],r:[['هل مارس الطالب النشاط هذا الأسبوع؟','☐ نعم   ☐ أحياناً   ☐ لا'],['كم مرة في الأسبوع؟',E],['تفاعل الطالب','☐ ممتاز   ☐ جيد   ☐ يحتاج دعماً'],['ملاحظات أو صعوبات',E]]});
  B.push({t:'p',x:'توقيع ولي الأمر: ......................................'});return B},
 conn:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  B.push({t:'p',x:'صِل كل صورة بالكلمة المناسبة:',b:1});
  B.push({t:'tbl',fill:1,nb:1,h:null,w:[28,44,28],r:it.map((i,x)=>[{x:i.e,c:'ci'},E,{x:[...it].reverse()[x].w,c:'cw'}])});return B},
 circ:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  B.push({t:'p',x:'ضع دائرة حول الكلمة الصحيحة تحت كل صورة:',b:1});
  B.push({t:'tbl',fill:1,nb:1,h:null,w:[22,26,26,26],r:it.map((i,x)=>[{x:i.e,c:'ci'},...opts(it,x).map(o=>({x:o,c:'co'}))].concat(opts(it,x).length<3?[E]:[]))});return B},
 wr:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  B.push({t:'p',x:'انظر إلى الصورة، اكتب الكلمة فوق الخط المنقّط، ثم ردّدها ٥ مرات وضع علامة ☑ عند كل مرة:',b:1});
  B.push({t:'tbl',fill:1,nb:1,h:null,w:[20,40,40],r:it.map(i=>[{x:i.e,c:'ci'},{x:i.w,c:'gh'},'☐  ☐  ☐  ☐  ☐'])});return B},
 lw:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];const nm=resolveT(g,'')[0],L=nm.startsWith('حرف ')?nm.slice(4):'ا';
  B.push({t:'p',x:'تتبّع الحرف ('+L+') ثم اكتبه بخط جميل في كل سطر:',b:1});
  B.push({t:'tbl',fill:1,nb:1,h:null,w:[100],r:Array.from({length:7},(_,i)=>[{x:Array(i<2?6:8).fill(L).join('  '),c:'gh'}])});return B},
 home:c=>{const{g,it,sg,z,blank,ss,E,stu1,date}=c,B=[],lg=s=>s.log||[];
  const w0=weekOf(date),need=sg.filter(s=>s.status!=='mastered').slice(0,4);
  B.push({t:'p',x:'الأسبوع: من '+dG(w0)+' إلى '+dG(addD(w0,5)),b:1});
  B.push({t:'p',x:'المطلوب: مارس النشاط مع '+stu1+' من ٥ إلى ١٠ دقائق يومياً بأسلوب لعب، وشجّعه عند كل استجابة صحيحة.',c:'l'});
  if(!blank&&need.length)B.push({t:'p',x:'التركيز هذا الأسبوع: '+need.map(s=>s.title).join('، '),c:'l'});
  B.push({t:'p',x:'الكلمات: '+it.map(i=>i.e+' '+i.w).join('  ·  '),c:'l'});
  B.push({t:'tbl',fill:1,h:['اليوم','التاريخ','تمّ التدريب','ملاحظة'],w:[18,20,18,44],r:DAYS.map((d,i)=>[d,dG(addD(w0,i)),'☐',E])});
  B.push({t:'p',x:'توقيع ولي الأمر: ..........................        توقيع المعلم: ..........................'});return B}};
function mkDoc(k,g){const c=formCtx(g);return{title:TIT[k],date:c.date,meta:hdMeta(c.date),goal:g.title,blocks:FORMS[k](c)}}

/* ---- ملخص جلسة كاملة (كل أهدافها ونتائجها) ---- */
function mkSessDoc(z){CUR=z.sid;const ie=S.iep[z.sid]||{},B=[];
 B.push({t:'tbl',h:null,w:[16,34,16,34],r:[[{x:'التاريخ',c:'lb'},dG(z.d),{x:'الجلسة',c:'lb'},'رقم '+arn(ordN(z))],[{x:'الحضور',c:'lb'},AT[z.att][0],{x:'المدة',c:'lb'},z.dur?arn(z.dur)+' دقيقة':'—']]});
 Object.entries(ie).forEach(([k,x])=>{const gs=x.shortTermGoals.filter(g=>z.gs.includes(g.id));if(!gs.length)return;
  B.push({t:'h',x:'📚 '+k});
  B.push({t:'tbl',h:['الهدف الفرعي','المحاولات','آخر نتيجة','الحالة'],w:[44,14,18,24],
   r:gs.flatMap(g=>[[{x:'◼ '+g.title,c:'lb'},'','','']].concat(g.subGoals.map(s=>{const L=attsOf(s,z),l=L.length?L[L.length-1].r:'';return[{x:s.title,c:'l'},L.length?arn(L.length):'—',l?RL[l]:'—',SL[s.status||'new'][0]]})))})});
 const need=Object.values(ie).flatMap(x=>x.shortTermGoals).filter(g=>z.gs.includes(g.id)).flatMap(g=>g.subGoals).filter(s=>s.status!=='mastered');
 B.push({t:'p',x:'ملاحظة الجلسة:',b:1,c:'l'});if(z.note)B.push({t:'p',x:z.note,c:'l'});B.push({t:'ln',n:z.note?2:3,fill:1});
 B.push({t:'p',x:'التوصية للجلسة القادمة:',b:1,c:'l'});B.push({t:'p',x:need.length?'مواصلة التدريب على: '+need.slice(0,4).map(s=>s.title).join('، ')+'.':'اكتملت الأهداف المختارة. يُنتقل إلى أهداف جديدة.',c:'l'});
 return{title:'ملخص الجلسة',date:z.d,meta:hdMeta(z.d),goal:'',blocks:B}}
function sessDoc(id){const z=S.sess.find(x=>x.id===id);if(!z)return;DK='';docOut(mkSessDoc(z),'namaa-session-STD'+(100+z.sid)+'-'+z.d,"closeSheet()")}
