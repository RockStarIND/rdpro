import { useState } from "react";
import Image from 'next/image'
import { OdFolderChildren } from "../types";
import { formatModifiedDateTime } from "../utils/fileDetails";
import { ChildIcon, ChildName } from "./FileListing";
import LottiePlayer from './LottiePlayer'

const GridItem = ({ c, path }: { c: OdFolderChildren, path: string }) => {

  // Some thumbnails are broken, so we check for onerror event in the image component
  const [brokenThumbnail, setBrokenThumbnail] = useState(false)

  return (
    <div className="space-y-2">
      <div className="h-48 overflow-hidden rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-850">
        {c.thumbnailUrl && !brokenThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="relative flex h-full w-full items-center justify-center rounded-lg">
            <Image
              className="h-full w-full object-contain object-center"
              src={c.thumbnailUrl}
              alt={c.name}
              layout='fill'
              onError={() => setBrokenThumbnail(true)}
            />
            <span className="rounded px-1 absolute bottom-0 right-0 font-medium text-black dark:text-white bg-white dark:bg-slate-900">
              {c.folder?.childCount}
            </span>
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center rounded-lg text-center bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500">
            <div className="font-bold text-xs text-white">
              <Image src="/no-img.png" layout="responsive" width={1} height={1} objectFit="contain" alt="IMAGE NOT FOUND" />
              <p className='pb-4'>UPLOADING SOON...</p>
            </div>
            <span className="rounded px-1 absolute bottom-0 right-0 font-medium text-white dark:text-white">
              {c.folder?.childCount}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-center space-x-2">
        <span className="w-5 flex-shrink-0 text-center">
          <ChildIcon child={c} />
        </span>
        <ChildName name={c.name} folder={Boolean(c.folder)} />
      </div>
      <div className="truncate text-center font-mono text-xs text-black dark:text-white">
        {formatModifiedDateTime(c.lastModifiedDateTime)}
      </div>
    </div>
  )
}

export default GridItem;
