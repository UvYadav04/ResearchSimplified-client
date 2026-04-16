import { useEffect, useRef, useState } from "react";
import { useDocsContext } from "../../../context/Docs";
import PdfViewer from "./components/PdfViewer";
import router from "../../../routes/routes";
import OutputSection from "./components/MessageSection";
import { toast } from "sonner";
import Retry from "./components/Retry";

export interface paperOutputInterface {
  originalContent: string;
  output: string;
  type: "text" | "image";
  page: number;
  chunk: number;
  id: string;
}

export interface processorInterface {
  gettingOutput: boolean;
  streaming: boolean;
  waitingMessage: boolean;
  generatingImage: boolean;
}

function Simplifier() {
  const [output, setOutput] = useState<paperOutputInterface | undefined>();
  const allOutputsRef = useRef<paperOutputInterface[]>([]);
  const outputRef = useRef<paperOutputInterface | undefined>(undefined);
  const { currentFile, processorRef } = useDocsContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [selectedPage, setSelectedPage] = useState(-1);
  const [processor, setProcessor] = useState<processorInterface>({
    generatingImage: false,
    waitingMessage: false,
    gettingOutput: false,
    streaming: false,
  });
  const [error, setError] = useState<null | string>(null);

  const handleFileUpload = async () => {
    try {
      if (
        !currentFile ||
        processorRef.current.streaming ||
        processorRef.current.gettingOutput
      )
        return;
      setError(null);
      setOutput(undefined);
      const formData = new FormData();
      formData.append("file", currentFile);
      processorRef.current.gettingOutput = true;

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/documents/upload-paper`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      if (!response.ok) {
        const error = await response.json(); // ✅ parse JSONResponse
        throw new Error(error.message);
      }

      if (!response.body) {
        throw new Error("Streaming not supported");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      setProcessor((prev) => ({
        ...prev,
        gettingOutput: false,
        streaming: true,
      }));
      processorRef.current.streaming = true;
      processorRef.current.gettingOutput = false;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // ✅ accumulate
        buffer += chunk;

        // split safely
        const parts = buffer.split("<END>");

        // process ONLY complete parts
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i].trim();
          if (!part) continue;

          let parsed;
          try {
            parsed = JSON.parse(part);
          } catch (e) {
            console.error("JSON parse failed:", part);
            continue;
          }

          // ===== YOUR EXISTING LOGIC (unchanged) =====

          if (parsed?.type === "error" || parsed?.type === "end") {
            if (parsed?.type === "error") {
              toast.info(
                parsed?.message || parsed?.error || "failed to stream",
              );
              setError(parsed?.message || parsed?.error || "failed to stream");
            }

            const finalOutput = outputRef.current;
            if (finalOutput) {
              allOutputsRef.current.push(finalOutput);
            }

            setOutput(undefined);
            outputRef.current = undefined;

            setProcessor((prev) => ({
              ...prev,
              streaming: false,
              gettingOutput: false,
            }));

            processorRef.current.gettingOutput = false;
            processorRef.current.streaming = false;
          } else if (parsed?.type === "text") {
            const content = parsed["content"];

            if (content) {
              setOutput((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  output: (prev.output || "") + content,
                };
              });

              if (outputRef.current) {
                outputRef.current = {
                  ...outputRef.current,
                  output: outputRef.current.output + content,
                };
              }
            }

            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          } else if (parsed?.type === "image") {
            const content = parsed["content"];

            if (content) {
              setOutput((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  output: (prev.output || "") + content,
                };
              });

              if (outputRef.current) {
                outputRef.current = {
                  ...outputRef.current,
                  output: outputRef.current.output + content,
                };
              }
            }

            bottomRef.current?.scrollIntoView();
          } else if (parsed.type === "originalContent") {
            const finalOutput = outputRef.current;
            if (finalOutput) {
              allOutputsRef.current.push(finalOutput);
            }

            const newOutput = {
              originalContent:
                parsed["content-type"] === "text" ? parsed["content"] : "Image",
              output: "",
              type: parsed["type"],
              page: parsed["page"],
              chunk: parsed["block_idx"],
              id: parsed["id"],
            };

            setOutput(newOutput);
            outputRef.current = newOutput;
          }
        }

        // ✅ keep last incomplete chunk
        buffer = parts[parts.length - 1];
      }
    } catch (error: any) {
      toast.info(error?.message || "failed to respond");
      setError(error?.message || "failed to respond");
    } finally {
      setProcessor((prev) => ({
        ...prev,
        gettingOutput: false,
        streaming: false,
      }));
      processorRef.current.streaming = false;
      processorRef.current.gettingOutput = false;
    }
  };

  useEffect(() => {
    if (currentFile) {
      handleFileUpload();
      setProcessor((prev) => ({ ...prev, gettingOutput: true }));
    } else router.navigate("/", { replace: true });
  }, [currentFile, setProcessor]);

  useEffect(() => {
    if (selectedPage) {
      document
        .getElementById(`${selectedPage}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPage]);

  if (!currentFile) return null;

  return (
    <div className="text-sm  flex-1  flex flex-row place-content-between h-full    max-w-full  min-h-0">
      <PdfViewer
        setSelectedPage={setSelectedPage}
        selectedPage={selectedPage}
      />
      {processor.gettingOutput && (
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className="
                            size-10 
                            rounded-full 
                            bg-emerald-500/30 
                            animate-ping
                        "
            />

            <p className="text-sm text-slate-500">Generating explanation...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="w-full h-full place-content-center place-items-center flex">
          {" "}
          <Retry message={error} retry={() => handleFileUpload()} />
        </div>
      )}
      {!processorRef.current.gettingOutput &&
        !processor.gettingOutput &&
        !error && (
          <OutputSection
            selectedPage={selectedPage}
            processor={processor}
            output={output}
            allOutputsRef={allOutputsRef}
            bottomRef={bottomRef}
          />
        )}
    </div>
  );
}

export default Simplifier;
