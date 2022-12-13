import type { OdFolderChildren } from '../types'
import { useTranslation } from 'next-i18next'
import FolderGridBox from './FolderGridBox'
import Ads from './Ads'
import isHiddenFolder from '../utils/isHiddenFolder'
import React from 'react'

const FolderGridLayout = ({
  path,
  folderChildren,
  selected,
  toggleItemSelected
}) => {

  const { t } = useTranslation()

  // number of folders to show
  // before displaying row with ads
  const groupSize = 6;
  
  // track number of hidden folders
  let hiddenFolders = 0;

  const showFolderOrAds = (c: OdFolderChildren, index: number) => {

    if(isHiddenFolder(c)){
      hiddenFolders++;
    }

    // offset index by 
    // number of hidden folders
    let _index = index - hiddenFolders;

    if(_index >= groupSize && _index % groupSize == 0) {
        return (<React.Fragment key={_index}>
                  <Ads/>
                  <FolderGridBox
                    child={c}
                    selected={selected}
                    path={path}
                    toggleItemSelected={toggleItemSelected}
                    />               
                </React.Fragment>)
    }

    return <FolderGridBox
            key={c.id}
            child={c}
            selected={selected}
            path={path}
            toggleItemSelected={toggleItemSelected}
            />  
  }
  
  return (
    <div className="border dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 dark:text-gray-50 select-none">
      <div className="flex items-center border-b px-3 text-xs font-bold uppercase tracking-widest text-black dark:border-gray-700 dark:text-white">
      <div className="flex-1 p-2"></div>
        <div className="flex p-2">{t('{{count}} item(s)', { count: folderChildren.length })}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-6">
        {folderChildren.map(showFolderOrAds)}
      </div> 
    </div>
  )
}

export default FolderGridLayout