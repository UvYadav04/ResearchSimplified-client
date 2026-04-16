import { useRef, useState } from "react";
import type { paperOutputInterface } from "../Simplifier";
import ReactMarkdown from 'react-markdown'
import { useDocsContext } from "../../../../context/Docs";
import {  MinusCircleIcon, PlusCircleIcon, } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { cn } from "@/lib/utils";

export const OutputBox = ({ item, selectedPage }: { item: paperOutputInterface, selectedPage: number }) => {
    const [expanded, setExpanded] = useState(false);
    const { setSelectedOutput, selectedOutput } = useDocsContext();
    const { userInfo } = useUserInfo();
    const boxRef = useRef<HTMLDivElement | null>(null);

    const page = item.page;
    const id = `${item.chunk === 1 ? item.page + 1 : `${item.page} + ${item.chunk}`}`;
    const actualId = item?.id || null;
    const selected = selectedOutput === actualId;
    const samePage = page + 1 === selectedPage;

    return (
        <div
            ref={boxRef}
            id={id}
            className={cn(
                "w-full max-w-3xl mx-auto flex flex-col gap-4 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all border border-slate-100",
                samePage && "ring-2 ring-blue-200"
            )}
        >
            <div className="flex justify-end items-center">


                <div className="flex items-center gap-3">
                    <button
                        className="cursor-pointer"
                        disabled={!userInfo}
                        title={
                            userInfo
                                ? (!selected ? "Add context to chat" : "Remove context from chat")
                                : "Login to use this feature."
                        }
                        onClick={() => {
                            if (selected) setSelectedOutput(null);
                            else setSelectedOutput(actualId);
                        }}
                    >
                        {selected
                            ? <MinusCircleIcon className="text-slate-400" size={20} />
                            : <PlusCircleIcon className="text-slate-600" size={20} />
                        }
                    </button>

                    <button
                        className="text-sm text-slate-500 hover:text-slate-800 transition"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Collapse" : "Read more"}
                    </button>
                </div>
            </div>

            <div className="text-slate-600 leading-relaxed text-[15px]">
                <p className={expanded ? "" : "line-clamp-3"}>
                    {item.originalContent}
                </p>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed">
                <ReactMarkdown>
                    {item.output}
                </ReactMarkdown>
            </div>
        </div>
    );
};