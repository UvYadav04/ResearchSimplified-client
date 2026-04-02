import { useEffect, useRef } from "react";
import { useDocsContext } from "../../context/Docs";
import Navbar from "./components/Navbar";
import router from "../../routes/routes";


export default function Home() {
    const { currentFile, setCurrentFile } = useDocsContext()
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        if (currentFile) {
            router.navigate('/analyze-pdf')
        }
    }, [currentFile])

    return (
        <div className="flex-1 min-h-0 h-full flex flex-col bg-gradient-to-br from-[#e8f1f0] via-[#dfe7f6] to-[#e9e3f5] text-gray-800">

            <main className="flex flex-1 items-center justify-between px-16 py-8 pt-0">

                <div className="max-w-xl ">
                    <p className="text-sm text-indigo-600 font-medium mb-3">
                        PDF SIMPLIFIER
                    </p>

                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        Understand your PDFs <br /> smarter & faster
                    </h2>

                    <p className="text-gray-600 mb-8">
                        Upload your PDF and let AI break it down into simple explanations,
                        key points, and insights instantly.
                    </p>

                    <div className="border border-dashed border-green-400 rounded-xl p-6 bg-white/60 backdrop-blur-md w-[380px]">

                        <p className="text-sm text-gray-600 text-center mb-4">
                            Drop your PDF here or choose a file <br />
                            Max file size 5MB
                        </p>

                        <div className="flex justify-center">
                            <input
                                type="file"
                                ref={inputRef}
                                onChange={(e) => setCurrentFile(e.target.files?.[0] || null)}
                                multiple={false}
                                accept="application/pdf"
                                className="hidden"
                            />
                            <button onClick={() => inputRef.current?.click()} className="px-5 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
                                Upload PDF
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 text-center mt-3">
                            🔒 Privacy guaranteed
                        </p>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                    <div className="w-[420px] h-[300px] bg-white rounded-2xl shadow-xl p-4 border">

                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 flex flex-col gap-3">

                            <div className="h-4 w-32 bg-gray-300 rounded"></div>

                            <div className="h-3 w-full bg-gray-300 rounded"></div>
                            <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
                            <div className="h-3 w-2/3 bg-gray-300 rounded"></div>

                            <div className="mt-4 h-24 bg-white rounded shadow-inner flex items-center justify-center text-sm text-gray-400">
                                Diagram / Chart Preview
                            </div>

                            <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}