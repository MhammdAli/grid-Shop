import '../styles/globals.css'
import Layout from '../components/Layout'
import {SessionProvider} from "next-auth/react"
import { StoreProvider } from '../themes/store'
function MyApp({ Component, pageProps}) {
 
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout> 
      </StoreProvider>
    </SessionProvider>
  )
}

export default MyApp
