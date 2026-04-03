import React, { useEffect, useRef, useState, type RefObject } from 'react'
import { OutputBox } from './OutputBox'
import type { paperOutputInterface, processorInterface } from '../Simplifier'
import Chatsection from './Chatsection'
import { toast } from 'sonner'
import { useGetUserInfoQuery } from '../../../../services/userSlice'
import { Lock } from 'lucide-react'
import useUserInfo from '../../../../hooks/useUserInfo'
import PaperSection from './PaperSection'

interface MessageProps {
    allOutputsRef: RefObject<paperOutputInterface[]>,
    processor: processorInterface,
    output: paperOutputInterface | undefined,
    bottomRef: RefObject<HTMLDivElement | null>
}

function OutputSection({ processor, allOutputsRef, output, bottomRef }: MessageProps) {
    const [selectedHalf, setSelectedHalf] = useState(0)


    return (
        <div className="Output flex flex-col gap-4  flex-1/2 min-h-0 p-3  w-full">
            {processor.gettingOutput && <div className='w-full flex-1  h-full place-content-center  place-items-center'>
                <div className="size-10 rounded-full bg-blue-500 animate-ping" />
            </div>}
            {!processor.gettingOutput && <div className="w-full h-full flex-1 flex flex-row place-content-start place-items-center ">
                <PaperSection processor={processor} selectedHalf={selectedHalf} setSelectedHalf={setSelectedHalf} allOutputsRef={allOutputsRef} output={output} bottomRef={bottomRef} />
                <Chatsection selectedHalf={selectedHalf} setSelectedHalf={setSelectedHalf} />
            </div>}
        </div>
    )
}

export default OutputSection
