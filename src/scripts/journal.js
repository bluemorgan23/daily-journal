import API from "./data"
import formHTML from "./formHTML"
import DOM from "./entriesDom"
import eventHandlers from "./eventHandlers"

formHTML.buildFormFields();
//Target the submit button and assign the variable submitButton to it
const submitButton = document.getElementById("submitButton");

API.getEntries().then(parsedResponse => DOM.renderJournalEntries(parsedResponse));


const deleteButtons = document.getElementsByName("delete")
deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        eventHandlers.handleDeleteButton(button.id)
    });
})

/*
    function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked. The overall purpose of this function is to post the new journal entry into the API. Then it will get the updated entries from the API and update the DOM with the new entry.
*/
submitButton.addEventListener("click", eventHandlers.submitHandler);
document.getElementsByName("moodFilterRadio").forEach(button => {
    button.addEventListener("click", eventHandlers.radioHandler)});


