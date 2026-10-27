/* ===== مولّد الأنشطة: يقرأ الهدف + الطالب ويقرّر نوع المحتوى والألعاب والمستوى =====
   buildPlan(g,t,cfg,sgId) ← خطة Q = {kind:'words|letter|math', name, items, l, R, lv, no, types, mix}
   mkQ(type,Q,i,deck) ← سؤال اختيار من متعدد · mkPairs ← أزواج التوصيل/السحب/الذاكرة · mkSort · mkOrder
   للتوسعة (منهج جديد): أضف حزمة من «مولّد الأنشطة» في التطبيق (كلمات مفتاحية + عناصر) أو أضف نوعاً في detect()/ALW. */
const NUMW=['صفر','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة'];
const NUME=['🍎','🐟','⭐','🎈','🐥','🍓','🚗','🌼','⚽','🍪'];
const TYN={choose:'اختيار الكلمة',pick:'اختر الصورة',balloon:'بالونات',match:'توصيل',drag:'سحب وإفلات',memory:'بطاقات الذاكرة',trace:'كتابة الحرف أو الرقم',firstl:'الحرف الأول من الاسم',sort:'فرز في سلتين',count:'عدّ وتعرّف على العدد',arith:'جمع وطرح',order:'ترتيب الأعداد'};
const TYI={choose:'🔤',pick:'🖼️',balloon:'🎈',match:'🔗',drag:'✋',memory:'🃏',trace:'✏️',firstl:'🔠',sort:'🧺',count:'🔢',arith:'➕',order:'📶'};
const ALW={words:['choose','pick','balloon','match','drag','memory','firstl','sort'],letter:['trace','firstl','sort','pick','choose','balloon','match','drag','memory'],math:['count','arith','order','trace','match','drag','memory']};
const MIXW={words:['choose','pick','match','drag','sort','memory'],letter:['trace','firstl','sort','pick','match','drag']};
const MF={count:{cnt:1,num:1,ord:1},add:{add:1,cnt:1},sub:{sub:1,cnt:1},order:{ord:1}};
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),p1=a=>a[Math.random()*a.length|0];
const AMAP={'إ':'أ','آ':'أ','ا':'أ','ى':'ي','ة':'ه'};
const firstL=w=>{const c=String(w).replace(/^ال/,'')[0];return AMAP[c]||c};
const subjOf=g=>Object.keys(S.iep[CUR]||{}).find(k=>S.iep[CUR][k].shortTermGoals.includes(g))||'';
/* المستوى التلقائي: الصف + التشخيص + حالة الهدف الفرعي (تسهيل شديد عند التعثر) */
function autoLv(s,sg){const gr=(s&&s.grade)||'',dx=(s&&s.dx)||'';let l=/المتوسط|السادس/.test(gr)?3:/الرابع|الخامس/.test(gr)?2:1;
 if(l>1&&/توحد|شامل|فكري|متلازمة/.test(dx))l--;
 if(sg&&(sg.status==='not'||sg.status==='prompted'))l=Math.max(1,l-1);if(sg&&sg.status==='mastered')l=Math.min(3,l+1);return l}
function numRange(tx,lv){const t=tx.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\d+\s*(?:٪|%|جلس|محاول|دقيق|مر[ةا]|مرات|أسبوع|أسابيع|فصل|يوم|أيام)/g,''),f=[...t.matchAll(/\d+/g)].map(m=>+m[0]).filter(n=>n>0&&n<=100),cap=[10,20,100][lv-1]||20;return f.length?Math.min(Math.max(...f),cap):({1:5,2:10,3:20})[lv]}
const customPacks=()=>S.packs||[];
function customPack(t,tx){if(t.startsWith('p:'))return customPacks().find(p=>p.id===t.slice(2));
 return customPacks().find(p=>(p.kw||'').split(/[,،]/).map(x=>x.trim()).filter(Boolean).some(k=>tx.includes(k)))}
function detect(tx){
 const L=tx.match(/(?:الصوت|صوت|حرف|الحرف)\s*\(([ء-ي])\)|(?:صوت|حرف|الحرف)\s+([ء-ي])(?![ء-ي])/),l=L&&(L[1]||L[2]);
 if(l&&LET[l])return{k:'letter',l};
 if(/رياضيات|حساب|جمع|طرح|عمليات|الأعداد|أعداد|الأرقام|أرقام|رقم|عدّ|العد /.test(tx+' '))return{k:'math',f:{add:/جمع|إضافة|يضيف|ناتج/.test(tx),sub:/طرح|ينقص|يحذف/.test(tx),ord:/ترتيب|تسلسل|الأصغر|الأكبر/.test(tx),num:/رقم|أرقام|الأرقام/.test(tx),cnt:/عد|أعداد|الأعداد/.test(tx)}};
 if(/حروف|هجائ/.test(tx))return{k:'letter',l:null};
 return{k:'words'}}
