import {getItemsInList, shareList, userSignOut, getCurrentUser, addItemToList} from "./firebase.js"

//load items in list once document is loaded and user is signed in
document.addEventListener('DOMContentLoaded', () => {
    loadItemsInList()
})

    //Load items in list
async function loadItemsInList(){
    let listName = window.location.search.split("=")[1]
    listName = listName.replace(/%20/g, " ")
    document.getElementById('listName').innerText = listName
    if(getCurrentUser().loaded == false){
        window.setTimeout(loadItemsInList, 1)
    } else{
        const noneClass = document.querySelectorAll('.none')
        noneClass.forEach( (element) => {
            element.classList.remove('none')
        })
        //Get the items in the list
        let items = await getItemsInList("MyLists", listName)
        //Remove all children from items div
        document.getElementById('items').innerHTML = ""
        //Loop through all the items
        for(let i = 0; i < items.length; i++){
            //Get the current item
            let item = items[i]
            //Get the item name
            let itemName = item.Name;
            //Create item section
            let itemSection = document.createElement('div');
            itemSection.className = "itemSection";
            document.getElementById('items').appendChild(itemSection);
            //Create view div
            let nameDiv = document.createElement('div')
            itemSection.appendChild(nameDiv)
            //Create  button
            let collapseBtn = document.createElement('button');
            collapseBtn.type = "button";
            collapseBtn.className = "collapsible";
            collapseBtn.innerHTML = itemName;
            nameDiv.appendChild(collapseBtn);

            //Create content div
            let contentDiv = document.createElement('div')
            contentDiv.className = "content"
            itemSection.appendChild(contentDiv)
            //Create Description
            let itemDescription = document.createElement('p')
            itemDescription.innerHTML = item.itemDescription
            contentDiv.appendChild(itemDescription)
            //Create buy link
            let buyLink = document.createElement('a')
            //Check if itemLink is structred as a url
            if(item.itemLink.includes("https://") || item.itemLink.includes("http://")){
                buyLink.href = item.itemLink
            } else{
                buyLink.href =  "https://www." + item.itemLink
            }
            buyLink.innerHTML = "Buy"
            buyLink.target = "_blank"
            contentDiv.appendChild(buyLink)
            
            

            
            collapseBtn.addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.parentElement.parentElement.querySelector('.content')
                if (content.style.display === "block") {
                content.style.display = "none";
                } else {
                content.style.display = "block";
                }
            });
        }
        
    }
}

//get the add item button
const addItemPrompt = document.getElementById('addItem')
//add an event listener to the add item button
addItemPrompt.addEventListener('click', () => {
    //animate Slide add item prompt down from top of screen
    document.getElementById('addItemPrompt').classList.remove('hide')
    document.getElementById('promptContent').classList.remove('hidden')
    
    
    //Prompt the user for a list name
    //let listName = window.location.search.split("=")[1]
    //listName = listName.replace(/%20/g, " ")
    //let itemName = prompt("Enter an item name")
    //addItemToList(listName, itemName)
    //loadItemsInList()
})
//Get add item button
const addItemButton = document.getElementById('addItemBtn')
//Add event listener to add item button
addItemButton.addEventListener('click', () => {
    //Get the item name based on input
    let itemName = document.getElementById('itemNameInput').value
    //Get item description based on input
    let itemDescription = document.getElementById('itemDescriptionInput').value
    //Get item link based on input
    let itemLink = document.getElementById('itemLinkInput').value
    //Get the list name
    let listName = window.location.search.split("=")[1]
    listName = listName.replace(/%20/g, " ")
    addItemToList(listName, itemName, itemDescription, itemLink)
    //Hide the add item prompt
    document.getElementById('addItemPrompt').classList.add('hide')
    document.getElementById('promptContent').classList.add('hidden')
    //Reload the items in the list
    loadItemsInList()
})

//Check if escape key is pressed
document.addEventListener('keydown', (e) => {
    if(e.key == "Escape"){
        //Hide the add item prompt
        document.getElementById('addItemPrompt').classList.add('hide')
        document.getElementById('promptContent').classList.add('hidden')
    }
})
//Check if clicked out side of prompt
document.addEventListener('click', (e) => {
    if(e.target.id != "addItemPrompt" && e.target.id != "promptContent" && e.target.id != "addItemBtn" && e.target.id != "addItem" && e.target.id != "itemNameInput" && e.target.id != "itemDescriptionInput" && e.target.id != "itemLinkInput" && e.target.id != "itemNameLabel" && e.target.id != "itemDescriptionLabel" && e.target.id != "itemLinkLabel" && e.target.id != "itemTitle"){
        //Hide the add item prompt
        document.getElementById('addItemPrompt').classList.add('hide')
        document.getElementById('promptContent').classList.add('hidden')
    }
})


//Get share button
const shareBtn = document.getElementById('shareList')
//Add event listener to share button
shareBtn.addEventListener('click', () => {
    //Prompt the user for a list name
    let listName = window.location.search.split("=")[1]
    listName = listName.replace(/%20/g, " ")
    //Prompt the user for an email
    let name = prompt("Enter the name of the account you want to share with")
    //Share the list
    shareList(listName, name)
})
//Get home button
const homeBtn = document.getElementById('home')
//Add event listener to home button
homeBtn.addEventListener('click', () => {
    window.location.href = "index.html"
})
