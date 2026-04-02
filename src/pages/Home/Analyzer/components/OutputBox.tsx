import { useRef, useState } from "react";
import type { paperOutputInterface } from "../Simplifier";
import ReactMarkdown from 'react-markdown'

export const OutputBox = ({ item }: { item: paperOutputInterface }) => {
    const [expanded, setExpanded] = useState(false);
    const boxRef = useRef<HTMLDivElement | null>(null)
    const id = `${item.chunk === 1 ? item.page + 1 : `${item.page} + ${item.chunk}`}`
    return (
        <div ref={boxRef} id={id} className="flex w-full flex-col gap-2  rounded-sm p-4 bg-white shadow-sm hover:shadow-md transition-all ">
            <div className=" text-slate-500">
                <div className="flex justify-end items-center mb-1">
                    {/* <span className="font-medium text-slate-400">Original</span> */}
                    <button
                        className="text-slate-400 text-xs"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Hide" : "Expand"}
                    </button>
                </div>

                <p className={`${expanded ? "" : "line-clamp-3"} leading-relaxed`}>
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