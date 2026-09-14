# FRONTEND PREVIEW RELEASE 001

Date: 2026-09-14
State: FROZEN / PREVIEW DEPLOYED / PRODUCTION UNTOUCHED

## Purpose

This release is the first governed frontend reconstruction after the 2026-09-14 supersession audit.

It does **not** rebuild from the July shell, Base44, HER, EXACTLY., Glamoratti-as-company, Shopify assumptions, Marginalia Society, or other superseded material.

It uses the current September publicsite lineage as authority and provides a new visual homepage while proxying all existing non-home routes to the active production `publicsite` function.

## Preview runtime

Neon project: `red-band-42667338`
Neon branch: `br-shy-snow-ay9puvn1` (`main`)
Preview function slug: `frontpreview`
Preview URL: `https://br-shy-snow-ay9puvn1-frontpreview.compute.c-5.us-east-2.aws.neon.tech/`
Preview deployment: `1`
Runtime: `nodejs24`
State at deployment check: `completed`

Production upstream remains:
`https://br-shy-snow-ay9puvn1-publicsite.compute.c-5.us-east-2.aws.neon.tech/`

Production function `publicsite` was on deployment `28` when this preview was created and was not modified by this release.

## Architecture

- `/` is served by the new governed preview homepage.
- `/preview-health` is preview-only health metadata.
- all other paths proxy to the current production `publicsite` runtime.
- proxied responses preserve upstream status/body while applying `X-Robots-Tag: noindex, nofollow` on the preview host.
- preview `Location` headers pointing to production are rewritten back to the preview origin.
- no database schema changes.
- no production function deployment.
- no domain purchase or custom-domain mutation.
- no product data fabricated.
- no persistence added to the MAKE THIS ME demonstration.

## Frontend direction represented

The preview expresses the current architecture rather than the superseded July navigation model:

- Journal
- Fashion
- Worlds
- Shop
- Books
- MAKE THIS ME

Homepage modules include current governed surfaces and doctrine:

- A Certain Kind of Magic
- Sally / Gillian / Kylie / Antonia route family through the World
- The Useful Palette
- Feminine American Pragmatism
- Personality Bags
- The Intellectual Woman
- Books shelf boundary
- BFFL / live-product-to-backup commerce logic
- `FAIL THE PRODUCT, NOT THE LOOK.`
- explicit MAKE THIS ME signal model: intent, intensity, scope

Parent company naming remains unresolved and therefore absent. `THE JOURNAL` is used only as the existing publication/masthead token for this preview.

## Visual system

Preview palette uses retained visual DNA rather than treating old layout as authority:

- ink black
- warm paper / ivory
- ballerina pink
- deep plum / oxblood
- muted blue
- sage
- warm sand

Composition is deliberately asymmetric and editorial. It avoids a uniform commodity grid and avoids a giant empty hero. No unlicensed editorial/product photography was introduced in this release; visual fields are CSS-built until rights/provenance-bound imagery is wired.

## Exact artifact hashes

`index.mjs`
- bytes: 24,502
- SHA-256: `593265cf20aa54c18cf4448a6cf2068c2593d4f737b700318e6f55d077746334`

`package.json`
- bytes: 77
- SHA-256: `1907f3bc8620ae23581a04a8aca382f07383d92ae95758c3d778b93e0e83bd81`

Deployment ZIP: `frontpreview-20260914-r1.zip`
- bytes: 7,995
- SHA-256: `6b59ad84fcb5548a4aa05a270193615d9decc9cd011878b806c15bd791b56cdc`

## Safety / publication controls

- Preview is `noindex,nofollow`.
- Production is untouched.
- No custom domain is attached.
- Parent company name is not asserted.
- Glamoratti is not presented as the company.
- Books remains distinct from The Pages We Keep.
- MAKE THIS ME preview explicitly states that nothing is saved.
- Existing production routes remain authoritative behind the preview shell.

## Next governed step

1. Browser/visual review of the preview homepage.
2. Replace CSS-only visual fields with provenance- and rights-bound fashion/product imagery.
3. Reconcile global header/order after visual review rather than prematurely canonizing the preview order.
4. Move additional route templates from proxy mode into the new frontend one surface at a time.
5. Run accessibility, UI/UX, commerce, rights/IP, provenance, QA/red-team review; Anna last.
6. Only after acceptance: promote through the production path.

END FRONTEND PREVIEW RELEASE 001
