const formContainer = document.querySelector("#journalContainer");

const buildElementWithText = (element, text) => {
    let newEl = document.createElement(element);
    newEl.textContent = text;
    return newEl
}

const buildFormFields = () => {
    return formContainer.innerHTML = `
    <form id="form">
        <fieldset class="journalDate--fieldset">
            <legend>Select Date</legend>
            <input type="date" name="journalDate" id="journalDate">
        </fieldset>
        <fieldset class="conceptsCovered--fieldSet">
            <legend>Enter Title</legend>
            <input type="text" name="conceptsCovered" id="conceptsCovered">
        </fieldset>
        <fieldset class="journalEntry--fieldset">
            <legend>Main Entry</legend>
            <textarea name="journalEntry" id="journalEntry" cols="30" rows="10"></textarea>
        </fieldset>
        <fieldset class="moodSelect--fieldset">
            <legend>Select Mood</legend>
            <select name="moodSelect" id="moodSelect">
                <option value="Happy">Happy</option>
                <option value="Just Okay">Just Okay</option>
                <option value="Dispair">Dispair</option>
            </select>
        </fieldset>
        <button id="submitButton" type="button">Record Journal Entry</button>
    </form>
    <hr/>
    <section id="filterSection">
        <fieldset class="moodFilter">
            <legend>Filter Journal Entries by Mood</legend>
            <input type="radio" name="moodFilterRadio" value="Happy">Happy<br>
            <input type="radio" name="moodFilterRadio" value="Just Okay">Just Okay<br>
            <input type="radio" name="moodFilterRadio" value="Dispair">Dispair<br>
        </fieldset>
        <fieldset id="searchEntries">
            <legend>Search journal entries</legend>
            <input placeholder="Enter search term" type="text">
        </fieldset>
    </section>
    `
}

buildFormFields();