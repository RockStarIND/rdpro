import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import siteConfig from '../config/site.config'
import Navbar from '../components/Navbar'
import FileListing from '../components/FileListing'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { getOdConcealedAccessTokens } from '../utils/odAuthTokenStore'
import { resolveTotalDownloads } from '../utils/DownloadsUtil'

export default function Home({ url, totalDownloads, connectedAccounts }) {

  const color = "##FFFFFF";
  const title = `${siteConfig.title}`
  const des = `We Provide Mobile Firmware's Drivers Flash Tool FRP Dump FIle EMMC ISP PinOut  Samsung MDM File Windows Files.`
  const keywords = `therockstarind, flash file, flash tool, firmware, emmc isp pinouts, test point, dump file, windows, qcn file`
  const og_image = "https://therockstarind.com/icons/512.png";


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-900">
      <Head>
        <title>{title}</title>
        
        {/* meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content={des} />
        <meta name="keywords" content={keywords}/>
        <meta name="author" content="Rock Star 💕"/>

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        

        {/* Facebook Meta Tags */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={des} />
        <meta property="og:image" content={og_image} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={url} />
        <meta property="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={des} />
        <meta name="twitter:image" content={og_image} />
    
        {/* Open Graph data */}
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={og_image} />
        <meta property="og:description" content={des} />
        <meta property="og:site_name" content={siteConfig.title} />
        
        {/* Browser Color */}
	      <meta name="theme-color" content={color} />
	      <meta name="msapplication-navbutton-color" content={color} />
        {/* Do not add <script> tags using next/head 
        See more info here: https://nextjs.org/docs/messages/no-script-tags-in-head-component  */}
      </Head>

      <main className="flex w-full flex-1 flex-col bg-white dark:bg-slate-900">
        <Navbar />
        <div className="mx-auto w-full max-w-5xl p-4">
          <nav className="mb-4 flex items-center justify-between pl-1">
            <Breadcrumb />
          </nav>
          <FileListing />
        </div>
      </main>

      <Footer totalDownloads={totalDownloads}/>
      <input type="hidden" id="connectedAccounts" value={connectedAccounts} />
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  const connectedAccounts = await getOdConcealedAccessTokens();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      connectedAccounts,
      totalDownloads: await resolveTotalDownloads()
    },
  }
}
