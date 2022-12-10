import Link from 'next/link'
import Image from 'next/image'
import siteConfig from '../config/site.config'
import { Tooltip } from 'react-tooltip'

function Footer({ totalDownloads }) {

  return (
    <div className='mx-auto flex w-full items-center justify-between space-x-4 py-1 border-t text-center text-xs text-black dark:text-white dark:border-gray-700'>
      <div className='mx-auto flex w-full items-center justify-between  py-1 flex-wrap-reverse flex-grow-half  flex-col-reverse lg:flex-row'>
        <Link href='/' passHref>
          <a className='flex justify-self-end items-center py-2 text-black dark:text-white md:p-2'>
            <Image src={siteConfig.icon} alt='icon' width='24' height='24' priority />
            <span className='font-medium text-black dark:text-white'>© 2022 {siteConfig.title}, Inc.</span>
          </a>
        </Link>
        <ul className='flex  list-style-none flex-wrap flex-justify-center flex-lg-justify-between justify-center text-[#0969da] dark:text-[#0969da] py-2'>
          <Tooltip anchorId='FRP' content='FRP Files & Tool' />
          <li className='mr-2 ml-2'>
            <Link href='/FRP'>
              <a id='FRP'>FRP</a>
            </Link>
          </li>
          <Tooltip anchorId='Drivers' content='Android USB Drivers' />
          <li className='mr-2 ml-2'>
            <Link href='/Drivers'>
              <a id='Drivers'>Drivers</a>
            </Link>
          </li>
          <Tooltip anchorId='Flash-Tool' content='Mobile Flashing Tool' />
          <li className='mr-2 ml-2'>
            <Link href='/Flash-Tool'>
              <a id='Flash-Tool'>Flash Tool</a>
            </Link>
          </li>
          <Tooltip anchorId='ISP-Pinouts' content='UFI EMMC ISP Pinouts' />
          <li className='mr-2 ml-2'>
            <Link href='/ISP-Pinout'>
              <a id='ISP-Pinouts'>ISP Pinouts</a>
            </Link>
          </li>
          <Tooltip anchorId='QCN-Files' content='Qualcomm Calibration Network file' />
          <li className='mr-2 ml-2'>
            <Link href='/QCN'>
              <a id='QCN-Files'>QCN Files</a>
            </Link>
          </li>
          <Tooltip anchorId='MDM-Files' content='Samsung MDM Remove Files' />
          <li className='mr-2 ml-2'>
            <Link href='/MDM-Files'>
              <a id='MDM-Files'>MDM Files</a>
            </Link>
          </li>
          <Tooltip anchorId='Windows' content='Windows Files and Tool' />
          <li className='mr-2 ml-2'>
            <Link href='/Windows'>
              <a id='Windows'>Windows</a>
            </Link>
          </li>
          <Tooltip anchorId='No-Auth-Firehose' content='No Auth Loader Firehose File' />
          <li className='mr-2 ml-2'>
            <Link href='/No-Auth-Firehose'>
              <a id='No-Auth-Firehose'>No Auth Firehose</a>
            </Link>
          </li>
          <Tooltip anchorId='Today-Upload' content='Today Upload List' />
          <li className='mr-2 ml-2'>
            <Link href='/Today-Upload'>
              <a id='Today-Upload'>Today Upload</a>
            </Link>
          </li>
          <Tooltip anchorId='Upload-History' content='Upload History List' />
          <li className='mr-2 ml-2'>
            <Link href='/Upload-History'>
              <a id='Upload-History'>Upload History</a>
            </Link>
          </li>
          <Tooltip anchorId='Terms' content='Terms and rules' />
          <li className='mr-2 ml-2'>
            <Link href='/Terms-and-rules'>
              <a id='Terms'>Terms</a>
            </Link>
          </li>
          <Tooltip anchorId='Privacy' content='Privacy Policy' />
          <li className='mr-2 ml-2'>
            <Link href='/privacy-policy'>
              <a id='Privacy'>Privacy</a>
            </Link>
          </li>
          <Tooltip anchorId='Sitemap' content='Sitemap URL' />
          <li className='mr-2 ml-2'>
            <Link href='/sitemap.xml'>
              <a target='_blank' rel='noopener noreferrer' id='Sitemap'>Sitemap</a>
            </Link>
          </li>
        </ul>
        <ul className='flex justify-center font-medium text-black dark:text-white py-2'>
        <Tooltip anchorId='Files' content='Total Files' />
          <li className='mr-2 ml-2' id='Files'>2325 Files</li>
        <Tooltip anchorId='Size' content='Total Used Size' />
          <li className='mr-2 ml-2' id='Size' data-tooltip-content="Total Uesd Size">3.30 TB </li>
          <li className='mr-2 ml-2 hidden'>{totalDownloads} Downloads</li>
        </ul>
      </div>
    </div>
  )
}
export default Footer
