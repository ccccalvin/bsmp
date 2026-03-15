import Link from "next/link";
import rawIngredients from "../../../ingredients.json";

type IngredientItem = {
  "Product Name"?: string | null;
  "Produce Price"?: number | null;
  "Produce Sale Price"?: number | null;
  CupMeasure?: string | null;
  CupString?: string | null;
  SmallImageFile?: string | null;
  smallImageFile?: string | null;
};

const PAGE_SIZE = 24;

function normalizeItems(): IngredientItem[] {
  if (!Array.isArray(rawIngredients)) return [];
  const items = rawIngredients as unknown[];
  return items.filter((item) => typeof item === "object" && item !== null) as IngredientItem[];
}

export default async function IngredientsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const allItems = normalizeItems();
  const totalPages = Math.max(1, Math.ceil(allItems.length / PAGE_SIZE));

  const rawPage = Number(params.page ?? "1");
  const page = Number.isFinite(rawPage)
    ? Math.min(totalPages, Math.max(1, Math.floor(rawPage)))
    : 1;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const items = allItems.slice(start, end);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Ingredients Dataset</h1>
            <p className="text-muted mt-1">
              Viewing {items.length} of {allItems.length} items from ingredients.json
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, idx) => {
            const image = item.smallImageFile || item.SmallImageFile;
            const key = `${item["Product Name"] ?? "unknown"}-${start + idx}`;
            const price = item["Produce Sale Price"] ?? item["Produce Price"];

            return (
              <article
                key={key}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={item["Product Name"] ?? "Ingredient"}
                    className="w-full h-36 object-cover bg-secondary"
                  />
                ) : (
                  <div className="w-full h-36 bg-secondary" />
                )}

                <div className="p-4 space-y-2">
                  <h2 className="font-semibold leading-snug line-clamp-2 min-h-[3rem]">
                    {item["Product Name"] ?? "Unnamed ingredient"}
                  </h2>
                  <p className="text-primary font-bold">
                    ${typeof price === "number" ? price.toFixed(2) : "-"}
                  </p>
                  <p className="text-xs text-muted">
                    {item.CupString ?? item.CupMeasure ?? "No unit info"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Link
            href={`/ingredients?page=${Math.max(1, page - 1)}`}
            aria-disabled={page <= 1}
            className={`px-3 py-2 rounded-md border border-border text-sm ${
              page <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-secondary transition-colors"
            }`}
          >
            Previous
          </Link>

          <span className="text-sm text-muted px-3">
            Page {page} of {totalPages}
          </span>

          <Link
            href={`/ingredients?page=${Math.min(totalPages, page + 1)}`}
            aria-disabled={page >= totalPages}
            className={`px-3 py-2 rounded-md border border-border text-sm ${
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-secondary transition-colors"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}
