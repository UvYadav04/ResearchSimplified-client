import type { processorInterface } from '@/pages/Home/Analyzer/Simplifier'
import React, { createContext, useContext, useRef, useState, type Dispatch,type RefObject, type SetStateAction } from 'react'

interface DocsContextInterface {
    currentFile: File | null,
    setCurrentFile: Dispatch<SetStateAction<File | null>>,
    selectedOutput: string | null,
    setSelectedOutput: Dispatch<SetStateAction<string | null>>,
    sidebarOpen: boolean,
    setSidebarOpen: Dispatch<SetStateAction<boolean>>,
    processorRef: RefObject<processorInterface>
}
const DocsContext = createContext<DocsContextInterface | null>(null)

function DocsContextProvider({ children }: { children: React.ReactNode }) {
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [selectedOutput, setSelectedOutput] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const processorRef = useRef<processorInterface>({ streaming: false, generatingImage: false, gettingOutput: false, waitingMessage: false })
    return (
        <DocsContext.Provider value={{processorRef, currentFile, setCurrentFile, selectedOutput, setSelectedOutput, setSidebarOpen, sidebarOpen }}>
            {children}
        </DocsContext.Provider>
    )
}

export default DocsContextProvider

export const useDocsContext = () => {
    const context = useContext(DocsContext)
    if (!context)
        throw new Error("Docs Context can be used inside Docs Provider")
    return context
}