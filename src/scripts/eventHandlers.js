import API from "./data"
import DOM from "./entriesDom"
import ENTRYCOMP from "./entryComponent"

const buildEntryObject = (title, date, entry, mood) => {
    let objectsJournalEntry = {
        title: title,
        date: date,
        entry: entry,
        mood: mood
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
        const entryMood = document.getElementById("moodSelect").value;
        const notAllowed = ["(", ")", "{", "}", ":", ";"];

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
        API.postEntries(buildEntryObject(entryConcepts, entryDate, entryMain, entryMood))
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

                if(entry.mood === "Happy"){
                    isHappy = true;
                }
                return isHappy;
            } else if(mood === "Just Okay"){
                let isOkay = false;

                if(entry.mood === "Just Okay"){
                    isOkay = true;
                }
                return isOkay;
            } else if(mood === "Dispair"){
                let inDispair = false;

                if(entry.mood === "Dispair"){
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

        while(entryArticle.firstChild){
            entryArticle.removeChild(entryArticle.firstChild)
        };

        API.getEntries().then(entryToEdit => {
            const editForm = ENTRYCOMP.buildEditForm(entryToEdit, entryMain, entryTitle);
            entryArticle.appendChild(editForm);
        })

    },
    handleUpdateButton: function() {
        let entryId = event.target.parentNode.id.split("--")[1];

        const editedEntryTitle = document.querySelector("#journalEdit-title");
        const editedEntryMain = document.querySelector("#journalEdit-main");
        const editedEntryDate = document.querySelector("#journalEdit-date");
        const editedEntryMood = document.querySelector("#mood-edit");

        let editedEntry = buildEntryObject(editedEntryTitle.value, editedEntryDate.value, editedEntryMain.value, editedEntryMood.value)

        API.putEntry(entryId, editedEntry).then(() => API.getEntries()).then(response => DOM.renderJournalEntries(response))

    },

    searchEvent: function(KeyboardEvent) {
        if(KeyboardEvent.key === "Enter"){
            let results = [];
            const searchTerm = searchInputField.value;
            API.getEntries().then(response => response.forEach(entry => {
                if(entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)){
                    //console.log(entry);
                    results.push(entry);
                }
                })).then(() => DOM.renderJournalEntries(results));
                searchInputField.value = "";
        }
    }
}

export default eventHandlers;














// searchInputField.addEventListener("keydown", KeyboardEvent => {
//     const searchInputField = document.querySelector("#journalEntry-search");
//     if(KeyboardEvent.key === "Enter"){
//         let results = [];
//         const searchTerm = searchInputField.value;
//         API.getEntries().then(response => response.forEach(entry => {
//                 if(entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)){
//                     //console.log(entry);
//                     results.push(entry);
//             }

//         })).then(() => DOM.renderJournalEntries(results))
//         searchInputField.value = "";
//     }
// })