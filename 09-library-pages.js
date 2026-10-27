/* ===== v0.8: صفحة الهدف + الجلسات + الأنشطة التلقائية + الطباعة ===== */
I.cal='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>';
const P=s=>s.split('|').map(x=>{const i=x.indexOf(' ');return{e:x.slice(0,i),w:x.slice(i+1)}});
const LIBS={'الحيوانات':'🐱 قطة|🐶 كلب|🐟 سمكة|🐦 عصفور|🐄 بقرة|🐑 خروف|🐴 حصان|🐘 فيل|🦁 أسد|🐰 أرنب|🐢 سلحفاة|🐔 دجاجة',
'الفواكه والخضار':'🍎 تفاحة|🍌 موزة|🍊 برتقالة|🍇 عنب|🍉 بطيخ|🍓 فراولة|🥕 جزرة|🍅 طماطم|🥒 خيار|🌽 ذرة',
'الأدوات المدرسية':'✏️ قلم|📖 كتاب|🎒 حقيبة|✂️ مقص|📏 مسطرة|📒 دفتر|🖍️ ألوان',
'وسائل النقل':'🚗 سيارة|🚌 حافلة|✈️ طائرة|🚲 دراجة|🚂 قطار|🚢 سفينة|🚁 مروحية',
'الطعام والشراب':'🥛 حليب|💧 ماء|🍞 خبز|🥚 بيضة|🧀 جبن|🍚 أرز|🍪 بسكويت',
'أجزاء الجسم':'👁️ عين|👂 أذن|👃 أنف|👄 فم|✋ يد|🦶 قدم',
'الملابس':'👕 قميص|👖 بنطال|👟 حذاء|🧦 جورب|🧢 قبعة|🧥 معطف',
'الألوان':'🔴 أحمر|🔵 أزرق|🟢 أخضر|🟡 أصفر|🟠 برتقالي|🟣 بنفسجي|⚫ أسود|⚪ أبيض',
'الأشكال':'⭐ نجمة|❤️ قلب|🔺 مثلث|🟦 مربع|🌙 هلال',
'الأرقام':'1️⃣ واحد|2️⃣ اثنان|3️⃣ ثلاثة|4️⃣ أربعة|5️⃣ خمسة|6️⃣ ستة|7️⃣ سبعة|8️⃣ ثمانية|9️⃣ تسعة',
'المشاعر':'😀 سعيد|😢 حزين|😠 غاضب|😨 خائف|😴 متعب|😮 متفاجئ',
'الأفعال':'🍽️ يأكل|🥤 يشرب|😴 ينام|🏃 يجري|📖 يقرأ|✍️ يكتب|👏 يصفّق|😂 يضحك',
'التواصل وطلب المساعدة':'🙋 ساعدني|✋ توقف|💧 أريد ماء|🚽 دورة المياه|😴 أنا متعب|🍽️ أنا جائع',
'العناية الذاتية':'💧 ماء|🧼 صابون|🚿 دش|🧻 منديل|🚰 صنبور'};
const LET={'أ':'🦁 أسد|🐰 أرنب|👂 أذن|👃 أنف|🐙 أخطبوط','ب':'🦆 بطة|🍉 بطيخ|🐄 بقرة|🏠 بيت|🎈 بالون|🚪 باب','ت':'🍎 تفاحة|🐊 تمساح|📺 تلفاز|👑 تاج','ث':'🦊 ثعلب|❄️ ثلج|🐂 ثور|👗 ثوب',
'ج':'🐫 جمل|🥕 جزرة|🔔 جرس|🧀 جبن|🧦 جورب','ح':'🐴 حصان|👟 حذاء|🎒 حقيبة|🥛 حليب|🐌 حلزون','خ':'🐑 خروف|🥒 خيار|🍞 خبز|🍑 خوخ|⛺ خيمة|💍 خاتم','د':'🐔 دجاجة|🐻 دب|🚲 دراجة|📒 دفتر|🐬 دولفين',
'ز':'🦒 زرافة|🌸 زهرة|🦓 زيبرا','س':'🐟 سمكة|🚗 سيارة|🛏️ سرير|🐢 سلحفاة|⏰ ساعة|🧺 سلة','ش':'☀️ شمس|🌳 شجرة|🕯️ شمعة|🍴 شوكة|🚚 شاحنة','ص':'🚀 صاروخ|🦅 صقر|📦 صندوق|🧼 صابون',
'ط':'✈️ طائرة|🍅 طماطم|🥁 طبل|👶 طفل|🦚 طاووس','ع':'👁️ عين|🍇 عنب|🐦 عصفور|🍯 عسل|🛒 عربة','ف':'🐘 فيل|🍓 فراولة|🦋 فراشة|🐭 فأر|🍄 فطر','ق':'🐱 قطة|🌙 قمر|✏️ قلم|⛵ قارب|❤️ قلب|🚂 قطار',
'ك':'📖 كتاب|🐶 كلب|⚽ كرة|🥤 كوب|🎂 كعكة','ل':'🍋 ليمون|🧸 لعبة|👅 لسان|🥛 لبن','م':'🍌 موزة|🔑 مفتاح|✂️ مقص|🌧️ مطر|📏 مسطرة|🧹 مكنسة','ن':'🐝 نحلة|⭐ نجمة|👓 نظارة|🐅 نمر|🌴 نخلة|🔥 نار',
'ه':'🌙 هلال|🎁 هدية|☎️ هاتف|🚁 هليكوبتر','و':'🌹 وردة|👦 ولد|🍃 ورقة'};
const KW=[['الحيوانات',/حيوان/],['الفواكه والخضار',/فواكه|خضار|فاكهة/],['الأدوات المدرسية',/الأدوات|أدوات مدرس/],['وسائل النقل',/وسائل النقل|مركبات/],['الطعام والشراب',/الطعام|الشراب/],['أجزاء الجسم',/أجزاء الجسم|أعضاء الجسم/],['الملابس',/ملابس/],['الألوان',/ألوان|الألوان|لون/],['الأشكال',/الأشكال|أشكال/],['الأرقام',/أرقام|الأرقام|الأعداد|عدّ/],['المشاعر',/مشاعر|انفعال/],['الأفعال',/الأفعال|أفعال/],['التواصل وطلب المساعدة',/المساعدة|يطلب|تواصل/],['العناية الذاتية',/غسل|اليدين|العناية|النظافة/]];
const uq=a=>{const e=new Set(),w=new Set();return a.filter(x=>!e.has(x.e)&&!w.has(x.w)&&e.add(x.e)&&w.add(x.w))};
const ltOf=g=>(Object.values(S.iep[CUR]||{}).find(x=>x.shortTermGoals.includes(g))||{}).longTermGoal||'';
function resolveT(g,t){t=t||'';if(t.startsWith('c:')&&LIBS[t.slice(2)])return[t.slice(2),P(LIBS[t.slice(2)])];
 if(t.startsWith('l:')&&LET[t.slice(2)])return['حرف '+t.slice(2),P(LET[t.slice(2)])];
 const x=t.startsWith('x:'),tx=x?t.slice(2).trim():g?[g.title,...g.subGoals.map(z=>z.title),ltOf(g)].join(' '):'';
 const L=tx.match(/(?:الصوت|صوت|حرف|الحرف)\s*\(([\u0621-\u064A])\)|(?:صوت|حرف|الحرف)\s+([\u0621-\u064A])(?![\u0621-\u064A])/)||(tx.length===1?[0,tx]:null),l=L&&(L[1]||L[2]);
 if(l&&LET[l])return['حرف '+l,P(LET[l])];
 if(!x&&/مفردات|مفردة|تسمية/.test(tx))return['مفردات متنوعة',uq(['الحيوانات','الفواكه والخضار','وسائل النقل','الأدوات المدرسية'].flatMap(n=>P(LIBS[n]).slice(0,3)))];
 if(!x&&/الانتباه|الجلوس/.test(tx))return['الألوان والأشكال',uq([...P(LIBS['الألوان']).slice(0,4),...P(LIBS['الأشكال']).slice(0,3)])];
 if(!x&&/التعليمات/.test(tx))return['الأفعال',P(LIBS['الأفعال'])];
 for(const[n,r]of KW)if(r.test(tx))return[n,P(LIBS[n])];
 if(/حروف|هجائ/.test(tx))return['الحروف الهجائية',uq(Object.values(LET).flatMap(s=>P(s).slice(0,1)))];
 return[x?'مفردات متنوعة (لم أتعرف على الهدف)':'مفردات متنوعة',uq(['الحيوانات','الفواكه والخضار','وسائل النقل','الأدوات المدرسية'].flatMap(n=>P(LIBS[n]).slice(0,3)))]}
