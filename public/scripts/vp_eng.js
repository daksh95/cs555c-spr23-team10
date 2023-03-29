function displayname(){
    const lol = document.getElementsByClassName("namechanger")[0]
    const n = document.getElementById("namer")
    if (lol.style.display === "none"){
        lol.style.display = ""
        n.style.display = ""
    }
    else{
        lol.style.display = "none"
        n.style.display = "none"
    }
}
function displaystatus(){
    const lol = document.getElementsByClassName("statuschanger")[0]
    const n = document.getElementById("statuser")
    if (lol.style.display === "none"){
        lol.style.display = ""
        n.style.display = ""
    }
    else{
        lol.style.display = "none"
        n.style.display = "none"
    }
}
function displaydescription(){
    const lol = document.getElementsByClassName("desc")[0]
    const n = document.getElementById("descriptionr")
    if (lol.style.display === "none"){
        lol.style.display = ""
        n.style.display = ""
    }
    else{
        lol.style.display = "none"
        n.style.display = "none"
    }
}