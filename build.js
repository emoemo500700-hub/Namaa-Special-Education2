// يدمج src/ في ملف واحد namaa.html (أوفلاين، بدون خادم).  التشغيل: node build.js
const fs=require('fs'),path=require('path');
const R=p=>path.join(__dirname,p);
const tpl=fs.readFileSync(R('src/template.html'),'utf8');
const css=fs.readFileSync(R('src/styles.css'),'utf8');
const logo=fs.readFileSync(R('src/assets/logo.png')).toString('base64');
const files=fs.readdirSync(R('src/js')).filter(f=>f.endsWith('.js')).sort();
let js=`const LOGO="data:image/png;base64,${logo}";\n`;
for(const f of files)js+=`/* ---------- ${f} ---------- */\n`+fs.readFileSync(R('src/js/'+f),'utf8')+'\n';
js=js.replace(/<\/script>/g,'<\\/script>');
const out=tpl.replace('/*STYLES*/',()=>css).replace('/*SCRIPT*/',()=>js);
fs.writeFileSync(R('namaa.html'),out);
console.log('built namaa.html',(out.length/1024).toFixed(0)+'KB from',files.length,'modules');
