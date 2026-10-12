import type { AnchorHTMLAttributes } from 'react';
import { Link as RouterLink } from 'react-router-dom';
export default function Link({href, ...props}: AnchorHTMLAttributes<HTMLAnchorElement> & {href:string}) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return <a href={href} {...props} />;
  return <RouterLink to={href} {...props} />;
}
