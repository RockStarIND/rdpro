import axios from 'axios'
import useSWR, { SWRResponse } from 'swr'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { useAsync } from 'react-async-hook'
import useConstant from 'use-constant'
import { useTranslation } from 'next-i18next'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'

import type { OdDriveItem, OdSearchResult } from '../types'

import { getFileIcon } from '../utils/getFileIcon'
import { fetcher } from '../utils/fetchWithSWR'
import siteConfig from '../config/site.config'
import { getConnectedAccounts } from '../utils/getConnectedAccounts'
import isHiddenFolder from '../utils/isHiddenFolder'
import LottiePlayer from './LottiePlayer'
import ItemPathStore from '../stores/ItemPathStore'
import lodash from 'lodash';

/**
 * Extract the searched item's path in field 'parentReference' and convert it to the
 * absolute path represented in RDRIVE
 *
 * @param path Path returned from the parentReference field of the driveItem
 * @returns The absolute path of the driveItem in the search result
 */
function mapAbsolutePath(path: string): string {
  // path is in the format of '/drive/root:/path/to/file', if baseDirectory is '/' then we split on 'root:',
  // otherwise we split on the user defined 'baseDirectory'
  const absolutePath = path.split(siteConfig.baseDirectory === '/' ? 'root:' : siteConfig.baseDirectory)
  // path returned by the API may contain #, by doing a decodeURIComponent and then encodeURIComponent we can
  // replace URL sensitive characters such as the # with %23
  return absolutePath.length > 1 // solve https://github.com/spencerwooo/RDRIVE/issues/539
    ? absolutePath[1]
        .split('/')
        .map(p => encodeURIComponent(decodeURIComponent(p)))
        .join('/')
    : ''
}

/**
 * Implements a debounced search function that returns a promise that resolves to an array of
 * search results.
 *
 * @returns A react hook for a debounced async search of the drive
 */
function useDriveItemSearch() {
  const [query, setQuery] = useState('')
  const searchDriveItem = async (q: string) => {
    const { data } = await axios.get<OdSearchResult>(`/api/search/?q=${q}`, {
      headers: {
        'x-connected-accounts': getConnectedAccounts()
      }
    })

    // Map parentReference to the absolute path of the search result
    data.map(item => {
      item['path'] =
        'path' in item.parentReference
          ? // OneDrive International have the path returned in the parentReference field
            `${mapAbsolutePath(item.parentReference.path)}/${encodeURIComponent(item.name)}`
          : // OneDrive for Business/Education does not, so we need extra steps here
            ''
    })

    return data
  }

  const debouncedDriveItemSearch = useConstant(() => AwesomeDebouncePromise(searchDriveItem, 1000))
  const results = useAsync(async () => {
    if (query.length === 0) {
      return []
    } else {
      return debouncedDriveItemSearch(query)
    }
  }, [query])

  return {
    query,
    setQuery,
    results,
  }
}

