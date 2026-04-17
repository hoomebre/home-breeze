import { Suspense } from "react";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { supabase } from "@/lib/supabase";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : null;
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : 2000;
  const sort = typeof params.sort === "string" ? params.sort : "featured";

  // Build Supabase Query
  let query = supabase
    .from('products')
    .select('*, categories!inner(slug), product_images(*)')
    .eq('is_active', true)
    .lte('price', maxPrice);

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  // Sorting
  if (sort === "price_asc") {
    query = query.order('price', { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order('price', { ascending: false });
  } else if (sort === "newest") {
    query = query.order('created_at', { ascending: false });
  } else {
    // featured
    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data: productsData, error } = await query;

  const mappedProducts = (productsData || []).map(p => ({
    ...p,
    images: p.product_images || []
  }));

  return (
    <div className="bg-background min-h-screen">
      {/* Header spacer */}
      <div className="bg-primary pt-20 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-4">
          All Products
        </h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">
          Explore our complete collection of premium sanitary products, meticulously crafted for modern living spaces.
        </p>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <Suspense fallback={<div className="w-64 h-96 bg-muted animate-pulse rounded-xl hidden md:block" />}>
            <FilterSidebar />
          </Suspense>

          <div className="flex-1">
            <ProductGrid products={mappedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
