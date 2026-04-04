import { useRef, useState } from "react";
import type { paperOutputInterface } from "../Simplifier";
import ReactMarkdown from 'react-markdown'
import { useDocsContext } from "../../../../context/Docs";
import { MinusCircle, MinusCircleIcon, PlusCircleIcon, } from "lucide-react";
import useUserInfo from "../../../../hooks/useUserInfo";

export const OutputBox = ({ item }: { item: paperOutputInterface }) => {
    const [expanded, setExpanded] = useState(false);
    const { setSelectedOutput, selectedOutput } = useDocsContext()
    const { userInfo } = useUserInfo()
    const boxRef = useRef<HTMLDivElement | null>(null)
    const id = `${item.chunk === 1 ? item.page + 1 : `${item.page} + ${item.chunk}`}`
    const actualId = item?.id || null
    const selected = selectedOutput === actualId
    console.log(item)
    return (
        <div ref={boxRef} id={id} className="flex w-full flex-col gap-2 h-fit  rounded-sm p-4 bg-white shadow-sm hover:shadow-md transition-all ">
            <div className=" text-slate-500 max-h-full">
                <div className="flex justify-end items-center mb-2 gap-2 max-h-full">
                    <button
                        className="text-slate-400 text-xs flex p cursor-pointer"
                        disabled={!userInfo}
                        title={userInfo ? (selected ? "Add chunk to chat" : "Remove chunk from chat") : "Login to use this feature."}
                        onClick={() => {
                            if (selected)
                                setSelectedOutput(null)
                            else
                                setSelectedOutput(actualId)
                        }}
                    >
                        {selected ? <MinusCircleIcon size={15} /> : <PlusCircleIcon size={15} />}
                    </button>
                    <button
                        className="text-slate-400 text-xs"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? "Hide" : "Expand"}
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