
import {
    getFirestore, doc, query,getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, getDocs, where
}
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import {
    getAuth, signOut, createUserWithEmailAndPassword, setPersistence, onAuthStateChanged ,signInWithEmailAndPassword, browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyKOJ8Jn1SC6teX_Sqqp8pwEisn1mAKQA",
  authDomain: "presentdocumentor.firebaseapp.com",
  projectId: "presentdocumentor",
  storageBucket: "presentdocumentor.appspot.com",
  messagingSenderId: "1022204280894",
  appId: "1:1022204280894:web:9bb9963349958918e6516f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
let currentUser = {loaded: false}

onAuthStateChanged(auth, user => {
    if (user) {
        console.log('user logged in: ', user);
        currentUser = user
        //Check if on singin page
        if(window.location.pathname == "/signin.html"){
            window.location.href = "index.html"
        }
        
    } else {
        console.log('user logged out');
        if(window.location.pathname != "/signin.html"){
            window.location.href = "signin.html"
        }
    }
})

export async function AddDoc_AutoID(collectionName,obj){
    var ref = collection(db, collectionName);

    const docRef = await addDoc(
        ref, obj
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function AddDoc_CustomID(collectionName,obj, name){
    var ref = doc(db, collectionName, name);

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

export async function GetDoc(collectionName, name){
    var ref = doc(db, collectionName, name);
    const docSnap = await getDoc(ref)
    if(docSnap.exists()){
        return docSnap.data()
    } else{
        alert("Document doesn't exist")
        return "Failed"
    }
    
}

export async function UpdateFieldsInDoc(collectionName,obj, name){
    var ref = doc(db, collectionName, name);

    await updateDoc(
        ref, obj
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function DeleteDoc(collectionName, name){
    var ref = doc(db, collectionName, name);
    const docSnap = await getDoc(ref)
    if(!docSnap.exists()){
        alert("Document Doesn't Exist")
        return
    }

    await deleteDoc(ref)
    .then(() => {
        alert("data deleted successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function createUser(email, password, full_name){
    const auth = getAuth();
    alert("Emal: " + email + " Password: " + password)
    await createUserWithEmailAndPassword(auth,email, password)
    .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        alert(user.uid)
        sessionStorage.setItem("name", full_name)
        await AddDoc_CustomID("Accounts", {Name: full_name, Email: email}, user.uid)
        
        alert("Account Created Successfully")
        window.location.href = "index.html"
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error when registering account. Look in console for more info.")
        console.log("Recieved error: " + errorMessage + " with error code " + errorCode + " when registering account.")
    });
    
}

export async function signIn(email, password, full_name){
    const auth = getAuth();
    
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        sessionStorage.setItem("name", full_name)
        alert("Signed in successfully")
        setPersistence(auth, browserSessionPersistence)
        .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        window.location.href = "index.html"
        return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error when signing in. Look in console for more info.")
        console.log("Recieved error: " + errorMessage + " with error code " + errorCode + " when signing in.")
    });
}

export async function getDocsInCollection(collectionName){
    
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const querySnapshot = await getDocs(collection(accountDoc, collectionName));
    return querySnapshot.docs.map(doc => doc.data());
}

export async function getItemsInList(collectionName, listName){
    
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const listDoc = doc(accountDoc, collectionName, listName)
    const querySnapshot = await getDocs(collection(listDoc, "Presents"));
    return querySnapshot.docs.map(doc => doc.data());
}

export async function userSignOut(){
    await signOut(auth)
    .then(() => {
        alert("Signed out successfully")
        window.location.href = "signin.html"
    })
    .catch((error) => {
        alert("Error when signing out. Look in console for more info.")
        console.log("Recieved error: " + error + " when signing out.")
    });
}

export function getCurrentUser(){
    return currentUser
}

export async function createAList(listName){
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    var ref = doc(accountDoc, "MyLists", listName);

    await setDoc(
        ref, {Name: listName, Shared: false, SharedWith: []}
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function addItemToList(listName,itemName, itemDescription, itemLink){
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const listDoc = doc(accountDoc, "MyLists", listName)
    var ref = doc(listDoc, "Presents", itemName);

    await setDoc(
        ref, {Name: itemName, itemDescription: itemDescription, itemLink: itemLink}
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function getAccountByName(name){
    const q = query(collection(db, "Accounts"), where("Name", "==", name));
    const querySnapshot = await getDocs(q); 
    let map = querySnapshot.docs.map(doc => doc.data());
    querySnapshot.forEach((doc) => {
        map[0].uid = doc.id
    });
    return map
}

export async function shareList(listName, sharedWith){
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const listDoc = doc(accountDoc, "MyLists", listName)
    const listDocData = await getDoc(listDoc)
    let listSharedWith = listDocData.data().SharedWith
    console.log(listSharedWith)
    listSharedWith.push(sharedWith)
    await updateDoc(listDoc, {Shared: true, SharedWith: listSharedWith})
    const sharedAccount = await getAccountByName(sharedWith)
    alert(sharedAccount[0].uid)
    const sharedWithDoc = doc(db, "Accounts", sharedAccount[0].uid)
    
    var ref = doc(sharedWithDoc, "SharedLists", listName);
    listName = sessionStorage.getItem("name") + "'s " + listName
    await setDoc(
        ref, {Name: listName, Owner: currentUser.uid}
        
    )
    .then(() => {
        alert("data added successfully")
    })
    .catch((error) => {
        alert("unsuccessful operation, error: " + error);
    })
}

export async function getItemsFromSharedList(listName){
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const sharedListDoc = doc(accountDoc, "SharedLists", listName)
    const sharedListContent = await getDoc(sharedListDoc)
    
    const sharedAccDoc = doc(db, "Accounts", sharedListContent.data().Owner)
    const listDoc = doc(sharedAccDoc, "MyLists", listName)
    const querySnapshot = await getDocs(collection(listDoc, "Presents"));
    return querySnapshot.docs.map(doc => doc.data());
}

export async function removeDoc(docName){
    const accountDoc = doc(db, "Accounts", currentUser.uid)
    const docRef = doc(accountDoc, "MyLists", docName);
    const docData = await getDoc(docRef)
    if(docData.data().Shared){
        let listSharedWith = docData.data().SharedWith
        for(let i = 0; i < listSharedWith.length; i++){
            const sharedAccount = await getAccountByName(listSharedWith[i])
            const sharedWithDoc = doc(db, "Accounts", sharedAccount[0].uid)
            const sharedListDoc = doc(sharedWithDoc, "SharedLists", docName);
            await deleteDoc(sharedListDoc)
        }
    }
    await deleteDoc(docRef);
}