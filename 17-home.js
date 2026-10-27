/* ===== الرئيسية «اليوم» (مكان واحد): إحصاءات الجلسات، جلسات اليوم، يحتاج اهتمام، سجل الحضور والغياب، الإجراءات ===== */

/* أيقونات إضافية (كانت «cal» غير معرّفة فتظهر أيقونة الجلسات مكسورة في الشريط الجانبي والسفلي) */
Object.assign(I,{
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 14.5h2M13 14.5h3"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 alert:'<path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'});

const dAgo=d=>Math.round((new Date(ymd()+'T12:00:00')-new Date(d+'T12:00:00'))/864e5);
/* قواعد «يحتاج اهتمام» (عدّلها هنا فقط):
   ١) طالب له خطة وبلا جلسة منذ ١٤ يوماً أو لم يُسجَّل له جلسات.  ٢) أهداف فرعية متعثرة: ٣ أيام محاولات على الأقل وآخر ٣ محاولات بلا «أتقن». */
function attention(){const out=[];
 S.students.forEach(s=>{const sg=sgs(s.id);if(!sg.length)return;
  const last=S.sess.filter(z=>z.sid===s.id&&!z.open).map(z=>z.d).sort().pop(),n=last?dAgo(last):null;
  if(n==null)out.push({sid:s.id,w:1,t:s.name,r:'لا جلسات مسجّلة بعد'});else if(n>=14)out.push({sid:s.id,w:1,t:s.name,r:'بلا جلسة منذ '+ar(n)+' يوماً'});
  const st=sg.filter(z=>{if(z.status==='mastered')return false;const L=z.log||[],l3=L.slice(-3);return new Set(L.map(a=>ymd(a.t))).size>=3&&l3.length===3&&!l3.some(a=>a.r==='m')});
  if(st.length)out.push({sid:s.id,w:2,t:s.name,r:(st.length>1?ar(st.length)+' أهداف متعثرة: ':'هدف متعثر: ')+st[0].title+(st.length>1?' …':'')})});
 return out.sort((a,b)=>a.w-b.w)}

/* ---- حالة الواجهة: الفترة (يوم/أسبوع/شهر) ومرشّحات جدول الحضور ---- */
let HP='w',HF={att:'',sid:0,all:0};
const HPR={d:['اليوم',0,'اليوم'],w:['الأسبوع',6,'آخر ٧ أيام'],m:['الشهر',29,'آخر ٣٠ يوماً']};
const hpRange=()=>({f:addD(ymd(),-HPR[HP][1]),t:ymd()});
const hpSess=()=>{const{f,t}=hpRange();return S.sess.filter(z=>!z.open&&z.d>=f&&z.d<=t)};
const hpSet=k=>{HP=k;HF.all=0;redraw()};
const hfSet=(k,v)=>{HF[k]=v;if(k!=='all')HF.all=0;redraw()};

/* ---- مكوّنات الرسم ---- */
/* حلقة حضور/غياب بثلاث قطع (SVG بطول مسار ١٠٠ لتسهيل النسب) */
const ring=(c,n)=>{let acc=0;const seg=(v,col)=>{if(!v)return'';const l=v/n*100,s=`<circle cx="60" cy="60" r="52" pathLength="100" fill="none" stroke="${col}" stroke-width="12" stroke-dasharray="${l} ${100-l}" stroke-dashoffset="${-acc}"/>`;acc+=l;return s};
 return`<svg viewBox="0 0 120 120" class="rg" role="img" aria-label="حضر ${ar(c.p)} وغاب ${ar(c.a)} وبعذر ${ar(c.e)} من ${ar(n)} جلسة"><circle cx="60" cy="60" r="52" pathLength="100" fill="none" stroke="var(--line)" stroke-width="12"/><g transform="rotate(-90 60 60)">${n?seg(c.p,'var(--teal)')+seg(c.a,'#e11d48')+seg(c.e,'#C9971C'):''}</g></svg>`};
const pbar=(l,v,sub)=>`<div class="pb"><div class="pbt"><span>${l}</span><b>${ar(v)}٪</b></div><div class="bar2" role="progressbar" aria-valuenow="${v}" aria-valuemin="0" aria-valuemax="100" aria-label="${l}"><i style="width:${v}%"></i></div><small>${sub}</small></div>`;
const tile=(i,n,l)=>`<div class="tl"><span class="ti">${ic(i,18)}</span><b data-n="${n}">٠</b><small>${l}</small></div>`;

/* ---- ١) إحصاءات الجلسات (أعلى الرئيسية) ---- */
const homeStats=()=>{const ss=hpSess(),n=ss.length,c={p:ss.filter(z=>z.att==='p').length,a:ss.filter(z=>z.att==='a').length,e:ss.filter(z=>z.att==='e').length},pc=pct(c.p,n),
 cov=pct(new Set(ss.map(z=>z.sid)).size,S.students.length),g=subs(),mp=pct(g.filter(x=>x.status==='mastered').length,g.length),
 mins=ss.filter(z=>z.att==='p').reduce((a,z)=>a+(z.dur||0),0),run=S.run&&S.sess.find(x=>x.id===S.run),rs=run&&S.students.find(s=>s.id===run.sid);
 return`<section class="card an" aria-label="إحصاءات الجلسات">
 <div class="an-h"><div><h2 class="st">إحصاءات الجلسات</h2><small>${HPR[HP][2]}${HP==='d'?' · '+dG(ymd())+'م':''}</small></div>
  <div class="seg" role="tablist">${Object.entries(HPR).map(([k,v])=>`<button role="tab" aria-selected="${k===HP}" class="${k===HP?'on':''}" onclick="hpSet('${k}')">${v[0]}</button>`).join('')}</div></div>
 ${rs?`<div class="live"><i class="dot"></i>جلسة جارية الآن: <b>${esc(rs.name)}</b><button onclick="CUR=${run.sid};go('sess')">متابعة</button></div>`:''}
 <div class="an-b"><div class="ringw">${ring(c,n)}<div class="rc">${n?`<b data-n="${pc}" data-s="٪">٠</b><small>نسبة الحضور</small>`:`<b>—</b><small>لا جلسات</small>`}</div></div>
  <ul class="lgd">${[['حضر',c.p,'var(--teal)'],['غاب',c.a,'#e11d48'],['بعذر',c.e,'#C9971C']].map(([l,v,col])=>`<li><i style="background:${col}"></i><span>${l}</span><b>${ar(v)}</b></li>`).join('')}<li class="tot"><span>إجمالي الجلسات</span><b>${ar(n)}</b></li></ul></div>
 <div class="pbs">${pbar('تغطية الطلاب',cov,'طلاب لهم جلسة في هذه الفترة: '+ar(new Set(ss.map(z=>z.sid)).size)+' من '+ar(S.students.length))}${pbar('الإتقان العام',mp,'أهداف فرعية متقنة: '+ar(g.filter(x=>x.status==='mastered').length)+' من '+ar(g.length))}</div>
 <div class="tiles">${tile('users',S.students.length,'طالب')}${tile('target',g.length,'هدف فرعي')}${tile('cal',n,'جلسة')}${tile('clock',mins,'دقيقة تدريب')}</div></section>`};

/* ---- ٢) جلسة جارية من يوم سابق + جلسات اليوم + يحتاج اهتمام ---- */
const homeRun=()=>{const z=S.run&&S.sess.find(x=>x.id===S.run);if(!z||z.d===ymd())return'';/* جلسة جارية من يوم سابق فقط؛ جلسة اليوم تظهر في «جلسات اليوم» بلا تكرار */const s=S.students.find(x=>x.id===z.sid)||{name:'—'};
 return`<div class="card gm runc"><span class="ti">${ic('clock',20)}</span><div class="in"><b>جلسة جارية: ${esc(s.name)}</b><small>بتاريخ ${dG(z.d)}م · اضغط للمتابعة</small></div><button class="cp" onclick="CUR=${z.sid};go('sess')">متابعة</button></div>`};
const homeToday=()=>{const a=S.sess.filter(z=>z.d===ymd()).sort((x,y)=>(x.t0||0)-(y.t0||0));
 return`<div class="sech"><h2 class="st">جلسات اليوم</h2><button class="lnk" onclick="go('sess')">＋ بدء جلسة</button></div>`+
 (a.map(z=>{const s=S.students.find(x=>x.id===z.sid)||{name:'—'},run=S.run===z.id,tm=sessTm(z);
  return`<div class="cd" style="cursor:pointer" onclick="${run?`CUR=${z.sid};go('sess')`:`sessDoc('${z.id}')`}"><span class="av">${esc(s.name[0]||'؟')}</span><div class="in"><b>${esc(s.name)}</b><small>${run?'جارية الآن':(tm?tAr(tm)+' · ':'')+ar(z.dur)+' دقيقة'}${z.gs&&z.gs.length?' · '+ar(z.gs.length)+' هدف':''}</small></div><span class="cp" style="color:${run?'var(--teal)':AT[z.att][1]};border-color:${run?'var(--teal)':AT[z.att][1]}">${run?'▶ جارية':AT[z.att][0]}</span></div>`}).join('')||'<p class="mut">لا جلسات اليوم بعد.</p>')};
const homeAttn=()=>{const a=attention();
 return`<h2 class="st">يحتاج اهتماماً${a.length?' ('+ar(a.length)+')':''}</h2>`+(a.slice(0,6).map(x=>`<div class="cd" style="cursor:pointer" onclick="openSt(${x.sid})"><span class="ti ${x.w===1?'wn':'er'}">${ic(x.w===1?'clock':'alert',18)}</span><div class="in"><b>${esc(x.t)}</b><small>${esc(x.r)}</small></div><span class="cp">فتح ›</span></div>`).join('')||'<p class="mut">✅ لا شيء يحتاج اهتماماً الآن.</p>')+(a.length>6?`<p class="mut">و${ar(a.length-6)} أخرى. التقرير العام يعرضها كلها.</p>`:'')};

/* ---- ٣) سجل الحضور والغياب: جدول بمرشّحات (الحالة + الطالب) ضمن فترة الإحصاءات ---- */
const homeTable=()=>{const{f,t}=hpRange(),base=S.sess.filter(z=>!z.open&&z.d>=f&&z.d<=t&&(!HF.sid||z.sid===HF.sid)),
 rows=base.filter(z=>!HF.att||z.att===HF.att).sort((a,b)=>byTime(b,a)),show=HF.all?rows:rows.slice(0,8),cn=k=>base.filter(z=>!k||z.att===k).length;
 return`<div class="sech"><h2 class="st">سجل الحضور والغياب</h2><button class="lnk" onclick="openSess(HF.sid||undefined)">＋ جلسة سابقة</button></div>
 <div class="card tc"><div class="tf"><div class="chs">${[['','الكل'],['p','حضر'],['a','غاب'],['e','بعذر']].map(([k,l])=>`<button class="${HF.att===k?'on':''}" onclick="hfSet('att','${k}')">${l} (${ar(cn(k))})</button>`).join('')}</div>
  <select aria-label="تصفية حسب الطالب" onchange="hfSet('sid',+this.value)"><option value="0">كل الطلاب</option>${S.students.map(s=>`<option value="${s.id}"${s.id===HF.sid?' selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
 ${show.length?`<div class="tw"><table class="dt"><thead><tr><th>التاريخ والوقت</th><th>الطالب</th><th>الحالة</th><th><span class="sr">تعديل</span></th></tr></thead><tbody>${show.map(z=>{const s=S.students.find(x=>x.id===z.sid)||{name:'—'};
  return`<tr><td>${dCell(z.d)}<small><bdi>${sessSpan(z)}</bdi></small></td><td><b>${esc(s.name)}</b><small>${z.dur?ar(z.dur)+' دقيقة':'—'}</small></td><td><span class="bdg ${z.att}">${AT[z.att][0]}</span></td><td><button class="ib sm" onclick="editSess('${z.id}')" aria-label="تعديل الجلسة">${ic('edit',16)}</button></td></tr>`}).join('')}</tbody></table></div>
 ${rows.length>8?`<button class="btn g" style="margin-top:8px" onclick="hfSet('all',${HF.all?0:1})">${HF.all?'عرض أقل':'عرض كل الجلسات ('+ar(rows.length)+')'}</button>`:''}`
 :`<p class="mut" style="margin:14px 0">${S.students.length?'لا جلسات مطابقة في هذه الفترة. جرّب «الشهر» أو سجّل جلسة سابقة.':'أضف طالباً أولاً من قسم الطلاب.'}</p>`}</div>`};

VIEWS.home=()=>{const n=(PROF().n||'').trim().split(' ')[0],h=dH(ymd());
 return`<section class="hero"><div class="chips"><span class="chip">${ic('cal',14)}${dDay(ymd())} ${dG(ymd())}م</span>${h?`<span class="chip">${ic('moon',14)}${esc(h)}</span>`:''}</div>
 <h1>${new Date().getHours()<12?'صباح الخير':'مساء الخير'}، أ. ${esc(n)} 👋</h1><p>خطة اليوم بالترتيب: جلساتك ثم ما يحتاج اهتماماً</p></section>${bkCard()}${homeRun()}${homeStats()}${homeToday()}${homeAttn()}${homeTable()}
 <h2 class="st">إجراءات سريعة</h2>
 <div class="qa">
  <button onclick="go('students')"><em>${ic('users',22)}</em><b>الطلاب</b><small>إضافة طالب وفتح الخطة</small></button>
  <button onclick="go('sess')"><em>${ic('cal',22)}</em><b>الجلسات</b><small>بدء جلسة وسجل الجلسات</small></button>
  <button onclick="go('reports')"><em>${ic('file',22)}</em><b>التقارير</b><small>تقرير A4 رسمي</small></button>
  <button onclick="go('games')"><em>${ic('game',22)}</em><b>الأنشطة</b><small>مكتبة اللعب الحر</small></button>
 </div>`};
