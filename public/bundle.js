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
    return fetch(`${url}/?_expand=mood`).then(response => response.json());
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
    const deleteButton = buildEl("button", "Delete Entry", `journalEntry-delete--${journalEntry.id}`);
    deleteButton.classList.add("delete-entry");
    deleteButton.addEventListener("click", _eventHandlers.default.handleDeleteButton);
    const editButton = buildEl("button", "Edit Entry", `journalEntry-edit--${journalEntry.id}`);
    editButton.addEventListener("click", _eventHandlers.default.handleEditButton);
    divEntryContainer.appendChild(entryTitle);
    divEntryContainer.appendChild(entryMain);
    divEntryContainer.appendChild(entryMood);
    divEntryContainer.appendChild(entryDate);
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

const buildEntryObject = (title, date, entry, moodId) => {
  let objectsJournalEntry = {
    title: title,
    date: date,
    entry: entry,
    moodId: moodId
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

    _data.default.postEntries(buildEntryObject(entryConcepts, entryDate, entryMain, entryMood));
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

    while (entryArticle.firstChild) {
      entryArticle.removeChild(entryArticle.firstChild);
    }

    ;

    _data.default.getEntries().then(entryToEdit => {
      const editForm = _entryComponent.default.buildEditForm(entryToEdit, entryMain, entryTitle);

      entryArticle.appendChild(editForm);
    });
  },
  handleUpdateButton: function () {
    let entryId = event.target.parentNode.id.split("--")[1];
    const editedEntryTitle = document.querySelector("#journalEdit-title");
    const editedEntryMain = document.querySelector("#journalEdit-main");
    const editedEntryDate = document.querySelector("#journalEdit-date");
    let editedEntryMood = document.querySelector("#mood-edit").value;

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

    let editedEntry = buildEntryObject(editedEntryTitle.value, editedEntryDate.value, editedEntryMain.value, editedEntryMood);

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
var _default = eventHandlers; // searchInputField.addEventListener("keydown", KeyboardEvent => {
//     const searchInputField = document.querySelector("#journalEntry-search");
//     if(KeyboardEvent.key === "Enter"){
//         let results = [];
//         const searchTerm = searchInputField.value;
//         API.getEntries().then(response => response.forEach(entry => {
//                 if(entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)){
//                     //console.log(entry);
//                     results.push(entry);
//             }
//         })).then(() => DOM.renderJournalEntries(results))
//         searchInputField.value = "";
//     }
// })

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNEb20uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9ldmVudEhhbmRsZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtSFRNTC5qcyIsIi4uL3NjcmlwdHMvam91cm5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNLQTs7OztBQUxBOzs7OztBQU1BLE1BQU0sR0FBRyxHQUFHLGtDQUFaO0FBRUEsTUFBTSxHQUFHLEdBQUc7QUFFUixFQUFBLFVBQVUsRUFBRSxZQUFXO0FBQ3ZCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxnQkFBUixDQUFMLENBQ0YsSUFERSxDQUNHLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQURmLENBQVA7QUFFQyxHQUxPO0FBT1IsRUFBQSxXQUFXLEVBQUUsVUFBUyxjQUFULEVBQXlCO0FBQ2xDLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxFQUFSLEVBQVc7QUFDZixNQUFBLE1BQU0sRUFBRSxNQURPO0FBRWYsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLENBRlM7QUFHZixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYO0FBSE0sS0FBWCxDQUFMLENBT0YsSUFQRSxDQU9HLE1BQU0sR0FBRyxDQUFDLFVBQUosRUFQVCxFQVFGLElBUkUsQ0FRRyxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FSZixDQUFQO0FBU0gsR0FqQk87QUFtQlIsRUFBQSxXQUFXLEVBQUUsVUFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxJQUFHLE9BQVEsRUFBbkIsRUFBc0I7QUFDOUIsTUFBQSxNQUFNLEVBQUU7QUFEc0IsS0FBdEIsQ0FBWjtBQUdILEdBdkJP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QUFRLENBQUMsaUJBQVQsQ0FBMkIsUUFBM0IsQ0FBdEI7QUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQixNQUFNLElBQUk7QUFDNUIsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBTTtBQUNuQywyQkFBYyxrQkFBZCxDQUFpQyxNQUFNLENBQUMsRUFBeEM7QUFDSCxHQUZEO0FBR0gsQ0FKRDtBQU1BOzs7O0FBR0EsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLHVCQUFjLGFBQXJEO0FBQ0EsUUFBUSxDQUFDLGlCQUFULENBQTJCLGlCQUEzQixFQUE4QyxPQUE5QyxDQUFzRCxNQUFNLElBQUk7QUFDNUQsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsdUJBQWMsWUFBL0M7QUFBNkQsQ0FEakU7QUFHQSxRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsRUFBK0MsZ0JBQS9DLENBQWdFLFNBQWhFLEVBQTJFLHVCQUFjLFdBQXpGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIGZvcm1lciBjb2RlLiBDcmVhdGVkIHRoZSBBUEkgb2JqZWN0IHRoYXQgZGVmaW5lcyB0d28gbWV0aG9kcywgZ2V0RW50cmllcyBhbmQgcG9zdEVudHJpZXMuXG4gICAgZ2V0RW50cmllcyBwdWxscyB0aGUgZW50cmllcyBmcm9tIHRoZSBBUEkgd2l0aCBhIGZldGNoIGNhbGxcbiAgICBwb3N0RW50cmllcyB3aWxsIHBvc3QgYSBuZXcgdG8gdGhlIEFQSVxuKi9cbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9hbGxFbnRyaWVzXCI7XG5cbmNvbnN0IEFQSSA9IHtcblxuICAgIGdldEVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9Lz9fZXhwYW5kPW1vb2RgKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpO1xuICAgIH0sXG5cbiAgICBwb3N0RW50cmllczogZnVuY3Rpb24obmV3RW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShuZXdFbnRyeU9iamVjdCksXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiBBUEkuZ2V0RW50cmllcygpKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSk7XG4gICAgfSxcblxuICAgIGRlbGV0ZUVudHJ5OiBmdW5jdGlvbihlbnRyeUlkKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7ZW50cnlJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgcHV0RW50cnk6IGZ1bmN0aW9uKGVudHJ5SWQsIHVwZGF0ZWRFbnRyeU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2VudHJ5SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodXBkYXRlZEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBwYXRjaEVudHJ5OiBmdW5jdGlvbihlbnRyeUlkLCB1cGRhdGVkRW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtlbnRyeUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodXBkYXRlZEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBUEk7IiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIHByZXZpb3VzIGNvZGUuIENyZWF0ZWQgRE9NIG9iamVjdCB3aGljaCBkZWZpbmVzIHRoZSByZW5kZXJKb3VybmFsRW50cmllcyBtZXRob2QuIFRoaXMgbWV0aG9kIGRlZmluZXMgdGhlIGNvbnRhaW5lciBmb3IgYWxsRW50cmllcyBpbiB0aGUgRE9NLiBJdCBsb29wcyB0aHJvdWdoIGFuIGFycmF5IG9mIGVudHJpZXMgYW5kIGFkZHMgZWFjaCBvZiB0aGVtIHRvIHRoZSBlbnRyeUxvZyBjb250YWluZXIgLyByZW5kZXJzIHRoZW0gdG8gdGhlIERPTS4gVGhpcyBtZXRob2QgaXMgdG8gYmUgdXNlZCB3aXRoIEFQSS5nZXRFbnRyaWVzKCkgd2hpY2ggcmV0dXJucyBhbiBhcnJheSBhcyBhIHBhcnNlZFJlc3BvbnNlLlxuICAgIEVOVFJZQ09NUC5tYWtlSm91cm5hbEVudHJ5Q29tcG9uZW50KGVudHJ5KSBjcmVhdGVzIHRoZSBIVE1MIHN0cnVjdHVyZSB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gZW50cnlMb2cuIFNlZSBlbnRyeUNvbXBvbmVudC5qcyBmb3IgdGhlIGZ1bmN0aW9uIGV4cHJlc3Npb24uXG4qL1xuXG5pbXBvcnQgRU5UUllDT01QIGZyb20gXCIuL2VudHJ5Q29tcG9uZW50XCJcblxuY29uc3QgRE9NID0ge1xuXG4gICAgcmVuZGVySm91cm5hbEVudHJpZXM6IGZ1bmN0aW9uKGVudHJpZXNBcnJheSkge1xuICAgIGNvbnN0IGVudHJ5TG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbnRyeUxvZ1wiKTtcblxuICAgIGVudHJ5TG9nLmlubmVySFRNTCA9IFwiXCI7XG4gICAgZW50cmllc0FycmF5LmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBlbnRyeUxvZy5hcHBlbmRDaGlsZChFTlRSWUNPTVAubWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChlbnRyeSkpO1xuICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NOyIsIi8qXG4gICAgTW9kdWxhcml6ZWQgdmVyc2lvbiBvZiBwcmV2aW91cyBjb2RlLiBUaGUgb2JqIEVOVFJZQ09NUCBpcyBkZWZpbmVkIGFuZCBjb250YWlucyB0aGUgbWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChqb3VybmFsRW50cnkpIG1ldGhvZCBleHByZXNzaW9uLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBidWlsZCBhbiBIVE1MIHN0cmluZyBvdXQgb2YgdGhlIGpvdXJuYWxFbnRyeSBvYmplY3QgYnkgcGFzc2luZyBpbiB0aGUgdmFsdWVzIGZvciBlYWNoIGtleS4gVGhlIGpvdXJuYWxFbnRyeU9iamVjdCBpcyBkZWZpbmVkIGluIGpvdXJuYWwuanMgLyBzZWUgZm9yIHJlZmVyZW5jZS5cbiovXG5pbXBvcnQgZXZlbnRIYW5kbGVycyBmcm9tIFwiLi9ldmVudEhhbmRsZXJzXCJcblxuY29uc3QgYnVpbGRFbCA9IChlbCwgdGV4dCwgaWQsIHR5cGUsIG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IG5ld0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbCk7XG4gICAgbmV3RWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGlmKGlkKXtcbiAgICAgICAgbmV3RWwuaWQgPSBpZDtcbiAgICB9XG4gICAgaWYodHlwZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZSk7XG4gICAgfVxuXG4gICAgaWYobmFtZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgbmFtZSk7XG4gICAgfVxuICAgIGlmKHZhbHVlKXtcbiAgICAgICAgbmV3RWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3RWw7XG59XG5cbmNvbnN0IEVOVFJZQ09NUCA9IHtcblxuICAgIG1ha2VKb3VybmFsRW50cnlDb21wb25lbnQ6IGZ1bmN0aW9uKGpvdXJuYWxFbnRyeSkge1xuICAgIC8vIENyZWF0ZSB5b3VyIG93biBIVE1MIHN0cnVjdHVyZSBmb3IgYSBqb3VybmFsIGVudHJ5XG4gICAgY29uc3QgZGl2RW50cnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsRW50cnktLWNvbnRhaW5lclwiKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5pZCA9IGBqb3VybmFsRW50cnktLSR7am91cm5hbEVudHJ5LmlkfWA7XG4gICAgY29uc3QgZW50cnlUaXRsZSA9IGJ1aWxkRWwoXCJoM1wiLCBgJHtqb3VybmFsRW50cnkudGl0bGV9YCwgYGpvdXJuYWxFbnRyeS10aXRsZS0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgY29uc3QgZW50cnlNYWluID0gYnVpbGRFbChcInBcIiwgam91cm5hbEVudHJ5LmVudHJ5LCBgam91cm5hbEVudHJ5LW1haW4tLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGNvbnN0IGVudHJ5TW9vZCA9IGJ1aWxkRWwoXCJwXCIsIGpvdXJuYWxFbnRyeS5tb29kLmxhYmVsLCBgam91cm5hbEVudHJ5LW1vb2QtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGNvbnN0IGVudHJ5RGF0ZSA9IGJ1aWxkRWwoXCJwXCIsIGAke2pvdXJuYWxFbnRyeS5kYXRlfWAsYGpvdXJuYWxFbnRyeS1kYXRlLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBjb25zdCBkZWxldGVCdXR0b24gPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiRGVsZXRlIEVudHJ5XCIsYGpvdXJuYWxFbnRyeS1kZWxldGUtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZGVsZXRlLWVudHJ5XCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5oYW5kbGVEZWxldGVCdXR0b24pO1xuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiRWRpdCBFbnRyeVwiLCBgam91cm5hbEVudHJ5LWVkaXQtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRWRpdEJ1dHRvbik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlUaXRsZSk7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlNYWluKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeU1vb2QpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5RGF0ZSk7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlZGl0QnV0dG9uKTtcbiAgICByZXR1cm4gZGl2RW50cnlDb250YWluZXI7XG4gICAgfSxcblxuICAgIGJ1aWxkRWRpdEZvcm06IGZ1bmN0aW9uKGVudHJ5T2JqZWN0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpIHtcbiAgICAgICAgbGV0IGVkaXRGb3JtRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIsKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJEYXRlXCIpKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJpbnB1dFwiLCB1bmRlZmluZWQsIFwiam91cm5hbEVkaXQtZGF0ZVwiLCBcImRhdGVcIikpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGRhdGVGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdGl0bGVGaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgdGl0bGVGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiQ29uY2VwdHNcIikpO1xuICAgICAgICB0aXRsZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJ0ZXh0YXJlYVwiLCBlbnRyeVRpdGxlLCBcImpvdXJuYWxFZGl0LXRpdGxlXCIpKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHRpdGxlRmllbGRzZXQpO1xuXG4gICAgICAgIGNvbnN0IG1haW5GaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcblxuICAgICAgICBtYWluRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcImxlZ2VuZFwiLCBcIkVudHJ5XCIpKTtcbiAgICAgICAgY29uc3QgZW50cnkgPSAoYnVpbGRFbChcInRleHRhcmVhXCIsIGVudHJ5TWFpbiwgXCJqb3VybmFsRWRpdC1tYWluXCIpKTtcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwicm93c1wiLCBcIjVcIik7XG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcImNvbHNcIiwgXCI1MFwiKTtcbiAgICAgICAgbWFpbkZpZWxkc2V0LmFwcGVuZENoaWxkKGVudHJ5KTtcbiAgICAgICAgZWRpdEZvcm1GcmFnbWVudC5hcHBlbmRDaGlsZChtYWluRmllbGRzZXQpO1xuXG5cbiAgICAgICAgY29uc3QgbW9vZEZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIG1vb2RGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IE1vb2RcIikpXG4gICAgICAgIGNvbnN0IG1vb2RTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJtb29kLWVkaXRcIilcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSGFwcHlcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJIYXBweVwiKSlcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSnVzdCBPa2F5XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiSnVzdCBPa2F5XCIpKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJEaXNwYWlyXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiRGlzcGFpclwiKSlcbiAgICAgICAgbW9vZEZpZWxkc2V0LmFwcGVuZENoaWxkKG1vb2RTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKG1vb2RGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlRW50cnkgPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiU2F2ZVwiKTtcbiAgICAgICAgdXBkYXRlRW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlVXBkYXRlQnV0dG9uKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHVwZGF0ZUVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGVkaXRGb3JtRnJhZ21lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFTlRSWUNPTVBcbiIsImltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IGJ1aWxkRW50cnlPYmplY3QgPSAodGl0bGUsIGRhdGUsIGVudHJ5LCBtb29kSWQpID0+IHtcbiAgICBsZXQgb2JqZWN0c0pvdXJuYWxFbnRyeSA9IHtcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICBkYXRlOiBkYXRlLFxuICAgICAgICBlbnRyeTogZW50cnksXG4gICAgICAgIG1vb2RJZDogbW9vZElkXG4gICAgfTtcblxuICAgIHJldHVybiBvYmplY3RzSm91cm5hbEVudHJ5O1xufVxuXG5jb25zdCBldmVudEhhbmRsZXJzID0ge1xuICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKlxuICAgICAgICBkZWZpbmVkIHZhcmlhYmxlcyB0aGF0IGFyZSBzZXQgZXF1YWwgdG8gdGhlIGlucHV0IHZhbHVlcyB0YXJnZXR0ZWQgYmVsb3dcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZW50cnlEYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsRGF0ZVwiKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZW50cnlDb25jZXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29uY2VwdHNDb3ZlcmVkXCIpLnZhbHVlO1xuICAgICAgICBjb25zdCBlbnRyeU1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWxFbnRyeVwiKS52YWx1ZTtcbiAgICAgICAgbGV0IGVudHJ5TW9vZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9vZFNlbGVjdFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3Qgbm90QWxsb3dlZCA9IFtcIihcIiwgXCIpXCIsIFwie1wiLCBcIn1cIiwgXCI6XCIsIFwiO1wiXTtcblxuICAgICAgICBzd2l0Y2godHJ1ZSl7XG4gICAgICAgICAgICBjYXNlKGVudHJ5TW9vZCA9PT0gXCJIYXBweVwiKTpcbiAgICAgICAgICAgICAgICBlbnRyeU1vb2QgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlbnRyeU1vb2QgPT09IFwiSnVzdCBPa2F5XCIpOlxuICAgICAgICAgICAgICAgIGVudHJ5TW9vZCA9IDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVudHJ5TW9vZCA9PT0gXCJEaXNwYWlyXCIpOlxuICAgICAgICAgICAgICAgIGVudHJ5TW9vZCA9IDM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZihlbnRyeUNvbmNlcHRzID09PSBcIlwiIHx8IGVudHJ5TWFpbiA9PT0gXCJcIil7XG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJZb3UgTGVmdCBhIEZpZWxkIEJsYW5rXCIpO1xuICAgICAgICB9IGlmIChlbnRyeU1haW4ubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJZb3VyIGVudHJ5IGlzIHRvbyBsb25nXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5vdEFsbG93ZWQuZm9yRWFjaChjaGFyID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRyeU1haW4uaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJJbGxlZ2FsIENoYXJhY3RlcnNcIik7XG4gICAgICAgIH1cbiAgICAgICAgfSlcblxuXG4gICAgICAgIC8qXG4gICAgICAgIENhbGwgdGhlIHBvc3RFbnRyaWVzKCkgbWV0aG9kIGZyb20gdGhlIEFQSSBvYmplY3QgKHNlZSBkYXRhLmpzKSB3aGljaCBhZGRzIHRoZSBuZXcgam91cm5hbCBlbnRyeSB0byB0aGUgQVBJLiBUaGUgZmFjdG9yeSBmdW5jdGlvbiBidWlsZEVudHJ5T2JqZWN0KCkgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyLlxuICAgICAgICAudGhlbiBhZnRlciB0aGUgZW50cnkgaXMgcG9zdGVkLCBjYWxsIHRoZSBnZXRFbnRyaWVzKCkgbWV0aG9kIGZyb20gdGhlIEFQSSBvYmplY3QgKHNlZSBkYXRhLmpzKSB3aGljaCBnZXRzIHRoZSB1cGRhdGVkIEFycmF5IG9mIGFsbCBqb3VybmFsIGVudHJpZXNcbiAgICAgICAgLnRoZW4gdGhlIHBhcnNlZFJlc3BvbnNlICh0aGUgZW50cnkgQXJyYXkpIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmVuZGVySm91cm5hbEVudHJpZXMgbWV0aG9kIG9mIHRoZSBET00gb2JqZWN0LCB3aGljaCBwdXRzIHRoZSB1cGRhdGVkIEFycmF5IGludG8gdGhlIERPTVxuICAgICAgICAqL1xuICAgICAgICBBUEkucG9zdEVudHJpZXMoYnVpbGRFbnRyeU9iamVjdChlbnRyeUNvbmNlcHRzLCBlbnRyeURhdGUsIGVudHJ5TWFpbiwgZW50cnlNb29kKSlcbiAgICAgICAgLypcbiAgICAgICAgUmVzZXQgdGhlIGlucHV0IGZpZWxkc1xuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm1cIikucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgcmFkaW9IYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9vZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKGVudHJpZXMgPT4gZW50cmllcy5maWx0ZXIoZW50cnkgPT4ge1xuICAgICAgICAgICAgaWYobW9vZCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNIYXBweSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZW50cnkubW9vZC5sYWJlbCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICAgICAgaXNIYXBweSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpc0hhcHB5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgIGxldCBpc09rYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGVudHJ5Lm1vb2QubGFiZWwgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgICAgICBpc09rYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNPa2F5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiRGlzcGFpclwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaW5EaXNwYWlyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihlbnRyeS5tb29kLmxhYmVsID09PSBcIkRpc3BhaXJcIil7XG4gICAgICAgICAgICAgICAgICAgIGluRGlzcGFpciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbkRpc3BhaXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKS50aGVuKChyZXNwb25zZSkgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSk7XG4gICAgfSxcblxuICAgIGhhbmRsZURlbGV0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV07XG5cbiAgICAgICAgQVBJLmRlbGV0ZUVudHJ5KGVudHJ5SWQpLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSkudGhlbihyZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzcG9uc2UpKVxuICAgIH0sXG5cbiAgICBoYW5kbGVFZGl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXTtcblxuICAgICAgICBjb25zdCBlbnRyeUFydGljbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjam91cm5hbEVudHJ5LS0ke2VudHJ5SWR9YCk7XG4gICAgICAgIGxldCBlbnRyeVRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS10aXRsZS0tJHtlbnRyeUlkfWApLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgZW50cnlNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS1tYWluLS0ke2VudHJ5SWR9YCkudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgd2hpbGUoZW50cnlBcnRpY2xlLmZpcnN0Q2hpbGQpe1xuICAgICAgICAgICAgZW50cnlBcnRpY2xlLnJlbW92ZUNoaWxkKGVudHJ5QXJ0aWNsZS5maXJzdENoaWxkKVxuICAgICAgICB9O1xuXG4gICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihlbnRyeVRvRWRpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IEVOVFJZQ09NUC5idWlsZEVkaXRGb3JtKGVudHJ5VG9FZGl0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpO1xuICAgICAgICAgICAgZW50cnlBcnRpY2xlLmFwcGVuZENoaWxkKGVkaXRGb3JtKTtcbiAgICAgICAgfSlcblxuICAgIH0sXG4gICAgaGFuZGxlVXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZC5zcGxpdChcIi0tXCIpWzFdO1xuXG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LXRpdGxlXCIpO1xuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeU1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LW1haW5cIik7XG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVkaXQtZGF0ZVwiKTtcbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5TW9vZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZC1lZGl0XCIpLnZhbHVlO1xuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlNb29kID09PSBcIkhhcHB5XCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5TW9vZCA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVkaXRlZEVudHJ5TW9vZCA9PT0gXCJKdXN0IE9rYXlcIik6XG4gICAgICAgICAgICAgICAgZWRpdGVkRW50cnlNb29kID0gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlNb29kID09PSBcIkRpc3BhaXJcIik6XG4gICAgICAgICAgICAgICAgZWRpdGVkRW50cnlNb29kID0gMztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlZGl0ZWRFbnRyeSA9IGJ1aWxkRW50cnlPYmplY3QoZWRpdGVkRW50cnlUaXRsZS52YWx1ZSwgZWRpdGVkRW50cnlEYXRlLnZhbHVlLCBlZGl0ZWRFbnRyeU1haW4udmFsdWUsIGVkaXRlZEVudHJ5TW9vZClcblxuICAgICAgICBBUEkucHV0RW50cnkoZW50cnlJZCwgZWRpdGVkRW50cnkpLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSkudGhlbihyZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzcG9uc2UpKVxuXG4gICAgfSxcblxuICAgIHNlYXJjaEV2ZW50OiBmdW5jdGlvbihLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmKEtleWJvYXJkRXZlbnQua2V5ID09PSBcIkVudGVyXCIpe1xuICAgICAgICAgICAgbGV0IHNlYXJjaElucHV0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFbnRyeS1zZWFyY2hcIilcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gc2VhcmNoSW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICBpZihlbnRyeS50aXRsZS5pbmNsdWRlcyhzZWFyY2hUZXJtKSB8fCBlbnRyeS5lbnRyeS5pbmNsdWRlcyhzZWFyY2hUZXJtKSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKS50aGVuKCgpID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXN1bHRzKSk7XG4gICAgICAgICAgICAgICAgc2VhcmNoSW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50SGFuZGxlcnM7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLy8gc2VhcmNoSW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBLZXlib2FyZEV2ZW50ID0+IHtcbi8vICAgICBjb25zdCBzZWFyY2hJbnB1dEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqb3VybmFsRW50cnktc2VhcmNoXCIpO1xuLy8gICAgIGlmKEtleWJvYXJkRXZlbnQua2V5ID09PSBcIkVudGVyXCIpe1xuLy8gICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuLy8gICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gc2VhcmNoSW5wdXRGaWVsZC52YWx1ZTtcbi8vICAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmZvckVhY2goZW50cnkgPT4ge1xuLy8gICAgICAgICAgICAgICAgIGlmKGVudHJ5LnRpdGxlLmluY2x1ZGVzKHNlYXJjaFRlcm0pIHx8IGVudHJ5LmVudHJ5LmluY2x1ZGVzKHNlYXJjaFRlcm0pKXtcbi8vICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlbnRyeSk7XG4vLyAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRyeSk7XG4vLyAgICAgICAgICAgICB9XG5cbi8vICAgICAgICAgfSkpLnRoZW4oKCkgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3VsdHMpKVxuLy8gICAgICAgICBzZWFyY2hJbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbi8vICAgICB9XG4vLyB9KSIsImNvbnN0IGZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxDb250YWluZXJcIik7XG5cbmNvbnN0IGZvcm1IVE1MID0ge1xuXG4gICAgYnVpbGRGb3JtRmllbGRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm9ybUNvbnRhaW5lci5pbm5lckhUTUwgPSBgXG4gICAgPGZvcm0gaWQ9XCJmb3JtXCI+XG4gICAgICAgIDxmaWVsZHNldCBjbGFzcz1cImpvdXJuYWxEYXRlLS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgRGF0ZTwvbGVnZW5kPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJjb25jZXB0c0NvdmVyZWQtLWZpZWxkU2V0XCI+XG4gICAgICAgICAgICA8bGVnZW5kPkVudGVyIFRpdGxlPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiY29uY2VwdHNDb3ZlcmVkXCIgaWQ9XCJjb25jZXB0c0NvdmVyZWRcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwiam91cm5hbEVudHJ5LS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5NYWluIEVudHJ5PC9sZWdlbmQ+XG4gICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImpvdXJuYWxFbnRyeVwiIGlkPVwiam91cm5hbEVudHJ5XCIgY29scz1cIjMwXCIgcm93cz1cIjEwXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwibW9vZFNlbGVjdC0tZmllbGRzZXRcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+U2VsZWN0IE1vb2Q8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxzZWxlY3QgbmFtZT1cIm1vb2RTZWxlY3RcIiBpZD1cIm1vb2RTZWxlY3RcIj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSGFwcHlcIj5IYXBweTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJKdXN0IE9rYXlcIj5KdXN0IE9rYXk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8L29wdGlvbj5cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8YnV0dG9uIGlkPVwic3VibWl0QnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiPlJlY29yZCBKb3VybmFsIEVudHJ5PC9idXR0b24+XG4gICAgPC9mb3JtPlxuICAgIDxoci8+XG4gICAgPHNlY3Rpb24gaWQ9XCJmaWx0ZXJTZWN0aW9uXCI+XG4gICAgICAgIDxmaWVsZHNldCBjbGFzcz1cIm1vb2RGaWx0ZXJcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+RmlsdGVyIEpvdXJuYWwgRW50cmllcyBieSBNb29kPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiSGFwcHlcIj5IYXBweTxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJKdXN0IE9rYXlcIj5KdXN0IE9rYXk8YnI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm1vb2RGaWx0ZXJSYWRpb1wiIHZhbHVlPVwiRGlzcGFpclwiPkRpc3BhaXI8YnI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldCBpZD1cInNlYXJjaEVudHJpZXNcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+U2VhcmNoIGpvdXJuYWwgZW50cmllczwvbGVnZW5kPlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiam91cm5hbEVudHJ5LXNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiRW50ZXIgc2VhcmNoIHRlcm1cIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgIDwvc2VjdGlvbj5cbiAgICBgXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtSFRNTFxuIiwiaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCJcbmltcG9ydCBmb3JtSFRNTCBmcm9tIFwiLi9mb3JtSFRNTFwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmZvcm1IVE1MLmJ1aWxkRm9ybUZpZWxkcygpO1xuLy9UYXJnZXQgdGhlIHN1Ym1pdCBidXR0b24gYW5kIGFzc2lnbiB0aGUgdmFyaWFibGUgc3VibWl0QnV0dG9uIHRvIGl0XG5jb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJ1dHRvblwiKTtcblxuQVBJLmdldEVudHJpZXMoKS50aGVuKHBhcnNlZFJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhwYXJzZWRSZXNwb25zZSkpO1xuXG5cbmNvbnN0IGRlbGV0ZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcImRlbGV0ZVwiKVxuZGVsZXRlQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKGJ1dHRvbi5pZClcbiAgICB9KTtcbn0pXG5cbi8qXG4gICAgZnVuY3Rpb24gcnVucyB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZCwgc3RvcmluZyB0aGUgdmFsdWVzIG9mIHRoZSB0YXJnZXR0ZWQgZWxlbWVudHMgaW4gdGhlIGlucHV0IGZvcm0gYXQgdGhlIHRpbWUgdGhlIGJ1dHRvbiBpcyBjbGlja2VkLiBUaGUgb3ZlcmFsbCBwdXJwb3NlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdG8gcG9zdCB0aGUgbmV3IGpvdXJuYWwgZW50cnkgaW50byB0aGUgQVBJLiBUaGVuIGl0IHdpbGwgZ2V0IHRoZSB1cGRhdGVkIGVudHJpZXMgZnJvbSB0aGUgQVBJIGFuZCB1cGRhdGUgdGhlIERPTSB3aXRoIHRoZSBuZXcgZW50cnkuXG4qL1xuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudEhhbmRsZXJzLnN1Ym1pdEhhbmRsZXIpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kRmlsdGVyUmFkaW9cIikuZm9yRWFjaChidXR0b24gPT4ge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5yYWRpb0hhbmRsZXIpfSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVudHJ5LXNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBldmVudEhhbmRsZXJzLnNlYXJjaEV2ZW50KVxuXG4iXX0=
