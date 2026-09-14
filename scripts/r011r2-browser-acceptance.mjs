import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE=(process.env.BASE_URL||'').replace(/\/$/,'');
if(!BASE) throw new Error('BASE_URL required');
const results=[], failures=[];
const note=(name,ok,detail='')=>{results.push({name,ok,detail});if(!ok)failures.push(`${name}: ${detail}`);console.log(`${ok?'PASS':'FAIL'} ${name}${detail?` — ${detail}`:''}`)};
const assert=(name,c,d='')=>note(name,Boolean(c),d);
async function raw(path,status=200){const r=await fetch(BASE+path,{redirect:'manual'});const text=await r.text();assert(`HTTP ${path}`,r.status===status,`status=${r.status}, expected=${status}`);return {r,text};}
fs.mkdirSync('browser-acceptance-r011r2/screenshots',{recursive:true});

const health=await raw('/health'); let h={}; try{h=JSON.parse(health.text)}catch{}
assert('release version',h.version==='11r2-merchandising-on-r2',`version=${h.version}`);
assert('R2 graph counts',String(h.books)==='10'&&String(h.recommendation_edges)==='25'&&String(h.world_routes)==='39',JSON.stringify(h));
assert('merchandising wrapper active',h.merchandising===true&&h.merchandising_base==='publicsite-release-010r2-module',JSON.stringify(h));

const books=await raw('/api/books'); let bj={}; try{bj=JSON.parse(books.text)}catch{}
assert('Books API 10',Array.isArray(bj.books)&&bj.books.length===10,`count=${bj.books?.length}`);
assert('Books shelves 6',Array.isArray(bj.shelves)&&bj.shelves.length===6,`count=${bj.shelves?.length}`);
const dolly=await raw('/api/books/behind-the-seams-dolly-parton'); let dj={}; try{dj=JSON.parse(dolly.text)}catch{}
assert('Dolly archetypes 4+',Array.isArray(dj.worlds)&&dj.worlds.length>=4,`count=${dj.worlds?.length}`);
const rom=await raw('/api/worlds/romantasy-commerce'); let rj={}; try{rj=JSON.parse(rom.text)}catch{}
const love=Array.isArray(rj.books)?rj.books.find(x=>x.canonical_slug==='the-love-hypothesis'):null;
assert('NOT_ROMANTASY preserved',love?.explicit_exclusion==='NOT_ROMANTASY',`explicit_exclusion=${love?.explicit_exclusion}`);

const core=[
 ['/journal/the-intellectual-woman','Intellectual Woman'],
 ['/fashion/hailey-bieber-outfit-was-the-message','Hailey Bieber'],
 ['/books/behind-the-seams-dolly-parton','Behind the Seams'],
 ['/feed.xml','Intellectual Woman'],
 ['/robots.txt','Sitemap:']
];
for(const [p,s] of core){const x=await raw(p);assert(`${p} content`,x.text.includes(s));}

const merch=[
 ['/worlds/a-certain-kind-of-magic','A Certain Kind of Magic'],
 ['/worlds/a-certain-kind-of-magic/sally','Sally Owens'],
 ['/worlds/a-certain-kind-of-magic/gillian','Gillian Owens'],
 ['/worlds/a-certain-kind-of-magic/kylie','Kylie Owens'],
 ['/worlds/a-certain-kind-of-magic/antonia','Antonia Owens'],
 ['/worlds/the-useful-palette','The Useful Palette'],
 ['/fashion/feminine-american-pragmatism','Feminine American Pragmatism'],
 ['/fashion/personality-bags','Personality Bags'],
 ['/worlds','A Certain Kind of Magic'],
 ['/shop','Commerce truth:']
];
for(const [p,s] of merch){const x=await raw(p);assert(`${p} content`,x.text.includes(s));assert(`${p} canonical`,x.text.includes(`rel="canonical" href="${BASE}${p}"`));}
const old=await raw('/worlds/brown-is-the-new-neutral',301);assert('brown legacy redirect',old.r.headers.get('location')===`${BASE}/worlds/the-useful-palette`,old.r.headers.get('location')||'');
const sitemap=await raw('/sitemap.xml');
for(const p of ['/worlds/a-certain-kind-of-magic','/worlds/the-useful-palette','/fashion/feminine-american-pragmatism','/fashion/personality-bags','/books/behind-the-seams-dolly-parton']) assert(`sitemap ${p}`,sitemap.text.includes(`${BASE}${p}`));
assert('sitemap still excludes Cardi',!sitemap.text.includes('/fashion/cardi-holding-court'));

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(); const errs=[];
page.on('pageerror',e=>errs.push(`pageerror:${e.message}`));
page.on('console',m=>{if(m.type()==='error')errs.push(`console:${m.text()}`)});
const visual=[['magic','/worlds/a-certain-kind-of-magic'],['palette','/worlds/the-useful-palette'],['bags','/fashion/personality-bags'],['books','/books/behind-the-seams-dolly-parton'],['journal','/journal/the-intellectual-woman']];
for(const [name,p] of visual){const resp=await page.goto(BASE+p,{waitUntil:'networkidle',timeout:45000});assert(`Chromium ${p} status`,resp?.status()===200,`status=${resp?.status()}`);const body=(await page.locator('body').innerText()).trim();assert(`Chromium ${p} body`,body.length>100,`chars=${body.length}`);await page.screenshot({path:`browser-acceptance-r011r2/screenshots/${name}.png`,fullPage:true});}
await page.goto(BASE+'/worlds/a-certain-kind-of-magic',{waitUntil:'networkidle',timeout:45000});
const sally=page.locator('a[href="/worlds/a-certain-kind-of-magic/sally"]').first();assert('Sally link visible',await sally.count()>0);if(await sally.count()){await Promise.all([page.waitForURL('**/worlds/a-certain-kind-of-magic/sally'),sally.click()]);assert('Sally navigation',page.url()===`${BASE}/worlds/a-certain-kind-of-magic/sally`,page.url());}
assert('Chromium uncaught errors',errs.length===0,errs.join(' | ')||'none'); await browser.close();

const summary={base_url:BASE,executed_at:new Date().toISOString(),passed:failures.length===0,assertion_count:results.length,failure_count:failures.length,failures,results,browser_errors:errs};
fs.writeFileSync('browser-acceptance-r011r2/acceptance-report.json',JSON.stringify(summary,null,2));
fs.writeFileSync('browser-acceptance-r011r2/acceptance-report.txt',[`R011R2 Browser Acceptance: ${summary.passed?'PASS':'FAIL'}`,`URL: ${BASE}`,`Assertions: ${summary.assertion_count}`,`Failures: ${summary.failure_count}`,...results.map(x=>`${x.ok?'PASS':'FAIL'} | ${x.name}${x.detail?` | ${x.detail}`:''}`)].join('\n')+'\n');
if(failures.length)process.exit(1);
