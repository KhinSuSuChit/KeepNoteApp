const categoriesContainer = document.querySelector(".categories-container");

const searchInput = document.querySelector("#search");

const toggleBtn = document.querySelector(".toggle-btn");
const body = document.querySelector("body");

const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const noteInput = document.querySelector("#note");
const categoriesInput = document.querySelector("#categories");

const noteContainer = document.querySelector(".note-container");

const modal = document.querySelector("#modal");
const modalBtn = document.querySelector(".modal-btn");

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

    addFilteredNotesToUI(filteredNotes);
});

modalBtn.addEventListener("click", ()=> {
    modal.close();
})

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

categoriesContainer.addEventListener("click", (event) => {
    const currentItem = event.target.closest(".category-item");
    const categoryId = currentItem.querySelector(".hidden-id").textContent;

    let notes = getNotes();
    let categorizedNotes = notes.filter((note) => {
        return parseInt(note.categories) === parseInt(categoryId);
    });

    addFilteredNotesToUI(categorizedNotes);
});

noteContainer.addEventListener("click", (event) => {
    const currentNote = event.target.closest(".note");

    if(event.target.classList.contains('note-delete')){
        const id = currentNote.querySelector("span").textContent;
        if(confirm("Are you sure?")){
            //remove from database
            removeNote(id);
            //remove from UI
            currentNote.remove();
            alert("Note deleted!")
        }
    }

    if(event.target.classList.contains('note-view')){
        
        const noteTitle = currentNote.querySelector(".note-title").textContent;
        const noteBody = currentNote.querySelector(".note-body").textContent;

        openNoteModal(noteTitle, noteBody);
    }

});

function openNoteModal(noteTitle, noteBody){
    const modalTitle = document.querySelector(".modal-title");
    const modalBody = document.querySelector(".modal-body");
    modalTitle.textContent = noteTitle;
    modalBody.textContent = noteBody;
    modal.showModal()
}

function removeNote(id){
    let notes = getNotes();
    notes = notes.filter((note) => parseInt(note.id) !== parseInt(id))
    localStorage.setItem('keep-notes', JSON.stringify(notes));
}

function loadTheme(){
    body.setAttribute("color-scheme",theme);
    toggleBtn.innerHTML = theme==='light' ? '<i class="fa-solid fa-lightbulb"></i>' : '<i class="fa-solid fa-moon"></i>';
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

function addFilteredNotesToUI(filteredNotes){
    noteContainer.innerHTML = "";
    //add Notes to UI
    filteredNotes.forEach((note)=>{
        addNoteToUIList(note);
    });
}

function addNoteToUIList(note){
    const article = document.createElement("article");
    article.classList.add("note");
    article.innerHTML = `
    <article>
        <span hidden>${note.id}</span>
        <h2 class="note-title">${note.title}</h2>
        <p class="note-body">${note.note}</p>
        <div class="note-btns">
            <button class="note-btn note-view">View</button>
            <button class="note-btn note-delete">Delete</button>
        </div>
    </article>
    `;
    noteContainer.appendChild(article);
}

