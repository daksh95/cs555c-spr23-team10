fetch('http://localhost:6969/salespeople')
  .then((response) => response.json())
  .then((sales) => {
    const salesDropdown = document.getElementById("sales-dropdown");
    for (let i in sales) {
        let option = document.createElement('option');
        option.value = sales[i]._id.toString();
        option.text = sales[i].name+' - '+ sales[i]._id.toString();
        salesDropdown.appendChild(option);
    }
});