import axios from 'axios'
import File from 'file'
import type { NextApiRequest, NextApiResponse } from 'next'

import apiConfig from '../../../config/api.config'
import { getAccessToken } from '../../../utils/odAuthTokenStore';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get access token from header

  const accessToken = await getAccessToken(0)

  // Set edge function caching for faster load times, check docs:
  // https://vercel.com/docs/concepts/functions/edge-caching
  res.setHeader('Cache-Control', apiConfig.cacheControlHeader)

    try {
        const {url} = req.query

        let filename = (url as string).substring((url as string).lastIndexOf('/')+1);
        let queryRegExp = /[?=&]/g;
        let filenameFilter = filename.replaceAll(queryRegExp,'');

        const response = await fetch((url as RequestInfo))
        const blob = await response.blob() as any
        const array = await blob.arrayBuffer()

        sendHandler(res, [array], accessToken, filenameFilter)

    } catch (error: any) {
        res.status(error?.response?.status ?? 500).json({ error: error?.response?.data ?? 'Internal server error.' })
    }

  return
}

const sendHandler = async (res, file, token, filename) => {
    res.socket.server.io.emit('uploading', filename)
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'text/plain'
    };
        file?.map(async (el: File) => {

            try {
                if (el.byteLength > 4000000) {
                    let fileSize = el.byteLength;
                    const body = {
                        item: {
                            "@microsoft.graph.conflictBehavior": "rename",
                        }
                    }

                    const { uploadUrl } = (await axios.post(`https://graph.microsoft.com/v1.0/me/drive/root:/Today Upload/${filename}:/createUploadSession`, body, config)).data

                    let offset = 0;

                    while (offset < fileSize) {
                        let chunkSize = Math.min(fileSize - offset, 4 * 1024 * 1024);
                        await uploadChunk(uploadUrl, el, offset, chunkSize, fileSize);

                        res.socket.server.io.emit('loading', `${Math.floor(((offset + chunkSize)/fileSize) * 100)}% completed`)

                        console.log(`${Math.floor(((offset + chunkSize)/fileSize) * 100)}% completed`)
                        offset += chunkSize;
                    }
                    res.status(200).json({ok: true})
                } else {
                    const response = await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/Today Upload/${filename}:/content`, el , config)

                    res.status(200).json({ok: true})
                }
            }
            catch (e: any) {
                res.status(e?.response?.status ?? 500).json({ error: e?.response?.data ?? 'Internal server error.' })
            }
        })


}

async function uploadChunk(uploadUrl, fileData, offset, chunkSize, fileSize) {
    let resultOfChunk = await fileReadForLargeFiles(fileData, offset, chunkSize)

    var response = await axios.put(uploadUrl,
      resultOfChunk,
    {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Range": "bytes " + offset + "-" + (offset + chunkSize - 1) + "/" + fileSize
      },
    });

    return response;

}

const fileReadForLargeFiles = (file: File, offset, chunk) => {
        var slice = file.slice(offset, offset + chunk);
        return slice
}
