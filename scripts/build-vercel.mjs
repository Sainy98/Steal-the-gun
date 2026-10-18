import {cpSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
const raw=(process.env.BACKEND_URL||'').trim();
if(!raw)throw new Error('Set BACKEND_URL to your Render HTTPS URL before deploying the frontend on Vercel.');
const url=new URL(raw);
if(url.protocol!=='https:')throw new Error('BACKEND_URL must use https:// for a public deployment.');
rmSync('dist',{recursive:true,force:true});mkdirSync('dist',{recursive:true});cpSync('public','dist',{recursive:true});
writeFileSync('dist/config.js','window.BUMP_CONFIG = '+JSON.stringify({serverUrl:url.origin})+';\n');
console.log('Vercel frontend built. Multiplayer server: '+url.origin);
