document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById('fname').value,
    lastName: document.getElementById('lname').value,
    orderDesc: document.getElementById('orderdesc').value,
    orderPrice: document.getElementById('orderprice').value,
    paymentMethod: document.getElementById('paymentmethod').value,
    date: document.getElementById('date').value
  }
  console.log(formData);
  });
