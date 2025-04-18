// // "use client";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Card } from "@/components/ui/card";
// import { Prisma } from "@prisma/client";
// import { format } from "date-fns";
// import OrderProductItem from "./order-product-item";
// import { Separator } from "@/components/ui/separator";
// import { useMemo } from "react";
// import { computeProductTotalPrice } from "@/helpers/product";
// import { getOrderStatus } from "../../app/(shop)/orders/helpers/status";
// // import { useRouter } from "next/navigation";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";


// interface OrderItemProps {
//   order: Prisma.OrderGetPayload<{
//     include: {
//       orderProducts: {
//         include: { product: true };
//       };
//     };
//   }>;
// }

// const OrderItem = ({ order }: OrderItemProps) => {
//   // const router = useRouter();
//   const subtotal = useMemo(() => {
//     return order.orderProducts.reduce((acc, orderProduct) => {
//       return (
//         acc + Number(orderProduct.product.basePrice) * orderProduct.quantity
//       );
//     }, 0);
//   }, [order.orderProducts]);

//   const total = useMemo(() => {
//     return order.orderProducts.reduce((acc, product) => {
//       const productTotalPrice = computeProductTotalPrice(product.product);

//       return acc + productTotalPrice * product.quantity;
//     }, 0);
//   }, [order.orderProducts]);

//   const totalDiscounts = subtotal - total;

//   // const handleStatusClick = async () => {
//   //   if (order.status === "WAITING_FOR_PAYMENT") {
//   //     try {
//   //       // Verifica se o link de pagamento está disponível
//   //       if (!order.paymentUrl) {
//   //         toast.error("Link de pagamento não encontrado.");
//   //         return;
//   //       }

//   //       // Redireciona o usuário para o link de pagamento
//   //       router.push(order.paymentUrl);
//   //     } catch (error) {
//   //       console.error("Erro ao redirecionar para o pagamento:", error);
//   //       toast.error("Ocorreu um erro ao redirecionar para o pagamento.");
//   //     }
//   //   }
//   // };

//   // const handleStatusClick = async () => {
//   //   if (order.status === "WAITING_FOR_PAYMENT") {
//   //     try {
//   //       if (!order.paymentUrl) {
//   //         toast.error("Link de pagamento não encontrado.");
//   //         return;
//   //       }
  
//   //       // Redireciona o usuário para o link de pagamento
//   //       window.location.href = order.paymentUrl;
//   //     } catch (error) {
//   //       console.error("Erro ao redirecionar para o pagamento:", error);
//   //       toast.error("Ocorreu um erro ao redirecionar para o pagamento.");
//   //     }
//   //   }
//   // };

//   return (
//     <Card className="px-5">
//       <Accordion type="single" className="w-full" collapsible>
//         <AccordionItem value={order.id}>
//           <AccordionTrigger>
//             <div className="flex w-full text-left">
//               <div className="flex flex-1 flex-col gap-1 text-left">
//                 <p className="text-sm font-bold uppercase lg:text-base">
//                   Pedido com {order.orderProducts.length} produto(s)
//                 </p>
//                 <span className="text-xs opacity-60">
//                   Feito em {format(order.createdAt, "d/MM/y 'às' HH:mm")}
//                 </span>
//               </div>

//               <div className="hidden flex-1 font-bold lg:block">
//                 <p className="text-xs lg:text-sm">Status</p>
//                 <p className="text-xs text-[#8162FF] lg:text-sm">
//                   {getOrderStatus(order.status)}
//                 </p>
//               </div>

//               <div className="hidden flex-1 lg:block">
//                 <p className="text-xs font-bold lg:text-sm ">Data</p>
//                 <p className="text-xs opacity-60 lg:text-sm">
//                   {format(order.createdAt, "d/MM/y")}
//                 </p>
//               </div>

//               <div className="hidden flex-1 lg:block">
//                 <p className="text-xs font-bold lg:text-sm">Pagamento</p>
//                 <p className="text-xs opacity-60 lg:text-sm">Cartão</p>
//               </div>
//             </div>
//           </AccordionTrigger>

//           <AccordionContent>
//             <div className="flex flex-col gap-4">
//               <div className="flex items-center justify-between lg:hidden">
//                 <div className="font-bold">
//                   <p className="text-xs lg:text-sm">Status</p>
//                   <p className="text-xs text-[#8162FF] lg:text-sm">
//                     {getOrderStatus(order.status)}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-bold lg:text-sm">Data</p>
//                   <p className="text-xs opacity-60 lg:text-sm">
//                     {format(order.createdAt, "d/MM/y")}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="text-xs font-bold lg:text-sm">Pagamento</p>
//                   <p className="text-xs opacity-60 lg:text-sm">Cartão</p>
//                 </div>
//               </div>

//               {order.orderProducts.map((orderProduct) => (
//                 <OrderProductItem
//                   key={orderProduct.id}
//                   orderProduct={orderProduct}
//                 />
//               ))}

//               <div className="flex w-full flex-col gap-1 text-xs">
//                 <Separator />

//                 <div className="flex w-full justify-between py-3 lg:text-sm">
//                   <p>Subtotal</p>
//                   <p>R$ {subtotal.toFixed(2)}</p>
//                 </div>

