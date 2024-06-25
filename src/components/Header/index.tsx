import Image from "next/image";
import { HeaderContainer } from "./styles";
import logoImg from "../../assets/logo.svg";
import { Cart } from "../Cart";
import Link from "next/link";

export function Header() {
  return (
    <HeaderContainer>
      <Link href={"/"}>
        <Image src={logoImg} alt="logo" width={130} height={52} />
      </Link>

      <Cart />
    </HeaderContainer>
  );
}
