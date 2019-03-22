/*
    Modularized version of previous code. The obj ENTRYCOMP is defined and contains the makeJournalEntryComponent(journalEntry) method expression. The purpose of this method is to build an HTML string out of the journalEntry object by passing in the values for each key. The journalEntryObject is defined in journal.js / see for reference.
*/

const buildEl = (el, text) => {
    let newEl = document.createElement(el);
    newEl.textContent = text;
    return newEl;
}

const ENTRYCOMP = {

    makeJournalEntryComponent: function(journalEntry) {
    // Create your own HTML structure for a journal entry
    const divEntryContainer = document.createElement("div");
    divEntryContainer.classList.add("journalEntry--container");
    const entryTitle = buildEl("h3", `${journalEntry.title}`);
    entryTitle.id = "journalEntry--title";
    const entryMain = buildEl("p", `${journalEntry.entry}`);
    entryMain.id = "journalEntry--main";
    const entryMood = buildEl("p",`I am feeling ${journalEntry.mood}`);
    entryMood.id = "journalEntry--mood";
    const entryDate = buildEl("p", `${journalEntry.date}`);
    entryDate.id = "journalEntry--date";
    const deleteButton = buildEl("button", "Delete Entry");
    deleteButton.id = `journalEntry--${journalEntry.id}`;
    deleteButton.classList.add("delete-entry");
    deleteButton.addEventListener("click", handleDeleteButton);
    divEntryContainer.appendChild(entryTitle);
    divEntryContainer.appendChild(entryMain);
    divEntryContainer.appendChild(entryMood);
    divEntryContainer.appendChild(entryDate);
    divEntryContainer.appendChild(deleteButton);
    return divEntryContainer;
    }
}