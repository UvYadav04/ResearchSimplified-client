import { useState, type RefObject } from "react";
import type { paperOutputInterface, processorInterface } from "../Simplifier";
import Chatsection from "./Chatsection";
import PaperSection from "./PaperSection";

interface MessageProps {
  allOutputsRef: RefObject<paperOutputInterface[]>;
  processor: processorInterface;
  output: paperOutputInterface | undefined;
  bottomRef: RefObject<HTMLDivElement | null>;
  selectedPage: number;
}

function OutputSection({
  processor,
  allOutputsRef,
  output,
  bottomRef,
  selectedPage,
}: MessageProps) {
  const [selectedHalf, setSelectedHalf] = useState(0);

  return (
    <div
      className="
            flex flex-col gap-4 flex-1 min-h-0 w-full h-full
            bg-gradient-to-br from-slate-50 to-white
        "
    >
      {!processor.gettingOutput && (
        <div
          className="
                    w-full md:h-full h-[calc(100%-20px)]
                    flex-1 flex flex-row
                    overflow-hidden
                    relative
                "
        >
          <PaperSection
            selectedPage={selectedPage}
            processor={processor}
            selectedHalf={selectedHalf}
            setSelectedHalf={setSelectedHalf}
            allOutputsRef={allOutputsRef}
            output={output}
            bottomRef={bottomRef}
          />

          <Chatsection
            processor={processor}
            selectedHalf={selectedHalf}
            setSelectedHalf={setSelectedHalf}
          />
        </div>
      )}
    </div>
  );
}

export default OutputSection;
