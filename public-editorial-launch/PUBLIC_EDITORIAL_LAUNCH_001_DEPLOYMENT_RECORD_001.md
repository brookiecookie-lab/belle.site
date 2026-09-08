# PUBLIC EDITORIAL LAUNCH 001 — DEPLOYMENT RECORD

**Record ID:** `PUBLIC-EDITORIAL-LAUNCH-001-DEPLOYMENT-RECORD-001`  
**Date:** 2026-09-08  
**Purpose:** Public customer-facing Editorial + Digital Products launch surface  
**Parent identity:** Unnamed/configurable; `Glamoratti` remains a World/Archetype, not the parent brand.

## Release state

- **Public surface masthead:** `THE JOURNAL`
- **Hosting/runtime:** Neon Function `publicsite`
- **Neon project:** `red-band-42667338`
- **Branch:** `br-shy-snow-ay9puvn1`
- **Database:** `neondb`
- **Invocation URL:** `https://br-shy-snow-ay9puvn1-publicsite.compute.c-5.us-east-2.aws.neon.tech/`
- **Active deployment:** `2`
- **Deployment state:** `COMPLETED / ACTIVE`
- **Runtime:** `nodejs24`
- **Deployment created at:** `2026-09-08T20:14:42.261718Z`

## Exact-byte bindings

| Object | Bytes | SHA-256 |
|---|---:|---|
| Self-contained public site HTML (`deploy-bundle.html`) | 18,263 | `ff7592af0bf288f26251f4c189637c24d66aac47218a14f8dfbf33625e073958` |
| Neon function source v2 (`index.mjs`) | 30,652 | `77a065d98a9ec14e54df0fb9f0aaa312dc94aa17c795e48a45b9889834e31397` |
| Neon deployment ZIP v2 (`publicsite-v2.zip`) | 12,679 | `8ee41a8671446f4dc0c41e33700cd5da9452f2dfc96b8fe3ecdd167f77bc6132` |

## GitHub lineage

Repository: `brookiecookie-lab/belle.site`  
Launch branch: `public-editorial-launch-001`  
Existing Pretty Little Steals `main` was **not overwritten**.

Launch commits:
- shell: `7d5d8f13c81d6e62b4f67a0dad506b5883c1ec89`
- styles: `04bea9638a4bea73a5319ec0ea345ace18fca740`
- core content: `c956953c287b0346f13650268d9ad589269dac24`
- article/product content: `d70794959d797af9ce64ba9cdf3fc4a7b8e31d52`
- behavior/forms: `86aad02d7fe0d98a9c3f0b5b0be84717ee75e271`
- self-contained deployment bundle: `9d61807460a2958d23654c1a26075a214fda9427`

## Customer-facing launch scope

### Editorial
- Journal homepage
- `The Intellectual Woman`
- `Pretty, But All True`
- `How Worlds Work`

### Available request/reserve services
- Personalized World Prescription — **$49**
- Mini Edit — **from $29**

### Not represented as currently purchasable
- The Marginalia Society No. 001 — **WAITLIST**
- Curiosity Archive / Intellectual Ledger — **COMING SOON / WAITLIST**
- Physical Fashion / Beauty / Objects — **CURATION IN PROGRESS**

### Payment state
- Stripe is **not** in the launch critical path.
- No payment is processed on this launch site.
- Available services use truthful `REQUEST / RESERVE` intake.
- Payment can be attached later through an account/method the operator can actually access.

## Intake backend

Dedicated isolated schema: `public_site`  
Table: `public_site.submission`

Allowed submission types:
- `WORLD_PRESCRIPTION`
- `MINI_EDIT`
- `NEWSLETTER`
- `WAITLIST`

The public intake lane is isolated from Decision Board / canonical personalization truth objects.

## Acceptance evidence

1. **Static bundle validation:** PASS
   - JavaScript syntax check passed.
   - Required launch strings and routes are embedded in source.
2. **Exact deployed handler local acceptance:** PASS
   - `GET /` → `200`, `text/html; charset=utf-8`
   - homepage response includes `THE JOURNAL`, `Personalized World Prescription`, `Mini Edit`, `Marginalia Society`, and no-payment disclosure
   - `GET /health` → `200`, JSON `{ok:true, service:"public-site", version:"2", site:true, intake:true}`
   - malformed intake email → `400` with `valid email required`
3. **Neon deployment metadata:** PASS
   - deployment 2 = `COMPLETED`
   - active deployment = 2
4. **Neon platform invocation log:** PASS
   - `invoke begin` → `invoke end` at `2026-09-08T20:14:42Z`
   - no `ERROR` log entries returned for `neon-function/publicsite` in the checked one-hour window
5. **Independent external HTTP/browser probe from this ChatGPT runtime:** NOT COMPLETED
   - web safe-open rejected direct Neon URL opening
   - container DNS returned temporary name-resolution failure
   - this limitation is in the assistant runtime and is not represented as an application failure

## Truthful disposition

`SOURCE = FROZEN`  
`DEPLOYMENT 2 = ACTIVE / COMPLETED`  
`PLATFORM INVOCATION = PASS`  
`LOCAL HANDLER ACCEPTANCE = PASS`  
`PUBLIC REQUEST/RESERVE ARCHITECTURE = DEPLOYED`  
`STRIPE CHECKOUT = DEFERRED / NOT REQUIRED FOR LAUNCH`  
`EXTERNAL BROWSER ACCEPTANCE FROM THIS RUNTIME = OPEN`

No claim is made that external browser acceptance was personally observed by this runtime.
