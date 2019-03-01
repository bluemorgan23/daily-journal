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

//created a blank array to store journal entries in
const allEntries = [];


//defined the keys for each journal entry
const objectsJournalEntry = {
    date: entryDate,
    title: entryConcepts,
    entry: entryMain,
    mood: entryMood
};

//enter function runs when the button is clicked, storing the values of the targetted elements at the time the button is clicked
//also added a reset method to the form after the values are stored and pushed into the array
//the console logs the array of entries each time the button is clicked
const enter = () => {
    objectsJournalEntry.date = entryDate.value;
    objectsJournalEntry.title = entryConcepts.value;
    objectsJournalEntry.entry = entryMain.value;
    objectsJournalEntry.mood = entryMood.value;
    allEntries.push(objectsJournalEntry);

    document.getElementById("journalContainer").reset();
    console.log(allEntries);
}

submitButton.addEventListener("click", enter);