const gI=g=>resolveT(g,'')[1].slice(0,6);

/* ---- صفحة الطالب وصفحة الهدف ---- */
const prog=x=>{const a=x.shortTermGoals.flatMap(g=>g.subGoals),m=a.filter(z=>z.status==='mastered').length;return[a.length?Math.round(m/a.length*100):0,m,a.length]};
function openGp(i){SJ[CUR]=Object.keys(S.iep[CUR])[i];go('gp')}
VIEWS.st=()=>{const s=stu();if(!s){T='students';return VIEWS.students()}
 const ie=S.iep[s.id]||{},ks=Object.keys(ie),a=sgs(s.id),m=a.filter(z=>z.status==='mastered').length;
 return `<button class="btn g" style="margin:0 0 12px" onclick="go('students')">→ الطلاب</button>
 <details class="card"><summary>👤 ${esc(s.name)} · ${esc(s.grade)} · STD-${100+s.id}</summary>
 <input id="pn" value="${esc(s.name)}" aria-label="الاسم"><select id="pg" aria-label="الصف">${[...new Set([s.grade,...GR])].map(g=>`<option${g===s.grade?' selected':''}>${esc(g)}</option>`).join('')}</select>
 <input id="pd" value="${esc(s.dx||'')}" placeholder="التشخيص" aria-label="التشخيص"><button class="btn g" onclick="saveSt()">حفظ البيانات</button></details>
 <div class="kpis">${kpi(a.length,'هدف فرعي')}${kpi(m,'متقن')}${kpi(a.length?Math.round(m/a.length*100):0,'الإتقان','٪')}</div>
 <button class="btn" onclick="startFor(${s.id})">▶ بدء جلسة مع ${esc(s.name.split(' ')[0])}</button>${stSess(s.id)}
 <h2 class="st">الخطة الفردية · اضغط مادة لفتح أهدافها</h2>
 ${ks.map((n,i)=>{const p=prog(ie[n])[0];return `<div class="cd" style="cursor:pointer" onclick="openGp(${i})"><div class="in"><b>📚 ${esc(n)}</b><small>🎯 ${ie[n].longTermGoal?esc(ie[n].longTermGoal.slice(0,90)):'بدون هدف طويل المدى بعد'}</small><div class="bar"><i style="width:${p}%"></i></div></div><span class="cp">${ar(p)}٪</span></div>`}).join('')||'<p class="mut">لا توجد مواد بعد.</p>'}
 <button class="btn g" onclick="openSubj()">＋ مادة جديدة</button>`};
