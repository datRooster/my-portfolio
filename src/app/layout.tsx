import WebchatWidget from '@/components/ui/WebchatWidget';
import NoirFooter from '@/components/home/NoirFooter';
import { usePathname } from '@/lib/navigation';
import './globals.css';
import '@/components/home/noir.css';
import '@/components/home/noir-site.css';
export default function RootLayout({children}:{children:React.ReactNode}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = pathname.startsWith('/login');
  return <div className={`noir-site noir-layout min-h-screen flex flex-col antialiased ${isAdmin ? 'noir-admin' : isAuth ? 'noir-auth' : 'noir-public'}`}><main className="flex-1">{children}</main>{!isAdmin && <NoirFooter/>}<WebchatWidget/></div>;
}
