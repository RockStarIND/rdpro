import type { OdFileObject } from '../../types'

import { FC } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { PreviewContainer, DownloadBtnContainer } from './Containers'
import DownloadButtonGroup from '../DownloadBtnGtoup'
import { getStoredToken } from '../../utils/protectedRouteHandler'
import ItemPathStore from '../../stores/ItemPathStore'

const ImagePreview: FC<{ file: OdFileObject }> = ({ file }) => {
  const { asPath } = useRouter()
  const hashedToken = getStoredToken(asPath)

  const imageLoader = () => {
    return `/api/thumbnail/?path=${ItemPathStore.getMapping(asPath)}${hashedToken ? `&odpt=${hashedToken}` : ''}`
  }

  return (
    <>
      <PreviewContainer>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className='' >
          <Image
            className="mx-auto"
            loader={imageLoader}
            src={`${`/api/thumbnail/?path=${ItemPathStore.getMapping(asPath)}${hashedToken ? `&odpt=${hashedToken}` : ''}`}`}
            alt={file.name}
            width={file.image?.width}
            height={file.image?.height}
            layout='responsive'
          />
        </div>

      </PreviewContainer>
      <div className="text-black dark:text-white text-justify py-2 space-y-2 select-none">
      <h1 className="text-center text-xl md:text-5xl  font-bold py-4">{file.name}</h1>
        <p>Here is the {file.name} can be used to overcome some software problems on {file.name}, to direct it you can use a flasher box that has direct isp feature support and usually the flasher box can also be used for repairing emmc like Easy Jtag, Ufi, etc.
            If you are a mobile technician searching for {file.name} then you landed at right place. in this post, you will file {file.name} for remove User Lock And Pattern Lock Bypass Frp Lock and also you can use this isp pinout for flashing.</p>
        <p>Using this ISP Pinout you can use lock (pin, pattern, password) or google account (FRP) to reset.If you can read and write a dump file and flash file.</p>
      </div>
      <DownloadBtnContainer>
        <DownloadButtonGroup fileId={file.id} fileName={file.name}/>
      </DownloadBtnContainer>
    </>
  )
}

export default ImagePreview
