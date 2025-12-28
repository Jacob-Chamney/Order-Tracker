
const { ipcRenderer } = require('electron')

let selectedOrder = null;
let selectedRow = null;
let isEditing = false;

//Submit OrderData To DB
document.getElementById('orderForm').addEventListener('submit', (e) => {
  e.preventDefault();

const formData = {
  FirstName: document.getElementById('fname').value,
  LastName: document.getElementById('lname').value,
  OrderDesc: document.getElementById('orderdesc').value,
  OrderPrice: document.getElementById('orderprice').value,
  PaymentMethod: document.getElementById('paymentmethod').value,
  OrderDate: document.getElementById('date').value
}
if(isEditing) {
    formData.OrderID = selectedOrder.OrderID;
    ipcRenderer.send('update-order', formData);
  } else {
    ipcRenderer.send('insert-order', formData);
  }
  console.log(formData);
});
//End Submit OrderData To DB

//Recieve OrderData
ipcRenderer.on('load-orders', (event, orders) => {
  const tbody = document.getElementById('orders-body');
  tbody.innerHTML = '';
  orders.forEach(order => {
   const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    dateCell.textContent = order.OrderDate;
    row.appendChild(dateCell);
    
    const lastNameCell = document.createElement('td');
    lastNameCell.textContent = order.LastName;
    row.appendChild(lastNameCell);
    
    const firstnameCell = document.createElement('td');
    firstnameCell.textContent = order.FirstName;
    row.appendChild(firstnameCell);
    
    const orderCell = document.createElement('td');
    orderCell.textContent = order.OrderDesc;
    row.appendChild(orderCell);
    
    const totalCell = document.createElement('td');
    totalCell.textContent = '$' + order.OrderPrice;
    row.appendChild(totalCell);
    
    const paymenttypeCell = document.createElement('td');
    paymenttypeCell.textContent = order.PaymentMethod;
    row.appendChild(paymenttypeCell);

    row.addEventListener('click', (e) => {
      e.stopPropagation();
      if(selectedRow) {
        selectedRow.classList.remove('selected');
      }
      row.classList.add('selected');
      selectedRow = row;
      selectedOrder = order;
      document.getElementById('edit-btn').style.display = 'inline-block';
      document.getElementById('delete-btn').style.display = 'inline-block';
    });

    tbody.appendChild(row);
  });
  clearSelection();
  console.log('Recieved Orders:', orders);
});
//End Recieve OrderData

//Edit Order
document.getElementById('edit-btn').addEventListener('click', () => {
  document.getElementById('fname').value = selectedOrder.FirstName;
  document.getElementById('lname').value = selectedOrder.LastName;
  document.getElementById('orderdesc').value = selectedOrder.OrderDesc;
  document.getElementById('orderprice').value = selectedOrder.OrderPrice;
  document.getElementById('paymentmethod').value = selectedOrder.PaymentMethod;
  document.getElementById('date').value = selectedOrder.OrderDate;

  document.getElementById('edit-btn').style.display = 'none';
  document.getElementById('delete-btn').style.display = 'none';
  document.getElementById('submit-btn').value = 'Update';
  isEditing = true;
});
//End Edit Order

//Delete Order
document.getElementById('delete-btn').addEventListener('click', () => {
const confirmed = confirm('Are you sure you want to DELETE this order?');
if(confirmed) {
    ipcRenderer.send('delete-order', selectedOrder.OrderID);
  }
});
//End Delete Order

//Clear Selection
const clearSelection = () => {
  if (selectedRow) {
    selectedRow.classList.remove('selected');
  }
  selectedRow = null;
  selectedOrder = null;
  isEditing = false;
  
  document.getElementById('edit-btn').style.display = 'none';
  document.getElementById('delete-btn').style.display = 'none';
  document.getElementById('submit-btn').value = "Input";
  document.getElementById('orderForm').reset();
};
document.addEventListener('click', (e) => {
  const isClickInsideTable = document.getElementById('orders-table').contains(e.target);
  const isClickInsideForm = document.getElementById('orderForm').contains(e.target);

  if (!isClickInsideTable && !isClickInsideForm) {
    clearSelection();
  }
});
//End Clear Section

