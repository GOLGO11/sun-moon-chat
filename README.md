# Sun Moon Chat MVP Demo

Mobile-first web demo for the agreed MVP validation loop:

`OTP demo -> birth info -> deterministic chart -> safe AI reading -> seeded matches -> basic 1:1 chat`

## Run

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3000`.

## Deploy to GitHub Pages

This demo is now static-export friendly. Build with:

```bash
npm run build
```

The static site will be generated in `out/`.

If you deploy to a project Pages URL like `https://<user>.github.io/<repo>/`, build with:

```bash
NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

## Fast reviewer path

1. Enter any `+62` phone number
2. Use OTP `123456`
3. Click `Gunakan profil contoh`
4. Review chart + AI reading
5. Open first seeded match and send a message
6. Click `Export demo events` to inspect funnel events

## Scope lock

- No payments
- No subscriptions
- No coins or gifts
- No portrait paywall
- No visitor unlock
- No advanced matching
- No external SMS, auth SaaS, database, or LLM dependency
- No runtime API routes required for deployment

## Demo notes

- Astrology output is interpretive, not scientific
- Chart generation is deterministic for the same input
- City support is intentionally limited to the seeded Indonesian city list
- Demo analytics are stored in localStorage only
- Match and chat demo state runs locally in the browser
- `Reset demo` clears session and local event history
