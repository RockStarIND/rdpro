import Link from 'next/link'
import Image from 'next/image'
import siteConfig from '../config/site.config'
import { Tooltip } from "@nextui-org/react";


const Footer = ({ totalDownloads }) => {

  return (
    <div className="mx-auto flex w-full items-center justify-between space-x-4 py-1 border-t text-center text-xs text-black dark:text-white dark:border-gray-700">
      <div className="mx-auto flex w-full items-center justify-between  py-1 flex-wrap-reverse flex-grow-half  flex-col-reverse lg:flex-row">
        <Link href="/" passHref>
          <a className="flex justify-self-end items-center py-2 hover:opacity-80 text-black dark:text-white md:p-2">
            <Image src={siteConfig.icon} alt="icon" width="24" height="24" priority />
            <span className="font-medium text-black dark:text-white">© 2022 {siteConfig.title}, Inc.</span>
          </a>
        </Link>
        <ul className="flex  list-style-none flex-wrap flex-justify-center flex-lg-justify-between justify-center text-black dark:text-white py-2">
        <Tooltip content="FRP Files & Tool" color="success">
        <li className="mr-2 ml-2">
          <Link href="/FRP">
          <a>FRP</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Android USB Flashing Driver" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Drivers">
          <a>Drivers</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Mobile Flashing Tool's" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Flash-Tool">
          <a>Flash Tool</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="UFI EMMC ISP Pinouts" color="success">
        <li className="mr-2 ml-2">
          <Link href="/ISP-Pinout">
          <a>ISP Pinouts</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Qualcomm Calibration Network file" color="success">
        <li className="mr-2 ml-2">
          <Link href="/QCN">
          <a>QCN Files</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="SAMSUNG MDM REMOVE DOWNLOAD MODE" color="success">
        <li className="mr-2 ml-2">
          <Link href="/MDM-Files">
          <a>MDM Files</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Latest Windows & Tool's" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Windows">
          <a>Windows</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="No Auth Loader Firehose File Bypasses The Secure Boot Auth Permission" color="success">
        <li className="mr-2 ml-2">
          <Link href="/No-Auth-Firehose">
          <a>No Auth Firehose</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Today Upload List" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Today-Upload">
          <a>Today Upload</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Upload History List" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Upload-History">
          <a>Upload History</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Our Terms and rules" color="success">
        <li className="mr-2 ml-2">
          <Link href="/Terms-and-rules">
          <a>Terms</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Our privacy Policy" color="success">
        <li className="mr-2 ml-2">
          <Link href="/privacy-policy">
          <a>Privacy</a>
          </Link>
        </li>
        </Tooltip>
        <Tooltip content="Sitemap Index URL" color="success">
        <li className="mr-2 ml-2">
          <Link href="/sitemap.xml">
          <a target="_blank" rel="noopener noreferrer">Sitemap</a>
          </Link>
        </li>
        </Tooltip>
      </ul>
        <ul className="flex justify-center font-medium text-black dark:text-white py-2">
          <li className="mr-2 ml-2">2325 Files</li>
          <li className="mr-2 ml-2">3.30 TB </li>
          <li className="mr-2 ml-2 hidden">{totalDownloads} Downloads</li>
        </ul>
      </div>
    </div>
  )
}
export default Footer
