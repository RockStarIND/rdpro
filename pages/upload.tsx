import { useEffect, useState } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import siteConfig from '../config/site.config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FileUpload from '../components/FileUpload'
import { getAccessToken, getOdConcealedAccessTokens } from '../utils/odAuthTokenStore'
import { resolveTotalDownloads } from '../utils/DownloadsUtil'
import axios from 'axios'

export default function Home({ url, totalDownloads, connectedAccounts, token }) {
  const color = "##FFFFFF";
  const title = `Upload Files`
  const des = `Upload your Files to save for forver on our server - ${siteConfig.title}`
  const keywords = `therockstarind, Upload files, `
  const og_image = "https://therockstarind.com/icons/upload.png";
  const [quota, setQuota] = useState({used: 0, remaining: 0})

        useEffect(() => {
                const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                axios.get("https://graph.microsoft.com/v1.0/me/drive", config)
                .then(res => {
                        setQuota(res.data.quota)
                })
        },[])

        function formatBytes(bytes, decimals = 2) {
                if (!+bytes) return '0 Bytes'

                const k = 1024
                const dm = decimals < 0 ? 0 : decimals
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

                const i = Math.floor(Math.log(bytes) / Math.log(k))

                return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
            }

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

                <main className="flex w-full h-full flex-1 flex-col bg-white dark:bg-slate-900">
                        <Navbar />
                        <div className="mx-auto w-full max-w-5xl p-8 mt-12 text-center text-black dark:text-white bg-white dark:bg-slate-900">
                                <FileUpload token={token} />
                                <div className='py-6'>
                                        <span>{formatBytes(quota.remaining)} available of 5 TB</span>
                                </div>
                        </div>
                </main>

                <Footer totalDownloads={totalDownloads}/>
                <input type="hidden" id="connectedAccounts" value={connectedAccounts} />
        </div>)
}

export async function getServerSideProps({req, locale }) {
        const connectedAccounts = await getOdConcealedAccessTokens();

        const token = await getAccessToken(0);

        return {
                props: {
                        ...(await serverSideTranslations(locale, ['common'])),
                                connectedAccounts,
                                token,
                                totalDownloads: await resolveTotalDownloads()
                },
        }
}