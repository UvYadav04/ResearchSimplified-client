import React, { useEffect, useRef, useState, type RefObject } from "react";
import { OutputBox } from "./OutputBox";
import type { paperOutputInterface, processorInterface } from "../Simplifier";
import { BadgeDollarSign, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocsContext } from "@/context/Docs";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useUserInfo from "@/hooks/useUserInfo";

interface OutputProps {
  selectedHalf: number;
  setSelectedHalf: React.Dispatch<React.SetStateAction<number>>;
  processor: processorInterface;
  output: paperOutputInterface | undefined;
  bottomRef: RefObject<HTMLDivElement | null>;
  allOutputsRef: RefObject<paperOutputInterface[]>;
  selectedPage: number;
}

function PaperSection({
  setSelectedHalf,
  selectedPage,
  selectedHalf,
  bottomRef,
  processor,
  output,
  allOutputsRef,
}: OutputProps) {
  const outputBoxRef = useRef<HTMLDivElement | null>(null);
  const { setCurrentFile, processorRef } = useDocsContext();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const { userInfo } = useUserInfo();

  const exportToPDF = async () => {
    try {
      setExporting(true);

      const container = document.getElementById("outputBox");
      if (!container) return;

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let currentY = 0;

      // 👉 get each chunk (OutputBox wrapper)
      const children = Array.from(container.children);

      for (let i = 0; i < children.length; i++) {
        const element = children[i] as HTMLElement;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#fff",
        });

        if (!canvas.width || !canvas.height) {
          continue;
        }
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // 🧠 If chunk doesn't fit → new page
        if (currentY + imgHeight > pageHeight) {
          pdf.addPage();
          currentY = 0;
        }

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        pdf.addImage(imgData, "JPEG", 0, currentY, imgWidth, imgHeight);

        currentY += imgHeight + 5; // small spacing between chunks
      }

      pdf.save("research-paper.pdf");
    } catch (error) {
      console.log(error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const handleSelection = () => {
      setSelectedHalf(0);
    };

    const el = outputBoxRef.current;
    if (!el) return;

    el.addEventListener("mousedown", handleSelection);

    return () => {
      el.removeEventListener("mousedown", handleSelection);
    };
  }, []);

  const shouldShowLock =
    !processor.streaming && allOutputsRef.current.length > 0;

  const paperSelected = !selectedHalf;

  return (
    <div
      ref={outputBoxRef}
      className={cn(
        "flex-1 h-full flex flex-col gap-4 py-4 px-4 overflow-y-auto transition-all duration-300",

        // 🌈 Emerald gradient background
        "bg-gradient-to-br from-emerald-50 via-white to-emerald-100/40",

        // 🧊 Card feel + border
        "rounded-xl border border-emerald-100 shadow-sm hover:shadow-md",

        // 🟢 Scrollbar
        "scrollbar-thin scrollbar-thumb-emerald-300 hover:scrollbar-thumb-emerald-400",

        paperSelected
          ? "lg:w-2/3 md:w-1/2 w-full"
          : "lg:w-1/3 md:w-1/2 md:flex w-full lg:text-sm lg:cursor-pointer",

        // 🔥 Active highlight
        paperSelected && "shadow-lg",
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3   ">
        <button
          disabled={exporting}
          onClick={() => {
            setCurrentFile(null);
            navigate("/", { replace: true });
          }}
          className="w-full sm:w-auto px-3 py-2 text-sm font-medium text-emerald-700 rounded-lg bg-emerald-200 transition shadow-sm"
        >
          + New Paper
        </button>

        <button
          disabled={exporting}
          onClick={() => exportToPDF()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 m px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Export
        </button>
      </div>

      {processorRef.current.streaming &&
        !output &&
        allOutputsRef.current.length === 0 && (
          <div className="flex justify-start py-4">
            <div className="w-6 h-6 rounded-full  bg-emerald-400 animate-bounce"></div>
          </div>
        )}

      {!processorRef.current.gettingOutput && (
        <div
          id="outputBox"
          className="flex flex-col gap-6 w-full max-w-3xl mx-auto outputBox"
        >
          {allOutputsRef.current.map((item, index) => (
            <OutputBox selectedPage={selectedPage} key={index} item={item} />
          ))}

          <div ref={bottomRef} className="w-full">
            {output && <OutputBox selectedPage={-1} item={output} />}
          </div>
        </div>
      )}

      {shouldShowLock && !userInfo && (
        <div className="w-full flex items-center justify-center py-5">
          <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
              <Lock className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-700">
                Login required
              </p>
              <p className="text-xs text-slate-500">
                Log in to simplify more pages.
              </p>
            </div>
          </div>
        </div>
      )}

      {shouldShowLock && userInfo && (
        <div className="w-full flex items-center justify-center py-5">
          <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
              <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-700">
                Limited Simplification
              </p>
              <p className="text-xs text-slate-500">
                Due to LLM costs and project considerations, we are only able to
                simplify a few pages.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaperSection;
