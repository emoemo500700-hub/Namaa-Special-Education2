/* ===== التقارير (تُبنى من الجلسات والمحاولات بتاريخها الفعلي) ===== */
let RP={sid:null,from:'',to:'',dx:0};
const periodDef=()=>{if(!RP.to)RP.to=ymd();if(!RP.from)RP.from=addD(RP.to,-30)};
const byTime=(a,b)=>a.d.localeCompare(b.d)||sessTm(a).localeCompare(sessTm(b));
const sessIn=(sid,f,t)=>S.sess.filter(z=>z.sid===sid&&!z.open&&z.d>=f&&z.d<=t).sort(byTime);
const pct=(a,b)=>b?Math.round(a/b*100):0;

/* ---- المحاولات بأثر رجعي: تاريخ المحاولة = تاريخ جلستها المرتبطة، وإلا لحظة تسجيلها ---- */
const attTs=a=>{const z=a.s&&S.sess.find(x=>x.id===a.s);return z&&ymd(a.t)!==z.d?tsOf(z.d,sessTm(z)):a.t};
const attDay=a=>ymd(attTs(a));
const attIn=(sg,f,t)=>(sg.log||[]).filter(a=>{const d=attDay(a);return d>=f&&d<=t});
/* هل كان الهدف الفرعي متقناً عند لحظة ts؟ (إعادة تشغيل سجل المحاولات بنفس قاعدة logA) */
function masteredAt(sg,ts){const L=(sg.log||[]).map(a=>({r:a.r,t:attTs(a)})).sort((x,y)=>x.t-y.t);if(!L.length)return sg.status==='mastered';
 const need=sg.need||3,seen=[];let st='new';
 for(const a of L){if(a.t>ts)break;seen.push(a.r);const t=seen.slice(-need),ok=a.r==='m'&&t.length>=need&&t.every(x=>x==='m');
  st=a.r==='n'?'not':a.r==='p'?'prompted':(ok||st==='mastered')?'mastered':'progress'}
 return st==='mastered'}
/* نسبة الإتقان عند بداية الفترة: من السجل التاريخي إن وُجد، وإلا من اللقطة الأسبوعية */
function masteryAt(sid,d){const all=sgs(sid);if(all.some(x=>(x.log||[]).length)){const ts=tsOf(d,'00:00');return pct(all.filter(x=>masteredAt(x,ts)).length,all.length)}
 const a=(S.snap||[]).filter(x=>x.d<=d&&x.m&&x.m[sid]),sn=a.length?a[a.length-1]:null;return sn?pct(sn.m[sid][0],sn.m[sid][1]):null}

/* ---- عناصر مشتركة ---- */
const ATX={p:'✓ حضر',a:'✗ غاب',e:'غاب بعذر'};
const dualD=d=>dG(d)+'\n'+dDay(d)+' '+dHs(d)+'هـ';
const whenS=z=>dG(z.d)+'م'+(sessTm(z)?' · '+tAr(sessTm(z)):'');
const resOf=z=>{const A=sessAtt(z),c=r=>A.filter(x=>x.a.r===r).length;return A.length?'النتائج: ✓'+arn(c('m'))+' م'+arn(c('p'))+' ✗'+arn(c('n')):''};
/* يضيف اليوم ووقت الجلسة إلى ترويسة أي استمارة مربوطة بجلسة */
function stampDoc(doc,z){if(!z)return doc;const i=doc.meta.findIndex(m=>m[0]==='الموافق'),tm=sessTm(z);
 if(i>=0)doc.meta[i][1]=dDay(z.d)+' '+doc.meta[i][1];
 if(tm)doc.meta.splice(i>=0?i+1:doc.meta.length-1,0,['الوقت',sessSpan(z)]);return doc}
{const _mk=mkDoc;mkDoc=function(k,g){return stampDoc(_mk(k,g),dSess(g).z)}}
{const _ms=mkSessDoc;mkSessDoc=function(z){return stampDoc(_ms(z),z)}}

