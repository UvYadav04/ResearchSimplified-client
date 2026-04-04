import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { Lock } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useDocsContext } from "../../../../context/Docs";

interface ChatProps {
    selectedHalf: number;
    setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
}

interface messageInterface {
    role: "user" | "assistant",
    content: string,
    timestamp: string
    image?: string,
}

function Chatsection({ setSelectedHalf, selectedHalf }: ChatProps) {
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const { userInfo } = useUserInfo()
    const { selectedOutput } = useDocsContext()
    const [thinking, setThinking] = useState(false)

    const [messages, setMessages] = useState<messageInterface[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string | undefined>(undefined)

    const [input, setInput] = useState("");

    useEffect(() => {
        const handleSelection = () => {
            if (userInfo)
                setSelectedHalf(1);
        }
        const el = chatBoxRef.current;
        el?.addEventListener("mousedown", handleSelection);
        return () => {
            el?.removeEventListener("mousedown", handleSelection);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleQuery = async () => {
        try {
            if (!input.trim()) return;
            setThinking(true)
            setMessages((prev) => {
                return [
                    ...messages,
                    {
                        role: "user",
                        content: input,
                        timestamp: Date.now().toString(),
                    }
                ]
            })
            setInput("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat/query`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({ query: input, chunkId: selectedOutput })
            })

            const body = await response.json()

            if (!response.ok)
                throw new Error(body?.message || "failed to resolved query, please try again")

            if (!response.body) {
                throw new Error("failed to resolved query, please try again");
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            setThinking(false)

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    setCurrentMessage((prev) => {
                        if (prev)
                            setMessages((prevMessages) => {
                                return [
                                    ...prevMessages,
                                    {
                                        role: "assistant",
                                        content: prev,
                                        timestamp: Date.now().toString()
                                    }
                                ]
                            })
                        return ""
                    })
                    break
                }
                const chunk = decoder.decode(value, { stream: true })
                const parts = chunk.split("<END>")

                for (let part of parts) {
                    setCurrentMessage((prev) => {
                        return (prev || "") + part
                    })
                }
            }
        } catch (error) {

        }
    };

    const chatSelected = Boolean(selectedHalf)
    return (
        <div
            ref={chatBoxRef}
            className={`h-full ${chatSelected
                    ? "lg:w-2/3 md:w-1/2 w-full lg:cursor-pointer cursor-default"
                : "lg:w-1/3 md:w-1/2 w-0 cursor-default md:flex hidden"
                } flex flex-col transition-all duration-300 relative`}
        >
            {!userInfo && <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-black/40">
                <div className="flex flex-col items-center gap-4 px-6 py-5 rounded-2xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-lg">

                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20">
                        <Lock className="w-6 h-6 text-emerald-400" />
                    </div>

                    <p className="text-sm text-gray-200 text-center">
                        You need to login to start chatting
                    </p>



                </div>
            </div>}
            <div
                className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-3"
                style={{ scrollbarWidth: "none" }}
            >
                {messages.map((msg, idx) => (
                    <Message key={idx} role={msg.role} content={msg.content} />
                ))}

                <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t bg-white flex gap-2 ">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                    placeholder="Ask something..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={handleQuery}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatsection;