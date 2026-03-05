import React from "react";
import Background from "../components/ui/Background";
import ProductsSection from "../features/Store/ProductsSection";

export default function Store() {
  return (
    <Background variant="dark" glowOpacity={0.28} glowBlur={170}>
      <ProductsSection />
    </Background>

      
    
  );
}
