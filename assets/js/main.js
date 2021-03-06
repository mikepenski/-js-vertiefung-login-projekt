"use strict";

//no need anymore just for look in data
const USERS = [ 
    { name: "supercode", secret: "no_one_will_know" },
    { name: "music_fan_1990", secret: "WeAreTheChampi0ns" },
    { name: "admin", secret: "1234" },
];


//vars
const body = document.querySelector("body");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginUserName = document.getElementById("username");
const loginPassword = document.getElementById("password");
const loginModalSubmit = document.getElementById("submit");
const logoutLink = document.getElementById("log-out");
const usernameContainer = document.querySelector(".username");


//set focus to login username input
loginUserName.focus();

/*
* cookie functions
*/
var getCookie = function (name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
};

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) { 
    setCookie(name, '', -1); 
}

/*
* print error messsage
*/
let printError = (message) => {

    //create errorMessage and class
    const errorContainer = document.getElementById("errorMessage");   
    if(errorContainer == null){
        let errorMessage = document.createElement("div");
        errorMessage.id = "errorMessage";
        loginForm.appendChild(errorMessage);
    }

    //check if user is found
    if(message == "user not found"){
        console.log(errorMessage)
        errorMessage.innerHTML = "*user does not exist.";
        loginUserName.classList.add("alert");
    }

    //check if password is correct
    if(message == "wrong password"){
        console.log(errorMessage)
        errorMessage.innerHTML = "*wrong password.";
        loginPassword.classList.add("alert");
    }
}

/*
* write username to navbar and remove css classes
*/
let welcomeUser = (userName) => {
    body.classList.remove("modalOpen");
    loginModal.classList.add("d-none");
    usernameContainer.innerHTML = userName;
}

/*
* check user is logged in
*/
let checkUserisLoggedin = () => {

    let myCookie = getCookie('userLogin');

    console.log("teeeest " + myCookie)

    if(typeof myCookie !== 'undefined'){

        myCookie = JSON.parse(myCookie);

        if (1 === myCookie.value) {
            //get username and call weclome user function
            const userName = myCookie.username;
            console.log(userName)
            welcomeUser(userName);
        }

    }

   
}

/*
*create cookie
*/

let createCookie = (userName) => {

    let cookieValue = {
        value: 1, username: userName
    }

    cookieValue = JSON.stringify(cookieValue);
  
    setCookie("userLogin", cookieValue, 365);

    if(typeof myCookie == 'undefined'){
        checkUserisLoggedin();
    }

}

/*
* check user login form actions
*/
let checkLogin = () => {

    let userInputName = document.getElementById("username").value.toLowerCase();
    let userINputPassword = document.getElementById("password").value;

    const data = {
        name: userInputName,
        secret: userINputPassword
    };

    fetch('https://supercode-auth-demo.herokuapp.com/', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {

    //console.log('Success:', data);

    if(data.success == true){
        console.log("logged in");
        createCookie(data.user);
    } 

    if(data.success == false){
        console.log("false");
        printError(data.message);
    } 

    })
    
    .catch((error) => {
        console.error('Error:', error);
    });


}


/*
* check if cookie is set and call checkUserisLoggedin function
*/

checkUserisLoggedin();


/*
* event listener for login form
*/
loginModal.addEventListener("submit", (e) => {
    checkLogin();
    e.preventDefault();
})

/*
* event listener for logout and delete cookie
*/
logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteCookie("userLogin");
    location.reload();
})


    
 
    
