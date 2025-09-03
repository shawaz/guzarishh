🛍️ Guzarishh – Fashion E-Commerce Platform

Guzarishh is a UAE-based fashion e-commerce platform built by Codelude Software Development Firm.
The platform is launching in two phases:

Next.js (Web App) powered by Appwrite backend

Flutter (Mobile Apps) for Android & iOS

✨ Features

🏷️ Product Management powered by Notion CMS (via Appwrite integration)

🌐 Next.js Web App – fast, SEO-friendly storefront

📱 Flutter Mobile Apps (coming soon) for Android & iOS

🔍 Browse products by categories & collections

🛒 Cart & checkout flow

💳 Payments: Stripe (MVP), with roadmap for Tabby, Tamara, Telr & Ziina

📦 Order history & profile management

☁️ Appwrite backend for authentication, database, storage

🏗 Tech Stack
Phase 1 – Web

Frontend: Next.js 14 (App Router)

Backend: Appwrite (Auth, Database, Functions, Storage)

CMS: Notion API (Products, Categories, Banners)

Payments: Stripe UAE (initial), Tabby/Tamara, Telr, Ziina (later)

Phase 2 – Mobile

Frontend: Flutter (Dart)

Backend: Appwrite (shared with web)

Payments: Shared integration layer

🚀 Getting Started
Prerequisites

Node.js 20+

Appwrite project setup (self-hosted or Cloud)

Notion integration token + database IDs

Stripe test keys

Installation (Web – Next.js)
# Clone repository
git clone https://github.com/codelude/guzarishh.git
cd guzarishh

# Install dependencies
npm install

# Run development server
npm run dev

⚙️ Project Structure (Web – Next.js)
/src
 ├── app/                 # Next.js App Router
 │    ├── page.tsx        # Home
 │    ├── product/[id]/   # Product detail
 │    ├── cart/           # Cart & checkout
 │    ├── profile/        # User profile & orders
 │    └── api/            # API routes (Appwrite)
 ├── components/          # UI components
 ├── lib/                 # Utils (Appwrite client, Notion service)
 └── styles/              # Global styles

🗂 Notion CMS Schema

Products → name, description, price, stock, images[], category, slug

Categories → name, banner, slug

Orders → order_id, user_id, items[], total_price, status

📅 Roadmap

✅ Phase 1 (Web) – Next.js + Appwrite + Stripe MVP (browse, cart, checkout)

🔜 Phase 2 (Mobile) – Flutter apps (iOS + Android) using Appwrite backend

🔜 Add BNPL support (Tabby, Tamara)

🔜 Add local gateways (Telr, Ziina)

🔜 Advanced features: wishlist, coupons, wallet, fashion blog (Notion sync)

👨‍💻 Team

Business: Guzarishh (UAE)

Tech & Development: Codelude Software Development Firm
