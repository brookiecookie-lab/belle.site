import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE=(process.env.BASE_URL||'').replace(/\/$/,'');
if(!BASE) throw new Error('BASE_URL required');
const OUT=process.env.OUT_DIR||'browser-acceptance-r020';
const results=[],failures=[];
const note=(name,ok,detail='')=>{results.push({name,ok,detail});if(!ok)failures.push(`${name}: ${detail}`);console.log(`${ok?'PASS':'FAIL'} ${name}${detail?` — ${detail}`:''}`)};
const assert=(name,c,d='')=>note(name,Boolean(c),d);
async function raw(path,status=200){const r=await fetch(BASE+path,{redirect:'manual'});const text=await r.text();assert(`HTTP ${path}`,r.status===status,`status=${r.status}, expected=${status}`);return {r,text};}
function json(text){try{return JSON.parse(text)}catch{return {}}}
function canonical(text,path){return text.includes(`rel="canonical" href="${BASE}${path}"`)}
fs.mkdirSync(`${OUT}/screenshots`,{recursive:true});

const health=await raw('/health');const h=json(health.text);
assert('release version',h.version==='20-r2-intelligence-discovery-editorial',`version=${h.version}`);
assert('R2 base preserved',h.base_asset==='publicsite-release-010r2-module',`base=${h.base_asset}`);
assert('R2 graph counts',String(h.books)==='10'&&String(h.recommendation_edges)==='25'&&String(h.world_routes)==='39',JSON.stringify({books:h.books,edges:h.recommendation_edges,routes:h.world_routes}));
assert('color/bag correction enabled',h.color_bag_correction===true,JSON.stringify(h));
assert('Owens discovery enabled',h.owens_discovery===true,JSON.stringify(h));
assert('article assets 5/5',Number(h.article_assets_ready)===5&&Number(h.article_assets_expected)===5,JSON.stringify({ready:h.article_assets_ready,expected:h.article_assets_expected}));
assert('health release header',health.r.headers.get('x-release')==='20-r2-intelligence-discovery-editorial',health.r.headers.get('x-release')||'');

const books=await raw('/api/books');const bj=json(books.text);
assert('Books API 10',Array.isArray(bj.books)&&bj.books.length===10,`count=${bj.books?.length}`);
assert('Books shelves 6',Array.isArray(bj.shelves)&&bj.shelves.length===6,`count=${bj.shelves?.length}`);
const dolly=await raw('/api/books/behind-the-seams-dolly-parton');const dj=json(dolly.text);
assert('Dolly archetypes 4+',Array.isArray(dj.worlds)&&dj.worlds.length>=4,`count=${dj.worlds?.length}`);
const rom=await raw('/api/worlds/romantasy-commerce');const rj=json(rom.text);
const love=Array.isArray(rj.books)?rj.books.find(x=>x.canonical_slug==='the-love-hypothesis'):null;
assert('NOT_ROMANTASY preserved',love?.explicit_exclusion==='NOT_ROMANTASY',`explicit_exclusion=${love?.explicit_exclusion}`);

const core=[
 ['/journal/the-intellectual-woman','Intellectual Woman'],
 ['/fashion/hailey-bieber-outfit-was-the-message','Hailey Bieber'],
 ['/books/behind-the-seams-dolly-parton','Behind the Seams'],
 ['/robots.txt','Sitemap:']
];
for(const [p,s] of core){const x=await raw(p);assert(`${p} content`,x.text.includes(s),s);assert(`${p} release header`,x.r.headers.get('x-release')==='20-r2-intelligence-discovery-editorial',x.r.headers.get('x-release')||'');}

