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

                    await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/Today Upload/${el.name}:/content`, fileAsBuffer , config)
                    
                    toast.remove(loadingToaster);
                    successToast()
                    setFile(null)
                }
                catch (e: any) {
                    toast.remove(loadingToaster);
                    errorToast(e.response.data.message)
                }
            })
            
        
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


    return (
        <>
                            <div className='flex flex-col items-center gap-3 '>
                                Files Details
                                <>
                                    {getFile.map((el: File, i: number, arr) => {
                                        return (
                                            <div className='flex flex-col items-center border dark:border-gray-700 rounded px-3 py-2' key={i}>
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