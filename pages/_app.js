import '../styles/globals.css'
import Layout from '../components/Layout' 
import { StoreProvider } from '../store/store'
import {AuthProvider} from "../auth/AuthContext"
function MyApp({ Component, pageProps}) {
   
  return ( 
    <AuthProvider session={pageProps.session}>
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout> 
      </StoreProvider>
    </AuthProvider> 
  )
}

export default MyApp
