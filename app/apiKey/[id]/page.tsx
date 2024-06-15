"use client"
import Loader from "@/components/Loader";
import { useState } from "react";
import { CardDemo } from "@/components/CardDemo";

const Page = () => {
    const [loading, setLoading] = useState(false)
    if(loading)return <Loader />
    return <div className="flex flex-col gap-y-4 mb-6">
        <CardDemo />
    </div>
}
export default Page;