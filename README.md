# Safe Cover

Safe Cover leverages Safe's Social Recovery Module contracts, developed by Candide, evaluated by the Safe Protocol Team, and has passed formal verification and audits.

Social Recovery provides users with an effective method to regain control of their accounts by transferring access to a new owner through trusted contacts, or their own backup accounts. The account recovery module allows owners to add recovery addresses, known as Guardians, to facilitate this process in case their signer key is lost or compromised. Candide's Social Recovery Module is flexible and accepts various types of Ethereum accounts as Guardians, including:

- Family and friends
- Hardware wallets
- Institutions
- Email/SMS (through companies offering auth-based safe recovery services)

Safe Cover frontend is built with censorship resistance in mind:

- No analytics or tracking
- No backend services needed, only an RPC URL
- Easily runs on IPFS or locally

## Audits

Contracts, formal verification, and audits can be found in the GitHub repository: [candide-contracts](https://github.com/candidelabs/candide-contracts).

## Resources

- [Safe Recovery Explainer](https://docs.candide.dev/blog/making-accounts-recoverable/)
- [Formal Verification and Audits Announcements by Safe](https://safe.global/blog/introducing-candides-social-recovery)

## Running Locally

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
