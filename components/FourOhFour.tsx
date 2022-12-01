import { Trans } from 'next-i18next'
import LottiePlayer from '../components/LottiePlayer'
import siteConfig  from '../config/site.config'

const FourOhFour: React.FC<{ errorMsg: string }> = ({ errorMsg }) => {
  return (
    <div className="my-12">
      <div className="mx-auto">
        <LottiePlayer src="https://assets8.lottiefiles.com/packages/lf20_9e8yoqkm.json" style={{height: "400px"}}/>
      </div>
      <div className="mx-auto mt-6 max-w-xl text-black dark:text-white">
        <div className="mb-8 text-center text-xl font-bold">
          <Trans>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Wait we are working on it.
          </Trans>
        </div>
        <div className="mb-4 overflow-hidden break-all rounded-lg border dark:border-gray-700 bg-gray-50 p-2 font-mono text-xs dark:bg-slate-900">
          {errorMsg}
        </div>
        <div className="text-sm">
          <Trans>
            Press{' '}
            <kbd className="rounded-lg border border-gray-400/20 bg-gray-100 px-1 font-mono text-xs dark:bg-slate-900">
              F12
            </kbd>{' '}
            and open devtools for more details, or seek help at{' '}
            <a
              className="text-blue-600 hover:text-blue-700 hover:underline"
              href="https://t.me/RockStarIND"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.title} Team
            </a>
            .
          </Trans>
        </div>
      </div>
    </div>
  )
}

export default FourOhFour
