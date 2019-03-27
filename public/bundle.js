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
    return fetch(url).then(response => response.json());
  },
  postEntries: function (newEntryObject) {
    return fetch(url, {
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
    const entryMood = buildEl("p", journalEntry.mood, `journalEntry-mood--${journalEntry.id}`);
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

const buildEntryObject = (title, date, entry, mood) => {
  let objectsJournalEntry = {
    title: title,
    date: date,
    entry: entry,
    mood: mood
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
    const entryMood = document.getElementById("moodSelect").value;
    const notAllowed = ["(", ")", "{", "}", ":", ";"];

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

        if (entry.mood === "Happy") {
          isHappy = true;
        }

        return isHappy;
      } else if (mood === "Just Okay") {
        let isOkay = false;

        if (entry.mood === "Just Okay") {
          isOkay = true;
        }

        return isOkay;
      } else if (mood === "Dispair") {
        let inDispair = false;

        if (entry.mood === "Dispair") {
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
    const editedEntryMood = document.querySelector("#mood-edit");
    let editedEntry = buildEntryObject(editedEntryTitle.value, editedEntryDate.value, editedEntryMain.value, editedEntryMood.value);

    _data.default.putEntry(entryId, editedEntry).then(() => _data.default.getEntries()).then(response => _entriesDom.default.renderJournalEntries(response));
  },
  searchEvent: function (KeyboardEvent) {
    if (KeyboardEvent.key === "Enter") {
      let results = [];
      const searchTerm = searchInputField.value;

      _data.default.getEntries().then(response => response.forEach(entry => {
        if (entry.title.includes(searchTerm) || entry.entry.includes(searchTerm)) {
          //console.log(entry);
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

},{"./data":1,"./entriesDom":2,"./eventHandlers":4,"./formHTML":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNEb20uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9ldmVudEhhbmRsZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtSFRNTC5qcyIsIi4uL3NjcmlwdHMvam91cm5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNLQTs7OztBQUxBOzs7OztBQU1BLE1BQU0sR0FBRyxHQUFHLGtDQUFaO0FBRUEsTUFBTSxHQUFHLEdBQUc7QUFFUixFQUFBLFVBQVUsRUFBRSxZQUFXO0FBQ3ZCLFdBQU8sS0FBSyxDQUFDLEdBQUQsQ0FBTCxDQUNGLElBREUsQ0FDRyxRQUFRLElBQUksUUFBUSxDQUFDLElBQVQsRUFEZixDQUFQO0FBRUMsR0FMTztBQU9SLEVBQUEsV0FBVyxFQUFFLFVBQVMsY0FBVCxFQUF5QjtBQUNsQyxXQUFPLEtBQUssQ0FBQyxHQUFELEVBQU07QUFDVixNQUFBLE1BQU0sRUFBRSxNQURFO0FBRVYsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLENBRkk7QUFHVixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYO0FBSEMsS0FBTixDQUFMLENBT0YsSUFQRSxDQU9HLE1BQU0sR0FBRyxDQUFDLFVBQUosRUFQVCxFQVFGLElBUkUsQ0FRRyxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FSZixDQUFQO0FBU0gsR0FqQk87QUFtQlIsRUFBQSxXQUFXLEVBQUUsVUFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxJQUFHLE9BQVEsRUFBbkIsRUFBc0I7QUFDOUIsTUFBQSxNQUFNLEVBQUU7QUFEc0IsS0FBdEIsQ0FBWjtBQUdILEdBdkJPO0FBeUJSLEVBQUEsUUFBUSxFQUFF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SkEsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsbUJBQXZCLENBQXRCO0FBRUEsTUFBTSxRQUFRLEdBQUc7QUFFYixFQUFBLGVBQWUsRUFBRSxZQUFXO0FBQzVCLFdBQU8sYUFBYSxDQUFDLFNBQWQsR0FBMkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FBbEM7QUFzQ0M7QUF6Q1ksQ0FBakI7ZUE0Q2UsUTs7Ozs7O0FDOUNmOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRUEsa0JBQVMsZUFBVCxHLENBQ0E7OztBQUNBLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGNBQXhCLENBQXJCOztBQUVBLGNBQUksVUFBSixHQUFpQixJQUFqQixDQUFzQixjQUFjLElBQUksb0JBQUksb0JBQUosQ0FBeUIsY0FBekIsQ0FBeEM7O0FBR0EsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGlCQUFULENBQTJCLFFBQTNCLENBQXRCO0FBQ0EsYUFBYSxDQUFDLE9BQWQsQ0FBc0IsTUFBTSxJQUFJO0FBQzVCLEVBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLE1BQU07QUFDbkMsMkJBQWMsa0JBQWQsQ0FBaUMsTUFBTSxDQUFDLEVBQXhDO0FBQ0gsR0FGRDtBQUdILENBSkQ7QUFNQTs7OztBQUdBLFlBQVksQ0FBQyxnQkFBYixDQUE4QixPQUE5QixFQUF1Qyx1QkFBYyxhQUFyRDtBQUNBLFFBQVEsQ0FBQyxpQkFBVCxDQUEyQixpQkFBM0IsRUFBOEMsT0FBOUMsQ0FBc0QsTUFBTSxJQUFJO0FBQzVELEVBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLHVCQUFjLFlBQS9DO0FBQTZELENBRGpFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIGZvcm1lciBjb2RlLiBDcmVhdGVkIHRoZSBBUEkgb2JqZWN0IHRoYXQgZGVmaW5lcyB0d28gbWV0aG9kcywgZ2V0RW50cmllcyBhbmQgcG9zdEVudHJpZXMuXG4gICAgZ2V0RW50cmllcyBwdWxscyB0aGUgZW50cmllcyBmcm9tIHRoZSBBUEkgd2l0aCBhIGZldGNoIGNhbGxcbiAgICBwb3N0RW50cmllcyB3aWxsIHBvc3QgYSBuZXcgdG8gdGhlIEFQSVxuKi9cbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9hbGxFbnRyaWVzXCI7XG5cbmNvbnN0IEFQSSA9IHtcblxuICAgIGdldEVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZXRjaCh1cmwpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XG4gICAgfSxcblxuICAgIHBvc3RFbnRyaWVzOiBmdW5jdGlvbihuZXdFbnRyeU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShuZXdFbnRyeU9iamVjdCksXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiBBUEkuZ2V0RW50cmllcygpKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSk7XG4gICAgfSxcblxuICAgIGRlbGV0ZUVudHJ5OiBmdW5jdGlvbihlbnRyeUlkKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7ZW50cnlJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCJcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgcHV0RW50cnk6IGZ1bmN0aW9uKGVudHJ5SWQsIHVwZGF0ZWRFbnRyeU9iamVjdCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2VudHJ5SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodXBkYXRlZEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBwYXRjaEVudHJ5OiBmdW5jdGlvbihlbnRyeUlkLCB1cGRhdGVkRW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtlbnRyeUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkodXBkYXRlZEVudHJ5T2JqZWN0KVxuICAgICAgICB9KVxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBBUEk7IiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIHByZXZpb3VzIGNvZGUuIENyZWF0ZWQgRE9NIG9iamVjdCB3aGljaCBkZWZpbmVzIHRoZSByZW5kZXJKb3VybmFsRW50cmllcyBtZXRob2QuIFRoaXMgbWV0aG9kIGRlZmluZXMgdGhlIGNvbnRhaW5lciBmb3IgYWxsRW50cmllcyBpbiB0aGUgRE9NLiBJdCBsb29wcyB0aHJvdWdoIGFuIGFycmF5IG9mIGVudHJpZXMgYW5kIGFkZHMgZWFjaCBvZiB0aGVtIHRvIHRoZSBlbnRyeUxvZyBjb250YWluZXIgLyByZW5kZXJzIHRoZW0gdG8gdGhlIERPTS4gVGhpcyBtZXRob2QgaXMgdG8gYmUgdXNlZCB3aXRoIEFQSS5nZXRFbnRyaWVzKCkgd2hpY2ggcmV0dXJucyBhbiBhcnJheSBhcyBhIHBhcnNlZFJlc3BvbnNlLlxuICAgIEVOVFJZQ09NUC5tYWtlSm91cm5hbEVudHJ5Q29tcG9uZW50KGVudHJ5KSBjcmVhdGVzIHRoZSBIVE1MIHN0cnVjdHVyZSB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gZW50cnlMb2cuIFNlZSBlbnRyeUNvbXBvbmVudC5qcyBmb3IgdGhlIGZ1bmN0aW9uIGV4cHJlc3Npb24uXG4qL1xuXG5pbXBvcnQgRU5UUllDT01QIGZyb20gXCIuL2VudHJ5Q29tcG9uZW50XCJcblxuY29uc3QgRE9NID0ge1xuXG4gICAgcmVuZGVySm91cm5hbEVudHJpZXM6IGZ1bmN0aW9uKGVudHJpZXNBcnJheSkge1xuICAgIGNvbnN0IGVudHJ5TG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbnRyeUxvZ1wiKTtcblxuICAgIGVudHJ5TG9nLmlubmVySFRNTCA9IFwiXCI7XG4gICAgZW50cmllc0FycmF5LmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBlbnRyeUxvZy5hcHBlbmRDaGlsZChFTlRSWUNPTVAubWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChlbnRyeSkpO1xuICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRE9NOyIsIi8qXG4gICAgTW9kdWxhcml6ZWQgdmVyc2lvbiBvZiBwcmV2aW91cyBjb2RlLiBUaGUgb2JqIEVOVFJZQ09NUCBpcyBkZWZpbmVkIGFuZCBjb250YWlucyB0aGUgbWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChqb3VybmFsRW50cnkpIG1ldGhvZCBleHByZXNzaW9uLiBUaGUgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBidWlsZCBhbiBIVE1MIHN0cmluZyBvdXQgb2YgdGhlIGpvdXJuYWxFbnRyeSBvYmplY3QgYnkgcGFzc2luZyBpbiB0aGUgdmFsdWVzIGZvciBlYWNoIGtleS4gVGhlIGpvdXJuYWxFbnRyeU9iamVjdCBpcyBkZWZpbmVkIGluIGpvdXJuYWwuanMgLyBzZWUgZm9yIHJlZmVyZW5jZS5cbiovXG5pbXBvcnQgZXZlbnRIYW5kbGVycyBmcm9tIFwiLi9ldmVudEhhbmRsZXJzXCJcblxuY29uc3QgYnVpbGRFbCA9IChlbCwgdGV4dCwgaWQsIHR5cGUsIG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgbGV0IG5ld0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbCk7XG4gICAgbmV3RWwudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIGlmKGlkKXtcbiAgICAgICAgbmV3RWwuaWQgPSBpZDtcbiAgICB9XG4gICAgaWYodHlwZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZSk7XG4gICAgfVxuXG4gICAgaWYobmFtZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgbmFtZSk7XG4gICAgfVxuICAgIGlmKHZhbHVlKXtcbiAgICAgICAgbmV3RWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3RWw7XG59XG5cbmNvbnN0IEVOVFJZQ09NUCA9IHtcblxuICAgIG1ha2VKb3VybmFsRW50cnlDb21wb25lbnQ6IGZ1bmN0aW9uKGpvdXJuYWxFbnRyeSkge1xuICAgIC8vIENyZWF0ZSB5b3VyIG93biBIVE1MIHN0cnVjdHVyZSBmb3IgYSBqb3VybmFsIGVudHJ5XG4gICAgY29uc3QgZGl2RW50cnlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsRW50cnktLWNvbnRhaW5lclwiKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5pZCA9IGBqb3VybmFsRW50cnktLSR7am91cm5hbEVudHJ5LmlkfWA7XG4gICAgY29uc3QgZW50cnlUaXRsZSA9IGJ1aWxkRWwoXCJoM1wiLCBgJHtqb3VybmFsRW50cnkudGl0bGV9YCwgYGpvdXJuYWxFbnRyeS10aXRsZS0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgY29uc3QgZW50cnlNYWluID0gYnVpbGRFbChcInBcIiwgam91cm5hbEVudHJ5LmVudHJ5LCBgam91cm5hbEVudHJ5LW1haW4tLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGNvbnN0IGVudHJ5TW9vZCA9IGJ1aWxkRWwoXCJwXCIsIGpvdXJuYWxFbnRyeS5tb29kLCBgam91cm5hbEVudHJ5LW1vb2QtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGNvbnN0IGVudHJ5RGF0ZSA9IGJ1aWxkRWwoXCJwXCIsIGAke2pvdXJuYWxFbnRyeS5kYXRlfWAsYGpvdXJuYWxFbnRyeS1kYXRlLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBjb25zdCBkZWxldGVCdXR0b24gPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiRGVsZXRlIEVudHJ5XCIsYGpvdXJuYWxFbnRyeS1kZWxldGUtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZGVsZXRlLWVudHJ5XCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5oYW5kbGVEZWxldGVCdXR0b24pO1xuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiRWRpdCBFbnRyeVwiLCBgam91cm5hbEVudHJ5LWVkaXQtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRWRpdEJ1dHRvbik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlUaXRsZSk7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlNYWluKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeU1vb2QpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5RGF0ZSk7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlZGl0QnV0dG9uKTtcbiAgICByZXR1cm4gZGl2RW50cnlDb250YWluZXI7XG4gICAgfSxcblxuICAgIGJ1aWxkRWRpdEZvcm06IGZ1bmN0aW9uKGVudHJ5T2JqZWN0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpIHtcbiAgICAgICAgbGV0IGVkaXRGb3JtRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIsKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJEYXRlXCIpKTtcbiAgICAgICAgZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJpbnB1dFwiLCB1bmRlZmluZWQsIFwiam91cm5hbEVkaXQtZGF0ZVwiLCBcImRhdGVcIikpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKGRhdGVGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdGl0bGVGaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcbiAgICAgICAgdGl0bGVGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiQ29uY2VwdHNcIikpO1xuICAgICAgICB0aXRsZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJ0ZXh0YXJlYVwiLCBlbnRyeVRpdGxlLCBcImpvdXJuYWxFZGl0LXRpdGxlXCIpKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHRpdGxlRmllbGRzZXQpO1xuXG4gICAgICAgIGNvbnN0IG1haW5GaWVsZHNldCA9IGJ1aWxkRWwoXCJmaWVsZHNldFwiKTtcblxuICAgICAgICBtYWluRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcImxlZ2VuZFwiLCBcIkVudHJ5XCIpKTtcbiAgICAgICAgY29uc3QgZW50cnkgPSAoYnVpbGRFbChcInRleHRhcmVhXCIsIGVudHJ5TWFpbiwgXCJqb3VybmFsRWRpdC1tYWluXCIpKTtcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwicm93c1wiLCBcIjVcIik7XG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcImNvbHNcIiwgXCI1MFwiKTtcbiAgICAgICAgbWFpbkZpZWxkc2V0LmFwcGVuZENoaWxkKGVudHJ5KTtcbiAgICAgICAgZWRpdEZvcm1GcmFnbWVudC5hcHBlbmRDaGlsZChtYWluRmllbGRzZXQpO1xuXG5cbiAgICAgICAgY29uc3QgbW9vZEZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpXG4gICAgICAgIG1vb2RGaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiU2VsZWN0IE1vb2RcIikpXG4gICAgICAgIGNvbnN0IG1vb2RTZWxlY3QgPSBidWlsZEVsKFwic2VsZWN0XCIsIHVuZGVmaW5lZCwgXCJtb29kLWVkaXRcIilcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSGFwcHlcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJIYXBweVwiKSlcbiAgICAgICAgbW9vZFNlbGVjdC5hcHBlbmRDaGlsZChidWlsZEVsKFwib3B0aW9uXCIsIFwiSnVzdCBPa2F5XCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiSnVzdCBPa2F5XCIpKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJEaXNwYWlyXCIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFwiRGlzcGFpclwiKSlcbiAgICAgICAgbW9vZEZpZWxkc2V0LmFwcGVuZENoaWxkKG1vb2RTZWxlY3QpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKG1vb2RGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlRW50cnkgPSBidWlsZEVsKFwiYnV0dG9uXCIsIFwiU2F2ZVwiKTtcbiAgICAgICAgdXBkYXRlRW50cnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlVXBkYXRlQnV0dG9uKVxuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKHVwZGF0ZUVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGVkaXRGb3JtRnJhZ21lbnQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFTlRSWUNPTVBcbiIsImltcG9ydCBBUEkgZnJvbSBcIi4vZGF0YVwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IGJ1aWxkRW50cnlPYmplY3QgPSAodGl0bGUsIGRhdGUsIGVudHJ5LCBtb29kKSA9PiB7XG4gICAgbGV0IG9iamVjdHNKb3VybmFsRW50cnkgPSB7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgZW50cnk6IGVudHJ5LFxuICAgICAgICBtb29kOiBtb29kXG4gICAgfTtcbiAgICByZXR1cm4gb2JqZWN0c0pvdXJuYWxFbnRyeTtcbn1cblxuY29uc3QgZXZlbnRIYW5kbGVycyA9IHtcbiAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLypcbiAgICAgICAgZGVmaW5lZCB2YXJpYWJsZXMgdGhhdCBhcmUgc2V0IGVxdWFsIHRvIHRoZSBpbnB1dCB2YWx1ZXMgdGFyZ2V0dGVkIGJlbG93XG4gICAgICAgICovXG4gICAgICAgIGNvbnN0IGVudHJ5RGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbERhdGVcIikudmFsdWU7XG4gICAgICAgIGNvbnN0IGVudHJ5Q29uY2VwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbmNlcHRzQ292ZXJlZFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZW50cnlNYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb3VybmFsRW50cnlcIikudmFsdWU7XG4gICAgICAgIGNvbnN0IGVudHJ5TW9vZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9vZFNlbGVjdFwiKS52YWx1ZTtcbiAgICAgICAgY29uc3Qgbm90QWxsb3dlZCA9IFtcIihcIiwgXCIpXCIsIFwie1wiLCBcIn1cIiwgXCI6XCIsIFwiO1wiXTtcblxuICAgICAgICBpZihlbnRyeUNvbmNlcHRzID09PSBcIlwiIHx8IGVudHJ5TWFpbiA9PT0gXCJcIil7XG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJZb3UgTGVmdCBhIEZpZWxkIEJsYW5rXCIpO1xuICAgICAgICB9IGlmIChlbnRyeU1haW4ubGVuZ3RoID4gNTAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJZb3VyIGVudHJ5IGlzIHRvbyBsb25nXCIpO1xuICAgICAgICB9XG4gICAgICAgIG5vdEFsbG93ZWQuZm9yRWFjaChjaGFyID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRyeU1haW4uaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxlcnQoXCJJbGxlZ2FsIENoYXJhY3RlcnNcIik7XG4gICAgICAgIH1cbiAgICAgICAgfSlcblxuXG4gICAgICAgIC8qXG4gICAgICAgIENhbGwgdGhlIHBvc3RFbnRyaWVzKCkgbWV0aG9kIGZyb20gdGhlIEFQSSBvYmplY3QgKHNlZSBkYXRhLmpzKSB3aGljaCBhZGRzIHRoZSBuZXcgam91cm5hbCBlbnRyeSB0byB0aGUgQVBJLiBUaGUgZmFjdG9yeSBmdW5jdGlvbiBidWlsZEVudHJ5T2JqZWN0KCkgaXMgcGFzc2VkIGluIGFzIGEgcGFyYW1ldGVyLlxuICAgICAgICAudGhlbiBhZnRlciB0aGUgZW50cnkgaXMgcG9zdGVkLCBjYWxsIHRoZSBnZXRFbnRyaWVzKCkgbWV0aG9kIGZyb20gdGhlIEFQSSBvYmplY3QgKHNlZSBkYXRhLmpzKSB3aGljaCBnZXRzIHRoZSB1cGRhdGVkIEFycmF5IG9mIGFsbCBqb3VybmFsIGVudHJpZXNcbiAgICAgICAgLnRoZW4gdGhlIHBhcnNlZFJlc3BvbnNlICh0aGUgZW50cnkgQXJyYXkpIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgcmVuZGVySm91cm5hbEVudHJpZXMgbWV0aG9kIG9mIHRoZSBET00gb2JqZWN0LCB3aGljaCBwdXRzIHRoZSB1cGRhdGVkIEFycmF5IGludG8gdGhlIERPTVxuICAgICAgICAqL1xuICAgICAgICBBUEkucG9zdEVudHJpZXMoYnVpbGRFbnRyeU9iamVjdChlbnRyeUNvbmNlcHRzLCBlbnRyeURhdGUsIGVudHJ5TWFpbiwgZW50cnlNb29kKSlcbiAgICAgICAgLypcbiAgICAgICAgUmVzZXQgdGhlIGlucHV0IGZpZWxkc1xuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm1cIikucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgcmFkaW9IYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9vZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKGVudHJpZXMgPT4gZW50cmllcy5maWx0ZXIoZW50cnkgPT4ge1xuICAgICAgICAgICAgaWYobW9vZCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNIYXBweSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZW50cnkubW9vZCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICAgICAgaXNIYXBweSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpc0hhcHB5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgIGxldCBpc09rYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGVudHJ5Lm1vb2QgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgICAgICBpc09rYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNPa2F5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiRGlzcGFpclwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaW5EaXNwYWlyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihlbnRyeS5tb29kID09PSBcIkRpc3BhaXJcIil7XG4gICAgICAgICAgICAgICAgICAgIGluRGlzcGFpciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbkRpc3BhaXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKS50aGVuKChyZXNwb25zZSkgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSk7XG4gICAgfSxcblxuICAgIGhhbmRsZURlbGV0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV07XG5cbiAgICAgICAgQVBJLmRlbGV0ZUVudHJ5KGVudHJ5SWQpLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSkudGhlbihyZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzcG9uc2UpKVxuICAgIH0sXG5cbiAgICBoYW5kbGVFZGl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXTtcblxuICAgICAgICBjb25zdCBlbnRyeUFydGljbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjam91cm5hbEVudHJ5LS0ke2VudHJ5SWR9YCk7XG4gICAgICAgIGxldCBlbnRyeVRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS10aXRsZS0tJHtlbnRyeUlkfWApLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgZW50cnlNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS1tYWluLS0ke2VudHJ5SWR9YCkudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgd2hpbGUoZW50cnlBcnRpY2xlLmZpcnN0Q2hpbGQpe1xuICAgICAgICAgICAgZW50cnlBcnRpY2xlLnJlbW92ZUNoaWxkKGVudHJ5QXJ0aWNsZS5maXJzdENoaWxkKVxuICAgICAgICB9O1xuXG4gICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihlbnRyeVRvRWRpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IEVOVFJZQ09NUC5idWlsZEVkaXRGb3JtKGVudHJ5VG9FZGl0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpO1xuICAgICAgICAgICAgZW50cnlBcnRpY2xlLmFwcGVuZENoaWxkKGVkaXRGb3JtKTtcbiAgICAgICAgfSlcblxuICAgIH0sXG4gICAgaGFuZGxlVXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZC5zcGxpdChcIi0tXCIpWzFdO1xuXG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LXRpdGxlXCIpO1xuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeU1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LW1haW5cIik7XG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVkaXQtZGF0ZVwiKTtcbiAgICAgICAgY29uc3QgZWRpdGVkRW50cnlNb29kID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb29kLWVkaXRcIik7XG5cbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5ID0gYnVpbGRFbnRyeU9iamVjdChlZGl0ZWRFbnRyeVRpdGxlLnZhbHVlLCBlZGl0ZWRFbnRyeURhdGUudmFsdWUsIGVkaXRlZEVudHJ5TWFpbi52YWx1ZSwgZWRpdGVkRW50cnlNb29kLnZhbHVlKVxuXG4gICAgICAgIEFQSS5wdXRFbnRyeShlbnRyeUlkLCBlZGl0ZWRFbnRyeSkudGhlbigoKSA9PiBBUEkuZ2V0RW50cmllcygpKS50aGVuKHJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpXG5cbiAgICB9LFxuXG4gICAgc2VhcmNoRXZlbnQ6IGZ1bmN0aW9uKEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYoS2V5Ym9hcmRFdmVudC5rZXkgPT09IFwiRW50ZXJcIil7XG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaElucHV0RmllbGQudmFsdWU7XG4gICAgICAgICAgICBBUEkuZ2V0RW50cmllcygpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoZW50cnkudGl0bGUuaW5jbHVkZXMoc2VhcmNoVGVybSkgfHwgZW50cnkuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpLnRoZW4oKCkgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3VsdHMpKTtcbiAgICAgICAgICAgICAgICBzZWFyY2hJbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZXZlbnRIYW5kbGVycztcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyBzZWFyY2hJbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIEtleWJvYXJkRXZlbnQgPT4ge1xuLy8gICAgIGNvbnN0IHNlYXJjaElucHV0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFbnRyeS1zZWFyY2hcIik7XG4vLyAgICAgaWYoS2V5Ym9hcmRFdmVudC5rZXkgPT09IFwiRW50ZXJcIil7XG4vLyAgICAgICAgIGxldCByZXN1bHRzID0gW107XG4vLyAgICAgICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dEZpZWxkLnZhbHVlO1xuLy8gICAgICAgICBBUEkuZ2V0RW50cmllcygpLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuZm9yRWFjaChlbnRyeSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgaWYoZW50cnkudGl0bGUuaW5jbHVkZXMoc2VhcmNoVGVybSkgfHwgZW50cnkuZW50cnkuaW5jbHVkZXMoc2VhcmNoVGVybSkpe1xuLy8gICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVudHJ5KTtcbi8vICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGVudHJ5KTtcbi8vICAgICAgICAgICAgIH1cblxuLy8gICAgICAgICB9KSkudGhlbigoKSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzdWx0cykpXG4vLyAgICAgICAgIHNlYXJjaElucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuLy8gICAgIH1cbi8vIH0pIiwiY29uc3QgZm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbENvbnRhaW5lclwiKTtcblxuY29uc3QgZm9ybUhUTUwgPSB7XG5cbiAgICBidWlsZEZvcm1GaWVsZHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmb3JtQ29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICA8Zm9ybSBpZD1cImZvcm1cIj5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwiam91cm5hbERhdGUtLWZpZWxkc2V0XCI+XG4gICAgICAgICAgICA8bGVnZW5kPlNlbGVjdCBEYXRlPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImRhdGVcIiBuYW1lPVwiam91cm5hbERhdGVcIiBpZD1cImpvdXJuYWxEYXRlXCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldCBjbGFzcz1cImNvbmNlcHRzQ292ZXJlZC0tZmllbGRTZXRcIj5cbiAgICAgICAgICAgIDxsZWdlbmQ+RW50ZXIgVGl0bGU8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJjb25jZXB0c0NvdmVyZWRcIiBpZD1cImNvbmNlcHRzQ292ZXJlZFwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJqb3VybmFsRW50cnktLWZpZWxkc2V0XCI+XG4gICAgICAgICAgICA8bGVnZW5kPk1haW4gRW50cnk8L2xlZ2VuZD5cbiAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiam91cm5hbEVudHJ5XCIgaWQ9XCJqb3VybmFsRW50cnlcIiBjb2xzPVwiMzBcIiByb3dzPVwiMTBcIj48L3RleHRhcmVhPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJtb29kU2VsZWN0LS1maWVsZHNldFwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5TZWxlY3QgTW9vZDwvbGVnZW5kPlxuICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwibW9vZFNlbGVjdFwiIGlkPVwibW9vZFNlbGVjdFwiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJIYXBweVwiPkhhcHB5PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkp1c3QgT2theVwiPkp1c3QgT2theTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJEaXNwYWlyXCI+RGlzcGFpcjwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzdWJtaXRCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCI+UmVjb3JkIEpvdXJuYWwgRW50cnk8L2J1dHRvbj5cbiAgICA8L2Zvcm0+XG4gICAgPGhyLz5cbiAgICA8c2VjdGlvbiBpZD1cImZpbHRlclNlY3Rpb25cIj5cbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwibW9vZEZpbHRlclwiPlxuICAgICAgICAgICAgPGxlZ2VuZD5GaWx0ZXIgSm91cm5hbCBFbnRyaWVzIGJ5IE1vb2Q8L2xlZ2VuZD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJIYXBweVwiPkhhcHB5PGJyPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kRmlsdGVyUmFkaW9cIiB2YWx1ZT1cIkp1c3QgT2theVwiPkp1c3QgT2theTxicj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJEaXNwYWlyXCI+RGlzcGFpcjxicj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0IGlkPVwic2VhcmNoRW50cmllc1wiPlxuICAgICAgICAgICAgPGxlZ2VuZD5TZWFyY2ggam91cm5hbCBlbnRyaWVzPC9sZWdlbmQ+XG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJqb3VybmFsRW50cnktc2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBzZWFyY2ggdGVybVwiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgPC9zZWN0aW9uPlxuICAgIGBcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1IVE1MXG4iLCJpbXBvcnQgQVBJIGZyb20gXCIuL2RhdGFcIlxuaW1wb3J0IGZvcm1IVE1MIGZyb20gXCIuL2Zvcm1IVE1MXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5pbXBvcnQgZXZlbnRIYW5kbGVycyBmcm9tIFwiLi9ldmVudEhhbmRsZXJzXCJcblxuZm9ybUhUTUwuYnVpbGRGb3JtRmllbGRzKCk7XG4vL1RhcmdldCB0aGUgc3VibWl0IGJ1dHRvbiBhbmQgYXNzaWduIHRoZSB2YXJpYWJsZSBzdWJtaXRCdXR0b24gdG8gaXRcbmNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VibWl0QnV0dG9uXCIpO1xuXG5BUEkuZ2V0RW50cmllcygpLnRoZW4ocGFyc2VkUmVzcG9uc2UgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHBhcnNlZFJlc3BvbnNlKSk7XG5cblxuY29uc3QgZGVsZXRlQnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKFwiZGVsZXRlXCIpXG5kZWxldGVCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgZXZlbnRIYW5kbGVycy5oYW5kbGVEZWxldGVCdXR0b24oYnV0dG9uLmlkKVxuICAgIH0pO1xufSlcblxuLypcbiAgICBmdW5jdGlvbiBydW5zIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkLCBzdG9yaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIHRhcmdldHRlZCBlbGVtZW50cyBpbiB0aGUgaW5wdXQgZm9ybSBhdCB0aGUgdGltZSB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuIFRoZSBvdmVyYWxsIHB1cnBvc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyB0byBwb3N0IHRoZSBuZXcgam91cm5hbCBlbnRyeSBpbnRvIHRoZSBBUEkuIFRoZW4gaXQgd2lsbCBnZXQgdGhlIHVwZGF0ZWQgZW50cmllcyBmcm9tIHRoZSBBUEkgYW5kIHVwZGF0ZSB0aGUgRE9NIHdpdGggdGhlIG5ldyBlbnRyeS5cbiovXG5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuc3VibWl0SGFuZGxlcik7XG5kb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcIm1vb2RGaWx0ZXJSYWRpb1wiKS5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudEhhbmRsZXJzLnJhZGlvSGFuZGxlcil9KTtcblxuXG4iXX0=
