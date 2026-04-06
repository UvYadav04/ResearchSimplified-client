import { useRef, useState } from "react";
import type { paperOutputInterface } from "../Simplifier";
import ReactMarkdown from 'react-markdown'
import { useDocsContext } from "../../../../context/Docs";
import {  MinusCircleIcon, PlusCircleIcon, } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";
import { cn } from "@/lib/utils";

export const OutputBox = ({ item, selectedPage }: { item: paperOutputInterface, selectedPage: number }) => {
    const [expanded, setExpanded] = useState(false);
    const { setSelectedOutput, selectedOutput } = useDocsContext()
    const { userInfo } = useUserInfo()
    const boxRef = useRef<HTMLDivElement | null>(null)
    const page = item.page
    const id = `${item.chunk === 1 ? item.page + 1 : `${item.page} + ${item.chunk}`}`
    const actualId = item?.id || null
    const selected = selectedOutput === actualId
    const samePage = page+1 === selectedPage
    return (
        <div ref={boxRef} id={id} className={cn("flex w-full flex-col gap-2 h-fit  rounded-sm p-4 bg-white shadow-sm hover:shadow-md transition-all ",samePage && "")}>
            <div className=" text-slate-500 max-h-full">
                <div className="flex justify-end items-center mb-2 gap-2 max-h-full">
                    <button
                        className="text-slate-400 text-xs flex p cursor-pointer"
                        disabled={!userInfo}
                        title={userInfo ? (!selected ? "Add context to chat" : "Remove context from chat") : "Login to use this feature."}
                        onClick={() => {
                            if (selected)
                                setSelectedOutput(null)
                            else
                                setSelectedOutput(actualId)
                        }}
                    >
                        {selected ? <MinusCircleIcon className="text-slate-400" size={20} /> : <PlusCircleIcon className="text-slate-600" size={20} />}
                    </button>
                    <button
                        className="text-slate-400 text-md"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Collapse" : "Expand"}
                    </button>
                </div>

                <p className={`${expanded ? "" : "line-clamp-3"}`}>
                    {item.originalContent}
                </p>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="output prose prose-sm max-w-none text-slate-800">
                <ReactMarkdown>{item.output}</ReactMarkdown>
            </div>
        </div>
    );
};