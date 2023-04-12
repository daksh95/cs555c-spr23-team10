fetch('http://localhost:6969/managers')
  .then((response) => response.json())
  .then((manager) => {
    const managerDropdown = document.getElementById("manager-dropdown");
    for (let i in manager) {
        let option = document.createElement('option');
        option.value = manager[i]._id.toString();
        option.text = manager[i].name+' - '+ manager[i]._id.toString();
        managerDropdown.appendChild(option);
    }
});