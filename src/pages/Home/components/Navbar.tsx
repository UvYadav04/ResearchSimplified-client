import router from '../../../routes/routes'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { jwtDecode } from 'jwt-decode'
import { useLoginMutation, useLogoutMutation } from '../../../services/userSlice'
import { Loader, LogOut, Menu } from 'lucide-react'
import { useDocsContext } from '../../../context/Docs'
import useUserInfo from '../../../hooks/useUserInfo'

export interface userInfo {
    name: string,
    email: string,
    chatCounts: number,
    documentUploads: number,
    imageGenerations: number
}

function Navbar() {
    const [login, { isLoading: loggingIn }] = useLoginMutation()
    const [logout, { isLoading: loggingOut }] = useLogoutMutation()
    const { setCurrentFile, setSidebarOpen } = useDocsContext()
    const { userInfo, gettingUserInfo } = useUserInfo()

    console.log(userInfo)
    const handleLogout = async () => {
        try {
            const { success, message } = await logout().unwrap()
            if (!success)
                throw new Error(message)
            setCurrentFile(null)
        } catch (error: any) {
            toast.info(error?.message || error?.data?.message || "Failed to Log out at the moment")
        }
    }
    const handleLogin = async (name: string, email: string) => {
        try {
            const { success, message } = await login({ name, email }).unwrap()
            if (!success)
                throw new Error(message)
            setCurrentFile(null)
        } catch (error: any) {
            toast.info(error?.message || error?.data?.message || "Failed to Log in at the moment")
        }
    }

    return (
        <div className="w-full pe-10 ps-4 py-2 h-fit flex justify-between items-center bg-slate-100 backdrop-blur-md border-b">
            <h1 className="text-xl font-semibold text-green-600 cursor-pointer flex place-items-center  gap-2" onClick={() => router.navigate("/", { replace: true })}>
                <Menu onClick={() => setSidebarOpen(true)} className='md:hidden block mt-[3px]' size={30} />
                <span>
                    ResearchSimplified
                </span>
            </h1>


            <div className="flex gap-3 place-content-between place-items-center">
                <div className="links flex place-content-evenly place-items-center gap-5">
                    <a
                        href="https://github.com/UvYadav04/ResearchSimplified-client"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black transition"
                    >
                        <span className="hidden lg:inline">GitHub</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/dinesh-yadav-264113265"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black transition"
                    >
                        <span className="hidden lg:inline">LinkedIn</span>
                    </a>
                </div>

                {gettingUserInfo || loggingIn || loggingOut ? <Loader className='animate-spin' /> : (userInfo ? <button className="px-4 py-2 border rounded-lg text-sm flex gap-2 place-items-center place-content-between group">
                    <span>{userInfo.name}</span>
                    <LogOut onClick={() => handleLogout()} className='group-hover:block hidden transition-all duration-300 ease-out' size={20} color='orangeRed' />
                </button> :
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const decoded: any = jwtDecode(credentialResponse.credential || "")
                            handleLogin(decoded.name, decoded.email)
                        }}
                        onError={() => {
                            toast.error("cant log in at the moment")
                        }}
                    />
                )}
                {/* <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
                        Get Started
                    </button> */}
            </div>
        </div>
    )
}

export default Navbar
