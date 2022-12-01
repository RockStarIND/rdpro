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
  return (
    <Link href={driveItemPath} passHref>
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
  sendUrlFileHandler,
  inputUrlRef
}: {
  searchOpen: boolean
  setSearchOpen: Dispatch<SetStateAction<boolean>>
  sendUrlFileHandler: any,
  inputUrlRef: any
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
            <Dialog.Overlay className="fixed inset-0 bg-white/80 dark:bg-slate-900/80" />
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
            <div className="mt-60 inline-block w-full max-w-3xl transform overflow-hidden  text-left transition-all">
              <Dialog.Title
                as="h3"
                className="flex items-center space-x-4  rounded-lg border dark:border-gray-700 bg-white p-4 dark:bg-slate-900 dark:text-white"
              >
                <i className="ri-link ri-lg"></i>
                <input
                  type="text"
                  id="search-box"
                  className="w-full bg-transparent focus:outline-none focus-visible:outline-none"
                  placeholder="Paste URL Here..."
                  value={query}
                  ref={inputUrlRef}
                  onChange={e => setQuery(e.target.value)}
                />
                <i className="ri-close-circle-line ri-lg" onClick={closeSearchBox}></i>
                {/*this icon will clear text*/} 
              </Dialog.Title>
              <div className='flex space-x-2 py-4 justify-center item-center'>
                        <button onClick={closeSearchBox}  className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</button>
                        <button onClick={sendUrlFileHandler} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Upload</button>
              </div> 
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}