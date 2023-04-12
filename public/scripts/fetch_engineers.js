fetch('http://localhost:6969/engineers')
  .then((response) => response.json())
  .then((engineer) => {
    const engineerDropdown = document.getElementById("engineer-dropdown");
    for (let i in engineer) {
        let option = document.createElement('option');
        option.value = engineer[i]._id.toString();
        option.text = engineer[i].name+' - '+ engineer[i]._id.toString();
        engineerDropdown.appendChild(option);
    }
});