const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f1f3d',
      symbolColor: '#ffffff',
      height: 40
    },
    icon: path.join(__dirname, '../public/icon.ico'),
    show: false
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  win.once('ready-to-show', () => win.show())
}

// Handle PDF save dialog
ipcMain.handle('save-pdf', async (event, { buffer, filename }) => {
  const { dialog } = require('electron')
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save Report as PDF',
    defaultPath: filename,
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  })
  if (filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer))
    shell.openPath(filePath)
    return { success: true, path: filePath }
  }
  return { success: false }
})

// Handle data persistence
const dataPath = path.join(app.getPath('userData'), 'survey-data.json')

ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(dataPath)) {
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
    return null
  } catch (e) {
    return null
  }
})

ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
