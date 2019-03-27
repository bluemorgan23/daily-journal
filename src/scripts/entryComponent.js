/*
    Modularized version of previous code. The obj ENTRYCOMP is defined and contains the makeJournalEntryComponent(journalEntry) method expression. The purpose of this method is to build an HTML string out of the journalEntry object by passing in the values for each key. The journalEntryObject is defined in journal.js / see for reference.
*/
import eventHandlers from "./eventHandlers"

const buildEl = (el, text, id, type, name, value) => {
    let newEl = document.createElement(el);
    newEl.textContent = text;
    if(id){
        newEl.id = id;
    }
    if(type){
        newEl.setAttribute("type", type);
    }

    if(name){
        newEl.setAttribute("name", name);
    }
    if(value){
        newEl.setAttribute("value", value);
    }
    return newEl;
}

const ENTRYCOMP = {

    makeJournalEntryComponent: function(journalEntry) {
    // Create your own HTML structure for a journal entry
    const divEntryContainer = document.createElement("div");
    divEntryContainer.classList.add("journalEntry--container");
    divEntryContainer.id = `journalEntry--${journalEntry.id}`;
    const entryTitle = buildEl("h3", `${journalEntry.title}`, `journalEntry-title--${journalEntry.id}`);
    const entryMain = buildEl("p", journalEntry.entry, `journalEntry-main--${journalEntry.id}`);
    const entryMood = buildEl("p", journalEntry.mood, `journalEntry-mood--${journalEntry.id}`);
    const entryDate = buildEl("p", `${journalEntry.date}`,`journalEntry-date--${journalEntry.id}`);
    const deleteButton = buildEl("button", "Delete Entry",`journalEntry-delete--${journalEntry.id}`);
    deleteButton.classList.add("delete-entry");
    deleteButton.addEventListener("click", eventHandlers.handleDeleteButton);
    const editButton = buildEl("button", "Edit Entry", `journalEntry-edit--${journalEntry.id}`);
    editButton.addEventListener("click", eventHandlers.handleEditButton);
    divEntryContainer.appendChild(entryTitle);
    divEntryContainer.appendChild(entryMain);
    divEntryContainer.appendChild(entryMood);
    divEntryContainer.appendChild(entryDate);
    divEntryContainer.appendChild(deleteButton);
    divEntryContainer.appendChild(editButton);
    return divEntryContainer;
    },

    buildEditForm: function(entryObject, entryMain, entryTitle) {
        let editFormFragment = document.createDocumentFragment();

        const dateFieldset = buildEl("fieldset",);
        dateFieldset.appendChild(buildEl("legend", "Date"));
        dateFieldset.appendChild(buildEl("input", undefined, "journalEdit-date", "date"));
        editFormFragment.appendChild(dateFieldset);

        const titleFieldset = buildEl("fieldset");
        titleFieldset.appendChild(buildEl("legend", "Concepts"));
        titleFieldset.appendChild(buildEl("textarea", entryTitle, "journalEdit-title"))
        editFormFragment.appendChild(titleFieldset);

        const mainFieldset = buildEl("fieldset");

        mainFieldset.appendChild(buildEl("legend", "Entry"));
        const entry = (buildEl("textarea", entryMain, "journalEdit-main"));
        entry.setAttribute("rows", "5");
        entry.setAttribute("cols", "50");
        mainFieldset.appendChild(entry);
        editFormFragment.appendChild(mainFieldset);


        const moodFieldset = buildEl("fieldset")
        moodFieldset.appendChild(buildEl("legend", "Select Mood"))
        const moodSelect = buildEl("select", undefined, "mood-edit")
        moodSelect.appendChild(buildEl("option", "Happy", undefined, undefined, undefined, "Happy"))
        moodSelect.appendChild(buildEl("option", "Just Okay", undefined, undefined, undefined, "Just Okay"))
        moodSelect.appendChild(buildEl("option", "Dispair", undefined, undefined, undefined, "Dispair"))
        moodFieldset.appendChild(moodSelect);
        editFormFragment.appendChild(moodFieldset);

        const updateEntry = buildEl("button", "Save");
        updateEntry.addEventListener("click", eventHandlers.handleUpdateButton)
        editFormFragment.appendChild(updateEntry);
        return editFormFragment;
    }
}

export default ENTRYCOMP
