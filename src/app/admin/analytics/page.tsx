import {useState} from 'react';
import ProjectAnalytics from '@/components/admin/ProjectAnalytics';
import VisitorAnalytics from '@/components/admin/VisitorAnalytics';
export default function AnalyticsPage(){
  const [section,setSection]=useState<'visitors'|'projects'>('visitors');
  return <div className="space-y-6"><h1 className="text-3xl font-bold">Statistiche</h1><div className="flex gap-4"><button onClick={()=>setSection('visitors')} className={section==='visitors'?'text-yellow-400':'text-gray-400'}>Visitatori</button><button onClick={()=>setSection('projects')} className={section==='projects'?'text-yellow-400':'text-gray-400'}>Progetti</button></div>{section==='visitors'?<VisitorAnalytics/>:<ProjectAnalytics/>}</div>;
}
