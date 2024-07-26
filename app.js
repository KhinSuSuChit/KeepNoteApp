const categoriesContainer = document.querySelector(".categories-container");

const searchInput = document.querySelector("#search");

const toggleBtn = document.querySelector(".toggle-btn");
const body = document.querySelector("body");

const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const noteInput = document.querySelector("#note");
const categoriesInput = document.querySelector("#categories");

const noteContainer = document.querySelector(".note-container");

const categories = [
    {id:1, name:"Music"},
    {id:2, name:"Coding"},
    {id:3, name:"Idea"},
]

let theme = "light";
let filteredNotes = [];

window.addEventListener("DOMContentLoaded",()=>{
    showAllCategories();
    showAllNotes();

    if(localStorage.getItem("theme")){
        theme = localStorage.getItem("theme");
    }
    loadTheme();
})

searchInput.addEventListener("keyup",()=>{
    const searchValue = searchInput.value.toLowerCase();
    let notes = getNotes();
    
    filteredNotes = notes.filter((note) => {
        let keywordsToSearch = [note.title,note.note].join(" ");
        return keywordsToSearch.toLowerCase().includes(searchValue);
    });

    noteContainer.innerHTML = "";

    //add Notes to UI
    filteredNotes.forEach((note)=>{
        addNoteToUIList(note);
    });
});

toggleBtn.addEventListener("click",()=>{
    if(theme === "light"){
        theme = "dark";
    }
    else{
        theme = "light";
    }
    loadTheme();
    localStorage.setItem("theme", theme);
});

function loadTheme(){
    body.setAttribute("color-scheme",theme);
}

function showAllNotes(){
    //get notes array from local storage
    let notes = getNotes();
    //show notes
    notes.forEach((item)=>{
        addNoteToUIList(item);
    });
}
function showAllCategories(){
    categories.forEach((category) => {
        addCategoryToSidebar(category);
        addCategoryToSelect(category);
    });
}

function addCategoryToSidebar(category){
    const li = document.createElement('li');
    li.classList.add('category-item');
    li.innerHTML = `
    <span class="hidden-id" hidden>${category.id}</span>
    <span>${category.name}</span>
    `;
    categoriesContainer.appendChild(li);
}

function addCategoryToSelect(category){
    const option = document.createElement('option');
    option.setAttribute("value",category.id);
    option.textContent = category.name;
    categoriesInput.appendChild(option);
    console.log(option);
}

form.addEventListener("submit",(event) => {
    event.preventDefault();

    if(titleInput.value !== '' && noteInput !== ''){
        const note = {
            id : Math.floor(Math.random() * 2000),
            title : titleInput.value,
            note : noteInput.value,
            categories : categoriesInput.value,
        };

        addNoteToUIList(note);
        saveToLocalStorage(note);

        titleInput.value = "";
        noteInput.value = "";

        alert("Saved Successfully!");
    }
    else{
        alert("Please fill both inputs");
    }
    
});

function getNotes(){
    let notes = [];
    if(localStorage.getItem("keep-notes")){
        notes = JSON.parse(localStorage.getItem("keep-notes"));
    }
    return notes;
}
function saveToLocalStorage(item){
    const oldNotes = getNotes();
    oldNotes.push(item);
    localStorage.setItem('keep-notes', JSON.stringify(oldNotes));
}

/* 

*/

function addNoteToUIList(note){
    const article = document.createElement("article");
    article.classList.add("note");
    article.innerHTML = `
    <article>
        <h2 class="note-title">${note.title}</h2>
        <p class="note-body">${note.note}</p>
        <div class="note-btns">
            <button class="note-btn">View</button>
            <button class="note-btn">Delete</button>
        </div>
    </article>
    `;
    noteContainer.appendChild(article);
}