"use client";
import React, { useEffect } from "react";
import trpc from "../helpers/trpc";

export default function Home() {
    const [greeting, setGreeting] = React.useState<string | null>(null);

    useEffect(() => {
        trpc.hello
            .query({
                client_name: "Next.js",
            })
            .then(setGreeting);
    }, [greeting]);

    return (
        <>
            <div>
                <h1>Message from Server!</h1>
                <p>{greeting}</p>
            </div>
        </>
    );
}
