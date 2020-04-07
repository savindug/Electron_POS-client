const {ipcRenderer} = require('electron')
window.$ = window.jquery = require('../../../node_modules/jquery');
window.dt = require('../../../node_modules/datatables.net')();
window.$('#table_id').DataTable();

const xhr = new XMLHttpRequest();

window.addEventListener('load', (e) => {
    console.log('set-user-session')

    getUsers()

    ipcRenderer.on('set-user-session', (e, data) => {

    sessionStorage.setItem('user', JSON.stringify(data))
    sessionStorage.setItem('username', data.username)
    console.log("Set session : "+ JSON.stringify(data))
    console.log("JSON: ")

    // var dataset = [
    //     [data.username, data.email, data.pwd, data.role, data.regDate]
    // ];
    //   $(document).ready(function() {
    //     $('#dataTable').DataTable( {
    //         data: dataset,
    //         columns: [
    //             { "username": data.username },
    //             { "email": data.email },
    //             { "pwd": data.pwd },
    //             { "role": data.role},
    //             { "regDate": data.regDate }
    //         ]
    //     } );
    // } );

console.log("sessionStorage.getItem('username'): "+sessionStorage.getItem('username'))

})


})

function getUsers(){

    let url = new URL('http://localhost:8090/api/v1/users');

    // var data = JSON.stringify(  {
    //     "username": this.username,
    //     "email": this.email,
    //     "pwd": this.pwd
    // })

    xhr.open('GET', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) { //has the operation finished
            if (xhr.status == 200) { //was it successful
            //result.value = xhr.responseText; //update the webpage
            var ret = JSON.parse(xhr.responseText);
            getUser = ret
           // alert("Welcome "+ ret.username);
            console.log(ret);
                displayUsers(xhr.responseText)
            }
            else {

            alert("Async call failed. ResponseText was:\n" + xhr.responseText);
            } //show what the failed response was
           // xhr = null; //the previous xhr object no longer has any use
            }
    }

}

function displayUsers(users){
    console.log("Users => "+users)

    var data = JSON.parse(users);

console.log("dataset: "+data)

      $(document).ready(function() {
        $('#dataTable').DataTable( {
            data: data,
            columns: [
                { title: 'id', data: 'id' },
                { title: 'username', data: 'username' },
                { title: 'email', data: 'email' },
                { title: 'pwd', data: 'pwd' },
                { title: 'role', data: 'role' },
                { title: 'regDate', data: 'regDate' }
                ]
        } );
    } );

}