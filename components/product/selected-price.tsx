"use client";

import Price from "components/price";
import type { Product } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";

export function SelectedPrice({ product }: { product: Product }) {
  const params = useSearchParams();
  const variant = product.variants.find((item) =>
    item.selectedOptions.every((option) => params.get(option.name.toLowerCase()) === option.value)
  );
  if (variant) return <Price amount={variant.price.amount} currencyCode={variant.price.currencyCode} />;
  return <span className="flex items-center gap-1"><Price amount={product.priceRange.minVariantPrice.amount} currencyCode={product.priceRange.minVariantPrice.currencyCode} /><span>–</span><Price amount={product.priceRange.maxVariantPrice.amount} currencyCode={product.priceRange.maxVariantPrice.currencyCode} /></span>;
}
