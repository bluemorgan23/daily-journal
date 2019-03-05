/*
    Define the keys and value for a JavaScript object that
    represents a journal entry about what you learned today
*/

//defined variables that are set equal to the input values targetted below

const entryDate = document.getElementById("journalDate");
const entryConcepts = document.getElementById("conceptsCovered");
const entryMain = document.getElementById("journalEntry");
const entryMood = document.getElementById("moodSelect");
const submitButton = document.getElementById("submitButton");
const entryLog = document.querySelector(".entryLog");

//created a blank array to store journal entries in
// const allEntries = [];

//combined the object with key values with the array definition

const allEntries = [
    {
        date: entryDate,
        title: entryConcepts,
        entry: entryMain,
        mood: entryMood
    }
];
/*
    Purpose: To create, and return, a string template that
    represents a single journal entry object as HTML

    Arguments: journalEntry (object)
*/
const makeJournalEntryComponent = (journalEntry) => {
    // Create your own HTML structure for a journal entry
    return `
        <h1 class="journalEntry--title">${journalEntry.title}</h1>
        <h4 class="journalEntry--date">${journalEntry.date}</h4>
        <p class="journalEntry--main">${journalEntry.entry}</p>
        <p class="journalEntry--mood">${journalEntry.mood}</p>
    `
}

/*
    Purpose: To render all journal entries to the DOM

    Arguments: entries (array of objects)
*/

const renderJournalEntries = (entries) => {
    entryLog.innerHTML += makeJournalEntryComponent(entries);
}

// Invoke the render function
// renderJournalEntries(allEntries)

//defined the keys for each journal entry
// const objectsJournalEntry = {
//     date: entryDate,
//     title: entryConcepts,
//     entry: entryMain,
//     mood: entryMood
// };

//enter function runs when the button is clicked, storing the values of the targetted elements at the time the button is clicked
//also added a reset method to the form after the values are stored and pushed into the array
//the console logs the array of entries each time the button is clicked
const enter = () => {
    
   
    allEntries.date = entryDate.value;
    allEntries.title = entryConcepts.value;
    allEntries.entry = entryMain.value;
    allEntries.mood = entryMood.value;
    renderJournalEntries(allEntries);
    allEntries.push(this);
    

    document.getElementById("journalContainer").reset();
    console.log(allEntries);
}





submitButton.addEventListener("click", enter);
