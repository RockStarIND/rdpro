import type { OdFolderChildren } from '../types'

import Link from 'next/link'
import { FC } from 'react'
import { useClipboard } from 'use-clipboard-copy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'next-i18next'

import { getBaseUrl } from '../utils/getBaseUrl'
import { humanFileSize, formatModifiedDateTime } from '../utils/fileDetails'

import { ChildIcon, ChildName } from './FileListing'
import { getStoredToken } from '../utils/protectedRouteHandler'
import { trackDownloadCount } from '../utils/DownloadsUtil'
import isHiddenFolder from '../utils/isHiddenFolder'
import { Tooltip } from "@nextui-org/react";

const FileListItem: FC<{ fileContent: OdFolderChildren }> = ({ fileContent: c }) => {
  return (
    <div className="grid cursor-pointer grid-cols-10 items-center space-x-2 px-3 py-2.5">
      <div className="col-span-10 flex items-center space-x-2 truncate md:col-span-6">
        <div className="w-5 flex-shrink-0 text-center">
          <ChildIcon child={c} />
        </div>
        <Tooltip content={c.name} color="primary">
        <ChildName name={c.name} folder={Boolean(c.folder)} />
        </Tooltip>
      </div>
      <div className="col-span-3 hidden flex-shrink-0 font-mono text-sm text-black dark:text-white md:block">
        {formatModifiedDateTime(c.lastModifiedDateTime)}
      </div>
      <div className="col-span-1 hidden flex-shrink-0 truncate font-mono text-sm text-black dark:text-white md:block">
        {humanFileSize(c.size)}
      </div>
    </div>
  )
}

const FolderListLayout = ({
  path,
  folderChildren,
  toast,
}) => {
  const clipboard = useClipboard()
  const hashedToken = getStoredToken(path)

  const { t } = useTranslation()

  // Get item path from item name
  const getItemPath = (name: string) => {
    return `${path === '/' ? '' : path}/${name.replaceAll(' ', '-')}`;
  }

  return (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 dark:text-gray-100">
      <div className="grid grid-cols-11 items-center space-x-2 px-3">
        <div className="col-span-12 py-2 text-xs font-bold uppercase tracking-widest text-black dark:text-white md:col-span-6">
          {t('Name')}
        </div>
        <div className="col-span-3 hidden text-xs font-bold uppercase tracking-widest text-black dark:text-white md:block">
          {t('Upload Date')}
        </div>
        <div className="hidden text-xs font-bold uppercase tracking-widest text-black dark:text-white md:block">
          {t('Size')}
        </div>
        <div className="hidden text-xs text-center font-bold uppercase tracking-widest text-black dark:text-white md:block">
          {t('Action')}
        </div>
      </div>

      {folderChildren.map((c: OdFolderChildren) => (
        <div
          className={`border-t dark:border-gray-700 grid grid-cols-11 transition-all duration-100 hover:bg-gray-100 dark:hover:bg-gray-850 ${isHiddenFolder(c) ? "hidden" : ""}`}
          key={c.id}
        >
          <Link href={getItemPath(c.name)} passHref>
            <a className="col-span-12 md:col-span-10">
              <FileListItem fileContent={c} />
            </a>
          </Link>

          {c.folder ? (
            <div className="hidden p-1.5 text-gray-700 dark:text-gray-400 md:flex">
              <Tooltip content={t('Copy Folder Link')} color="primary">
              <span
                className="cursor-pointer rounded-lg px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  clipboard.copy(`${getBaseUrl()}${getItemPath(c.name)}`)
                  toast(t('Copied folder link.'), { icon: '👌' })
                }}
              >
                <FontAwesomeIcon icon={['far', 'copy']} />
              </span>
              </Tooltip>
            </div>
          ) : (
            <div className="hidden p-1.5 text-gray-700 dark:text-gray-400 md:flex">
              <Tooltip content={t('Copy File Link')} color="primary">
              <span
                className="cursor-pointer rounded-lg px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  clipboard.copy(
                    `${getBaseUrl()}${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`
                  )
                  toast.success(t('Copied file link.'))
                }}
              >
                <FontAwesomeIcon icon={['far', 'copy']} />
              </span>
              </Tooltip>
              <Tooltip content={t('View File')} color="primary">
              <a
                className="cursor-pointer rounded-lg px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                href={`${getItemPath(c.name)}${hashedToken ? `&odpt=${hashedToken}` : ''}`}
                onClick={() => trackDownloadCount(c.id, c.name)}
              >
                <FontAwesomeIcon icon="external-link-alt" />
              </a>
              </Tooltip>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default FolderListLayout