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
        <div class="col" style="width: 50 rem;">
        <div class="card mb-4 shadow">
            <div class="card-header py-3">
                <h4 class="my-0 fw-normal">${project.name}</h4>
            </div>
            <div class="card-body">
                <h2 class="card-title pricing-card-title">Status: <small class="text-muted fw-light">${project.status}</small></h1>
                <ul class="list-unstyled mt-3 mb-4">
                <li>Description : ${project.description}</li>
                <li>Customer: ${project.customerName}</li>
            
                </ul>
                <form action="/getprojectcus" method="POST" class="view">
                <input type="hidden" name="id" value=${project._id}>
                <button type="submit" class="w-80 btn  btn-view" >View</button>
                </form>
            </div>
        </div>
    </div>
            `;
    projectContainer.appendChild(projectDiv);
    }
});