
// Made By Jacob Chamney //

const { app, BrowserWindow, ipcMain } = require("electron")

const Database = require('better-sqlite3');
const db = new Database('Orders.db', { verbose: console.log });

//Create table 
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS Orders (
  OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
  FirstName TEXT NOT NULL,
  LastName TEXT NOT NULL,
  OrderDescription TEXT NOT NULL,
  OrderPrice REAL NOT NULL,
  PaymentMethod TEXT NOT NULL,
  OrderDate TEXT NOT NULL
)
  `;
db.exec(createTableSQL);

// IPC Handler
ipcMain.on('insert-order', (event, orderData) => {
  
  
  console.log('Received order data:', orderData);
});
//End IPC Handler

//Create Window
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
} 

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } 
})
//End Create Window

