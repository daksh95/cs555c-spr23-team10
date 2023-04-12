function search() {
    const query = document.getElementById('search-project').value.toLowerCase()
    console.log(query)
    const projectss = document.getElementById('project-container')
    const project = document.querySelectorAll('.project')
    for (var i=0; i < project.length;i++){
        if (project[i].children[0].children[0].textContent.toLowerCase().indexOf(query) > -1){
            project[i].style.dislay=""
        }
        else{
            project[i].style.display="none";
        }
    }
}

fetch('http://localhost:6969/projects')
.then((response) => response.json())
.then((data) => {
    const projectContainer = document.getElementById("project-container")
    for (let project of data) {
    const projectDiv = document.createElement("div");
    projectDiv.className = "project"
    projectDiv.innerHTML =
        `
            <div>
            <h2>${project.name}</h2>
            <p>Desc : ${project.description}</p>
            <!-- <p>address: ${project.customerAddress}</p> -->
            <p>customer: ${project.customerName} - ${project.customer}</p>
            </div>
            <div class="bebe">
            <h2>Status: ${project.status}</h2>
            <form action="/getprojectman" method="POST">
            <input type="hidden" name="id" value=${project._id}>
            <button type="submit" id="view-button">View</button>
            </form>
            </div>
            `;
    projectContainer.appendChild(projectDiv);
    }
});