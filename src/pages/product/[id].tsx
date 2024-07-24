import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "@/styles/pages/product";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Head from "next/head";
import { useCart } from "@/Hooks/useCart";
import { IProduct } from "@/contexts/CartContext";

interface ProductProps {
  product: IProduct;
}

export default function Product({ product }: ProductProps) {
  const { checkIfItemAlreadyExists, addToCart } = useCart();

  if (!product) {
    return <p>Produto não encontrado</p>;
  }

  const itemAlreadyInCart = checkIfItemAlreadyExists(product.id);

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl || "/default-image.jpg"}
            alt=""
            width={520}
            height={480}
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>

          <button
            disabled={itemAlreadyInCart}
            onClick={() => addToCart(product)}
          >
            {itemAlreadyInCart
              ? "Produto já está no carrinho"
              : "Colocar na sacola"}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const productId = params.id;

  let product;
  try {
    product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    });
  } catch (error) {
    return {
      notFound: true,
    };
  }

  const price = product.default_price as Stripe.Price | null;

  if (!price || price.unit_amount === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0] || "/default-image.jpg",
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount / 100),
        numberPrice: price.unit_amount / 100,
        description: product.description || "Sem descrição disponível",
        defaultPriceId: price.id,
      },
    },
  };
};
