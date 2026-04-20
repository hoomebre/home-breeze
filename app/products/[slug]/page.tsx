import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductCard } from "@/components/product/ProductCard";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch product with images
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  // Format images for the gallery
  const mappedProduct = {
    ...product,
    images: product.product_images || []
  };

  // Fetch Related Products (same category)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(4);

  const mappedRelated = (relatedProducts || []).map(p => ({
    ...p,
    images: p.product_images || []
  }));

  return (
    <div className="bg-background min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Gallery */}
          <div className="h-full">
            <ProductGallery images={mappedProduct.images} productName={product.name} />
          </div>

          {/* Right Column: Info */}
          <div>
            <ProductInfo product={mappedProduct} />
          </div>
        </div>

        {/* Specifications */}
        <ProductSpecs specifications={product.specifications} />

        {/* Related Products */}
        {mappedRelated.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-serif font-semibold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {mappedRelated.map((relatedProduct) => (
                <div key={relatedProduct.id} className="h-full">
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
