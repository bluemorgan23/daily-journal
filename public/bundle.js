(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entriesDom = _interopRequireDefault(require("./entriesDom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    Modularized version of former code. Created the API object that defines two methods, getEntries and postEntries.
    getEntries pulls the entries from the API with a fetch call
    postEntries will post a new to the API
*/
const url = "http://localhost:8088/allEntries";
const API = {
  getEntries: function () {
    return fetch(`${url}/?_expand=mood&_expand=instructor`).then(response => response.json());
  },
  postEntries: function (newEntryObject) {
    return fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify(newEntryObject),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => API.getEntries()).then(response => _entriesDom.default.renderJournalEntries(response));
  },
  deleteEntry: function (entryId) {
    return fetch(`${url}/${entryId}`, {
      method: "DELETE"
    });
  },
  putEntry: function (entryId, updatedEntryObject) {
    return fetch(`${url}/${entryId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updatedEntryObject)
    });
  },
  patchEntry: function (entryId, updatedEntryObject) {
    return fetch(`${url}/${entryId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(updatedEntryObject)
    });
  }
};
var _default = API;
exports.default = _default;

},{"./entriesDom":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entryComponent = _interopRequireDefault(require("./entryComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    Modularized version of previous code. Created DOM object which defines the renderJournalEntries method. This method defines the container for allEntries in the DOM. It loops through an array of entries and adds each of them to the entryLog container / renders them to the DOM. This method is to be used with API.getEntries() which returns an array as a parsedResponse.
    ENTRYCOMP.makeJournalEntryComponent(entry) creates the HTML structure that will be added to entryLog. See entryComponent.js for the function expression.
*/
const DOM = {
  renderJournalEntries: function (entriesArray) {
    const entryLog = document.querySelector(".entryLog");
    entryLog.innerHTML = "";
    entriesArray.forEach(entry => {
      entryLog.appendChild(_entryComponent.default.makeJournalEntryComponent(entry));
    });
  }
};
var _default = DOM;
exports.default = _default;

},{"./entryComponent":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventHandlers = _interopRequireDefault(require("./eventHandlers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    Modularized version of previous code. The obj ENTRYCOMP is defined and contains the makeJournalEntryComponent(journalEntry) method expression. The purpose of this method is to build an HTML string out of the journalEntry object by passing in the values for each key. The journalEntryObject is defined in journal.js / see for reference.
*/
const buildEl = (el, text, id, type, name, value) => {
  let newEl = document.createElement(el);
  newEl.textContent = text;

  if (id) {
    newEl.id = id;
  }

  if (type) {
    newEl.setAttribute("type", type);
  }

  if (name) {
    newEl.setAttribute("name", name);
  }

  if (value) {
    newEl.setAttribute("value", value);
  }

  return newEl;
};

const ENTRYCOMP = {
  makeJournalEntryComponent: function (journalEntry) {
    // Create your own HTML structure for a journal entry
    const divEntryContainer = document.createElement("div");
    divEntryContainer.classList.add("journalEntry--container");
    divEntryContainer.classList.add("card");
    divEntryContainer.classList.add("bg-light");
    divEntryContainer.id = `journalEntry--${journalEntry.id}`;
    const entryTitle = buildEl("h3", `${journalEntry.title}`, `journalEntry-title--${journalEntry.id}`);
    entryTitle.classList.add("card-header");
    entryTitle.classList.add("mb-3");
    const entryMain = buildEl("p", journalEntry.entry, `journalEntry-main--${journalEntry.id}`);
    entryMain.classList.add("card-text");
    const entryMood = buildEl("p", journalEntry.mood.label, `journalEntry-mood--${journalEntry.id}`);
    entryMood.classList.add("card-text");
    const entryDate = buildEl("p", `${journalEntry.date}`, `journalEntry-date--${journalEntry.id}`);
    entryDate.classList.add("card-text");
    const entryInstructor = buildEl("p", `Instructor: ${journalEntry.instructor.firstName} ${journalEntry.instructor.lastName}`);
    entryInstructor.classList.add("card-text");
    const buttonContainer = buildEl("div");
    buttonContainer.classList.add("mb-1");
    buttonContainer.classList.add("button-group");
    const deleteButton = buildEl("button", "Delete Entry", `journalEntry-delete--${journalEntry.id}`);
    deleteButton.classList.add("delete-entry");
    deleteButton.classList.add("btn-danger");
    deleteButton.classList.add("btn-sm");
    deleteButton.classList.add("ml-1");
    deleteButton.addEventListener("click", _eventHandlers.default.handleDeleteButton);
    const editButton = buildEl("button", "Edit Entry", `journalEntry-edit--${journalEntry.id}`);
    editButton.classList.add("btn-warning");
    editButton.classList.add("btn-sm");
    editButton.addEventListener("click", _eventHandlers.default.handleEditButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    divEntryContainer.appendChild(entryTitle);
    divEntryContainer.appendChild(entryMain);
    divEntryContainer.appendChild(entryMood);
    divEntryContainer.appendChild(entryDate);
    divEntryContainer.appendChild(entryInstructor);
    divEntryContainer.appendChild(buttonContainer);
    return divEntryContainer;
  },
  buildEditForm: function (entryObject, entryMain, entryTitle) {
    let editFormFragment = document.createDocumentFragment();
    const dateFieldset = buildEl("div");
    dateFieldset.classList.add("card-text");
    dateFieldset.classList.add("bg-light");
    const editDateLabel = dateFieldset.appendChild(buildEl("label", "Date"));
    editDateLabel.classList.add("card-text");
    const editDate = dateFieldset.appendChild(buildEl("input", undefined, "journalEdit-date", "date"));
    editFormFragment.appendChild(dateFieldset);
    const titleFieldset = buildEl("fieldset");
    titleFieldset.appendChild(buildEl("legend", "Concepts"));
    titleFieldset.appendChild(buildEl("textarea", entryTitle, "journalEdit-title"));
    editFormFragment.appendChild(titleFieldset);
    const mainFieldset = buildEl("fieldset");
    mainFieldset.appendChild(buildEl("legend", "Entry"));
    const entry = buildEl("textarea", entryMain, "journalEdit-main");
    entry.setAttribute("rows", "5");
    entry.setAttribute("cols", "50");
    mainFieldset.appendChild(entry);
    editFormFragment.appendChild(mainFieldset);
    const moodFieldset = buildEl("fieldset");
    moodFieldset.appendChild(buildEl("legend", "Select Mood"));
    const moodSelect = buildEl("select", undefined, "mood-edit");
    moodSelect.appendChild(buildEl("option", "Happy", undefined, undefined, undefined, "Happy"));
    moodSelect.appendChild(buildEl("option", "Just Okay", undefined, undefined, undefined, "Just Okay"));
    moodSelect.appendChild(buildEl("option", "Dispair", undefined, undefined, undefined, "Dispair"));
    moodFieldset.appendChild(moodSelect);
    editFormFragment.appendChild(moodFieldset);
    const instructorFieldset = buildEl("fieldset");
    instructorFieldset.appendChild(buildEl("legend", "Select Instructor"));
    const instructorSelect = buildEl("select", undefined, "instructor-edit");
    instructorSelect.appendChild(buildEl("option", "Jisie David", undefined, undefined, undefined, "Jisie David"));
    instructorSelect.appendChild(buildEl("option", "Kristen Norris", undefined, undefined, undefined, "Kristen Norris"));
    instructorFieldset.appendChild(instructorSelect);
    editFormFragment.appendChild(instructorFieldset);
    const updateEntry = buildEl("button", "Save");
    updateEntry.addEventListener("click", _eventHandlers.default.handleUpdateButton);
    editFormFragment.appendChild(updateEntry);
    return editFormFragment;
  }
};
var _default = ENTRYCOMP;
exports.default = _default;

},{"./eventHandlers":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = _interopRequireDefault(require("./data"));

var _entriesDom = _interopRequireDefault(require("./entriesDom"));

var _entryComponent = _interopRequireDefault(require("./entryComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const buildEntryObject = (title, date, entry, moodId, instructorId) => {
  let objectsJournalEntry = {
    title: title,
    date: date,
    entry: entry,
    moodId: moodId,
    instructorId: instructorId
  };
  return objectsJournalEntry;
};

const eventHandlers = {
  submitHandler: function () {
    /*
    defined variables that are set equal to the input values targetted below
    */
    const entryDate = document.getElementById("journalDate").value;
    const entryConcepts = document.getElementById("conceptsCovered").value;
    const entryMain = document.getElementById("journalEntry").value;
    let entryMood = document.getElementById("moodSelect").value;
    const notAllowed = ["(", ")", "{", "}", ":", ";"];
    let entryInstructor = document.getElementById("instructorSelect").value;

    switch (true) {
      case entryInstructor === "Jisie David":
        entryInstructor = 1;
        break;

      case entryInstructor === "Kristen Norris":
        entryInstructor = 2;
        break;
    }

    switch (true) {
      case entryMood === "Happy":
        entryMood = 1;
        break;

      case entryMood === "Just Okay":
        entryMood = 2;
        break;

      case entryMood === "Dispair":
        entryMood = 3;
        break;
    }

    if (entryConcepts === "" || entryMain === "") {
      return alert("You Left a Field Blank");
    }

    if (entryMain.length > 500) {
      return alert("Your entry is too long");
    }

    notAllowed.forEach(char => {
      if (entryMain.includes(char)) {
        return alert("Illegal Characters");
      }
    });
    /*
    Call the postEntries() method from the API object (see data.js) which adds the new journal entry to the API. The factory function buildEntryObject() is passed in as a parameter.
    .then after the entry is posted, call the getEntries() method from the API object (see data.js) which gets the updated Array of all journal entries
    .then the parsedResponse (the entry Array) is passed as an argument to the renderJournalEntries method of the DOM object, which puts the updated Array into the DOM
    */

    _data.default.postEntries(buildEntryObject(entryConcepts, entryDate, entryMain, entryMood, entryInstructor));
    /*
    Reset the input fields
    */


    document.getElementById("form").reset();
  },
  radioHandler: function () {
    const mood = event.target.value;

    _data.default.getEntries().then(entries => entries.filter(entry => {
      if (mood === "Happy") {
        let isHappy = false;

        if (entry.mood.label === "Happy") {
          isHappy = true;
        }

        return isHappy;
      } else if (mood === "Just Okay") {
        let isOkay = false;

        if (entry.mood.label === "Just Okay") {
          isOkay = true;
        }

        return isOkay;
      } else if (mood === "Dispair") {
        let inDispair = false;

        if (entry.mood.label === "Dispair") {
          inDispair = true;
        }

        return inDispair;
      }
    })).then(response => _entriesDom.default.renderJournalEntries(response));
  },
  handleDeleteButton: function () {
    let entryId = event.target.id.split("--")[1];

    _data.default.deleteEntry(entryId).then(() => _data.default.getEntries()).then(response => _entriesDom.default.renderJournalEntries(response));
  },
  handleEditButton: function () {
    let entryId = event.target.id.split("--")[1];
    const entryArticle = document.querySelector(`#journalEntry--${entryId}`);
    let entryTitle = document.querySelector(`#journalEntry-title--${entryId}`).textContent;
    let entryMain = document.querySelector(`#journalEntry-main--${entryId}`).textContent;
    let entryInstructor = document.querySelector(`#journalEntry-instructor--${entryId}`.textContent);

    while (entryArticle.firstChild) {
      entryArticle.removeChild(entryArticle.firstChild);
    }

    ;

    _data.default.getEntries().then(entryToEdit => {
      const editForm = _entryComponent.default.buildEditForm(entryToEdit, entryMain, entryTitle, entryInstructor);

      entryArticle.appendChild(editForm);
    });
  },
  handleUpdateButton: function () {
    let entryId = event.target.parentNode.id.split("--")[1];
    const editedEntryTitle = document.querySelector("#journalEdit-title");
    const editedEntryMain = document.querySelector("#journalEdit-main");
    const editedEntryDate = document.querySelector("#journalEdit-date");
    let editedEntryMood = document.querySelector("#mood-edit").value;
    let editedEntryInstructor = document.querySelector("#instructor-edit").value;

    switch (true) {
      case editedEntryInstructor === "Jisie David":
        editedEntryInstructor = 1;
        break;

      case editedEntryInstructor === "Kristen Norris":
        editedEntryInstructor = 2;
        break;
    }

    switch (true) {
      case editedEntryMood === "Happy":
        editedEntryMood = 1;
        break;

      case editedEntryMood === "Just Okay":
        editedEntryMood = 2;
        break;

      case editedEntryMood === "Dispair":
        editedEntryMood = 3;
        break;
    }

    let editedEntry = buildEntryObject(editedEntryTitle.value, editedEntryDate.value, editedEntryMain.value, editedEntryMood, editedEntryInstructor);

    _data.default.putEntry(entryId, editedEntry).then(() => _data.default.getEntries()).then(response => _entriesDom.default.renderJournalEntries(response));
  },
  searchEvent: function (KeyboardEvent) {
    if (KeyboardEvent.key === "Enter") {
      let searchInputField = document.querySelector("#journalEntry-search");
      let results = [];
      const searchTerm = searchInputField.value;

      _data.default.getEntries().then(response => response.forEach(entry => {
        if (entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)) {
          results.push(entry);
        }
      })).then(() => _entriesDom.default.renderJournalEntries(results));

      searchInputField.value = "";
    }
  }
};
var _default = eventHandlers;
exports.default = _default;

},{"./data":1,"./entriesDom":2,"./entryComponent":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
    `;
  }
};
var _default = formHTML;
exports.default = _default;

},{}],6:[function(require,module,exports){
"use strict";

var _data = _interopRequireDefault(require("./data"));

var _formHTML = _interopRequireDefault(require("./formHTML"));

var _entriesDom = _interopRequireDefault(require("./entriesDom"));

var _eventHandlers = _interopRequireDefault(require("./eventHandlers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_formHTML.default.buildFormFields(); //Target the submit button and assign the variable submitButton to it


const submitButton = document.getElementById("submitButton");

_data.default.getEntries().then(parsedResponse => _entriesDom.default.renderJournalEntries(parsedResponse));

const deleteButtons = document.getElementsByName("delete");
deleteButtons.forEach(button => {
  button.addEventListener("click", () => {
    _eventHandlers.default.handleDeleteButton(button.id);
  });
});
/*
    function runs when the button is clicked, storing the values of the targetted elements in the input form at the time the button is clicked. The overall purpose of this function is to post the new journal entry into the API. Then it will get the updated entries from the API and update the DOM with the new entry.
*/

submitButton.addEventListener("click", _eventHandlers.default.submitHandler);
document.getElementsByName("moodFilterRadio").forEach(button => {
  button.addEventListener("click", _eventHandlers.default.radioHandler);
});
document.querySelector("#journalEntry-search").addEventListener("keydown", _eventHandlers.default.searchEvent);

},{"./data":1,"./entriesDom":2,"./eventHandlers":4,"./formHTML":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNEb20uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9ldmVudEhhbmRsZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtSFRNTC5qcyIsIi4uL3NjcmlwdHMvam91cm5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNLQTs7OztBQUxBOzs7OztBQU1BLE1BQU0sR0FBRyxHQUFHLGtDQUFaO0FBRUEsTUFBTSxHQUFHLEdBQUc7QUFFUixFQUFBLFVBQVUsRUFBRSxZQUFXO0FBQ3ZCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxtQ0FBUixDQUFMLENBQ0YsSUFERSxDQUNHLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQURmLENBQVA7QUFFQyxHQUxPO0FBT1IsRUFBQSxXQUFXLEVBQUUsVUFBUyxjQUFULEVBQXlCO0FBQ2xDLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxFQUFSLEVBQVc7QUFDZixNQUFBLE1BQU0sRUFBRSxNQURPO0FBRWYsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLENBRlM7QUFHZixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYO0FBSE0sS0FBWCxDQUFMLENBT0YsSUFQRSxDQU9HLE1BQU0sR0FBRyxDQUFDLFVBQUosRUFQVCxFQVFGLElBUkUsQ0FRRyxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FSZixDQUFQO0FBU0gsR0FqQk87QUFtQlIsRUFBQSxXQUFXLEVBQUUsVUFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxJQUFHLE9BQVEsRUFBbkIsRUFBc0I7QUFDOUIsTUFBQSxNQUFNLEVBQUU7QUFEc0IsS0FBdEIsQ0FBWjtBQUdILEdBdkJP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QUEsZUFBZSxFQUFFLFlBQVk7QUFDekIsV0FBTyxhQUFhLENBQUMsU0FBZCxHQUEyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUFsQztBQStDSDtBQWxEWSxDQUFqQjtlQXFEZSxROzs7Ozs7QUN2RGY7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxrQkFBUyxlQUFULEcsQ0FDQTs7O0FBQ0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBckI7O0FBRUEsY0FBSSxVQUFKLEdBQWlCLElBQWpCLENBQXNCLGNBQWMsSUFBSSxvQkFBSSxvQkFBSixDQUF5QixjQUF6QixDQUF4Qzs7QUFHQSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsaUJBQVQsQ0FBMkIsUUFBM0IsQ0FBdEI7QUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQixNQUFNLElBQUk7QUFDNUIsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBTTtBQUNuQywyQkFBYyxrQkFBZCxDQUFpQyxNQUFNLENBQUMsRUFBeEM7QUFDSCxHQUZEO0FBR0gsQ0FKRDtBQU1BOzs7O0FBR0EsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLHVCQUFjLGFBQXJEO0FBQ0EsUUFBUSxDQUFDLGlCQUFULENBQTJCLGlCQUEzQixFQUE4QyxPQUE5QyxDQUFzRCxNQUFNLElBQUk7QUFDNUQsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsdUJBQWMsWUFBL0M7QUFBNkQsQ0FEakU7QUFHQSxRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsRUFBK0MsZ0JBQS9DLENBQWdFLFNBQWhFLEVBQTJFLHVCQUFjLFdBQXpGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIGZvcm1lciBjb2RlLiBDcmVhdGVkIHRoZSBBUEkgb2JqZWN0IHRoYXQgZGVmaW5lcyB0d28gbWV0aG9kcywgZ2V0RW50cmllcyBhbmQgcG9zdEVudHJpZXMuXG4gICAgZ2V0RW50cmllcyBwdWxscyB0aGUgZW50cmllcyBmcm9tIHRoZSBBUEkgd2l0aCBhIGZldGNoIGNhbGxcbiAgICBwb3N0RW50cmllcyB3aWxsIHBvc3QgYSBuZXcgdG8gdGhlIEFQSVxuKi9cbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9hbGxFbnRyaWVzXCI7XG5cbmNvbnN0IEFQSSA9IHtcblxuICAgIGdldEVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9Lz9fZXhwYW5kPW1vb2QmX2V4cGFuZD1pbnN0cnVjdG9yYClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbiAgICB9LFxuXG4gICAgcG9zdEVudHJpZXM6IGZ1bmN0aW9uKG5ld0VudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkobmV3RW50cnlPYmplY3QpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpO1xuICAgIH0sXG5cbiAgICBkZWxldGVFbnRyeTogZnVuY3Rpb24oZW50cnlJZCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2VudHJ5SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIHB1dEVudHJ5OiBmdW5jdGlvbihlbnRyeUlkLCB1cGRhdGVkRW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtlbnRyeUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgcGF0Y2hFbnRyeTogZnVuY3Rpb24oZW50cnlJZCwgdXBkYXRlZEVudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7ZW50cnlJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsIi8qXG4gICAgTW9kdWxhcml6ZWQgdmVyc2lvbiBvZiBwcmV2aW91cyBjb2RlLiBDcmVhdGVkIERPTSBvYmplY3Qgd2hpY2ggZGVmaW5lcyB0aGUgcmVuZGVySm91cm5hbEVudHJpZXMgbWV0aG9kLiBUaGlzIG1ldGhvZCBkZWZpbmVzIHRoZSBjb250YWluZXIgZm9yIGFsbEVudHJpZXMgaW4gdGhlIERPTS4gSXQgbG9vcHMgdGhyb3VnaCBhbiBhcnJheSBvZiBlbnRyaWVzIGFuZCBhZGRzIGVhY2ggb2YgdGhlbSB0byB0aGUgZW50cnlMb2cgY29udGFpbmVyIC8gcmVuZGVycyB0aGVtIHRvIHRoZSBET00uIFRoaXMgbWV0aG9kIGlzIHRvIGJlIHVzZWQgd2l0aCBBUEkuZ2V0RW50cmllcygpIHdoaWNoIHJldHVybnMgYW4gYXJyYXkgYXMgYSBwYXJzZWRSZXNwb25zZS5cbiAgICBFTlRSWUNPTVAubWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChlbnRyeSkgY3JlYXRlcyB0aGUgSFRNTCBzdHJ1Y3R1cmUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIGVudHJ5TG9nLiBTZWUgZW50cnlDb21wb25lbnQuanMgZm9yIHRoZSBmdW5jdGlvbiBleHByZXNzaW9uLlxuKi9cblxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IERPTSA9IHtcblxuICAgIHJlbmRlckpvdXJuYWxFbnRyaWVzOiBmdW5jdGlvbihlbnRyaWVzQXJyYXkpIHtcbiAgICBjb25zdCBlbnRyeUxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW50cnlMb2dcIik7XG5cbiAgICBlbnRyeUxvZy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGVudHJpZXNBcnJheS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgZW50cnlMb2cuYXBwZW5kQ2hpbGQoRU5UUllDT01QLm1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoZW50cnkpKTtcbiAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTTsiLCIvKlxuICAgIE1vZHVsYXJpemVkIHZlcnNpb24gb2YgcHJldmlvdXMgY29kZS4gVGhlIG9iaiBFTlRSWUNPTVAgaXMgZGVmaW5lZCBhbmQgY29udGFpbnMgdGhlIG1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoam91cm5hbEVudHJ5KSBtZXRob2QgZXhwcmVzc2lvbi4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gYnVpbGQgYW4gSFRNTCBzdHJpbmcgb3V0IG9mIHRoZSBqb3VybmFsRW50cnkgb2JqZWN0IGJ5IHBhc3NpbmcgaW4gdGhlIHZhbHVlcyBmb3IgZWFjaCBrZXkuIFRoZSBqb3VybmFsRW50cnlPYmplY3QgaXMgZGVmaW5lZCBpbiBqb3VybmFsLmpzIC8gc2VlIGZvciByZWZlcmVuY2UuXG4qL1xuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmNvbnN0IGJ1aWxkRWwgPSAoZWwsIHRleHQsIGlkLCB0eXBlLCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBuZXdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIG5ld0VsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBpZihpZCl7XG4gICAgICAgIG5ld0VsLmlkID0gaWQ7XG4gICAgfVxuICAgIGlmKHR5cGUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGUpO1xuICAgIH1cblxuICAgIGlmKG5hbWUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIG5hbWUpO1xuICAgIH1cbiAgICBpZih2YWx1ZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0VsO1xufVxuXG5jb25zdCBFTlRSWUNPTVAgPSB7XG5cbiAgICBtYWtlSm91cm5hbEVudHJ5Q29tcG9uZW50OiBmdW5jdGlvbihqb3VybmFsRW50cnkpIHtcbiAgICAvLyBDcmVhdGUgeW91ciBvd24gSFRNTCBzdHJ1Y3R1cmUgZm9yIGEgam91cm5hbCBlbnRyeVxuICAgIGNvbnN0IGRpdkVudHJ5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiam91cm5hbEVudHJ5LS1jb250YWluZXJcIik7XG4gICAgZGl2RW50cnlDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XG4gICAgZGl2RW50cnlDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImJnLWxpZ2h0XCIpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmlkID0gYGpvdXJuYWxFbnRyeS0tJHtqb3VybmFsRW50cnkuaWR9YDtcbiAgICBjb25zdCBlbnRyeVRpdGxlID0gYnVpbGRFbChcImgzXCIsIGAke2pvdXJuYWxFbnRyeS50aXRsZX1gLCBgam91cm5hbEVudHJ5LXRpdGxlLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBlbnRyeVRpdGxlLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWhlYWRlclwiKVxuICAgIGVudHJ5VGl0bGUuY2xhc3NMaXN0LmFkZChcIm1iLTNcIilcbiAgICBjb25zdCBlbnRyeU1haW4gPSBidWlsZEVsKFwicFwiLCBqb3VybmFsRW50cnkuZW50cnksIGBqb3VybmFsRW50cnktbWFpbi0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZW50cnlNYWluLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIik7XG4gICAgY29uc3QgZW50cnlNb29kID0gYnVpbGRFbChcInBcIiwgam91cm5hbEVudHJ5Lm1vb2QubGFiZWwsIGBqb3VybmFsRW50cnktbW9vZC0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZW50cnlNb29kLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIik7XG4gICAgY29uc3QgZW50cnlEYXRlID0gYnVpbGRFbChcInBcIiwgYCR7am91cm5hbEVudHJ5LmRhdGV9YCxgam91cm5hbEVudHJ5LWRhdGUtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGVudHJ5RGF0ZS5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgIGNvbnN0IGVudHJ5SW5zdHJ1Y3RvciA9IGJ1aWxkRWwoXCJwXCIsIGBJbnN0cnVjdG9yOiAke2pvdXJuYWxFbnRyeS5pbnN0cnVjdG9yLmZpcnN0TmFtZX0gJHtqb3VybmFsRW50cnkuaW5zdHJ1Y3Rvci5sYXN0TmFtZX1gKVxuICAgIGVudHJ5SW5zdHJ1Y3Rvci5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGJ1aWxkRWwoXCJkaXZcIik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtYi0xXCIpO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uLWdyb3VwXCIpO1xuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGJ1aWxkRWwoXCJidXR0b25cIiwgXCJEZWxldGUgRW50cnlcIixgam91cm5hbEVudHJ5LWRlbGV0ZS0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJkZWxldGUtZW50cnlcIik7XG4gICAgZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tZGFuZ2VyXCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuLXNtXCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibWwtMVwiKTtcbiAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKTtcbiAgICBjb25zdCBlZGl0QnV0dG9uID0gYnVpbGRFbChcImJ1dHRvblwiLCBcIkVkaXQgRW50cnlcIiwgYGpvdXJuYWxFbnRyeS1lZGl0LS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBlZGl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4td2FybmluZ1wiKVxuICAgIGVkaXRCdXR0b24uY2xhc3NMaXN0LmFkZChcImJ0bi1zbVwiKVxuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRWRpdEJ1dHRvbik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGVkaXRCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5VGl0bGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5TWFpbik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlNb29kKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeURhdGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5SW5zdHJ1Y3Rvcik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKTtcbiAgICByZXR1cm4gZGl2RW50cnlDb250YWluZXI7XG4gICAgfSxcblxuICAgIGJ1aWxkRWRpdEZvcm06IGZ1bmN0aW9uKGVudHJ5T2JqZWN0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpIHtcbiAgICAgICAgbGV0IGVkaXRGb3JtRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZpZWxkc2V0ID0gYnVpbGRFbChcImRpdlwiLCk7XG4gICAgICAgIGRhdGVGaWVsZHNldC5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgICAgICBkYXRlRmllbGRzZXQuY2xhc3NMaXN0LmFkZChcImJnLWxpZ2h0XCIpO1xuICAgICAgICBjb25zdCBlZGl0RGF0ZUxhYmVsID0gZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsYWJlbFwiLCBcIkRhdGVcIikpO1xuICAgICAgICBlZGl0RGF0ZUxhYmVsLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIik7XG4gICAgICAgIGNvbnN0IGVkaXREYXRlID0gZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJpbnB1dFwiLCB1bmRlZmluZWQsIFwiam91cm5hbEVkaXQtZGF0ZVwiLCBcImRhdGVcIikpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGRhdGVGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdGl0bGVGaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgdGl0bGVGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiQ29uY2VwdHNcIikpO1xuICAgICAgICB0aXRsZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJ0ZXh0YXJlYVwiLCBlbnRyeVRpdGxlLCBcImpvdXJuYWxFZGl0LXRpdGxlXCIpKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHRpdGxlRmllbGRzZXQpO1xuXG4gICAgICAgIGNvbnN0IG1haW5GaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcblxuICAgICAgICBtYWluRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcImxlZ2VuZFwiLCBcIkVudHJ5XCIpKTtcbiAgICAgICAgY29uc3QgZW50cnkgPSAoYnVpbGRFbChcInRleHRhcmVhXCIsIGVudHJ5TWFpbiwgXCJqb3VybmFsRWRpdC1tYWluXCIpKTtcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwicm93c1wiLCBcIjVcIik7XG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcImNvbHNcIiwgXCI1MFwiKTtcbiAgICAgICAgbWFpbkZpZWxkc2V0LmFwcGVuZENoaWxkKGVudHJ5KTtcbiAgICAgICAgZWRpdEZvcm1GcmFnbWVudC5hcHBlbmRDaGlsZChtYWluRmllbGRzZXQpO1xuXG5cbiAgICAgICAgY29uc3QgbW9vZEZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIG1vb2RGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IE1vb2RcIikpXG4gICAgICAgIGNvbnN0IG1vb2RTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJtb29kLWVkaXRcIilcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSGFwcHlcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJIYXBweVwiKSlcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSnVzdCBPa2F5XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiSnVzdCBPa2F5XCIpKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJEaXNwYWlyXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiRGlzcGFpclwiKSlcbiAgICAgICAgbW9vZEZpZWxkc2V0LmFwcGVuZENoaWxkKG1vb2RTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKG1vb2RGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgaW5zdHJ1Y3RvckZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIGluc3RydWN0b3JGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IEluc3RydWN0b3JcIikpXG4gICAgICAgIGNvbnN0IGluc3RydWN0b3JTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJpbnN0cnVjdG9yLWVkaXRcIilcbiAgICAgICAgaW5zdHJ1Y3RvclNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSmlzaWUgRGF2aWRcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJKaXNpZSBEYXZpZFwiKSlcbiAgICAgICAgaW5zdHJ1Y3RvclNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiS3Jpc3RlbiBOb3JyaXNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJLcmlzdGVuIE5vcnJpc1wiKSlcbiAgICAgICAgaW5zdHJ1Y3RvckZpZWxkc2V0LmFwcGVuZENoaWxkKGluc3RydWN0b3JTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGluc3RydWN0b3JGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlRW50cnkgPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiU2F2ZVwiKTtcbiAgICAgICAgdXBkYXRlRW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlVXBkYXRlQnV0dG9uKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHVwZGF0ZUVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGVkaXRGb3JtRnJhZ21lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFTlRSWUNPTVBcbiIsImltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IGJ1aWxkRW50cnlPYmplY3QgPSAodGl0bGUsIGRhdGUsIGVudHJ5LCBtb29kSWQsIGluc3RydWN0b3JJZCkgPT4ge1xuICAgIGxldCBvYmplY3RzSm91cm5hbEVudHJ5ID0ge1xuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgIGVudHJ5OiBlbnRyeSxcbiAgICAgICAgbW9vZElkOiBtb29kSWQsXG4gICAgICAgIGluc3RydWN0b3JJZDogaW5zdHJ1Y3RvcklkXG4gICAgfTtcblxuICAgIHJldHVybiBvYmplY3RzSm91cm5hbEVudHJ5O1xufVxuXG5jb25zdCBldmVudEhhbmRsZXJzID0ge1xuICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKlxuICAgICAgICBkZWZpbmVkIHZhcmlhYmxlcyB0aGF0IGFyZSBzZXQgZXF1YWwgdG8gdGhlIGlucHV0IHZhbHVlcyB0YXJnZXR0ZWQgYmVsb3dcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZW50cnlEYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsRGF0ZVwiKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZW50cnlDb25jZXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29uY2VwdHNDb3ZlcmVkXCIpLnZhbHVlO1xuICAgICAgICBjb25zdCBlbnRyeU1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWxFbnRyeVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGVudHJ5TW9vZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9vZFNlbGVjdFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3Qgbm90QWxsb3dlZCA9IFtcIihcIiwgXCIpXCIsIFwie1wiLCBcIn1cIiwgXCI6XCIsIFwiO1wiXTtcbiAgICAgICAgbGV0IGVudHJ5SW5zdHJ1Y3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zdHJ1Y3RvclNlbGVjdFwiKS52YWx1ZTtcblxuICAgICAgICBzd2l0Y2godHJ1ZSl7XG4gICAgICAgICAgICBjYXNlKGVudHJ5SW5zdHJ1Y3RvciA9PT0gXCJKaXNpZSBEYXZpZFwiKTpcbiAgICAgICAgICAgICAgICBlbnRyeUluc3RydWN0b3IgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlbnRyeUluc3RydWN0b3IgPT09IFwiS3Jpc3RlbiBOb3JyaXNcIik6XG4gICAgICAgICAgICAgICAgZW50cnlJbnN0cnVjdG9yID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZW50cnlNb29kID09PSBcIkhhcHB5XCIpOlxuICAgICAgICAgICAgICAgIGVudHJ5TW9vZCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVudHJ5TW9vZCA9PT0gXCJKdXN0IE9rYXlcIik6XG4gICAgICAgICAgICAgICAgZW50cnlNb29kID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZW50cnlNb29kID09PSBcIkRpc3BhaXJcIik6XG4gICAgICAgICAgICAgICAgZW50cnlNb29kID0gMztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGVudHJ5Q29uY2VwdHMgPT09IFwiXCIgfHwgZW50cnlNYWluID09PSBcIlwiKXtcbiAgICAgICAgICAgIHJldHVybiBhbGVydChcIllvdSBMZWZ0IGEgRmllbGQgQmxhbmtcIik7XG4gICAgICAgIH0gaWYgKGVudHJ5TWFpbi5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICAgIHJldHVybiBhbGVydChcIllvdXIgZW50cnkgaXMgdG9vIGxvbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgbm90QWxsb3dlZC5mb3JFYWNoKGNoYXIgPT4ge1xuICAgICAgICAgICAgaWYgKGVudHJ5TWFpbi5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydChcIklsbGVnYWwgQ2hhcmFjdGVyc1wiKTtcbiAgICAgICAgfVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgLypcbiAgICAgICAgQ2FsbCB0aGUgcG9zdEVudHJpZXMoKSBtZXRob2QgZnJvbSB0aGUgQVBJIG9iamVjdCAoc2VlIGRhdGEuanMpIHdoaWNoIGFkZHMgdGhlIG5ldyBqb3VybmFsIGVudHJ5IHRvIHRoZSBBUEkuIFRoZSBmYWN0b3J5IGZ1bmN0aW9uIGJ1aWxkRW50cnlPYmplY3QoKSBpcyBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXIuXG4gICAgICAgIC50aGVuIGFmdGVyIHRoZSBlbnRyeSBpcyBwb3N0ZWQsIGNhbGwgdGhlIGdldEVudHJpZXMoKSBtZXRob2QgZnJvbSB0aGUgQVBJIG9iamVjdCAoc2VlIGRhdGEuanMpIHdoaWNoIGdldHMgdGhlIHVwZGF0ZWQgQXJyYXkgb2YgYWxsIGpvdXJuYWwgZW50cmllc1xuICAgICAgICAudGhlbiB0aGUgcGFyc2VkUmVzcG9uc2UgKHRoZSBlbnRyeSBBcnJheSkgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZW5kZXJKb3VybmFsRW50cmllcyBtZXRob2Qgb2YgdGhlIERPTSBvYmplY3QsIHdoaWNoIHB1dHMgdGhlIHVwZGF0ZWQgQXJyYXkgaW50byB0aGUgRE9NXG4gICAgICAgICovXG4gICAgICAgIEFQSS5wb3N0RW50cmllcyhidWlsZEVudHJ5T2JqZWN0KGVudHJ5Q29uY2VwdHMsIGVudHJ5RGF0ZSwgZW50cnlNYWluLCBlbnRyeU1vb2QsIGVudHJ5SW5zdHJ1Y3RvcikpXG4gICAgICAgIC8qXG4gICAgICAgIFJlc2V0IHRoZSBpbnB1dCBmaWVsZHNcbiAgICAgICAgKi9cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtXCIpLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIHJhZGlvSGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vb2QgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihlbnRyaWVzID0+IGVudHJpZXMuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICAgIGlmKG1vb2QgPT09IFwiSGFwcHlcIil7XG4gICAgICAgICAgICAgICAgbGV0IGlzSGFwcHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGVudHJ5Lm1vb2QubGFiZWwgPT09IFwiSGFwcHlcIil7XG4gICAgICAgICAgICAgICAgICAgIGlzSGFwcHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNIYXBweTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihtb29kID09PSBcIkp1c3QgT2theVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNPa2F5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihlbnRyeS5tb29kLmxhYmVsID09PSBcIkp1c3QgT2theVwiKXtcbiAgICAgICAgICAgICAgICAgICAgaXNPa2F5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzT2theTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihtb29kID09PSBcIkRpc3BhaXJcIil7XG4gICAgICAgICAgICAgICAgbGV0IGluRGlzcGFpciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZW50cnkubW9vZC5sYWJlbCA9PT0gXCJEaXNwYWlyXCIpe1xuICAgICAgICAgICAgICAgICAgICBpbkRpc3BhaXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5EaXNwYWlyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSkudGhlbigocmVzcG9uc2UpID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVEZWxldGVCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZW50cnlJZCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpWzFdO1xuXG4gICAgICAgIEFQSS5kZWxldGVFbnRyeShlbnRyeUlkKS50aGVuKCgpID0+IEFQSS5nZXRFbnRyaWVzKCkpLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSlcbiAgICB9LFxuXG4gICAgaGFuZGxlRWRpdEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV07XG5cbiAgICAgICAgY29uc3QgZW50cnlBcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS0tJHtlbnRyeUlkfWApO1xuICAgICAgICBsZXQgZW50cnlUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNqb3VybmFsRW50cnktdGl0bGUtLSR7ZW50cnlJZH1gKS50ZXh0Q29udGVudDtcbiAgICAgICAgbGV0IGVudHJ5TWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNqb3VybmFsRW50cnktbWFpbi0tJHtlbnRyeUlkfWApLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgZW50cnlJbnN0cnVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS1pbnN0cnVjdG9yLS0ke2VudHJ5SWR9YC50ZXh0Q29udGVudClcblxuICAgICAgICB3aGlsZShlbnRyeUFydGljbGUuZmlyc3RDaGlsZCl7XG4gICAgICAgICAgICBlbnRyeUFydGljbGUucmVtb3ZlQ2hpbGQoZW50cnlBcnRpY2xlLmZpcnN0Q2hpbGQpXG4gICAgICAgIH07XG5cbiAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKGVudHJ5VG9FZGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gRU5UUllDT01QLmJ1aWxkRWRpdEZvcm0oZW50cnlUb0VkaXQsIGVudHJ5TWFpbiwgZW50cnlUaXRsZSwgZW50cnlJbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGVudHJ5QXJ0aWNsZS5hcHBlbmRDaGlsZChlZGl0Rm9ybSk7XG4gICAgICAgIH0pXG5cbiAgICB9LFxuICAgIGhhbmRsZVVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQuc3BsaXQoXCItLVwiKVsxXTtcblxuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeVRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRWRpdC10aXRsZVwiKTtcbiAgICAgICAgY29uc3QgZWRpdGVkRW50cnlNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRWRpdC1tYWluXCIpO1xuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LWRhdGVcIik7XG4gICAgICAgIGxldCBlZGl0ZWRFbnRyeU1vb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vb2QtZWRpdFwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5zdHJ1Y3Rvci1lZGl0XCIpLnZhbHVlO1xuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlJbnN0cnVjdG9yID09PSBcIkppc2llIERhdmlkXCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9PT0gXCJLcmlzdGVuIE5vcnJpc1wiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeUluc3RydWN0b3IgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKHRydWUpe1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeU1vb2QgPT09IFwiSGFwcHlcIik6XG4gICAgICAgICAgICAgICAgZWRpdGVkRW50cnlNb29kID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlNb29kID09PSBcIkp1c3QgT2theVwiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeU1vb2QgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeU1vb2QgPT09IFwiRGlzcGFpclwiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeU1vb2QgPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5ID0gYnVpbGRFbnRyeU9iamVjdChlZGl0ZWRFbnRyeVRpdGxlLnZhbHVlLCBlZGl0ZWRFbnRyeURhdGUudmFsdWUsIGVkaXRlZEVudHJ5TWFpbi52YWx1ZSwgZWRpdGVkRW50cnlNb29kLCBlZGl0ZWRFbnRyeUluc3RydWN0b3IpXG5cbiAgICAgICAgQVBJLnB1dEVudHJ5KGVudHJ5SWQsIGVkaXRlZEVudHJ5KS50aGVuKCgpID0+IEFQSS5nZXRFbnRyaWVzKCkpLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSlcblxuICAgIH0sXG5cbiAgICBzZWFyY2hFdmVudDogZnVuY3Rpb24oS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZihLZXlib2FyZEV2ZW50LmtleSA9PT0gXCJFbnRlclwiKXtcbiAgICAgICAgICAgIGxldCBzZWFyY2hJbnB1dEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRW50cnktc2VhcmNoXCIpXG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaElucHV0RmllbGQudmFsdWU7XG4gICAgICAgICAgICBBUEkuZ2V0RW50cmllcygpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZW50cnkudGl0bGUuaW5jbHVkZXMoc2VhcmNoVGVybSkgfHwgZW50cnkuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSkudGhlbigoKSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzdWx0cykpO1xuICAgICAgICAgICAgICAgIHNlYXJjaElucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBldmVudEhhbmRsZXJzOyIsImNvbnN0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxDb250YWluZXJcIik7XG5cbmNvbnN0IGZvcm1IVE1MID0ge1xuXG4gICAgYnVpbGRGb3JtRmllbGRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmb3JtQ29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICAgICAgPGRpdiAgaWQ9XCJmb3JtQ2FyZFwiIGNsYXNzPVwiY2FyZCBiZy1saWdodFwiPlxuICAgICAgICA8aDEgY2xhc3M9XCJjYXJkLWhlYWRlciBiZy1wcmltYXJ5IHRleHQtd2hpdGVcIj5EYWlseSBKb3VybmFsPC9oMT5cbiAgICAgICAgPGZvcm0gaWQ9XCJmb3JtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1iLTBcIiBmb3I9XCJqb3VybmFsRGF0ZVwiPlNlbGVjdCBEYXRlPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJqb3VybmFsRGF0ZVwiIGlkPVwiam91cm5hbERhdGVcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpvdXJuYWxUaXRsZS0tZmllbGRzZXQgZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjb25jZXB0c0NvdmVyZWRcIj5FbnRlciBUaXRsZTwvbGVnZW5kPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cImNvbmNlcHRzQ292ZXJlZFwiIGlkPVwiY29uY2VwdHNDb3ZlcmVkXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJqb3VybmFsRW50cnktLWZpZWxkc2V0IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJtYi0wXCIgZm9yPVwiam91cm5hbEVudHJ5XCI+TWFpbiBFbnRyeTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImpvdXJuYWxFbnRyeVwiIGlkPVwiam91cm5hbEVudHJ5XCIgY29scz1cIjMwXCIgcm93cz1cIjEwXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vb2RTZWxlY3QtLWZpZWxkc2V0IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJtYi0wXCIgZm9yPVwibW9vZFNlbGVjdFwiPlNlbGVjdCBNb29kPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIm1vb2RTZWxlY3RcIiBpZD1cIm1vb2RTZWxlY3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkhhcHB5XCI+SGFwcHk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkp1c3QgT2theVwiPkp1c3QgT2theTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImluc3RydWN0b3JTZWxlY3QtLWZpZWxkc2V0IGZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJtYi0wXCIgZm9yPVwiaW5zdHJ1Y3RvclNlbGVjdFwiPlNlbGVjdCBJbnN0cnVjdG9yPC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImluc3RydWN0b3JTZWxlY3RcIiBpZD1cImluc3RydWN0b3JTZWxlY3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkppc2llIERhdmlkXCI+SmlzaWUgRGF2aWQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIktyaXN0ZW4gTm9ycmlzXCI+S3Jpc3RlbiBOb3JyaXM8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLXByaW1hcnkgYnRuLXNtXCIgaWQ9XCJzdWJtaXRCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCI+UmVjb3JkIEpvdXJuYWwgRW50cnk8L2J1dHRvbj5cbiAgICAgICAgPHNlY3Rpb24gaWQ9XCJmaWx0ZXJDb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vb2RGaWx0ZXIgZm9ybS1jaGVja1wiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1jaGVja1wiIGZvcj1cIm1vb2RGaWx0ZXJSYWRpb1wiPkZpbHRlciBKb3VybmFsIEVudHJpZXMgYnkgTW9vZDwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiSGFwcHlcIj5IYXBweTxicj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJKdXN0IE9rYXlcIj5KdXN0IE9rYXk8YnI+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8YnI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiIGlkPVwic2VhcmNoRW50cmllc1wiPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImpvdXJuYWxFbnRyeS1zZWFyY2hcIj5TZWFyY2ggam91cm5hbCBlbnRyaWVzPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwiam91cm5hbEVudHJ5LXNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgc2VhcmNoIHRlcm1cIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9zZWN0aW9uPlxuICAgIDwvZm9ybT5cbiAgICA8L2Rpdj5cbiAgICBgXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtSFRNTCIsImltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgZm9ybUhUTUwgZnJvbSBcIi4vZm9ybUhUTUxcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9lbnRyaWVzRG9tXCJcbmltcG9ydCBldmVudEhhbmRsZXJzIGZyb20gXCIuL2V2ZW50SGFuZGxlcnNcIlxuXG5mb3JtSFRNTC5idWlsZEZvcm1GaWVsZHMoKTtcbi8vVGFyZ2V0IHRoZSBzdWJtaXQgYnV0dG9uIGFuZCBhc3NpZ24gdGhlIHZhcmlhYmxlIHN1Ym1pdEJ1dHRvbiB0byBpdFxuY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJtaXRCdXR0b25cIik7XG5cbkFQSS5nZXRFbnRyaWVzKCkudGhlbihwYXJzZWRSZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocGFyc2VkUmVzcG9uc2UpKTtcblxuXG5jb25zdCBkZWxldGVCdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJkZWxldGVcIilcbmRlbGV0ZUJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBldmVudEhhbmRsZXJzLmhhbmRsZURlbGV0ZUJ1dHRvbihidXR0b24uaWQpXG4gICAgfSk7XG59KVxuXG4vKlxuICAgIGZ1bmN0aW9uIHJ1bnMgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQsIHN0b3JpbmcgdGhlIHZhbHVlcyBvZiB0aGUgdGFyZ2V0dGVkIGVsZW1lbnRzIGluIHRoZSBpbnB1dCBmb3JtIGF0IHRoZSB0aW1lIHRoZSBidXR0b24gaXMgY2xpY2tlZC4gVGhlIG92ZXJhbGwgcHVycG9zZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHRvIHBvc3QgdGhlIG5ldyBqb3VybmFsIGVudHJ5IGludG8gdGhlIEFQSS4gVGhlbiBpdCB3aWxsIGdldCB0aGUgdXBkYXRlZCBlbnRyaWVzIGZyb20gdGhlIEFQSSBhbmQgdXBkYXRlIHRoZSBET00gd2l0aCB0aGUgbmV3IGVudHJ5LlxuKi9cbnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5zdWJtaXRIYW5kbGVyKTtcbmRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwibW9vZEZpbHRlclJhZGlvXCIpLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMucmFkaW9IYW5kbGVyKX0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFbnRyeS1zZWFyY2hcIikuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXZlbnRIYW5kbGVycy5zZWFyY2hFdmVudClcblxuIl19
