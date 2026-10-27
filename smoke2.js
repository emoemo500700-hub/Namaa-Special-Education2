// اختبارات ٠٫٩٫٤ (التقييم داخل الجلسة) + ٠٫٩٫٣ (نقاط الدخول) + ٠٫٩٫٢: الاستمرارية، شاشة الهدف الفرعي، عزل الطلاب، مولّد الأنشطة، الحصة الكاملة، التذييل
const {chromium}=require('playwright');const path=require('path');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&!/ERR_TUNNEL|ERR_NAME|Failed to load resource|fonts/.test(m.text())&&errs.push(m.text()));
 const url='file://'+path.join(__dirname,'..','namaa.html');
 await p.goto(url);await p.waitForTimeout(400);await p.evaluate(()=>skipPin());await p.waitForTimeout(300);
 // بيانات: طالب٢ بخطة رياضيات، وطالب١ بمحاولات
 await p.evaluate(async()=>{const t0=Date.now();
  S.iep[1]['لغتي'].shortTermGoals[0].subGoals[0].log=[{r:'m',t:t0},{r:'m',t:t0+1}];
  S.iep[2]={'رياضيات':{longTermGoal:'أن يجمع الطالب عددين حتى ١٠.',shortTermGoals:[{id:'h1',title:'جمع عددين حتى ٥',subGoals:[{id:'hs1',title:'يجمع عددين ناتجهما أقل من ٥',status:'new',log:[]},{id:'hs2',title:'يعد من ١ إلى ٥',status:'new',log:[]}]}]}};
  S.sess.push({id:'za',sid:1,d:ymd(),dur:30,att:'p',gs:['g1'],note:'ملاحظة طالب ١ فقط',t0});await save()});
 // ١) الاستمرارية عند التحديث
 await p.evaluate(()=>{openSt(1);openGp(0)});await p.reload();await p.waitForTimeout(600);
 ok(await p.evaluate(()=>T==='gp'&&CUR===1),'التحديث يُبقي المستخدم في صفحة الهدف (لا يعود للرئيسية)');
 await p.evaluate(()=>go('reports'));await p.reload();await p.waitForTimeout(500);ok(await p.evaluate(()=>T==='reports'),'التحديث يُبقي تبويب التقارير');
 // ٢) شاشة الهدف الفرعي
 await p.evaluate(()=>{openSt(1);openGp(0)});
 const noBtn=await p.evaluate(()=>!document.querySelector('#v .ck')&&!document.querySelector('#v .ev'));ok(noBtn,'لا أزرار تقييم ظاهرة في قائمة الأهداف');
 await p.evaluate(()=>openSg('s3'));ok(await p.evaluate(()=>document.querySelectorAll('#sheet .ev').length===0&&document.querySelector('#sheet').innerText.includes('داخل الجلسة فقط')),'خارج الجلسة: لا تقييم، وتظهر رسالة «داخل الجلسة فقط»');
 ok(await p.evaluate(async()=>{await evalSg('s3','m');return (findSg('s3')[0].log||[]).length===0}),'محاولة تقييم برمجية خارج الجلسة تُرفض');
 ok(await p.evaluate(()=>document.querySelector('#sheet').innerText.includes('معيار الخطة')),'سطر معيار الخطة (٤ من ٥) ظاهر');
 await p.evaluate(()=>closeSheet());
 await p.evaluate(async()=>{SSID=1;SSEL=null;go('sess');SSEL.ids=new Set(['g1']);await beginSess()});
 ok(await p.evaluate(()=>{openSg('s3');return document.querySelectorAll('#sheet .ev').length===3&&!document.querySelector('#sheet').innerText.includes('تعديل أو حذف')}),'داخل الجلسة: ٣ أزرار تقييم وبلا تعديل/حذف أهداف');
 await p.evaluate(async()=>{openSg('s3');await evalSg('s3','m')});
 const st=await p.evaluate(()=>{const sg=findSg('s3')[0];return{n:sg.log.length,s:sg.log.slice(-1)[0].s===S.run,locked:(openSg('s3'),!document.querySelector('#sheet .ev')&&document.querySelector('#sheet').innerText.includes('إعادة التقييم'))}});
 ok(st.n===1&&st.s,'التقييم حُفظ تلقائياً ومربوط بالجلسة');ok(st.locked,'بعد التقييم: لا يعاد التقييم إلا بزر «إعادة التقييم»');
 await p.evaluate(()=>closeSheet());await p.evaluate(async()=>{await endSess()});
 // ٣) عزل الطلاب
 const iso=await p.evaluate(()=>{DM='za';CUR=2;BG='h1';DK='log';const d=mkDoc('log',curG());const t=JSON.stringify(d);DM='auto';
  const n=mkDoc('note',curG());return{leak:t.includes('ملاحظة طالب ١')||JSON.stringify(n).includes('ملاحظة طالب ١')||t.includes('"c":"mk"'),name:d.meta[0][1]}});
 ok(!iso.leak&&iso.name!=='ناصر تركي العنزي','استمارات طالب ٢ لا تحتوي بيانات طالب ١ ('+iso.name+')');
 const rep=await p.evaluate(()=>{const r=JSON.stringify(mkReport(2,addD(ymd(),-30),ymd()));return r.includes('ناصر')||r.includes('ملاحظة طالب ١')});ok(!rep,'تقرير طالب ٢ منفصل تماماً');
 // ٤) مولّد الأنشطة
 const pl=await p.evaluate(()=>{CUR=1;BG='g1';const a=buildPlan(curG(),'',{lv:0,auto:1,ty:[]},null);CUR=2;BG='h1';const m=buildPlan(curG(),'',{lv:0,auto:1,ty:[]},'hs1');
  S.packs=[{id:'pp',name:'الحيوانات المائية',kw:'مائية,البحر',items:P('🐟 سمكة|🐙 أخطبوط|🐬 دلفين|🦀 سلطعون|🐳 حوت')}];save();
  const c=buildPlan({title:'يتعرف على الكائنات البحرية والبحر',subGoals:[]},'',{lv:0,auto:1,ty:[]},null);
  return{a:[a.kind,a.l,a.types],m:[m.kind,m.name,m.types,m.R,m.lv],c:[c.kind,c.name,c.items.length]}});
 ok(pl.a[0]==='letter'&&pl.a[1]==='س'&&pl.a[2].includes('trace')&&pl.a[2].includes('sort')&&new Set(pl.a[2]).size>=5,'هدف حرف (س): '+pl.a[2].join(','));
 ok(pl.m[0]==='math'&&pl.m[2].includes('arith')&&pl.m[3]<=10,'هدف جمع: '+pl.m[2].join(',')+' · حتى '+pl.m[3]);
 ok(pl.c[0]==='words'&&pl.c[1]==='الحيوانات المائية','حزمة مخصصة تُكتشف من الكلمات المفتاحية');
 // ٥) تشغيل كل نوع لعبة
 const types=['choose','pick','balloon','firstl','count','arith','match','drag','memory','trace','sort','order'];
 for(const ty of types){
  const r=await p.evaluate(async ty=>{CUR=2;BG='h1';const g=curG();let t='x:حرف س';if(['count','arith','order'].includes(ty))t='m:'+({count:'count',arith:'add',order:'order'})[ty];else if(ty==='trace')t='m:count';else if(ty==='match'||ty==='drag')t='c:الحيوانات';else t='l:س';
   launch(g,t,{n:3,lv:1,tm:0,big:1,snd:0,mus:0,conf:0,intro:0,auto:0,ty:[ty]},null);await new Promise(r=>setTimeout(r,1500));return{pl:GS.pl,html:$('#gb').innerHTML.length,txt:$('#gb').innerText.slice(0,40)}},ty);
  ok(r.pl[0]===ty&&r.html>80,'لعبة '+TYNm(ty)+' تُعرض');
  await p.evaluate(()=>endGame())}
 function TYNm(t){return({choose:'اختيار',pick:'اختر الصورة',balloon:'بالونات',firstl:'الحرف الأول',count:'عدّ',arith:'جمع',match:'توصيل',drag:'سحب',memory:'ذاكرة',trace:'كتابة',sort:'فرز',order:'ترتيب'})[t]}
 // ٦) حصة كاملة: ترحيب باسم الطالب ← تهيئة ← لعبتان ← ختام
 await p.evaluate(()=>{CUR=1;BG='g1';launch(curG(),'',{n:3,lv:1,tm:0,big:1,snd:0,mus:0,conf:0,intro:1,auto:0,ty:['choose','count'].slice(0,1).concat(['pick']),},null)});
 await p.waitForTimeout(300);
 ok((await p.innerText('#gb')).includes('مرحباً يا ناصر'),'ترحيب باسم الطالب');
 await p.evaluate(()=>warm(0));for(let i=0;i<4;i++){await p.evaluate(i=>warm(i+1),i)}
 ok(await p.evaluate(()=>document.querySelector('#gb').innerText.includes('أنت جاهز')),'مرحلة التهيئة');
 for(let k=0;k<60&&!(await p.$('.stg.end'));k++){await p.evaluate(async()=>{for(const b of document.querySelectorAll('#gb [data-k]')){if(!b.disabled)b.click();if(b.classList.contains('good'))break;await new Promise(r=>setTimeout(r,30))}});await p.waitForTimeout(700)}
 await p.waitForFunction(()=>document.querySelector('.stg.end'),null,{timeout:20000});
 const end=await p.innerText('#gb');ok(end.includes('ناصر')&&/بطل|رائع|شكراً/.test(end)&&await p.evaluate(()=>document.querySelectorAll('.rain i').length>20),'ختام باسم الطالب + إيموجي متحرك');
 await p.screenshot({path:path.join(__dirname,'out','end.png')}).catch(()=>{});
 await p.evaluate(()=>showRes());ok((await p.innerText('#gb')).includes('داخل الجلسة فقط'),'بعد النشاط خارج الجلسة: لا تقييم (رسالة داخل الجلسة فقط)');
 await p.evaluate(()=>{const z={id:'zr',sid:CUR,d:ymd(),dur:0,att:'p',gs:[GS.g.id],note:'',t0:Date.now(),open:1};S.sess.push(z);S.run=z.id;showRes()});
 ok((await p.innerText('#gb')).includes('سجّل التقييم'),'شاشة تقييم الأخصائي بعد الختام (داخل جلسة)');
 await p.evaluate(()=>{S.run=null;S.sess=S.sess.filter(z=>z.id!=='zr');endGame()});
 // ٧) كتابة الحرف (تتبع)
 await p.evaluate(()=>{CUR=2;BG='h1';traceGlyph=()=>({g:'١',nm:'الرقم ١'});launch(curG(),'m:count',{n:3,lv:1,tm:0,big:1,snd:0,mus:0,conf:0,intro:0,auto:0,ty:['trace']},null)});
 await p.waitForSelector('#tc',{timeout:6000});const bb=await (await p.$('#tc')).boundingBox();
 await p.mouse.move(bb.x+bb.width*.5,bb.y+bb.height*.2);await p.mouse.down();for(let k=0;k<=12;k++)await p.mouse.move(bb.x+bb.width*.5,bb.y+bb.height*(.2+.6*k/12));await p.mouse.up();
 await p.waitForTimeout(400);await p.click('#tok').catch(()=>{});await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>GS&&GS.pi===0&&/٢ من|سؤال ٢/.test(document.querySelector('#gb').innerText)),'كتابة الرقم: التتبع الصحيح يُقبل وينتقل للسؤال التالي');
 await p.evaluate(()=>endGame());
 // ٨) التذييل والاسم
 const f=await p.evaluate(()=>{CUR=1;BG='g1';showDoc('note');const t=document.querySelector('#pvd').innerText;return{t,n:(t.match(/عماد عبد العزيز/g)||[]).length}});
 ok(f.t.includes('منيف الشمري')&&f.t.includes('سامية المطيري')&&f.t.includes('مدير المدارس')&&f.t.includes('مديرة التربية الخاصة'),'تذييل: المدير والمديرة');
 ok(f.n===1,'اسم الأخصائي مرة واحدة فقط (الأعلى): '+f.n);ok(!f.t.includes('نماء ·'),'حُذفت هوية المنصة من التذييل');
 // ٩) ٠٫٩٫٣: نقاط الدخول — إضافة الطالب مكان واحد، وبدء الجلسة مكانان فقط
 const ep=await p.evaluate(()=>{const c=h=>(h.match(/startFor\(/g)||[]).length,a=h=>(h.match(/openAdd\(/g)||[]).length;
  go('home');const home=document.querySelector('#v').innerHTML;go('students');const stu=document.querySelector('#v').innerHTML;
  openSt(1);const st=document.querySelector('#v').innerHTML;openGp(0);const gp=document.querySelector('#v').innerHTML;
  return{homeAdd:a(home),homeStart:c(home),stuAdd:a(stu),stStart:c(st),gpStart:c(gp)}});
 ok(ep.homeAdd===0&&ep.stuAdd===1,'إضافة الطالب: زر واحد في قسم الطلاب فقط (الرئيسية: '+ep.homeAdd+')');
 ok(ep.stStart===1,'صفحة الطالب: زر واحد لبدء الجلسة ('+ep.stStart+')');
 ok(ep.gpStart===0,'صفحة المادة (تخطيط): لا زر بدء جلسة ('+ep.gpStart+')');
 ok(await p.evaluate(()=>{go('home');return document.querySelectorAll('#v .qa button').length===4}),'الرئيسية: ٤ إجراءات سريعة بلا تكرار');
 // ١٠) ٠٫٩٫٤: التقييم داخل الجلسة فقط ولأهدافها فقط
 const rc=await p.evaluate(async()=>{const ie9=S.iep[1]['لغتي'];ie9.shortTermGoals.push({id:'g9',title:'هدف آخر',subGoals:[{id:'s9',title:'فرعي آخر',status:'new',log:[]}]});CUR=1;SSID=1;SSEL=null;go('sess');const all=Object.values(S.iep[1]).flatMap(x=>x.shortTermGoals);SSEL.ids=new Set([all[0].id]);await beginSess();
  const other=all.find(g=>g.id!==all[0].id&&g.subGoals.length);const r1=other?rateCtx(other.subGoals[0].id):{ok:1};
  CUR=2;const r2=rateCtx('s3');CUR=1;await endSess();ie9.shortTermGoals=ie9.shortTermGoals.filter(g=>g.id!=='g9');openSt(1);openGp(0);
  return{goal:r1.why,stu:r2.why,plan:document.querySelector('#v').innerText.includes('وضع الخطة')&&!document.querySelector('#v').innerHTML.includes('اضغط للدخول والتقييم')}});
 ok(rc.goal==='goal','هدف خارج أهداف الجلسة لا يُقيَّم ('+rc.goal+')');ok(rc.stu==='stu','جلسة طالب آخر لا تسمح بتقييم هذا الطالب ('+rc.stu+')');ok(rc.plan,'صفحة المادة بوضع «الخطة» وبلا دعوة للتقييم');
 // ١١) ٠٫٩٫٥: الرئيسية «اليوم»
 const hm=await p.evaluate(async()=>{const t=Date.now(),old=new Date(t-20*864e5).toLocaleDateString('en-CA');
  S.sess=S.sess.filter(z=>z.sid!==2);S.sess.push({id:'old2',sid:2,d:old,dur:30,att:'p',gs:['h1'],note:'',t0:t-20*864e5});
  const sg=S.iep[1]['لغتي'].shortTermGoals[0].subGoals[2];sg.status='not';sg.log=[0,1,2].map(i=>({r:'n',t:t-i*864e5}));
  go('home');const h=document.querySelector('#v').innerText,n=document.querySelectorAll('#v .qa button').length;
  const a=attention();S.sess=S.sess.filter(z=>z.id!=='old2');S.sess.push({id:'new2',sid:2,d:ymd(),dur:20,att:'p',gs:['h1'],note:'',t0:t});go('home');
  const a2=attention(),today2=document.querySelector('#v').innerText;S.sess=S.sess.filter(z=>z.id!=='new2');return{h,n,a,a2:a2.map(x=>x.sid+':'+x.w),today2,hasStudents:h.includes('طالب')}});
 ok(hm.h.includes('جلسات اليوم')&&hm.h.includes('يحتاج اهتماماً'),'الرئيسية: جلسات اليوم + يحتاج اهتماماً');
 ok(hm.a.some(x=>x.sid===2&&x.w===1&&x.r.includes('٢٠')),'يحتاج اهتماماً: بلا جلسة منذ ١٤ يوماً ('+JSON.stringify(hm.a.filter(x=>x.sid===2))+')');
 ok(hm.a.some(x=>x.sid===1&&x.w===2),'يحتاج اهتماماً: هدف متعثر');
 ok(!hm.a2.includes('2:1'),'بعد جلسة اليوم يختفي تنبيه الطالب');ok(hm.today2.includes('٢٠ دقيقة'),'جلسة اليوم تظهر في الرئيسية');
 ok(hm.n===4,'الرئيسية: ٤ إجراءات سريعة بلا تكرار');
 ok(errs.length===0,'لا أخطاء جافاسكربت '+JSON.stringify(errs));
 await b.close();console.log(fail?'FAILED '+fail:'ALL PASSED');process.exit(fail?1:0)})();
