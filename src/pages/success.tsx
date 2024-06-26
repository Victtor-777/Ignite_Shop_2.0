import { stripe } from "@/lib/stripe";
import {
  ImageContainer,
  ImagesContainer,
  SuccessContainer,
} from "@/styles/pages/success";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
  productsImages: string[];
}

export default function Success({
  customerName,
  product,
  productsImages,
}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra Efetuada | Iginite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>
      <SuccessContainer>
        <ImagesContainer>
          {productsImages.map((image, i) => (
            <ImageContainer key={i}>
              <Image src={image} alt="" width={120} height={110} />
            </ImageContainer>
          ))}
        </ImagesContainer>

        <h1>Compra efetuada!</h1>

        <p>
          Uhuul <strong>{customerName}</strong>, sua compra de
          <strong> {productsImages.length}</strong>{" "}
          {productsImages.length === 1 ? "camiseta" : "camisetas"} já está a
          caminho da sua casa.
        </p>

        <Link href={"/"}>Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  );
}

// Client-side (useEffect) / getServerSideProps / getStaticProps

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const customerName = session.customer_details?.name;
  const productsImages = session.line_items?.data.map((item) => {
    const product = item.price?.product as Stripe.Product;
    return product.images[0];
  });

  console.log(session.line_items?.data);

  return {
    props: {
      customerName,
      productsImages,
    },
  };
};
