import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";

interface ChatProps {
    selectedHalf: number;
    setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
}

function Chatsection({ setSelectedHalf, selectedHalf }: ChatProps) {
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string }[]
    >([]);

    const [input, setInput] = useState("");

    useEffect(() => {
        const handleSelection = () => setSelectedHalf(1);
        const el = chatBoxRef.current;

        el?.addEventListener("mousedown", handleSelection);

        return () => {
            el?.removeEventListener("mousedown", handleSelection);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage = { role: "user" as const, content: input };

        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Thinking..." },
            ]);
        }, 500);

        setInput("");
    };

    return (
        <div
            ref={chatBoxRef}
            className={`h-full ${!selectedHalf ? "w-1/3 cursor-pointer" : "w-2/3 cursor-default"
                } flex flex-col transition-all duration-300 `}
        >
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
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask something..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chatsection;