import Link from 'next/link'
import { Checkbox } from './FileListing'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useClipboard } from 'use-clipboard-copy'
import { getBaseUrl } from '../utils/getBaseUrl'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import { OdFolderChildren } from '../types'
import { getStoredToken } from '../utils/protectedRouteHandler'
import GridItem from './GridItem'
import isHiddenFolder from '../utils/isHiddenFolder'
import { Tooltip } from "@nextui-org/react";



const FolderGridBox = (
  { child, path, selected, toggleItemSelected }:
    {
      child: OdFolderChildren, path: string,
      selected: any, toggleItemSelected: Function
    }) => {
  const clipboard = useClipboard()
  const { t } = useTranslation()
  const hashedToken = getStoredToken(path)
  const getItemPath = (name: string) => {
    return `${path === '/' ? '' : path}/${name.replaceAll(' ', '-')}`;
  }

  return (
    <div className={`group relative overflow-hidden rounded-lg transition-all duration-100 ${isHiddenFolder(child) ? "hidden" : ""}`}>
      <div className="absolute top-0 right-0 z-10 m-1 rounded-lg py-0.5 bg-white dark:bg-slate-900 opacity-0 transition-all duration-100 group-hover:opacity-100">
        {child.folder ? (
          <Tooltip content={t('Copy Folder Link')} color="primary">
          <div>
            <span
              className="cursor-pointer rounded-lg px-1.5 py-1"
              onClick={() => {
                clipboard.copy(`${getBaseUrl()}${getItemPath(child.name)}`)
                toast(t('Copied folder link.'), { icon: '👌' })
              }}
            >
              <FontAwesomeIcon icon={['far', 'copy']} />
            </span>
          </div>
          </Tooltip>
        ) : (
          <div>
            <Tooltip content={t('Copy File Link')} color="primary">
            <span
              title={t('Copy File Link')}
              className="cursor-pointer rounded-lg px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => {
                clipboard.copy(
                  `${getBaseUrl()}/api/raw/?path=${getItemPath(child.name)}${hashedToken ? `&odpt=${hashedToken}` : ''
                  }`
                )
                toast.success(t('Copied file link.'))
              }}
            >
              <FontAwesomeIcon icon={['far', 'copy']} />
            </span>
            </Tooltip>
            <a
              title={t('Download file')}
              className="cursor-pointer rounded-lg px-1.5 py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
              href={`${getBaseUrl()}/api/raw/?path=${getItemPath(child.name)}${hashedToken ? `&odpt=${hashedToken}` : ''
                }`}
            >
              <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
            </a>
          </div>
        )}
      </div>

      <div
        className={`${selected[child.id] ? 'opacity-100' : 'opacity-0'
          } absolute top-0 left-0 z-10 m-1 rounded-lg bg-white/50 py-0.5 group-hover:opacity-100 dark:bg-slate-900/50`}
      >
        {!child.folder && !(child.name === '.password') && (
          <Checkbox
            checked={selected[child.id] ? 2 : 0}
            onChange={() => toggleItemSelected(child.id)}
            title={t('Select file')}
          />
        )}
      </div>
      <Link href={getItemPath(child.name)} passHref>
        <a>
          <GridItem c={child} path={getItemPath(child.name)} />
        </a>
      </Link>
    </div>)
}

export default FolderGridBox;