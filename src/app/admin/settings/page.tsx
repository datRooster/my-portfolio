import { apiFetch } from '@/lib/http';
import { useState } from 'react';
export default function SettingsPage() {
  const [currentPassword,setCurrent]=useState(''); const [newPassword,setNew]=useState(''); const [confirmation,setConfirmation]=useState('');
  const [message,setMessage]=useState(''); const [saving,setSaving]=useState(false);
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setMessage('');
    if(newPassword!==confirmation) {setMessage('Le nuove password non coincidono.');return;}
    setSaving(true);
    try {
      const response=await apiFetch('/api/auth/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword,newPassword})});
      const data=await response.json(); if(!response.ok) throw new Error(data.message);
      setMessage('Password aggiornata.'); setCurrent(''); setNew(''); setConfirmation('');
    } catch(error) {setMessage(error instanceof Error?error.message:'Errore di connessione');} finally{setSaving(false);}
  }
  return <div className="max-w-xl space-y-6"><h1 className="text-3xl font-bold">Impostazioni account</h1><form onSubmit={submit} className="space-y-4 bg-gray-800 p-6 rounded-xl"><h2 className="text-xl">Cambia password</h2>{[[currentPassword,setCurrent,'Password attuale','current-password'],[newPassword,setNew,'Nuova password','new-password'],[confirmation,setConfirmation,'Conferma password','new-password']].map(([value,set,label,autocomplete],i)=><label key={i} className="block">{label as string}<input type="password" required minLength={i?12:1} autoComplete={autocomplete as string} value={value as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} className="block w-full p-3 mt-1 rounded bg-gray-900 border border-gray-700"/></label>)}<button disabled={saving} className="px-5 py-3 bg-yellow-500 text-black rounded">{saving?'Salvataggio...':'Aggiorna password'}</button><p role="status">{message}</p></form></div>;
}
