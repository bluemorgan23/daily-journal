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
    divEntryContainer.id = `journalEntry--${journalEntry.id}`;
    const entryTitle = buildEl("h3", `${journalEntry.title}`, `journalEntry-title--${journalEntry.id}`);
    const entryMain = buildEl("p", journalEntry.entry, `journalEntry-main--${journalEntry.id}`);
    const entryMood = buildEl("p", journalEntry.mood.label, `journalEntry-mood--${journalEntry.id}`);
    const entryDate = buildEl("p", `${journalEntry.date}`, `journalEntry-date--${journalEntry.id}`);
    const entryInstructor = buildEl("p", `Instructor: ${journalEntry.instructor.firstName} ${journalEntry.instructor.lastName}`);
    const deleteButton = buildEl("button", "Delete Entry", `journalEntry-delete--${journalEntry.id}`);
    deleteButton.classList.add("delete-entry");
    deleteButton.addEventListener("click", _eventHandlers.default.handleDeleteButton);
    const editButton = buildEl("button", "Edit Entry", `journalEntry-edit--${journalEntry.id}`);
    editButton.addEventListener("click", _eventHandlers.default.handleEditButton);
    divEntryContainer.appendChild(entryTitle);
    divEntryContainer.appendChild(entryMain);
    divEntryContainer.appendChild(entryMood);
    divEntryContainer.appendChild(entryDate);
    divEntryContainer.appendChild(entryInstructor);
    divEntryContainer.appendChild(deleteButton);
    divEntryContainer.appendChild(editButton);
    return divEntryContainer;
  },
  buildEditForm: function (entryObject, entryMain, entryTitle) {
    let editFormFragment = document.createDocumentFragment();
    const dateFieldset = buildEl("fieldset");
    dateFieldset.appendChild(buildEl("legend", "Date"));
    dateFieldset.appendChild(buildEl("input", undefined, "journalEdit-date", "date"));
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
        <fieldset class="instructorSelect--fieldset">
            <legend>Select Instructor</legend>
            <select name="instructorSelect" id="instructorSelect">
                <option value="Jisie David">Jisie David</option>
                <option value="Kristen Norris">Kristen Norris</option>
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
            <input id="journalEntry-search" placeholder="Enter search term" type="text">
        </fieldset>
    </section>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNEb20uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9ldmVudEhhbmRsZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtSFRNTC5qcyIsIi4uL3NjcmlwdHMvam91cm5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNLQTs7OztBQUxBOzs7OztBQU1BLE1BQU0sR0FBRyxHQUFHLGtDQUFaO0FBRUEsTUFBTSxHQUFHLEdBQUc7QUFFUixFQUFBLFVBQVUsRUFBRSxZQUFXO0FBQ3ZCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxtQ0FBUixDQUFMLENBQ0YsSUFERSxDQUNHLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQURmLENBQVA7QUFFQyxHQUxPO0FBT1IsRUFBQSxXQUFXLEVBQUUsVUFBUyxjQUFULEVBQXlCO0FBQ2xDLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxFQUFSLEVBQVc7QUFDZixNQUFBLE1BQU0sRUFBRSxNQURPO0FBRWYsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLENBRlM7QUFHZixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYO0FBSE0sS0FBWCxDQUFMLENBT0YsSUFQRSxDQU9HLE1BQU0sR0FBRyxDQUFDLFVBQUosRUFQVCxFQVFGLElBUkUsQ0FRRyxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FSZixDQUFQO0FBU0gsR0FqQk87QUFtQlIsRUFBQSxXQUFXLEVBQUUsVUFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxJQUFHLE9BQVEsRUFBbkIsRUFBc0I7QUFDOUIsTUFBQSxNQUFNLEVBQUU7QUFEc0IsS0FBdEIsQ0FBWjtBQUdILEdBdkJP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QTZDQztBQWhEWSxDQUFqQjtlQW1EZSxROzs7Ozs7QUNyRGY7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxrQkFBUyxlQUFULEcsQ0FDQTs7O0FBQ0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBckI7O0FBRUEsY0FBSSxVQUFKLEdBQWlCLElBQWpCLENBQXNCLGNBQWMsSUFBSSxvQkFBSSxvQkFBSixDQUF5QixjQUF6QixDQUF4Qzs7QUFHQSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsaUJBQVQsQ0FBMkIsUUFBM0IsQ0FBdEI7QUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQixNQUFNLElBQUk7QUFDNUIsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBTTtBQUNuQywyQkFBYyxrQkFBZCxDQUFpQyxNQUFNLENBQUMsRUFBeEM7QUFDSCxHQUZEO0FBR0gsQ0FKRDtBQU1BOzs7O0FBR0EsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLHVCQUFjLGFBQXJEO0FBQ0EsUUFBUSxDQUFDLGlCQUFULENBQTJCLGlCQUEzQixFQUE4QyxPQUE5QyxDQUFzRCxNQUFNLElBQUk7QUFDNUQsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsdUJBQWMsWUFBL0M7QUFBNkQsQ0FEakU7QUFHQSxRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsRUFBK0MsZ0JBQS9DLENBQWdFLFNBQWhFLEVBQTJFLHVCQUFjLFdBQXpGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIGZvcm1lciBjb2RlLiBDcmVhdGVkIHRoZSBBUEkgb2JqZWN0IHRoYXQgZGVmaW5lcyB0d28gbWV0aG9kcywgZ2V0RW50cmllcyBhbmQgcG9zdEVudHJpZXMuXG4gICAgZ2V0RW50cmllcyBwdWxscyB0aGUgZW50cmllcyBmcm9tIHRoZSBBUEkgd2l0aCBhIGZldGNoIGNhbGxcbiAgICBwb3N0RW50cmllcyB3aWxsIHBvc3QgYSBuZXcgdG8gdGhlIEFQSVxuKi9cbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9hbGxFbnRyaWVzXCI7XG5cbmNvbnN0IEFQSSA9IHtcblxuICAgIGdldEVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9Lz9fZXhwYW5kPW1vb2QmX2V4cGFuZD1pbnN0cnVjdG9yYClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbiAgICB9LFxuXG4gICAgcG9zdEVudHJpZXM6IGZ1bmN0aW9uKG5ld0VudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkobmV3RW50cnlPYmplY3QpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpO1xuICAgIH0sXG5cbiAgICBkZWxldGVFbnRyeTogZnVuY3Rpb24oZW50cnlJZCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2VudHJ5SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIHB1dEVudHJ5OiBmdW5jdGlvbihlbnRyeUlkLCB1cGRhdGVkRW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtlbnRyeUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgcGF0Y2hFbnRyeTogZnVuY3Rpb24oZW50cnlJZCwgdXBkYXRlZEVudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7ZW50cnlJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsIi8qXG4gICAgTW9kdWxhcml6ZWQgdmVyc2lvbiBvZiBwcmV2aW91cyBjb2RlLiBDcmVhdGVkIERPTSBvYmplY3Qgd2hpY2ggZGVmaW5lcyB0aGUgcmVuZGVySm91cm5hbEVudHJpZXMgbWV0aG9kLiBUaGlzIG1ldGhvZCBkZWZpbmVzIHRoZSBjb250YWluZXIgZm9yIGFsbEVudHJpZXMgaW4gdGhlIERPTS4gSXQgbG9vcHMgdGhyb3VnaCBhbiBhcnJheSBvZiBlbnRyaWVzIGFuZCBhZGRzIGVhY2ggb2YgdGhlbSB0byB0aGUgZW50cnlMb2cgY29udGFpbmVyIC8gcmVuZGVycyB0aGVtIHRvIHRoZSBET00uIFRoaXMgbWV0aG9kIGlzIHRvIGJlIHVzZWQgd2l0aCBBUEkuZ2V0RW50cmllcygpIHdoaWNoIHJldHVybnMgYW4gYXJyYXkgYXMgYSBwYXJzZWRSZXNwb25zZS5cbiAgICBFTlRSWUNPTVAubWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChlbnRyeSkgY3JlYXRlcyB0aGUgSFRNTCBzdHJ1Y3R1cmUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIGVudHJ5TG9nLiBTZWUgZW50cnlDb21wb25lbnQuanMgZm9yIHRoZSBmdW5jdGlvbiBleHByZXNzaW9uLlxuKi9cblxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IERPTSA9IHtcblxuICAgIHJlbmRlckpvdXJuYWxFbnRyaWVzOiBmdW5jdGlvbihlbnRyaWVzQXJyYXkpIHtcbiAgICBjb25zdCBlbnRyeUxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW50cnlMb2dcIik7XG5cbiAgICBlbnRyeUxvZy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGVudHJpZXNBcnJheS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgZW50cnlMb2cuYXBwZW5kQ2hpbGQoRU5UUllDT01QLm1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoZW50cnkpKTtcbiAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTTsiLCIvKlxuICAgIE1vZHVsYXJpemVkIHZlcnNpb24gb2YgcHJldmlvdXMgY29kZS4gVGhlIG9iaiBFTlRSWUNPTVAgaXMgZGVmaW5lZCBhbmQgY29udGFpbnMgdGhlIG1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoam91cm5hbEVudHJ5KSBtZXRob2QgZXhwcmVzc2lvbi4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gYnVpbGQgYW4gSFRNTCBzdHJpbmcgb3V0IG9mIHRoZSBqb3VybmFsRW50cnkgb2JqZWN0IGJ5IHBhc3NpbmcgaW4gdGhlIHZhbHVlcyBmb3IgZWFjaCBrZXkuIFRoZSBqb3VybmFsRW50cnlPYmplY3QgaXMgZGVmaW5lZCBpbiBqb3VybmFsLmpzIC8gc2VlIGZvciByZWZlcmVuY2UuXG4qL1xuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmNvbnN0IGJ1aWxkRWwgPSAoZWwsIHRleHQsIGlkLCB0eXBlLCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBuZXdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIG5ld0VsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBpZihpZCl7XG4gICAgICAgIG5ld0VsLmlkID0gaWQ7XG4gICAgfVxuICAgIGlmKHR5cGUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGUpO1xuICAgIH1cblxuICAgIGlmKG5hbWUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIG5hbWUpO1xuICAgIH1cbiAgICBpZih2YWx1ZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0VsO1xufVxuXG5jb25zdCBFTlRSWUNPTVAgPSB7XG5cbiAgICBtYWtlSm91cm5hbEVudHJ5Q29tcG9uZW50OiBmdW5jdGlvbihqb3VybmFsRW50cnkpIHtcbiAgICAvLyBDcmVhdGUgeW91ciBvd24gSFRNTCBzdHJ1Y3R1cmUgZm9yIGEgam91cm5hbCBlbnRyeVxuICAgIGNvbnN0IGRpdkVudHJ5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiam91cm5hbEVudHJ5LS1jb250YWluZXJcIik7XG4gICAgZGl2RW50cnlDb250YWluZXIuaWQgPSBgam91cm5hbEVudHJ5LS0ke2pvdXJuYWxFbnRyeS5pZH1gO1xuICAgIGNvbnN0IGVudHJ5VGl0bGUgPSBidWlsZEVsKFwiaDNcIiwgYCR7am91cm5hbEVudHJ5LnRpdGxlfWAsIGBqb3VybmFsRW50cnktdGl0bGUtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGNvbnN0IGVudHJ5TWFpbiA9IGJ1aWxkRWwoXCJwXCIsIGpvdXJuYWxFbnRyeS5lbnRyeSwgYGpvdXJuYWxFbnRyeS1tYWluLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBjb25zdCBlbnRyeU1vb2QgPSBidWlsZEVsKFwicFwiLCBqb3VybmFsRW50cnkubW9vZC5sYWJlbCwgYGpvdXJuYWxFbnRyeS1tb29kLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBjb25zdCBlbnRyeURhdGUgPSBidWlsZEVsKFwicFwiLCBgJHtqb3VybmFsRW50cnkuZGF0ZX1gLGBqb3VybmFsRW50cnktZGF0ZS0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgY29uc3QgZW50cnlJbnN0cnVjdG9yID0gYnVpbGRFbChcInBcIiwgYEluc3RydWN0b3I6ICR7am91cm5hbEVudHJ5Lmluc3RydWN0b3IuZmlyc3ROYW1lfSAke2pvdXJuYWxFbnRyeS5pbnN0cnVjdG9yLmxhc3ROYW1lfWApXG4gICAgY29uc3QgZGVsZXRlQnV0dG9uID0gYnVpbGRFbChcImJ1dHRvblwiLCBcIkRlbGV0ZSBFbnRyeVwiLGBqb3VybmFsRW50cnktZGVsZXRlLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBkZWxldGVCdXR0b24uY2xhc3NMaXN0LmFkZChcImRlbGV0ZS1lbnRyeVwiKTtcbiAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKTtcbiAgICBjb25zdCBlZGl0QnV0dG9uID0gYnVpbGRFbChcImJ1dHRvblwiLCBcIkVkaXQgRW50cnlcIiwgYGpvdXJuYWxFbnRyeS1lZGl0LS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBlZGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudEhhbmRsZXJzLmhhbmRsZUVkaXRCdXR0b24pO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5VGl0bGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5TWFpbik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlNb29kKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeURhdGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5SW5zdHJ1Y3Rvcik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlZGl0QnV0dG9uKTtcbiAgICByZXR1cm4gZGl2RW50cnlDb250YWluZXI7XG4gICAgfSxcblxuICAgIGJ1aWxkRWRpdEZvcm06IGZ1bmN0aW9uKGVudHJ5T2JqZWN0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpIHtcbiAgICAgICAgbGV0IGVkaXRGb3JtRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIsKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJEYXRlXCIpKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJpbnB1dFwiLCB1bmRlZmluZWQsIFwiam91cm5hbEVkaXQtZGF0ZVwiLCBcImRhdGVcIikpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGRhdGVGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdGl0bGVGaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgdGl0bGVGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiQ29uY2VwdHNcIikpO1xuICAgICAgICB0aXRsZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJ0ZXh0YXJlYVwiLCBlbnRyeVRpdGxlLCBcImpvdXJuYWxFZGl0LXRpdGxlXCIpKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHRpdGxlRmllbGRzZXQpO1xuXG4gICAgICAgIGNvbnN0IG1haW5GaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcblxuICAgICAgICBtYWluRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcImxlZ2VuZFwiLCBcIkVudHJ5XCIpKTtcbiAgICAgICAgY29uc3QgZW50cnkgPSAoYnVpbGRFbChcInRleHRhcmVhXCIsIGVudHJ5TWFpbiwgXCJqb3VybmFsRWRpdC1tYWluXCIpKTtcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwicm93c1wiLCBcIjVcIik7XG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcImNvbHNcIiwgXCI1MFwiKTtcbiAgICAgICAgbWFpbkZpZWxkc2V0LmFwcGVuZENoaWxkKGVudHJ5KTtcbiAgICAgICAgZWRpdEZvcm1GcmFnbWVudC5hcHBlbmRDaGlsZChtYWluRmllbGRzZXQpO1xuXG5cbiAgICAgICAgY29uc3QgbW9vZEZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIG1vb2RGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IE1vb2RcIikpXG4gICAgICAgIGNvbnN0IG1vb2RTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJtb29kLWVkaXRcIilcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSGFwcHlcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJIYXBweVwiKSlcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSnVzdCBPa2F5XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiSnVzdCBPa2F5XCIpKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJEaXNwYWlyXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiRGlzcGFpclwiKSlcbiAgICAgICAgbW9vZEZpZWxkc2V0LmFwcGVuZENoaWxkKG1vb2RTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKG1vb2RGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgaW5zdHJ1Y3RvckZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIGluc3RydWN0b3JGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IEluc3RydWN0b3JcIikpXG4gICAgICAgIGNvbnN0IGluc3RydWN0b3JTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJpbnN0cnVjdG9yLWVkaXRcIilcbiAgICAgICAgaW5zdHJ1Y3RvclNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSmlzaWUgRGF2aWRcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJKaXNpZSBEYXZpZFwiKSlcbiAgICAgICAgaW5zdHJ1Y3RvclNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiS3Jpc3RlbiBOb3JyaXNcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJLcmlzdGVuIE5vcnJpc1wiKSlcbiAgICAgICAgaW5zdHJ1Y3RvckZpZWxkc2V0LmFwcGVuZENoaWxkKGluc3RydWN0b3JTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGluc3RydWN0b3JGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlRW50cnkgPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiU2F2ZVwiKTtcbiAgICAgICAgdXBkYXRlRW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlVXBkYXRlQnV0dG9uKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHVwZGF0ZUVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGVkaXRGb3JtRnJhZ21lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFTlRSWUNPTVBcbiIsImltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IGJ1aWxkRW50cnlPYmplY3QgPSAodGl0bGUsIGRhdGUsIGVudHJ5LCBtb29kSWQsIGluc3RydWN0b3JJZCkgPT4ge1xuICAgIGxldCBvYmplY3RzSm91cm5hbEVudHJ5ID0ge1xuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgIGVudHJ5OiBlbnRyeSxcbiAgICAgICAgbW9vZElkOiBtb29kSWQsXG4gICAgICAgIGluc3RydWN0b3JJZDogaW5zdHJ1Y3RvcklkXG4gICAgfTtcblxuICAgIHJldHVybiBvYmplY3RzSm91cm5hbEVudHJ5O1xufVxuXG5jb25zdCBldmVudEhhbmRsZXJzID0ge1xuICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKlxuICAgICAgICBkZWZpbmVkIHZhcmlhYmxlcyB0aGF0IGFyZSBzZXQgZXF1YWwgdG8gdGhlIGlucHV0IHZhbHVlcyB0YXJnZXR0ZWQgYmVsb3dcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZW50cnlEYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsRGF0ZVwiKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZW50cnlDb25jZXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29uY2VwdHNDb3ZlcmVkXCIpLnZhbHVlO1xuICAgICAgICBjb25zdCBlbnRyeU1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWxFbnRyeVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGVudHJ5TW9vZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9vZFNlbGVjdFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3Qgbm90QWxsb3dlZCA9IFtcIihcIiwgXCIpXCIsIFwie1wiLCBcIn1cIiwgXCI6XCIsIFwiO1wiXTtcbiAgICAgICAgbGV0IGVudHJ5SW5zdHJ1Y3RvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zdHJ1Y3RvclNlbGVjdFwiKS52YWx1ZTtcblxuICAgICAgICBzd2l0Y2godHJ1ZSl7XG4gICAgICAgICAgICBjYXNlKGVudHJ5SW5zdHJ1Y3RvciA9PT0gXCJKaXNpZSBEYXZpZFwiKTpcbiAgICAgICAgICAgICAgICBlbnRyeUluc3RydWN0b3IgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlbnRyeUluc3RydWN0b3IgPT09IFwiS3Jpc3RlbiBOb3JyaXNcIik6XG4gICAgICAgICAgICAgICAgZW50cnlJbnN0cnVjdG9yID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZW50cnlNb29kID09PSBcIkhhcHB5XCIpOlxuICAgICAgICAgICAgICAgIGVudHJ5TW9vZCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVudHJ5TW9vZCA9PT0gXCJKdXN0IE9rYXlcIik6XG4gICAgICAgICAgICAgICAgZW50cnlNb29kID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZW50cnlNb29kID09PSBcIkRpc3BhaXJcIik6XG4gICAgICAgICAgICAgICAgZW50cnlNb29kID0gMztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGVudHJ5Q29uY2VwdHMgPT09IFwiXCIgfHwgZW50cnlNYWluID09PSBcIlwiKXtcbiAgICAgICAgICAgIHJldHVybiBhbGVydChcIllvdSBMZWZ0IGEgRmllbGQgQmxhbmtcIik7XG4gICAgICAgIH0gaWYgKGVudHJ5TWFpbi5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICAgIHJldHVybiBhbGVydChcIllvdXIgZW50cnkgaXMgdG9vIGxvbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgbm90QWxsb3dlZC5mb3JFYWNoKGNoYXIgPT4ge1xuICAgICAgICAgICAgaWYgKGVudHJ5TWFpbi5pbmNsdWRlcyhjaGFyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbGVydChcIklsbGVnYWwgQ2hhcmFjdGVyc1wiKTtcbiAgICAgICAgfVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgLypcbiAgICAgICAgQ2FsbCB0aGUgcG9zdEVudHJpZXMoKSBtZXRob2QgZnJvbSB0aGUgQVBJIG9iamVjdCAoc2VlIGRhdGEuanMpIHdoaWNoIGFkZHMgdGhlIG5ldyBqb3VybmFsIGVudHJ5IHRvIHRoZSBBUEkuIFRoZSBmYWN0b3J5IGZ1bmN0aW9uIGJ1aWxkRW50cnlPYmplY3QoKSBpcyBwYXNzZWQgaW4gYXMgYSBwYXJhbWV0ZXIuXG4gICAgICAgIC50aGVuIGFmdGVyIHRoZSBlbnRyeSBpcyBwb3N0ZWQsIGNhbGwgdGhlIGdldEVudHJpZXMoKSBtZXRob2QgZnJvbSB0aGUgQVBJIG9iamVjdCAoc2VlIGRhdGEuanMpIHdoaWNoIGdldHMgdGhlIHVwZGF0ZWQgQXJyYXkgb2YgYWxsIGpvdXJuYWwgZW50cmllc1xuICAgICAgICAudGhlbiB0aGUgcGFyc2VkUmVzcG9uc2UgKHRoZSBlbnRyeSBBcnJheSkgaXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZW5kZXJKb3VybmFsRW50cmllcyBtZXRob2Qgb2YgdGhlIERPTSBvYmplY3QsIHdoaWNoIHB1dHMgdGhlIHVwZGF0ZWQgQXJyYXkgaW50byB0aGUgRE9NXG4gICAgICAgICovXG4gICAgICAgIEFQSS5wb3N0RW50cmllcyhidWlsZEVudHJ5T2JqZWN0KGVudHJ5Q29uY2VwdHMsIGVudHJ5RGF0ZSwgZW50cnlNYWluLCBlbnRyeU1vb2QsIGVudHJ5SW5zdHJ1Y3RvcikpXG4gICAgICAgIC8qXG4gICAgICAgIFJlc2V0IHRoZSBpbnB1dCBmaWVsZHNcbiAgICAgICAgKi9cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtXCIpLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIHJhZGlvSGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1vb2QgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihlbnRyaWVzID0+IGVudHJpZXMuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICAgIGlmKG1vb2QgPT09IFwiSGFwcHlcIil7XG4gICAgICAgICAgICAgICAgbGV0IGlzSGFwcHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGVudHJ5Lm1vb2QubGFiZWwgPT09IFwiSGFwcHlcIil7XG4gICAgICAgICAgICAgICAgICAgIGlzSGFwcHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNIYXBweTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihtb29kID09PSBcIkp1c3QgT2theVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNPa2F5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihlbnRyeS5tb29kLmxhYmVsID09PSBcIkp1c3QgT2theVwiKXtcbiAgICAgICAgICAgICAgICAgICAgaXNPa2F5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzT2theTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihtb29kID09PSBcIkRpc3BhaXJcIil7XG4gICAgICAgICAgICAgICAgbGV0IGluRGlzcGFpciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZW50cnkubW9vZC5sYWJlbCA9PT0gXCJEaXNwYWlyXCIpe1xuICAgICAgICAgICAgICAgICAgICBpbkRpc3BhaXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5EaXNwYWlyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSkudGhlbigocmVzcG9uc2UpID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpO1xuICAgIH0sXG5cbiAgICBoYW5kbGVEZWxldGVCdXR0b246IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZW50cnlJZCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpWzFdO1xuXG4gICAgICAgIEFQSS5kZWxldGVFbnRyeShlbnRyeUlkKS50aGVuKCgpID0+IEFQSS5nZXRFbnRyaWVzKCkpLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSlcbiAgICB9LFxuXG4gICAgaGFuZGxlRWRpdEJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV07XG5cbiAgICAgICAgY29uc3QgZW50cnlBcnRpY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS0tJHtlbnRyeUlkfWApO1xuICAgICAgICBsZXQgZW50cnlUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNqb3VybmFsRW50cnktdGl0bGUtLSR7ZW50cnlJZH1gKS50ZXh0Q29udGVudDtcbiAgICAgICAgbGV0IGVudHJ5TWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNqb3VybmFsRW50cnktbWFpbi0tJHtlbnRyeUlkfWApLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgZW50cnlJbnN0cnVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS1pbnN0cnVjdG9yLS0ke2VudHJ5SWR9YC50ZXh0Q29udGVudClcblxuICAgICAgICB3aGlsZShlbnRyeUFydGljbGUuZmlyc3RDaGlsZCl7XG4gICAgICAgICAgICBlbnRyeUFydGljbGUucmVtb3ZlQ2hpbGQoZW50cnlBcnRpY2xlLmZpcnN0Q2hpbGQpXG4gICAgICAgIH07XG5cbiAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKGVudHJ5VG9FZGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gRU5UUllDT01QLmJ1aWxkRWRpdEZvcm0oZW50cnlUb0VkaXQsIGVudHJ5TWFpbiwgZW50cnlUaXRsZSwgZW50cnlJbnN0cnVjdG9yKTtcbiAgICAgICAgICAgIGVudHJ5QXJ0aWNsZS5hcHBlbmRDaGlsZChlZGl0Rm9ybSk7XG4gICAgICAgIH0pXG5cbiAgICB9LFxuICAgIGhhbmRsZVVwZGF0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuaWQuc3BsaXQoXCItLVwiKVsxXTtcblxuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeVRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRWRpdC10aXRsZVwiKTtcbiAgICAgICAgY29uc3QgZWRpdGVkRW50cnlNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRWRpdC1tYWluXCIpO1xuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LWRhdGVcIik7XG4gICAgICAgIGxldCBlZGl0ZWRFbnRyeU1vb2QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vb2QtZWRpdFwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5zdHJ1Y3Rvci1lZGl0XCIpLnZhbHVlO1xuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlJbnN0cnVjdG9yID09PSBcIkppc2llIERhdmlkXCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9PT0gXCJLcmlzdGVuIE5vcnJpc1wiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeUluc3RydWN0b3IgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKHRydWUpe1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeU1vb2QgPT09IFwiSGFwcHlcIik6XG4gICAgICAgICAgICAgICAgZWRpdGVkRW50cnlNb29kID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlNb29kID09PSBcIkp1c3QgT2theVwiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeU1vb2QgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeU1vb2QgPT09IFwiRGlzcGFpclwiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeU1vb2QgPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5ID0gYnVpbGRFbnRyeU9iamVjdChlZGl0ZWRFbnRyeVRpdGxlLnZhbHVlLCBlZGl0ZWRFbnRyeURhdGUudmFsdWUsIGVkaXRlZEVudHJ5TWFpbi52YWx1ZSwgZWRpdGVkRW50cnlNb29kLCBlZGl0ZWRFbnRyeUluc3RydWN0b3IpXG5cbiAgICAgICAgQVBJLnB1dEVudHJ5KGVudHJ5SWQsIGVkaXRlZEVudHJ5KS50aGVuKCgpID0+IEFQSS5nZXRFbnRyaWVzKCkpLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSlcblxuICAgIH0sXG5cbiAgICBzZWFyY2hFdmVudDogZnVuY3Rpb24oS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZihLZXlib2FyZEV2ZW50LmtleSA9PT0gXCJFbnRlclwiKXtcbiAgICAgICAgICAgIGxldCBzZWFyY2hJbnB1dEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRW50cnktc2VhcmNoXCIpXG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaElucHV0RmllbGQudmFsdWU7XG4gICAgICAgICAgICBBUEkuZ2V0RW50cmllcygpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZW50cnkudGl0bGUuaW5jbHVkZXMoc2VhcmNoVGVybSkgfHwgZW50cnkuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSkudGhlbigoKSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzdWx0cykpO1xuICAgICAgICAgICAgICAgIHNlYXJjaElucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBldmVudEhhbmRsZXJzOyIsImNvbnN0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxDb250YWluZXJcIik7XG5cbmNvbnN0IGZvcm1IVE1MID0ge1xuXG4gICAgYnVpbGRGb3JtRmllbGRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBgXG4gICAgPGZvcm0gaWQ9XCJmb3JtXCI+XG4gICAgICAgIDxmaWVsZHNldCBjbGFzcz1cImpvdXJuYWxEYXRlLS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgRGF0ZTwvbGVnZW5kPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJjb25jZXB0c0NvdmVyZWQtLWZpZWxkU2V0XCI+XG4gICAgICAgICAgICA8bGVnZW5kPkVudGVyIFRpdGxlPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiY29uY2VwdHNDb3ZlcmVkXCIgaWQ9XCJjb25jZXB0c0NvdmVyZWRcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwiam91cm5hbEVudHJ5LS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5NYWluIEVudHJ5PC9sZWdlbmQ+XG4gICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImpvdXJuYWxFbnRyeVwiIGlkPVwiam91cm5hbEVudHJ5XCIgY29scz1cIjMwXCIgcm93cz1cIjEwXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwibW9vZFNlbGVjdC0tZmllbGRzZXRcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+U2VsZWN0IE1vb2Q8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cIm1vb2RTZWxlY3RcIiBpZD1cIm1vb2RTZWxlY3RcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSGFwcHlcIj5IYXBweTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJKdXN0IE9rYXlcIj5KdXN0IE9rYXk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJpbnN0cnVjdG9yU2VsZWN0LS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgSW5zdHJ1Y3RvcjwvbGVnZW5kPlxuICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwiaW5zdHJ1Y3RvclNlbGVjdFwiIGlkPVwiaW5zdHJ1Y3RvclNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJKaXNpZSBEYXZpZFwiPkppc2llIERhdmlkPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIktyaXN0ZW4gTm9ycmlzXCI+S3Jpc3RlbiBOb3JyaXM8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8YnV0dG9uIGlkPVwic3VibWl0QnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiPlJlY29yZCBKb3VybmFsIEVudHJ5PC9idXR0b24+XG4gICAgPC9mb3JtPlxuICAgIDxoci8+XG4gICAgPHNlY3Rpb24gaWQ9XCJmaWx0ZXJTZWN0aW9uXCI+XG4gICAgICAgIDxmaWVsZHNldCBjbGFzcz1cIm1vb2RGaWx0ZXJcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+RmlsdGVyIEpvdXJuYWwgRW50cmllcyBieSBNb29kPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiSGFwcHlcIj5IYXBweTxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJKdXN0IE9rYXlcIj5KdXN0IE9rYXk8YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8YnI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldCBpZD1cInNlYXJjaEVudHJpZXNcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+U2VhcmNoIGpvdXJuYWwgZW50cmllczwvbGVnZW5kPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiam91cm5hbEVudHJ5LXNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgc2VhcmNoIHRlcm1cIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgIDwvc2VjdGlvbj5cbiAgICBgXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtSFRNTFxuIiwiaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCJcbmltcG9ydCBmb3JtSFRNTCBmcm9tIFwiLi9mb3JtSFRNTFwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmZvcm1IVE1MLmJ1aWxkRm9ybUZpZWxkcygpO1xuLy9UYXJnZXQgdGhlIHN1Ym1pdCBidXR0b24gYW5kIGFzc2lnbiB0aGUgdmFyaWFibGUgc3VibWl0QnV0dG9uIHRvIGl0XG5jb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJ1dHRvblwiKTtcblxuQVBJLmdldEVudHJpZXMoKS50aGVuKHBhcnNlZFJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhwYXJzZWRSZXNwb25zZSkpO1xuXG5cbmNvbnN0IGRlbGV0ZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcImRlbGV0ZVwiKVxuZGVsZXRlQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKGJ1dHRvbi5pZClcbiAgICB9KTtcbn0pXG5cbi8qXG4gICAgZnVuY3Rpb24gcnVucyB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZCwgc3RvcmluZyB0aGUgdmFsdWVzIG9mIHRoZSB0YXJnZXR0ZWQgZWxlbWVudHMgaW4gdGhlIGlucHV0IGZvcm0gYXQgdGhlIHRpbWUgdGhlIGJ1dHRvbiBpcyBjbGlja2VkLiBUaGUgb3ZlcmFsbCBwdXJwb3NlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdG8gcG9zdCB0aGUgbmV3IGpvdXJuYWwgZW50cnkgaW50byB0aGUgQVBJLiBUaGVuIGl0IHdpbGwgZ2V0IHRoZSB1cGRhdGVkIGVudHJpZXMgZnJvbSB0aGUgQVBJIGFuZCB1cGRhdGUgdGhlIERPTSB3aXRoIHRoZSBuZXcgZW50cnkuXG4qL1xuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudEhhbmRsZXJzLnN1Ym1pdEhhbmRsZXIpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kRmlsdGVyUmFkaW9cIikuZm9yRWFjaChidXR0b24gPT4ge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5yYWRpb0hhbmRsZXIpfSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVudHJ5LXNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBldmVudEhhbmRsZXJzLnNlYXJjaEV2ZW50KVxuXG4iXX0=
