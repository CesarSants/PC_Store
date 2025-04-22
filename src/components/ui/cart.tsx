// import { ShoppingCartIcon } from "lucide-react";
// import { Badge } from "./badge";
// import { useContext } from "react";
// import { CartContext } from "@/providers/cart";
// import CartItem from "./cart-item";
// import { computeProductTotalPrice } from "@/helpers/product";
// import { Separator } from "./separator";
// import { ScrollArea } from "./scroll-area";
// import { Button } from "./button";
// import { createCheckout } from "@/actions/checkout";
// import { loadStripe } from "@stripe/stripe-js";
// import { createOrder } from "@/actions/order";
// import { useSession } from "next-auth/react";

// const Cart = () => {
//   const { data } = useSession();

//   const { products, subtotal, total, totalDiscount } = useContext(CartContext);

//   const handleFinishPurchaseClick = async () => {
//     if (!data?.user) {
//       // TODO: redirecionar para o login
//       return;
//     }

//     const order = await createOrder(products, (data?.user as any).id);

//     const checkout = await createCheckout(products, order.id);

//     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

//     // Criar pedido no banco

//     stripe?.redirectToCheckout({
//       sessionId: checkout.id,
//     });
//   };

//   return (
//     <div className="flex h-full flex-col gap-8">
//       <Badge variant="heading">
//         <ShoppingCartIcon size={16} />
//         Carrinho
//       </Badge>

//       {/* RENDERIZAR OS PRODUTOS */}
//       <div className="flex h-full max-h-full flex-col gap-5 overflow-hidden">
//         <ScrollArea className="h-full">
//           <div className="flex h-full flex-col gap-8">
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <CartItem
//                   key={product.id}
//                   product={{
//                     ...product,
//                     totalPrice: computeProductTotalPrice(product),
//                   }}
//                 />
//               ))
//             ) : (
//               <p className="text-center font-semibold">
//                 Carrinho vazio. Vamos fazer compras?
//               </p>
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       {products.length > 0 && (
//         <div className="flex flex-col gap-3">
//           <Separator />

//           <div className="flex items-center justify-between text-xs lg:text-sm">
//             <p>Subtotal</p>
//             <p>R$ {subtotal.toFixed(2)}</p>
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between text-xs lg:text-sm">
//             <p>Entrega</p>
//             <p>GRÁTIS</p>
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between text-xs lg:text-sm">
//             <p>Descontos</p>
//             <p>- R$ {totalDiscount.toFixed(2)}</p>
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between text-sm font-bold lg:text-base">
//             <p>Total</p>
//             <p>R$ {total.toFixed(2)}</p>
//           </div>

//           <Button
//             className="mt-7 font-bold uppercase"
//             onClick={handleFinishPurchaseClick}
//           >
//             Finalizar compra
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "./badge";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/providers/cart";
import CartItem from "./cart-item";
import { computeProductTotalPrice } from "@/helpers/product";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { createCheckout } from "@/actions/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { createOrder } from "@/actions/order";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { products, subtotal, total, totalDiscount, clearCart } = useContext(CartContext);

  // const handleFinishPurchaseClick = async () => {
  //   if (!data?.user) {
  //     // TODO: redirecionar para o login
  //     return;
  //   }

  //   try {
  //     const order = await createOrder(products, (data?.user as any).id);
  //     const checkout = await createCheckout(products, order.id);

  //     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  //     stripe?.redirectToCheckout({
  //       sessionId: checkout.id,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Erro ao processar a compra");
  //   }
  // };

  useEffect(() => {
    // Verificar mudança de status do pedido periodicamente
    const checkOrderStatus = () => {
      const pendingOrderId = localStorage.getItem("@pc-store/pending-order");
      
      if (pendingOrderId) {
        // Limpar carrinho se houver um pedido pendente
        clearCart();
        localStorage.removeItem("@pc-store/pending-order");
      }
    };

    // Tentar usar BroadcastChannel primeiro
    try {
      const channel = new BroadcastChannel('payment-success');
      
      channel.onmessage = (event) => {
        console.log("[Cart] Payment success event received");
        clearCart();
        toast.success("Pagamento realizado com sucesso!");
      };

      return () => channel.close();
    } catch (error) {
      // Fallback para polling se BroadcastChannel não estiver disponível
      const interval = setInterval(checkOrderStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [clearCart]);

  const handleFinishPurchaseClick = async () => {
    if (!data?.user) {
      // TODO: redirecionar para o login
      return;
    }

    try {
      setIsLoading(true); // Desabilita o botão

      const order = await createOrder(products, (data?.user as any).id);
      const checkout = await createCheckout(products, order.id);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

      localStorage.setItem("@pc-store/pending-order", order.id);

      // Se algo der errado no redirecionamento, o botão será habilitado novamente
      const result = await stripe?.redirectToCheckout({
        sessionId: checkout.id,
      });

      if (result?.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar a compra");
      setIsLoading(false); // Reabilita o botão em caso de erro
    }
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <Badge variant="heading">
        <ShoppingCartIcon size={16} />
        Carrinho
      </Badge>

      {/* RENDERIZAR OS PRODUTOS */}
      <div className="flex h-full max-h-full flex-col gap-5 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex h-full flex-col gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <CartItem
                  key={product.id}
                  product={{
                    ...product,
                    totalPrice: computeProductTotalPrice(product),
                  }}
                />
              ))
            ) : (
              <p className="text-center font-semibold">
                Carrinho vazio. Vamos fazer compras?
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {products.length > 0 && (
        <div className="flex flex-col gap-3">
          <Separator />

          <div className="flex items-center justify-between text-xs lg:text-sm">
            <p>Subtotal</p>
            <p>R$ {subtotal.toFixed(2)}</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs lg:text-sm">
            <p>Entrega</p>
            <p>GRÁTIS</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs lg:text-sm">
            <p>Descontos</p>
            <p>- R$ {totalDiscount.toFixed(2)}</p>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-sm font-bold lg:text-base">
            <p>Total</p>
            <p>R$ {total.toFixed(2)}</p>
          </div>

          <Button
            className="mt-7 font-bold uppercase"
            onClick={handleFinishPurchaseClick}
            disabled={isLoading}
          >
            Finalizar compra
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
