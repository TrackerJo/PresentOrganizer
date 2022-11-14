import {getItemsFromSharedList, getCurrentUser} from "./firebase.js"
document.addEventListener('DOMContentLoaded', () => {
    loadItemsInList()
})

//Load items in list
async function loadItemsInList(){
    let listName = window.location.search.split("=")[1]
    listName = listName.replace(/%20/g, " ")
    //replace %27 with '
    listName = listName.replace(/%27/g, "'")
    document.getElementById('listName').innerText = listName
    //split list name by ' and get the first part
    listName = listName.split("'s ")[1]
    
    if(getCurrentUser().loaded == false){
        window.setTimeout(loadItemsInList, 100)
    } else{
        
        //Get the items in the list
        let items = await getItemsFromSharedList(listName)
        //Remove all children from items div
        document.getElementById('items').innerHTML = ""
        //Loop through all the items
        for(let i = 0; i < items.length; i++){
            //Get the current item
            let item = items[i]
            //Get the item name
            let itemName = item.Name
            //Create a new item element
            let itemElement = document.createElement('li')
            //Add the item name to the item element
            itemElement.innerText = itemName
            //Add the item element to the list
            document.getElementById('items').appendChild(itemElement)
        }
}
}