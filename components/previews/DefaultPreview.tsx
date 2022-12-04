import type { OdFileObject } from '../../types'
import { FC, useState } from 'react'

import { useTranslation } from 'next-i18next'


import { formatModifiedDateTime, humanFileSize } from '../../utils/fileDetails'

import DownloadButtonGroup from '../DownloadBtnGtoup'
import { DownloadBtnContainer, PreviewContainer } from './Containers'


const DefaultPreview: FC<{ file: OdFileObject }> = ({ file }) => {
  const { t } = useTranslation()

  // Some thumbnails are broken, so we check for onerror event in the image component
  const [brokenThumbnail, setBrokenThumbnail] = useState(false)

  return (
    <div>
      <PreviewContainer>
        <div className="items-center px-5 py-4 md:flex md:space-x-8">
          <div className="md:w-1/4 flex justify-center">
            {file.thumbnailUrl && !brokenThumbnail ? (
              <img
                className="object-contain object-center"
                src={file.thumbnailUrl}
                onError={() => setBrokenThumbnail(true)}
              />
            ) : (
              <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-center font-bold rounded-xl text-white'> 
              <img src="/no-img.png" alt="IMAGE NOT FOUND" />
              <p className='pb-6'>UPLOADING SOON...</p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2 py-4 md:flex-1">
            <div>
              <div className="font-bold text-lg overflow-auto">{file.name}</div>
              <div className="py-2">The File will help you Upgrade, Downgrade, or re-install the Stock Firmware (OS) on your Mobile Device. In addition, the Flash File (ROM) also enables you to repair the Mobile device if facing any Software Issue, Bootloop Issue, IMEI Issue, or Dead Issue.</div>
            </div>

            <div>
              <div className="py-2 font-bold uppercase opacity-80">{t('Upload Date')} - {t('File size')}</div>
              <div>{formatModifiedDateTime(file.lastModifiedDateTime)} - {humanFileSize(file.size)}</div>
            </div>


            <div>
              <div className="py-2 text-xs font-medium uppercase opacity-80">{t('Hashes')}</div>
              <table className="block w-full border dark:border-gray-700 overflow-scroll whitespace-nowrap text-sm md:table">
                <tbody>
                  <tr className="bg-white dark:border-gray-700 dark:bg-slate-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-slate-900 dark:text-gray-400">
                      Quick XOR
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-black dark:text-white">
                      {file.file.hashes?.quickXorHash ?? t('Unavailable')}
                    </td>
                  </tr>
                  <tr className="border-y bg-white dark:border-gray-700 dark:bg-slate-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-slate-900 dark:text-gray-400">
                      SHA1
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-black dark:text-white">
                      {file.file.hashes?.sha1Hash ?? t('Unavailable')}
                    </td>
                  </tr>
                  <tr className="bg-white dark:border-gray-700 dark:bg-slate-900">
                    <td className="bg-gray-50 py-1 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-slate-900 dark:text-gray-400">
                      SHA256
                    </td>
                    <td className="whitespace-nowrap py-1 px-3 font-mono text-black dark:text-white">
                      {file.file.hashes?.sha256Hash ?? t('Unavailable')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PreviewContainer>
      <DownloadBtnContainer>
        <DownloadButtonGroup fileId={file.id} fileName={file.name}/>
      </DownloadBtnContainer>
    </div>
  )
}

export default DefaultPreview