const staticPages=[
 ['/tools/the-useful-palette','The Useful Palette','COLOR PAIRING UTILITY'],
 ['/fashion/fall-color-intelligence','Fall Color Intelligence','EDITORIAL + COMMERCE INTELLIGENCE'],
 ['/fashion/the-first-fall-bag','The First Fall Bag','A handbag decision engine'],
 ['/fashion/personality-bags','Personality Bags','one family within it'],
 ['/fashion/feminine-american-pragmatism','Feminine American Pragmatism','beauty + utility + personality + collection'],
 ['/worlds','Worlds','Tools are separate from Worlds'],
 ['/shop','Shop','Commerce truth:']
];
for(const [p,title,needle] of staticPages){const x=await raw(p);assert(`${p} title`,x.text.includes(title),title);assert(`${p} content`,x.text.includes(needle),needle);assert(`${p} canonical`,canonical(x.text,p));assert(`${p} release header`,x.r.headers.get('x-release')==='20-r2-intelligence-discovery-editorial',x.r.headers.get('x-release')||'');}
const oldPalette=await raw('/worlds/the-useful-palette',301);assert('Useful Palette moved out of Worlds',oldPalette.r.headers.get('location')===`${BASE}/tools/the-useful-palette`,oldPalette.r.headers.get('location')||'');
const oldBrown=await raw('/worlds/brown-is-the-new-neutral',301);assert('Brown legacy now routes to color intelligence',oldBrown.r.headers.get('location')===`${BASE}/fashion/fall-color-intelligence`,oldBrown.r.headers.get('location')||'');

const discovery=[
 ['/fashion/which-owens-woman-are-you-dressing-like-this-fall','Which Owens Woman Are You Dressing Like This Fall?','A lane is a door, not a diagnosis'],
 ['/worlds/a-certain-kind-of-magic','A Certain Kind of Magic','Four women. Four ways into the story.'],
 ['/worlds/a-certain-kind-of-magic/sally','Sally Owens','Competence with an inner life.'],
 ['/worlds/a-certain-kind-of-magic/gillian','Gillian Owens','Beautiful trouble.'],
 ['/worlds/a-certain-kind-of-magic/kylie','Kylie Owens','Love before cynicism.'],
 ['/worlds/a-certain-kind-of-magic/antonia','Antonia Owens','Science meets inheritance.'],
 ['/worlds/a-certain-kind-of-magic/shop','Shop A Certain Kind of Magic','Owens World > sequel merch'],
 ['/worlds/a-certain-kind-of-magic/autumn-after-dark','Autumn After Dark','without turning the world into a costume shop']
];
for(const [p,title,needle] of discovery){const x=await raw(p);assert(`${p} title`,x.text.includes(title),title);assert(`${p} content`,x.text.includes(needle),needle);assert(`${p} canonical`,canonical(x.text,p));}

const articles=[
 ['/fashion/sally-owens-is-not-witchcore','Sally Owens Is Not Witchcore','The Case for the Competent Romantic'],
 ['/fashion/gillian-owens-and-the-return-of-grown-woman-glamour','Gillian Owens and the Return of Grown-Woman Glamour','Beautiful Trouble Without the Costume'],
 ['/fashion/kylie-owens-romantic-dressing-without-turning-her-into-a-coquette','Kylie Owens: Romantic Dressing Without Turning Her Into a Coquette','Love Before Cynicism'],
 ['/fashion/antonia-owens-when-modern-prep-meets-the-magical-inheritance','Antonia Owens: When Modern Prep Meets the Magical Inheritance','Science Meets Inheritance'],
 ['/journal/when-the-luxury-object-is-the-reading-life','When the Luxury Object Is the Reading Life','The granary of the spirit']
];
for(const [p,title,needle] of articles){const x=await raw(p);assert(`${p} title`,x.text.includes(title),title);assert(`${p} long-read`,x.text.includes(needle),needle);assert(`${p} canonical`,canonical(x.text,p));assert(`${p} article schema`,x.text.includes('"@type":"Article"'),'Article schema');}

