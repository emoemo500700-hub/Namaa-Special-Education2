/* ===== محرك الحصة: ترحيب ← تهيئة ← ألعاب متنوعة ← ختام احتفالي ← تقييم الأخصائي =====
   حالة الحصة GS = {g,sg,Q(الخطة),cfg,name,sid,per[],ok,tot,pi,pl[أنواع الألعاب]} */
let GZ=1;
const WARM=[['🪑','اجلس جيداً على الكرسي','t_sit'],['🦶','ضع قدميك على الأرض','t_feet'],['👀','انظر إليّ وانتبه جيداً','t_look'],['🌬️','خذ نفساً عميقاً… ثم أخرجه ببطء','t_breath']];
const REM=['🎉','🌟','⭐','🏆','🎈','🥳','👏','💪','🌈','🎊','😍','🦄','🚀','💖','🎁','🍭','🦋','🌸'];
function conf(){if(!GS||!GS.cfg.conf||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const w=document.createElement('div');w.className='cf';
 w.innerHTML=Array.from({length:40},()=>`<i style="left:${Math.random()*100}%;background:${['#C9971C','#0E7C86','#e11d48','#7c3aed','#2563eb'][Math.random()*5|0]};animation-delay:${Math.random()*.4}s"></i>`).join('');document.body.appendChild(w);setTimeout(()=>w.remove(),2400)}
const pr=()=>p1(['أحسنت','ممتاز','رائع','برافو','عمل جميل'])+' يا '+GS.name+'! 🌟';
function praise(){toast(pr());say([p1(['p1','p2','p3','p4','p5','p6']),...(Math.random()<.25?sayN():[])])}
function launch(g,t,cfg,sgId){const Q=buildPlan(g,t,cfg,sgId);if(Q.kind!=='math'&&Q.items.length<3)return toast('عناصر هذا الهدف قليلة، اختر فئة أخرى');
 closeSheet();const s=BG?stu():null;GZ=1;
 GS={g,sg:sgId||null,Q,cfg,name:s?s.name.split(' ')[0]:'بطل',sid:s?s.id:0,tname:Q.name,per:[],ok:0,tot:0,pi:0,pl:Q.types,mus:cfg.mus!==0&&cfg.snd!==0};
 const d=document.createElement('div');d.id='gx';d.innerHTML='<div class="gh2"><button class="ed" onclick="endGame()" aria-label="إغلاق">✕</button><b id="gt"></b><span id="gp"></span><button class="ed" onclick="gMus()" aria-label="الموسيقى">🎵</button><button class="ed" onclick="gFs()" aria-label="ملء الشاشة">⛶</button><button class="ed" onclick="gZ(.15)" aria-label="تكبير">＋</button><button class="ed" onclick="gZ(-.15)" aria-label="تصغير">－</button></div><div id="gb"></div>';
 d.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button,.dc,.mc,.mk'))sfx('click')});document.body.appendChild(d);
 actx();if(GS.mus)music(1);voxLoad().then(()=>{if(GS)(cfg.intro===0?nextAct():intro())})}
function gMus(){if(!GS)return;GS.mus=!GS.mus;music(GS.mus);toast(GS.mus?'🎵 الموسيقى تعمل':'الموسيقى متوقفة')}
function gZ(d){GZ=Math.min(2,Math.max(.7,GZ+d));$('#gb').style.zoom=GZ}
function gFs(){const e=$('#gx');try{if(document.fullscreenElement)document.exitFullscreen();else(e.requestFullscreen()||Promise.resolve()).catch(()=>toast('ملء الشاشة غير متاح هنا'))}catch(x){toast('ملء الشاشة غير متاح هنا')}}
function endGame(){if(GS)clearInterval(GS.tm);stopSay();music(0);GS=null;try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}const d=$('#gx');if(d)d.remove()}

/* ---- البداية والتهيئة ---- */
function intro(){const G=GS;if(!G)return;$('#gt').textContent='مرحباً';$('#gp').textContent='';sfx('start');
 $('#gb').innerHTML=`<div class="stg"><div class="bigem bounce">👋</div><h1 class="hello">مرحباً يا ${esc(G.name)}!</h1><p class="stgp">أنا سعيد جداً برؤيتك اليوم 😍<br>هيا نتعلّم ونلعب معاً!</p><div class="floaties"><i>🎈</i><i>⭐</i><i>🌈</i><i>🎉</i><i>🦋</i></div><button class="btn bigb" onclick="warm(0)">هيا نبدأ ▶</button><button class="lnk" onclick="nextAct()">تخطي المقدمة</button></div>`;
 say([{k:'w_hello'},...sayN(),{k:'w_ready'}])}