//                 <Separator />

//                 <div className="flex w-full justify-between py-3 lg:text-sm">
//                   <p>Entrega</p>
//                   <p>GRÁTIS</p>
//                 </div>

//                 <Separator />

//                 <div className="flex w-full justify-between py-3 lg:text-sm">
//                   <p>Descontos</p>
//                   <p>-R$ {totalDiscounts.toFixed(2)}</p>
//                 </div>

//                 <Separator />

//                 <div className="flex w-full justify-between py-3 text-sm font-bold lg:text-base">
//                   <p>Total</p>
//                   <p>R$ {total.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </Card>
//   );
// };

// export default OrderItem;

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import OrderProductItem from "./order-product-item";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { computeProductTotalPrice } from "@/helpers/product";
import { getOrderStatus } from "../../app/(shop)/orders/helpers/status";
// import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      orderProducts: {
        include: { product: true };
      };
    };
  }>;
}

const OrderItem = ({ order }: OrderItemProps) => {
  // const router = useRouter();
  const subtotal = useMemo(() => {
    return order.orderProducts.reduce((acc, orderProduct) => {
      return (
        acc + Number(orderProduct.product.basePrice) * orderProduct.quantity
      );
    }, 0);
  }, [order.orderProducts]);

  const total = useMemo(() => {
    return order.orderProducts.reduce((acc, product) => {
      const productTotalPrice = computeProductTotalPrice(product.product);

      return acc + productTotalPrice * product.quantity;
    }, 0);
  }, [order.orderProducts]);

  const totalDiscounts = subtotal - total;

  const handleStatusClick = () => {
    if (order.status === "WAITING_FOR_PAYMENT") {
      if (!order.paymentUrl) {
        toast.error("Link de pagamento não encontrado!");
        return;
      }
      
      window.location.href = order.paymentUrl;
    }
  };

  // const handleStatusClick = () => {
  //   if (order.status === "WAITING_FOR_PAYMENT") {
  //     if (!order.paymentUrl) {
  //       toast.error("Link de pagamento não encontrado!");
  //       return;
  //     }
  //     window.location.href = order.paymentUrl;
  //   } else if (order.status === "PAYMENT_CONFIRMED") {
  //     if (!order.receiptUrl) {
  //       toast.error("Comprovante não disponível!");
  //       return;
  //     }
  //     window.location.href = order.receiptUrl;
  //   }
  // };

  return (
    <Card className="px-5">
      <Accordion type="single" className="w-full" collapsible>
        <AccordionItem value={order.id}>
          <AccordionTrigger>
            <div className="flex w-full text-left">
              <div className="flex flex-1 flex-col gap-1 text-left">
                <p className="text-sm font-bold uppercase lg:text-base">
                  Pedido com {order.orderProducts.length} produto(s)
                </p>
                <span className="text-xs opacity-60">
                  Feito em {format(order.createdAt, "d/MM/y 'às' HH:mm")}
                </span>
              </div>

              <div className="hidden flex-1 font-bold lg:block" onClick={(e) => {
                  e.stopPropagation();
                  handleStatusClick();
                }}>
                <p className="text-xs lg:text-sm">Status</p>
                <p className="text-xs text-[#8162FF] lg:text-sm">
                  {getOrderStatus(order.status)}
                </p>
              </div>

              <div className="hidden flex-1 lg:block">
                <p className="text-xs font-bold lg:text-sm ">Data</p>
                <p className="text-xs opacity-60 lg:text-sm">
                  {format(order.createdAt, "d/MM/y")}
                </p>
              </div>

              <div className="hidden flex-1 lg:block">
                <p className="text-xs font-bold lg:text-sm">Pagamento</p>
                <p className="text-xs opacity-60 lg:text-sm">Cartão</p>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between lg:hidden">
                <div className="font-bold">
                  <p className="text-xs lg:text-sm">Status</p>
                  <p className="text-xs text-[#8162FF] lg:text-sm">
                    {getOrderStatus(order.status)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold lg:text-sm">Data</p>
                  <p className="text-xs opacity-60 lg:text-sm">
                    {format(order.createdAt, "d/MM/y")}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold lg:text-sm">Pagamento</p>
                  <p className="text-xs opacity-60 lg:text-sm">Cartão</p>
                </div>
              </div>

              {order.orderProducts.map((orderProduct) => (
                <OrderProductItem
                  key={orderProduct.id}
                  orderProduct={orderProduct}
                />
              ))}

              <div className="flex w-full flex-col gap-1 text-xs">
                <Separator />

                <div className="flex w-full justify-between py-3 lg:text-sm">
                  <p>Subtotal</p>
                  <p>R$ {subtotal.toFixed(2)}</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3 lg:text-sm">
                  <p>Entrega</p>
                  <p>GRÁTIS</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3 lg:text-sm">
                  <p>Descontos</p>
                  <p>-R$ {totalDiscounts.toFixed(2)}</p>
                </div>

                <Separator />

                <div className="flex w-full justify-between py-3 text-sm font-bold lg:text-base">
                  <p>Total</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default OrderItem;