function mkReport(sid,f,t){CUR=sid;const s=stu(),ie=S.iep[sid]||{},ses=sessIn(sid,f,t),B=[],pr=ses.filter(z=>z.att==='p'),ab=ses.filter(z=>z.att==='a').length,ex=ses.filter(z=>z.att==='e').length,mins=pr.reduce((a,z)=>a+(z.dur||0),0);
 const all=sgs(sid),now=pct(all.filter(x=>x.status==='mastered').length,all.length),was=masteryAt(sid,f);
 B.push({t:'tbl',h:null,w:[18,32,18,32],r:[
  [{x:'الفترة (ميلادي)',c:'lb'},dG(f)+' – '+dG(t)+'م',{x:'عدد الجلسات',c:'lb'},arn(ses.length)],
  [{x:'الفترة (هجري)',c:'lb'},dHs(f)+' – '+dHs(t)+'هـ',{x:'وقت الإصدار',c:'lb'},tAr(tHM(Date.now()))],
  [{x:'حضر / غاب / بعذر',c:'lb'},arn(pr.length)+' / '+arn(ab)+' / '+arn(ex),{x:'نسبة الحضور',c:'lb'},ses.length?{x:arn(pct(pr.length,ses.length))+'٪',bar:pct(pr.length,ses.length)}:'—'],
  [{x:'أول جلسة',c:'lb'},ses.length?whenS(ses[0]):'—',{x:'آخر جلسة',c:'lb'},ses.length?whenS(ses[ses.length-1]):'—'],
  [{x:'مدة التدريب',c:'lb'},arn(mins)+' دقيقة',{x:'الإتقان العام',c:'lb'},was==null?{x:arn(now)+'٪ (الآن)',bar:now}:{x:arn(was)+'٪ ← '+arn(now)+'٪ ('+(now>=was?'+':'')+arn(now-was)+')',bar:now}]
  ].concat(RP.dx&&s.dx?[[{x:'التشخيص',c:'lb'},{x:s.dx,c:'l'},{x:'الصف',c:'lb'},s.grade]]:[])});
 B.push({t:'h',x:'التقدم حسب المادة'});
 B.push({t:'tbl',h:['المادة','أهداف فرعية','متقن','نسبة الإتقان','محاولات الفترة','نجاح المحاولات'],w:[26,13,10,23,14,14],
  r:Object.entries(ie).map(([k,x])=>{const a=x.shortTermGoals.flatMap(g=>g.subGoals),m=a.filter(z=>z.status==='mastered').length,at=a.flatMap(z=>attIn(z,f,t)),ok=at.filter(z=>z.r==='m').length;
   return[{x:k,c:'l'},arn(a.length),arn(m),{x:arn(pct(m,a.length))+'٪',bar:pct(m,a.length)},at.length?arn(at.length):'—',at.length?arn(pct(ok,at.length))+'٪':'—']})});
 Object.entries(ie).forEach(([k,x])=>{if(!x.shortTermGoals.length)return;B.push({t:'h',x:'📚 '+k+(x.longTermGoal?' — '+x.longTermGoal:'')});
  B.push({t:'tbl',h:['الهدف الفرعي','الحالة','محاولات','✓','م','✗'],w:[46,18,12,8,8,8],
   r:x.shortTermGoals.flatMap(g=>[[{x:'◼ '+g.title,c:'lb'},'','','','','']].concat(g.subGoals.map(z=>{const at=attIn(z,f,t),c=r=>arn(at.filter(a=>a.r===r).length);return[{x:z.title,c:'l'},SL[z.status||'new'][0],at.length?arn(at.length):'—',c('m'),c('p'),c('n')]})))})});
 /* سجل الحضور والغياب: تاريخان (ميلادي/هجري) + اليوم + وقت البدء والانتهاء */
 B.push({t:'h',x:'سجل الجلسات والحضور والغياب'});
 const gt=z=>(z.gs||[]).map(i=>{for(const y of Object.values(ie))for(const g of y.shortTermGoals)if(g.id===i)return g.title;return''}).filter(Boolean).join('، ')||'—';
 B.push({t:'tbl',h:['التاريخ','الوقت','الحضور','المدة','الأهداف والنتائج','ملاحظة'],w:[19,17,11,9,28,16],
  r:ses.length?ses.map(z=>[dualD(z.d),sessSpan(z).replace(' – ','\n'),ATX[z.att],z.dur?arn(z.dur)+' د':'—',{x:gt(z)+(resOf(z)?'\n'+resOf(z):''),c:'l'},{x:z.note||'—',c:'l'}]):[['—','—','—','—','لا جلسات في هذه الفترة','—']]});
 const rec=[];Object.values(ie).forEach(x=>x.shortTermGoals.forEach(g=>g.subGoals.forEach(z=>{if(z.status==='mastered')return;const at=attIn(z,f,t),ok=at.filter(a=>a.r==='m').length;
  if(at.length>=3&&pct(ok,at.length)<50)rec.push('يحتاج إعادة تدريب أو تجزئة: '+z.title+' (نجاح '+arn(pct(ok,at.length))+'٪ من '+arn(at.length)+' محاولات)');
  else if(!at.length)rec.push('لم يُتدرَّب عليه في هذه الفترة: '+z.title)})));
 B.push({t:'h',x:'التوصيات (مولَّدة من البيانات)'});
 (rec.slice(0,8).length?rec.slice(0,8):['لا توصيات عاجلة. الأداء منتظم في هذه الفترة.']).forEach(r=>B.push({t:'p',x:'• '+r,c:'l'}));
 B.push({t:'p',x:'ملاحظات الأخصائي:',b:1,c:'l'});B.push({t:'ln',n:3,fill:1});
 return{title:'تقرير متابعة الطالب',date:t,meta:[['الطالب',s.name],['الصف',s.grade],...dMeta(t),['',SPEC()]],goal:'',blocks:B}}

