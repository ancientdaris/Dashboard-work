# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (Next.js 15 with Turbopack)
- `npm run build` — Production build (Turbopack)
- `npm run lint` — ESLint
- No test framework is configured

## Architecture

**OSAS (Order and Stock Administration System)** — A wholesale business management dashboard built with Next.js 15 App Router, TypeScript, Tailwind CSS 4, and Supabase. Deployed on Vercel.

### Data Flow

All pages are client-side rendered (`"use client"`). The data flow is:

1. **Pages** call Supabase directly or use services from `src/services/`
2. **Services** (`src/services/`) wrap generic CRUD helpers from `lib/supabase/db.ts` with domain-specific logic and typed return values
3. **`lib/supabase/db.ts`** provides typed generic helpers (`fetchTableData`, `fetchById`, `insertRecord`, `updateRecord`, `deleteRecord`) that operate on any table in the `Database` type
4. **Types** are auto-generated from Supabase schema in `types/supabase.generated.ts`, re-exported with convenience aliases in `types/database.types.ts`

### Supabase Clients (multiple exist)

- `lib/supabase.ts` — Main client used by `useAuth` hook and most pages. Uses `@supabase/ssr` `createBrowserClient`
- `lib/supabase/client.ts` — Non-SSR client (`persistSession: false`). Used by `activity-logger.ts`
- `lib/supabase/db.ts` — Has its own client instance for the generic CRUD layer
- `utils/supabase/client.ts` — Legacy client with `persistSession: true`. Exported as default

### Authentication

- `lib/hooks/useAuth.ts` — Core auth hook providing `user`, `loading`, `isAdmin`, `signIn`, `signOut`, `resetPassword`. Admin role checked via `user_metadata.role` or `app_metadata.role`
- `lib/hooks/useRequireAuth.ts` — Redirects unauthenticated users to `/signin`
- `components/ProtectedRoute.tsx` — Wrapper component that uses `useRequireAuth`; shows spinner while loading
- Protected pages wrap their content in `<ProtectedRoute>` and include `<Sidebar />` for navigation

### Page Layout Pattern

Every authenticated page follows this structure:
```tsx
<ProtectedRoute>
  <div className="flex h-screen">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-gray-50">
      {/* page content */}
    </main>
  </div>
</ProtectedRoute>
```

### Key Directories

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router pages |
| `app/more/` | Extended features — many use the `ComingSoon` placeholder component |
| `components/ui/` | shadcn/ui primitives (new-york style, Lucide icons) |
| `components/layout/sidebar.tsx` | Main navigation — sidebar items defined here |
| `components/<feature>/` | Feature-specific components (products, staff) |
| `src/services/` | Domain service layer wrapping `lib/supabase/db.ts` |
| `lib/supabase/db.ts` | Generic typed Supabase CRUD helpers |
| `lib/hooks/` | React hooks (auth) |
| `lib/validation.ts` | Input validation/sanitization (Indian business context: GST, mobile numbers) |
| `lib/activity-logger.ts` | Logs user actions to `activity_logs` table |
| `types/database.types.ts` | Row/Insert/Enum type aliases from auto-generated schema |
| `types/supabase.generated.ts` | Auto-generated Supabase types (270+ tables) — do not edit manually |

## File Tree

