import { Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import Navbar from './pages/Home/components/Navbar'
import Home from './pages/Home/Home'
import router from './routes/routes'
import DocsContextProvider from './context/Docs'
import { Toaster } from 'sonner'


function App() {
  return (
    <DocsContextProvider>
      <Toaster position='top-right' richColors />
        <RouterProvider router={router} />
   </DocsContextProvider>
  )
}

export default App


