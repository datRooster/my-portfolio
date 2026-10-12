import Link from '@/components/runtime/Link';
import { useApi } from '@/lib/http';
export default function SecurityPage() {
  const {data,error}=useApi<{user:{email:string;twoFactorEnabled:boolean;lastLogin:string}}>('/api/auth/check');
  return <div className="space-y-6"><h1 className="text-3xl font-bold">Sicurezza account</h1>{error && <p role="alert">{error}</p>}{data && <div className="p-6 rounded-xl bg-gray-800 space-y-3"><p>Account: {data.user.email}</p><p>Verifica in due passaggi: {data.user.twoFactorEnabled?'attiva':'non attiva'}</p><p>Ultimo accesso: {data.user.lastLogin ? new Date(data.user.lastLogin).toLocaleString('it-IT') : 'Primo accesso'}</p><p>Le sessioni scadono dopo un’ora. I tentativi di accesso ripetuti vengono limitati.</p>{!data.user.twoFactorEnabled && <Link className="text-yellow-400 block" href="/login/setup-2fa">Configura la verifica in due passaggi</Link>}<Link className="text-yellow-400 block" href="/admin/settings">Cambia password</Link></div>}</div>;
}
