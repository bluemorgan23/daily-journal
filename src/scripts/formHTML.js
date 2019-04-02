const formContainer = document.querySelector("#journalContainer");

const formHTML = {

    buildFormFields: function () {
        return formContainer.innerHTML = `
        <div  id="formCard" class="card bg-light">
        <h1 class="card-header bg-primary text-white">Daily Journal</h1>
        <form id="form">
            <div class="form-group">
                <label class="mb-0" for="journalDate">Select Date</label>
                <input type="date" class="form-control" name="journalDate" id="journalDate">
            </div>
            <div class="journalTitle--fieldset form-group">
             <label for="conceptsCovered">Enter Title</legend>
                <input class="form-control" type="text" name="conceptsCovered" id="conceptsCovered">
            </div>
            <div class="journalEntry--fieldset form-group">
                <label class="mb-0" for="journalEntry">Main Entry</label>
                <textarea class="form-control" name="journalEntry" id="journalEntry" cols="30" rows="10"></textarea>
            </div>
            <div class="moodSelect--fieldset form-group">
                <label class="mb-0" for="moodSelect">Select Mood</label>
                <select class="form-control" name="moodSelect" id="moodSelect">
                    <option value="Happy">Happy</option>
                    <option value="Just Okay">Just Okay</option>
                    <option value="Dispair">Dispair</option>
                </select>
            </div>
            <div class="instructorSelect--fieldset form-group">
                <label class="mb-0" for="instructorSelect">Select Instructor</label>
                <select class="form-control" name="instructorSelect" id="instructorSelect">
                    <option value="Jisie David">Jisie David</option>
                    <option value="Kristen Norris">Kristen Norris</option>
                </select>
            </div>
        <button class="btn-primary btn-sm" id="submitButton" type="button">Record Journal Entry</button>
        <section id="filterContainer">
        <div class="moodFilter form-check">
            <label class="form-check" for="moodFilterRadio">Filter Journal Entries by Mood</label>
            <input class="form-check-input" type="radio" name="moodFilterRadio" value="Happy">Happy<br>
            <input class="form-check-input" type="radio" name="moodFilterRadio" value="Just Okay">Just Okay<br>
            <input class="form-check-input" type="radio" name="moodFilterRadio" value="Dispair">Dispair<br>
        </div>
        <div class="form-group" id="searchEntries">
            <label for="journalEntry-search">Search journal entries</label>
            <input class="form-control" id="journalEntry-search" placeholder="Enter search term" type="text">
        </div>
        </section>
    </form>
    </div>
    `
    }
}

export default formHTML