const gHead='<tr><th>الهدف الفرعي (اضغط للدخول والتقييم)</th><th></th></tr>',gHeadPlan='<tr><th>الهدف الفرعي (اضغط لعرض سجله)</th><th></th></tr>';
VIEWS.gp=()=>{const s=stu(),k=s&&subj(),x=k&&S.iep[s.id][k];if(!x){T='st';return VIEWS.st()}
 const[p,m,t]=prog(x);
 return `<button class="btn g" style="margin:0 0 12px" onclick="go('st')">→ ${esc(s.name)}</button>
 <p class="mut" style="margin:0 0 8px;text-align:right">✎ وضع الخطة: عدّل الأهداف هنا. التقييم يتم داخل الجلسة فقط.</p>
 <div class="card"><div class="gm"><b class="in">📚 ${esc(k)}</b><span class="cp">${ar(p)}٪</span></div><div class="gm" style="margin-top:8px"><b class="in">🎯 الهدف طويل المدى</b><button class="ed" onclick="editLT()" aria-label="تعديل">✎</button></div>
 <p style="margin:4px 0;font-size:calc(13px*var(--fs))">${x.longTermGoal?esc(x.longTermGoal):'<span style="color:var(--mut)">لم يُحدَّد بعد، اضغط ✎</span>'}</p><div class="bar"><i style="width:${p}%"></i></div><small style="color:var(--mut)">متقن ${ar(m)} من ${ar(t)} هدف فرعي</small></div>
 <div class="tb"><table class="at"><thead>${gHeadPlan}</thead><tbody>${x.shortTermGoals.map(g=>`<tr class="sgh"><td colspan="2"><div class="gm"><span class="in">${esc(g.title)}</span><button class="ed" onclick="openBag('${g.id}')" aria-label="الأنشطة والاستمارات">🎒</button><button class="ed" onclick="editShort('${g.id}')" aria-label="تعديل">✎</button></div></td></tr>${g.subGoals.map(sgRow).join('')||'<tr><td colspan="2" class="mut">لا أهداف فرعية بعد</td></tr>'}<tr><td colspan="2" style="text-align:right"><button class="lnk" style="margin:0" onclick="addSg('${g.id}')">＋ هدف فرعي</button></td></tr>`).join('')||'<tr><td colspan="2" class="mut">لا أهداف قصيرة بعد</td></tr>'}</tbody></table></div>
 <button class="btn g" onclick="addShort()">＋ هدف قصير المدى</button><button class="btn g" onclick="openBank()">＋ من بنك الأهداف</button>
 <button class="btn g" style="color:#e11d48" onclick="delSubj(this)">حذف المادة</button>`};

