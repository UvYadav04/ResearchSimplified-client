import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn("w-full flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-3 rounded-2xl text-sm transition-all",

          // 🟢 USER (strong emerald)
          isUser && "bg-emerald-600 text-white rounded-br-md",

          // 🌿 ASSISTANT (soft emerald instead of white)
          !isUser &&
            "bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-bl-md",
        )}
      >
        <div
          className={cn(
            "prose prose-sm max-w-none",

            "prose-p:my-2 prose-p:leading-relaxed",
            "prose-headings:mt-3 prose-headings:mb-1",
            "prose-li:my-1",

            // 🌿 Better code block theming
            "prose-pre:bg-emerald-900 prose-pre:text-emerald-50 prose-pre:rounded-lg prose-pre:p-3",

            isUser ? "prose-invert" : "prose-emerald",
          )}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
