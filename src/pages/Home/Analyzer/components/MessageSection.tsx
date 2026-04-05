import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { OutputBox } from './OutputBox'
import type { paperOutputInterface, processorInterface } from '../Simplifier'
import Chatsection from './Chatsection'
import { toast } from 'sonner'
import { useGetUserInfoQuery } from '../../../../services/userSlice'
import { Lock } from 'lucide-react'
import useUserInfo from '../../../../hooks/useUserInfo'
import PaperSection from './PaperSection'
import { Button } from '@/components/ui/button'

interface MessageProps {
    allOutputsRef: RefObject<paperOutputInterface[]>,
    processor: processorInterface,
    output: paperOutputInterface | undefined,
    bottomRef: RefObject<HTMLDivElement | null>,
    selectedPage: number
}

function OutputSection({ processor, allOutputsRef, output, bottomRef, selectedPage }: MessageProps) {
    const [selectedHalf, setSelectedHalf] = useState(0)
    return (
        <div className="Output flex flex-col gap-4  flex-1/2 min-h-0 p-3  w-full h-full">
            {processor.gettingOutput && <div className='w-full flex-1  h-full place-content-center  place-items-center'>
                <div className="size-10 rounded-full bg-blue-500 animate-ping" />
            </div>}
            {!processor.gettingOutput && <div className='md:hidden switcher flex gap-2 place-content-start -my-2 place-items-center'>
                <Button onClick={() => setSelectedHalf(0)} className={`w-24 ${selectedHalf === 0 ? "bg-emerald-800" : "bg-emerald-600"}`}>Paper</Button>
                <Button onClick={() => setSelectedHalf(1)} className={`w-24 ${selectedHalf === 0 ? "bg-emerald-600" : "bg-emerald-800"}`}>Chat</Button>
            </div>}
            {!processor.gettingOutput && <div className="w-full md:h-full h-[calc(100%-20px)] flex-1 flex flex-row place-content-start place-items-center ">
                <PaperSection selectedPage={selectedPage} processor={processor} selectedHalf={selectedHalf} setSelectedHalf={setSelectedHalf} allOutputsRef={allOutputsRef} output={output} bottomRef={bottomRef} />
                <Chatsection processor={processor} selectedHalf={selectedHalf} setSelectedHalf={setSelectedHalf} />
            </div>}
        </div>
    )
}

export default OutputSection
