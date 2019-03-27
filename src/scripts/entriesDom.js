/*
    Modularized version of previous code. Created DOM object which defines the renderJournalEntries method. This method defines the container for allEntries in the DOM. It loops through an array of entries and adds each of them to the entryLog container / renders them to the DOM. This method is to be used with API.getEntries() which returns an array as a parsedResponse.
    ENTRYCOMP.makeJournalEntryComponent(entry) creates the HTML structure that will be added to entryLog. See entryComponent.js for the function expression.
*/

import ENTRYCOMP from "./entryComponent"

const DOM = {

    renderJournalEntries: function(entriesArray) {
    const entryLog = document.querySelector(".entryLog");

    entryLog.innerHTML = "";
    entriesArray.forEach(entry => {
        entryLog.appendChild(ENTRYCOMP.makeJournalEntryComponent(entry));
    });
    }
}

export default DOM;