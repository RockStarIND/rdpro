import axios from "axios";
import apiConfig from "../config/api.config";

export function FaunaClient(){
  async function runQuery<T>(query: string): Promise<T|null>{
    return axios.post(apiConfig.graphQLEndpoint, {
      query 
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FAUNA_ADMIN_KEY}`
      },
    }).then(response => {

      const { data } = response.data;

      if(data.downloadsByFileId) {
        return data.downloadsByFileId as T;
      }

      if(data.createOneDriveFile) {
        return data.createOneDriveFile as T;
      }

      if(data.partialUpdateOneDriveFile){
        return data.partialUpdateOneDriveFile as T;
      }

      if(data.downloads){
        return {
          entries: data.downloads.data,
          after: data.downloads.after
        } as T;
      }

      if(data.totalDownloads){
        return data.totalDownloads.data as T
      }

      if(data.createTotalDownloads){
        return data.createTotalDownloads as T
      }

      if(data.updateTotalDownloads){
        return data.totalDownloads as T
      }      

      return null

    }).catch(err => {
      console.log(err);
      return null;
    })
  }
  return {
    runQuery
  }
}