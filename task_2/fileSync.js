const fs = require("fs/promises");
const {
  deleteFile,
  downloadFile,
  getLocalFilenames,
  getDataFromRemote,
  createFilesMetadata,
} = require("./utils.js");
const { FILES_FOLDER_PATH, REMOTE_FILE_PATH } = require("./constants.js");

const syncData = async () => {
  console.log("Sync data in progress (〜^∇^)〜");

  const localFilenames = await getLocalFilenames(FILES_FOLDER_PATH);

  const remoteData = await getDataFromRemote(REMOTE_FILE_PATH);
  const remoteDataFiles = remoteData.reduce(
    (files, newFolder) => ({
      ...files,
      ...createFilesMetadata(newFolder.name, newFolder.files),
    }),
    {}
  );
  const remoteFilenames = Object.keys(remoteDataFiles);

  // Add new files from remote
  // In case if you include file with the same name
  // the script will download the last included in files to download
  const filesToDownload = remoteFilenames.filter(
    (filename) => !localFilenames.includes(filename)
  );

  for (const file of filesToDownload)
    await downloadFile(remoteDataFiles[file]["url"], file);

  // Delete old files
  const filesToDelete = localFilenames.filter(
    (filename) => !remoteFilenames.includes(filename)
  );

  for (const file of filesToDelete) await deleteFile(file);

  console.log("Data were updated successfully ᕙ(`▿´)ᕗ\n");
};

const watchRemoteFileChanges = async () => {
  try {
    const watcher = fs.watch(REMOTE_FILE_PATH);

    for await (const _ of watcher) await syncData();
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  await syncData();
  await watchRemoteFileChanges();
};

main();
