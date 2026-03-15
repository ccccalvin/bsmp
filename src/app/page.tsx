import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Eat well. <span className="text-primary">Spend less.</span>
          </h1>
          <p className="text-lg text-muted max-w-lg mx-auto">
            A student-focused meal planner that builds affordable weekly meal
            plans using real supermarket prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl border border-border bg-secondary">
            <div className="text-2xl mb-2">$</div>
            <h3 className="font-semibold mb-1">Budget-aware</h3>
            <p className="text-sm text-muted">
              Plans optimised for your weekly budget with real Woolworths &amp; Coles
              prices.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-secondary">
            <div className="text-2xl mb-2">&#x1f957;</div>
            <h3 className="font-semibold mb-1">Nutritionally balanced</h3>
            <p className="text-sm text-muted">
              Hit your calorie and protein targets without sacrificing taste.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-secondary">
            <div className="text-2xl mb-2">&#x1f6d2;</div>
            <h3 className="font-semibold mb-1">Ready-to-shop</h3>
            <p className="text-sm text-muted">
              Get a complete shopping list grouped by store with exact costs.
            </p>
          </div>
        </div>

        <Link
          href="/wizard"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
        >
          Get Started
        </Link>

        <p className="text-xs text-muted">
          Supports Woolworths &amp; Coles &middot; 15+ curated recipes &middot; No
          sign-up required
        </p>
      </div>
    </main>
  );
}
