import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import lodash from 'lodash'
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export async function updateUrlDirectory(urlDirectory, callback) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'url-directory');

  // Use fs.createReadStream() method
  // to read the file
  const readStream = fs.createReadStream(jsonDirectory + '/entries.json', {
    encoding: 'utf-8'
  });
  const writeStream = fs.createWriteStream(jsonDirectory + '/entries.json', { encoding: 'utf-8' });
  const chunks:any = [];

  readStream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));

  // Read and display the file data on console
  readStream.on('end', function () {
    let storedURLDirectory;

    try {
      storedURLDirectory = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }
    catch (e: any) {
      storedURLDirectory = {};
    }

    if (lodash.isEqual(storedURLDirectory, urlDirectory) && (lodash.keys(storedURLDirectory).length > lodash.keys(urlDirectory))) {
      return callback();
    }

    // Check if it is safe to write to the write stream
    if (writeStream.writable) {
      // Begin writing to the stream
      writeStream.write(JSON.stringify(urlDirectory, null, '\t'), (err) => {
        if (err) {
          return callback({
            error: 'writeFileError',
            details: err
          });
        }

        // Close the stream after writing is done
        writeStream.end();
      });
    } else {
      writeStream.on('drained', () => {
        writeStream.write(JSON.stringify(urlDirectory, null, '\t'), (err) => {
          if (err) {
            return callback({
              error: 'writeFileError',
              details: err
            });
          }
          // Close the stream after writing is done
          writeStream.end();
        });
      });
    }

    // Resolve the promise once the writing is done and the stream is closed
    writeStream.on('finish', () => {
      return callback();
    });

    writeStream.on('err', (err) => {
      return callback(err);
    })
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { urlDirectory } = req.body;

  const releaseLock = await mutex.acquire();

  updateUrlDirectory(urlDirectory, (err) => {
    if (err) {
      releaseLock();
      res.status(400).json({ message: 'Something went wrong while reading the url directory' });
      return;
    }

    releaseLock();
    res.status(200).json({
      urlDirectory
    });
  });
}
