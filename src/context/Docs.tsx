import React, { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react'

interface DocsContextInterface {
    currentFile: File | null,
    setCurrentFile: Dispatch<SetStateAction<File | null>>,
    selectedOutput: string | null,
    setSelectedOutput: Dispatch<SetStateAction<string | null>>,
}
const DocsContext = createContext<DocsContextInterface | null>(null)

function DocsContextProvider({ children }: { children: React.ReactNode }) {
    const [currentFile, setCurrentFile] = useState<File | null>(null)
    const [selectedOutput, setSelectedOutput] = useState<string | null>(null)
    return (
        <DocsContext.Provider value={{ currentFile, setCurrentFile, selectedOutput, setSelectedOutput }}>
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