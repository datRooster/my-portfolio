import {readdir,unlink} from 'node:fs/promises';
import path from 'node:path';
const assets=path.resolve('dist/assets');
if(path.dirname(assets)!==path.resolve('dist'))throw new Error('Invalid assets path');
// Remove only generated files. Never delete backend storage or local configuration.
for(const entry of await readdir(assets,{withFileTypes:true}).catch(()=>[])){
  const target=path.resolve(assets,entry.name);
  if(entry.isFile() && path.dirname(target)===assets)await unlink(target);
}
