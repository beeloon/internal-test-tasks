const fs = require("fs/promises");
const path = require("path");
const { Readable } = require("stream");
const { createWriteStream } = require("fs");
const { finished } = require("stream/promises");

const isDirectoryExists = async (directory) => {
  try {
    await fs.access(directory);
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === "ENOENT") {
      return false; // Directory does not exist
    } else {
      throw error; // Other error occurred, propagate it
    }
  }
};

const createDirectoryIfNotExists = async (directory) => {
  if (!(await isDirectoryExists(directory))) {
    await fs.mkdir(directory, { recursive: true });
  }
};

const downloadFile = async (url, filePath) => {
  try {
    console.log(" Adding file:", `"${filePath}"`, "ヽ(^ᴗ^ヽ)");

    const fileDirectoryPath = path.dirname(filePath);
    await createDirectoryIfNotExists(fileDirectoryPath);

    const stream = createWriteStream(filePath);
    const { body } = await fetch(url);

    await finished(Readable.fromWeb(body).pipe(stream));
  } catch (err) {
    console.error(error);
  }
};

const isDirectoryEmpty = async (directory) => {
  const files = await fs.readdir(directory);
  return files.length === 0;
};

const deleteFile = async (filePath) => {
  console.log(" Deleting file:", `"${filePath}"`, "( ´･﹏･｀)");
  await fs.rm(filePath);

  const fileDirectoryPath = path.dirname(filePath);
  if (await isDirectoryEmpty(fileDirectoryPath)) {
    await fs.rmdir(fileDirectoryPath);
  }
};

const getLocalFilenames = async (folderPath) => {
  await createDirectoryIfNotExists(folderPath);
  
  const filenames = [];

  const traverseDirectory = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await traverseDirectory(entryPath); // Recursive call for subdirectories
      } else {
        filenames.push(path.relative(__dirname, entryPath));
      }
    }
  };

  await traverseDirectory(folderPath);
  return filenames;
};

const getDataFromRemote = async (pathToRemoteFile) => {
  const remoteFile = await fs.readFile(pathToRemoteFile, "utf8");
  const remoteJSON = JSON.parse(remoteFile);

  if (!remoteJSON["complete"]) {
    throw new Error("Data was't fetched properly, please resend request");
  }

  return remoteJSON["folders"];
};

module.exports = {
  downloadFile,
  deleteFile,
  getLocalFilenames,
  getDataFromRemote,
};
