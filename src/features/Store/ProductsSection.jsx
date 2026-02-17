import React from "react";
import ProductCard from "./ProductCard";
import { mockProducts } from "./mockProducts";

export default function ProductsSection() {
  return (
    <section className="w-full min-h-screen flex justify-center px-6 py-16">
      <div className="w-full max-w-[1920px]">
        <h2 className="text-white text-3xl mb-8">Products</h2>

        <div className="flex flex-wrap justify-center gap-12 w-full">
          {mockProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
