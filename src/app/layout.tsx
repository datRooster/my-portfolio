import Footer from '@/components/ui/Footer';
import WebchatWidget from '@/components/ui/WebchatWidget';
import './globals.css';
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <div className="min-h-screen flex flex-col antialiased"><main className="flex-1 mb-16">{children}</main><Footer/><WebchatWidget/></div>;
}
