import React, { useEffect, useRef, type RefObject } from 'react'
import { OutputBox } from './OutputBox'
import type { paperOutputInterface, processorInterface } from '../Simplifier';
import useUserInfo from '../../../../hooks/useUserInfo';
import { Lock } from 'lucide-react';

interface OutputProps {
    selectedHalf: number;
    setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
    processor: processorInterface,
    output: paperOutputInterface | undefined,
    bottomRef: RefObject<HTMLDivElement | null>,
    allOutputsRef: RefObject<paperOutputInterface[]>,

}

function PaperSection({ setSelectedHalf, selectedHalf, bottomRef, processor, output, allOutputsRef }: OutputProps) {
    const outputBoxRef = useRef<HTMLDivElement | null>(null)
    const { userInfo } = useUserInfo()

    useEffect(() => {
        const handleSelection = () => {
            setSelectedHalf(0)
        }

        const el = outputBoxRef.current
        if (!el) return

        el.addEventListener('mousedown', handleSelection)

        return () => {
            el.removeEventListener('mousedown', handleSelection)
        }
    }, [])

    const paperSelected = !selectedHalf
    return (
        <div ref={outputBoxRef} className={`messages flex-1 h-full flex flex-col gap-3 py-2 place-content-start place-items-center  overflow-y-scroll px-2 border border-slate-200 bg-slate-100 transition-all duration-500  ${paperSelected
            ? " lg:w-2/3 md:w-1/2 w-full  lg:leading-relaxed "
            : " lg:w-1/3 md:w-1/2 md:flex hidden lg:text-[13px]   lg:leading-[14px] lg:cursor-pointer cursor-default"
            } `} style={{ scrollbarWidth: "none" }}>
            {allOutputsRef.current.map((item, index) => (
                <OutputBox key={index} item={item} />
            ))}
            <div ref={bottomRef} className="flex-1 max-w-full">
                {output && <OutputBox item={output} />}
            </div>
            {!userInfo && !processor.gettingOutput && !processor.streaming && (
                <div className="w-full max-w-full flex items-center justify-center py-10">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-gray-500 shadow-md shadow-emerald-400">

                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/20">
                            <Lock className="w-4 h-4 text-emerald-400" />
                        </div>

                        <p className="text-sm">
                            Please log in to simplify all pages.
                        </p>

                    </div>
                </div>
            )}
        </div>
    )
}

export default PaperSection