const home=await raw('/');
assert('home Owens promo',home.text.includes('ackm-discovery-20')&&home.text.includes('Four women. Four ways into the story.'),'Owens promo');
assert('home Reading Life promo',home.text.includes('reading-life-20')&&home.text.includes('aspirational object is the reading life'),'Reading Life promo');
const sitemap=await raw('/sitemap.xml');
const expectedSitemap=[
 '/tools/the-useful-palette','/fashion/fall-color-intelligence','/fashion/the-first-fall-bag','/fashion/personality-bags','/fashion/feminine-american-pragmatism',
 '/fashion/which-owens-woman-are-you-dressing-like-this-fall','/worlds/a-certain-kind-of-magic','/worlds/a-certain-kind-of-magic/sally','/worlds/a-certain-kind-of-magic/gillian','/worlds/a-certain-kind-of-magic/kylie','/worlds/a-certain-kind-of-magic/antonia','/worlds/a-certain-kind-of-magic/shop','/worlds/a-certain-kind-of-magic/autumn-after-dark',
 ...articles.map(x=>x[0]),'/books/behind-the-seams-dolly-parton'
];
for(const p of expectedSitemap)assert(`sitemap ${p}`,sitemap.text.includes(`${BASE}${p}`),p);
assert('sitemap still excludes Cardi',!sitemap.text.includes('/fashion/cardi-holding-court'));
const feed=await raw('/feed.xml');
for(const [p,title] of articles){assert(`feed ${p}`,feed.text.includes(`${BASE}${p}`)&&feed.text.includes(title),title);}

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const errs=[];
page.on('pageerror',e=>errs.push(`pageerror:${e.message}`));
page.on('console',m=>{if(m.type()==='error')errs.push(`console:${m.text()}`)});
async function visual(name,p,needle){const resp=await page.goto(BASE+p,{waitUntil:'networkidle',timeout:45000});assert(`Chromium ${p} status`,resp?.status()===200,`status=${resp?.status()}`);const body=(await page.locator('body').innerText()).trim();assert(`Chromium ${p} body`,body.includes(needle),`needle=${needle}; chars=${body.length}`);await page.screenshot({path:`${OUT}/screenshots/${name}.png`,fullPage:true});}
await visual('chooser','/fashion/which-owens-woman-are-you-dressing-like-this-fall','A lane is a door, not a diagnosis');
const sally=page.locator('a[href="/worlds/a-certain-kind-of-magic/sally"]').first();assert('Chooser Sally link visible',await sally.count()>0);if(await sally.count()){await Promise.all([page.waitForURL('**/worlds/a-certain-kind-of-magic/sally'),sally.click()]);assert('Chooser → Sally navigation',page.url()===`${BASE}/worlds/a-certain-kind-of-magic/sally`,page.url());}
const longRead=page.locator('a[href="/fashion/sally-owens-is-not-witchcore"]').first();assert('Sally long-read link visible',await longRead.count()>0);if(await longRead.count()){await Promise.all([page.waitForURL('**/fashion/sally-owens-is-not-witchcore'),longRead.click()]);assert('Sally → long-read navigation',page.url()===`${BASE}/fashion/sally-owens-is-not-witchcore`,page.url());assert('Sally article survives page load',(await page.locator('body').innerText()).includes('The Case for the Competent Romantic'));}
await visual('palette','/tools/the-useful-palette','COLOR PAIRING UTILITY');
assert('Palette survives legacy SPA',!(await page.locator('body').innerText()).includes('That page does not exist'));
await visual('first-fall-bag','/fashion/the-first-fall-bag','A handbag decision engine');
await visual('brunello','/journal/when-the-luxury-object-is-the-reading-life','The granary of the spirit');
await visual('dolly','/books/behind-the-seams-dolly-parton','Behind the Seams');
await visual('intellectual-woman','/journal/the-intellectual-woman','Intellectual Woman');
await page.goto(BASE+'/',{waitUntil:'networkidle',timeout:45000});
assert('Chromium home Owens promo',(await page.locator('body').innerText()).includes('Four women. Four ways into the story.'));
assert('Chromium home Reading Life promo',(await page.locator('body').innerText()).includes('aspirational object is the reading life'));
assert('Chromium uncaught errors',errs.length===0,errs.join(' | ')||'none');
await browser.close();

const summary={base_url:BASE,release:'20-r2-intelligence-discovery-editorial',executed_at:new Date().toISOString(),passed:failures.length===0,assertion_count:results.length,failure_count:failures.length,failures,results,browser_errors:errs};
fs.writeFileSync(`${OUT}/acceptance-report.json`,JSON.stringify(summary,null,2));
fs.writeFileSync(`${OUT}/acceptance-report.txt`,[`R020 Browser Acceptance: ${summary.passed?'PASS':'FAIL'}`,`URL: ${BASE}`,`Assertions: ${summary.assertion_count}`,`Failures: ${summary.failure_count}`,`Browser errors: ${errs.length}`,...results.map(x=>`${x.ok?'PASS':'FAIL'} | ${x.name}${x.detail?` | ${x.detail}`:''}`)].join('\n')+'\n');
console.log(`R020_SUMMARY ${JSON.stringify({assertions:summary.assertion_count,failures:summary.failure_count,browser_errors:errs.length,passed:summary.passed})}`);
if(failures.length)process.exit(1);
