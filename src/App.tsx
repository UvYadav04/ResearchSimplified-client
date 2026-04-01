import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import '../src/styles/global.css'
import ReactMarkdown from 'react-markdown'

interface paperOutputInterface {
  originalContent: string,
  output: string,
  type: "text" | 'image'
}

function App() {
  const [output, setOutput] = useState<paperOutputInterface | undefined>()
  const allOutputsRef = useRef<paperOutputInterface[]>([])
  const outputRef = useRef<paperOutputInterface | undefined>(undefined)

  const [file, setFile] = useState<File | undefined>(undefined)
  const handleFileUpload = async () => {
    if (!file)
      return;
    setOutput(undefined)
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("http://localhost:8000/documents/upload-paper",
      {
        method: "POST",
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

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const parts = chunk.split("<END>")

      for (const part of parts) {
        if (!part)
          continue
        const parsed = JSON.parse(part)
        // console.log(parsed)
        if (parsed?.type === "text") {
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
        }
        else if (parsed.type === "originalContent") {
          const newOutput = {
            originalContent: parsed["content"],
            output: "",
            type: "text"
          } as paperOutputInterface
          setOutput(newOutput)
          outputRef.current = newOutput
        }
        else if (parsed.type === "end") {
          const finalOutput = outputRef.current;
          if (finalOutput) {
            allOutputsRef.current.push(finalOutput);
          }

          setOutput(undefined);
          outputRef.current = undefined;
          // console.log(allOutputsRef.current)
        }
      }
    }
  }



  return (
    <div className="text-sm p-2">
      <input type='file' onChange={(e) => setFile(e.target.files?.[0])} />
      <button onClick={() => handleFileUpload()}>Try</button>
      <div className="Output w-full p-2 flex flex-col gap-4 bg-slate-50 ">
        {allOutputsRef.current.map((item, index) => (
          <OutputBox key={index} item={item} />
        ))}
        {output && <OutputBox item={output} />}
      </div>

    </div>
  )
}

export default App


const OutputBox = ({ item }: { item: paperOutputInterface }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all">

      <div className="text-xs text-slate-500">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-slate-400">Original</span>
          <button
            className="text-blue-500 text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Expand"}
          </button>
        </div>

        <p className={`${expanded ? "" : "line-clamp-3"} leading-relaxed`}>
          {item.originalContent}
        </p>
      </div>

      <div className="h-px bg-slate-200" />

      <div className="output prose prose-sm max-w-none text-slate-800">
        <ReactMarkdown>{item.output}</ReactMarkdown>
      </div>
    </div>
  );
};