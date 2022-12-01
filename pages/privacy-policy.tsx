import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import siteConfig from '../config/site.config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getOdConcealedAccessTokens } from '../utils/odAuthTokenStore'
import { resolveTotalDownloads } from '../utils/DownloadsUtil'

export default function Home({ url, totalDownloads, connectedAccounts }) {
  const color = "##FFFFFF";
  const title = `Privacy Policy`
  const des = `This Privacy Policy governs the manner in which {siteConfig.title} collects, uses, maintains and discloses information collected from users (each, a “User”) of the {siteConfig.title} website (“Site”). This privacy policy applies to the Site and all products and services offered by {siteConfig.title}.`
  const keywords = `therockstarind, Terms and rules, flash file, flash tool, firmware, emmc isp pinouts, test point, dump file, windows, qcn file`
  const og_image = "https://therockstarind.com/icons/privacy.png";

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
          <h3 className="mb-4 text-center text-[30px] font-bold">
           Privacy Policy
          </h3>
          <h3 className="font-bold">
           Privacy Policy
          </h3>
          <p>
           This Privacy Policy governs the manner in which {siteConfig.title} collects, uses, maintains and discloses information collected from users (each, a “User”) of the {siteConfig.title} website (“Site”). This privacy policy applies to the Site and all products and services offered by {siteConfig.title}.   
          </p>
          <h3 className="py-4 font-bold">
           Personal identification information
          </h3>
          <p className="py-1">
            We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, subscribe to the newsletter, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.        
          </p>
          <h3 className="py-4 font-bold">
           Non-personal identification information 
          </h3>
          <p className="py-1">
           We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
          </p>
          <h3 className="py-4 font-bold">
           Web browser cookies 
          </h3>
          <p className="py-1">
           Our Site may use “cookies” to enhance User experience. User’s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
          </p>
          <h3 className="py-4 font-bold">
           How we use collected information 
          </h3>
          <p className="py-1 ml-1">
           {siteConfig.title} may collect and use Users personal information for the following purposes:
          </p>
          <ol className="list-decimal ml-11">
             <li>
               To improve customer service
               Information you provide helps us respond to your customer service requests and support needs more efficiently.
             </li>
             <li>
               To personalize user experience
               We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.
             </li>
             <li>
               To improve our Site We may use feedback you provide to improve our products and services.
             </li>
             <li>
               To send periodic emails We may use the email address to respond to their inquiries, questions, and/or other requests.
             </li>
          </ol>
          <h3 className="py-4 font-bold">
           How we protect your information  
          </h3>
          <p className="py-1">
           We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
          </p>
          <p className="py-4">
           Our Site is in compliance with PCI vulnerability standards in order to create as secure of an environment as possible for Users.
          </p>
          <h3 className="py-4 font-bold">
           Sharing your personal information   
          </h3>
          <p className="py-1">
           We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.We may use third party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.
          </p>
          <h3 className="py-4 font-bold">
           Changes to this privacy policy   
          </h3>
          <p className="py-1">
           {siteConfig.title} has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Site, revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.          
          </p>
          <h3 className="py-4 font-bold">
           Your acceptance of these terms          
          </h3>
          <p className="py-1">
           By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.          
          </p>
          <h3 className="py-4 font-bold">
           Contacting us      
          </h3>
          <p className="py-4">
           If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:          
          </p>
          <p className="font-bold text-xl">
            {siteConfig.title}
          </p>
          <a href="tel:919927241144" target="_blank" rel="noopener noreferrer" className="underline decoration-green-600 decoration-wavy">Tel:- +919927241144</a>
          <p></p>
          <a href="sms:919927241144" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-600 decoration-wavy">SMS:- +919927241144</a>
          <p></p>
          <a href="mailto:therockstarind@gmail.com" target="_blank" rel="noopener noreferrer" className="underline decoration-pink-600 decoration-wavy">Mail:- therockstarind@gmail.com</a>
          <p className="py-4">
           This document was last updated on Mar 03, 2022
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
