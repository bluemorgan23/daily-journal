import API from "./data"
import DOM from "./entriesDom"
import ENTRYCOMP from "./entryComponent"

const buildEntryObject = (title, date, entry, moodId, instructorId) => {
    let objectsJournalEntry = {
        title: title,
        date: date,
        entry: entry,
        moodId: moodId,
        instructorId: instructorId
    };

    return objectsJournalEntry;
}

const eventHandlers = {
    submitHandler: function() {
        /*
        defined variables that are set equal to the input values targetted below
        */
        const entryDate = document.getElementById("journalDate").value;
        const entryConcepts = document.getElementById("conceptsCovered").value;
        const entryMain = document.getElementById("journalEntry").value;
        let entryMood = document.getElementById("moodSelect").value;
        const notAllowed = ["(", ")", "{", "}", ":", ";"];
        let entryInstructor = document.getElementById("instructorSelect").value;

        switch(true){
            case(entryInstructor === "Jisie David"):
                entryInstructor = 1;
                break;
            case(entryInstructor === "Kristen Norris"):
                entryInstructor = 2;
                break;
        }

        switch(true){
            case(entryMood === "Happy"):
                entryMood = 1;
                break;
            case(entryMood === "Just Okay"):
                entryMood = 2;
                break;
            case(entryMood === "Dispair"):
                entryMood = 3;
                break;
        }

        if(entryConcepts === "" || entryMain === ""){
            return alert("You Left a Field Blank");
        } if (entryMain.length > 500) {
            return alert("Your entry is too long");
        }
        notAllowed.forEach(char => {
            if (entryMain.includes(char)) {
                return alert("Illegal Characters");
        }
        })


        /*
        Call the postEntries() method from the API object (see data.js) which adds the new journal entry to the API. The factory function buildEntryObject() is passed in as a parameter.
        .then after the entry is posted, call the getEntries() method from the API object (see data.js) which gets the updated Array of all journal entries
        .then the parsedResponse (the entry Array) is passed as an argument to the renderJournalEntries method of the DOM object, which puts the updated Array into the DOM
        */
        API.postEntries(buildEntryObject(entryConcepts, entryDate, entryMain, entryMood, entryInstructor))
        /*
        Reset the input fields
        */
        document.getElementById("form").reset();
    },

    radioHandler: function() {
        const mood = event.target.value;
        API.getEntries().then(entries => entries.filter(entry => {
            if(mood === "Happy"){
                let isHappy = false;

                if(entry.mood.label === "Happy"){
                    isHappy = true;
                }
                return isHappy;
            } else if(mood === "Just Okay"){
                let isOkay = false;

                if(entry.mood.label === "Just Okay"){
                    isOkay = true;
                }
                return isOkay;
            } else if(mood === "Dispair"){
                let inDispair = false;

                if(entry.mood.label === "Dispair"){
                    inDispair = true;
                }
                return inDispair;
            }
        })).then((response) => DOM.renderJournalEntries(response));
    },

    handleDeleteButton: function() {
        let entryId = event.target.id.split("--")[1];

        API.deleteEntry(entryId).then(() => API.getEntries()).then(response => DOM.renderJournalEntries(response))
    },

    handleEditButton: function() {
        let entryId = event.target.id.split("--")[1];

        const entryArticle = document.querySelector(`#journalEntry--${entryId}`);
        let entryTitle = document.querySelector(`#journalEntry-title--${entryId}`).textContent;
        let entryMain = document.querySelector(`#journalEntry-main--${entryId}`).textContent;
        let entryInstructor = document.querySelector(`#journalEntry-instructor--${entryId}`.textContent)

        while(entryArticle.firstChild){
            entryArticle.removeChild(entryArticle.firstChild)
        };

        API.getEntries().then(entryToEdit => {
            const editForm = ENTRYCOMP.buildEditForm(entryToEdit, entryMain, entryTitle, entryInstructor);
            entryArticle.appendChild(editForm);
        })

    },
    handleUpdateButton: function() {
        let entryId = event.target.parentNode.id.split("--")[1];

        const editedEntryTitle = document.querySelector("#journalEdit-title");
        const editedEntryMain = document.querySelector("#journalEdit-main");
        const editedEntryDate = document.querySelector("#journalEdit-date");
        let editedEntryMood = document.querySelector("#mood-edit").value;
        let editedEntryInstructor = document.querySelector("#instructor-edit").value;

        switch(true){
            case(editedEntryInstructor === "Jisie David"):
                editedEntryInstructor = 1;
                break;
            case(editedEntryInstructor === "Kristen Norris"):
                editedEntryInstructor = 2;
                break;
        }

        switch(true){
            case(editedEntryMood === "Happy"):
                editedEntryMood = 1;
                break;
            case(editedEntryMood === "Just Okay"):
                editedEntryMood = 2;
                break;
            case(editedEntryMood === "Dispair"):
                editedEntryMood = 3;
                break;
        }

        let editedEntry = buildEntryObject(editedEntryTitle.value, editedEntryDate.value, editedEntryMain.value, editedEntryMood, editedEntryInstructor)

        API.putEntry(entryId, editedEntry).then(() => API.getEntries()).then(response => DOM.renderJournalEntries(response))

    },

    searchEvent: function(KeyboardEvent) {
        if(KeyboardEvent.key === "Enter"){
            let searchInputField = document.querySelector("#journalEntry-search")
            let results = [];
            const searchTerm = searchInputField.value;
            API.getEntries().then(response => response.forEach(entry => {
                if(entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)){
                    results.push(entry);
                }
                })).then(() => DOM.renderJournalEntries(results));
                searchInputField.value = "";
        }
    }
}

export default eventHandlers;