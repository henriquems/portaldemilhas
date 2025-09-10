import { Acme } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const fonte = Acme({
  subsets: ["latin"],
  weight: "400",
});

export interface LogoProps {
    largura: number
    altura: number
    className?: string
}

export default function Logo(props: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${fonte.className}`}>
            <Image 
                src="/logo.png"
                width={props.largura} 
                height={props.altura} 
                alt=""
                className={props.className} 
            />
            <h1 className={`font-semibold 
                ${props.className}
            `}>PORTAL DE MILHAS</h1>
        </Link>
    )
}