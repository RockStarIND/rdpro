import type { ParsedUrlQuery } from 'querystring'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'next-i18next'

const HomeCrumb = () => {
  const { t } = useTranslation()

  return (
    <Link href="/">
      <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        Home
      </a>
    </Link>
  )
}

const Breadcrumb: React.FC<{ query?: ParsedUrlQuery }> = ({ query }) => {
  if (query) {
    const { path } = query
    if (Array.isArray(path)) {
      // We are rendering the path in reverse, so that the browser automatically scrolls to the end of the breadcrumb
      // https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up/18614561
      return (
        <ol className="no-scrollbar inline-flex flex-row-reverse items-center gap-1 overflow-x-scroll text-sm text-gray-600 dark:text-gray-300 ">
          {path
            .slice(0)
            .reverse()
            .map((p: string, i: number) => (
              <li key={i} className="flex flex-shrink-0 items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                <Link
                  href={`/${path
                    .slice(0, path.length - i)
                    .map(p => encodeURIComponent(p))
                    .join('/')}`}
                  passHref
                >
                  <a
                    className={`text-sm transition-all duration-75 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white  ${
                      i == 0 && 'pointer-events-none'
                    }`}
                  >
                    {p.replaceAll('-', ' ')}
                  </a>
                </Link>
              </li>
            ))}

          <li className="flex-shrink-0 transition-all duration-75 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <HomeCrumb />
          </li>
        </ol>
      )
    }
  }

  return (
    <div className="text-sm transition-all duration-75 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
      <HomeCrumb />
    </div>
  )
}

export default Breadcrumb