function warm(i){const G=GS;if(!G)return;
 if(i>=WARM.length){$('#gb').innerHTML='<div class="stg"><div class="bigem jelly">🚀</div><h1 class="hello">أنت جاهز!</h1></div>';sfx('ok');say(['t_ready']);return setTimeout(()=>{if(GS===G)nextAct()},1800)}
 const[e,tx,k]=WARM[i];$('#gt').textContent='تهيئة';$('#gp').textContent=ar(i+1)+'/'+ar(WARM.length);sfx('go');
 $('#gb').innerHTML=`<div class="stg"><div class="dotsw">${WARM.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}</div><div class="bigem pulse" onclick="sfx('pop')">${e}</div><p class="stgp big">${tx}</p><button class="btn bigb" onclick="warm(${i+1})">تمام ✔</button></div>`;say([k])}

/* ---- الانتقال بين الألعاب ---- */
const GAMES={choose:()=>mcq('choose'),pick:()=>mcq('pick'),balloon:()=>mcq('balloon'),firstl:()=>mcq('firstl'),count:()=>mcq('count'),arith:()=>mcq('arith'),match:gMatch,drag:gDrag,memory:gMemory,trace:gTrace,sort:gSort,order:gOrder};
function nextAct(){const G=GS;if(!G)return;if(G.pi>=G.pl.length)return finish();const t=G.pl[G.pi],idx=G.pi,n=G.pl.length,last=idx===n-1&&n>1;
 $('#gt').textContent=TYN[t]+' · '+G.tname;$('#gp').textContent=ar(idx+1)+'/'+ar(n);sfx('go');
 $('#gb').innerHTML=`<div class="stg"><div class="bigem bounce">${TYI[t]}</div><h2 class="hello sm">${last?'آخر لعبة!':'اللعبة '+ar(idx+1)}</h2><p class="stgp big">${TYN[t]}</p></div>`;
 if(idx>0)say([last?'tr_last':idx===Math.floor(n/2)?'tr_half':'tr_next']);
 setTimeout(()=>{if(GS!==G||G.pi!==idx)return;GAMES[t]();say(['i_'+t])},idx>0?1700:1000)}
function done(ok,tot){const G=GS;if(!G)return;G.per.push({t:G.pl[G.pi],ok,tot});G.ok+=ok;G.tot+=tot;G.pi++;if(tot&&ok/tot>=.8)conf();setTimeout(()=>{if(GS===G)nextAct()},900)}
const qh=(i,N)=>`<small class="mut">سؤال ${ar(i+1)} من ${ar(N)}</small>`;

/* ---- أسئلة الاختيار من متعدد: اختيار، اختر الصورة، بالونات، الحرف الأول، عدّ، حساب ---- */
function mcq(type){const G=GS,Q=G.Q,c=G.cfg,N=c.n,deck=deckFor(type,Q),my=G.pi;let i=0,ok=0;
 const next=()=>{if(GS!==G||G.pi!==my)return;clearInterval(G.tm);if(i>=N)return done(ok,N);const q=mkQ(type,Q,i,deck);let bad=0,hit=0;
  $('#gb').innerHTML=`<div class="qs">${qh(i,N)}<div class="qe ${q.sc||''}">${q.stim}</div>${q.sub?`<div class="qsub">${esc(q.sub)}</div>`:''}${q.after||''}<p class="qp">${q.pr}</p>
  <div class="${q.st}">${q.opts.map((o,j)=>`<button class="${q.st==='bl'?'bn b'+(j%5):q.st==='op pk'?'ob pe':'ob'}${c.big!==0?' lg':''}" data-k="${esc(o.k)}">${o.h}</button>`).join('')}</div><div class="tmr" id="tmr"></div></div>`;
  document.querySelectorAll('#gb [data-k]').forEach(x=>x.onclick=()=>{
   if(hit)return;if(x.dataset.k===q.ans){hit=1;clearInterval(G.tm);sfx(q.st==='bl'?'pop':'ok');if(!bad)ok++;x.classList.add('good');if(q.st==='bl')x.classList.add('pop');document.querySelectorAll('#gb [data-k]').forEach(z=>z.style.pointerEvents='none');praise();i++;setTimeout(next,1200)}
   else{bad++;sfx('bad');x.classList.add('bad');x.disabled=true;if(bad===2)say([p1(['e1','e2','e3'])])}});
  if(c.tm){let t=c.tm;$('#tmr').textContent='⏱ '+ar(t);G.tm=setInterval(()=>{t--;const e=$('#tmr');if(e)e.textContent='⏱ '+ar(t);if(t<=0){clearInterval(G.tm);i++;next()}},1000)}};
 next()}

