// اختبارات ٠٫٩٫٦: أمان الاستيراد + حجم الملف + تقسيم الوحدات + Word بعد التقسيم
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const root=path.join(__dirname,'..');
(async()=>{
 // حجم وتنظيم الوحدات
 const html=fs.statSync(path.join(root,'namaa.html')).size;ok(html<256*1024,'حجم namaa.html أقل من ٢٥٦ كيلوبايت ('+Math.round(html/1024)+'KB)');
 const mods=fs.readdirSync(path.join(root,'src/js')).map(f=>[f,fs.statSync(path.join(root,'src/js',f)).size]);
 ok(mods.every(([f,s])=>s<24000),'لا وحدة تتجاوز ٢٤ كيلوبايت (SRP): '+mods.filter(([f,s])=>s>=24000).map(m=>m[0]));
 ok(!fs.existsSync(path.join(root,'src/js/11-docs.js'))&&['a','b','c','d','e','f'].every(k=>mods.some(([f])=>f.startsWith('11'+k+'-'))),'وحدات الاستمارات الست موجودة ولا يوجد 11-docs.js');
 const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:430,height:900}})).newPage();
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('DIALOG '+d.message());d.dismiss()});
 p.on('console',m=>m.type()==='error'&&!/ERR_TUNNEL|ERR_NAME|Failed to load resource|fonts/.test(m.text())&&errs.push(m.text()));
 await p.goto('file://'+path.join(root,'namaa.html'));await p.waitForTimeout(400);await p.evaluate(()=>skipPin());await p.waitForTimeout(300);
 // ذهاب وإياب نسخة سليمة
 const rt=await p.evaluate(()=>{const t=Date.now();S.sess.push({id:'z1',sid:1,d:ymd(),dur:30,att:'p',gs:['g1'],note:'ن',t0:t});S.iep[1]['لغتي'].shortTermGoals[0].subGoals[0].log=[{r:'m',t,s:'z1'}];
  const c=cleanBackup(JSON.parse(JSON.stringify(S)));return{st:c.students.length===S.students.length,g:c.iep[1]['لغتي'].shortTermGoals[0].id==='g1',lg:c.iep[1]['لغتي'].shortTermGoals[0].subGoals[0].log[0].s==='z1',se:c.sess[0].id==='z1'&&c.sess[0].gs[0]==='g1',note:c.sess[0].note==='ن'}});
 ok(rt.st&&rt.g&&rt.lg&&rt.se&&rt.note,'نسخة سليمة تمر كما هي ('+JSON.stringify(rt)+')');
 // نسخة خبيثة
 const evil=await p.evaluate(async()=>{const bad="');window.__pwned=1;('";const e={students:[{id:1,name:'<img src=x onerror=window.__pwned=1>',grade:'x'},{id:'7;alert(1)',name:'drop'}],
  iep:{1:{'م':{longTermGoal:'<b>',shortTermGoals:[{id:bad,title:'t',subGoals:[{id:bad+'2',title:'s',status:'<x>',need:99,log:[{r:'z',t:1,s:bad}]}]}]}},'__proto__':{polluted:1}},
  sess:[{id:bad+'3',sid:1,d:'2026-01-01',gs:[bad],att:'q'},{id:'bad',sid:1,d:'not-a-date'}],run:bad+'3',__proto__x:1,evilKey:{a:1},cfg:{'__proto__':{polluted2:1},n:5}};
  const c=cleanBackup(JSON.parse(JSON.stringify(e).replace('"__proto__x"','"__proto__"')));
  const ids=[c.iep[1]['م'].shortTermGoals[0].id,c.iep[1]['م'].shortTermGoals[0].subGoals[0].id,c.sess[0].id,c.sess[0].gs[0],c.run];
  S=c;go('students');openSt(1);openGp(0);const html=document.querySelector('#v').innerHTML;
  return{ids,safe:ids.every(i=>SAFE_ID.test(i)),students:c.students.length,sess:c.sess.length,st:c.iep[1]['م'].shortTermGoals[0].subGoals[0].status,need:c.iep[1]['م'].shortTermGoals[0].subGoals[0].need,r:c.iep[1]['م'].shortTermGoals[0].subGoals[0].log[0].r,att:c.sess[0].att,
   same:c.sess[0].gs[0]===c.iep[1]['م'].shortTermGoals[0].id,noKey:!('evilKey' in c),poll:({}).polluted===undefined&&({}).polluted2===undefined,pwn:window.__pwned===undefined,img:!html.includes('<img src=x'),oc:[...document.querySelectorAll('[onclick]')].every(e=>!/pwned|alert/.test(e.getAttribute('onclick')))}});
 ok(evil.safe,'المعرّفات الخبيثة نُقّيت: '+evil.ids);ok(evil.same,'المراجع بين الجلسة والهدف بقيت متسقة بعد التنقية');
 ok(evil.students===1&&evil.sess===1,'سجلات غير صالحة حُذفت (طالب بمعرّف خبيث، جلسة بتاريخ فاسد)');
 ok(evil.st==='new'&&evil.need===5&&evil.r==='n'&&evil.att==='p','القيم الشاذة رُدّت لقيم مسموحة');
 ok(evil.noKey&&evil.poll,'مفاتيح غير معروفة وتلويث الـprototype محجوبان');ok(evil.pwn&&evil.img&&evil.oc,'لا تنفيذ كود ولا HTML خام بعد العرض');
 const rej=await p.evaluate(()=>{const r=[];for(const x of [null,{},{students:'x'},[1]]){try{cleanBackup(x);r.push(0)}catch(e){r.push(1)}}return r});ok(rej.every(x=>x===1),'هياكل غير صالحة تُرفض');
 // Word بعد التقسيم والشعار المضغوط
 const w=await p.evaluate(async()=>{S=clone(SEED);S.sess=[];S.snap=[];CUR=1;BG='g1';showDoc('note');const bl=await irDOCX(DOCIR),u=new Uint8Array(await bl.arrayBuffer()),s=new TextDecoder('latin1').decode(u);
  return{size:u.length,names:['[Content_Types].xml','word/document.xml','word/styles.xml','word/header1.xml','word/footer1.xml','word/media/logo.png','word/media/wm.png'].every(n=>s.includes(n)),entries:new DataView(u.buffer).getUint16(u.length-22+10,true)}});
 ok(w.names&&w.entries===10,'ملف Word يحوي ١٠ أجزاء بلا تكرار (حجم '+w.size+' بايت)');
 await p.evaluate(()=>{CUR=1});const pg=await p.evaluate(()=>document.querySelector('#pvd .npg').offsetHeight);ok(pg>=1110&&pg<=1130,'الاستمارة ما زالت A4 واحدة ('+pg+'px)');
 ok(errs.length===0,'لا أخطاء جافاسكربت ولا نوافذ تنبيه '+JSON.stringify(errs));
 await b.close();console.log(fail?'FAILED '+fail:'ALL PASSED');process.exit(fail?1:0)})();
