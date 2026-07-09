# ProcureAI — AI-Powered Procurement Management Platform

> A full-stack B2B SaaS platform that digitizes and automates a company's entire purchasing lifecycle — from "we need to buy something" to "the vendor has been paid" — using AI to read quotes/invoices, recommend the best vendor, and catch mismatches automatically.

🔗 **Live App:** [procureai-frontend-two.vercel.app](https://procureai-frontend-two.vercel.app/) (Vercel) · **API:** deployed on Render (add exact URL — see [Deployment](#17-deployment))

This repository set has **two codebases**:

| Repo | What it is | Stack |
|---|---|---|
| `procureai-backend` | REST API + business logic + AI + jobs | Node.js, Express, PostgreSQL (Sequelize), Redis/BullMQ, JWT |
| `procureai-frontend` | Web app (buyer dashboard + vendor portal) | React 18, Vite, Tailwind CSS, React Query, Axios |

---

## Table of Contents

1. [What This Platform Actually Does](#1-what-this-platform-actually-does)
2. [Who Uses It (the two sides of the platform)](#2-who-uses-it-the-two-sides-of-the-platform)
3. [The Core Workflow, Step by Step](#3-the-core-workflow-step-by-step)
4. [Feature List (everything in the app)](#4-feature-list-everything-in-the-app)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack in Detail](#6-tech-stack-in-detail)
7. [Data Model / Database Schema](#7-data-model--database-schema)
8. [Roles & Permissions](#8-roles--permissions)
9. [AI Features — How the "AI" in ProcureAI Works](#9-ai-features--how-the-ai-in-procureai-works)
10. [WhatsApp / Notifications](#10-whatsapp--notifications)
11. [Background Jobs (Cron)](#11-background-jobs-cron)
12. [Folder Structure](#12-folder-structure)
13. [API Reference (all endpoints)](#13-api-reference-all-endpoints)
14. [Environment Variables](#14-environment-variables)
15. [Running Locally (step-by-step, from zero)](#15-running-locally-step-by-step-from-zero)
16. [Demo / Seed Login](#16-demo--seed-login)
17. [Deployment](#17-deployment)
18. [Security Notes](#18-security-notes)
19. [Known Limitations / Things to Improve](#19-known-limitations--things-to-improve)
20. [FAQ](#20-faq)

---

## 1. What This Platform Actually Does

**ProcureAI is a "procure-to-pay" (P2P) platform.** In plain English: it is the software a mid-size company uses to manage every step of buying things from vendors/suppliers — stationery, raw materials, machine parts, services, anything — and it uses AI to remove the manual, error-prone parts of that process.

Without a tool like this, a company typically buys things like this:
- Someone emails a manager saying "we're low on X, can we order more?"
- Someone calls/emails 3 vendors asking for quotes
- Quotes come back as PDFs, WhatsApp images, or paper — someone manually re-types the numbers into Excel to compare them
- Someone manually decides who to buy from (often just "the vendor we always use")
- A purchase order is typed up in Word/Excel and emailed
- Goods arrive, someone checks them against the PO on paper
- An invoice arrives, someone manually checks it against the PO and the delivery note
- Finance manually decides when to pay and transfers the money

**ProcureAI turns every one of those manual steps into a tracked, auditable, mostly-automated workflow inside one system**, and uses an LLM (ChatGPT-style AI model) to:
- **Read** vendor quotes and invoices (PDF/image/Excel) and turn them into structured, comparable data (this is the OCR + AI extraction part)
- **Recommend** which vendor's quote is the best choice, with a written justification and a savings estimate
- **Auto-detect mismatches** between what was ordered, what was delivered, and what was invoiced (3-way matching)

It is built as a **multi-tenant SaaS** — many companies ("tenants") use the same deployed application, each with their own isolated data — with a **secondary portal for vendors** so suppliers can log in, submit quotes, see their orders, and get paid, without needing an account inside the buyer's company.

---

## 2. Who Uses It (the two sides of the platform)

ProcureAI has **two distinct sets of users**, each with their own login and their own part of the frontend app:

### A) Company users (the buyers) — main app
Employees of the company that is buying goods/services. They use the main dashboard (`/dashboard`, `/purchase-requests`, `/vendors`, etc.). Depending on their **role**, they can raise requests, send RFQs, approve spend, receive goods, approve invoices, and release payments. See [Roles & Permissions](#8-roles--permissions).

### B) Vendors / Suppliers — vendor portal
The companies/people who *sell* to the buyer. Vendors interact with ProcureAI in two ways:
1. **Passively, via a link** — when a buyer sends an RFQ, the vendor gets a unique tokenized link (no login needed) where they can upload/submit their quote directly (`/vendor/quote/:token`).
2. **Actively, via the Vendor Portal** (`/vendor-portal/...`) — vendors can sign up for a real account, log in, manage their product/service **catalog**, view **orders** placed with them, reply to **messages** on a purchase order, view their **payment** status, and **confirm** when they've received payment. This is effectively a mini-SaaS-within-the-SaaS for the supplier side.

---

## 3. The Core Workflow, Step by Step

This is the beating heart of the product — the **Procure-to-Pay (P2P) pipeline**. Every major backend model and every major frontend page maps to one of these stages:

```
1. Purchase Request (PR)
   ↓  An employee (Requester) says "we need to buy N units of X"
2. Approval (optional, threshold-based)
   ↓  If the estimated cost is above a configured threshold, it needs sign-off
3. RFQ (Request for Quotation)
   ↓  Procurement team turns the approved PR into an RFQ and sends it to 1+ vendors
      (via email/WhatsApp link, or matched vendors from Vendor Discovery)
4. Quote Submission
   ↓  Each vendor responds — either by uploading a PDF/photo of their quotation
      (AI extracts the structured data automatically) or by filling a web form
5. Quote Comparison + AI Recommendation
   ↓  All vendor quotes are shown side-by-side; AI scores them and recommends one
      with written reasoning (price, delivery time, vendor track record, etc.)
6. Purchase Order (PO)
   ↓  The chosen vendor's quote becomes a formal PO (PDF generated), sent to vendor
7. Goods Receipt Note (GRN)
   ↓  Warehouse/receiving team logs what physically arrived, inspects it, flags
      shortages/damage against what the PO said should arrive
8. Invoice Upload + AI Extraction
   ↓  Vendor's invoice (PDF/image) is uploaded; AI extracts line items automatically
9. 3-Way Match
   ↓  System automatically compares PO vs GRN vs Invoice and flags any mismatch
      (price different, quantity different, tax/freight/discount different)
10. Invoice Approval (Finance)
   ↓  Finance reviews and approves the invoice for payment
11. Payment Queue → Execute → Vendor Confirms
   ↓  Payment is queued, then executed (reference number generated), and the
      vendor can log into their portal and confirm they received the money
12. Closed / Paid
```

Alongside this pipeline, there's a separate lightweight **Billing** module (sell items from your own inventory to a customer, which reduces stock) and an **Inventory** module (tracks current stock per item, reorder points, and automatically raises low-stock alerts).

---

## 4. Feature List (everything in the app)

### Procurement core
- Purchase Requests (create, edit, submit for approval, cancel)
- Multi-level, threshold-based Approval workflow (configurable per company, e.g. "over ₹1,00,000 needs 2 approvers")
- RFQ creation, sending to multiple vendors at once, reminders to non-responders
- Public, token-based vendor quote submission page (no vendor login required)
- AI-assisted quote extraction from uploaded files (PDF/image/Excel) with a manual review/edit step
- Side-by-side quote comparison grid
- AI vendor recommendation with reasoning + estimated savings
- Purchase Order generation (PDF), sending to vendor
- Goods Receipt / inspection (received vs damaged vs shortage quantities, photo uploads)
- Invoice upload + AI extraction + automatic 3-way match against PO/GRN
- Invoice approval and **Payment queue → execute → vendor-confirms** flow
- In-app messaging thread attached to each PO / Invoice (buyer ↔ vendor)

### Vendor management
- Vendor CRUD, CSV bulk import
- Vendor document uploads (certifications, GST docs, etc.)
- Vendor scoring (price competitiveness, delivery reliability, response time, quality) computed automatically
- **Vendor Discovery** — search/match vendors by category/item even outside your invited list (a shared, cross-tenant vendor pool for self-registered vendors)
- Vendor comparison view
- Full self-service **Vendor Portal**: vendor signup/login, profile, catalog management, view orders, view/confirm payments, message buyers

### Inventory & Billing
- Item master (SKU, category, HSN/tax, reorder level, safety stock, preferred vendor)
- CSV bulk import of items
- Live inventory levels, automatically increased by Goods Receipts
- Reorder point rules + automatic low-stock alerts (via cron)
- Simple Billing module — sell items to a customer, reduces inventory

### Admin, Analytics & Platform
- Company/tenant signup + onboarding wizard
- Users & Roles management with granular permissions
- Dashboard KPIs, spend analytics, cycle-time analytics, vendor performance analytics, savings analytics
- Data export (CSV) for comparisons, POs, vendors, spend reports
- Notifications (in-app) + audit log of every state-changing action
- Company-wide settings, including approval threshold configuration
- **Platform Admin dashboard** — a cross-tenant, "god mode" view (usage trends, approval bottlenecks, top entities, alerts) for the people running ProcureAI itself, gated behind a special `is_platform_admin` flag rather than a normal role

---

## 5. System Architecture

```
                         ┌────────────────────────┐
                         │   React SPA (Vite)      │
  Buyer's browser  ───▶  │  procureai-frontend     │
                         │  (Dashboard + Vendor     │
                         │   Portal, same app)      │
                         └───────────┬─────────────┘
                                     │ REST (axios) — JWT in Authorization header
                                     ▼
                         ┌────────────────────────┐
                         │   Express REST API      │
                         │  procureai-backend       │
                         │  /api/v1/*               │
                         └───┬─────────┬───────────┘
                              │         │
                 ┌────────────┘         └──────────────┐
                 ▼                                      ▼
       ┌───────────────────┐                 ┌───────────────────────┐
       │ PostgreSQL          │                 │ External services      │
       │ (Sequelize ORM,     │                 │ - LLM API (OpenAI-      │
       │  multi-tenant via   │                 │   compatible) for quote/│
       │  company_id on      │                 │   invoice extraction &  │
       │  every row)         │                 │   recommendations       │
       └───────────────────┘                 │ - Tesseract.js (OCR for  │
                                              │   scanned/image files)  │
                 ┌───────────────────┐        │ - S3-compatible storage  │
                 │ Redis (BullMQ)     │        │   for uploaded files     │
                 │ — wired up, ready  │        │ - SMTP for emails        │
                 │   for background   │        │ - WhatsApp Business API  │
                 │   jobs, currently  │        │   (Gupshup/Meta Cloud)   │
                 │   idle — see note  │        │   for notifications      │
                 │   below            │        └───────────────────────┘
                 └───────────────────┘
                            ▲
                            │ node-cron, in-process
                 ┌───────────────────┐
                 │ Scheduled jobs:    │
                 │ - reorder alerts   │
                 │ - vendor scoring   │
                 │ - RFQ reminders    │
                 └───────────────────┘
```

**Important architectural note:** the codebase includes a full BullMQ + Redis queue setup (`src/jobs/queues.js`) for async background processing, but as currently wired, **quote/invoice AI extraction runs synchronously inside the HTTP request** (in `invoiceController.upload`, `rfqController.publicSubmitQuote`, `quoteController.reprocess`) rather than being pushed onto the queue. The queue file is left in place for future use but nothing currently calls `.add()` on it — so Redis is optional for core functionality today, but required if/when the async pipeline is turned on.

**Multi-tenancy model:** every core table (`items`, `purchase_requests`, `vendors`, `invoices`, etc.) has a `company_id` column, and the API layer scopes every query to the logged-in user's `company_id`. `Vendor` and `VendorCatalogItem` rows are the one exception — they can have `company_id: null` when a vendor **self-registers** through the public vendor portal (rather than being invited by a specific buyer), which makes that vendor discoverable by *any* buyer company via Vendor Discovery, while buyer-invited vendors remain private to that one buyer.

---

## 6. Tech Stack in Detail

### Backend (`procureai-backend`)
| Package | Purpose |
|---|---|
| `express` | HTTP server / routing |
| `sequelize` + `pg` | PostgreSQL ORM |
| `jsonwebtoken`, `bcryptjs` | Auth (JWT access + refresh tokens, password hashing) |
| `zod` | Request validation |
| `helmet`, `cors`, `express-rate-limit` | Security hardening & rate limiting |
| `multer`, `multer-s3`, `@aws-sdk/client-s3` | File uploads → S3-compatible storage |
| `tesseract.js` | OCR — reads text out of scanned/photographed documents |
| `pdfkit` | Generates PDF purchase orders |
| `xlsx` | Reads/writes Excel files (vendor/item CSV import, exports) |
| `nodemailer` | Transactional email |
| `bullmq` + `ioredis` | Background job queue (see architecture note above) |
| `uuid` | Primary keys |
| `morgan` | Request logging |

### Frontend (`procureai-frontend`)
| Package | Purpose |
|---|---|
| `react` 18 + `react-router-dom` 6 | SPA + client-side routing |
| `vite` | Dev server / build tool |
| `@tanstack/react-query` | Server-state caching/fetching |
| `axios` | HTTP client (with interceptors for auth tokens & auto-refresh) |
| `tailwindcss` | Utility-first styling |
| `recharts` | Analytics charts |
| `lucide-react` | Icon set |
| `react-hot-toast` | Toast notifications |
| `date-fns` | Date formatting |

---

## 7. Data Model / Database Schema

All tables are defined in `src/models/index.js` (Sequelize). Below is every entity and what it's for:

| Table | Purpose |
|---|---|
| `companies` | A tenant (the buying organization). Holds currency, approval thresholds, plan, branding. |
| `roles` / `permissions` / `role_permissions` | RBAC — each company has its own set of roles, each role has a set of granular permission codes (e.g. `pr.create`, `po.approve`). |
| `users` | Company employees. Has `is_platform_admin` flag for cross-tenant platform-admin access (separate from the normal role system). |
| `vendors` | Suppliers. Nullable `company_id` (see multi-tenancy note above). Has portal login fields (`password_hash`, `portal_status`) and bank details for payments. |
| `vendor_documents` | Uploaded vendor certification/compliance files. |
| `vendor_catalog_items` | A vendor's sellable products/services, managed by the vendor themselves via the portal. |
| `messages` | Threaded chat attached to a PO or an Invoice, between a company user and a vendor. |
| `items` | The buyer's internal item/material master (SKU, tax rate, reorder rules, preferred vendor). |
| `purchase_requests` / `purchase_request_items` | Stage 1 of the pipeline — what someone wants to buy. |
| `rfqs` / `rfq_vendors` | The RFQ sent out and which vendors it was sent to (tracks sent/opened/responded, has a unique `access_token` for the public quote-submission link). |
| `quotes` / `quote_items` | A vendor's quote response — either AI-extracted from a file or manually entered. |
| `ai_extractions` | Raw text + structured JSON + confidence score from any AI extraction (polymorphic — attaches to a quote or an invoice). |
| `ai_recommendations` | The AI's vendor recommendation for an RFQ, with reasoning text and a score breakdown. |
| `approvals` | Generic multi-level approval records (polymorphic — attaches to a PR or a PO). |
| `purchase_orders` / `po_items` | The formal order issued to the winning vendor. |
| `goods_receipts` / `goods_receipt_items` | What was physically received, with damage/shortage tracking. |
| `invoices` / `invoice_items` | Vendor invoices, AI-extracted, matched against the PO. |
| `vendor_scores` | Computed performance scores per vendor per period. |
| `inventory` / `reorder_rules` | Current stock levels + auto-reorder trigger config. |
| `notifications` | In-app notification feed per user/vendor. |
| `attachments` | Generic polymorphic file attachments. |
| `audit_logs` | Immutable log of who did what, with before/after values. |
| `settings` | Per-company key/value settings store. |
| `payments` | The payment lifecycle for an invoice: `queued → executed → confirmed`. |
| `bills` / `bill_items` | Simple sell-side billing (reduces inventory). |

---

## 8. Roles & Permissions

Roles are seeded per-company (see `src/config/seed.js`) and permissions are checked per-endpoint via `requirePermission('code')` middleware. The default role set:

| Role | Typical purpose |
|---|---|
| **Super Admin / Company Admin** | Full access — users, settings, all modules |
| **Procurement Manager** | Runs RFQs, reviews quotes, creates POs, views billing/payments |
| **Procurement Executive** | Day-to-day procurement operations |
| **Requester** | Raises Purchase Requests only |
| **Approver** | Approves PRs/POs that hit their assigned approval level |
| **Finance** | Reviews/approves invoices, queues & executes payments |
| **Warehouse** | Logs Goods Receipts, inspects deliveries, can bill/sell inventory |

Permissions are fine-grained strings like `pr.create`, `pr.approve`, `rfq.send`, `quotes.review`, `po.approve`, `po.send`, `grn.create`, `invoices.approve`, `payments.approve`, `billing.create`, `vendors.edit`, `users.create`, `settings.edit`, `analytics.view`, `audit.view`, etc. — each API route declares exactly which permission it needs.

Separately, `is_platform_admin` on a `User` grants **read-only, cross-company** access to the `/platform/*` analytics endpoints — this is for the people operating ProcureAI itself, not for any company's own staff, and is deliberately not tied to the per-company role system.

---

## 9. AI Features — How the "AI" in ProcureAI Works

ProcureAI calls this an "AI Procurement Manager," and here's concretely what that means under the hood (`src/services/aiService.js`):

1. **Document ingestion**: a vendor quote or invoice is uploaded as a PDF, image, or Excel file.
2. **OCR (if needed)**: `tesseract.js` extracts raw text from image-based/scanned documents.
3. **Structured extraction**: the raw text is sent to a Large Language Model (configured via `LLM_API_KEY`/`LLM_MODEL`, OpenAI-compatible Chat Completions API, JSON-mode) with a detailed extraction prompt. The model returns structured JSON: vendor name, line items (name, quantity, unit price, tax, freight, discount), payment terms, delivery time, and a confidence score per field.
4. **Matching**: extracted line items are fuzzy-matched (`matchPoItem`/`normalizeItemName`) back to the original requested items/PO items, so the system can reason about "is this the same item at a different price" rather than just seeing unrelated text blobs.
5. **Recommendation**: once multiple vendor quotes exist for one RFQ, `generateRecommendation` scores them (price, delivery time, vendor track record) and produces a written justification plus an estimated savings figure versus the average/highest quote.
6. **3-way match**: `compareQuoteToRequestedItems` (and the equivalent invoice-vs-PO comparison in `invoiceController`) flags line-item-level mismatches automatically instead of requiring someone to eyeball three documents.
7. **Human-in-the-loop**: every AI extraction is editable — the review-complete step lets a human correct any field before it becomes the source of truth, and `ai_extractions.reviewed_by`/`reviewed_at` records who signed off.

**Graceful degradation:** if `LLM_API_KEY` isn't set, `aiService` doesn't crash — it logs a warning and returns a safe mock/empty extraction, so the rest of the app (manual entry, everything else) still works without an AI key configured.

---

## 10. WhatsApp / Notifications

`src/services/whatsappService.js` integrates with WhatsApp Business API providers (built for **Gupshup** and generically for **Meta's WhatsApp Cloud API**) to send things like RFQ invitations and reminders straight to a vendor's WhatsApp number — useful because in many procurement contexts (especially in India, given the `+91`-default phone formatting and INR/Asia-Kolkata defaults in the schema) vendors are far more responsive on WhatsApp than email. This is optional — if `WHATSAPP_API_URL`/`WHATSAPP_API_TOKEN` aren't set, sends are skipped/logged rather than failing. In-app notifications (`notifications` table) and email (via `nodemailer`) cover the rest of the alerting surface: approval-pending pings, RFQ status changes, mismatch alerts, etc.

---

## 11. Background Jobs (Cron)

`src/jobs/cron.js`, started on server boot, schedules:

- **Reorder alerts** — scans `items`/`inventory`/`reorder_rules` and raises a notification when stock drops to/below the reorder point.
- **Vendor scoring** — recomputes each vendor's performance score (price competitiveness, delivery reliability, response time, quality) based on recent order history.
- **RFQ reminders** — nudges vendors who haven't responded to an open RFQ as the deadline approaches.

---

## 12. Folder Structure

```
procureai-backend/
├── Dockerfile
├── package.json
├── .env.example
└── src/
    ├── server.js              # App bootstrap: middleware, DB sync, cron start
    ├── config/
    │   ├── db.js               # Sequelize/Postgres connection
    │   ├── migrate.js          # Manual migration runner
    │   └── seed.js             # Demo company/roles/admin user seeding
    ├── models/index.js         # All Sequelize models + associations
    ├── routes/index.js         # All route definitions -> controllers
    ├── controllers/            # One file per resource (24 controllers)
    ├── middleware/
    │   ├── auth.js              # JWT auth, requirePermission, requirePlatformAdmin
    │   ├── vendorAuth.js        # Separate JWT auth for the vendor portal
    │   ├── upload.js            # Multer/S3 upload config
    │   ├── audit.js             # Writes audit_logs entries
    │   └── errorHandler.js
    ├── services/
    │   ├── aiService.js         # OCR + LLM extraction + recommendations
    │   ├── approvalService.js   # Threshold-based approval flow engine
    │   ├── notificationService.js
    │   └── whatsappService.js
    ├── jobs/
    │   ├── cron.js              # Scheduled jobs
    │   └── queues.js            # BullMQ setup (currently idle, see architecture note)
    └── utils/helpers.js

procureai-frontend/
├── Dockerfile
├── index.html
├── package.json
├── vite.config.js              # Dev proxy: /api -> localhost:4000
├── vercel.json                 # Vercel SPA rewrite config
├── tailwind.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                  # All routes (public, protected, vendor portal)
    ├── index.css
    ├── api/
    │   ├── client.js            # Axios instance, token injection, refresh logic
    │   └── services.js          # Typed API call wrappers per resource
    ├── context/AuthContext.jsx  # Logged-in user/vendor state
    ├── components/
    │   ├── Layout.jsx           # App shell/nav
    │   └── ui.jsx               # Shared UI primitives
    └── pages/                   # 39 page components (see route table below)
```

---

## 13. API Reference (all endpoints)

Base URL: `{API_URL}/api/v1`

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | Company user login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | |
| POST | `/auth/forgot-password` | |
| POST | `/auth/reset-password` | |

### Company / Public
| Method | Path | Notes |
|---|---|---|
| POST | `/companies` | New tenant signup |
| GET | `/public/companies/search` | Public company lookup |
| GET | `/companies/me` | |
| PATCH | `/companies/me` | requires `settings.edit` |

### Public RFQ / Quote Submission (no login)
| Method | Path |
|---|---|
| GET | `/public/rfq/:token` |
| POST | `/public/rfq/:token/validate` |
| POST | `/public/rfq/:token/quote` |

### Vendor Portal
| Method | Path |
|---|---|
| POST | `/vendor-portal/signup` \| `/login` \| `/set-password` |
| GET/PATCH | `/vendor-portal/me` |
| PATCH | `/vendor-portal/change-password` |
| GET/POST/PATCH/DELETE | `/vendor-portal/catalog[/:id]` |
| GET/POST | `/vendor-portal/documents` |
| GET | `/vendor-portal/orders` |
| GET/POST | `/vendor-portal/orders/:id/messages` |
| GET | `/vendor-portal/payments` |
| POST | `/vendor-portal/payments/:id/confirm` |

### Users, Roles, Vendors, Items
Standard CRUD at `/users`, `/roles`, `/vendors` (+ `/vendors/compare`, `/vendors/import`, `/vendors/:id/scores`, `/vendors/:id/documents`), `/items` (+ `/items/import`).

### Procurement Pipeline
| Method | Path |
|---|---|
| CRUD | `/purchase-requests` (+ `/submit`, `/cancel`) |
| CRUD | `/rfqs` (+ `/send`, `/vendors`, `/remind`, `/quotes`, `/comparison`, `/recommend`, `/select-vendor`) |
| CRUD | `/quotes/:id` (+ `/reprocess`, `/items`, `/review-complete`) |
| GET/POST | `/approvals/pending`, `/approvals/:id/act`, `/approvals/:type/:entityId/history` |
| CRUD | `/purchase-orders` (+ `/submit`, `/send`, `/pdf`) |
| CRUD | `/goods-receipts` (+ `/inspect`) |
| CRUD | `/invoices` (+ `/match`, `/approve`, `/items/:item_id`, `/queue-payment`) |
| GET/POST | `/payments` (+ `/:id/execute`) |
| CRUD | `/billing` |

### Inventory, Vendor Discovery, Messaging
`/inventory`, `/inventory/reorder-alerts`, `/reorder-rules/:item_id`, `/vendor-scores/compute`, `/vendor-discovery/search`, `/vendor-discovery/categories`, `/vendor-discovery/match-item/:itemId`, `/purchase-orders/:id/messages`, `/invoices/:id/messages`.

### Analytics, Exports, Admin
`/analytics/dashboard`, `/spend`, `/cycle-times`, `/vendor-performance`, `/savings`; `/notifications`, `/audit-logs`, `/settings`; `/export/comparison`, `/purchase-orders`, `/vendors`, `/spend-report`; `/platform/*` (platform-admin only).

> Every non-public/non-vendor-portal route requires a valid JWT (`Authorization: Bearer <token>`) **and** the specific permission noted in `src/routes/index.js`.

---

## 14. Environment Variables

### Backend (`.env`)
```env
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/procureai

# Auth
JWT_ACCESS_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (BullMQ — optional today, see architecture note)
REDIS_URL=redis://localhost:6379

# File storage (S3-compatible)
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=procureai-uploads
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=ap-south-1

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@procureai.app

# WhatsApp (Gupshup / WhatsApp Cloud API)
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# AI / LLM
LLM_PROVIDER=openai
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini

# App
APP_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000
```
(If unset, `client.js` defaults to a relative `/api/v1`, which relies on the Vite dev proxy or same-origin hosting in production.)

---

## 15. Running Locally (step-by-step, from zero)

**Prerequisites:** Node.js 20+, PostgreSQL, (optionally) Redis, npm.

### 1. Backend
```bash
cd procureai-backend
cp .env.example .env
# edit .env — at minimum set DATABASE_URL to a real Postgres instance

npm install
npm run migrate     # or rely on sequelize.sync({alter:true}) which also runs on every boot
npm run seed         # creates a demo company + admin user (see below)
npm run dev           # nodemon src/server.js — http://localhost:4000
```

### 2. Frontend
```bash
cd procureai-frontend
npm install
echo "VITE_API_URL=http://localhost:4000" > .env
npm run dev            # http://localhost:5173
```

### 3. Log in
Go to `http://localhost:5173/login` and use the seeded demo admin (see [Demo / Seed Login](#16-demo--seed-login)), or sign up as a brand-new company at `/signup`.

### Docker (per-repo Dockerfiles provided)
Each repo has its own `Dockerfile` (dev-mode, not a production multi-stage build):
```bash
# backend
docker build -t procureai-backend ./procureai-backend
docker run -p 4000:4000 --env-file ./procureai-backend/.env procureai-backend

# frontend
docker build -t procureai-frontend ./procureai-frontend
docker run -p 5173:5173 procureai-frontend
```
There is no `docker-compose.yml` in either repo — you'll need to provide Postgres/Redis yourself (locally, via Docker, or a managed service) and point `DATABASE_URL`/`REDIS_URL` at them.

---

## 16. Demo / Seed Login

Running `npm run seed` in the backend creates one demo tenant with a **Company Admin** user:

```
Email:    admin@demo.com
Password: Admin@123
```

> ⚠️ Change or remove this before any real/public deployment — it's a well-known default seeded straight into `src/config/seed.js`.

---

## 17. Deployment

This project is already live using the following pairing:

- **Frontend is deployed on Vercel:** https://procureai-frontend-two.vercel.app/
- **Backend is deployed on Render** (URL to be added — send it and it'll be filled in below)

This matches what the repos are pre-configured for anyway, based on code comments and config files found in each repo:

- **Backend → [Render](https://render.com)** — `src/server.js` contains Render-specific `trust proxy` handling and comments explicitly about "Render's free tier has no Shell access," and startup runs `sequelize.sync({ alter: true })` on every boot specifically so schema changes apply without manual migration access.
- **Frontend → [Vercel](https://vercel.com)** — `vercel.json` is a standard Vite SPA config (`buildCommand: npm run build`, `outputDirectory: dist`, catch-all rewrite to `index.html`).

**Live deploy links:**
- Frontend (Vercel): **https://procureai-frontend-two.vercel.app/**
- Backend API (Render): _share your Render service URL and I'll add it here, e.g. `https://procureai-backend-xxxx.onrender.com`_

To deploy yourself:
1. **Backend on Render**: New Web Service → connect the backend repo → set the environment variables from [section 14](#14-environment-variables) (especially `DATABASE_URL` to a managed Postgres instance, e.g. Render Postgres/Neon/Supabase) → build command `npm install`, start command `npm start`.
2. **Frontend on Vercel**: Import the frontend repo → framework auto-detected as Vite → set `VITE_API_URL` to your deployed backend URL → deploy.
3. Update the backend's `APP_URL` env var to your deployed frontend URL (used for CORS `origin`).

---

## 18. Security Notes

- Passwords are hashed with `bcryptjs`; auth uses short-lived JWT access tokens + longer-lived refresh tokens.
- `helmet` for security headers, `express-rate-limit` on `/auth`, `/public`, and globally.
- Every mutating action can be captured in `audit_logs` (`middleware/audit.js`) with before/after values and IP address.
- Multi-tenant isolation is enforced at the query layer via `company_id` scoping — **there is no database-level row-level-security**, so this depends on every controller correctly scoping queries; worth extra scrutiny before production use.
- `is_platform_admin` is a manually-granted flag with no self-service path to obtain it — by design.
- The default seeded credentials (`admin@demo.com` / `Admin@123`) must be rotated/removed for any real deployment.

---

## 19. Known Limitations / Things to Improve

- BullMQ/Redis job queue is fully wired but currently unused — AI extraction runs synchronously in the request/response cycle, which can make quote/invoice uploads feel slow for large files and doesn't scale well under heavy concurrent load.
- No automated test suite is included in either repo.
- No `docker-compose.yml` bundling Postgres/Redis for one-command local spin-up.
- LLM provider is hardcoded to the OpenAI Chat Completions API shape (`LLM_PROVIDER=openai` is really just a label — `aiService.js` only implements the OpenAI-compatible call).
- Static file serving uses `/tmp` for temp PDFs in `server.js`, which is ephemeral on most PaaS hosts (Render, etc.) — anything meant to persist should go through the S3 upload path, not `/files`.

---

## 20. FAQ

**Q: Is this a real, working product or a demo/prototype?**
It's a fully implemented full-stack application with a real database schema, working auth, and a genuinely wired-up AI extraction pipeline (not a mockup) — but it ships with demo seed data, a default admin password, and some rough edges noted above, which is typical of an MVP/early-stage SaaS rather than a hardened production system.

**Q: Does it need an OpenAI API key to work at all?**
No — the app runs fully without `LLM_API_KEY` set (manual quote/invoice entry still works), but the "AI" extraction/recommendation features will return empty/mock results without a real key.

**Q: Can vendors see other companies' data?**
No. A vendor's `company_id` is either `null` (self-registered, visible to all buyers via Vendor Discovery for matching purposes only) or set to exactly one inviting buyer (private). Vendors never see another buyer's purchase requests, POs, invoices, etc.

**Q: What currency/region is this built for?**
Defaults suggest India: `currency: 'INR'`, `timezone: 'Asia/Kolkata'`, `gstin`/`hsn_sac`/`pan` fields, `+91` WhatsApp number formatting — but nothing hardcodes it exclusively; these are just the defaults.

---

*This README was generated by analyzing the full source of both repositories (`procureai-backend-main` and `procureai-frontend-main`) — every feature, route, and model listed above is backed by code found in the repos, not assumed.*