```
app/
├── layout.tsx                        # Root layout (fonts, ToastProvider, Vercel analytics)
├── page.tsx                          # Root redirect → /dashboard or /signin
├── globals.css
├── not-found.tsx
├── signin/page.tsx
├── signup/page.tsx
├── forgot-password/page.tsx
├── pricing/page.tsx
├── dashboard/page.tsx                # Main dashboard with stats, search, alerts
├── products/
│   ├── page.tsx                      # Product listing
│   ├── add/page.tsx
│   ├── [id]/page.tsx                 # Product detail
│   ├── edit/[id]/page.tsx
│   └── attributes/page.tsx
├── orders/
│   ├── page.tsx                      # Order listing
│   ├── create/page.tsx
│   └── [id]/page.tsx
├── inventory/page.tsx
├── retailers/
│   ├── page.tsx
│   ├── [id]/page.tsx
│   └── [id]/edit/page.tsx
├── wholesalers/
│   ├── page.tsx
│   └── [id]/page.tsx
├── wholesaler-links/page.tsx
├── invoices/
│   ├── page.tsx
│   └── create/page.tsx
├── payments/page.tsx
├── deliveries/page.tsx
├── reports/page.tsx
├── staff/
│   ├── layout.tsx
│   └── page.tsx
├── warehouses/
│   ├── page.tsx
│   ├── add/page.tsx
│   ├── [id]/page.tsx
│   ├── batch-tracking/page.tsx
│   ├── low-stock-alerts/page.tsx
│   └── stock-transfers/page.tsx
├── settings/
│   ├── page.tsx
│   └── activity-log.tsx
└── more/                             # Extended features (many are ComingSoon stubs)
    ├── page.tsx
    ├── admin-panel/page.tsx
    ├── analytics/
    │   ├── page.tsx
    │   ├── footfall-analytics/page.tsx
    │   ├── retailer-rankings/page.tsx
    │   └── sales-analytics/page.tsx
    ├── attendance/
    │   ├── page.tsx
    │   ├── mark/page.tsx
    │   ├── leave-balances/page.tsx
    │   ├── leave-requests/page.tsx
    │   └── reports/page.tsx
    ├── barcode-generator/page.tsx
    ├── bulk-upload/page.tsx
    ├── compliance/
    │   ├── page.tsx
    │   ├── audit-trail/page.tsx
    │   ├── documents/page.tsx
    │   └── gst-returns/page.tsx
    ├── credit-management/page.tsx
    ├── customers/page.tsx
    ├── dead-stock-sale/page.tsx
    ├── incognito-mode/page.tsx
    ├── interior-designers/page.tsx
    ├── notifications/page.tsx
    ├── payment-recovery/page.tsx
    ├── photo-search/page.tsx
    ├── price-comparison/page.tsx
    ├── referral-program/page.tsx
    ├── retailer-discovery/page.tsx
    ├── salary-management/page.tsx
    └── wholesalers/page.tsx

components/
├── ComingSoon.tsx                    # Placeholder for unbuilt features
├── ProtectedRoute.tsx                # Auth guard wrapper
├── layout/
│   └── sidebar.tsx                   # Sidebar nav (route list defined here)
├── products/
│   └── products-table.tsx
├── staff/
│   ├── staff-table.tsx
│   ├── staff-salaries.tsx
│   └── staff-performance.tsx
└── ui/                               # shadcn/ui (new-york style)
    ├── alert.tsx          ├── alert-dialog.tsx   ├── avatar.tsx
    ├── badge.tsx          ├── button.tsx         ├── card.tsx
    ├── checkbox.tsx       ├── dialog.tsx         ├── dropdown-menu.tsx
    ├── input.tsx          ├── label.tsx          ├── progress.tsx
    ├── scroll-area.tsx    ├── select.tsx         ├── separator.tsx
    ├── sheet.tsx          ├── skeleton.tsx       ├── switch.tsx
    ├── table.tsx          ├── tabs.tsx           ├── textarea.tsx
    ├── toast.tsx          ├── tooltip.tsx        └── use-toast.ts

lib/
├── utils.ts                          # cn() and helpers
├── validation.ts                     # Input sanitization (GST, mobile, email, etc.)
├── activity-logger.ts                # Logs actions to activity_logs table
├── activityLogger.ts                 # Alternate activity logger
├── supabase.ts                       # Main Supabase browser client (@supabase/ssr)
├── supabase/
│   ├── client.ts                     # Non-SSR Supabase client
│   └── db.ts                         # Generic CRUD helpers (fetchTableData, insertRecord, etc.)
└── hooks/
    ├── useAuth.ts                    # Auth hook (signIn, signOut, isAdmin, etc.)
    └── useRequireAuth.ts             # Redirect-to-signin guard hook

src/services/
├── orderService.ts                   # Order CRUD + getOrdersByRetailer
├── paymentService.ts                 # Payment operations
└── retailerService.ts                # Retailer CRUD + search

types/
├── database.types.ts                 # Convenience type aliases (Row, Insert, Enum)
├── supabase.d.ts                     # Supabase type declarations
└── supabase.generated.ts             # Auto-generated from Supabase (DO NOT EDIT)

utils/supabase/
└── client.ts                         # Legacy Supabase client (persistSession: true)
```

## Conventions

- Always use shadcn/ui components for UI (`components.json` uses new-york style)
- Path alias: `@/` maps to project root
- Currency is INR (₹) throughout the app
- All pages are `"use client"` — no server components or server actions in use
- Sidebar navigation items are defined in `components/layout/sidebar.tsx` — update there when adding new top-level routes
- Many `app/more/*` pages are stubs using the `ComingSoon` component
- The database has 270+ tables with typed enums for statuses (order, invoice, payment, delivery)
