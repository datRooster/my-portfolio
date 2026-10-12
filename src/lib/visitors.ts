import { useSyncExternalStore } from 'react';
import { apiFetch } from './http';
interface Stats {totalVisitors:number;currentOnline:number;todayVisitors:number}
let snapshot:Stats|null=null;
const listeners=new Set<()=>void>();
let timer:ReturnType<typeof setInterval>|undefined;
let queue=Promise.resolve();
async function refresh(){
  try{const r=await apiFetch('/api/visitors/stats');if(r.ok){snapshot=await r.json();listeners.forEach(notify=>notify());}}catch{/* Statistics must not block navigation. */}
}
export function recordPage(page:string){
  queue=queue.then(async()=>{
    try{const response=await apiFetch('/api/visitors/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page,referrer:document.referrer})});await response.text();await refresh();}catch{/* Keep the page usable offline. */}
  });
}
function subscribe(notify:()=>void){listeners.add(notify);if(!timer)timer=setInterval(refresh,30000);return()=>{listeners.delete(notify);if(!listeners.size){clearInterval(timer);timer=undefined;}};}
export function useVisitorStats(){return useSyncExternalStore(subscribe,()=>snapshot);}
