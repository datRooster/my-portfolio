import { assetUrl } from '@/lib/http';
import type { ImgHTMLAttributes } from 'react';
type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {fill?:boolean; priority?:boolean; quality?:number; unoptimized?:boolean};
export default function Image({src='',fill,priority,quality: _quality,unoptimized: _unoptimized,style,...props}: ImageProps) {
  return <img {...props} src={assetUrl(src)} loading={priority?'eager':props.loading || 'lazy'} style={{...(fill?{position:'absolute',height:'100%',width:'100%',inset:0}:{}),...style}} />;
}
