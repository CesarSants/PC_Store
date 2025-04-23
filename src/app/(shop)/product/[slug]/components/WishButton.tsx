"use client";

import { addProductToWishlist, removeProductFromWishlist } from "@/actions/Wishlist";
import { StarIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LoadingButton from "../../../../../components/ui/loading-button";
import { WishList } from "@prisma/client";

interface WishButtonProps {
  productId: string;
  wishLists: WishList[];
}
const WishButton = ({ productId, wishLists }: WishButtonProps) => {
  const { data: session } = useSession();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // const handleAddToWishlist = async () => {
  //   setLoading(true);
  //   if (!session || !session.user) {
  //     toast("Você precisa estar logado para adicionar aos favoritos", {
  //       action: {
  //         label: "Login",
  //         onClick: () => {
  //           signIn();
  //         },
  //       },
  //       classNames: {
  //         toast: "bg-red-500 border-red-500",
  //         title: "text-white",
  //         actionButton: "!text-red-500 !bg-white font-bold",
  //       },
  //     });

  //     setLoading(false);
  //     return;
  //   }

  //   await addProductToWishlist(session.user.id, productId);

  //   router.refresh();

  //   toast("Produto adicionado aos favoritos", {
  //     action: {
  //       label: "Ver favoritos",
  //       onClick: () => {
  //         router.push("/wish-list");
  //       },
  //     },
  //   });

  //   setLoading(false);
  // };

  const isInWishlist = wishLists.some(
    (wishlist) => wishlist.userId === session?.user?.id
  );

  const handleAddToWishlist = async () => {
    setLoading(true);

    if (!session || !session.user) {
      toast("Você precisa estar logado para gerenciar favoritos", {
        action: {
          label: "Login",
          onClick: () => {
            signIn();
          },
        },
        classNames: {
          toast: "bg-red-500 border-red-500",
          title: "text-white",
          actionButton: "!text-red-500 !bg-white font-bold",
        },
      });

      setLoading(false);
      return;
    }

    try {
      if (isInWishlist) {
        // Remove o produto da wishlist
        await removeProductFromWishlist(session.user.id, productId);
        toast("Produto removido dos favoritos",{
          action: {
            label: "Ver favoritos",
            onClick: () => {
              router.push("/wish-list");
            },
          },
        });
      } else {
        // Adiciona o produto na wishlist
        await addProductToWishlist(session.user.id, productId);
        toast("Produto adicionado aos favoritos", {
          action: {
            label: "Ver favoritos",
            onClick: () => {
              router.push("/wish-list");
            },
          },
        });
      }

      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar favoritos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      textWaiting={isInWishlist ? "Removendo dos favoritos" : "Adicionando aos favoritos"}
      className="uppercase"
      onClick={handleAddToWishlist}
    >
      <StarIcon
        className={"h-5 w-5 " + (isInWishlist && "fill-white")}
      />
      Favoritos
    </LoadingButton>
  );
};

export default WishButton;