function mkAllReport(f,t){const B=[],rows=S.students.map(s=>{const ses=sessIn(s.id,f,t),pr=ses.filter(z=>z.att==='p'),a=sgs(s.id),m=a.filter(z=>z.status==='mastered').length,last=S.sess.filter(z=>z.sid===s.id&&!z.open).sort(byTime).pop();
  return{s,ses,pr,a,m,last,p:pct(m,a.length)}});
 const nS=rows.reduce((a,r)=>a+r.ses.length,0),nP=rows.reduce((a,r)=>a+r.pr.length,0);
 B.push({t:'tbl',h:null,w:[18,32,18,32],r:[
  [{x:'الفترة (ميلادي)',c:'lb'},dG(f)+' – '+dG(t)+'م',{x:'عدد الطلاب',c:'lb'},arn(rows.length)],
  [{x:'الفترة (هجري)',c:'lb'},dHs(f)+' – '+dHs(t)+'هـ',{x:'الجلسات',c:'lb'},arn(nS)],
  [{x:'نسبة الحضور',c:'lb'},nS?{x:arn(pct(nP,nS))+'٪',bar:pct(nP,nS)}:'—',{x:'متوسط الإتقان',c:'lb'},arn(Math.round(rows.reduce((a,r)=>a+r.p,0)/Math.max(1,rows.length)))+'٪']]});
 B.push({t:'h',x:'ملخص الطلاب'});
 B.push({t:'tbl',fill:1,h:['الطالب','الصف','جلسات','حضور','أهداف','متقن','الإتقان','آخر جلسة'],w:[21,14,8,8,8,8,15,18],r:rows.map(r=>[{x:r.s.name,c:'l'},r.s.grade.replace('الصف ','').replace(' الابتدائي',' ابتدائي'),arn(r.ses.length),r.ses.length?arn(pct(r.pr.length,r.ses.length))+'٪':'—',arn(r.a.length),arn(r.m),{x:arn(r.p)+'٪',bar:r.p},r.last?dG(r.last.d)+(sessTm(r.last)?'\n'+tAr(sessTm(r.last)):''):'—'])});
 const att=rows.filter(r=>!r.last||Date.now()-new Date(r.last.d+'T12:00:00')>14*864e5);
 B.push({t:'h',x:'يحتاج اهتماماً'});
 (att.length?att.map(r=>'• '+r.s.name+': '+(r.last?'لا جلسة منذ أكثر من ١٤ يوماً (آخر جلسة '+whenS(r.last)+')':'لا جلسات مسجّلة بعد')):['• لا طلاب بلا جلسة منذ ١٤ يوماً.']).forEach(x=>B.push({t:'p',x,c:'l'}));
 return{title:'التقرير العام لجميع الطلاب',date:t,meta:[['الفترة',dG(f)+' – '+dG(t)],['عدد الطلاب',arn(rows.length)],...dMeta(t),['',SPEC()]],goal:'',blocks:B}}

