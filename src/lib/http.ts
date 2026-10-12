import { useEffect,useState } from 'react';
export const basePath = new URL(document.querySelector('base')?.href || `${location.origin}/`).pathname.replace(/\/$/, '');
export function assetUrl(value: string): string {
  return value.startsWith('/') && !value.startsWith('//') && !(basePath && value.startsWith(`${basePath}/`)) ? `${basePath}${value}` : value;
}
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  if (typeof input !== 'string' || !input.startsWith('/api/')) return window.fetch(input, init);
  const headers = new Headers(init.headers);
  headers.set('X-Requested-With', 'Portfolio');
  const response=await window.fetch(assetUrl(input), { ...init, headers, credentials: 'same-origin' });
  // Consume small JSON responses even when callers only inspect status (logout/auth checks).
  // This also releases HTTP connections on shared Apache/PHP hosting.
  if (!response.headers.get('Content-Type')?.includes('application/json')) return response;
  const text=await response.text();
  return new Response(text,{status:response.status,statusText:response.statusText,headers:response.headers});
}
export function useApi<T>(url: string) {
  const [state, setState] = useState<{data: T | null; loading: boolean; error: string | null}>({data:null,loading:true,error:null});
  useEffect(() => {
    const controller = new AbortController();
    setState({data:null,loading:true,error:null});
    apiFetch(url, {signal:controller.signal}).then(async response => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Impossibile caricare i dati');
      setState({data:body,loading:false,error:null});
    }).catch(error => {
      if (error.name !== 'AbortError') setState({data:null,loading:false,error:error.message});
    });
    return () => controller.abort();
  }, [url]);
  return state;
}
