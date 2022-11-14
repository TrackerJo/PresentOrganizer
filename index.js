
import {getAccountByName, removeDoc, getDocsInCollection, userSignOut, getCurrentUser, createAList} from "./firebase.js"


//On document load call load my lists
document.addEventListener('DOMContentLoaded', () => {
    loadMyLists()
    loadSharedLists()
})

//Load my lists
async function loadMyLists(){
    if(getCurrentUser().loaded == false){
        window.setTimeout(loadMyLists, 100)
    } else{
        let lists = await getDocsInCollection("MyLists")
        console.log(lists)
        //Remove all children from myLists div
        document.getElementById('myLists').innerHTML = ""
        //loop through all the lists
        for(let i = 0; i < lists.length; i++){
            //Get the current list
            let list = lists[i]
            //Get the list name
            let listName = list.Name
            //Create list div
            let listDiv = document.createElement('div')
            listDiv.classList.add('list')
            //add div to the last
            document.getElementById('myLists').appendChild(listDiv)
            //Create a new list element
            let listElement = document.createElement('li')
            //Add the list name to the list element
            listElement.innerText = listName
            listElement.className = "listName"
            //Add the list element to the list
            listDiv.appendChild(listElement)
            
            //Create a delete image with trash icon
            let deleteImage = document.createElement('img')
            deleteImage.src = "images/trash.png"
            deleteImage.className = "deleteList"
            //Add the delete image to the list
            listDiv.appendChild(deleteImage)
            listDiv.addEventListener('click', (event) => {
                //Check if mouse isn't over the delete button
                if(!deleteImage.contains(event.target)){
                    window.location.href = "list.html?list=" + listName
                }
            })
            deleteImage.addEventListener('click', () => {
                deleteList(listName)
            })
        }
    }
}
//Load shared lists
async function loadSharedLists(){
    if(getCurrentUser().loaded == false){
        window.setTimeout(loadSharedLists, 100)
    } else{
        let lists = await getDocsInCollection("SharedLists")
        console.log(lists)
        //Remove all children from myLists div
        document.getElementById('sharedLists').innerHTML = ""
        //loop through all the lists
        for(let i = 0; i < lists.length; i++){
            //Get the current list
            let list = lists[i]
            //Get the list name
            let listName = list.Name
              //Create list div
              let listDiv = document.createElement('div')
              listDiv.classList.add('list')
              //add div to the last
              document.getElementById('sharedLists').appendChild(listDiv)
              //Create a new list element
              let listElement = document.createElement('li')
              //Add the list name to the list element
              listElement.innerText = listName
              listElement.className = "listName"
              //Add the list element to the list
              listDiv.appendChild(listElement)
            listDiv.addEventListener('click', () => {
                window.location.href = "sharedlist.html?list=" + listName
            })
        }
    }
}

async function deleteList(listName){
    //Remove the list from the database
    await removeDoc(listName)
    //Reload the lists
    loadMyLists()
}

const createList = document.getElementById('createList')
createList.addEventListener('click', () => {
   //Prompt the user for a list name
    let listName = prompt("Enter a list name")
    createAList(listName)
    loadMyLists()
})

//Sign out when sign out button is clicked
document.getElementById('signOut').addEventListener('click', () => {
    userSignOut()
})



//Get shared list nav button
const sharedListBtn = document.getElementById('sharedListsBtn')
//Add event listener to shared list nav button
sharedListBtn.addEventListener('click', () => {
    //Add active class to shared list nav button
    sharedListBtn.classList.add('active')
    //Remove active class from my lists nav button
    document.getElementById('myListsBtn').classList.remove('active')
    //remove active class from account nav button
    document.getElementById('accountBtn').classList.remove('active')
    //Show the shared list div
    document.getElementById('sharedListsSection').style.display = "block"
    //Hide the my lists div
    document.getElementById('myListsSection').style.display = "none"
    //Hide the account div
    document.getElementById('accountSection').style.display = "none"
})
//Get my lists nav button
const myListsBtn = document.getElementById('myListsBtn')
//Add event listener to my lists nav button
myListsBtn.addEventListener('click', () => {
    //Add active class to my lists nav button
    myListsBtn.classList.add('active')
    //Remove active class from shared
    document.getElementById('sharedListsBtn').classList.remove('active')
    //Remove active class from account nav button
    document.getElementById('accountBtn').classList.remove('active')
    //Show the my lists div
    document.getElementById('myListsSection').style.display = "block"
    //Hide the shared list div
    document.getElementById('sharedListsSection').style.display = "none"
    //Hide account div
    document.getElementById('accountSection').style.display = "none"
})
//Get account nav button
const accountBtn = document.getElementById('accountBtn')
//Add event listener to account nav button
accountBtn.addEventListener('click', () => {
    //Add active class to account nav button
    accountBtn.classList.add('active')
    //Remove active class from shared
    document.getElementById('sharedListsBtn').classList.remove('active')
    //Remove active class from my lists nav button
    document.getElementById('myListsBtn').classList.remove('active')

    //Show the account div
    document.getElementById('accountSection').style.display = "block"
    //Hide the shared list div
    document.getElementById('sharedListsSection').style.display = "none"
    //Hide the my lists div
    document.getElementById('myListsSection').style.display = "none"
})