import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useDocsContext } from "../../../../context/Docs";
import { Document, Page, pdfjs } from "react-pdf";
import { Info, Loader } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Button } from "../../components/ui/button"
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



function PdfViewer({ setSelectedPage }: { setSelectedPage: Dispatch<SetStateAction<number>> }) {
    const { currentFile } = useDocsContext();
    const [numPages, setNumPages] = useState(0);
    const[loading,setLoading] = useState(false)

    function onLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false)
    }

    if (!currentFile) {
        return <div>No PDF selected</div>;
    }
    const pdfContent =  (
        <div className="pdfViewer w-fit   box-border lg:flex-1   min-h-0">
            {loading && <div className="animate-pulse size-10 rounded-full bg-sky-500 mx-auto mt-5" />}
            {!loading && <div className="h-full p-2 flex-shrink-0 border-2 border-slate-300 flex place-content-center flex-col gap-4 place-items-center w-fit overflow-y-auto bg-gray-100">
                <p className="w-full text-start  flex place-items-center gap-1 text-xs"><Info size={15} />Click the page to get related simplified content.</p>
                <div className="flex w-fit p-2 pt-0  place-content-center place-items-start py-3 h-full overflow-y-auto " style={{ scrollbarWidth: "none" }}>

                    <Document className="flex flex-col gap-4 h-full" file={currentFile} onLoadStart={() => setLoading(true)} onLoadSuccess={onLoadSuccess}>

                        {Array.from(new Array(numPages), (_, index) => (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                width={300}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="transition-all w-72 duration-300 cursor-pointer border-2 border-slate-400"
                                onClick={() => setSelectedPage(index + 1)}

                            />
                        ))}

                    </Document>

                </div>
            </div>}
        </div>
    )

    return (
        <>
            {/* Mobile */}
            <div className="lg:hidden flex items-center p-2 fixed top-2 left-2 ">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-72 p-0 bg-background/95 backdrop-blur border-r border-border"
                    >
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className=" hidden lg:flex h-full w-72 ">
                <SidebarContent />
            </div>
        </>
    )
}

export default PdfViewer;