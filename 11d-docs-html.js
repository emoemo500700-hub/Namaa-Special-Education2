/* ---- المحوّل: IR ← HTML ---- */
const cx=c=>typeof c==='string'?{x:c}:c;
const hx=s=>esc(s).replace(/\n/g,'<br>');
const cellH=(c,th)=>{const o=cx(c),t=th?'th':'td',x=hx(o.x),inner=(o.c==='co'||o.c==='cw'||o.c==='bx')?`<span class="nbx">${x}</span>`:x;
 return`<${t}${o.c&&!th?` class="c_${o.c}"`:''}>${o.bar!=null?`<div class="nbr"><i style="width:${o.bar}%"></i></div>`:''}${inner}</${t}>`};
const blockH=b=>{
 if(b.t==='p')return`<p style="${b.c==='l'?'text-align:right;':''}${b.b?'font-weight:800;':''}">${hx(b.x)}</p>`;
 if(b.t==='h')return`<div class="nh">${hx(b.x)}</div>`;
 if(b.t==='ln')return`<div class="nlnf${b.fill?' nfl':''}" style="--n:${b.n}"></div>`;
 if(b.t==='tbl'){const n=(b.h||b.r[0]).length,w=b.w||Array(n).fill(100/n);
  return`<table class="${(b.fill?'nfl ':'')+(b.nb?'nnb':'')}"><colgroup>${w.map(p=>`<col style="width:${p}%">`).join('')}</colgroup>${b.h?`<thead><tr>${b.h.map(h=>cellH(h,1)).join('')}</tr></thead>`:''}<tbody>${b.r.map(r=>`<tr>${r.map(c=>cellH(c)).join('')}</tr>`).join('')}</tbody></table>`}
 return''};