function buildPlan(g,t,cfg,sgId){t=t||'';const s=(BG&&stu())||null,f=sgId?findSg(sgId):null,sg=f?f[0]:null,lv=cfg.lv||autoLv(s,sg),
 tx=t.startsWith('x:')?t.slice(2):(g?[subjOf(g),sg?sg.title:'',g.title,...(sg?[]:g.subGoals.map(z=>z.title)),ltOf(g)].join(' '):''),
 Q={lv,no:Math.min(4,lv+1),sg,types:[],R:0};let D,cp=customPack(t,tx);
 if(cp)D={k:'words',name:cp.name,items:cp.items.slice()};
 else if(t.startsWith('m:'))D={k:'math',f:MF[t.slice(2)]||MF.count};
 else if(/^[cl]:/.test(t)){const[n,it]=resolveT(g,t);D=t[0]==='l'?{k:'letter',l:t.slice(2),name:n,items:it}:{k:'words',name:n,items:it}}
 else D=detect(tx);
 if(D.k==='letter'){if(!D.items){const[n,it]=D.l?['حرف '+D.l,P(LET[D.l])]:resolveT(g,'x:حروف');D.name=n;D.items=it}Q.l=D.l}
 else if(D.k==='words'&&!D.items){const[n,it]=resolveT(g,t.startsWith('x:')?t:'');D.name=n;D.items=it}
 Q.kind=D.k;Q.name=D.name||'';Q.items=D.items||[];if(D.k==='words')Q.cat=LIBS[Q.name]?Q.name:null;
 if(D.k==='math'){const f2=D.f||{};Q.f=f2;Q.R=numRange(tx,lv);Q.name=f2.add&&!f2.sub?'الجمع':f2.sub&&!f2.add?'الطرح':f2.add&&f2.sub?'الجمع والطرح':f2.ord&&!f2.cnt&&!f2.num?'ترتيب الأعداد':'الأعداد والعدّ';
  let m=[];if(f2.add||f2.sub)m.push('count','arith');if(f2.ord)m.push('order');if(f2.cnt||f2.num||!m.length)m.push('count','trace','match','order','memory');m=[...new Set(m)];['match','memory','trace'].forEach(x=>{if(m.length<4&&!m.includes(x))m.push(x)});Q.mix=m.slice(0,6)}
 else Q.mix=MIXW[D.k==='letter'?'letter':'words'].filter(x=>x!=='sort'||Q.items.length>=3||D.k==='letter');
 Q.allowed=ALW[D.k];const man=cfg.auto===0?(cfg.ty||[]).filter(x=>Q.allowed.includes(x)):[];Q.types=man.length?man:Q.mix;
 Q.sgTitle=sg?sg.title:'';return Q}
const planInfo=Q=>Q.name+' · '+Q.types.map(x=>TYN[x]).join('، ')+(Q.kind==='math'?' · حتى '+arn(Q.R):'');

