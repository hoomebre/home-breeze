import { ProductSpecification } from "@/types";

interface ProductSpecsProps {
  specifications: ProductSpecification[];
}

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <h2 className="text-2xl font-serif font-semibold mb-8">Product Specifications</h2>
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody>
            {specifications.map((spec, index) => (
              <tr 
                key={index} 
                className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? "bg-card" : "bg-muted/30"
                }`}
              >
                <th className="py-4 px-6 font-medium text-foreground w-1/3 md:w-1/4">
                  {spec.spec_name}
                </th>
                <td className="py-4 px-6 text-muted-foreground w-2/3 md:w-3/4">
                  {spec.spec_value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
