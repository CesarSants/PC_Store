import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import ProductInfo from "./components/product-info";
import { computeProductTotalPrice } from "@/helpers/product";
import ProductList from "@/components/ui/product-list";
import SectionTitle from "@/components/ui/section-title";
import ScrollableContainer from "../../(home)/components/ScrollableContainer";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

const ProductDetailsPage = async ({
  params: { slug },
}: ProductDetailsPageProps) => {
  const product = await prismaClient.product.findFirst({
    where: {
      slug: slug,
    },
    include: {
      category: {
        include: {
          products: {
            where: {
              slug: {
                not: slug,
              },
            },
          },
        },
      },
      wishLists: true,
    },
  });

  console.log(product);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-8 pb-8 lg:container lg:mx-auto lg:gap-10 lg:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-9  lg:px-5">
        <ProductImages imageUrls={product.imageUrls} name={product.name} />
        <ProductInfo
          product={{
            ...product,
            totalPrice: computeProductTotalPrice(product),
          }}
        />
      </div>

      <div className="flex flex-col gap-5">
        <SectionTitle className="pl-5 text-center">Produtos Recomendados</SectionTitle>
          <ScrollableContainer>
            <ProductList products={product.category.products} />
          </ScrollableContainer>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
