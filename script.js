// Select page elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");


// Local storage key
const NOTES_STORAGE_KEY = "quicknotes-notes";


// Load notes from localStorage
let notes = loadNotes();


// Load saved notes
function loadNotes() {
  const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);

  if (savedNotes === null) {
    return [];
  }

  try {
    return JSON.parse(savedNotes);
  } catch (error) {
    console.error("Could not load saved notes.", error);
    return [];
  }
}


// Save notes to localStorage
function saveNotes() {
  localStorage.setItem(
    NOTES_STORAGE_KEY,
    JSON.stringify(notes)
  );
}


// Update note count
function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}


// Render notes on the page
function render(notesToRender = notes) {
  notesList.replaceChildren();

  if (notesToRender.length === 0) {
    if (searchInput.value.trim() !== "") {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "No notes match your search.";
      notesList.appendChild(emptyMessage);
    }

    updateCount();
    return;
  }

  notesToRender.forEach((note) => {
    const listItem = document.createElement("li");

    listItem.classList.add(
      "note-card",
      `category-${note.category}`
    );

    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent = note.category;

    const date = document.createElement("p");
    date.classList.add("note-date");
    date.textContent = `Created: ${note.createdAt}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = note.id;

    listItem.appendChild(noteText);
    listItem.appendChild(categoryLabel);
    listItem.appendChild(date);
    listItem.appendChild(deleteButton);

    notesList.appendChild(listItem);
  });

  updateCount();
}


// Clear validation error
function clearError() {
  errorMessage.textContent = "";
}


// Add a note
noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);

  saveNotes();
  clearError();

  noteInput.value = "";

  render();
});


// Delete a note
notesList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const noteId = Number(event.target.dataset.id);

  notes = notes.filter((note) => note.id !== noteId);

  saveNotes();
  render();
});


// Search notes
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );

  render(filteredNotes);
});


// Initial page render
render();