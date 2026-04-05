import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { Lock } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useDocsContext } from "../../../../context/Docs";
import type { processorInterface } from "../Simplifier";
import { toast } from "sonner";

interface ChatProps {
    selectedHalf: number;
    setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
    processor: processorInterface
}

interface messageInterface {
    role: "user" | "assistant",
    content: string,
    timestamp: string
    image?: string,
}

function Chatsection({ setSelectedHalf, selectedHalf, processor }: ChatProps) {
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const { userInfo } = useUserInfo()
    const { selectedOutput } = useDocsContext()
    const [thinking, setThinking] = useState(false)

    const [messages, setMessages] = useState<messageInterface[]>([]);
    const [currentMessage, setCurrentMessage] = useState<messageInterface | undefined>(undefined)
    const currentMessageRef = useRef<messageInterface | undefined>(undefined)

    const [input, setInput] = useState("");

    const updateMessages = (message: messageInterface | undefined) => {
        console.log(message)
        setMessages((prevMessages) => {
            if (message)
                return [
                    ...prevMessages,
                    message
                ]
            return prevMessages
        })
    }

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
            console.log("in inpu t query")
            if (!input.trim()) return;
            setThinking(true)
            setMessages((prev) => {
                return [
                    ...prev,
                    {
                        role: "user",
                        content: input,
                        timestamp: Date.now().toString(),
                    }
                ]
            })
            const newMessage = {
                role: "assistant",
                content: "",
                timestamp: Date.now().toString()
            } as messageInterface
            setCurrentMessage(newMessage)
            currentMessageRef.current = newMessage
            setInput("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/chat/query`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify({ query: input, chunkId: selectedOutput })
            })

            // const body = await response.json()

            // console.log(body)

            if (!response.ok)
                throw new Error("failed to resolved query, please try again")

            if (!response.body) {
                throw new Error("failed to resolved query, please try again");
            }

            // console.log(response)

            const reader = response.body.getReader()
            const decoder = new TextDecoder("utf-8")
            setThinking(false)

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    console.log("Done")
                    updateMessages(currentMessageRef.current)
                    setCurrentMessage(undefined)
                    break
                }
                const chunk = decoder.decode(value, { stream: true })
                const parts = chunk.split("<END>")

                for (let part of parts) {
                    if (!part)
                        continue;
                    console.log(part)
                    const parsed = JSON.parse(part)
                    if (parsed?.type === "error") {
                        toast.info(parsed?.message || "failed to continue chat...")
                    }
                    else if (parsed?.type === "text") {
                        setCurrentMessage((prev) => {
                            if (prev)
                                return { ...prev, content: (prev?.content || "") + (parsed?.content || "") }
                            return undefined
                        })
                        const currentContent: string = currentMessageRef.current?.content || ""
                        currentMessageRef.current = { ...currentMessageRef.current, content: currentContent + (parsed?.content || "") }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    // console.log(messages)
    // console.log(processor)

    const chatSelected = Boolean(selectedHalf)
    return (
        <div
            ref={chatBoxRef}
            className={`h-full ${chatSelected
                ? "lg:w-2/3 md:w-1/2 w-full "
                : "lg:w-1/3 md:w-1/2 w-0 md:flex hidden lg:cursor-pointer cursor-default"
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
                    disabled={processor.gettingOutput || processor.streaming || processor.waitingMessage || thinking}
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