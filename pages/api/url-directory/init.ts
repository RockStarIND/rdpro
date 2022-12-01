import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { updateUrlDirectory } from './update';

async function readUrlDirectoryFromDisk (callback) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'url-directory');
  //Read the json data file data.json
  fs.readFile(jsonDirectory + '/entries.json', 'utf-8', callback);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  readUrlDirectoryFromDisk((err, result) => {
    if (err) {
      updateUrlDirectory({'hello': 'world'}, (err) => {
        if (err) {
          res.status(400).json({message: 'Something went wrong while reading the url directory'});
        }
      });
    }

    let directoryJSON;

    try {
      directoryJSON = JSON.parse(result);
    }
    catch (e: any) {
      directoryJSON = {};
    }

    res.status(200).json({
      urlDirectory: directoryJSON
    });
  });
}
