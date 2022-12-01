import axios from "axios";
import { FaunaClient } from "../utils/FaunaClient";
import { getOrigin } from "./getBaseUrl";

interface DownloadEntry {
  _id?: string
  fileName: string
  fileId: string
  downloads: Number
}

interface DownloadEntryPage {
  entries: DownloadEntry[]
  after?: string
}

interface TotalDownloads {
  _id?: string
  value: 0
}

interface NewDownloadEntry {
  _id: string
  fileName: string
  fileId: string
  downloads: Number
}

export function DownloadsUtil() {
  const fauna = FaunaClient();

  /**  get a single download entry by file id */
  function get(fileId: string){
    return fauna.runQuery<DownloadEntry>(`
      query GetDownload {
        downloadsByFileId(fileId: "${fileId}"){
          _id
          fileId
          fileName
          downloads
        }
      }`)
  }

  // get subset of all download entries using a cursor
  // https://docs.fauna.com/fauna/current/learn/tutorials/graphql/pagination
  function getDownloadsPage(cursor: string | null = null){
    const _cursor = cursor ? `"${cursor}"` : "null";
    return fauna.runQuery<DownloadEntryPage>(`
      query GetDownloadsPage {
        downloads(_cursor: ${_cursor}) {
          data {
              _id
              fileId
              fileName
              downloads
          }
          after
        }
    }`)
  }

  /** get total number of downloads as an integer value */
  async function getTotalValue(){
    const totalDownloads = await getTotalDownloads();
    if(totalDownloads){
      return totalDownloads.value;
    }
    return await resolveTotalDownloads()
  }

  /** get cached value for total number of downloads */
  async function getTotalDownloads(): Promise<TotalDownloads | null> {
    const totalDownloads = await fauna.runQuery<TotalDownloads[]>(`
      query GetTotalDownloads {
        totalDownloads {
          data {
            _id
            value
          }
        }
      }`)

    if(totalDownloads && totalDownloads.length > 0){
      if(totalDownloads.length > 1){
        console.error("multiple entries found for total number of downloads");
      }
      return totalDownloads[0]; // there should only be a single record for total downloads
    }

    return null;
  }

  /** update the cached value for total number of downloads */
  async function setTotalDownloads(value: number){
    const totalDownloads = await getTotalDownloads();
    if(!totalDownloads){
      // create new record using input value
      return await fauna.runQuery<TotalDownloads>(`
        mutation AddTotalDownloads {
          createTotalDownloads(data: {
            value: ${value}
          }) {
            _id
            value
          }
        }`)
    }
    // update existing record using input value
    return await fauna.runQuery<TotalDownloads>(`
      mutation UpdateTotalDownloads {
        updateTotalDownloads(
          id: "${totalDownloads._id}", 
          data: {
            value: ${value}
          }){
            _id
            value
        }
      }`)
  }

  /** aggregate total number of downloads and save the computed value */
  async function computeTotalDownloads(): Promise<number> {
    // recursive helper function
    const _recurse = async (cursor: string | null = null, runningTotal = 0) : Promise<number> => {
      let newTotal = 0;
      // get download entries based on the cursor
      let page = await getDownloadsPage(cursor);
      if(page?.entries){
          // sum the download counts and add to running total
          newTotal = page.entries.reduce((sum, entry) => {
            return sum + (entry.downloads as number)
          }, runningTotal)
      }
      if(page?.after){ // total the next group of download entries
        return await _recurse(page.after, newTotal)
      }
      return runningTotal;
    }
    const total = await _recurse()
    await setTotalDownloads(total) // update cached value
    return total;
  }

  /** create a new download entry */ 
  async function create(newFile: DownloadEntry){
    return fauna.runQuery<NewDownloadEntry>(`
      mutation CreateDownload {
        createOneDriveFile(
          data: {
            fileId: "${newFile.fileId}",
            fileName: "${newFile.fileName}",
            downloads: 1
          }
        ) {
          _id
          fileName
          fileId
          downloads
        }
      }`)
  }
  
  /** increment number of downloads for a single entry */
  async function increment(fileId: string){
    return get(fileId).then(entry => {
      if(entry){
        return fauna.runQuery<DownloadEntry>(`
          mutation UpdateDownload {
            partialUpdateOneDriveFile(
              id: ${entry._id}
              data: {
                  downloads: ${Number(entry.downloads) + 1}
              }
            ) {
              fileName
              fileId
              downloads
            }
          }
        `)
      } else {
        return null;
      }
    })
  }

  /** increment total using cached value; recompute if cached value not defined */
  async function incrementTotal(){
    const downloads = DownloadsUtil();

    const totalDownloads = await downloads.getTotalDownloads()

    if(totalDownloads){
      // increment total using the cached value
      return downloads.setTotalDownloads(totalDownloads.value + 1)

      // race conditions may cause the cached value to become stale.
      // to get around this, call ~/api/downloads/total via a scheduled job.
    }
    
    // recompute if the cached value is not defined
    downloads.computeTotalDownloads();
  }

  return {
    
    get, 
    create, 
    increment,
    getTotalValue,
    getTotalDownloads, 
    setTotalDownloads, 
    computeTotalDownloads, 
    incrementTotal, 
  }
}

/** 
 * recomputes the total number of downloads if the total 
 * value is not already cached in the database 
*/
export async function resolveTotalDownloads(){
  const downloads = DownloadsUtil();
  const totalDownloads = await downloads.getTotalDownloads();
  if(totalDownloads){
    return totalDownloads.value;
  }
  const downloadCount = await downloads.computeTotalDownloads();
  return downloadCount
}

/** increments the total number of downloads for a single 
 *  file and then recomputes the total number of downloads
 */
export async function trackDownloadCount(fileId: string, fileName: string){
  const downloads = DownloadsUtil()
  const entry = await downloads.get(fileId);
  if(entry){
    await downloads.increment(entry.fileId)
  } else {
    await downloads.create({
      fileName,
      fileId,
      downloads: 1
    })
  }

  await downloads.incrementTotal();

}