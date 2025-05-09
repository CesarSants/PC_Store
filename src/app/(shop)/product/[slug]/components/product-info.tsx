"use client";

import { Button } from "@/components/ui/button";
import DiscountBadge from "@/components/ui/discount-badge";
import { ProductWithTotalPrice } from "@/helpers/product";
import { CartContext } from "@/providers/cart";
import { ArrowLeftIcon, ArrowRightIcon, TruckIcon } from "lucide-react";
import { useContext, useState } from "react";
import WishButton from "./WishButton";
import { WishList } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../../../../components/ui/sheet";
import Cart from "@/components/ui/cart";

interface ProductWithTotalPriceAndWishLists extends ProductWithTotalPrice {
  wishLists: WishList[];
}

interface ProductInfoProps {
  product: ProductWithTotalPriceAndWishLists;
}

const ProductInfo = ( { product } : ProductInfoProps) => {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const handleViewCartClick = () => {
    // Abre o segundo Sheet (carrinho)
    setIsCartSheetOpen(true);
  };

  console.log(product.wishLists);
  const [quantity, setQuantity] = useState(1);

  const { addProductToCart } = useContext(CartContext);

  const handleDecreaseQuantityClick = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleIncreaseQuantityClick = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCartClick = () => {
    addProductToCart({ ...product, quantity });
  };

  return (
    <div className="flex flex-col px-5 lg:w-[40%] lg:rounded-lg lg:bg-accent lg:p-10">
      <h2 className="text-lg lg:text-2xl">{product.name}</h2>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold lg:text-3xl">
          R$ {Number(product.totalPrice).toFixed(2)}
        </h1>
        {product.discountPercentage > 0 && (
          <DiscountBadge className="lg:text-base">
            {product.discountPercentage}
          </DiscountBadge>
        )}
      </div>

      {product.discountPercentage > 0 && (
        <p className="text-sm line-through opacity-75 lg:text-base">
          R$ {Number(product.basePrice).toFixed(2)}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleDecreaseQuantityClick}
        >
          <ArrowLeftIcon size={16} />
        </Button>

        <span>{quantity}</span>

        <Button
          size="icon"
          variant="outline"
          onClick={handleIncreaseQuantityClick}
        >
          <ArrowRightIcon size={16} />
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <h3 className="font-bold">Descrição</h3>
        <p className="text-justify text-sm opacity-60">{product.description}</p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <WishButton productId={product.id} wishLists={product.wishLists}  />

        {/* <Sheet>
          <SheetTrigger asChild>
            <Button className="font-bold uppercase" onClick={handleAddToCartClick}>
              Adicionar ao carrinho
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] lg:w-[600px] lg:max-w-[600px]">
            {/* <h2 className="text-lg font-bold">Carrinho</h2>
            <p>Produto adicionado ao carrinho com sucesso!</p> */}{/*
            <Cart />
          </SheetContent>
        </Sheet> */}

        
        <Sheet>
          <SheetTrigger asChild>
            <Button className="font-bold uppercase" onClick={handleAddToCartClick}>
              Adicionar ao carrinho
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[350px] lg:w-[600px] lg:max-w-[600px]">
            <h2 className="text-lg font-bold">Carrinho</h2>
            <p>Produto adicionado ao carrinho com sucesso!</p>
            <SheetClose asChild>
              <Button
                className="font-bold uppercase mt-4"
                onClick={() => {
                  handleViewCartClick();
                }}
              >
                Ver o carrinho
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>

        <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
          <SheetContent side="right" className="w-[350px] lg:w-[600px] lg:max-w-[600px]">
            <Cart />
          </SheetContent>
        </Sheet>

        <div className="flex items-center justify-between rounded-lg bg-accent px-5 py-2 lg:bg-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <TruckIcon />

            <div className="flex flex-col">
              <p className="text-xs">
                Entrega via <span className="font-bold">FSPacket®</span>
              </p>
              <p className="text-xs text-[#8162FF]">
                Envio para <span className="font-bold">todo Brasil</span>
              </p>
            </div>
          </div>

          <p className="text-xs font-bold">Frete grátis</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
