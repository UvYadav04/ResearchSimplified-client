import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useDocsContext } from "../../../../context/Docs";
import { Document, Page, pdfjs } from "react-pdf";
import { Info } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ setSelectedPage }: { setSelectedPage: Dispatch<SetStateAction<number>> }) {
    const { currentFile } = useDocsContext();
    const [numPages, setNumPages] = useState(0);

    function onLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    if (!currentFile) {
        return <div>No PDF selected</div>;
    }

    return (
        <div className="pdfViewer w-1/3   box-border flex-1   min-h-0">

            <div className="h-full p-2 flex-shrink-0 border-2 border-slate-300 flex place-content-center flex-col gap-4 place-items-center w-fit overflow-y-auto bg-gray-100">
                <p className="w-full text-start  flex place-items-center gap-1 text-xs"><Info size={15} />Click the page to get related simplified content.</p>
                <div className="flex w-fit p-2 pt-0  place-content-center place-items-start py-3 h-full overflow-y-auto " style={{ scrollbarWidth: "none" }}>

                    <Document className="flex flex-col gap-4 h-full" file={currentFile} onLoadSuccess={onLoadSuccess}>

                        {Array.from(new Array(numPages), (_, index) => (
                            <Page
                                key={index}
                                pageNumber={index + 1}
                                width={300}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="transition-all duration-300 cursor-pointer border-2 border-slate-400"
                                onClick={() => setSelectedPage(index + 1)}

                            />
                        ))}

                    </Document>

                </div>
            </div>
        </div>
    );
}

export default PdfViewer;