import Navbar from '../Home/components/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div className='w-full h-screen flex flex-col place-content-start'>
            <Navbar />
            <div className='w-full flex-1 min-h-0'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
