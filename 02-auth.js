/* ===== شاشة الدخول / إنشاء الرمز ===== */
function auth(mode){const L=mode==='lock';
 document.body.innerHTML=`<div class="au"><div class="lg">🌱</div><h1>نماء</h1>
 <p>${L?'أدخل رمز الدخول':'أنشئ رمزاً من ٤ إلى ٦ أرقام لحماية بيانات طلابك'}</p>
 <input id="pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="••••" aria-label="الرمز" onkeydown="if(event.key==='Enter')${mode}Go()">
 <button class="btn" onclick="${mode}Go()">${L?'دخول':'حفظ الرمز'}</button>
 ${L?'<button class="lnk" onclick="forgot(this)">نسيت الرمز؟ مسح البيانات</button><button class="lnk" onclick="recUI()">لدي مفتاح الاسترجاع</button>':'<button class="lnk" onclick="skipPin()">تخطّي الآن</button>'}
 <div id="err"></div></div>`;$('#pin').focus()}
function bad(m){$('#err').textContent=m;const a=$('.au');a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake')}
async function lockGo(){try{const o=JSON.parse(LS('namaa_enc'));salt=ub(o.s);K=await mk($('#pin').value,salt);S=await dec(o,K);shell()}
 catch(e){K=null;bad('الرمز غير صحيح، حاول مرة أخرى')}}
async function setupGo(){const p=$('#pin').value;if(!/^\d{4,6}$/.test(p))return bad('الرمز يجب أن يكون ٤ إلى ٦ أرقام');
 salt=crypto.getRandomValues(new Uint8Array(16));K=await mk(p,salt);S=clone(SEED);await save();const r=await mkRec(p);shell();showRec(r)}
async function skipPin(){K=null;S=clone(SEED);await save();shell()}
let armed=null;
function arm(id,b,txt,fn){if(armed!==id){armed=id;const o=b.textContent;b.textContent='اضغط للتأكيد';setTimeout(()=>{if(armed===id){armed=null;if(b.isConnected)b.textContent=o}},3000);return}armed=null;fn()}
function forgot(b){arm('f',b,'',()=>{LD('namaa_enc');LD('namaa_data');LD('namaa_rec');S=clone(SEED);K=null;save().then(shell)})}

