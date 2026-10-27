/* ===== الصوت: مؤثرات + موسيقى تفاعلية + صوت الأخصائي (تسجيل/رفع/تشغيل) =====
   - sfx(اسم): نقر click · صح ok · خطأ bad · انتقال go · بداية start · فوز win · بالون pop
   - music(1/0): لحن هادئ متجدّد أثناء الحصة
   - say([...]): يشغّل تسجيلاتك بالتتابع؛ وما لم يُسجَّل يقرؤه صوت الجهاز (اختياري)
   - نصوص التسجيل VOXL هي المرجع الوحيد: تظهر في «حسابي» وتُصدَّر كملف نصوص */
let AC=null,MUS=null;
const actx=()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}};
const cfgOn=k=>!(S&&S.cfg&&S.cfg[k]===0);
const sndOn=()=>GS?GS.cfg.snd!==0:cfgOn('snd');
function tone(f,t0=0,d=.15,ty='sine',v=.12,f2){const a=actx();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.03)}
const SFX={
 click:()=>tone(1100,0,.05,'triangle',.06),
 pop:()=>tone(300,0,.14,'sine',.14,900),
 ok:()=>[523.25,659.25,783.99].forEach((f,i)=>tone(f,i*.08,.22,'triangle',.13)),
 bad:()=>{tone(260,0,.18,'sine',.1,200);tone(200,.14,.24,'sine',.09,150)},
 go:()=>{tone(300,0,.35,'sine',.09,1100);tone(600,.05,.3,'triangle',.05,1500)},
 start:()=>[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,i*.1,.28,'triangle',.12)),
 win:()=>{[523.25,659.25,783.99,1046.5,783.99,1046.5,1318.5].forEach((f,i)=>tone(f,i*.12,.3,'triangle',.14));[261.6,329.6,392].forEach(f=>tone(f,.8,.8,'sine',.07))}};
const sfx=n=>{if(!sndOn())return;try{(SFX[n]||SFX.click)()}catch(e){}};
const PENT=[261.6,293.7,329.6,392,440,523.25,587.3,659.25];
function music(on){clearInterval(MUS);MUS=null;if(!on||!sndOn())return;let i=2,dir=1;
 MUS=setInterval(()=>{if(!GS||!GS.mus){clearInterval(MUS);MUS=null;return}i=Math.max(0,Math.min(PENT.length-1,i+dir*(Math.random()<.6?1:2)));if(i===0||i===PENT.length-1||Math.random()<.2)dir=-dir;
  tone(PENT[i],0,.9,'sine',.035);if(Math.random()<.3)tone(PENT[i]/2,0,1.2,'sine',.025)},520)}

