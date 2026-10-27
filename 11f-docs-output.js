/* ---- العرض والتنزيل والطباعة ---- */
let DOCIR=null,DOCN='',DOCH='',DOCBACK='';
function docOut(d,n,back,sel){DOCIR=d;DOCN=n;DOCBACK=back;const h=irHTML(d);DOCH=docPage(d.title,h);
 $('#sheet').innerHTML=`<div class="ov"><div class="sh" style="height:92vh;overflow:auto"><div class="gm"><b class="in">${esc(d.title)}</b><button class="ed" onclick="${back}" aria-label="رجوع">✕</button></div>${sel||''}
 <style>${DS}</style><div id="pvw" class="nd" style="margin:8px 0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff"><div id="pvd" style="width:794px;transform-origin:top right">${h}</div></div>
 <button class="btn" onclick="docPrint()">🖨️ طباعة</button><button class="btn g" onclick="docPdf(this)">⬇ تنزيل PDF</button><button class="btn g" onclick="docWord(this)">⬇ تنزيل Word (.docx)</button><button class="btn g" onclick="dlFile(DOCN+'.html',DOCH)">⬇ تنزيل HTML للطباعة</button></div></div>`;
 const w=$('#pvw'),p=$('#pvd'),k=Math.min(1,w.clientWidth/794);p.style.transform=`scale(${k})`;w.style.height=Math.ceil(p.offsetHeight*k)+'px'}
async function docWord(b){const o=b.textContent;b.textContent='جارٍ التجهيز…';b.disabled=true;try{await dlFile(DOCN+'.docx',await irDOCX(DOCIR))}catch(e){toast('تعذّر إنشاء Word')}b.textContent=o;b.disabled=false}
const loadH2P=()=>window.html2pdf?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
async function docPdf(b){const o=b.textContent;b.textContent='جارٍ التجهيز…';b.disabled=true;let h=null;
 try{await loadH2P();h=document.createElement('div');h.style.cssText='position:fixed;left:-9999px;top:0;width:794px;background:#fff';h.innerHTML=`<style>${DS}</style><div class="nd">${irHTML(DOCIR)}</div>`;document.body.appendChild(h);
  const bl=await html2pdf().set({margin:0,filename:DOCN+'.pdf',image:{type:'jpeg',quality:.96},html2canvas:{scale:2,backgroundColor:'#fff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['tr']}}).from(h).outputPdf('blob');
  h.remove();await dlFile(DOCN+'.pdf',bl)}
 catch(e){if(h)h.remove();toast('تعذّر إنشاء PDF (يحتاج إنترنت). استخدم Word أو HTML أو الطباعة')}
 b.textContent=o;b.disabled=false}
function docPrint(){try{const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);const w=f.contentWindow;w.document.open();w.document.write(DOCH);w.document.close();
 setTimeout(()=>{try{w.focus();w.print()}catch(e){toast('الطباعة غير متاحة هنا. استخدم تنزيل PDF أو Word')}setTimeout(()=>f.remove(),60000)},600)}catch(e){toast('الطباعة غير متاحة هنا. استخدم تنزيل PDF أو Word')}}

/* ---- شاشة اختيار الجلسة + الحقيبة ---- */
const DKS=['base','note','log','par','home'];
function docSel(g){if(!DKS.includes(DK))return'';const{z,ss}=dSess(g),cur=DM==='auto'?'auto':DM;
 return`<label style="display:block;margin:6px 0 0">بيانات الاستمارة (مربوطة بالجلسات)<select onchange="docMode(this.value)"><option value="auto"${cur==='auto'?' selected':''}>${ss[0]?'آخر جلسة تلقائياً · '+dG(ss[0].d):'تلقائي (لا جلسات لهذا الهدف بعد)'}</option>${ss.map(x=>`<option value="${x.id}"${cur===x.id?' selected':''}>جلسة ${dG(x.d)} · ${AT[x.att][0]}</option>`).join('')}<option value="all"${cur==='all'?' selected':''}>كل الجلسات (تراكمي)</option><option value="blank"${cur==='blank'?' selected':''}>استمارة فارغة للتعبئة اليدوية</option></select></label>`}
function docMode(v){DM=v;showDoc(DK,1)}
function showDoc(k,keep){DK=k;if(!keep)DM='auto';const g=curG();docOut(mkDoc(k,g),'namaa-'+k+'-STD'+(100+CUR)+'-'+ymd(),`openBag('${BG}')`,docSel(g))}
function openBag(gid){BG=gid;const g=curG(),[nm,it]=resolveT(g,''),
 grp=[['📋 الاستمارات (تُعبّأ تلقائياً من الجلسات)',['base','note','log','par']],['📝 أوراق العمل',['conn','circ','wr'].concat(resolveT(g,'')[0].startsWith('حرف ')?['lw']:[])],['🏠 الواجبات',['home']]];
 $('#sheet').innerHTML=`<div class="ov" onclick="if(event.target===this)closeSheet()"><div class="sh" style="max-height:88vh;overflow:auto">
 <h2 class="st" style="margin:0 0 2px">🎒 أنشطة واستمارات الهدف</h2><p class="mut" style="margin:0 0 6px;text-align:right">${esc(g.title)}</p>
 <div class="card"><b>تُولَّد الأنشطة وأوراق العمل تلقائياً</b><br><small style="color:var(--mut)">المحتوى المكتشف: ${esc(nm)} ${it.slice(0,6).map(i=>i.e).join(' ')}</small></div>
 <button class="btn" onclick="SGACT=null;openCfg()">▶ شغّل الأنشطة</button>
 ${grp.map(([t,ks])=>`<h3 class="st" style="font-size:calc(13px*var(--fs))">${t}</h3>${ks.map(k=>`<button class="btn g" style="text-align:right" onclick="showDoc('${k}')">${TIT[k]}</button>`).join('')}`).join('')}</div></div>`}
