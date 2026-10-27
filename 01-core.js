/* ===== المرحلة 1: الأساس (حالة + تخزين + تشفير + مظهر) ===== */
const $=s=>document.querySelector(s),clone=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LS=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const LW=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const LD=k=>{try{localStorage.removeItem(k)}catch(e){}};
const b64=a=>{const u=new Uint8Array(a);let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)};
const ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const te=new TextEncoder(),td=new TextDecoder();
async function mk(pin,salt){const m=await crypto.subtle.importKey('raw',te.encode(pin),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function enc(o,k){const iv=crypto.getRandomValues(new Uint8Array(12));
 return{iv:b64(iv),d:b64(await crypto.subtle.encrypt({name:'AES-GCM',iv},k,te.encode(JSON.stringify(o))))}}
async function dec(o,k){return JSON.parse(td.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(o.iv)},k,ub(o.d))))}

const SEED={v:1,students:[
 {id:1,name:'ناصر تركي العنزي',grade:'الصف الثاني الابتدائي',dx:'تأخر لغوي واضطراب نطق'},
 {id:2,name:'ظافر عبد الله السبيعي',grade:'الصف الأول الابتدائي',dx:'صعوبات تعلم نمائية'},
 {id:3,name:'عبد الله تركي السبيعي',grade:'الصف الثالث الابتدائي',dx:'اضطراب طيف التوحد'},
 {id:4,name:'نايف نواف المطيري',grade:'الصف الثاني الابتدائي',dx:'تأخر نمائي شامل'},
 {id:5,name:'سلطان سعود القحطاني',grade:'الصف الرابع الابتدائي',dx:'فرط حركة وتشتت انتباه'}],
 iep:{1:{'لغتي':{longTermGoal:'أن ينطق الصوت (س) بشكل صحيح في بداية الكلمة ووسطها ونهايتها بنسبة إتقان ٨٠٪.',shortTermGoals:[
  {id:'g1',title:'نطق الصوت (س) ساكناً ومتحركاً بشكل منفرد',subGoals:[
   {id:'s1',title:'ينطق (سْ) ساكناً عند المحاكاة',status:'mastered'},
   {id:'s2',title:'ينطق (سَ) بوضوح',status:'mastered'},
   {id:'s3',title:'ينطق (سُ) و(سِ)',status:'prompted'}]}]}}}};

let S=null,K=null,salt=null;
async function save(){
 if(K){const o=await enc(S,K);o.s=b64(salt);LW('namaa_enc',JSON.stringify(o));LD('namaa_data')}
 else{LW('namaa_data',JSON.stringify(S));LD('namaa_enc')}}
function toggleTheme(){const d=document.documentElement;
 const cur=d.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
 const n=cur==='dark'?'light':'dark';d.dataset.theme=n;LW('namaa_theme',n)}
function toast(m){const t=document.createElement('div');t.className='ts';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}

