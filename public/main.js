const update = document.querySelector('#increase-weight');
document.getElementById("home").style.backgroundColor = "#92C4EE";

update.addEventListener('click', _ => {
    fetch('/exercises', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Barbell Press',
            weight: '90'
        })
    }).then(res => {
        if (res.ok) return res.json();
    }).then(response => {
        window.location.reload();
    }).catch(error => console.error(error))
})

const deleteButton = document.querySelector("#delete-exercise");
const messageDiv = document.querySelector('#message');

deleteButton.addEventListener('click', _ => {
    fetch('/exercises', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Barbell Press'
        })
    }).then(res => {
        if (res.ok) return res.json();
    }).then(response => {
        if (response === "No Barbell Exercise to delete") {
            messageDiv.textContent = 'No Barbell Exercise to delete'
        } else {
            window.location.reload();
        }
    }).catch(error => console.error(error))
})

// LOGIN PAGE
// const loginButton = document.querySelector("#login");

// loginButton.addEventListener('click', _ => {
//     fetch('/users', {
//         method: 'get',
//         headers: {'Content-Type': 'application/json'},
//         body: 
//     })
// })