/* ---- توصيل ---- */
const bigS=a=>a.length>4?' style="font-size:calc(26px*var(--fs))"':'';
function gMatch(){const G=GS,Q=G.Q,ps=mkPairs(Q,Math.min(5,Q.lv+2),'match'),ws=sh(ps.map((x,i)=>i)),err={};let left=ps.length;
 $('#gb').innerHTML=`<p class="qp" style="text-align:center">اختر الصورة ثم ما يناسبها</p><div id="mt" class="mt"><svg id="ml"></svg>
 <div>${ps.map((x,i)=>`<button class="mc e" data-s="a" data-i="${i}"${bigS(x.a)}>${x.a}</button>`).join('')}</div><div>${ws.map(i=>`<button class="mc" data-s="b" data-i="${i}">${esc(ps[i].b)}</button>`).join('')}</div></div>`;
 const line=(a,b)=>{const m=$('#mt').getBoundingClientRect(),p=r=>[r.left+r.width/2-m.left,r.top+r.height/2-m.top],A=p(a.getBoundingClientRect()),B=p(b.getBoundingClientRect()),l=document.createElementNS('http://www.w3.org/2000/svg','line');
  [['x1',A[0]],['y1',A[1]],['x2',B[0]],['y2',B[1]],['stroke','#C9971C'],['stroke-width',5],['stroke-linecap','round']].forEach(([n,v])=>l.setAttribute(n,v));$('#ml').appendChild(l)};
 document.querySelectorAll('.mc').forEach(x=>x.onclick=()=>{if(x.classList.contains('dn'))return;const s=document.querySelector('.mc.sel');
  if(s&&s.dataset.s!==x.dataset.s){if(s.dataset.i===x.dataset.i){line(s,x);s.classList.remove('sel');s.classList.add('dn');x.classList.add('dn');sfx('ok');praise();if(!--left){conf();setTimeout(()=>done(ps.length-Object.keys(err).length,ps.length),700)}}
   else{err[s.dataset.i]=1;err[x.dataset.i]=1;sfx('bad');s.classList.remove('sel')}}
  else{if(s)s.classList.remove('sel');x.classList.add('sel')}})}

/* ---- سحب وإفلات (مساعد مشترك للسحب والفرز) ---- */
function dnd(sel,onDrop,onTap){document.querySelectorAll(sel).forEach(c=>{let sx=null,sy,mv=0;
 c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;mv=0;c.classList.add('hold')};
 c.onpointermove=e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>8)mv=1;c.style.transform=`translate(${dx}px,${dy}px)`};
 c.onpointerup=e=>{if(sx==null)return;sx=null;c.classList.remove('hold');c.style.transform='';if(!mv)return onTap&&onTap(c);
  const t=document.elementsFromPoint(e.clientX,e.clientY).find(x=>x.classList&&x.classList.contains('slot')&&!x.classList.contains('full'));onDrop(c,t||null)}})}
function gDrag(){const G=GS,Q=G.Q,ps=mkPairs(Q,Math.min(5,Q.lv+2),'match'),ix=ps.map((x,i)=>i),bad={};let left=ps.length;
 $('#gb').innerHTML=`<p class="qp" style="text-align:center">اسحب كل صورة إلى مكانها</p><div class="dr">${sh(ix).map(i=>`<div class="dc" data-i="${i}"${bigS(ps[i].a)}>${ps[i].a}</div>`).join('')}</div><div class="dr">${sh(ix).map(i=>`<div class="slot" data-i="${i}">${esc(ps[i].b)}</div>`).join('')}</div>`;
 dnd('.dc',(c,t)=>{if(t&&t.dataset.i===c.dataset.i){t.classList.add('full');t.insertAdjacentHTML('afterbegin',`<span class="sf">${c.textContent}</span>`);c.style.visibility='hidden';c.style.pointerEvents='none';sfx('ok');praise();if(!--left){conf();setTimeout(()=>done(ps.length-Object.keys(bad).length,ps.length),700)}}
  else{if(t)bad[c.dataset.i]=1;sfx('bad')}})}

