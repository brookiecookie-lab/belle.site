# Public Frontend vNext — Missing Pages Package

Created 2026-09-15.

## Protected surfaces intentionally excluded
- Homepage: nearly finished / frozen visual direction.
- PDP: frozen canonical architecture.

This package adds only missing public routes and shared behavior. It is designed to assemble beside those protected surfaces rather than overwrite them.

## Pages included
- `worlds.html`
- `shop.html`
- `belle.html`
- `intelligence.html`
- `make-this-me.html`
- `boards.html`
- `search.html`
- `digital-products.html`
- `cart.html`
- `checkout.html`
- `pdp-route-contract.html` (boundary page, not a PDP redesign)

## Current architecture preserved
- DISCOVERY → INTELLIGENCE → PERSONALIZATION → COMMERCE
- `belle. No Capital.` is the publication name.
- The Pages We Keep is a standalone external property; its URL is configured separately.
- Digital Products remains a distinct system.
- World ≠ archetype ≠ state ≠ microstate ≠ crossover ≠ season ≠ place ≠ editorial.
- MAKE THIS ME changes an interpretation, not the woman's identity.
- Sold-out inspiration resolves through disclosed role-preserving substitutes.
- Price translation preserves Base / Mid / Elevated / Splurge semantics; Splurge ≠ Best.
- Teal means discovery/intelligence; Poseidon owns primary commerce actions.
- No pill-soup navigation/filtering.
- `brandName` is one replaceable working token in `assets/site-config.js`.

## Data contract
Pages are compatible with the approved `PublicSurfaceDataSource` model. Static content here functions as truthful UI fixtures; live governed records should replace fixtures without page redesign.

## The Pages We Keep
`pagesWeKeepUrl` is intentionally empty. The nav link is disabled until the standalone property's approved URL is configured. This prevents accidental absorption into the main site.
