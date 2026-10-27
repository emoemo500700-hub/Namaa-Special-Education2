/* ===== المرحلة ب: الجلسات + الربط + اللقطات الأسبوعية ===== */
const ymd=d=>new Date(d||Date.now()).toLocaleDateString('en-CA');
const AT={p:['حضر','var(--teal)'],a:['غاب','#e11d48'],e:['بعذر','#C9971C']};
function snap(){const l=S.snap.slice(-1)[0];if(l&&Date.now()-l.t<6048e5)return;const m={};S.students.forEach(s=>{const a=sgs(s.id);m[s.id]=[a.filter(z=>z.status==='mastered').length,a.length]});S.snap.push({t:Date.now(),d:ymd(),m});S.snap=S.snap.slice(-80);save()}
function openSess(sid){const id=sid||(T==='st'?CUR:(S.students[0]||{}).id);if(!id)return toast('أضف طالباً أولاً');
 const gl=Object.values(S.iep[id]||{}).flatMap(x=>x.shortTermGoals).filter(g=>g.subGoals.some(z=>z.status!=='mastered')).slice(0,8);
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><form class="sh" style="max-height:88vh;overflow:auto" onsubmit="addSess(event)"><h2 class="st" style="margin:0 0 4px">تسجيل جلسة</h2>
 <select id="ss" aria-label="الطالب">${S.students.map(s=>`<option value="${s.id}"${s.id===id?' selected':''}>${esc(s.name)}</option>`).join('')}</select>
 <input id="sd" type="date" value="${ymd()}" aria-label="التاريخ"><select id="sa" aria-label="الحضور"><option value="p">حضر</option><option value="a">غاب</option><option value="e">غاب بعذر</option></select>
 <select id="sm" aria-label="المدة"><option>30</option><option selected>45</option><option>60</option></select>
 ${gl.length?`<p style="margin:10px 0 2px;font-size:calc(12px*var(--fs));color:var(--mut)">الأهداف التي عملت عليها:</p>`+gl.map(g=>`<label class="ck2"><input type="checkbox" class="sg" value="${g.id}">${esc(g.title)}</label>`).join(''):''}
 <input id="sn" placeholder="ملاحظة (اختياري)" aria-label="ملاحظة"><button class="btn">حفظ الجلسة</button></form></div>`}
async function addSess(e){e.preventDefault();S.sess.push({id:uid(),sid:+$('#ss').value,d:$('#sd').value||ymd(),dur:+$('#sm').value,att:$('#sa').value,gs:[...document.querySelectorAll('.sg:checked')].map(x=>x.value),note:$('#sn').value.trim()});
 await save();closeSheet();go(T);toast('تم تسجيل الجلسة')}
function delSess(id,b){arm('x'+id,b,'',async()=>{S.sess=S.sess.filter(z=>z.id!==id);await save();go(T)})}
const sessCard=(z,n)=>`<div class="cd"><div class="in"><b>${n?esc((S.students.find(s=>s.id===z.sid)||{name:'—'}).name):z.d}</b><small>${n?z.d+' · ':''}${ar(z.dur)} دقيقة${z.gs&&z.gs.length?' · '+ar(z.gs.length)+' هدف':''}${z.note?' · '+esc(z.note):''}</small></div><span class="cp" style="color:${AT[z.att][1]};border-color:${AT[z.att][1]}">${AT[z.att][0]}</span><button class="dl" style="color:var(--teal)" onclick="sessDoc('${z.id}')" aria-label="ملخص الجلسة">📄</button><button class="dl" onclick="delSess('${z.id}',this)">حذف</button></div>`;
const stSess=id=>{const a=S.sess.filter(z=>z.sid===id).sort((x,y)=>y.d.localeCompare(x.d));return `<div class="card" style="margin:10px 0"><div class="gm"><b class="in">🗓️ الجلسات (${ar(a.length)}${a.length?' · حضور '+ar(Math.round(a.filter(z=>z.att==='p').length/a.length*100))+'٪':''})</b></div>${a.slice(0,3).map(z=>sessCard(z)).join('')||'<small style="color:var(--mut)">لا جلسات بعد</small>'}</div>`};
