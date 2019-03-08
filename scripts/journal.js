//Target the submit button and assign the variable submitButton to it
const submitButton = document.getElementById("submitButton");

//Created a blank array to store journal entries in
// const allEntries = [];
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

const renderJournalEntries = (entriesArray) => {
    const entryLog = document.querySelector(".entryLog");

    entryLog.innerHTML = "";
    entriesArray.forEach(entry => {
        entryLog.innerHTML += makeJournalEntryComponent(entry);
    });

};

const getEntries = () => {
    return fetch("http://localhost:8088/allEntries")
        .then(response => response.json());
}

const postEntries = (newEntryObject) => {
    return fetch("http://localhost:8088/allEntries", {
            method: "POST",
            body: JSON.stringify(newEntryObject),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json());
}

getEntries().then(parsedResponse => renderJournalEntries(parsedResponse));


//enter function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked
submitButton.addEventListener("click", event => {

    //defined variables that are set equal to the input values targetted below
    const entryDate = document.getElementById("journalDate").value;
    const entryConcepts = document.getElementById("conceptsCovered").value;
    const entryMain = document.getElementById("journalEntry").value;
    const entryMood = document.getElementById("moodSelect").value;

    //Define the keys and value for a JavaScript object that
    //represents a journal entry about what you learned today
    const objectsJournalEntry = {
        title: entryConcepts,
        date: entryDate,
        entry: entryMain,
        mood: entryMood
    };

    postEntries(objectsJournalEntry)
        .then(() => getEntries())
        .then(parsedResponse => renderJournalEntries(parsedResponse));


    document.getElementById("journalContainer").reset();
});