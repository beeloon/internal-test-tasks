# Electron Node.js Test

## Task #1. Create simple wrapper for youtube music on electron
  - app must load and display web version of youtube music
  - app must handle media keys (play/pause, next, prevoius) and displatch events to web version (if user click pause button app must pause music )
  - add logging to the app (save console log from electron and web page to the log file)
  - handle errors inside app (restart app if electron or webpage is crashed)
  - app must be packaged for use on windows or mac or linux (by dev preferences)
   

## Task #2. Sync Files Task
We have API which returns to us media files which must be on devices in structure <br>
Idea is when remote json is changed (we receive new version from API) we need delete files which not present in remote.json and download new files added to remote json

Steps:
1) write logic to load all files in to filesystem
2) change content of remote json (add or delete folders or files)
3) detect changes in remote json and download new files or delete old