import lodash from 'lodash'
import axios from 'axios';

class ItemPathStore {
  mappings = {}
  instance: any

  constructor () {
    const hiddenFolders = (process.env.HIDDEN_FOLDERS_RGX || '').split('|')

     for (let i of hiddenFolders) {
       const formattedPath = i.replaceAll(' ', '-')
       this.mappings[formattedPath] = i;
     }
  }

  async loadURLDirectory () {
    try {
      const { data } = await axios.get('/api/url-directory/init');
      const { urlDirectory } = data;
      this.mappings = urlDirectory;
    }
    catch (e) {}
  }

  setMapping (oldPath, value) {
    if (oldPath.length > 1) {
      let parentPath = oldPath.slice(0, -1).join('/');

      if (this.mappings[parentPath]) {
        this.mappings[value.join('/')] = decodeURIComponent(this.mappings[parentPath] + '/' + oldPath[oldPath.length - 1]);
      }
      else {
        this.mappings[value.join('/')] = decodeURIComponent(oldPath.join('/'));
      }
    }
    else {
      this.mappings[value.join('/')] = decodeURIComponent(oldPath.join('/'));
    }
  }

  getMapping (path) {
    if (path === '/') {
      return '/';
    }

    let formattedPath: string;

    if (lodash.startsWith(path, '/')) {
      formattedPath = decodeURIComponent(path.substring(1));
    }
    else {
      formattedPath = decodeURIComponent(path);
    }
    return lodash.get(this.mappings, formattedPath);
  }
}

export default new ItemPathStore();