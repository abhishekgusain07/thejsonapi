import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <Header/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-28 mt-20">
      <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
        Convert any form of data into <span className="text-[#3290EE] ">JSON</span> format.
      </h1>
      <p className="mx-auto mt-12 max-w-xl text-lg text-slate-700 leading-7">Do you find it annoying to change normal information into form of json data, if yes here is the solution for you, just give data, specify format and receive data in form of JSON object</p>
      <div className="flex justify-center space-x-4">
        
      </div>
    </main>
    </div>
  );
}
