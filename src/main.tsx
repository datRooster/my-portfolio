import { lazy,Suspense,useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter,Navigate,Route,Routes,useLocation } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import RootLayout from './app/layout';
import { basePath } from './lib/http';
import { recordPage } from './lib/visitors';

const pages = import.meta.glob<{default:React.ComponentType}>('./app/**/page.tsx');
const routes = Object.entries(pages).map(([file, loader]) => ({
  path: file.replace('./app','').replace('/page.tsx','').replace(/\[([^\]]+)\]/g, ':$1') || '/',
  Component: lazy(loader),
}));
function App() {
  const {pathname} = useLocation();
  useEffect(() => { window.scrollTo(0, 0); recordPage(pathname); }, [pathname]);
  return <RootLayout><Suspense fallback={<p className="p-12 text-gray-400">Caricamento...</p>}><Routes>
    {routes.map(({path,Component}) => <Route key={path} path={path} element={path.startsWith('/admin') ? <AdminLayout><Component/></AdminLayout> : <Component/>}/>)}
    <Route path="/bugbounty/*" element={<Navigate to="/bug-bounty" replace/>}/>
    <Route path="*" element={<div className="p-12 text-gray-400"><h1>Pagina non trovata</h1><a href={`${basePath}/`}>Torna alla home</a></div>}/>
  </Routes></Suspense></RootLayout>;
}
createRoot(document.getElementById('root')!).render(<BrowserRouter basename={basePath || '/'}><App/></BrowserRouter>);
