"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get("maxPrice")) || 2000);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "featured");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order');
      if (data) setCategories(data);
      setLoading(false);
    };
    fetchCategories();

    setSelectedCategory(searchParams.get("category"));
    setMaxPrice(Number(searchParams.get("maxPrice")) || 2000);
    setSortBy(searchParams.get("sort") || "featured");
  }, [searchParams]);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    const newCategory = selectedCategory === slug ? null : slug;
    setSelectedCategory(newCategory);
    updateFilters("category", newCategory);
  };

  const handlePriceChange = (value: number) => {
    setMaxPrice(value);
    // Debounce this in a real app, but for demo we can update directly
    updateFilters("maxPrice", value.toString());
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    updateFilters("sort", newSort === "featured" ? null : newSort);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4">Categories</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                <div 
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    selectedCategory === cat.slug 
                      ? "bg-accent border-accent text-primary" 
                      : "border-input group-hover:border-accent"
                  }`}
                >
                  {selectedCategory === cat.slug && <Check className="w-3 h-3" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedCategory === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                />
                <span className={`text-sm ${selectedCategory === cat.slug ? "font-medium" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4">Max Price: ${maxPrice}</h3>
        <div className="px-2">
          {/* Note: In a real implementation we would use a full dual thumb slider, here we use range input for simplicity if Slider is not available, but we'll try Shadcn Slider API Assuming standard 1 thumb */}
          <input 
            type="range"
            min="0"
            max="2000"
            step="50"
            value={maxPrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>$0</span>
            <span>$2000+</span>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4">Sort By</h3>
        <select 
          value={sortBy}
          onChange={handleSortChange}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {(selectedCategory || maxPrice < 2000 || sortBy !== "featured") && (
        <button 
          onClick={clearFilters}
          className="w-full py-2 text-sm text-destructive hover:underline"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Drawer */}
      <div className="md:hidden w-full mb-6 flex justify-between items-center">
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters & Sort</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-serif text-2xl text-left">Filters</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
        
        {/* Active mobile sort display */}
        <span className="text-sm text-muted-foreground">
          {sortBy === "price_asc" ? "Low to High" : sortBy === "price_desc" ? "High to Low" : "Featured"}
        </span>
      </div>
    </>
  );
}