/* ---- نصوص الصوت (ما تقوله بصوتك) ---- */
const VOXL=[
['١) الترحيب',[['w_hello','أهلاً وسهلاً يا'],['w_ready','أنا سعيد جداً برؤيتك اليوم! هيا نتعلّم ونلعب معاً.']]],
['٢) التهيئة (قبل البدء)',[['t_sit','اجلس جيداً على الكرسي.'],['t_feet','ضع قدميك على الأرض.'],['t_look','انظر إليّ وانتبه جيداً.'],['t_breath','خذ نفساً عميقاً... ثم أخرجه ببطء.'],['t_ready','ممتاز! أنت جاهز. هيا نبدأ.']]],
['٣) التعليمات لكل لعبة',[['i_choose','ما اسم هذه الصورة؟ اضغط على الكلمة الصحيحة.'],['i_pick','اضغط على الصورة المناسبة للكلمة.'],['i_balloon','اضغط على البالونة التي فيها الإجابة الصحيحة.'],['i_match','صِل كل صورة بما يناسبها.'],['i_drag','اسحب كل صورة إلى مكانها الصحيح.'],['i_memory','اقلب بطاقتين متشابهتين.'],['i_trace','اكتب بإصبعك فوق الشكل، وابقَ على الخط.'],['i_firstl','ما الحرف الأول في اسم الصورة؟'],['i_sort','ضع كل صورة في السلة المناسبة.'],['i_count','عُدّ الصور، ثم اختر الرقم الصحيح.'],['i_arith','احسب الناتج، ثم اختر الإجابة الصحيحة.'],['i_order','رتّب الأرقام بالتسلسل الصحيح.']]],
['٤) عند الإجابة الصحيحة (يُختار واحد عشوائياً)',[['p1','أحسنت!'],['p2','ممتاز!'],['p3','رائع!'],['p4','برافو عليك!'],['p5','عمل جميل!'],['p6','صح! أنت ذكي.']]],
['٥) عند الخطأ (بلطف)',[['e1','حاول مرة أخرى.'],['e2','قريب! جرّب من جديد.'],['e3','لا بأس، أنت تستطيع.']]],
['٦) الانتقال بين الألعاب',[['tr_next','هيا ننتقل إلى اللعبة التالية!'],['tr_half','أنت في منتصف الطريق، استمر!'],['tr_last','هذه آخر لعبة!']]],
['٧) الختام',[['f_great','أحسنت يا'],['f_proud','أنا فخور بك جداً! لقد أتممت الحصة بنجاح. أنت بطل رائع.'],['f_try','شكراً على مجهودك الجميل! المحاولة تجعلنا أقوى، وفي المرة القادمة ستكون أفضل.'],['f_bye','إلى اللقاء، أراك في الحصة القادمة!']]]];
const voxLines=()=>VOXL.concat(S&&S.students&&S.students.length?[['٨) أسماء الطلاب (اقرأ الاسم كما تناديه)',S.students.map(s=>['n'+s.id,s.name.split(' ')[0]])]]:[]);
const vtext=k=>{for(const[,ls]of voxLines())for(const[a,t]of ls)if(a===k)return t;return''};
let VX={};
const idb=()=>new Promise((ok,no)=>{const r=indexedDB.open('namaa_vox',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
async function voxLoad(){try{const d=await idb(),tx=d.transaction('a'),st=tx.objectStore('a'),ks=st.getAllKeys(),vs=st.getAll();await new Promise(r=>tx.oncomplete=r);VX={};ks.result.forEach((k,i)=>VX[k]=vs.result[i])}catch(e){}}
async function voxSet(k,b){try{const d=await idb(),tx=d.transaction('a','readwrite');if(b)tx.objectStore('a').put(b,k);else tx.objectStore('a').delete(k);await new Promise(r=>tx.oncomplete=r);if(b)VX[k]=b;else delete VX[k]}catch(e){toast('تعذّر حفظ الصوت على هذا المتصفح')}}
let SAYQ=0,CURAUD=null;
function stopSay(){SAYQ++;try{CURAUD&&CURAUD.pause()}catch(e){}CURAUD=null;try{speechSynthesis.cancel()}catch(e){}}
async function say(items){if(!cfgOn('vox'))return;stopSay();const id=SAYQ;
 for(const it of [].concat(items)){if(id!==SAYQ)return;const k=typeof it==='string'?it:it.k,tx=typeof it==='string'?vtext(it):(it.t||vtext(it.k));
  if(k&&VX[k]){await new Promise(r=>{try{const a=new Audio(URL.createObjectURL(VX[k]));CURAUD=a;a.onended=a.onerror=()=>r();a.play().catch(r)}catch(e){r()}})}
  else if(tx&&cfgOn('tts')){await new Promise(r=>{try{const u=new SpeechSynthesisUtterance(tx);u.lang='ar-SA';u.rate=.9;u.onend=u.onerror=()=>r();speechSynthesis.speak(u);setTimeout(r,7000)}catch(e){r()}})}}}
const sayN=()=>GS?[{k:'n'+GS.sid,t:GS.name}]:[];

/* ---- واجهة التسجيل في «حسابي» ---- */
let REC=null;
const vxRow=(k,t)=>`<div class="vxr" id="vx_${k}"><span>${esc(t)}</span><span class="vxb"><button onclick="voxRec('${k}')" id="vr_${k}" aria-label="تسجيل">${VX[k]?'⟳':'●'}</button><button onclick="say(['${k}'])" aria-label="تشغيل"${VX[k]?'':' style="opacity:.5"'}>▶</button><label class="vxu" aria-label="رفع ملف">⬆<input type="file" accept="audio/*" hidden onchange="voxUp('${k}',this)"></label>${VX[k]?`<button onclick="voxDel('${k}')" aria-label="حذف">🗑</button>`:''}</span></div>`;
function voxCard(){const n=Object.keys(VX).length;
 return `<h2 class="st">🎙️ صوتي في المنصة</h2><div class="card"><p class="mut" style="text-align:right;margin:0 0 6px">سجّل كل جملة بصوتك (●) أو ارفع ملفاً (⬆). ما لم يُسجَّل يُقرأ بصوت الجهاز إن توفّر. التسجيلات تُحفظ على هذا الجهاز فقط (لا تدخل النسخة الاحتياطية).</p>
 <label class="ck2"><input type="checkbox" ${cfgOn('vox')?'checked':''} onchange="setCfg('vox',this.checked?1:0)">تشغيل الصوت في الأنشطة</label>
 <label class="ck2"><input type="checkbox" ${cfgOn('tts')?'checked':''} onchange="setCfg('tts',this.checked?1:0)">القراءة الآلية عند عدم وجود تسجيل</label>
 <small class="mut" id="vxc">${ar(n)} تسجيل محفوظ</small>
 ${voxLines().map(([g,ls])=>`<details><summary>${g} (${ar(ls.length)})</summary>${ls.map(([k,t])=>vxRow(k,t)).join('')}</details>`).join('')}
 <button class="btn g" onclick="dlFile('namaa-voice-script.md',voxMd())">⬇ تنزيل نصوص التسجيل (ملف)</button></div>`}
function voxMd(){return '# نصوص التسجيل الصوتي — منصة نماء\n\nسجّل كل سطر بصوتك. اسم الملف = المعرّف بين القوسين.\n\n'+voxLines().map(([g,ls])=>'## '+g+'\n'+ls.map(([k,t])=>'- ['+k+'] '+t).join('\n')).join('\n\n')+'\n'}
async function setCfg(k,v){S.cfg=Object.assign({},CFG(),{[k]:v});await save()}
function voxRefresh(k){const e=$('#vx_'+k);if(e)e.outerHTML=vxRow(k,vtext(k));const c=$('#vxc');if(c)c.textContent=ar(Object.keys(VX).length)+' تسجيل محفوظ'}
async function voxRec(k){if(REC){REC.stop();return}
 try{const st=await navigator.mediaDevices.getUserMedia({audio:true}),mr=new MediaRecorder(st),ch=[];REC=mr;mr.ondataavailable=e=>ch.push(e.data);
  mr.onstop=async()=>{st.getTracks().forEach(t=>t.stop());REC=null;await voxSet(k,new Blob(ch,{type:mr.mimeType||'audio/webm'}));voxRefresh(k);toast('✔ حُفظ التسجيل')};
  mr.start();const b=$('#vr_'+k);if(b)b.textContent='⏹';toast('جارٍ التسجيل… اضغط ⏹ للإنهاء')}
 catch(e){REC=null;toast('تعذّر الوصول للميكروفون. اسمح به من إعدادات المتصفح')}}
async function voxUp(k,i){const f=i.files[0];if(!f)return;await voxSet(k,f);voxRefresh(k);toast('✔ تم رفع الملف')}
async function voxDel(k){await voxSet(k,null);voxRefresh(k)}
{const _me=VIEWS.me;VIEWS.me=()=>_me()+voxCard()}
voxLoad();
