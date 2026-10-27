/* ===== الإقلاع ===== */
(function(){const th=LS('namaa_theme');{const f=LS('namaa_fs');if(f)document.documentElement.dataset.fs=f}if(th)document.documentElement.dataset.theme=th;
 if(LS('namaa_enc'))return auth('lock');
 const d=LS('namaa_data');
 if(d){try{S=JSON.parse(d);return shell()}catch(e){}}
 auth('setup')})();
