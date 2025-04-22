// "use server";

// import { CartProduct } from "@/providers/cart";
// import Stripe from "stripe";

// export const createCheckout = async (
//   products: CartProduct[],
//   orderId: string,
// ) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: "2025-03-31.basil",
//   });

//   const checkout = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     success_url: process.env.HOST_URL,
//     cancel_url: process.env.HOST_URL,
//     metadata: {
//       orderId,
//     },
//     line_items: products.map((product) => {
//       return {
//         price_data: {
//           currency: "brl",
//           product_data: {
//             name: product.name,
//             description: product.description,
//             images: product.imageUrls,
//           },
//           unit_amount: product.totalPrice * 100,
//         },
//         quantity: product.quantity,
//       };
//     }),
//   });

//   // RETORNAR O CHECKOUT
//   return checkout;
// };

"use server";

import { CartProduct } from "@/providers/cart";
import { prismaClient } from "@/lib/prisma";
import Stripe from "stripe";

export const createCheckout = async (
  products: CartProduct[],
  orderId: string,
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    // success_url: `${process.env.HOST_URL}/success?orderId=${orderId}`,
    // cancel_url: `${process.env.HOST_URL}/cancel?orderId=${orderId}`,
    // success_url: process.env.HOST_URL,
    // cancel_url: process.env.HOST_URL,
    success_url: `${process.env.HOST_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.HOST_URL}/orders`,
    metadata: {
      orderId,
    },
    line_items: products.map((product) => {
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.imageUrls,
          },
          unit_amount: product.totalPrice * 100,
        },
        quantity: product.quantity,
      };
    }),
  });

  // Atualiza o pedido com a URL de pagamento
  await prismaClient.order.update({
    where: { id: orderId },
    data: { 
      paymentUrl: checkout.url 
    },
  });

  return checkout;
};