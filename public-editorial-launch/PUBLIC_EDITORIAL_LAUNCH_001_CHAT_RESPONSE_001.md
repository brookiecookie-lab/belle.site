## The Journal is deployed

Stripe is no longer blocking the launch. The public Editorial + Digital Products site is deployed on Neon Function `publicsite`, deployment **2**, and Neon reports that deployment as **active/completed**.

**Live site:** https://br-shy-snow-ay9puvn1-publicsite.compute.c-5.us-east-2.aws.neon.tech/

The launch has the Journal, the three original editorial pieces, Worlds, Digital Editions, the **$49 Personalized World Prescription** request/reserve intake, the **Mini Edit from $29** request/reserve intake, newsletter signup, Marginalia waitlist, Curiosity Archive waitlist, and the physical Shop shell. **No payment is processed on the site right now**, so the Stripe 2FA problem cannot break a customer flow.

The forms are backed by the isolated Neon `public_site.submission` table rather than the Decision Board truth models. The existing Pretty Little Steals `main` site was not overwritten; the launch source is preserved separately on `public-editorial-launch-001`.

Acceptance evidence is clean so far: the exact deployed handler returns `200` HTML for the homepage, `200` JSON for `/health`, rejects a malformed intake with `400`, Neon logged `invoke begin` → `invoke end` for deployment 2, and no function `ERROR` logs were returned in the checked window. The only item I am **not** marking passed is an independently observed external-browser fetch from this ChatGPT runtime, because its network layer blocks/directly fails DNS resolution for the Neon hostname. That is preserved as an open acceptance item rather than being papered over.

The frozen deployment record and manifest are attached below. This is now a real deployable public front door, with Stripe deliberately deferred rather than allowed to hold Editorial and Digital Product hostage.
