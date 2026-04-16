import { useState, type Dispatch, type SetStateAction } from "react";
import { useDocsContext } from "../../../../context/Docs";
import { Document, Page, pdfjs } from "react-pdf";
import { Info } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({
  setSelectedPage,
  selectedPage,
}: {
  setSelectedPage: Dispatch<SetStateAction<number>>;
  selectedPage: number;
}) {
  const { currentFile, sidebarOpen, setSidebarOpen } = useDocsContext();
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(false);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  if (!currentFile) return null;

  const pdfContent = (
    <div className="w-full h-full flex flex-col">
      {/* 🔹 Header */}
      <div className="px-3 py-2 border-b border-emerald-100 bg-white/80 backdrop-blur-sm flex items-center gap-2 text-xs text-emerald-600">
        <Info size={14} />
        <span>Click a page to view explanation</span>
      </div>

      {/* 📄 Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 bg-gradient-to-b from-white to-emerald-50/40 scrollbar-thin scrollbar-thumb-emerald-300 hover:scrollbar-thumb-emerald-400">
        {loading && (
          <div className="flex justify-center mt-10">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && (
          <Document
            file={currentFile}
            onLoadStart={() => setLoading(true)}
            onLoadSuccess={onLoadSuccess}
            className="flex flex-col gap-4 items-center"
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={index} className="relative group">
                <Page
                  pageNumber={index + 1}
                  width={260}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onClick={() => setSelectedPage(index + 1)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-none",

                    // 🌿 default
                    "border border-emerald-100 bg-white",

                    // 🌿 hover (subtle, no shadow)
                    "hover:bg-emerald-50/60",

                    // 🌿 selected (no ring)
                    selectedPage === index + 1 &&
                      "border-emerald-400 bg-emerald-50",
                  )}
                />

                {/* 📄 Page number */}
                <div className="absolute bottom-1 right-2 text-[10px] text-emerald-700 bg-emerald-50/80 px-1.5 py-[1px] rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="xl:hidden fixed top-2 left-2 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="
              w-72 p-0 
              bg-white/90 backdrop-blur-md
              border-r border-emerald-100
            "
          >
            {pdfContent}
          </SheetContent>
        </Sheet>
      </div>

      <div
        className="
          hidden xl:flex 
          h-full 
          w-[300px] 
          border-r border-emerald-100 
          bg-gradient-to-b from-white to-emerald-50/30
        "
      >
        {pdfContent}
      </div>
    </>
  );
}

export default PdfViewer;
