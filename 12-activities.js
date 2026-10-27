/* ===== إعداد الأنشطة (واجهة التشغيل) + مولّد الحزم المخصصة ===== */
function planPv(){const el=$('#c_pv');if(!el)return;try{const r=readCfg(),g=BG?curG():null,Q=buildPlan(g,r.t,Object.assign({},r.cfg),SGACT);el.innerHTML='🎯 <b>سيُولَّد:</b> '+esc(planInfo(Q))+(Q.sgTitle?'<br><small>للهدف الفرعي: '+esc(Q.sgTitle)+'</small>':'')}catch(e){el.textContent=''}}
function openCfg(pre){const c=CFG(),g=BG?curG():null,saved=S.acts||[],tg=pre||'',au=g?buildPlan(g,'',{lv:0,auto:1,ty:[]},SGACT).name:'مفردات متنوعة';
 const sel=v=>tg===v?' selected':'';
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh" style="max-height:92vh;overflow:auto"><h2 class="st" style="margin:0 0 4px">▶ تشغيل حصة نشاط</h2>
 ${saved.length?`<p class="mut" style="text-align:right;margin:0">أنشطتي المحفوظة:</p><div class="chs">${saved.map(a=>`<button onclick="runAct('${a.id}')">${esc(a.name)}</button><button class="ed" onclick="delAct('${a.id}')" aria-label="حذف">✕</button>`).join('')}</div>`:''}
 <label>المحتوى (تلقائي حسب الهدف والطالب)<select id="c_t" onchange="planPv()"><option value="">تلقائي: ${esc(au)}</option>
 <optgroup label="رياضيات">${[['count','الأعداد والعدّ'],['add','الجمع'],['sub','الطرح'],['order','ترتيب الأعداد']].map(([k,l])=>`<option value="m:${k}"${sel('m:'+k)}>${l}</option>`).join('')}</optgroup>
 <optgroup label="فئات">${Object.keys(LIBS).map(n=>`<option value="c:${n}"${sel('c:'+n)}>${n}</option>`).join('')}</optgroup>
 <optgroup label="حروف">${Object.keys(LET).map(l=>`<option value="l:${l}"${sel('l:'+l)}>حرف ${l}</option>`).join('')}</optgroup>
 ${customPacks().length?`<optgroup label="مكتبتي">${customPacks().map(p=>`<option value="p:${p.id}"${sel('p:'+p.id)}>${esc(p.name)}</option>`).join('')}</optgroup>`:''}</select></label>
 <input id="c_x" placeholder="أو اكتب الهدف (مثل: حرف ك، جمع حتى ٥، الحيوانات)" aria-label="هدف مكتوب" oninput="planPv()"><div class="card" id="c_pv" style="text-align:right;margin:6px 0"></div>
 <label>عدد الأسئلة في اللعبة<select id="c_n">${OP([[3,'٣'],[4,'٤'],[6,'٦'],[8,'٨'],[10,'١٠']],c.n)}</select></label>
 <label>المستوى<select id="c_lv" onchange="planPv()">${OP([[0,'تلقائي حسب الطالب والهدف (موصى به)'],[1,'سهل جداً'],[2,'متوسط'],[3,'صعب']],c.lv)}</select></label>
 <label>المؤقت<select id="c_tm">${OP([[0,'بدون مؤقت'],[10,'١٠ ثوانٍ للسؤال'],[20,'٢٠ ثانية للسؤال']],c.tm)}</select></label>
 <label>حجم الأزرار والخط<select id="c_big">${OP([[1,'كبير (موصى به)'],[0,'عادي']],c.big)}</select></label>
 <label>المؤثرات الصوتية<select id="c_snd">${OP([[1,'مفعّلة'],[0,'صامتة']],c.snd)}</select></label>
 <label>الموسيقى التفاعلية<select id="c_mus">${OP([[1,'مفعّلة'],[0,'متوقفة']],c.mus)}</select></label>
 <label>قصاصات المكافأة<select id="c_conf">${OP([[1,'مفعّلة'],[0,'متوقفة']],c.conf)}</select></label>
 <label>الحصة<select id="c_intro">${OP([[1,'كاملة: ترحيب باسم الطالب ثم تهيئة ثم ألعاب ثم ختام'],[0,'ألعاب مباشرة بدون مقدمة']],c.intro)}</select></label>
 <label>الألعاب<select id="c_auto" onchange="$('#c_tys').style.display=this.value==='1'?'none':'block'">${OP([[1,'متنوعة تلقائياً حسب نوع الهدف (موصى به)'],[0,'أختارها بنفسي']],c.auto)}</select></label>
 <div id="c_tys" style="display:${c.auto===0?'block':'none'}">${Object.entries(TYN).map(([k,l])=>`<label style="color:var(--ink);font-size:calc(14px*var(--fs))"><input type="checkbox" class="cty" value="${k}" style="width:auto;margin:0 0 0 8px"${(c.ty||[]).includes(k)?' checked':''}>${TYI[k]} ${l}</label>`).join('')}<small class="mut">الألعاب غير المناسبة لنوع الهدف تُستبعد تلقائياً.</small></div>
 <input id="c_nm" placeholder="اسم لحفظ هذه الإعدادات كنشاط (اختياري)" aria-label="اسم النشاط"><button class="btn" onclick="startGame()">▶ ابدأ الحصة</button><button class="btn g" onclick="saveAct()">💾 حفظ كنشاط</button><button class="btn g" onclick="openPacks()">🛠 مولّد المحتوى (أضف منهجك)</button></div></div>`;planPv()}
function readCfg(){const v=i=>+$('#c_'+i).value,x=$('#c_x').value.trim();return{cfg:{n:v('n'),lv:v('lv'),tm:v('tm'),big:v('big'),snd:v('snd'),mus:v('mus'),conf:v('conf'),intro:v('intro'),auto:v('auto'),ty:[...document.querySelectorAll('.cty:checked')].map(z=>z.value)},t:x?'x:'+x:$('#c_t').value}}
async function saveAct(){const r=readCfg(),nm=$('#c_nm').value.trim();if(!nm)return toast('اكتب اسماً للنشاط');
 S.acts=S.acts||[];S.acts.push({id:uid(),name:nm,t:r.t,cfg:r.cfg});await save();toast('تم حفظ النشاط');openCfg(r.t)}
async function delAct(id){S.acts=S.acts.filter(a=>a.id!==id);await save();openCfg()}
async function startGame(){const r=readCfg();if(r.cfg.auto===0&&!r.cfg.ty.length)return toast('اختر لعبة واحدة على الأقل');S.cfg=Object.assign({},CFG(),r.cfg);await save();launch(BG?curG():null,r.t,r.cfg,SGACT)}
function runAct(id){const a=S.acts.find(x=>x.id===id);launch(BG?curG():null,a.t,Object.assign({},DEF,a.cfg),SGACT)}

/* ---- مولّد المحتوى: حزم مخصصة (لأي منهج) تُكتشف من كلمات مفتاحية في الأهداف ---- */
function openPacks(){const ps=customPacks();
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh" style="max-height:92vh;overflow:auto"><div class="gm"><h2 class="st" style="margin:0;flex:1">🛠 مولّد المحتوى</h2><button class="ed" onclick="openCfg()" aria-label="رجوع">✕</button></div>
 <p class="mut" style="text-align:right;margin:4px 0 8px">أنشئ حزمة محتوى لأي درس أو منهج (مثل: وحدة الحيوانات المائية، أدوات المطبخ). إذا ظهرت إحدى الكلمات المفتاحية في نص الهدف، تُستخدم الحزمة تلقائياً في كل الألعاب (اختيار، توصيل، سحب، فرز، ذاكرة…).</p>
 ${ps.map(p=>`<div class="cd"><div class="in"><b>${esc(p.name)}</b><small>${ar(p.items.length)} عنصر · مفاتيح: ${esc(p.kw||'—')}</small></div><button class="dl" onclick="delPack('${p.id}',this)">حذف</button></div>`).join('')}
 <h3 class="st">حزمة جديدة</h3><input id="pk_n" placeholder="اسم الحزمة" aria-label="اسم الحزمة"><input id="pk_k" placeholder="كلمات مفتاحية في الهدف، مفصولة بفاصلة (مثل: الحيوانات المائية، البحر)" aria-label="كلمات مفتاحية">
 <textarea id="pk_i" rows="7" placeholder="سطر لكل عنصر: إيموجي ثم الكلمة&#10;🐟 سمكة&#10;🐙 أخطبوط&#10;🐬 دلفين" aria-label="العناصر"></textarea><button class="btn" onclick="savePack()">حفظ الحزمة</button></div></div>`}
async function savePack(){const n=$('#pk_n').value.trim(),its=P($('#pk_i').value.split('\n').map(x=>x.trim()).filter(x=>x.includes(' ')).join('|'));
 if(!n)return toast('اكتب اسم الحزمة');if(its.length<4)return toast('أضف 4 عناصر على الأقل (إيموجي ثم كلمة في كل سطر)');
 S.packs=(S.packs||[]).concat({id:uid(),name:n,kw:$('#pk_k').value.trim(),items:its});await save();toast('✔ حُفظت الحزمة');openPacks()}
function delPack(id,b){arm('pk'+id,b,'',async()=>{S.packs=S.packs.filter(p=>p.id!==id);await save();openPacks()})}
