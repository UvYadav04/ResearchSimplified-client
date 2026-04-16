import { RouterProvider } from 'react-router-dom'
import './index.css'

import router from './routes/routes'
import DocsContextProvider from './context/Docs'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { GoogleOAuthProvider } from '@react-oauth/google'


function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT}>
      <Provider store={store}>
        <DocsContextProvider>
          <Toaster position='top-right' richColors />
          <RouterProvider router={router} />
        </DocsContextProvider>
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App


