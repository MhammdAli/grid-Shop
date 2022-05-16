import '../styles/globals.css'  
import { StoreProvider } from '../store/store'
import {AuthProvider} from "../auth/AuthContext"
function MyApp({ Component, pageProps}) {
   
  return ( 
    <AuthProvider session={pageProps.session}>
      <StoreProvider>
          <Component {...pageProps} /> 
      </StoreProvider>
    </AuthProvider> 
  )
}

export default MyApp
