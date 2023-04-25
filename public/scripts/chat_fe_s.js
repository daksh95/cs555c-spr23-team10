var form = document.querySelector("form");
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let par = document.getElementById('container');
    const secondLastChild = par.childNodes[par.childNodes.length - 2];
    let i = document.getElementById('inputt')
    let newDiv = document.createElement('div');
    newDiv.className = "message sent"
    newDiv.textContent = i.value;
    par.insertBefore(newDiv, secondLastChild)
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:6969/ss';
    let ss = "S-" + i.value
    const payload = {
        msg: ss
    };
    console.log(payload)
    const payloadString = JSON.stringify(payload);
    console.log(payloadString)
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
        }
    };

    xhr.send(payloadString);
    form.reset()
    i.focus()
})

// function check(){
//     const xhr = new XMLHttpRequest();
//     const url = 'http://localhost:6969/checkmsgg';
//     const allPTags = document.querySelectorAll('p');
//     let s1 = allPTags[allPTags.length - 1].textContent
//     const payload = {
//         last_msg: s1
//     };
//     const payloadString = JSON.stringify(payload);
//     xhr.open('POST', url);
//     xhr.setRequestHeader('Content-type', 'application/json');
//     xhr.onreadystatechange = function() {
//         if (xhr.status === 400) {
//             setTimeout(check(),7000)
//         }
//         if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             window.location.reload(1);
//         }
//       };
//     xhr.send(payloadString);
//  }

//  check()

setTimeout(()=>{
    window.location.reload(1)
},6000)