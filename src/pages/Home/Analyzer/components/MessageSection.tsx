import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { OutputBox } from './OutputBox'
import type { paperOutputInterface, processorInterface } from '../Simplifier'
import Chatsection from './Chatsection'
import { toast } from 'sonner'

interface MessageProps {
    allOutputsRef: RefObject<paperOutputInterface[]>,
    processor: processorInterface,
    output: paperOutputInterface | undefined,
    bottomRef: RefObject<HTMLDivElement | null>
}

function OutputSection({ processor, allOutputsRef, output, bottomRef }: MessageProps) {
    const [selectedHalf, setSelectedHalf] = useState(0)
    const outputBoxRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleSelection = () => setSelectedHalf(0)
        outputBoxRef.current?.addEventListener('mousedown', handleSelection)
        return () => outputBoxRef.current?.removeEventListener
            ('mousedown', handleSelection)
    }, [])

    return (
        <div className="Output flex flex-col gap-4  flex-1/2 min-h-0 p-3  w-full">
            {processor.gettingOutput && <div className='w-full flex-1  h-full place-content-center  place-items-center'>
                <div className="size-10 rounded-full bg-blue-500 animate-ping" />
            </div>}
            <div className="w-full h-full flex-1 flex flex-row place-content-start place-items-center ">
                <div ref={outputBoxRef} className={`messages h-full ${selectedHalf ? "w-1/3 cursor-pointer text-[9px]  leading-[13px]" : "w-2/3 cursor-default text-[13px] leading-relax "} flex flex-col gap-3 py-2 place-content-start place-items-center  overflow-y-scroll px-2 border border-slate-200 bg-slate-100 transition-all duration-500`} style={{scrollbarWidth:"none"}}>
                    {allOutputsRef.current.map((item, index) => (
                        <OutputBox key={index} item={item} />
                    ))}
                    <div ref={bottomRef} className="flex-1">
                        {output && <OutputBox item={output} />}
                    </div>
                </div>
                <Chatsection selectedHalf={selectedHalf} setSelectedHalf={setSelectedHalf} />
            </div>
        </div>
    )
}

export default OutputSection
