import { useMemo } from 'react';
import { useLocation,useNavigate,useSearchParams as useRouterSearchParams } from 'react-router-dom';
export { useParams } from 'react-router-dom';
export function usePathname() { return useLocation().pathname; }
export function useSearchParams() { return useRouterSearchParams()[0]; }
export function useRouter() {
  const navigate = useNavigate();
  return useMemo(() => ({push:(path:string)=>navigate(path),replace:(path:string)=>navigate(path,{replace:true}),back:()=>navigate(-1),refresh:()=>window.location.reload()}), [navigate]);
}
