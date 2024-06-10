import Image from "next/image"
import Link from "next/link"


export default function Header({
    photo
}: {
    photo?: string
}){
    return (
        <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
            <Link href="/" className="flex space-x-2">
                <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
                    theJsonApi
                </h1>
            </Link>
            <a>
                <Image 
                    alt="Rate GEHU"
                    src="/icon.png"
                    className="w-10 sm:w-12 sm:h-[14px]h-[28px] mr-4"
                    width={52}
                    height={52}
                />
            </a>
        </header>
    )
}