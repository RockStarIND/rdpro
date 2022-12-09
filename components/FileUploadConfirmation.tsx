import axios from "axios";
import { StateUpdateCallback } from "swr/dist/types";
import toast from 'react-hot-toast';

export const FileUploadConfirmation = ({getFile, setFile, token}: {getFile: File[], setFile: StateUpdateCallback, token: string}) => {
    const cancelUploadHandler = () => {
        setFile(null);
    }
    
    const successToast = () => toast.success('Your file(s) was successfully uploaded');
    const errorToast = (err?: string) => toast.error(err || 'something went wrong!');

    const sendHandler = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'text/plain'
        };
            const loadingToaster = toast.loading('Loading...');
            getFile?.map(async (el: File) => {
                
                try {
                    let fileAsBinary = await fileReaderFunc(el);
                    let fileAsBuffer = Buffer.from(fileAsBinary, 'binary')
                    if (el.size > 4000000) {
                        let fileSize = el.size;
                        const body = {
                            item: {
                                description: "a large file",
                                name: el.name
                            }
                        }
                        const { uploadUrl } = (await axios.post(`https://graph.microsoft.com/v1.0/me/drive/root:/Today Upload/${el.name}:/createUploadSession`, body, config)).data

                        let offset = 0;

                        while (offset < fileSize) {
                            let chunkSize = Math.min(fileSize - offset, 4 * 1024 * 1024);
                            await uploadChunk(uploadUrl, el, offset, chunkSize, fileSize);
                            toast.loading(`${Math.floor((offset/fileSize) * 100)}% completed`, {
                                id: loadingToaster
                            });
                            offset += chunkSize;
                        }
                        toast.remove(loadingToaster);
                        successToast()
                        setFile(null)
                    } else {
                        await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/Today Upload/${el.name}:/content`, fileAsBuffer , config)
                        
                        toast.remove(loadingToaster);
                        successToast()
                        setFile(null)
                    }
                }
                catch (e: any) {
                    console.log(e)
                    toast.remove(loadingToaster);
                    errorToast(e.response?.data?.message)
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
            "Content-Length": chunkSize,
            "Content-Range": "bytes " + offset + "-" + (offset + chunkSize - 1) + "/" + fileSize
          },
        });
      
        return response;
    }

    const fileReaderFunc = (file: File): Promise<any> => {
        return new Promise((resolve,reject) => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                const file = fileReader.result;
                resolve(file)
            }
            fileReader.readAsBinaryString(file)
        })
    }

    const fileReadForLargeFiles = (file: File, offset, chunk) => {
        return new Promise((resolve, reject) => {
            const filereader = new FileReader();

            filereader.onload = () => {
                resolve(filereader.result)
            }
            var slice = file.slice(offset, offset + chunk);
            filereader.readAsArrayBuffer(slice);
        })
    }


    return (
        <>
            <div className='flex flex-col items-center px-3 gap-3 text-black'>
                                <span className="text-black dark:text-white">Files Details</span>
                <>
                    {getFile.map((el: File, i: number, arr) => {
                        return (
                            <div className='flex flex-col items-center border dark:border-gray-700 rounded-xl px-3 py-2  bg-white' key={i}>
                                <div className=''>
                                File Name: {el.name}
                                </div>
                                <div className=''>
                                File Type: {el.type}
                                </div>
                            </div>
                        )
                        
                    })}
                </>
                
                <div className='flex justify-around gap-5'>
                    <button onClick={cancelUploadHandler} className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</button>
                    <button onClick={sendHandler} className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Upload</button>
                </div>
            </div>
        </>
    )
}