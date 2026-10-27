/* ===== المرحلة أ: الشريط الجانبي + مؤشر الأهداف ===== */
const SECS=[...TABS,['games','الأنشطة','game']];
const sbHTML=()=>`<div class="gm" style="margin-bottom:8px"><div class="lg">🌱</div><b class="in">نماء</b></div>`+SECS.map(([k,l,i])=>`<button class="sbi${k===(T==='st'||T==='gp'?'students':T)?' on':''}" onclick="go('${k}');sb(0)">${ic(i,18)}${l}</button>`).join('')+`<h3 class="sbh">الطلاب</h3>`+S.students.map(s=>`<button class="sbi${T==='st'&&CUR===s.id?' on':''}" onclick="openSt(${s.id});sb(0)">${esc(s.name)}</button>`).join('');
function sb(o){$('#sb').classList.toggle('open',!!o);$('#sbo').classList.toggle('open',!!o)}
let PG={};
const pgKey=()=>CUR+'|'+subj();
function pgIdx(x){const n=x.shortTermGoals.length;let i=PG[pgKey()];if(i==null){i=x.shortTermGoals.findIndex(g=>g.subGoals.some(z=>z.status!=='mastered'));if(i<0)i=0}return Math.min(Math.max(i,0),Math.max(n-1,0))}
const pgCur=x=>x.shortTermGoals.filter((g,i)=>i===pgIdx(x));
function pgGo(d){const x=cur();PG[pgKey()]=Math.min(Math.max(pgIdx(x)+d,0),x.shortTermGoals.length-1);redraw()}
function pgSet(i){PG[pgKey()]=i;redraw()}
const pgNav=x=>{const n=x.shortTermGoals.length;if(!n)return'';const i=pgIdx(x);return `<div class="pg"><button onclick="pgGo(-1)" ${i?'':'disabled'}>→ السابق</button><div class="pgd">${x.shortTermGoals.map((g,j)=>`<i class="${j===i?'on':g.subGoals.length&&g.subGoals.every(z=>z.status==='mastered')?'ok':''}" onclick="pgSet(${j})"></i>`).join('')}<small>الهدف ${ar(i+1)} من ${ar(n)}</small></div><button onclick="pgGo(1)" ${i<n-1?'':'disabled'}>التالي ←</button></div>`};
function setFs(k){document.documentElement.dataset.fs=k;LW('namaa_fs',k);go('me')}

