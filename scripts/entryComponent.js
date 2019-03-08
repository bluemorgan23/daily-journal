/*
    Modularized version of previous code. The obj ENTRYCOMP is defined and contains the makeJournalEntryComponent(journalEntry) method expression. The purpose of this method is to build an HTML string out of the journalEntry object by passing in the values for each key. The journalEntryObject is defined in journal.js / see for reference.
*/

const ENTRYCOMP = {

    makeJournalEntryComponent: function(journalEntry) {
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
}