/* ---- تبويب التقارير: ملخص حيّ للفترة المختارة (يتحدّث فور إدخال جلسات سابقة) ---- */
const rpLive=()=>{periodDef();const ses=sessIn(RP.sid,RP.from,RP.to),p=ses.filter(z=>z.att==='p').length;
 return`<div class="dd">${dFull(RP.from)}<br>إلى ${dFull(RP.to)}</div><div class="rps"><div><b>${ar(ses.length)}</b><small>جلسة</small></div><div><b>${ar(p)}</b><small>حضر</small></div><div><b>${ar(ses.length-p)}</b><small>غاب</small></div><div><b>${ar(pct(p,ses.length))}٪</b><small>الحضور</small></div></div>`};
const rpSet=(k,v)=>{RP[k]=v;const e=$('#rpl');if(e)e.innerHTML=rpLive()};
VIEWS.reports=()=>{periodDef();if(!RP.sid||!S.students.some(s=>s.id===RP.sid))RP.sid=(S.students[0]||{}).id;
 if(!S.students.length)return'<h2 class="st" style="margin-top:0">التقارير</h2><p class="mut">أضف طالباً أولاً.</p>';
 return`<h2 class="st" style="margin-top:0">التقارير</h2><div class="card"><p class="mut" style="text-align:right;margin:0 0 6px">تُبنى تلقائياً من الجلسات ونتائجها بتواريخها وأوقاتها الفعلية، ويشمل ذلك الجلسات المسجّلة بأثر رجعي.</p>
 <label>الطالب<select id="rs" onchange="rpSet('sid',+this.value)">${S.students.map(s=>`<option value="${s.id}"${s.id===RP.sid?' selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
 <div class="row2"><label>من تاريخ<input id="rf" type="date" value="${RP.from}" onchange="rpSet('from',this.value)"></label><label>إلى تاريخ<input id="rt2" type="date" value="${RP.to}" onchange="rpSet('to',this.value)"></label></div>
 <div id="rpl">${rpLive()}</div>
 <label class="ck2"><input type="checkbox" ${RP.dx?'checked':''} onchange="RP.dx=this.checked?1:0">إظهار التشخيص في التقرير</label>
 <div class="chs" style="margin:6px 0"><button onclick="RP.from=addD(ymd(),-7);RP.to=ymd();redraw()">آخر أسبوع</button><button onclick="RP.from=addD(ymd(),-30);RP.to=ymd();redraw()">آخر ٣٠ يوماً</button><button onclick="RP.from=addD(ymd(),-120);RP.to=ymd();redraw()">فصل دراسي</button></div>
 <button class="btn" onclick="showReport(0)">📄 تقرير الطالب</button><button class="btn g" onclick="showReport(1)">📊 التقرير العام لكل الطلاب</button><button class="btn g" onclick="openSess(RP.sid)">🕘 تسجيل جلسة سابقة</button></div>`};
function showReport(all){periodDef();if(RP.from>RP.to)return toast('تاريخ البداية بعد النهاية');DK='';
 const doc=all?mkAllReport(RP.from,RP.to):mkReport(RP.sid,RP.from,RP.to);docOut(doc,all?'namaa-report-all-'+RP.to:'namaa-report-STD'+(100+RP.sid)+'-'+RP.to,'closeSheet()')}
