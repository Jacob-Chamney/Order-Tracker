
// Made By Jacob Chamney //

const { app, BrowserWindow, ipcMain } = require("electron")

const Database = require('better-sqlite3');
const db = new Database('Orders.db', { verbose: console.log });

//Create Table 
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS Orders (
  OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
  FirstName TEXT NOT NULL,
  LastName TEXT NOT NULL,
  OrderDesc TEXT NOT NULL,
  OrderPrice REAL NOT NULL,
  PaymentMethod TEXT NOT NULL,
  OrderDate TEXT NOT NULL
)
  `;
db.exec(createTableSQL);
//End Create Table

// Insert Handler
ipcMain.on('insert-order', (event, orderData) => {
  const insert = db.prepare(`
    INSERT INTO Orders (
      FirstName,
      LastName,
      OrderDesc,
      OrderPrice,
      PaymentMethod,
      OrderDate
    )
    VALUES (?,?,?,?,?,?)
  `)
  insert.run(
    orderData.FirstName,
    orderData.LastName,
    orderData.OrderDesc,
    orderData.OrderPrice,
    orderData.PaymentMethod,
    orderData.OrderDate
  )
  const orders = db.prepare(`
  SELECT *
  FROM Orders
  ORDER BY OrderDate DESC
`).all();
  event.sender.send('load-orders', orders);
  console.log('Received order data:', orderData);
});
//End Insert Handler

//Update Handler
ipcMain.on('update-order', (event, orderData) => {
  const update = db.prepare(`
  UPDATE Orders 
  SET FirstName = ?,
      LastName = ?,
      OrderDesc = ?,
      OrderPrice = ?,
      PaymentMethod = ?,
      OrderDate = ?
  WHERE OrderID = ?
`)
update.run(
    orderData.FirstName,
    orderData.LastName,
    orderData.OrderDesc,
    orderData.OrderPrice,
    orderData.PaymentMethod,
    orderData.OrderDate,
    orderData.OrderID
  )
  const orders = db.prepare(`
  SELECT *
  FROM Orders
  ORDER BY OrderDate DESC
`).all();
  event.sender.send('load-orders', orders);
  console.log('Updated order data:', orderData);
});

//Delete Handler
ipcMain.on('delete-order', (event, OrderID) => {
const deleteOrder = db.prepare(`
  DELETE
  FROM Orders
  WHERE OrderID = ?
`);
  deleteOrder.run(OrderID);
  const orders = db.prepare(`
  SELECT *
  FROM Orders
  ORDER BY OrderDate DESC
`).all();
  event.sender.send('load-orders', orders);
  console.log('Deleted order:', OrderID);
});

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
  
  //Send DB to WebPage
  win.webContents.on("did-finish-load", () => {
    const orders = db.prepare(`
      SELECT *
      FROM Orders
      ORDER BY OrderDate DESC
    `).all();

    win.webContents.send('load-orders', orders);
  });
  //End Send Data to WebPage

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

