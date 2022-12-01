import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import siteConfig from '../config/site.config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getOdConcealedAccessTokens } from '../utils/odAuthTokenStore'
import { resolveTotalDownloads } from '../utils/DownloadsUtil'

export default function Home({ url, totalDownloads, connectedAccounts }) {
  const color = "##FFFFFF";
  const title = `Terms and rules`
  const des = `The providers (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) of the service provided by this web site (&quot;Service&quot;) are not responsible for any user-generated content and accounts. Content submitted express the views of their author only.`
  const keywords = `therockstarind, Terms and rules, flash file, flash tool, firmware, emmc isp pinouts, test point, dump file, windows, qcn file`
  const og_image = "https://therockstarind.com/icons/terms.png";

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
        <div className="mx-auto w-full max-w-5xl p-4 text-black dark:text-white">
          <h1 className="mb-4 text-center text-[30px] font-bold">
           Terms and rules
          </h1>
          <p className="py-2">
           The providers (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) of the service provided by this web site (&quot;Service&quot;) are not responsible for any user-generated content and accounts. Content submitted express the views of their author only.
          </p>
          <p className="py-2">
           This Service is only available to users who are at least 18 years old. If you are younger than this, please do not register for this Service. If you register for this Service, you represent that you are this age or older.
          </p>
          <p className="py-2">
           All content you submit, upload, or otherwise make available to the Service (&quot;Content&quot;) may be reviewed by staff members. All Content you submit or upload may be sent to third-party verification services (including, but not limited to, spam prevention services). Do not submit any Content that you consider to be private or confidential.
          </p>
          <p className="py-2">
           You agree to not use the Service to submit or link to any Content which is defamatory, abusive, hateful, threatening, spam or spam-like, likely to offend, contains adult or objectionable content, contains personal information of others, risks copyright infringement, encourages unlawful activity, or otherwise violates any laws. You are entirely responsible for the content of, and any harm resulting from, that Content or your conduct.
          </p>
          <p className="py-2">
           We may remove or modify any Content submitted at any time, with or without cause, with or without notice. Requests for Content to be removed or modified will be undertaken only at our discretion. We may terminate your access to all or any part of the Service at any time, with or without cause, with or without notice.
          </p>
          <p className="py-2">
           You are granting us with a non-exclusive, permanent, irrevocable, unlimited license to use, publish, or re-publish your Content in connection with the Service. You retain copyright over the Content.
          </p>
          <p className="py-2">
           These terms may be changed at any time without notice.
          </p>
          <p className="py-2">
           If you do not agree with these terms, please do not register or use the Service. Use of the Service constitutes acceptance of these terms. If you wish to close your account, please 
           <a href="/privacy-policy"> contact us.</a>
          </p>
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
