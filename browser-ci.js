const assert=require('assert');
const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;

async function assertA11y(page,label){
  const results=await new AxeBuilder({page})
    .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'])
    .analyze();
  assert.strictEqual(
    results.violations.length,
    0,
    `${label} accessibility violations: ${JSON.stringify(results.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>n.target)})),null,2)}`
  );
}

(async()=>{
  const browser=await chromium.launch({headless:true});
  const desktopContext=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await desktopContext.newPage();
  const base=process.env.BASE_URL || 'http://127.0.0.1:4173';
  await page.goto(`${base}/identity-signal/`,{waitUntil:'networkidle'});
  assert.strictEqual(await page.title(),'Identity Signal — dentityOS™');
  await assertA11y(page,'landing');

  await page.getByRole('button',{name:'Begin the signal'}).click();
  assert(await page.locator('#question-title').evaluate(e=>document.activeElement===e));
  assert.strictEqual(await page.locator('#progress-track').getAttribute('aria-valuenow'),'1');
  await assertA11y(page,'question');

  await page.getByRole('button',{name:'Authority'}).click();
  await page.getByRole('button',{name:'Warmth'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
  assert(await page.locator('#question-title').evaluate(e=>document.activeElement===e));

  await page.getByRole('button',{name:'Too severe'}).click();
  await page.getByRole('button',{name:'Too performative'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'Strong + approachable'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'Public presence / communication'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
  await page.getByRole('button',{name:'The one with better quality'}).click();

  const back=page.getByRole('button',{name:'Back'});
  await back.focus();
  await page.keyboard.press('Enter');
  assert.strictEqual(await page.getByRole('button',{name:'Public presence / communication'}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Continue'}).click();
  assert.strictEqual(await page.getByRole('button',{name:'The one with better quality'}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Show my signal'}).click();

  assert.strictEqual(await page.locator('#result-heading').innerText(),'Open Authority');
  assert.strictEqual((await page.locator('#strength-label').innerText()).trim().toLowerCase(),'strong signal');
  assert.strictEqual((await page.locator('#focus-label').innerText()).trim().toLowerCase(),'presence');
  assert((await page.locator('#focus-copy').innerText()).toLowerCase().includes('clear'));
  assert(await page.locator('#result-heading').evaluate(e=>document.activeElement===e));
  await assertA11y(page,'result');

  await page.getByRole('button',{name:'Partly'}).click();
  await page.getByRole('button',{name:'Missed an important contradiction'}).click();
  assert((await page.locator('#feedback-status').innerText()).includes('Correction noted'));

  await page.getByRole('button',{name:'Save on this device'}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('identitySignalV1')));
  assert(saved && saved.result && saved.result.name==='Open Authority');
  assert(!('inputs' in saved.result) && !('reasoning' in saved.result));
  assert((await page.locator('#save-status').innerText()).includes('Raw answers and internal reasoning were not saved'));
  await page.getByRole('button',{name:'Delete saved result'}).click();
  assert.strictEqual(await page.evaluate(()=>localStorage.getItem('identitySignalV1')),null);

  const mailto=await page.locator('#email-result').getAttribute('href');
  assert(mailto.startsWith('mailto:'));
  assert.strictEqual(await page.getByRole('link',{name:'Explore World Prescription'}).getAttribute('href'),'/shop/world-prescription/');
  assert.strictEqual(await page.getByRole('link',{name:'Keep exploring in the Journal'}).getAttribute('href'),'/journal/');

  const body=(await page.locator('body').innerText()).toLowerCase();
  for(const phrase of ['your true identity is','you are definitely','your nervous system needs','because of your trauma']) assert(!body.includes(phrase));

  const journal=await desktopContext.newPage();
  assert((await journal.goto(`${base}/journal/`)).ok());
  assert((await journal.locator('body').innerText()).includes('Ideas before prescriptions.'));
  const world=await desktopContext.newPage();
  assert((await world.goto(`${base}/shop/world-prescription/`)).ok());
  assert((await world.locator('body').innerText()).includes('From one signal to a usable system.'));

  const mobileContext=await browser.newContext({viewport:{width:390,height:844}});
  const mobile=await mobileContext.newPage();
  await mobile.goto(`${base}/identity-signal/`,{waitUntil:'networkidle'});
  assert.strictEqual(await mobile.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),false);

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();
  console.log(`Browser CI passed against ${base}: full flow, native keyboard back, focus orientation, WCAG axe scans, adaptive result, correction, origin-backed save/delete, bridge routes, overclaim scan, and mobile overflow.`);
})().catch(err=>{console.error(err);process.exit(1)});
