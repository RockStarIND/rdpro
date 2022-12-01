const isHiddenFolder = (driveItem:any) => {
    const pattern = process.env.HIDDEN_FOLDERS_RGX as string;
    const rgx = new RegExp(pattern, "i");
    if(driveItem.file && /(icon.png|readme.md)/i.test(driveItem.name)){
      return true;
    }
    return !driveItem.file && rgx.test(driveItem.name);
  }
  
  export default isHiddenFolder