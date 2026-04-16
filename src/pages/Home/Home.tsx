import { useEffect, useRef } from "react";
import { useDocsContext } from "../../context/Docs";
import router from "../../routes/routes";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { currentFile, setCurrentFile } = useDocsContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentFile) {
      router.navigate("/analyze-pdf");
    }
  }, [currentFile]);

  return (
    <div className="relative flex-1 min-h-0 h-full overflow-hidden">
      {/* 🌈 Multi-layer animated gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(20,184,166,0.25),transparent_50%)]" />

      {/* ✨ Moving glow blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-3xl animate-pulse" />

      {/* 🌿 Subtle grid overlay (pro feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* 🌟 MAIN CONTENT */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* 🏷️ Badge */}
        <div className="mb-6 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-emerald-200 text-emerald-700 text-xs font-medium">
          AI-powered Research Simplification
        </div>

        {/* 🔥 Heading */}
        <h1 className="text-6xl font-bold leading-tight mb-6 text-gray-800 max-w-3xl">
          Understand research papers
          <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            like never before
          </span>
        </h1>

        {/* ✍️ Description */}
        <p className="text-gray-600 mb-10 max-w-xl text-lg leading-relaxed">
          Drop any research paper and instantly get simplified explanations,
          structured insights, and interactive chat — all in one place.
        </p>

        {/* 📦 Upload Card */}
        <div className="relative group w-[420px]">
          {/* glow border effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 opacity-30 blur group-hover:opacity-60 transition" />

          <div className="relative border border-emerald-200 rounded-2xl p-8 bg-white/80 backdrop-blur-xl transition-all">
            <p className="text-sm text-gray-600 text-center mb-5">
              Drop your research paper here or choose a file <br />
              Supports PDF (Max 5MB)
            </p>

            <div className="flex justify-center">
              <input
                type="file"
                ref={inputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file && file.size > 3 * 1024 * 1024) {
                    toast.info("File size must be 3MB or less.");
                    e.target.value = "";
                    setCurrentFile(null);
                  } else {
                    setCurrentFile(file);
                    navigate("/analyze-pdf", { replace: true });
                  }
                }}
                multiple={false}
                accept="application/pdf"
                className="hidden"
              />

              <button
                onClick={() => inputRef.current?.click()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 active:scale-[0.97] transition-all"
              >
                Upload Research Paper
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Private • Secure • Instant
            </p>
          </div>
        </div>

        {/* 💡 Floating feature cards (THIS adds depth) */}
        <div className="absolute top-[20%] left-[10%] hidden lg:block">
          <div className="px-4 py-3 bg-white/80 backdrop-blur-md border border-emerald-100 rounded-xl text-sm text-gray-600">
            📄 Simplified explanations
          </div>
        </div>

        <div className="absolute bottom-[20%] right-[10%] hidden lg:block">
          <div className="px-4 py-3 bg-white/80 backdrop-blur-md border border-emerald-100 rounded-xl text-sm text-gray-600">
            💬 Ask questions instantly
          </div>
        </div>
      </main>
    </div>
  );
}
