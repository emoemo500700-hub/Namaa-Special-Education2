/* ===== المرحلة 2.5: نسخ احتياطي + مفتاح استرجاع ===== */
const AL='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genRec=()=>[...crypto.getRandomValues(new Uint8Array(20))].map(x=>AL[x%32]).join('');
const fmtRec=r=>r.match(/.{4}/g).join('-');
const normRec=s=>s.toUpperCase().replace(/[^A-Z0-9]/g,'');
async function mkRec(pin){const r=genRec(),rs=crypto.getRandomValues(new Uint8Array(16));
 const o=await enc({p:pin},await mk(r,rs));o.s=b64(rs);LW('namaa_rec',JSON.stringify(o));return r}
function showRec(r){const f=fmtRec(r);$('#sheet').innerHTML=`<div class="ov"><div class="sh"><h2 class="st" style="margin:0 0 6px">🔑 مفتاح الاسترجاع</h2>
 <p class="mut" style="margin:0 0 10px;text-align:right">احفظه خارج هذا الجهاز. يُعرض مرة واحدة فقط، وبه تستعيد بياناتك إن نسيت الرمز.</p>
 <div class="card" dir="ltr" style="text-align:center;font:800 calc(19px*var(--fs)) monospace;user-select:all">${f}</div>
 <button class="btn g" onclick="copyRec('${f}')">نسخ</button><button class="btn g" onclick="dlFile('namaa-recovery-key.txt','Namaa recovery key:\\n${f}\\n')">حفظ كملف</button>
 <button class="btn" onclick="closeSheet()">حفظته، متابعة</button></div></div>`}
function copyRec(f){try{navigator.clipboard.writeText(f).then(()=>toast('تم النسخ'),()=>toast('انسخه يدوياً'))}catch(e){toast('انسخه يدوياً')}}
function recUI(){document.body.innerHTML=`<div class="au"><div class="lg">🔑</div><h1>استرجاع الدخول</h1><p>أدخل مفتاح الاسترجاع ثم رمزاً جديداً</p>
 <input id="rc" dir="ltr" autocomplete="off" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" style="letter-spacing:1px;font-size:16px" aria-label="مفتاح الاسترجاع">
 <input id="np" type="password" inputmode="numeric" maxlength="6" placeholder="رمز جديد ••••" aria-label="رمز جديد">
 <button class="btn" onclick="recGo()">استرجاع</button><button class="lnk" onclick="auth('lock')">رجوع</button><div id="err"></div></div>`}
async function recGo(){const np=$('#np').value;if(!/^\d{4,6}$/.test(np))return bad('الرمز الجديد ٤ إلى ٦ أرقام');
 try{const o=JSON.parse(LS('namaa_rec')),{p}=await dec(o,await mk(normRec($('#rc').value),ub(o.s)));
  const e=JSON.parse(LS('namaa_enc'));S=await dec(e,await mk(p,ub(e.s)));
  salt=crypto.getRandomValues(new Uint8Array(16));K=await mk(np,salt);await save();const r=await mkRec(np);shell();showRec(r)}
 catch(e){K=null;S=null;bad('المفتاح غير صحيح أو غير موجود')}}
async function dlFile(name,data){const mt=name.endsWith('.pdf')?'application/pdf':name.endsWith('.html')?'text/html':name.endsWith('.txt')?'text/plain':name.endsWith('.docx')?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'application/json';
 let d=null;try{d=await claude.use('downloads')}catch(e){}
 if(d){try{await d.save({filename:name,data});return 1}catch(e){if(e&&e.code==='declined')return 0}}
 try{const bl=data instanceof Blob?data:new Blob([data],{type:mt}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=name;document.body.appendChild(a);a.click();a.remove();return 1}catch(e){toast('تعذّر الحفظ');return 0}}
const ago=()=>{if(!S.lb)return'لم تؤخذ نسخة بعد';const d=Math.floor((Date.now()-S.lb)/864e5);return d?`منذ ${ar(d)} يوماً`:'اليوم'};
const stale=()=>S.students.length>0&&(!S.lb||Date.now()-S.lb>6048e5);
const bkCard=()=>stale()?`<div class="card gm" style="margin-top:12px"><em>💾</em><div class="in"><b>خذ نسخة احتياطية</b><small>${ago()}</small></div><button class="cp" style="background:none;padding:6px 12px;cursor:pointer" onclick="exportData()">نسخ الآن</button></div>`:'';
const bkSection=()=>`<h2 class="st">النسخ الاحتياطي</h2><div class="card"><p>💾 آخر نسخة: ${ago()}</p>
 <p class="mut" style="text-align:right;margin:4px 0 0">${K?'النسخة تُشفَّر بنفس رمزك.':'النسخة غير مشفّرة. فعّل الرمز لتشفيرها.'}</p>
 <button class="btn" onclick="exportData()">تصدير نسخة (JSON)</button>
 <label class="btn g" style="display:block;text-align:center;cursor:pointer">استيراد نسخة<input type="file" accept=".json,application/json" hidden onchange="pickFile(this)"></label></div>`;
async function exportData(){const prev=S.lb;S.lb=Date.now();
 const p=K?{app:'namaa',v:1,enc:Object.assign(await enc(S,K),{s:b64(salt)})}:{app:'namaa',v:1,data:S};
 if(!await dlFile('namaa-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(p))){S.lb=prev;return}
 await save();toast('تم تجهيز النسخة');go(T)}
let PEND=null;
function pickFile(i){const f=i.files[0];i.value='';if(!f)return;const r=new FileReader();
 r.onload=()=>{try{const o=JSON.parse(r.result);if(o.app!=='namaa'||!(o.enc||o.data))throw 0;PEND=o;
  $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh"><h2 class="st" style="margin:0 0 4px">استيراد نسخة</h2>
  <p class="mut" style="text-align:right;margin:0 0 6px">⚠️ سيتم استبدال كل بياناتك الحالية بمحتوى النسخة.</p>
  ${o.enc?'<input id="bp" type="password" inputmode="numeric" maxlength="6" placeholder="الرمز وقت تصدير النسخة" aria-label="رمز النسخة">':''}
  <button class="btn r" onclick="impGo(this)">استبدال البيانات</button></div></div>`}catch(e){toast('الملف غير صالح')}};r.readAsText(f)}
function impGo(b){arm('imp',b,'',async()=>{try{let d=PEND.data;
 if(PEND.enc)d=await dec(PEND.enc,await mk($('#bp').value,ub(PEND.enc.s)));
 S=cleanBackup(d);await save();closeSheet();go('home');
 toast(K?'تمت الاستعادة':'تمت الاستعادة · فعّل الرمز لحمايتها')}catch(e){toast('تعذّر الفتح: تحقق من الرمز أو الملف')}})}

