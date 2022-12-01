import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'



import siteConfig from '../config/site.config'
import Navbar from '../components/Navbar'
import FileListing from '../components/FileListing'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import { getOdConcealedAccessTokens } from '../utils/odAuthTokenStore'
import { DownloadsUtil } from '../utils/DownloadsUtil'
import { getStoredToken } from '../utils/protectedRouteHandler'
import ItemPathStore from '../stores/ItemPathStore'



export default function Folders({ url, totalDownloads, connectedAccounts }) {
  

  const { query } = useRouter()
  const { asPath } = useRouter()
  const folderName = query.path && Array.isArray(query.path) ? query.path[query.path.length-1] : '';
  const color = "##FFFFFF";
  const title = `${folderName} - ${siteConfig.title}`
  const des = `Download ${folderName} stock rom and steps to flash using Flash Tool through Fastboot ROM. (With image to Test Point) - ${siteConfig.title}`
  const keywords = `${folderName}, flash-file, flash-tool, isp pinouts, ${siteConfig.title}`
  const og_image = `https://therockstarind.com/api/thumbnail/?path=${ItemPathStore.getMapping(asPath)}icon.png`
  
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
          <nav className="mb-4 flex items-center justify-between space-x-3 pl-1">
            <Breadcrumb query={query} />
          </nav>
          <FileListing query={query} />
        </div>
      </main>

      <Footer totalDownloads={totalDownloads} />
      <input type="hidden" id="connectedAccounts" value={connectedAccounts} />
    </div>
  )
}

export async function getServerSideProps({ locale, req }) {
  const connectedAccounts = await getOdConcealedAccessTokens();
  const downloads = DownloadsUtil();
  return {
    props: {
      url: `https://${req.headers.host}${req.url}`,
      ...(await serverSideTranslations(locale, ['common'])),
      connectedAccounts,
      totalDownloads: await downloads.getTotalValue()
    },
  }
}
