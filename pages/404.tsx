import { useTranslation } from "next-i18next"
import Head from "next/head"
import { useRouter } from "next/router"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEffect, useState } from "react"
import axios from "axios"
import LottiePlayer from "../components/LottiePlayer"

export default function Custom404() : JSX.Element {

  const router = useRouter()
  const { t } = useTranslation()
  
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [connectedAccounts, setConnectedAccounts] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get("/api/downloads/total/"),
      axios.get("/api/tokens/")
    ]).then(responses => {
        responses.forEach(res => {
          if(Number.isInteger(res.data)){
            setTotalDownloads(res.data)
          } else {
            setConnectedAccounts(res.data)
          }
        })
      });
  }, [])
  
  return (<div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-900">
            <Head>
              <title>Not Found</title>
            </Head>
            <main className="flex w-full flex-1 flex-col bg-white dark:bg-slate-900">
            <Navbar />
            <div className="justify-center">
              <div className="m-auto flex flex-col items-center">
                <LottiePlayer src="https://assets6.lottiefiles.com/packages/lf20_xiebbQE7S1.json" style={{height: "400px"}}/>
              </div>
              <div className="flex justify-center mb-2">
                <button onClick={() => router.push('/')} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                  {t('Home')}
                </button>
              </div>
            </div>
            </main>
            <Footer totalDownloads={totalDownloads} />
            <input type="hidden" id="connectedAccounts" value={connectedAccounts} />
          </div>)
}
