import React, { useEffect, useRef, useState } from "react";
import { Message } from "./Message";
import { Lock } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useDocsContext } from "../../../../context/Docs";
import type { processorInterface } from "../Simplifier";
import { toast } from "sonner";
import clsx from "clsx";
import useMobile from "@/hooks/useMobile";

interface ChatProps {
  selectedHalf: number;
  setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
  processor: processorInterface;
}

interface messageInterface {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function Chatsection({ setSelectedHalf, selectedHalf, processor }: ChatProps) {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobile();

  const { userInfo } = useUserInfo();
  const { selectedOutput } = useDocsContext();

  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [currentMessage, setCurrentMessage] = useState<
    messageInterface | undefined
  >(undefined);
  const currentMessageRef = useRef<messageInterface | undefined>(undefined);

  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false); // 🔥 mobile floating state

  const chatDisabled =
    processor.gettingOutput ||
    processor.streaming ||
    processor.waitingMessage ||
    thinking;

  useEffect(() => {
    const handleSelection = () => {
      if (userInfo) setSelectedHalf(1);
    };

    const el = chatBoxRef.current;
    el?.addEventListener("mousedown", handleSelection);

    return () => {
      el?.removeEventListener("mousedown", handleSelection);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentMessage]);

  const handleQuery = async () => {
    try {
      if (!input.trim() || chatDisabled) return;

      setThinking(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: input,
          timestamp: Date.now().toString(),
        },
      ]);

      const newMessage = {
        role: "assistant",
        content: "",
        timestamp: Date.now().toString(),
      } as messageInterface;

      setCurrentMessage(newMessage);
      currentMessageRef.current = newMessage;

      setInput("");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/chat/query`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            query: input,
            chunkId: selectedOutput,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
      }
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setThinking(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setMessages((prev) => [...prev, currentMessageRef.current!]);
          setCurrentMessage(undefined);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const parts = chunk.split("<END>");

        for (let part of parts) {
          if (!part) continue;

          const parsed = JSON.parse(part);

          if (parsed?.type === "error") {
            toast.info(parsed?.message);
          } else if (parsed?.type === "text") {
            setCurrentMessage((prev) =>
              prev
                ? {
                    ...prev,
                    content: prev.content + (parsed.content || ""),
                  }
                : undefined,
            );

            const currentContent: string =
              currentMessageRef.current?.content || "";

            currentMessageRef.current = {
              ...currentMessageRef.current,
              content: currentContent + parsed.content,
            };
          }
        }
      }
    } catch (err) {
      setThinking(false);
    }
  };

  const chatSelected = Boolean(selectedHalf);

  return (
    <>
      {/* 💬 CHAT PANEL */}
      <div
        ref={chatBoxRef}
        className={clsx(
          "flex flex-col transition-all duration-300 relative",

          // 💻 Desktop
          !isMobile &&
            (chatSelected
              ? "lg:w-2/3 md:w-1/2 w-full"
              : "lg:w-1/3 md:w-1/2 w-0 md:flex cursor-pointer"),
          // 📱 Mobile floating
          isMobile &&
            (open
              ? "fixed z-50 md:relative h-[calc(100%-100px)] my-auto min-w-[400px] max-w-[400px] bottom-5 right-5"
              : "hidden md:flex"),
        )}
      >
        <div
          className={clsx(
            "flex flex-col h-full",

            // 🌈 soft emerald background instead of plain white
            open && "bg-gradient-to-b from-white to-emerald-50/40",

            // ❌ removed shadow + ring
            chatSelected && "border border-emerald-200",
          )}
        >
          {open && (
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-emerald-600 ms-auto hover:text-emerald-700 transition"
              >
                Close
              </button>
            </div>
          )}

          {!userInfo && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 px-6 py-5 rounded-xl bg-white border border-emerald-100">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100">
                  <Lock className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-600 text-center">
                  Login required to start chatting
                </p>
              </div>
            </div>
          )}

          <div
            className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-emerald-300 hover:scrollbar-thumb-emerald-400"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.length === 0 && !currentMessage && !thinking && (
              <div className="flex flex-1 items-center justify-center text-center px-4">
                <div className="max-w-sm text-slate-500 text-sm leading-relaxed">
                  <p className="text-base font-medium text-emerald-700 mb-2">
                    📄 I’m your research paper
                  </p>
                  <p>
                    Ask me anything about my content — methods, results, or
                    concepts. Let’s explore and discuss ideas together.
                  </p>
                </div>
              </div>
            )}

            {/* 💬 Messages */}
            {messages.map((msg, idx) => (
              <Message key={idx} role={msg.role} content={msg.content} />
            ))}

            {currentMessage?.content && (
              <Message role="assistant" content={currentMessage.content} />
            )}

            {thinking && <Message role="assistant" content="Thinking..." />}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-emerald-100 bg-white/80 backdrop-blur-sm flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuery()}
              placeholder="Ask something..."
              className="
                    flex-1 px-3 py-2 
                    border border-emerald-200 
                    rounded-lg text-sm 
                    outline-none 
                    placeholder:text-slate-400
                    focus:border-emerald-400
                  "
            />

            <button
              disabled={chatDisabled}
              onClick={handleQuery}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm text-white transition-all duration-200",
                chatDisabled
                  ? "bg-emerald-300"
                  : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]",
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
                md:hidden 
                fixed bottom-5 right-5 
                w-12 h-12 
                rounded-full 
                bg-emerald-600 
                hover:bg-emerald-700 
                text-white 
                flex items-center justify-center
                z-40
                active:scale-[0.95]
              "
        >
          💬
        </button>
      )}
    </>
  );
}

export default Chatsection;
