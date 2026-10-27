/* ---- الجلسات ---- */
let SSID=null,SSEL=null,RT=null;
function startFor(id){SSID=id;SSEL=null;go('sess')}
function selG(id,on){on?SSEL.ids.add(id):SSEL.ids.delete(id)}
function selAll(v){const ie=S.iep[SSID]||{};SSEL.ids=new Set(v?Object.values(ie).flatMap(x=>x.shortTermGoals).map(g=>g.id):[]);redraw()}
const sessStart=()=>{const id=SSID&&S.students.some(s=>s.id===SSID)?SSID:(S.students[0]||{}).id;if(!id)return '<p class="mut">أضف طالباً أولاً من قسم الطلاب.</p>';SSID=id;
 const ie=S.iep[id]||{};if(!SSEL||SSEL.sid!==id)SSEL={sid:id,ids:new Set(Object.values(ie).flatMap(x=>x.shortTermGoals).filter(g=>g.subGoals.some(z=>z.status!=='mastered')).map(g=>g.id))};
 return `<div class="card"><h2 class="st" style="margin:0 0 4px">بدء جلسة جديدة</h2>
 <label>الطالب<select id="ss" onchange="SSID=+this.value;SSEL=null;redraw()">${S.students.map(s=>`<option value="${s.id}"${s.id===id?' selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
 <label>التاريخ<input id="sd" type="date" value="${ymd()}"></label>
 <p class="mut" style="margin:10px 0 0;text-align:right">اختر الأهداف من خطة الطالب:</p>
 ${Object.entries(ie).map(([k,x])=>`<h3 class="st" style="margin:8px 0 2px;font-size:calc(13px*var(--fs))">📚 ${esc(k)}</h3>${x.shortTermGoals.map(g=>`<label class="ck2"><input type="checkbox"${SSEL.ids.has(g.id)?' checked':''} onchange="selG('${g.id}',this.checked)">${esc(g.title)}</label>`).join('')}`).join('')||'<p class="mut">لا توجد خطة لهذا الطالب بعد.</p>'}
 <div class="chs" style="margin-top:8px"><button onclick="selAll(1)">تحديد الكل</button><button onclick="selAll(0)">إلغاء التحديد</button></div>
 <button class="btn" onclick="beginSess()">▶ ابدأ الجلسة</button></div>`};
async function beginSess(){if(!SSEL.ids.size)return toast('اختر هدفاً واحداً على الأقل');
 const z={id:uid(),sid:SSID,d:$('#sd').value||ymd(),dur:0,att:'p',gs:[...SSEL.ids],note:'',t0:Date.now(),open:1};S.sess.push(z);S.run=z.id;await save();CUR=SSID;go('sess')}
function runTick(){clearInterval(RT);RT=setInterval(()=>{const e=$('#rt'),z=S.sess&&S.sess.find(x=>x.id===S.run);if(!e||!z){clearInterval(RT);return}const m=Math.floor((Date.now()-z.t0)/1000),p=n=>String(n).padStart(2,'0');e.textContent=p(m/60|0)+':'+p(m%60)},1000)}
const runView=()=>{const z=S.sess.find(x=>x.id===S.run);if(!z){S.run=null;return VIEWS.sess()}
 const s=S.students.find(x=>x.id===z.sid)||{name:'—'};CUR=z.sid;const ie=S.iep[z.sid]||{},
 bl=Object.entries(ie).map(([k,x])=>[k,x.shortTermGoals.filter(g=>z.gs.includes(g.id))]).filter(a=>a[1].length);setTimeout(runTick,0);
 return `<div class="card"><div class="gm"><div class="in"><b>▶ جلسة ${esc(s.name)}</b><small>${esc(z.d)}</small></div><span class="cp" id="rt">00:00</span></div></div>
 ${bl.map(([k,gs])=>`<h2 class="st">📚 ${esc(k)}</h2><div class="tb"><table class="at"><thead>${gHead}</thead><tbody>${gs.map(g=>`<tr class="sgh"><td colspan="2"><span class="in">${esc(g.title)}</span></td></tr>${g.subGoals.map(sgRow).join('')||'<tr><td colspan="2" class="mut">لا أهداف فرعية</td></tr>'}`).join('')}</tbody></table></div>`).join('')}
 <h2 class="st">الأنشطة والاستمارات للأهداف المختارة</h2>
 ${bl.flatMap(a=>a[1]).map(g=>`<div class="card"><b style="font-size:calc(13px*var(--fs))">${esc(g.title)}</b><div class="qa" style="margin-top:8px"><button onclick="BG='${g.id}';SGACT=null;openCfg()"><em>▶</em><b>نشاط تفاعلي</b><small>يُولَّد تلقائياً</small></button><button onclick="openBag('${g.id}')"><em>🎒</em><b>استمارات وأوراق عمل</b><small>طباعة وPDF</small></button></div></div>`).join('')}
 <label>ملاحظة الجلسة<textarea rows="3" oninput="noteSv(this.value)" aria-label="ملاحظة الجلسة">${esc(z.note)}</textarea></label>
 <button class="btn" onclick="endSess()">✔ إنهاء الجلسة وحفظها</button><button class="btn g" onclick="cancelSess(this)">إلغاء الجلسة</button>`};
function noteSv(v){const z=S.sess.find(x=>x.id===S.run);if(z)z.note=v}
async function endSess(){const z=S.sess.find(x=>x.id===S.run);if(!z)return;z.dur=Math.max(1,Math.round((Date.now()-z.t0)/6e4));z.open=0;S.run=null;await save();toast('تم حفظ الجلسة');go('sess')}
function cancelSess(b){arm('cs',b,'',async()=>{S.sess=S.sess.filter(x=>x.id!==S.run);S.run=null;await save();go('sess')})}
VIEWS.sess=()=>{if(S.run)return runView();const wk=S.sess.filter(z=>Date.now()-new Date(z.d)<6048e5).length,a=[...S.sess].sort((x,y)=>y.d.localeCompare(x.d));
 return sessStart()+`<div class="gm" style="margin:16px 0 6px"><h2 class="st" style="margin:0;flex:1">سجل الجلسات</h2><button class="lnk" style="margin:0" onclick="openSess(SSID)">＋ جلسة سابقة</button></div><div class="kpis">${kpi(a.length,'جلسة')}${kpi(wk,'هذا الأسبوع')}${kpi(a.filter(z=>z.att==='p').length,'حضور')}</div>${a.slice(0,40).map(z=>sessCard(z,1)).join('')||'<p class="mut">لا توجد جلسات بعد.</p>'}`};