/* ---- فرز في سلتين ---- */
function gSort(){const G=GS,B=mkSort(G.Q),bad=new Set();let left=B.its.length;
 $('#gb').innerHTML=`<p class="qp" style="text-align:center">${esc(B.pr)}</p><div class="bins">${B.bins.map((b,j)=>`<div class="slot bin" data-b="${j}"><b>${esc(b)}</b><div class="bf"></div></div>`).join('')}</div><div class="dr">${B.its.map((x,j)=>`<div class="dc" data-j="${j}" data-b="${x.b}">${x.e}</div>`).join('')}</div><p class="mut" style="text-align:center">اسحب الصورة إلى السلة (أو المس الصورة ثم السلة)</p>`;
 const drop=(c,t)=>{if(!t)return;if(t.dataset.b===c.dataset.b){t.querySelector('.bf').insertAdjacentHTML('beforeend',`<span>${c.textContent}</span>`);c.style.visibility='hidden';c.style.pointerEvents='none';c.classList.remove('sel');sfx('ok');if(!--left){conf();praise();setTimeout(()=>done(B.its.length-bad.size,B.its.length),700)}}
  else{bad.add(c.dataset.j);c.classList.remove('sel');sfx('bad')}};
 dnd('.dc',(c,t)=>{t&&t.classList.contains('bin')?drop(c,t):sfx('bad')},c=>{document.querySelectorAll('.dc.sel').forEach(z=>z!==c&&z.classList.remove('sel'));c.classList.toggle('sel')});
 document.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{const c=document.querySelector('.dc.sel');if(c)drop(c,b)})}

/* ---- بطاقات الذاكرة ---- */
function gMemory(){const G=GS,Q=G.Q,k=[3,4,6][Q.lv-1]||4,ps=mkPairs(Q,k,'memory'),n=ps.length;let first=null,lock=0,err=0,left=n;
 const cards=sh(ps.flatMap((x,i)=>[{i,t:'a',v:x.a},{i,t:'b',v:x.b}]));
 $('#gb').innerHTML=`<p class="qp" style="text-align:center">اقلب بطاقتين متشابهتين</p><div class="mg">${cards.map((c,j)=>`<button class="mk" data-j="${j}"><span class="b">❓</span><span class="f" style="font-size:${c.t==='a'?(c.v.length>3?30:50):24}px">${esc(c.v)}</span></button>`).join('')}</div>`;
 document.querySelectorAll('.mk').forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('open')||b.classList.contains('ok'))return;b.classList.add('open');
  if(!first){first=b;return}const A=cards[+first.dataset.j],B=cards[+b.dataset.j];
  if(A.i===B.i&&A.t!==B.t){first.classList.replace('open','ok');b.classList.replace('open','ok');first=null;sfx('ok');praise();if(!--left){conf();setTimeout(()=>done(Math.max(0,n-err),n),700)}}
  else{err++;sfx('bad');lock=1;const f=first;first=null;setTimeout(()=>{f.classList.remove('open');b.classList.remove('open');lock=0},900)}})}

