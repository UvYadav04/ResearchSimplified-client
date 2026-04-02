import React from 'react'
import router from '../../../routes/routes'

function Navbar() {
    return (
        <div className="w-full px-10 py-2 h-fit flex justify-between items-center bg-slate-100 backdrop-blur-md border-b">
            <h1 className="text-xl font-semibold text-green-600 cursor-pointer" onClick={() => router.navigate("/", { replace: true })}>
                ResearchSimplified
            </h1>


            <div className="flex gap-3 place-content-between place-items-center">
                <div className="links flex place-content-evenly place-items-center gap-5">
                    <a
                        href="https://github.com/your-username/your-repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black transition"
                    >
                        <span className="hidden lg:inline">GitHub</span>
                    </a>

                    <a
                        href="https://linkedin.com/in/your-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black transition"
                    >
                        <span className="hidden lg:inline">LinkedIn</span>
                    </a>
                </div>

                <button className="px-4 py-2 border rounded-lg text-sm">
                    Sign in
                </button>
                {/* <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
                        Get Started
                    </button> */}
            </div>
        </div>
    )
}

export default Navbar
