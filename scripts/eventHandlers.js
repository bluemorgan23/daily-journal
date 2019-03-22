const getEntriesCached = API.getEntries();

const submitHandler = () => {
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
    } if (entryMain.length > 100) {
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
}

const radioHandler = () => {
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
}


const handleDeleteButton = () => {
    let entryId = event.target.id.split("--")[1];
    
    API.deleteEntry(entryId).then(() => API.getEntries()).then(response => DOM.renderJournalEntries(response))
}