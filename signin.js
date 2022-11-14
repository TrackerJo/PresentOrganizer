

import {createUser, signIn} from "./firebase.js"

async function AddDoc_CustomID(collection,obj, name){
    var ref = doc(db, collection, name);

    await setDoc(
        ref, obj
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

document.getElementById('register').addEventListener('click', () => {
    //Get all our input fields
    let full_name = document.getElementById('full_name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    //Validate input fields
    if(validate_email(email) == false){
        alert("Please enter a valid email")
        return
    }

    if(validate_password(password) == false){
        alert("Please make sure your password is at least 6 characters long")
        return
    }

    if(validate_name(full_name) == false){
        alert("Please enter a name")
        return
    }

    createUser(email, password, full_name)
    
    
})

document.getElementById('login').addEventListener('click', () => {
    //Get all our input fields
    let full_name = document.getElementById('full_name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    //Validate input fields
    if(validate_email(email) == false){
        alert("Please enter a valid email")
        return
    }

    if(validate_password(password) == false){
        alert("Please make sure your password is at least 6 characters long")
        return
    }

    if(validate_name(full_name) == false){
        alert("Please enter a name")
        return
    }

    signIn(email, password, full_name)

    
})

function validate_email(email){
    let expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(email) == true){
        return true
    } else{
        return false
    }
}

function validate_password(password){
    if(password < 6){
        return false
    } else{
        return true
    }
}

function validate_name(name){
    if(name == null){
        return false
    }

    if(name.length <= 0){
        return false
    }

    return true
}