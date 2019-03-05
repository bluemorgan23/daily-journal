//Target the submit button and assign the variable submitButton to it
const submitButton = document.getElementById("submitButton");

//Created a blank array to store journal entries in
const allEntries = [];

//enter function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked
const enter = () => {

    //defined variables that are set equal to the input values targetted below
    const entryDate = document.getElementById("journalDate");
    const entryConcepts = document.getElementById("conceptsCovered");
    const entryMain = document.getElementById("journalEntry");
    const entryMood = document.getElementById("moodSelect");

    //target the article element in index.html in order to manipulate the DOM
    const entryLog = document.querySelector(".entryLog");

    //Define the keys and value for a JavaScript object that
    //represents a journal entry about what you learned today
    const objectsJournalEntry = {
        date: entryDate.value,
        title: entryConcepts.value,
        entry: entryMain.value,
        mood: entryMood.value
    };

    //Purpose: To create, and return, a string template that
    //represents a single journal entry object as HTML

    //Arguments: journalEntry (object)
    const makeJournalEntryComponent = (journalEntry) => {
        // Create your own HTML structure for a journal entry

        return `
            <div class="journalEntry--container">
                <h3 class="journalEntry--title">${journalEntry.title}</h3>
                <p class="journalEntry--main">${journalEntry.entry}</p>
                <p class="journalEntry--mood">I am feeling ${journalEntry.mood}</p>
                <h4 class="journalEntry--date">${journalEntry.date}</h4>
            </div>
        `
    }

    //Purpose: To render all journal entries to the DOM
    //Arguments: entries (array of objects)
    const renderJournalEntries = (entries) => {
        entryLog.innerHTML += makeJournalEntryComponent(entries);
    }

    //push the objectsJournalEntry that has been created into the array allEntries
    //render this object into the dom as well by invoking renderJournalEntries function
    allEntries.push(objectsJournalEntry);
    renderJournalEntries(objectsJournalEntry);

    //also added a reset method to the form after the values are stored and pushed into the array
    document.getElementById("journalContainer").reset();

    //the console logs the array of entries each time the button is clicked
    console.log(allEntries);
}

submitButton.addEventListener("click", enter);