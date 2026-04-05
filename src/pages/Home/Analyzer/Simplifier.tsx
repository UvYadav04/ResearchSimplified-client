import React, { useEffect, useRef, useState } from 'react'
import { useDocsContext } from '../../../context/Docs'
import PdfViewer from './components/PdfViewer'
import router from '../../../routes/routes'
import OutputSection from './components/MessageSection'
import { toast } from 'sonner'


export interface paperOutputInterface {
    originalContent: string,
    output: string,
    type: "text" | 'image',
    page: number,
    chunk: number,
    id: string
}

export interface processorInterface {
    gettingOutput: boolean,
    streaming: boolean,
    waitingMessage: boolean,
    generatingImage: boolean,
}


function Simplifier() {
    const [output, setOutput] = useState<paperOutputInterface | undefined>()
    const allOutputsRef = useRef<paperOutputInterface[]>([])
    const outputRef = useRef<paperOutputInterface | undefined>(undefined)
    const { currentFile } = useDocsContext()
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [selectedPage, setSelectedPage] = useState(-1)
    const [processor, setProcessor] = useState<processorInterface>({ generatingImage: false, waitingMessage: false, gettingOutput: false, streaming: false })
    const requestCalled = useRef<boolean>(false)

    const handleFileUpload = async () => {
        try {
            if (!currentFile || processor.gettingOutput || processor.streaming || requestCalled.current)
                return;
            requestCalled.current = true
            setOutput(undefined)
            const formData = new FormData()
            formData.append("file", currentFile)
            setProcessor((prev) => ({ ...prev, gettingOutput: true }))
            // console.log(import.meta.env.VITE_SERVER_URI)
            const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/documents/upload-paper`,
                {
                    method: "POST",
                    credentials: 'include',
                    body: formData
                }
            )
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Streaming not supported");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            setProcessor((prev) => ({ ...prev, gettingOutput: false, streaming: true }))
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const parts = chunk.split("<END>")

                for (const part of parts) {
                    if (!part)
                        continue
                    const parsed = JSON.parse(part)
                    if (parsed?.type === "error" || parsed?.type === "end") {
                        if (parsed?.type === "error")
                            toast.info(parsed?.message || parsed?.error || "failed to stream")
                        //when the stream ends or some error is there, we push the last output to store
                        const finalOutput = outputRef.current;
                        if (finalOutput) {
                            allOutputsRef.current.push(finalOutput);
                        }
                        setOutput(undefined);
                        outputRef.current = undefined;
                        setProcessor((prev) => ({ ...prev, streaming: false }))
                        requestCalled.current = false
                        // console.log(allOutputsRef.current)
                    }
                    else if (parsed?.type === "text") {
                        const content = parsed["content"]
                        if (content) {
                            setOutput((prev) => {
                                if (!prev) return prev;
                                const updated = {
                                    ...prev,
                                    output: (prev.output || "") + content
                                };
                                return updated;
                            });
                            if (outputRef.current)
                                outputRef.current = { ...outputRef.current, output: outputRef.current.output + content }
                        }
                        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    else if (parsed?.type === "image") {
                        const content = parsed["content"]
                        if (content) {
                            setOutput((prev) => {
                                if (!prev) return prev;
                                const updated = {
                                    ...prev,
                                    output: (prev.output || "") + content
                                };
                                return updated;
                            });
                            if (outputRef.current)
                                outputRef.current = { ...outputRef.current, output: outputRef.current.output + content }
                        }
                        bottomRef.current?.scrollIntoView()
                    }
                    else if (parsed.type === "originalContent") {
                        // console.log(parsed['content'])
                        //to handle when a new arrives, we push preivous one to store
                        const finalOutput = outputRef.current;
                        if (finalOutput) {
                            allOutputsRef.current.push(finalOutput);
                        }
                        const newOutput = {
                            originalContent: parsed["content-type"] === "text" ? parsed["content"] : "Image",
                            output: "",
                            type: parsed["type"],
                            page: parsed["page"],
                            chunk: parsed["block_idx"],
                            id: parsed["id"]
                        } as paperOutputInterface
                        setOutput(newOutput)
                        outputRef.current = newOutput
                    }

                }
            }
        } catch (error: any) {
            console.log(error)
            toast.info(error?.message || "failed to respond")
        }
        finally {
            setProcessor((prev)=>({...prev,gettingOutput:false,streaming:false}))
        }
    }

    useEffect(() => {
        if (currentFile)
            handleFileUpload()
        else
            router.navigate("/", { replace: true })
    }, [currentFile])

    useEffect(() => {
        if (selectedPage) {
            document.getElementById(`${selectedPage}`)?.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedPage])


    return (
        <div className="text-sm  flex-1  flex flex-row place-content-between h-full    max-w-full  min-h-0">
            <PdfViewer setSelectedPage={setSelectedPage} />
            <OutputSection processor={processor} output={output} allOutputsRef={allOutputsRef} bottomRef={bottomRef} />

        </div>
    )
}

export default Simplifier

