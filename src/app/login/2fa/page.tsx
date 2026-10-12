import Link from '@/components/runtime/Link';
import { apiFetch } from '@/lib/http';
import { useRouter } from '@/lib/navigation';
import { useState } from 'react';
export default function TwoFactorPage() {
  const [code,setCode]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setLoading(true);setError('');
    try { const response=await apiFetch('/api/auth/verify-2fa-simple',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})}); const data=await response.json(); if(!response.ok) throw new Error(data.message); router.push('/admin'); }
    catch(error){setError(error instanceof Error?error.message:'Errore di connessione');}finally{setLoading(false);}
  }
  return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6"><form onSubmit={submit} className="max-w-md w-full rounded-xl bg-gray-900 p-8 space-y-5"><h1 className="text-2xl font-bold">Verifica in due passaggi</h1><p className="text-gray-400">Inserisci il codice dell’app di autenticazione o un codice di recupero. Hai cinque minuti dal login.</p><label className="block">Codice<input autoFocus autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10))} required minLength={6} maxLength={10} className="mt-2 block w-full bg-gray-800 border border-gray-700 rounded p-3 font-mono"/></label>{error && <p role="alert" className="text-red-400">{error}</p>}<button disabled={loading} className="w-full bg-yellow-500 text-black rounded p-3">{loading?'Verifica...':'Accedi'}</button><Link href="/login" className="block text-gray-400">Torna al login</Link></form></div>;
}
