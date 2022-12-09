import { useState, useRef } from 'react';

import { FileUploadConfirmation } from './FileUploadConfirmation';
import LottiePlayer from './LottiePlayer'
import axios from 'axios';
import { checkUrlValidity } from '../utils/checkValidations';
import toast from 'react-hot-toast';
import UrlModal from './UrlModal'
import Image from 'next/image';

const FileUpload =({token}: {token: string}) => {
    const [searchOpen, setSearchOpen] = useState(false)
    const openSearchBox = () => setSearchOpen(true)
    const [getFile,  setFile] = useState<Array<File> | null>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputUrlRef = useRef<HTMLInputElement>(null);
    const [isPopUpOpened, setToOpen] = useState<boolean>(false)
    const successToast = () => toast.success('Your file(s) was successfully uploaded');
    const errorToast = (err?: string) => toast.error(err || 'something went wrong!');

    const clickOnTheInputFile = () => {
        return inputFileRef.current?.click();
    };

    const fileInputHandler = async (e: React.SyntheticEvent<EventTarget>) => {
        const files: File[] = Array.from((e.target as HTMLFormElement).files);
        setFile(files)
    }

    const dragOver = (e: React.SyntheticEvent<EventTarget>) => {
        (e.target as HTMLFormElement).draggable = true;
        e.preventDefault()
    };

    const sendUrlFileHandler = async () => {
        setSearchOpen(false)
        let url = (inputUrlRef.current as HTMLInputElement).value;
        if (!url.trim()) {
            return errorToast('Empty value!')
        }
        if (!checkUrlValidity(url)) {
            return errorToast('Invalid url passed!');
        }
        const loadingToaster = toast.loading('Loading...');
        try {

            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    Prefer: 'respond-async'
                },
            };

            let filename = url.substring(url.lastIndexOf('/')+1);
            let queryRegExp = /[?=&]/g;
            let folder_id = '01ARCFE57XOYBRCRUBEJG3HGZUAHKDF5QP';
            let filenameFilter = filename.replaceAll(queryRegExp,'');
            let body = {
                "@microsoft.graph.sourceUrl": url,
                "name": filenameFilter,
                "file": { }
            };
                let result = await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${folder_id}/children`, body , config);
                if (result.status === 202) {
                    toast.remove(loadingToaster);
                    let monitorUrl: string;
                    if (result.headers.location) {
                        let changeableResult: any;
                        let loadingProgress: any;

                    monitorUrl = result.headers.location;
                    changeableResult = await axios.get(monitorUrl);
                    loadingProgress = toast.loading(`uploading processing,please wait`);

                    const interval = setInterval(async () => {
                        if (changeableResult.status === 202) {
                            if (changeableResult.data.status === "notStarted") {
                                toast.loading('uploading processing,please wait', {
                                    id: loadingProgress
                                })
                            } else {
                                toast.loading(`${Math.floor(changeableResult.data.percentageComplete)}% completed`, {
                                    id: loadingProgress
                                });
                            }
                            if (changeableResult.status === 200) {
                                toast.remove(loadingProgress)
                                toast.remove(loadingToaster)  
                                successToast();
                                clearInterval(interval)
                            }
                        }
                        }, 2000)
                    }
            }
            if (result.status === 201) {
                toast.remove(loadingToaster)  
                successToast();
            }
            setToOpen(false);

        } catch (e: any) {
            toast.remove(loadingToaster);
            errorToast(e.message)
        }
    }
    
    const dragLeaveHandler = (e: React.SyntheticEvent<EventTarget>) => {
        (e.target as HTMLFormElement).draggable = false;
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        let arr: File[] = [];
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items as any].forEach((item, i) => {
              if (item.kind === 'file') {
                const file = item.getAsFile();
                arr.push(file);
              }
            });
          } else {
            [...e.dataTransfer.files as any].forEach((file, i) => {
              arr.push(file);
            });
          }
        setFile(arr);  
    }

    return (
        <div>
            {/*<div className='items-end justify-items-end' onClick={openSearchBox}>
            <UrlModal searchOpen={searchOpen} setSearchOpen={setSearchOpen} sendUrlFileHandler={sendUrlFileHandler} inputUrlRef={inputUrlRef} />
            <Image src="/link.png" alt="Link" width="40" height="40" priority />
            </div>*/}
            <div  onClick={clickOnTheInputFile} className="flex flex-col items-center justify-center w-full h-full py-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" onDrop={dropHandler}  onDragOver={dragOver} onDragLeave={dragLeaveHandler}>
                
                {getFile?.length ? 
                    <FileUploadConfirmation  getFile={getFile} setFile={setFile} token={token} /> 
                    :
                    <div className="space-y-1 text-center">
                        <div className="flex flex-col items-center justify-center pb-6">
                            <LottiePlayer src="https://assets1.lottiefiles.com/private_files/lf30_a5ghwfwe.json" style={{ height: "200px" }} />
                            <p className="mb-2 text-sm text-gray-500 dark:text-white"><span className="font-semibold dark:text-white">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-white">Do not upload file with Password</p>
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#00DDB3] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#03a586] focus-within:ring-offset-2 hover:text-[#03a586]">
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={fileInputHandler} ref={inputFileRef} />
                            </label>
                        </div>
                    </div>
                }
                
            </div>
        </div>
        )
    }
    
    export default FileUpload;