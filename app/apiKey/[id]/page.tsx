"use client"

import generateApiKey from "generate-api-key";
import Loader from "@/components/Loader";
import { useAuth, useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CardDemo } from "@/components/CardDemo";

const Page = () => {
    const { id } = useParams();
    const { isSignedIn, user } = useUser();
    const handleGeneratingKey = (userName: string|undefined|null) => {
        const apiKey = generateApiKey({method: 'string', prefix: userName!});
        return apiKey;
    }
    const [key, setKey] = useState<string>("");
    const [keyPresent, setKeyPresent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


//   const { isLoaded, userId, sessionId, getToken } = useAuth();
    useEffect(() => {
        setLoading(true)
        if(user) {
            const keyPresent = 'apiKey' in user.publicMetadata;
            if(keyPresent) {
                if(typeof user.publicMetadata.apiKey === 'string')
                    setKey(user.publicMetadata.apiKey)
                setKeyPresent(true)
            } else {
                console.error("Api key not present!")
                setKey("")
                setKeyPresent(false)
            }
        }
        setLoading(false);
        return () => {}
    },[user])
    if(loading)return <Loader />
    return <div className="flex flex-col gap-y-4 mb-6">
        <CardDemo />
    </div>
}
export default Page;