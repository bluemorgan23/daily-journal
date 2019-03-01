/*
    Define the keys and value for a JavaScript object that
    represents a journal entry about what you learned today
*/

const entryDate = document.getElementById("journalDate");
const entryConcepts = document.getElementById("conceptsCovered");
const entryMain = document.getElementById("journalEntry");
const entryMood = document.getElementById("moodSelect");
const submitButton = document.getElementById("submitButton");
const allEntries = [];

const objectsJournalEntry = {
    date: entryDate,
    title: entryConcepts,
    entry: entryMain,
    mood: entryMood
};


const enter = () => {
    objectsJournalEntry.date = entryDate.value;
    objectsJournalEntry.title = entryConcepts.value;
    objectsJournalEntry.entry = entryMain.value;
    objectsJournalEntry.mood = entryMood.value;
    allEntries.push(objectsJournalEntry);
}



submitButton.addEventListener("click", enter);
console.log(allEntries);