/* ---- كتابة الحرف أو الرقم بالإصبع (يُقاس تغطية الشكل وعدم الخروج عنه) ---- */
function gTrace(){const G=GS,Q=G.Q,N=3,W=360,my=G.pi;let i=0,ok=0;
 const step=()=>{if(GS!==G||G.pi!==my)return;if(i>=N)return done(ok,N);const gl=traceGlyph(Q);let tries=0;
  $('#gb').innerHTML=`<div class="qs">${qh(i,N)}<p class="qp">اكتب ${gl.nm} بإصبعك فوق الشكل</p><div class="trw"><canvas id="tc" width="${W}" height="${W}"></canvas></div><div class="trb"><button class="btn g" id="tclr">🧽 مسح</button><button class="btn" id="tok">✔ تمّ</button></div></div>`;
  const cv=$('#tc'),cx_=cv.getContext('2d'),ink=document.createElement('canvas');ink.width=ink.height=W;const ic_=ink.getContext('2d');ic_.lineWidth=32;ic_.lineCap=ic_.lineJoin='round';ic_.strokeStyle='#0E7C86';
  let font,gx=W/2,cy=W/2;const fit=()=>{let fs=290,m;for(;fs>120;fs-=20){cx_.font=font=`800 ${fs}px Cairo,Tajawal,Arial,sans-serif`;cx_.textAlign='center';cx_.textBaseline='alphabetic';m=cx_.measureText(gl.g);if(m.width<W*.8&&(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)<W*.78)break}
   gx=W/2+((m.actualBoundingBoxLeft||0)-(m.actualBoundingBoxRight||0))/2;cy=W/2+((m.actualBoundingBoxAscent||0)-(m.actualBoundingBoxDescent||0))/2};fit();
  const mask=lw=>{const m=document.createElement('canvas');m.width=m.height=W;const c=m.getContext('2d');c.font=font;c.textAlign='center';c.textBaseline='alphabetic';if(lw){c.lineWidth=lw;c.lineJoin='round';c.strokeStyle='#000';c.strokeText(gl.g,gx,cy)}c.fillStyle='#000';c.fillText(gl.g,gx,cy);return c.getImageData(0,0,W,W).data};
  const draw=()=>{cx_.clearRect(0,0,W,W);cx_.font=font;cx_.textAlign='center';cx_.textBaseline='alphabetic';cx_.fillStyle='#e8ecf1';cx_.fillText(gl.g,gx,cy);cx_.setLineDash([9,9]);cx_.lineWidth=3;cx_.strokeStyle='#94a3b8';cx_.strokeText(gl.g,gx,cy);cx_.setLineDash([]);cx_.drawImage(ink,0,0)};
  const score=()=>{const g=mask(0),gd=mask(50),d=ic_.getImageData(0,0,W,W).data;let gt=0,gc=0,dt=0,sp=0;for(let p=3;p<g.length;p+=4){const a=g[p]>60,b=d[p]>60;if(a){gt++;if(b)gc++}if(b){dt++;if(gd[p]<=60)sp++}}return{cov:gt?gc/gt:0,spill:dt?sp/dt:1,dt}};
  let fin=0;const win=()=>{if(fin)return;fin=1;sfx('ok');praise();if(!tries)ok++;i++;setTimeout(step,1200)};
  let dn=false,lx,ly;const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*W/r.height]};
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);dn=true;[lx,ly]=pt(e);ic_.beginPath();ic_.moveTo(lx,ly);ic_.lineTo(lx+.1,ly);ic_.stroke();draw()};
  cv.onpointermove=e=>{if(!dn)return;const[x,y]=pt(e);ic_.beginPath();ic_.moveTo(lx,ly);ic_.lineTo(x,y);ic_.stroke();lx=x;ly=y;draw()};
  cv.onpointerup=()=>{if(!dn)return;dn=false;const s=score();if(s.cov>=.8&&s.spill<.4&&s.dt>400)win()};
  $('#tclr').onclick=()=>{ic_.clearRect(0,0,W,W);draw()};
  $('#tok').onclick=()=>{const s=score();if(s.dt<200){sfx('bad');return toast('ارسم الحرف بإصبعك أولاً ✏️')}
   if(s.cov>=.5&&s.spill<.55||tries>=2)return win();tries++;sfx('bad');toast('قريب! اتبع الخط المنقّط وأعد المحاولة');ic_.clearRect(0,0,W,W);draw()};
  draw();if('fonts'in document)document.fonts.ready.then(()=>{fit();draw()})};
 step()}

/* ---- ترتيب الأعداد ---- */
function gOrder(){const G=GS,Q=G.Q,N=3,my=G.pi;let i=0,ok=0;
 const step=()=>{if(GS!==G||G.pi!==my)return;if(i>=N)return done(ok,N);const o=mkOrder(Q);let pos=0,bad=0;
  $('#gb').innerHTML=`<div class="qs">${qh(i,N)}<p class="qp">رتّب الأرقام من ${o.asc?'الأصغر إلى الأكبر':'الأكبر إلى الأصغر'}</p><div class="ords">${o.tgt.map((_,j)=>`<div class="ord" id="os${j}">؟</div>`).join('')}</div><div class="op lt">${o.shuf.map(n=>`<button class="ob lg" data-n="${n}">${arn(n)}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{if(+b.dataset.n===o.tgt[pos]){$('#os'+pos).textContent=b.textContent;$('#os'+pos).classList.add('on');b.disabled=true;b.style.visibility='hidden';pos++;sfx('ok');
   if(pos===o.tgt.length){praise();if(!bad)ok++;i++;conf();setTimeout(step,1200)}}else{bad++;sfx('bad');b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}})};
 step()}

