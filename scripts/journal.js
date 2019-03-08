//Target the submit button and assign the variable submitButton to it
const submitButton = document.getElementById("submitButton");
/*
    Main application logic that uses the functions and objects
    defined in the other JavaScript files.
*/
API.getEntries().then(parsedResponse => DOM.renderJournalEntries(parsedResponse));
/*  
    function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked. The overall purpose of this function is to post the new journal entry into the API. Then it will get the updated entries from the API and update the DOM with the new entry.
*/
submitButton.addEventListener("click", event => {
/*
    defined variables that are set equal to the input values targetted below
*/
    const entryDate = document.getElementById("journalDate").value;
    const entryConcepts = document.getElementById("conceptsCovered").value;
    const entryMain = document.getElementById("journalEntry").value;
    const entryMood = document.getElementById("moodSelect").value;
/*
    Define the keys and value for a JavaScript object that
    represents a journal entry about what you learned today
*/
    const objectsJournalEntry = {
        title: entryConcepts,
        date: entryDate,
        entry: entryMain,
        mood: entryMood
    };
/*
    Call the postEntries() method from the API object (see data.js) which adds the new journal entry to the API
    .then after the entry is posted, call the getEntries() method from the API object (see data.js) which gets the updated Array of all journal entries
    .then the parsedResponse (the entry Array) is passed as an argument to the renderJournalEntries method of the DOM object, which puts the updated Array into the DOM
*/
    API.postEntries(objectsJournalEntry)
        .then(() => API.getEntries())
        .then(parsedResponse => DOM.renderJournalEntries(parsedResponse))
/*
    Reset the input fields
*/
    document.getElementById("journalContainer").reset();
});