function SearchResultItemTemplate({
  driveItem,
  driveItemPath,
  itemDescription,
  disabled,
}: {
  driveItem: OdSearchResult[number]
  driveItemPath: string
  itemDescription: string
  disabled: boolean
}) {
  if (lodash.startsWith(driveItemPath, '/')) {
    driveItemPath = driveItemPath.substring(1);
  }

  const formattedPath = driveItemPath.replaceAll('%20', '-');
  const formattedPathArray = formattedPath.split('/');
  ItemPathStore.setMapping([...driveItemPath.split('/')], [...formattedPathArray])
  return (
    <Link href={formattedPath} passHref>
      <a
        className={`flex items-center space-x-4 border-b border-gray-400/30 px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-850 ${
          disabled ? 'pointer-events-none cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <FontAwesomeIcon icon={driveItem.file ? getFileIcon(driveItem.name) : ['far', 'folder']} />
        <div>
          <div className="text-sm font-medium leading-8">{driveItem.name}</div>
          <div
            className={`overflow-hidden truncate font-mono text-xs opacity-60 ${
              itemDescription === 'Loading ...' && 'animate-pulse'
            }`}
          >
            {itemDescription}
          </div>
        </div>
      </a>
    </Link>
  )
}

function SearchResultItemLoadRemote({ result }: { result: OdSearchResult[number] }) {
  const { data, error }: SWRResponse<OdDriveItem, { status: number; message: any }> = useSWR(
    `/api/item/?id=${result.id}&tokenId=${result.tokenId}`,
    fetcher
  )
  
  const { t } = useTranslation()

  if (error) {
    return (
      <SearchResultItemTemplate
        driveItem={result}
        driveItemPath={''}
        itemDescription={typeof error.message?.error === 'string' ? error.message.error : JSON.stringify(error.message)}
        disabled={true}
      />
    )
  }
  if (!data) {
    return (
      <SearchResultItemTemplate
        driveItem={result}
        driveItemPath={''}
        itemDescription={t('Loading ...')}
        disabled={true}
      />
    )
  }

  const driveItemPath = `${mapAbsolutePath(data.parentReference.path)}/${encodeURIComponent(data.name)}`
  return (
    <SearchResultItemTemplate
      driveItem={result}
      driveItemPath={driveItemPath}
      itemDescription={decodeURIComponent(driveItemPath)}
      disabled={false}
    />
  )
}

function SearchResultItem({ result }: { result: OdSearchResult[number] }) {
  if (result.path === '') {
    // path is empty, which means we need to fetch the parentReference to get the path
    return <SearchResultItemLoadRemote result={result} />
  } else {
    // path is not an empty string in the search result, such that we can directly render the component as is
    const driveItemPath = decodeURIComponent(result.path)
    return (
      <SearchResultItemTemplate
        driveItem={result}
        driveItemPath={result.path}
        itemDescription={driveItemPath}
        disabled={false}
      />
    )
  }
}

export default function SearchModal({
  searchOpen,
  setSearchOpen,
}: {
  searchOpen: boolean
  setSearchOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { query, setQuery, results } = useDriveItemSearch()

  const { t } = useTranslation()

  const closeSearchBox = () => {
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <Transition appear show={searchOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[200] overflow-y-auto" onClose={closeSearchBox}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-white/90 dark:bg-slate-900/80" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-20 inline-block w-full max-w-3xl transform overflow-hidden rounded-lg border dark:border-gray-700 text-left shadow-2xl transition-all">
              <Dialog.Title
                as="h3"
                className="flex items-center space-x-4 border-b border-gray-400/30 bg-white p-4 dark:bg-slate-900 dark:text-white"
              >
                <FontAwesomeIcon icon="search" className="h-4 w-4" />
                <input
                  type="text"
                  id="search-box"
                  className="w-full bg-transparent focus:outline-none focus-visible:outline-none"
                  placeholder={t('Search ...')}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <div className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-medium dark:bg-gray-700" onClick={closeSearchBox}>ESC</div>
              </Dialog.Title>
              <div
                className="max-h-[80vh] overflow-x-hidden bg-white dark:bg-slate-900 dark:text-white"
                
              >
                {results.loading && (
                  <div className="px-4 py-12 text-center text-sm font-medium">
                    <LottiePlayer src="https://assets4.lottiefiles.com/private_files/lf30_jo7huq2d.json" style={{height: "200px"}}/>       
                  </div>
                )}
                {results.error && (
                  <div className="px-4 py-12 text-center text-sm font-medium">
                    {t('Error: {{message}}', { message: results.error.message })}
                  </div>
                )}
                {results.result && (
                  <>
                    {results.result.length === 0 ? (
                      <div className="px-4 py-12 text-center text-sm font-medium">
                        <LottiePlayer src="https://assets10.lottiefiles.com/packages/lf20_hAvF1pS1pb.json" style={{height: "200px"}}/>                        
                      </div>
                    ) : (
                      results.result.filter(result => !isHiddenFolder(result))
                                    .map(result => <SearchResultItem key={result.id} result={result} />)
                    )}
                  </>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}