/* ---- الختام الاحتفالي + تقييم الأخصائي ---- */
function rain(){const w=document.createElement('div');w.className='rain';w.innerHTML=Array.from({length:48},()=>`<i style="left:${Math.random()*100}%;font-size:${22+(Math.random()*30|0)}px;animation-duration:${3+Math.random()*4}s;animation-delay:${Math.random()*3}s">${p1(REM)}</i>`).join('');const g=$('#gx');if(g)g.appendChild(w)}
function finish(){const G=GS,p=G.tot?Math.round(G.ok/G.tot*100):0,n=esc(G.name);G.p=p;music(0);sfx('win');conf();
 try{S.runs=(S.runs||[]).concat({sid:G.sid,g:G.g?G.g.id:null,sg:G.sg,t:Date.now(),p,ok:G.ok,tot:G.tot,pl:G.pl}).slice(-300);save()}catch(e){}
 const hi=p>=80,mid=p>=50,star=hi?3:mid?2:1,
 ti=hi?`أحسنت يا ${n}! أنت بطل 🏆`:mid?`عمل رائع يا ${n}! 🌟`:`شكراً لك يا ${n} 💖`,
 tx=hi?'أنا فخور بك جداً! أتممت الحصة بنجاح، وكل إجابة صحيحة اليوم تجعلك أذكى وأقوى. واصل هكذا يا نجمي! 🌟':mid?'لقد اجتهدت كثيراً وتعلّمت أشياء جديدة. أنا فخور بمجهودك، وفي المرة القادمة ستكون أفضل! 💪':'المحاولة تجعلنا أقوى كل يوم، وأنا أفتخر بأنك لم تستسلم. سنلعب معاً مرة أخرى قريباً! 🤗';
 $('#gt').textContent='🏆 الختام';$('#gp').textContent='';
 $('#gb').innerHTML=`<div class="stg end"><div class="bigem jelly">${hi?'🏆':mid?'🥇':'🎖️'}</div><h1 class="hello">${ti}</h1><div class="starsr">${[1,2,3].map(x=>`<i class="${x<=star?'on':''}" style="animation-delay:${x*.25}s">⭐</i>`).join('')}</div><p class="stgp">${tx}</p>
 <div class="floaties big">${['🎉','🥳','👏','💪','🌈','🦄','🚀','💖','🎈','🌟'].map((e,j)=>`<i style="animation-delay:${j*.15}s">${e}</i>`).join('')}</div><button class="btn bigb" onclick="showRes()">تقييم الأخصائي ›</button><button class="btn g" onclick="endGame()">إغلاق</button></div>`;
 rain();say([{k:'f_great'},...sayN(),{k:hi||mid?'f_proud':'f_try'},{k:'f_bye'}])}
function showRes(){const G=GS,p=G.p,r=p>=80?'m':p>=50?'p':'n',sg=G.g?G.g.subGoals:[];stopSay();
 $('#gb').innerHTML=`<div class="card" style="text-align:center"><div style="font:800 calc(44px*var(--fs)) Cairo;color:var(--teal)">${ar(p)}٪</div><p>${esc(G.name)}: ${ar(G.ok)} من ${ar(G.tot)} إجابة صحيحة من أول محاولة</p><small style="color:var(--mut)">${G.per.map(x=>`${TYN[x.t]} ${ar(x.ok)}/${ar(x.tot)}`).join(' · ')}</small></div>
 ${sg.length&&!rateCtx(G.sg||sg[0].id).ok?`<p class="mut">🔒 ${RMSG[rateCtx(G.sg||sg[0].id).why]}</p>`:sg.length?`<h3 class="st">سجّل التقييم (المقترح: ${RL[r]})</h3><select id="gs" aria-label="الهدف الفرعي">${sg.map(z=>`<option value="${z.id}"${z.id===G.sg?' selected':''}>${esc(z.title)}</option>`).join('')}</select>
 ${['m','p','n'].map(x=>`<button class="btn${x===r?'':' g'}" onclick="recG('${x}')">${RL[x]}</button>`).join('')}`:(G.g?'<p class="mut">أضف أهدافاً فرعية لتسجيل التقييم.</p>':'')}
 <button class="btn g" onclick="endGame()">إغلاق</button>`}
async function recG(x){if(!rateCtx($('#gs').value).ok)return toast('التقييم داخل الجلسة فقط');await logA($('#gs').value,x);toast('✔ سُجّل وحُفظ: '+RL[x])}
