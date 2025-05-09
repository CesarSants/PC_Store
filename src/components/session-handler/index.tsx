"use client"

import { CartContext } from "@/providers/cart";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function SessionHandler() {
    // const { clearCart } = useContext(CartContext);
    // const router = useRouter();
    // const searchParams = useSearchParams();
    // const hasHandledSession = useRef(false);
    const { clearCart, products } = useContext(CartContext);
    const [hasCheckedSession, setHasCheckedSession] = useState(false);

    // useEffect(() => {
    //     const sessionId = searchParams.get('session_id');
        
    //     // Only handle session once to prevent infinite loop
    //     if (sessionId && !hasHandledSession.current) {
    //     clearCart();
    //     toast.success('Compra realizada com sucesso!');
        
    //     // Mark as handled
    //     hasHandledSession.current = true;
        
    //     // Use window.history instead of router.replace
    //     window.history.replaceState({}, '', window.location.pathname);
    //     }
    // }, [searchParams, clearCart]);

    //   useEffect(() => {
    //     // Verifica o parâmetro success na URL
    //     const searchParams = new URLSearchParams(window.location.search);
    //     const sessionId = searchParams.get('session_id');
        
    //     if (sessionId) {
    //       clearCart();
    //       toast.success('Compra realizada com sucesso!');
    
    //       const newUrl = window.location.pathname;
    //       window.history.replaceState({}, '', newUrl);
    //     }
    //   }, [clearCart]);
    useEffect(() => {
        // Só executa após o CartContext estar inicializado (products disponível)
        if (!hasCheckedSession && products !== undefined) {
            const searchParams = new URLSearchParams(window.location.search);
            const sessionId = searchParams.get('session_id');
            
            if (sessionId) {
                try {
                    clearCart();
                    toast.success('Compra realizada com sucesso!');
                } catch (error) {
                    console.error("Erro ao limpar carrinho:", error);
                } finally {
                    // Remove o parâmetro da URL
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    setHasCheckedSession(true);
                }
            }
        }
    }, [clearCart, products, hasCheckedSession]);

    return null;
}