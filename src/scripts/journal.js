//Target the submit button and assign the variable submitButton to it
const submitButton = document.getElementById("submitButton");
const cachedEntries = API.getEntries();


/*
    Main application logic that uses the functions and objects
    defined in the other JavaScript files.
*/
API.getEntries().then(parsedResponse => DOM.renderJournalEntries(parsedResponse));





const deleteButtons = document.getElementsByName("delete")
deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        handleDeleteButton(button.id)
    });
})

/*
    Factory function that builds the journal entry object
*/
const buildEntryObject = (title, date, entry, mood) => {
    let objectsJournalEntry = {
        title: title,
        date: date,
        entry: entry,
        mood: mood
    };
    return objectsJournalEntry;
}
/*
    function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked. The overall purpose of this function is to post the new journal entry into the API. Then it will get the updated entries from the API and update the DOM with the new entry.
*/
submitButton.addEventListener("click", submitHandler);
document.getElementsByName("moodFilterRadio").forEach(button => {
    button.addEventListener("click", radioHandler)});


