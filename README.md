# Obsidian Studio — Digital Asset Storefront

A dark-mode digital storefront for curated wallpapers, presets, audio kits, and UI design systems with instant **USDT (TRC20)** crypto checkout and on-chain payment verification.

## Tech Stack & Architecture
* **Framework:** Next.js (App Router & Server Components), TypeScript, Tailwind CSS v4, and shadcn/ui
* **Authentication:** Clerk (Discord & Google SSO, modal authentication, and protected user order routes)
* **Database & ORM:** Neon Serverless PostgreSQL with Prisma 7 (`@prisma/adapter-pg`)
* **Crypto Payments:** Direct TRON (TRC20) USDT checkout verified on-chain via the TronGrid Events API (supports Nile Testnet & TRON Mainnet)

## Key Features
* **Dynamic Catalog & Ownership Tracking:** Products load from Neon Postgres with category filtering and real-time `"Owned"` state detection for signed-in buyers.
* **On-Chain USDT Verification:** Validates TRON transaction hashes against the official USDT TRC20 smart contract, store deposit wallet, and product price while preventing TXID replay attacks.
* **User Order Library:** Protected `/orders` dashboard displaying verified receipts, transaction hashes, and instant asset download links.
