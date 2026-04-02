interface MessageProps {
    role: "user" | "assistant";
    content: string;
}

export function Message({ role, content }: MessageProps) {
    return (
        <div
            className={`w-full flex ${role === "user" ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
            >
                {content}
            </div>
        </div>
    );
}