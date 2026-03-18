const { app, BrowserWindow, session, Menu } = require('electron');
const path = require('path');
const os = require('os');

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.setPath('userData', path.join(os.tmpdir(), 'fashion-browser-data'));

function createWindow() {
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: 430,
    height: 932,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  });

  const chromeUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = chromeUA;
    delete details.requestHeaders['X-Electron'];
    callback({ requestHeaders: details.requestHeaders });
  });

  win.loadFile('app.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
