# No-Gym 30 Deploy Folder

## What’s ready
- `index.html` — live sales page
- `privacy.html` — privacy policy
- `terms.html` — terms of service

## Before you launch
1. Replace checkout links in `index.html`
   - Find `href="#checkout"`
   - Replace with Stripe / Gumroad / Lemon Squeezy URL
2. Update contact/receipt redirect if needed
3. Add tracking scripts if desired (GA4, Plausible, Pixel)
4. Test checkout in test mode first

## Deploy options
- Netlify Drop: drag the `deploy/nogym30` folder
- Vercel: `vercel --prod` in this folder
- Cloudflare Pages: connect folder or Git repo
- GitHub Pages: enable Pages on repo root