/* ---- الأسئلة ---- */
const deckFor=(type,Q)=>{if(type==='firstl'&&Q.kind==='letter'&&Q.l){const o=sh(Object.keys(LET).filter(x=>x!==Q.l)).slice(0,3).map(x=>p1(P(LET[x])));return sh([...P(LET[Q.l]).slice(0,4),...o])}return sh(Q.items)};
const numOpts=(ans,Q)=>{const R=Math.max(Q.R||10,ans+2),s=new Set([ans]);let c=0;while(s.size<Q.no&&c++<80)s.add(Math.max(0,Math.min(R,ans+rnd(-3,3))));return sh([...s]).map(n=>({h:arn(n),k:String(n)}))};
function mkQ(type,Q,i,deck){const it=deck[i%Math.max(1,deck.length)]||{e:'❓',w:'؟'};
 if(type==='choose'||type==='balloon'){const o=sh([it,...sh(Q.items.filter(x=>x!==it)).slice(0,Q.no-1)]);return{stim:it.e,pr:'ما اسم هذه الصورة؟',opts:o.map(x=>({h:esc(x.w),k:x.w})),ans:it.w,st:type==='balloon'?'bl':'op'}}
 if(type==='pick'){const o=sh([it,...sh(Q.items.filter(x=>x!==it)).slice(0,Q.no-1)]);return{stim:esc(it.w),sc:'wd',pr:'اضغط على الصورة المناسبة',opts:o.map(x=>({h:x.e,k:x.w})),ans:it.w,st:'op pk'}}
 if(type==='firstl'){const a=firstL(it.w),o=sh([a,...sh(Object.keys(LET).filter(x=>x!==a)).slice(0,Q.no-1)]);return{stim:it.e,sub:Q.lv===1?it.w:'',pr:'ما الحرف الأول في اسم الصورة؟',opts:o.map(x=>({h:x,k:x})),ans:a,st:'op lt'}}
 if(type==='count'){const n=rnd(1,Math.min(Q.R,10)),e=p1(NUME);return{stim:Array(n).fill(e).join(' '),sc:'cn',pr:'كم عدد الصور؟',opts:numOpts(n,Q),ans:String(n),st:'op lt'}}
 if(type==='arith'){let op=Q.f.add&&!Q.f.sub?'+':Q.f.sub&&!Q.f.add?'−':p1(['+','−']),R=Math.max(3,Q.R),a,b,r;
  if(op==='+'){a=rnd(1,R-1);b=rnd(1,R-a);r=a+b}else{a=rnd(2,R);b=rnd(1,a-1);r=a-b}const e=p1(NUME),vis=R<=10?`<div class="qsub">${op==='+'?Array(a).fill(e).join('')+' ＋ '+Array(b).fill(e).join(''):Array(a).fill(e).join('')+' ← أخذنا '+arn(b)}</div>`:'';
  return{stim:arn(a)+' '+(op==='+'?'＋':'−')+' '+arn(b)+' = ؟',sc:'wd',after:vis,pr:'احسب الناتج',opts:numOpts(r,Q),ans:String(r),st:'op lt'}}
 return null}
function mkPairs(Q,k,ty){if(Q.kind==='math'){const mx=ty==='memory'?10:6,ns=sh(Array.from({length:Math.min(mx,Math.max(Q.R,k+1))},(_,i)=>i+1)).slice(0,k);
  return ns.map(n=>ty==='memory'?{a:arn(n),b:NUMW[n]}:{a:Array(n).fill(NUME[n%NUME.length]).join(''),b:arn(n)})}
 return sh(Q.items).slice(0,k).map(x=>({a:x.e,b:x.w}))}
function mkSort(Q){const n=[4,6,8][Q.lv-1]||6,h=n/2;
 if(Q.kind==='letter'){const L=Q.l||p1(Object.keys(LET)),A=sh(P(LET[L])).slice(0,h),o=sh(Object.keys(LET).filter(x=>x!==L)).slice(0,h).map(x=>p1(P(LET[x])));
  return{bins:['يبدأ بحرف ('+L+')','لا يبدأ بحرف ('+L+')'],pr:'ضع الصور التي تبدأ بحرف ('+L+') في السلة الأولى',its:sh([...A.map(x=>({...x,b:0})),...o.map(x=>({...x,b:1}))])}}
 const cats=Object.keys(LIBS),c0=Q.cat||(Q.items.length>=h&&Q.name?null:p1(cats)),c1=p1(cats.filter(x=>x!==(c0||Q.cat))),A=c0?P(LIBS[c0]):Q.items;
 return{bins:[c0||Q.name,c1],pr:'ضع كل صورة في السلة المناسبة لها',its:sh([...sh(A).slice(0,h).map(x=>({...x,b:0})),...sh(P(LIBS[c1])).slice(0,h).map(x=>({...x,b:1}))])}}
function mkOrder(Q){const k=[3,4,5][Q.lv-1]||4,top=Math.max(Q.R,k+1),nums=sh(Array.from({length:top},(_,i)=>i+1)).slice(0,k),asc=Q.lv<3||Math.random()<.7;
 return{shuf:sh(nums),tgt:[...nums].sort((a,b)=>asc?a-b:b-a),asc}}
function traceGlyph(Q){if(Q.kind==='math'){const d=rnd(1,Math.min(9,Math.max(Q.R,3)));return{g:arn(d),nm:'الرقم '+arn(d)}}const l=Q.l||p1(Object.keys(LET));return{g:l,nm:'الحرف ('+l+')'}}
