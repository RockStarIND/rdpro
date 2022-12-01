import type { NextApiRequest, NextApiResponse } from 'next'
import { DownloadsUtil } from '../../../utils/DownloadsUtil'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { compute } = req.query;
  const downloads = DownloadsUtil();
  const total = compute ? 
        { value: await downloads.computeTotalDownloads() } : 
        await downloads.getTotalDownloads();
  res.json(total?.value);
}