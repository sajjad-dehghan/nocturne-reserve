import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/fonts/licenses',{recursive:true});
await Promise.all(['anton','inter','librecaslondisplay','cormorant'].map(async name=>{
 const response=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`);
 if(!response.ok)throw new Error(`${name}: ${response.status}`);
 await writeFile(`public/fonts/licenses/${name}-OFL.txt`,await response.text());
 console.log(`Saved ${name} font license.`);
}));
