import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

import { encodePath } from '.'
import apiConfig from '../../config/api.config'
import siteConfig from '../../config/site.config'
import { readOdConcealedAccessTokens } from '../../utils/odAuthTokenStore'

/**
 * Sanitize the search query
 *
 * @param query User search query, which may contain special characters
 * @returns Sanitised query string, which:
 * - encodes the '<' and '>' characters,
 * - replaces '?' and '/' characters with ' ',
 * - replaces ''' with ''''
 * Reference: https://stackoverflow.com/questions/41491222/single-quote-escaping-in-microsoft-graph.
 */
function sanitiseQuery(query: string): string {
  const sanitisedQuery = query
    .replace(/'/g, "''")
    .replace('<', ' &lt; ')
    .replace('>', ' &gt; ')
    .replace('?', ' ')
    .replace('/', ' ')
  return encodeURIComponent(sanitisedQuery)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get access token from header
  const accessTokens = readOdConcealedAccessTokens(req.headers['x-connected-accounts'] as string);

  // Query parameter from request
  const { q: searchQuery = '' } = req.query

  // Set edge function caching for faster load times, check docs:
  // https://vercel.com/docs/concepts/functions/edge-caching
  res.setHeader('Cache-Control', apiConfig.cacheControlHeader)

  if (typeof searchQuery === 'string') {
    // Construct Microsoft Graph Search API URL, and perform search only under the base directory
    const searchRootPath = encodePath('/')
    const encodedPath = searchRootPath === '' ? searchRootPath : searchRootPath + ':'

    const searchApi = `${apiConfig.driveApi}/root${encodedPath}/search(q='${sanitiseQuery(searchQuery)}')`

    const searchResults = await Promise.all(accessTokens.map((accessToken, tokenId) => {
      return axios.get(searchApi, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          select: 'id,name,file,folder,parentReference',
          top: siteConfig.maxItems,
        },
      }).then(results => {
        return results.data.value && results.data.value.length ? 
               results.data.value.map(v => ({ ...v, tokenId })) :
               [];
      }).catch(err => {
        // this is an expected error. we only catch it
        // to prevent polluting the error logs, but we do 
        // not handle it or report it (and that is by design, intentionally).

        // we expect failure because this code searches
        // across multiple accounts. (the file won't exist 
        // in every account)
        return null
      })
    })).then(responses => {
      return responses.reduce((arr, response) => {
        return arr.concat(response);
      }, []);
    })
    res.status(200).json(searchResults)
  } else {
    res.status(200).json([])
  }
}
