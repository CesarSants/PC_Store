import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET_KEY,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      },
    );
    const lineItems = sessionWithLineItems.line_items;

    // ATUALIZAR PEDIDO
    await prismaClient.order.update({
      where: {
        id: session.metadata.orderId,
      },
      data: {
        status: "PAYMENT_CONFIRMED",
      },
    });
  }

  return NextResponse.json({ received: true });
};

// http://localhost:3000/api/order/payment-success

// import { prismaClient } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-03-31.basil",
// });

// export const POST = async (request: Request) => {
//   const signature = request.headers.get("stripe-signature");

//   if (!signature) {
//     return NextResponse.error();
//   }

//   const text = await request.text();
//   const event = stripe.webhooks.constructEvent(
//     text,
//     signature,
//     process.env.STRIPE_WEBHOOK_SECRET_KEY,
//   );

//   try {
//     console.log(`Evento recebido: ${event.type}`);
//     console.log('Dados do evento:', JSON.stringify(event.data, null, 2));

//     // Eventos relacionados ao pagamento
//     const paymentEvents = [
//       "payment_intent.succeeded",
//       "charge.succeeded",
//       "charge.updated",
//       "checkout.session.completed"
//     ];

//     if (paymentEvents.includes(event.type)) {
//       let orderId = null;
//       let receiptUrl = null;

//       // Extrair informações com base no tipo de evento
//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object as any;
//         orderId = session.metadata.orderId;
        
//         // Atualiza status do pedido
//         await prismaClient.order.update({
//           where: { id: orderId },
//           data: { status: "PAYMENT_CONFIRMED" }
//         });
//       }

//       if (["charge.succeeded", "charge.updated"].includes(event.type)) {
//         const charge = event.data.object as Stripe.Charge;
        
//         if (charge.payment_intent && charge.receipt_url) {
//           const paymentIntent = await stripe.paymentIntents.retrieve(
//             charge.payment_intent as string
//           );
          
//           orderId = paymentIntent.metadata.orderId;
//           receiptUrl = charge.receipt_url;

//           // Log detalhado
//           console.log('Charge ID:', charge.id);
//           console.log('Payment Intent:', charge.payment_intent);
//           console.log('Receipt URL:', receiptUrl);
//           console.log('Order ID:', orderId);
//         }
//       }

//       // Se temos orderId e receiptUrl, atualiza o pedido
//       if (orderId && receiptUrl) {
//         await prismaClient.order.update({
//           where: { id: orderId },
//           data: { receiptUrl }
//         });
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed" }, 
//       { status: 400 }
//     );
//   }
// };