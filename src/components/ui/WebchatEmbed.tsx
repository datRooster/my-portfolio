import Link from '@/components/runtime/Link';
import { MessageCircle } from 'lucide-react';
export default function WebchatEmbed({fullPage=false,className=''}:{fullPage?:boolean;className?:string;title?:string;description?:string;webchatUrl?:string}) {
  if (fullPage) return <div className={`p-8 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 ${className}`}><h3 className="text-xl font-semibold mb-3">Scrivimi un messaggio</h3><p>La chat in tempo reale non è attiva. Puoi contattarmi usando il modulo in questa pagina.</p><Link href="/contact" className="inline-block text-yellow-400 mt-4">Apri il modulo contatti</Link></div>;
  return <Link href="/contact" className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-xl" aria-label="Contattami"><MessageCircle className="w-7 h-7"/></Link>;
}
