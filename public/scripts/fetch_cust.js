fetch('http://localhost:6969/customers')
  .then((response) => response.json())
  .then((customer) => {
    const customerDropdown = document.getElementById("customer-dropdown");
    for (let i in customer) {
        let option = document.createElement('option');
        option.value = customer[i]._id.toString();
        option.text = customer[i].name+' - '+ customer[i]._id.toString();
        customerDropdown.appendChild(option);
    }
});