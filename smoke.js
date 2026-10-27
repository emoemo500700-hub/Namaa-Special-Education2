// اختبار آلي: يفتح namaa.html ويتحقق من الشاشات والاستمارات وتنزيل Word. التشغيل: node tests/smoke.js [مجلد_المخرجات]
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const OUT=process.argv[2]||path.join(__dirname,'out');fs.mkdirSync(OUT,{recursive:true});
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:430,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&!/ERR_TUNNEL|ERR_NAME|Failed to load resource/.test(m.text())&&errs.push(m.text()));
 await p.goto('file://'+path.join(__dirname,'..','namaa.html'));await p.waitForTimeout(500);
 await p.evaluate(()=>skipPin());await p.waitForTimeout(400);
 for(const t of ['home','students','sess','reports','me'])await p.evaluate(t=>go(t),t);
 ok(true,'التنقل بين التبويبات الخمسة');
 // بيانات جلسة مع محاولات
 await p.evaluate(()=>{CUR=1;const g=S.iep[1]['لغتي'].shortTermGoals[0];const t0=Date.now();
  S.sess.push({id:'z1',sid:1,d:ymd(),dur:40,att:'p',gs:[g.id],note:'تفاعل جيد مع التقليد',t0});
  g.subGoals[0].log=[{r:'m',t:t0,s:'z1'},{r:'m',t:t0+1,s:'z1'},{r:'p',t:t0+2,s:'z1'}];
  g.subGoals[1].log=[{r:'p',t:t0,s:'z1'},{r:'m',t:t0+3,s:'z1'}];g.subGoals[2].log=[{r:'n',t:t0,s:'z1'}];BG=g.id});
 const kinds=['base','note','log','par','conn','circ','wr','home'];
 for(const k of kinds){const r=await p.evaluate(k=>{showDoc(k);const pg=document.querySelector('#pvd .npg');return{h:pg.offsetHeight,w:pg.offsetWidth,t:pg.innerText.length}},k);
  ok(r.h>=1110&&r.h<=1130,`استمارة ${k}: صفحة A4 واحدة بلا فراغ (${r.h}px من 1115)`);
  await (await p.$('#pvd')).screenshot({path:path.join(OUT,k+'.png')})}
 // تحقق من التعبئة التلقائية
 const txt=await p.evaluate(()=>{showDoc('note');return document.querySelector('#pvd').innerText});
 ok(txt.includes('عماد عبد العزيز')&&txt.includes('الأخصائي/'),'اسم الأخصائي ظاهر');ok(txt.includes('تفاعل جيد مع التقليد'),'ملاحظة الجلسة معبّأة تلقائياً');ok(txt.includes('☑'),'نتائج الجلسة معلّمة تلقائياً');
 const blank=await p.evaluate(()=>{docMode('blank');return document.querySelector('#pvd').innerText.includes('☑')});ok(!blank,'وضع الاستمارة الفارغة بلا بيانات');
 // Word
 for(const k of ['note','log','circ']){const b64=await p.evaluate(async k=>{showDoc(k);const bl=await irDOCX(DOCIR);const r=new FileReader();return await new Promise(o=>{r.onload=()=>o(r.result.split(',')[1]);r.readAsDataURL(bl)})},k);
  fs.writeFileSync(path.join(OUT,k+'.docx'),Buffer.from(b64,'base64'))}
 // التقارير
 const rp=await p.evaluate(()=>{RP={sid:1,from:addD(ymd(),-30),to:ymd(),dx:0};showReport(0);const a=document.querySelector('#pvd').innerText;const b64=null;return a});
 ok(rp.includes('تقرير متابعة الطالب')&&rp.includes('سجل الجلسات'),'تقرير الطالب يُبنى من الجلسات');await (await p.$('#pvd')).screenshot({path:path.join(OUT,'report.png')});
 await p.evaluate(()=>showReport(1));await (await p.$('#pvd')).screenshot({path:path.join(OUT,'report-all.png')});
 const sd=await p.evaluate(()=>{sessDoc('z1');return document.querySelector('#pvd').innerText});ok(sd.includes('ملخص الجلسة'),'ملخص الجلسة');
 const b64=await p.evaluate(async()=>{showReport(0);const r=new FileReader();const bl=await irDOCX(DOCIR);return await new Promise(o=>{r.onload=()=>o(r.result.split(',')[1]);r.readAsDataURL(bl)})});fs.writeFileSync(path.join(OUT,'report.docx'),Buffer.from(b64,'base64'));
 // انحدار: الجلسة والأنشطة والخطة
 const reg=await p.evaluate(async()=>{const r={};SSID=1;SSEL=null;go('sess');SSEL.ids=new Set(['g1']);await beginSess();r.run=!!S.run;
  const sg=S.iep[1]['لغتي'].shortTermGoals[0].subGoals[0];CUR=1;await logA(sg.id,'m');r.linked=sg.log.slice(-1)[0].s===S.run;await endSess();r.ended=!S.run;
  BG='g1';openCfg();r.cfg=!!document.querySelector('#c_n');await startGame();r.game=!!document.querySelector('#gx');endGame();
  go('st');r.st=document.querySelector('#v').innerText.includes('الخطة');openGp(0);r.gp=document.querySelector('#v').innerText.includes('الهدف الفرعي');openBag('g1');r.bag=document.querySelector('#sheet').innerText.includes('استمارة');closeSheet();
  go('reports');r.rep=document.querySelector('#v').innerText.includes('تقرير الطالب');return r});
 for(const[k,v]of Object.entries(reg))ok(v,'انحدار: '+k);
 ok(errs.length===0,'لا أخطاء جافاسكربت '+JSON.stringify(errs));
 await b.close();console.log(fail?'FAILED '+fail:'ALL PASSED');process.exit(fail?1:0)})();