const DCSS='.npg{position:relative;width:210mm;min-height:295mm;box-sizing:border-box;padding:9mm 12mm 8mm;display:flex;flex-direction:column;overflow:hidden;background:#fff;margin:0 auto}'+
'.nwm{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;z-index:0;pointer-events:none}.nwm img{width:125mm;opacity:.09}'+
'.ndh,.nbd,.nft,.ngl{position:relative;z-index:1}'+
'.ndh{display:grid;grid-template-columns:36mm 1fr 58mm;align-items:center;gap:5mm;border-bottom:2.5px solid #0B2545;padding-bottom:3mm}.ndh img{width:36mm;display:block}'+
'.ndt{text-align:center}.ndt .nsc{font-size:14px;color:#0B8279;font-weight:700}.ndt h1{font:800 26px/1.3 Cairo,Tajawal,Arial,sans-serif;color:#0B2545;margin:2px 0}.ndt .nsb{font-size:13px;color:#555}'+
'.ndm{font-size:13px;line-height:1.75;text-align:right}.ndm b{color:#0B2545}'+
'.ngl{background:#FBF1D0;border:1px solid #C9971C;border-radius:8px;padding:6px 12px;margin-top:4mm;font-size:17px;font-weight:700;color:#0B2545;text-align:center}'+
'.nbd{flex:1;display:flex;flex-direction:column;gap:3.5mm;padding-top:4mm}.nbd p{margin:0;font-size:16px;text-align:center}'+
'.nbd .nh{font-size:16px;font-weight:800;color:#fff;background:#0B8279;border-radius:6px;padding:3px 10px;text-align:right}'+
'.nbd table{width:100%;border-collapse:collapse;table-layout:fixed}.nbd table.nfl{flex:1}'+
'.nbd th{background:#0B2545;color:#fff;padding:7px 4px;font-size:15px;border:1px solid #0B2545}'+
'.nbd td{border:1px solid #666;padding:6px 5px;font-size:16px;vertical-align:middle;text-align:center;overflow-wrap:anywhere}'+
'.nbd tr{page-break-inside:avoid;break-inside:avoid}.nbd td.c_l{text-align:right}.nbd td.c_lb{background:#F3EEDC;font-weight:800;text-align:right;color:#0B2545}'+
'.nbd table.nnb td{border:0;border-bottom:1px dashed #aaa}.nbd td.c_ci{font-size:46px;line-height:1.1}.nbd td.c_gh{font-size:42px;color:#c4c4c4;font-weight:700}'+
'.nbd td.c_mk{font-size:26px;font-weight:800;color:#0B2545}.nbd .nbx{display:inline-block;border:2px solid #0B2545;border-radius:10px;padding:5px 16px;font-size:21px}'+
'.nbr{height:9px;background:#e4e4e4;border-radius:5px;overflow:hidden;margin:1px 0 3px}.nbr i{display:block;height:100%;background:#0B8279}'+
'.nlnf{height:calc(var(--n)*9mm);background:repeating-linear-gradient(to bottom,transparent 0,transparent 8.3mm,#888 8.3mm,#888 9mm);flex:none}.nlnf.nfl{flex:1;height:auto;min-height:calc(var(--n)*9mm)}'+
'.nft{display:flex;justify-content:space-between;align-items:flex-end;gap:6mm;border-top:2px solid #0B2545;padding-top:3mm;margin-top:4mm;font-size:14px}.nft .sg{flex:1;text-align:center;line-height:1.7}.nft b{display:block;font-size:14px;color:#0B2545}.nft span{display:block;font-weight:800;font-size:15px}.nft i{display:block;font-style:normal;color:#666;font-size:12px;margin-top:3px}.nft .sd{font-size:13px;color:#333;white-space:nowrap}'+
'.pbn{position:fixed;top:8px;left:8px;z-index:9}.pbn button{padding:8px 14px;font:700 14px Tajawal,Arial;border:0;border-radius:8px;background:#0E7C86;color:#fff;cursor:pointer}';
const DS='.nd{font:16px/1.6 Tajawal,"Segoe UI",Tahoma,Arial,sans-serif;color:#111;background:#fff;direction:rtl;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+P2(DCSS)+'@page{size:A4;margin:0}@media print{.nd .pbn{display:none}.nd .npg{min-height:296mm}}';
function irHTML(d){const sc=PROF().s;
 return`<div class="npg"><div class="nwm"><img src="${LOGO}" alt=""></div>
 <div class="ndh"><img src="${LOGO}" alt="${esc(sc)}"><div class="ndt"><div class="nsc">${esc(sc)}</div><h1>${esc(d.title)}</h1><div class="nsb">التربية الخاصة والنطق</div></div>
 <div class="ndm">${d.meta.map(([k,v])=>k?`<div><b>${esc(k)}:</b> ${esc(v)}</div>`:`<div><b>${esc(v)}</b></div>`).join('')}</div></div>
 ${d.goal?`<div class="ngl">🎯 الهدف: ${esc(d.goal)}</div>`:''}
 <div class="nbd">${d.blocks.map(blockH).join('')}</div>
 <div class="nft"><div class="sg"><b>مدير المدارس</b><span>أ/ ${esc(PROF().m1)}</span><i>التوقيع: ....................</i></div><div class="sg"><b>مديرة التربية الخاصة</b><span>أ/ ${esc(PROF().m2)}</span><i>التوقيع: ....................</i></div><div class="sd">${dG(d.date)}م</div></div></div>`}
const docPage=(t,h)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t)}</title><style>html,body{margin:0;background:#e9e9e9}${DS}@media print{html,body{background:#fff}}</style></head><body class="nd"><div class="pbn"><button onclick="print()">طباعة / حفظ PDF</button></div>${h}<script>(function(){var p=document.querySelector('.npg'),f=function(){p.style.zoom=Math.min(1,innerWidth/794)};f();addEventListener('resize',f);addEventListener('beforeprint',function(){p.style.zoom=1});addEventListener('afterprint',f)})()<\/script></body></html>`;
