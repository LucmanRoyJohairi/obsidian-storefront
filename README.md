# 🌑 Obsidian Studio — Digital Asset Storefront

A sleek, dark-mode digital storefront for curated wallpapers, Lightroom presets, audio kits, and UI design systems—powered by **Next.js**, **Clerk**, **Neon Serverless Postgres**, **Prisma 7**, and **on-chain USDT (TRC20) payment verification**.

![Next.js](https://shields.io)
![TypeScript](https://shields.io)
![Tailwind CSS](https://shields.io)
![Prisma](https://shields.io)
![Neon](https://shields.io)
![TRON](https://shields.io)

---

## ✨ Key Features

* 🔐 **Frictionless OAuth Authentication:** Seamless sign-in and account management powered by **Clerk**, supporting **Discord** and **Google** SSO with centered modal overlays and protected server routes.
* 🗂️ **Dynamic Storefront & Ownership Detection:** Real-time product catalog served from **Neon Postgres** with instant category filtering (`Wallpapers`, `Presets`, `Audio`, `UI Kits`) and automatic **"Owned • View Order"** badges for previously purchased assets.
* 💸 **Direct USDT (TRC20) Crypto Checkout:** Built-in checkout modal displaying exact USDT pricing, one-click wallet address copying, and instant transaction hash (`TXID`) submission.
* ⛓️ **On-Chain Transaction Verification:** Backend API route (`/api/orders`) queries the **TronGrid Events API** (using `TronWeb`) to validate:
  * Official **USDT TRC20** smart contract authenticity (blocking fake token spoofing).
  * Exact recipient wallet matching and minimum USDT payment threshold.
  * Unique `TXID` enforcement in Postgres (`@unique`) to prevent replay attacks.
* 📦 **Protected Digital Library (`/orders`):** Dedicated user dashboard listing verified purchase receipts, on-chain transaction hashes, and instant asset download links.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router, Server Components, API Routes) |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, Geist Typography, Lucide Icons |
| **Authentication** | Clerk (`@clerk/nextjs`) |
| **Database** | Neon Serverless PostgreSQL |
| **ORM & Adapter** | Prisma 7 (`@prisma/adapter-pg` + `pg`) |
| **Blockchain API** | TronGrid REST API & `TronWeb` (Supports Nile Testnet & TRON Mainnet) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com
cd obsidian-storefront
npm install
```

### 2. Configure Environment Variables
Create a **`.env.local`** file (and **`.env`** for Prisma CLI commands) in the project root and populate the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Neon Serverless PostgreSQL
DATABASE_URL="postgresql://user:password@ep-your-project.aws.neon.tech/neondb?sslmode=require"

# TRON & TronGrid Configuration (Nile Testnet shown below)
TRONGRID_API_KEY="your-trongrid-api-key"
TRON_API_URL="https://trongrid.io"
USDT_CONTRACT_ADDRESS="TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"

# Store Deposit Wallet (TRC20)
STORE_TRON_WALLET="TYourTRC20WalletAddressHere"
NEXT_PUBLIC_STORE_TRON_WALLET="TYourTRC20WalletAddressHere"
```

> **💡 Switching to TRON Mainnet:** Update `TRON_API_URL` to `https://trongrid.io` and `USDT_CONTRACT_ADDRESS` to `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`.

### 3. Sync Database & Seed Sample Products
Push the Prisma schema to your Neon database and populate the starter digital catalog:

```bash
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the storefront.

---

## 📁 Project Structure

```text
├── app/
│   ├── api/orders/route.ts       # On-chain TronGrid verification & order creation
│   ├── orders/page.tsx           # Protected user purchase history & downloads
│   ├── layout.tsx                # Root layout with Geist font & ClerkProvider
│   └── page.tsx                  # Server-rendered catalog & ownership lookup
├── components/store/
│   ├── checkout-dialog.tsx       # USDT (TRC20) checkout & TXID submission modal
│   ├── navbar.tsx                # Navigation bar with Clerk UserButton & My Orders
│   ├── product-card.tsx          # Asset card with dynamic "Owned" state
│   └── storefront-client.tsx     # Interactive category filtering & modal state
├── lib/
│   └── prisma.ts                 # Prisma 7 singleton client with pg driver adapter
└── prisma/
    ├── schema.prisma             # Product & Order database models
    └── seed.ts                   # Database seed script for digital assets
```

---

## 🔒 Security Considerations

* **Server-Side Price Enforcement:** Product prices are fetched directly from Neon Postgres during verification rather than trusted from client payloads.
* **Contract Address Validation:** Only `Transfer` events emitted by the verified USDT contract address are accepted.
* **Idempotent Order Recording:** Database-level `@unique` constraints on `txHash` guarantee a single blockchain transaction can never be redeemed twice.
