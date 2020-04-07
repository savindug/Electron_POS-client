const electron = require('electron');
    const {ipcRenderer} = electron;

    const xhr = new XMLHttpRequest();

    class Users  {

        constructor(username, email, pwd, c_pwd){
            this.username = username;
            this.email = email;
            this.pwd = pwd;
            this.c_pwd = c_pwd;
        }

        displayUser(){
            console.log(this.username+", "+this.email+", "+this.pwd);
        }

        saveUser(){

            let url = new URL('http://localhost:8090/api/v1/users');

            var data = JSON.stringify(  {
                "username": this.username,
                "email": this.email,
                "pwd": this.pwd
            })

            xhr.open('POST', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) { //has the operation finished
                    if (xhr.status == 200) { //was it successful
                    //result.value = xhr.responseText; //update the webpage
                    var ret = JSON.parse(xhr.responseText);
                   // alert("Welcome "+ ret.username);
                    console.log(ret);
                    console.log(ret.status)
                    if(ret.status == "User Successfully Saved!"){
                        this.setSession(ret)
                    }else if(ret.status =="User already exist!"){
                        alert(ret.status);
                    }else{
                        alert(ret.status)
                    }

                    }
                    else {

                    alert("Async call failed. ResponseText was:\n" + xhr.responseText);
                    } //show what the failed response was
                   // xhr = null; //the previous xhr object no longer has any use
                    }
            }

        }

        loginUser(){

            let url = new URL(`http://localhost:8090/api/v1/users/login?username=${this.username}&pwd=${this.pwd}`);
            //let url = new URL(`http://localhost:8090/api/v1/users/login`)
            var data = JSON.stringify(  {
                "username": this.username,
                "pwd": this.pwd
            })

            xhr.open('GET', url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) { //has the operation finished
                    if (xhr.status == 200) { //was it successful
                    //result.value = xhr.responseText; //update the webpage
                    var ret = JSON.parse(xhr.responseText);
                //     var retString = JSON.stringify(xhr.responseText)
                //    // alert("Welcome "+ ret.username);
                    alert(xhr.responseText);
                  //  var ret = xhr.response
                        console.log(ret)
                        console.log("xhr.response.username = "+ret.username)

                        this.authenticate(ret)

                    }
                    else {

                    alert("Async call failed. ResponseText was:\n" + xhr.responseText);
                    } //show what the failed response was
                   // xhr = null; //the previous xhr object no longer has any use
                    }
            }

        }

    setSession(data){
    console.log("setSession( "+data.username+" )")
    ipcRenderer.send('set-username', data);


    localStorage.setItem("user-login-data", JSON.stringify(data));

    ipcRenderer.on('user-saved', (e) => {
        this.redirectUser();
    })

    }

    authenticate(data){

        if ( (data.username == this.username && data.pwd == this.pwd) || (data.email == this.username && data.pwd == this.pwd)  ){
           // alert("this.username = "+this.username+", data.username = "+data.username+", pwd = "+data.pwd)
            this.setSession(data);
        }else{
            alert("User Authentication Failed!")
        }
    }

    redirectUser(){
            console.log("redirectUser()")
            ipcRenderer.send('loginWindow-load')
    }


    }

    module.exports.Users = Users;



//    url.searchParams.set('username', 'Savi')
//    url.searchParams.set('email', 'savindu.me@gmail.com')
//    url.searchParams.set('pwd', '102020202')
//    url.searchParams.set('role', 'role')
//    url.searchParams.set('regDate', '2019-12-18 00:00:00')




