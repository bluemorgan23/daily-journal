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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEuanMiLCIuLi9zY3JpcHRzL2VudHJpZXNEb20uanMiLCIuLi9zY3JpcHRzL2VudHJ5Q29tcG9uZW50LmpzIiwiLi4vc2NyaXB0cy9ldmVudEhhbmRsZXJzLmpzIiwiLi4vc2NyaXB0cy9mb3JtSFRNTC5qcyIsIi4uL3NjcmlwdHMvam91cm5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUNLQTs7OztBQUxBOzs7OztBQU1BLE1BQU0sR0FBRyxHQUFHLGtDQUFaO0FBRUEsTUFBTSxHQUFHLEdBQUc7QUFFUixFQUFBLFVBQVUsRUFBRSxZQUFXO0FBQ3ZCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxtQ0FBUixDQUFMLENBQ0YsSUFERSxDQUNHLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBVCxFQURmLENBQVA7QUFFQyxHQUxPO0FBT1IsRUFBQSxXQUFXLEVBQUUsVUFBUyxjQUFULEVBQXlCO0FBQ2xDLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxFQUFSLEVBQVc7QUFDZixNQUFBLE1BQU0sRUFBRSxNQURPO0FBRWYsTUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxjQUFmLENBRlM7QUFHZixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYO0FBSE0sS0FBWCxDQUFMLENBT0YsSUFQRSxDQU9HLE1BQU0sR0FBRyxDQUFDLFVBQUosRUFQVCxFQVFGLElBUkUsQ0FRRyxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FSZixDQUFQO0FBU0gsR0FqQk87QUFtQlIsRUFBQSxXQUFXLEVBQUUsVUFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQU8sS0FBSyxDQUFFLEdBQUUsR0FBSSxJQUFHLE9BQVEsRUFBbkIsRUFBc0I7QUFDOUIsTUFBQSxNQUFNLEVBQUU7QUFEc0IsS0FBdEIsQ0FBWjtBQUdILEdBdkJPO0FBeUJSLEVBQUEsUUFBUSxFQUFFLFVBQVMsT0FBVCxFQUFrQixrQkFBbEIsRUFBc0M7QUFDNUMsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLElBQUcsT0FBUSxFQUFuQixFQUFzQjtBQUM5QixNQUFBLE1BQU0sRUFBRSxLQURzQjtBQUU5QixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRnFCO0FBSzlCLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsa0JBQWY7QUFMd0IsS0FBdEIsQ0FBWjtBQU9ILEdBakNPO0FBbUNSLEVBQUEsVUFBVSxFQUFFLFVBQVMsT0FBVCxFQUFrQixrQkFBbEIsRUFBc0M7QUFDOUMsV0FBTyxLQUFLLENBQUUsR0FBRSxHQUFJLElBQUcsT0FBUSxFQUFuQixFQUFzQjtBQUM5QixNQUFBLE1BQU0sRUFBRSxPQURzQjtBQUU5QixNQUFBLE9BQU8sRUFBRTtBQUNMLHdCQUFnQjtBQURYLE9BRnFCO0FBSzlCLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFMLENBQWUsa0JBQWY7QUFMd0IsS0FBdEIsQ0FBWjtBQU9IO0FBM0NPLENBQVo7ZUErQ2UsRzs7Ozs7Ozs7Ozs7QUNsRGY7Ozs7QUFMQTs7OztBQU9BLE1BQU0sR0FBRyxHQUFHO0FBRVIsRUFBQSxvQkFBb0IsRUFBRSxVQUFTLFlBQVQsRUFBdUI7QUFDN0MsVUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBakI7QUFFQSxJQUFBLFFBQVEsQ0FBQyxTQUFULEdBQXFCLEVBQXJCO0FBQ0EsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixLQUFLLElBQUk7QUFDMUIsTUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQix3QkFBVSx5QkFBVixDQUFvQyxLQUFwQyxDQUFyQjtBQUNILEtBRkQ7QUFHQztBQVRPLENBQVo7ZUFZZSxHOzs7Ozs7Ozs7OztBQ2hCZjs7OztBQUhBOzs7QUFLQSxNQUFNLE9BQU8sR0FBRyxDQUFDLEVBQUQsRUFBSyxJQUFMLEVBQVcsRUFBWCxFQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsS0FBcUM7QUFDakQsTUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBWjtBQUNBLEVBQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsSUFBcEI7O0FBQ0EsTUFBRyxFQUFILEVBQU07QUFDRixJQUFBLEtBQUssQ0FBQyxFQUFOLEdBQVcsRUFBWDtBQUNIOztBQUNELE1BQUcsSUFBSCxFQUFRO0FBQ0osSUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixNQUFuQixFQUEyQixJQUEzQjtBQUNIOztBQUVELE1BQUcsSUFBSCxFQUFRO0FBQ0osSUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixNQUFuQixFQUEyQixJQUEzQjtBQUNIOztBQUNELE1BQUcsS0FBSCxFQUFTO0FBQ0wsSUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixPQUFuQixFQUE0QixLQUE1QjtBQUNIOztBQUNELFNBQU8sS0FBUDtBQUNILENBakJEOztBQW1CQSxNQUFNLFNBQVMsR0FBRztBQUVkLEVBQUEseUJBQXlCLEVBQUUsVUFBUyxZQUFULEVBQXVCO0FBQ2xEO0FBQ0EsVUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUExQjtBQUNBLElBQUEsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MseUJBQWhDO0FBQ0EsSUFBQSxpQkFBaUIsQ0FBQyxTQUFsQixDQUE0QixHQUE1QixDQUFnQyxNQUFoQztBQUNBLElBQUEsaUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MsVUFBaEM7QUFDQSxJQUFBLGlCQUFpQixDQUFDLEVBQWxCLEdBQXdCLGlCQUFnQixZQUFZLENBQUMsRUFBRyxFQUF4RDtBQUNBLFVBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFELEVBQVEsR0FBRSxZQUFZLENBQUMsS0FBTSxFQUE3QixFQUFpQyx1QkFBc0IsWUFBWSxDQUFDLEVBQUcsRUFBdkUsQ0FBMUI7QUFDQSxJQUFBLFVBQVUsQ0FBQyxTQUFYLENBQXFCLEdBQXJCLENBQXlCLGFBQXpCO0FBQ0EsSUFBQSxVQUFVLENBQUMsU0FBWCxDQUFxQixHQUFyQixDQUF5QixNQUF6QjtBQUNBLFVBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFELEVBQU0sWUFBWSxDQUFDLEtBQW5CLEVBQTJCLHNCQUFxQixZQUFZLENBQUMsRUFBRyxFQUFoRSxDQUF6QjtBQUNBLElBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEI7QUFDQSxVQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRCxFQUFNLFlBQVksQ0FBQyxJQUFiLENBQWtCLEtBQXhCLEVBQWdDLHNCQUFxQixZQUFZLENBQUMsRUFBRyxFQUFyRSxDQUF6QjtBQUNBLElBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEI7QUFDQSxVQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRCxFQUFPLEdBQUUsWUFBWSxDQUFDLElBQUssRUFBM0IsRUFBOEIsc0JBQXFCLFlBQVksQ0FBQyxFQUFHLEVBQW5FLENBQXpCO0FBQ0EsSUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixHQUFwQixDQUF3QixXQUF4QjtBQUNBLFVBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFELEVBQU8sZUFBYyxZQUFZLENBQUMsVUFBYixDQUF3QixTQUFVLElBQUcsWUFBWSxDQUFDLFVBQWIsQ0FBd0IsUUFBUyxFQUEzRixDQUEvQjtBQUNBLElBQUEsZUFBZSxDQUFDLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLFdBQTlCO0FBQ0EsVUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEtBQUQsQ0FBL0I7QUFDQSxJQUFBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixHQUExQixDQUE4QixNQUE5QjtBQUNBLElBQUEsZUFBZSxDQUFDLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLGNBQTlCO0FBQ0EsVUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQUQsRUFBVyxjQUFYLEVBQTJCLHdCQUF1QixZQUFZLENBQUMsRUFBRyxFQUFsRSxDQUE1QjtBQUNBLElBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsY0FBM0I7QUFDQSxJQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLEdBQXZCLENBQTJCLFlBQTNCO0FBQ0EsSUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixHQUF2QixDQUEyQixRQUEzQjtBQUNBLElBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsTUFBM0I7QUFDQSxJQUFBLFlBQVksQ0FBQyxnQkFBYixDQUE4QixPQUE5QixFQUF1Qyx1QkFBYyxrQkFBckQ7QUFDQSxVQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBRCxFQUFXLFlBQVgsRUFBMEIsc0JBQXFCLFlBQVksQ0FBQyxFQUFHLEVBQS9ELENBQTFCO0FBQ0EsSUFBQSxVQUFVLENBQUMsU0FBWCxDQUFxQixHQUFyQixDQUF5QixhQUF6QjtBQUNBLElBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekI7QUFDQSxJQUFBLFVBQVUsQ0FBQyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyx1QkFBYyxnQkFBbkQ7QUFDQSxJQUFBLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixVQUE1QjtBQUNBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLFlBQTVCO0FBQ0EsSUFBQSxpQkFBaUIsQ0FBQyxXQUFsQixDQUE4QixVQUE5QjtBQUNBLElBQUEsaUJBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBOUI7QUFDQSxJQUFBLGlCQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQTlCO0FBQ0EsSUFBQSxpQkFBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUE5QjtBQUNBLElBQUEsaUJBQWlCLENBQUMsV0FBbEIsQ0FBOEIsZUFBOUI7QUFDQSxJQUFBLGlCQUFpQixDQUFDLFdBQWxCLENBQThCLGVBQTlCO0FBQ0EsV0FBTyxpQkFBUDtBQUNDLEdBMUNhO0FBNENkLEVBQUEsYUFBYSxFQUFFLFVBQVMsV0FBVCxFQUFzQixTQUF0QixFQUFpQyxVQUFqQyxFQUE2QztBQUN4RCxRQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxzQkFBVCxFQUF2QjtBQUVBLFVBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFELENBQTVCO0FBQ0EsSUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixHQUF2QixDQUEyQixXQUEzQjtBQUNBLElBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsVUFBM0I7QUFDQSxVQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsV0FBYixDQUF5QixPQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBaEMsQ0FBdEI7QUFDQSxJQUFBLGFBQWEsQ0FBQyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLFdBQTVCO0FBQ0EsVUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsT0FBTyxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLGtCQUFyQixFQUF5QyxNQUF6QyxDQUFoQyxDQUFqQjtBQUNBLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsWUFBN0I7QUFFQSxVQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUE3QjtBQUNBLElBQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsT0FBTyxDQUFDLFFBQUQsRUFBVyxVQUFYLENBQWpDO0FBQ0EsSUFBQSxhQUFhLENBQUMsV0FBZCxDQUEwQixPQUFPLENBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsbUJBQXpCLENBQWpDO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixhQUE3QjtBQUVBLFVBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQTVCO0FBRUEsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixPQUFPLENBQUMsUUFBRCxFQUFXLE9BQVgsQ0FBaEM7QUFDQSxVQUFNLEtBQUssR0FBSSxPQUFPLENBQUMsVUFBRCxFQUFhLFNBQWIsRUFBd0Isa0JBQXhCLENBQXRCO0FBQ0EsSUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixNQUFuQixFQUEyQixHQUEzQjtBQUNBLElBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0I7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLEtBQXpCO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixZQUE3QjtBQUdBLFVBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQTVCO0FBQ0EsSUFBQSxZQUFZLENBQUMsV0FBYixDQUF5QixPQUFPLENBQUMsUUFBRCxFQUFXLGFBQVgsQ0FBaEM7QUFDQSxVQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsV0FBdEIsQ0FBMUI7QUFDQSxJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLE9BQU8sQ0FBQyxRQUFELEVBQVcsT0FBWCxFQUFvQixTQUFwQixFQUErQixTQUEvQixFQUEwQyxTQUExQyxFQUFxRCxPQUFyRCxDQUE5QjtBQUNBLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsT0FBTyxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFNBQXhCLEVBQW1DLFNBQW5DLEVBQThDLFNBQTlDLEVBQXlELFdBQXpELENBQTlCO0FBQ0EsSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixPQUFPLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsU0FBdEIsRUFBaUMsU0FBakMsRUFBNEMsU0FBNUMsRUFBdUQsU0FBdkQsQ0FBOUI7QUFDQSxJQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFVBQXpCO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixZQUE3QjtBQUVBLFVBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLFVBQUQsQ0FBbEM7QUFDQSxJQUFBLGtCQUFrQixDQUFDLFdBQW5CLENBQStCLE9BQU8sQ0FBQyxRQUFELEVBQVcsbUJBQVgsQ0FBdEM7QUFDQSxVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixpQkFBdEIsQ0FBaEM7QUFDQSxJQUFBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLE9BQU8sQ0FBQyxRQUFELEVBQVcsYUFBWCxFQUEwQixTQUExQixFQUFxQyxTQUFyQyxFQUFnRCxTQUFoRCxFQUEyRCxhQUEzRCxDQUFwQztBQUNBLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBTyxDQUFDLFFBQUQsRUFBVyxnQkFBWCxFQUE2QixTQUE3QixFQUF3QyxTQUF4QyxFQUFtRCxTQUFuRCxFQUE4RCxnQkFBOUQsQ0FBcEM7QUFDQSxJQUFBLGtCQUFrQixDQUFDLFdBQW5CLENBQStCLGdCQUEvQjtBQUNBLElBQUEsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsa0JBQTdCO0FBRUEsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQUQsRUFBVyxNQUFYLENBQTNCO0FBQ0EsSUFBQSxXQUFXLENBQUMsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsdUJBQWMsa0JBQXBEO0FBQ0EsSUFBQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixXQUE3QjtBQUNBLFdBQU8sZ0JBQVA7QUFDSDtBQTNGYSxDQUFsQjtlQThGZSxTOzs7Ozs7Ozs7OztBQ3RIZjs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEtBQWQsRUFBcUIsTUFBckIsRUFBNkIsWUFBN0IsS0FBOEM7QUFDbkUsTUFBSSxtQkFBbUIsR0FBRztBQUN0QixJQUFBLEtBQUssRUFBRSxLQURlO0FBRXRCLElBQUEsSUFBSSxFQUFFLElBRmdCO0FBR3RCLElBQUEsS0FBSyxFQUFFLEtBSGU7QUFJdEIsSUFBQSxNQUFNLEVBQUUsTUFKYztBQUt0QixJQUFBLFlBQVksRUFBRTtBQUxRLEdBQTFCO0FBUUEsU0FBTyxtQkFBUDtBQUNILENBVkQ7O0FBWUEsTUFBTSxhQUFhLEdBQUc7QUFDbEIsRUFBQSxhQUFhLEVBQUUsWUFBVztBQUN0Qjs7O0FBR0EsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsS0FBekQ7QUFDQSxVQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsS0FBakU7QUFDQSxVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixjQUF4QixFQUF3QyxLQUExRDtBQUNBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLFlBQXhCLEVBQXNDLEtBQXREO0FBQ0EsVUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FBbkI7QUFDQSxRQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixrQkFBeEIsRUFBNEMsS0FBbEU7O0FBRUEsWUFBTyxJQUFQO0FBQ0ksV0FBSyxlQUFlLEtBQUssYUFBekI7QUFDSSxRQUFBLGVBQWUsR0FBRyxDQUFsQjtBQUNBOztBQUNKLFdBQUssZUFBZSxLQUFLLGdCQUF6QjtBQUNJLFFBQUEsZUFBZSxHQUFHLENBQWxCO0FBQ0E7QUFOUjs7QUFTQSxZQUFPLElBQVA7QUFDSSxXQUFLLFNBQVMsS0FBSyxPQUFuQjtBQUNJLFFBQUEsU0FBUyxHQUFHLENBQVo7QUFDQTs7QUFDSixXQUFLLFNBQVMsS0FBSyxXQUFuQjtBQUNJLFFBQUEsU0FBUyxHQUFHLENBQVo7QUFDQTs7QUFDSixXQUFLLFNBQVMsS0FBSyxTQUFuQjtBQUNJLFFBQUEsU0FBUyxHQUFHLENBQVo7QUFDQTtBQVRSOztBQVlBLFFBQUcsYUFBYSxLQUFLLEVBQWxCLElBQXdCLFNBQVMsS0FBSyxFQUF6QyxFQUE0QztBQUN4QyxhQUFPLEtBQUssQ0FBQyx3QkFBRCxDQUFaO0FBQ0g7O0FBQUMsUUFBSSxTQUFTLENBQUMsTUFBVixHQUFtQixHQUF2QixFQUE0QjtBQUMxQixhQUFPLEtBQUssQ0FBQyx3QkFBRCxDQUFaO0FBQ0g7O0FBQ0QsSUFBQSxVQUFVLENBQUMsT0FBWCxDQUFtQixJQUFJLElBQUk7QUFDdkIsVUFBSSxTQUFTLENBQUMsUUFBVixDQUFtQixJQUFuQixDQUFKLEVBQThCO0FBQzFCLGVBQU8sS0FBSyxDQUFDLG9CQUFELENBQVo7QUFDUDtBQUNBLEtBSkQ7QUFPQTs7Ozs7O0FBS0Esa0JBQUksV0FBSixDQUFnQixnQkFBZ0IsQ0FBQyxhQUFELEVBQWdCLFNBQWhCLEVBQTJCLFNBQTNCLEVBQXNDLFNBQXRDLEVBQWlELGVBQWpELENBQWhDO0FBQ0E7Ozs7O0FBR0EsSUFBQSxRQUFRLENBQUMsY0FBVCxDQUF3QixNQUF4QixFQUFnQyxLQUFoQztBQUNILEdBdkRpQjtBQXlEbEIsRUFBQSxZQUFZLEVBQUUsWUFBVztBQUNyQixVQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLEtBQTFCOztBQUNBLGtCQUFJLFVBQUosR0FBaUIsSUFBakIsQ0FBc0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFSLENBQWUsS0FBSyxJQUFJO0FBQ3JELFVBQUcsSUFBSSxLQUFLLE9BQVosRUFBb0I7QUFDaEIsWUFBSSxPQUFPLEdBQUcsS0FBZDs7QUFFQSxZQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxLQUFxQixPQUF4QixFQUFnQztBQUM1QixVQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0g7O0FBQ0QsZUFBTyxPQUFQO0FBQ0gsT0FQRCxNQU9PLElBQUcsSUFBSSxLQUFLLFdBQVosRUFBd0I7QUFDM0IsWUFBSSxNQUFNLEdBQUcsS0FBYjs7QUFFQSxZQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxLQUFxQixXQUF4QixFQUFvQztBQUNoQyxVQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0g7O0FBQ0QsZUFBTyxNQUFQO0FBQ0gsT0FQTSxNQU9BLElBQUcsSUFBSSxLQUFLLFNBQVosRUFBc0I7QUFDekIsWUFBSSxTQUFTLEdBQUcsS0FBaEI7O0FBRUEsWUFBRyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsS0FBcUIsU0FBeEIsRUFBa0M7QUFDOUIsVUFBQSxTQUFTLEdBQUcsSUFBWjtBQUNIOztBQUNELGVBQU8sU0FBUDtBQUNIO0FBQ0osS0F2QmdDLENBQWpDLEVBdUJJLElBdkJKLENBdUJVLFFBQUQsSUFBYyxvQkFBSSxvQkFBSixDQUF5QixRQUF6QixDQXZCdkI7QUF3QkgsR0FuRmlCO0FBcUZsQixFQUFBLGtCQUFrQixFQUFFLFlBQVc7QUFDM0IsUUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBYSxFQUFiLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCLENBQTVCLENBQWQ7O0FBRUEsa0JBQUksV0FBSixDQUFnQixPQUFoQixFQUF5QixJQUF6QixDQUE4QixNQUFNLGNBQUksVUFBSixFQUFwQyxFQUFzRCxJQUF0RCxDQUEyRCxRQUFRLElBQUksb0JBQUksb0JBQUosQ0FBeUIsUUFBekIsQ0FBdkU7QUFDSCxHQXpGaUI7QUEyRmxCLEVBQUEsZ0JBQWdCLEVBQUUsWUFBVztBQUN6QixRQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLEVBQWIsQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsRUFBNEIsQ0FBNUIsQ0FBZDtBQUVBLFVBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXdCLGtCQUFpQixPQUFRLEVBQWpELENBQXJCO0FBQ0EsUUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBd0Isd0JBQXVCLE9BQVEsRUFBdkQsRUFBMEQsV0FBM0U7QUFDQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF3Qix1QkFBc0IsT0FBUSxFQUF0RCxFQUF5RCxXQUF6RTtBQUNBLFFBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXdCLDZCQUE0QixPQUFRLEVBQXJDLENBQXVDLFdBQTlELENBQXRCOztBQUVBLFdBQU0sWUFBWSxDQUFDLFVBQW5CLEVBQThCO0FBQzFCLE1BQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsWUFBWSxDQUFDLFVBQXRDO0FBQ0g7O0FBQUE7O0FBRUQsa0JBQUksVUFBSixHQUFpQixJQUFqQixDQUFzQixXQUFXLElBQUk7QUFDakMsWUFBTSxRQUFRLEdBQUcsd0JBQVUsYUFBVixDQUF3QixXQUF4QixFQUFxQyxTQUFyQyxFQUFnRCxVQUFoRCxFQUE0RCxlQUE1RCxDQUFqQjs7QUFDQSxNQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLFFBQXpCO0FBQ0gsS0FIRDtBQUtILEdBNUdpQjtBQTZHbEIsRUFBQSxrQkFBa0IsRUFBRSxZQUFXO0FBQzNCLFFBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsVUFBYixDQUF3QixFQUF4QixDQUEyQixLQUEzQixDQUFpQyxJQUFqQyxFQUF1QyxDQUF2QyxDQUFkO0FBRUEsVUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixvQkFBdkIsQ0FBekI7QUFDQSxVQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixtQkFBdkIsQ0FBeEI7QUFDQSxVQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixtQkFBdkIsQ0FBeEI7QUFDQSxRQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxLQUEzRDtBQUNBLFFBQUkscUJBQXFCLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLEVBQTJDLEtBQXZFOztBQUVBLFlBQU8sSUFBUDtBQUNJLFdBQUsscUJBQXFCLEtBQUssYUFBL0I7QUFDSSxRQUFBLHFCQUFxQixHQUFHLENBQXhCO0FBQ0E7O0FBQ0osV0FBSyxxQkFBcUIsS0FBSyxnQkFBL0I7QUFDSSxRQUFBLHFCQUFxQixHQUFHLENBQXhCO0FBQ0E7QUFOUjs7QUFTQSxZQUFPLElBQVA7QUFDSSxXQUFLLGVBQWUsS0FBSyxPQUF6QjtBQUNJLFFBQUEsZUFBZSxHQUFHLENBQWxCO0FBQ0E7O0FBQ0osV0FBSyxlQUFlLEtBQUssV0FBekI7QUFDSSxRQUFBLGVBQWUsR0FBRyxDQUFsQjtBQUNBOztBQUNKLFdBQUssZUFBZSxLQUFLLFNBQXpCO0FBQ0ksUUFBQSxlQUFlLEdBQUcsQ0FBbEI7QUFDQTtBQVRSOztBQVlBLFFBQUksV0FBVyxHQUFHLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQWxCLEVBQXlCLGVBQWUsQ0FBQyxLQUF6QyxFQUFnRCxlQUFlLENBQUMsS0FBaEUsRUFBdUUsZUFBdkUsRUFBd0YscUJBQXhGLENBQWxDOztBQUVBLGtCQUFJLFFBQUosQ0FBYSxPQUFiLEVBQXNCLFdBQXRCLEVBQW1DLElBQW5DLENBQXdDLE1BQU0sY0FBSSxVQUFKLEVBQTlDLEVBQWdFLElBQWhFLENBQXFFLFFBQVEsSUFBSSxvQkFBSSxvQkFBSixDQUF5QixRQUF6QixDQUFqRjtBQUVILEdBL0lpQjtBQWlKbEIsRUFBQSxXQUFXLEVBQUUsVUFBUyxhQUFULEVBQXdCO0FBQ2pDLFFBQUcsYUFBYSxDQUFDLEdBQWQsS0FBc0IsT0FBekIsRUFBaUM7QUFDN0IsVUFBSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsQ0FBdkI7QUFDQSxVQUFJLE9BQU8sR0FBRyxFQUFkO0FBQ0EsWUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsS0FBcEM7O0FBQ0Esb0JBQUksVUFBSixHQUFpQixJQUFqQixDQUFzQixRQUFRLElBQUksUUFBUSxDQUFDLE9BQVQsQ0FBaUIsS0FBSyxJQUFJO0FBQ3hELFlBQUcsS0FBSyxDQUFDLEtBQU4sQ0FBWSxRQUFaLENBQXFCLFVBQXJCLEtBQW9DLEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixDQUFxQixVQUFyQixDQUF2QyxFQUF3RTtBQUNwRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBYjtBQUNIO0FBQ0EsT0FKNkIsQ0FBbEMsRUFJUSxJQUpSLENBSWEsTUFBTSxvQkFBSSxvQkFBSixDQUF5QixPQUF6QixDQUpuQjs7QUFLSSxNQUFBLGdCQUFnQixDQUFDLEtBQWpCLEdBQXlCLEVBQXpCO0FBQ1A7QUFDSjtBQTdKaUIsQ0FBdEI7ZUFnS2UsYTs7Ozs7Ozs7OztBQ2hMZixNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixtQkFBdkIsQ0FBdEI7QUFFQSxNQUFNLFFBQVEsR0FBRztBQUViLEVBQUEsZUFBZSxFQUFFLFlBQVk7QUFDekIsV0FBTyxhQUFhLENBQUMsU0FBZCxHQUEyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQUFsQztBQStDSDtBQWxEWSxDQUFqQjtlQXFEZSxROzs7Ozs7QUN2RGY7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxrQkFBUyxlQUFULEcsQ0FDQTs7O0FBQ0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBckI7O0FBRUEsY0FBSSxVQUFKLEdBQWlCLElBQWpCLENBQXNCLGNBQWMsSUFBSSxvQkFBSSxvQkFBSixDQUF5QixjQUF6QixDQUF4Qzs7QUFHQSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsaUJBQVQsQ0FBMkIsUUFBM0IsQ0FBdEI7QUFDQSxhQUFhLENBQUMsT0FBZCxDQUFzQixNQUFNLElBQUk7QUFDNUIsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsTUFBTTtBQUNuQywyQkFBYyxrQkFBZCxDQUFpQyxNQUFNLENBQUMsRUFBeEM7QUFDSCxHQUZEO0FBR0gsQ0FKRDtBQU1BOzs7O0FBR0EsWUFBWSxDQUFDLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLHVCQUFjLGFBQXJEO0FBQ0EsUUFBUSxDQUFDLGlCQUFULENBQTJCLGlCQUEzQixFQUE4QyxPQUE5QyxDQUFzRCxNQUFNLElBQUk7QUFDNUQsRUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsdUJBQWMsWUFBL0M7QUFBNkQsQ0FEakU7QUFHQSxRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsRUFBK0MsZ0JBQS9DLENBQWdFLFNBQWhFLEVBQTJFLHVCQUFjLFdBQXpGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBNb2R1bGFyaXplZCB2ZXJzaW9uIG9mIGZvcm1lciBjb2RlLiBDcmVhdGVkIHRoZSBBUEkgb2JqZWN0IHRoYXQgZGVmaW5lcyB0d28gbWV0aG9kcywgZ2V0RW50cmllcyBhbmQgcG9zdEVudHJpZXMuXG4gICAgZ2V0RW50cmllcyBwdWxscyB0aGUgZW50cmllcyBmcm9tIHRoZSBBUEkgd2l0aCBhIGZldGNoIGNhbGxcbiAgICBwb3N0RW50cmllcyB3aWxsIHBvc3QgYSBuZXcgdG8gdGhlIEFQSVxuKi9cbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5jb25zdCB1cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9hbGxFbnRyaWVzXCI7XG5cbmNvbnN0IEFQSSA9IHtcblxuICAgIGdldEVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmZXRjaChgJHt1cmx9Lz9fZXhwYW5kPW1vb2QmX2V4cGFuZD1pbnN0cnVjdG9yYClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKTtcbiAgICB9LFxuXG4gICAgcG9zdEVudHJpZXM6IGZ1bmN0aW9uKG5ld0VudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9YCwge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkobmV3RW50cnlPYmplY3QpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSlcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXNwb25zZSkpO1xuICAgIH0sXG5cbiAgICBkZWxldGVFbnRyeTogZnVuY3Rpb24oZW50cnlJZCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7dXJsfS8ke2VudHJ5SWR9YCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIHB1dEVudHJ5OiBmdW5jdGlvbihlbnRyeUlkLCB1cGRhdGVkRW50cnlPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke3VybH0vJHtlbnRyeUlkfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgcGF0Y2hFbnRyeTogZnVuY3Rpb24oZW50cnlJZCwgdXBkYXRlZEVudHJ5T2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHt1cmx9LyR7ZW50cnlJZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRFbnRyeU9iamVjdClcbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsIi8qXG4gICAgTW9kdWxhcml6ZWQgdmVyc2lvbiBvZiBwcmV2aW91cyBjb2RlLiBDcmVhdGVkIERPTSBvYmplY3Qgd2hpY2ggZGVmaW5lcyB0aGUgcmVuZGVySm91cm5hbEVudHJpZXMgbWV0aG9kLiBUaGlzIG1ldGhvZCBkZWZpbmVzIHRoZSBjb250YWluZXIgZm9yIGFsbEVudHJpZXMgaW4gdGhlIERPTS4gSXQgbG9vcHMgdGhyb3VnaCBhbiBhcnJheSBvZiBlbnRyaWVzIGFuZCBhZGRzIGVhY2ggb2YgdGhlbSB0byB0aGUgZW50cnlMb2cgY29udGFpbmVyIC8gcmVuZGVycyB0aGVtIHRvIHRoZSBET00uIFRoaXMgbWV0aG9kIGlzIHRvIGJlIHVzZWQgd2l0aCBBUEkuZ2V0RW50cmllcygpIHdoaWNoIHJldHVybnMgYW4gYXJyYXkgYXMgYSBwYXJzZWRSZXNwb25zZS5cbiAgICBFTlRSWUNPTVAubWFrZUpvdXJuYWxFbnRyeUNvbXBvbmVudChlbnRyeSkgY3JlYXRlcyB0aGUgSFRNTCBzdHJ1Y3R1cmUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIGVudHJ5TG9nLiBTZWUgZW50cnlDb21wb25lbnQuanMgZm9yIHRoZSBmdW5jdGlvbiBleHByZXNzaW9uLlxuKi9cblxuaW1wb3J0IEVOVFJZQ09NUCBmcm9tIFwiLi9lbnRyeUNvbXBvbmVudFwiXG5cbmNvbnN0IERPTSA9IHtcblxuICAgIHJlbmRlckpvdXJuYWxFbnRyaWVzOiBmdW5jdGlvbihlbnRyaWVzQXJyYXkpIHtcbiAgICBjb25zdCBlbnRyeUxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW50cnlMb2dcIik7XG5cbiAgICBlbnRyeUxvZy5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGVudHJpZXNBcnJheS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgZW50cnlMb2cuYXBwZW5kQ2hpbGQoRU5UUllDT01QLm1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoZW50cnkpKTtcbiAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTTsiLCIvKlxuICAgIE1vZHVsYXJpemVkIHZlcnNpb24gb2YgcHJldmlvdXMgY29kZS4gVGhlIG9iaiBFTlRSWUNPTVAgaXMgZGVmaW5lZCBhbmQgY29udGFpbnMgdGhlIG1ha2VKb3VybmFsRW50cnlDb21wb25lbnQoam91cm5hbEVudHJ5KSBtZXRob2QgZXhwcmVzc2lvbi4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gYnVpbGQgYW4gSFRNTCBzdHJpbmcgb3V0IG9mIHRoZSBqb3VybmFsRW50cnkgb2JqZWN0IGJ5IHBhc3NpbmcgaW4gdGhlIHZhbHVlcyBmb3IgZWFjaCBrZXkuIFRoZSBqb3VybmFsRW50cnlPYmplY3QgaXMgZGVmaW5lZCBpbiBqb3VybmFsLmpzIC8gc2VlIGZvciByZWZlcmVuY2UuXG4qL1xuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmNvbnN0IGJ1aWxkRWwgPSAoZWwsIHRleHQsIGlkLCB0eXBlLCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgIGxldCBuZXdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWwpO1xuICAgIG5ld0VsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICBpZihpZCl7XG4gICAgICAgIG5ld0VsLmlkID0gaWQ7XG4gICAgfVxuICAgIGlmKHR5cGUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGUpO1xuICAgIH1cblxuICAgIGlmKG5hbWUpe1xuICAgICAgICBuZXdFbC5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIG5hbWUpO1xuICAgIH1cbiAgICBpZih2YWx1ZSl7XG4gICAgICAgIG5ld0VsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0VsO1xufVxuXG5jb25zdCBFTlRSWUNPTVAgPSB7XG5cbiAgICBtYWtlSm91cm5hbEVudHJ5Q29tcG9uZW50OiBmdW5jdGlvbihqb3VybmFsRW50cnkpIHtcbiAgICAvLyBDcmVhdGUgeW91ciBvd24gSFRNTCBzdHJ1Y3R1cmUgZm9yIGEgam91cm5hbCBlbnRyeVxuICAgIGNvbnN0IGRpdkVudHJ5Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiam91cm5hbEVudHJ5LS1jb250YWluZXJcIik7XG4gICAgZGl2RW50cnlDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XG4gICAgZGl2RW50cnlDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImJnLWxpZ2h0XCIpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmlkID0gYGpvdXJuYWxFbnRyeS0tJHtqb3VybmFsRW50cnkuaWR9YDtcbiAgICBjb25zdCBlbnRyeVRpdGxlID0gYnVpbGRFbChcImgzXCIsIGAke2pvdXJuYWxFbnRyeS50aXRsZX1gLCBgam91cm5hbEVudHJ5LXRpdGxlLS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBlbnRyeVRpdGxlLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWhlYWRlclwiKVxuICAgIGVudHJ5VGl0bGUuY2xhc3NMaXN0LmFkZChcIm1iLTNcIilcbiAgICBjb25zdCBlbnRyeU1haW4gPSBidWlsZEVsKFwicFwiLCBqb3VybmFsRW50cnkuZW50cnksIGBqb3VybmFsRW50cnktbWFpbi0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZW50cnlNYWluLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIik7XG4gICAgY29uc3QgZW50cnlNb29kID0gYnVpbGRFbChcInBcIiwgam91cm5hbEVudHJ5Lm1vb2QubGFiZWwsIGBqb3VybmFsRW50cnktbW9vZC0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZW50cnlNb29kLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIik7XG4gICAgY29uc3QgZW50cnlEYXRlID0gYnVpbGRFbChcInBcIiwgYCR7am91cm5hbEVudHJ5LmRhdGV9YCxgam91cm5hbEVudHJ5LWRhdGUtLSR7am91cm5hbEVudHJ5LmlkfWApO1xuICAgIGVudHJ5RGF0ZS5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgIGNvbnN0IGVudHJ5SW5zdHJ1Y3RvciA9IGJ1aWxkRWwoXCJwXCIsIGBJbnN0cnVjdG9yOiAke2pvdXJuYWxFbnRyeS5pbnN0cnVjdG9yLmZpcnN0TmFtZX0gJHtqb3VybmFsRW50cnkuaW5zdHJ1Y3Rvci5sYXN0TmFtZX1gKVxuICAgIGVudHJ5SW5zdHJ1Y3Rvci5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGJ1aWxkRWwoXCJkaXZcIik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJtYi0xXCIpO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uLWdyb3VwXCIpO1xuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGJ1aWxkRWwoXCJidXR0b25cIiwgXCJEZWxldGUgRW50cnlcIixgam91cm5hbEVudHJ5LWRlbGV0ZS0tJHtqb3VybmFsRW50cnkuaWR9YCk7XG4gICAgZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJkZWxldGUtZW50cnlcIik7XG4gICAgZGVsZXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4tZGFuZ2VyXCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuLXNtXCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwibWwtMVwiKTtcbiAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKTtcbiAgICBjb25zdCBlZGl0QnV0dG9uID0gYnVpbGRFbChcImJ1dHRvblwiLCBcIkVkaXQgRW50cnlcIiwgYGpvdXJuYWxFbnRyeS1lZGl0LS0ke2pvdXJuYWxFbnRyeS5pZH1gKTtcbiAgICBlZGl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG4td2FybmluZ1wiKVxuICAgIGVkaXRCdXR0b24uY2xhc3NMaXN0LmFkZChcImJ0bi1zbVwiKVxuICAgIGVkaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50SGFuZGxlcnMuaGFuZGxlRWRpdEJ1dHRvbik7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGVkaXRCdXR0b24pO1xuICAgIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5VGl0bGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5TWFpbik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoZW50cnlNb29kKTtcbiAgICBkaXZFbnRyeUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbnRyeURhdGUpO1xuICAgIGRpdkVudHJ5Q29udGFpbmVyLmFwcGVuZENoaWxkKGVudHJ5SW5zdHJ1Y3Rvcik7XG4gICAgZGl2RW50cnlDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uQ29udGFpbmVyKTtcbiAgICByZXR1cm4gZGl2RW50cnlDb250YWluZXI7XG4gICAgfSxcblxuICAgIGJ1aWxkRWRpdEZvcm06IGZ1bmN0aW9uKGVudHJ5T2JqZWN0LCBlbnRyeU1haW4sIGVudHJ5VGl0bGUpIHtcbiAgICAgICAgbGV0IGVkaXRGb3JtRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZpZWxkc2V0ID0gYnVpbGRFbChcImRpdlwiLCk7XG4gICAgICAgIGRhdGVGaWVsZHNldC5jbGFzc0xpc3QuYWRkKFwiY2FyZC10ZXh0XCIpO1xuICAgICAgICBkYXRlRmllbGRzZXQuY2xhc3NMaXN0LmFkZChcImJnLWxpZ2h0XCIpO1xuICAgICAgICBjb25zdCBlZGl0RGF0ZUxhYmVsID0gZGF0ZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsYWJlbFwiLCBcIkRhdGVcIikpO1xuICAgICAgICBlZGl0RGF0ZUxhYmVsLmNsYXNzTGlzdC5hZGQoXCJjYXJkLXRleHRcIilcbiAgICAgICAgY29uc3QgZWRpdERhdGUgPSBkYXRlRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcImlucHV0XCIsIHVuZGVmaW5lZCwgXCJqb3VybmFsRWRpdC1kYXRlXCIsIFwiZGF0ZVwiKSk7XG4gICAgICAgIGVkaXRGb3JtRnJhZ21lbnQuYXBwZW5kQ2hpbGQoZGF0ZUZpZWxkc2V0KTtcblxuICAgICAgICBjb25zdCB0aXRsZUZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aXRsZUZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJDb25jZXB0c1wiKSk7XG4gICAgICAgIHRpdGxlRmllbGRzZXQuYXBwZW5kQ2hpbGQoYnVpbGRFbChcInRleHRhcmVhXCIsIGVudHJ5VGl0bGUsIFwiam91cm5hbEVkaXQtdGl0bGVcIikpXG4gICAgICAgIGVkaXRGb3JtRnJhZ21lbnQuYXBwZW5kQ2hpbGQodGl0bGVGaWVsZHNldCk7XG5cbiAgICAgICAgY29uc3QgbWFpbkZpZWxkc2V0ID0gYnVpbGRFbChcImZpZWxkc2V0XCIpO1xuXG4gICAgICAgIG1haW5GaWVsZHNldC5hcHBlbmRDaGlsZChidWlsZEVsKFwibGVnZW5kXCIsIFwiRW50cnlcIikpO1xuICAgICAgICBjb25zdCBlbnRyeSA9IChidWlsZEVsKFwidGV4dGFyZWFcIiwgZW50cnlNYWluLCBcImpvdXJuYWxFZGl0LW1haW5cIikpO1xuICAgICAgICBlbnRyeS5zZXRBdHRyaWJ1dGUoXCJyb3dzXCIsIFwiNVwiKTtcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKFwiY29sc1wiLCBcIjUwXCIpO1xuICAgICAgICBtYWluRmllbGRzZXQuYXBwZW5kQ2hpbGQoZW50cnkpO1xuICAgICAgICBlZGl0Rm9ybUZyYWdtZW50LmFwcGVuZENoaWxkKG1haW5GaWVsZHNldCk7XG5cblxuICAgICAgICBjb25zdCBtb29kRmllbGRzZXQgPSBidWlsZEVsKFwiZmllbGRzZXRcIilcbiAgICAgICAgbW9vZEZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJTZWxlY3QgTW9vZFwiKSlcbiAgICAgICAgY29uc3QgbW9vZFNlbGVjdCA9IGJ1aWxkRWwoXCJzZWxlY3RcIiwgdW5kZWZpbmVkLCBcIm1vb2QtZWRpdFwiKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJIYXBweVwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIkhhcHB5XCIpKVxuICAgICAgICBtb29kU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJKdXN0IE9rYXlcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJKdXN0IE9rYXlcIikpXG4gICAgICAgIG1vb2RTZWxlY3QuYXBwZW5kQ2hpbGQoYnVpbGRFbChcIm9wdGlvblwiLCBcIkRpc3BhaXJcIiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgXCJEaXNwYWlyXCIpKVxuICAgICAgICBtb29kRmllbGRzZXQuYXBwZW5kQ2hpbGQobW9vZFNlbGVjdCk7XG4gICAgICAgIGVkaXRGb3JtRnJhZ21lbnQuYXBwZW5kQ2hpbGQobW9vZEZpZWxkc2V0KTtcblxuICAgICAgICBjb25zdCBpbnN0cnVjdG9yRmllbGRzZXQgPSBidWlsZEVsKFwiZmllbGRzZXRcIilcbiAgICAgICAgaW5zdHJ1Y3RvckZpZWxkc2V0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJsZWdlbmRcIiwgXCJTZWxlY3QgSW5zdHJ1Y3RvclwiKSlcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3RvclNlbGVjdCA9IGJ1aWxkRWwoXCJzZWxlY3RcIiwgdW5kZWZpbmVkLCBcImluc3RydWN0b3ItZWRpdFwiKVxuICAgICAgICBpbnN0cnVjdG9yU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJKaXNpZSBEYXZpZFwiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIkppc2llIERhdmlkXCIpKVxuICAgICAgICBpbnN0cnVjdG9yU2VsZWN0LmFwcGVuZENoaWxkKGJ1aWxkRWwoXCJvcHRpb25cIiwgXCJLcmlzdGVuIE5vcnJpc1wiLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBcIktyaXN0ZW4gTm9ycmlzXCIpKVxuICAgICAgICBpbnN0cnVjdG9yRmllbGRzZXQuYXBwZW5kQ2hpbGQoaW5zdHJ1Y3RvclNlbGVjdCk7XG4gICAgICAgIGVkaXRGb3JtRnJhZ21lbnQuYXBwZW5kQ2hpbGQoaW5zdHJ1Y3RvckZpZWxkc2V0KTtcblxuICAgICAgICBjb25zdCB1cGRhdGVFbnRyeSA9IGJ1aWxkRWwoXCJidXR0b25cIiwgXCJTYXZlXCIpO1xuICAgICAgICB1cGRhdGVFbnRyeS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5oYW5kbGVVcGRhdGVCdXR0b24pXG4gICAgICAgIGVkaXRGb3JtRnJhZ21lbnQuYXBwZW5kQ2hpbGQodXBkYXRlRW50cnkpO1xuICAgICAgICByZXR1cm4gZWRpdEZvcm1GcmFnbWVudDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEVOVFJZQ09NUFxuIiwiaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZW50cmllc0RvbVwiXG5pbXBvcnQgRU5UUllDT01QIGZyb20gXCIuL2VudHJ5Q29tcG9uZW50XCJcblxuY29uc3QgYnVpbGRFbnRyeU9iamVjdCA9ICh0aXRsZSwgZGF0ZSwgZW50cnksIG1vb2RJZCwgaW5zdHJ1Y3RvcklkKSA9PiB7XG4gICAgbGV0IG9iamVjdHNKb3VybmFsRW50cnkgPSB7XG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgZGF0ZTogZGF0ZSxcbiAgICAgICAgZW50cnk6IGVudHJ5LFxuICAgICAgICBtb29kSWQ6IG1vb2RJZCxcbiAgICAgICAgaW5zdHJ1Y3RvcklkOiBpbnN0cnVjdG9ySWRcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9iamVjdHNKb3VybmFsRW50cnk7XG59XG5cbmNvbnN0IGV2ZW50SGFuZGxlcnMgPSB7XG4gICAgc3VibWl0SGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGRlZmluZWQgdmFyaWFibGVzIHRoYXQgYXJlIHNldCBlcXVhbCB0byB0aGUgaW5wdXQgdmFsdWVzIHRhcmdldHRlZCBiZWxvd1xuICAgICAgICAqL1xuICAgICAgICBjb25zdCBlbnRyeURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpvdXJuYWxEYXRlXCIpLnZhbHVlO1xuICAgICAgICBjb25zdCBlbnRyeUNvbmNlcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25jZXB0c0NvdmVyZWRcIikudmFsdWU7XG4gICAgICAgIGNvbnN0IGVudHJ5TWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam91cm5hbEVudHJ5XCIpLnZhbHVlO1xuICAgICAgICBsZXQgZW50cnlNb29kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb29kU2VsZWN0XCIpLnZhbHVlO1xuICAgICAgICBjb25zdCBub3RBbGxvd2VkID0gW1wiKFwiLCBcIilcIiwgXCJ7XCIsIFwifVwiLCBcIjpcIiwgXCI7XCJdO1xuICAgICAgICBsZXQgZW50cnlJbnN0cnVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnN0cnVjdG9yU2VsZWN0XCIpLnZhbHVlO1xuXG4gICAgICAgIHN3aXRjaCh0cnVlKXtcbiAgICAgICAgICAgIGNhc2UoZW50cnlJbnN0cnVjdG9yID09PSBcIkppc2llIERhdmlkXCIpOlxuICAgICAgICAgICAgICAgIGVudHJ5SW5zdHJ1Y3RvciA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVudHJ5SW5zdHJ1Y3RvciA9PT0gXCJLcmlzdGVuIE5vcnJpc1wiKTpcbiAgICAgICAgICAgICAgICBlbnRyeUluc3RydWN0b3IgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKHRydWUpe1xuICAgICAgICAgICAgY2FzZShlbnRyeU1vb2QgPT09IFwiSGFwcHlcIik6XG4gICAgICAgICAgICAgICAgZW50cnlNb29kID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZW50cnlNb29kID09PSBcIkp1c3QgT2theVwiKTpcbiAgICAgICAgICAgICAgICBlbnRyeU1vb2QgPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlbnRyeU1vb2QgPT09IFwiRGlzcGFpclwiKTpcbiAgICAgICAgICAgICAgICBlbnRyeU1vb2QgPSAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoZW50cnlDb25jZXB0cyA9PT0gXCJcIiB8fCBlbnRyeU1haW4gPT09IFwiXCIpe1xuICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KFwiWW91IExlZnQgYSBGaWVsZCBCbGFua1wiKTtcbiAgICAgICAgfSBpZiAoZW50cnlNYWluLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KFwiWW91ciBlbnRyeSBpcyB0b28gbG9uZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBub3RBbGxvd2VkLmZvckVhY2goY2hhciA9PiB7XG4gICAgICAgICAgICBpZiAoZW50cnlNYWluLmluY2x1ZGVzKGNoYXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsZXJ0KFwiSWxsZWdhbCBDaGFyYWN0ZXJzXCIpO1xuICAgICAgICB9XG4gICAgICAgIH0pXG5cblxuICAgICAgICAvKlxuICAgICAgICBDYWxsIHRoZSBwb3N0RW50cmllcygpIG1ldGhvZCBmcm9tIHRoZSBBUEkgb2JqZWN0IChzZWUgZGF0YS5qcykgd2hpY2ggYWRkcyB0aGUgbmV3IGpvdXJuYWwgZW50cnkgdG8gdGhlIEFQSS4gVGhlIGZhY3RvcnkgZnVuY3Rpb24gYnVpbGRFbnRyeU9iamVjdCgpIGlzIHBhc3NlZCBpbiBhcyBhIHBhcmFtZXRlci5cbiAgICAgICAgLnRoZW4gYWZ0ZXIgdGhlIGVudHJ5IGlzIHBvc3RlZCwgY2FsbCB0aGUgZ2V0RW50cmllcygpIG1ldGhvZCBmcm9tIHRoZSBBUEkgb2JqZWN0IChzZWUgZGF0YS5qcykgd2hpY2ggZ2V0cyB0aGUgdXBkYXRlZCBBcnJheSBvZiBhbGwgam91cm5hbCBlbnRyaWVzXG4gICAgICAgIC50aGVuIHRoZSBwYXJzZWRSZXNwb25zZSAodGhlIGVudHJ5IEFycmF5KSBpcyBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJlbmRlckpvdXJuYWxFbnRyaWVzIG1ldGhvZCBvZiB0aGUgRE9NIG9iamVjdCwgd2hpY2ggcHV0cyB0aGUgdXBkYXRlZCBBcnJheSBpbnRvIHRoZSBET01cbiAgICAgICAgKi9cbiAgICAgICAgQVBJLnBvc3RFbnRyaWVzKGJ1aWxkRW50cnlPYmplY3QoZW50cnlDb25jZXB0cywgZW50cnlEYXRlLCBlbnRyeU1haW4sIGVudHJ5TW9vZCwgZW50cnlJbnN0cnVjdG9yKSlcbiAgICAgICAgLypcbiAgICAgICAgUmVzZXQgdGhlIGlucHV0IGZpZWxkc1xuICAgICAgICAqL1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcm1cIikucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgcmFkaW9IYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbW9vZCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgQVBJLmdldEVudHJpZXMoKS50aGVuKGVudHJpZXMgPT4gZW50cmllcy5maWx0ZXIoZW50cnkgPT4ge1xuICAgICAgICAgICAgaWYobW9vZCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaXNIYXBweSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYoZW50cnkubW9vZC5sYWJlbCA9PT0gXCJIYXBweVwiKXtcbiAgICAgICAgICAgICAgICAgICAgaXNIYXBweSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpc0hhcHB5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgIGxldCBpc09rYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGVudHJ5Lm1vb2QubGFiZWwgPT09IFwiSnVzdCBPa2F5XCIpe1xuICAgICAgICAgICAgICAgICAgICBpc09rYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaXNPa2F5O1xuICAgICAgICAgICAgfSBlbHNlIGlmKG1vb2QgPT09IFwiRGlzcGFpclwiKXtcbiAgICAgICAgICAgICAgICBsZXQgaW5EaXNwYWlyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZihlbnRyeS5tb29kLmxhYmVsID09PSBcIkRpc3BhaXJcIil7XG4gICAgICAgICAgICAgICAgICAgIGluRGlzcGFpciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbkRpc3BhaXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKS50aGVuKChyZXNwb25zZSkgPT4gRE9NLnJlbmRlckpvdXJuYWxFbnRyaWVzKHJlc3BvbnNlKSk7XG4gICAgfSxcblxuICAgIGhhbmRsZURlbGV0ZUJ1dHRvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCBlbnRyeUlkID0gZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV07XG5cbiAgICAgICAgQVBJLmRlbGV0ZUVudHJ5KGVudHJ5SWQpLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSkudGhlbihyZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzcG9uc2UpKVxuICAgIH0sXG5cbiAgICBoYW5kbGVFZGl0QnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXTtcblxuICAgICAgICBjb25zdCBlbnRyeUFydGljbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjam91cm5hbEVudHJ5LS0ke2VudHJ5SWR9YCk7XG4gICAgICAgIGxldCBlbnRyeVRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS10aXRsZS0tJHtlbnRyeUlkfWApLnRleHRDb250ZW50O1xuICAgICAgICBsZXQgZW50cnlNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2pvdXJuYWxFbnRyeS1tYWluLS0ke2VudHJ5SWR9YCkudGV4dENvbnRlbnQ7XG4gICAgICAgIGxldCBlbnRyeUluc3RydWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjam91cm5hbEVudHJ5LWluc3RydWN0b3ItLSR7ZW50cnlJZH1gLnRleHRDb250ZW50KVxuXG4gICAgICAgIHdoaWxlKGVudHJ5QXJ0aWNsZS5maXJzdENoaWxkKXtcbiAgICAgICAgICAgIGVudHJ5QXJ0aWNsZS5yZW1vdmVDaGlsZChlbnRyeUFydGljbGUuZmlyc3RDaGlsZClcbiAgICAgICAgfTtcblxuICAgICAgICBBUEkuZ2V0RW50cmllcygpLnRoZW4oZW50cnlUb0VkaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZWRpdEZvcm0gPSBFTlRSWUNPTVAuYnVpbGRFZGl0Rm9ybShlbnRyeVRvRWRpdCwgZW50cnlNYWluLCBlbnRyeVRpdGxlLCBlbnRyeUluc3RydWN0b3IpO1xuICAgICAgICAgICAgZW50cnlBcnRpY2xlLmFwcGVuZENoaWxkKGVkaXRGb3JtKTtcbiAgICAgICAgfSlcblxuICAgIH0sXG4gICAgaGFuZGxlVXBkYXRlQnV0dG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGVudHJ5SWQgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5pZC5zcGxpdChcIi0tXCIpWzFdO1xuXG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LXRpdGxlXCIpO1xuICAgICAgICBjb25zdCBlZGl0ZWRFbnRyeU1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFZGl0LW1haW5cIik7XG4gICAgICAgIGNvbnN0IGVkaXRlZEVudHJ5RGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVkaXQtZGF0ZVwiKTtcbiAgICAgICAgbGV0IGVkaXRlZEVudHJ5TW9vZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9vZC1lZGl0XCIpLnZhbHVlO1xuICAgICAgICBsZXQgZWRpdGVkRW50cnlJbnN0cnVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbnN0cnVjdG9yLWVkaXRcIikudmFsdWU7XG5cbiAgICAgICAgc3dpdGNoKHRydWUpe1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeUluc3RydWN0b3IgPT09IFwiSmlzaWUgRGF2aWRcIik6XG4gICAgICAgICAgICAgICAgZWRpdGVkRW50cnlJbnN0cnVjdG9yID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UoZWRpdGVkRW50cnlJbnN0cnVjdG9yID09PSBcIktyaXN0ZW4gTm9ycmlzXCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5SW5zdHJ1Y3RvciA9IDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2godHJ1ZSl7XG4gICAgICAgICAgICBjYXNlKGVkaXRlZEVudHJ5TW9vZCA9PT0gXCJIYXBweVwiKTpcbiAgICAgICAgICAgICAgICBlZGl0ZWRFbnRyeU1vb2QgPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZShlZGl0ZWRFbnRyeU1vb2QgPT09IFwiSnVzdCBPa2F5XCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5TW9vZCA9IDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlKGVkaXRlZEVudHJ5TW9vZCA9PT0gXCJEaXNwYWlyXCIpOlxuICAgICAgICAgICAgICAgIGVkaXRlZEVudHJ5TW9vZCA9IDM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZWRpdGVkRW50cnkgPSBidWlsZEVudHJ5T2JqZWN0KGVkaXRlZEVudHJ5VGl0bGUudmFsdWUsIGVkaXRlZEVudHJ5RGF0ZS52YWx1ZSwgZWRpdGVkRW50cnlNYWluLnZhbHVlLCBlZGl0ZWRFbnRyeU1vb2QsIGVkaXRlZEVudHJ5SW5zdHJ1Y3RvcilcblxuICAgICAgICBBUEkucHV0RW50cnkoZW50cnlJZCwgZWRpdGVkRW50cnkpLnRoZW4oKCkgPT4gQVBJLmdldEVudHJpZXMoKSkudGhlbihyZXNwb25zZSA9PiBET00ucmVuZGVySm91cm5hbEVudHJpZXMocmVzcG9uc2UpKVxuXG4gICAgfSxcblxuICAgIHNlYXJjaEV2ZW50OiBmdW5jdGlvbihLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmKEtleWJvYXJkRXZlbnQua2V5ID09PSBcIkVudGVyXCIpe1xuICAgICAgICAgICAgbGV0IHNlYXJjaElucHV0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pvdXJuYWxFbnRyeS1zZWFyY2hcIilcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gc2VhcmNoSW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgICAgIEFQSS5nZXRFbnRyaWVzKCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICBpZihlbnRyeS50aXRsZS5pbmNsdWRlcyhzZWFyY2hUZXJtKSB8fCBlbnRyeS5lbnRyeS5pbmNsdWRlcyhzZWFyY2hUZXJtKSl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKS50aGVuKCgpID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhyZXN1bHRzKSk7XG4gICAgICAgICAgICAgICAgc2VhcmNoSW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGV2ZW50SGFuZGxlcnM7IiwiY29uc3QgZm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbENvbnRhaW5lclwiKTtcblxuY29uc3QgZm9ybUhUTUwgPSB7XG5cbiAgICBidWlsZEZvcm1GaWVsZHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gYFxuICAgICAgICA8ZGl2ICBpZD1cImZvcm1DYXJkXCIgY2xhc3M9XCJjYXJkIGJnLWxpZ2h0XCI+XG4gICAgICAgIDxoMSBjbGFzcz1cImNhcmQtaGVhZGVyIGJnLXByaW1hcnkgdGV4dC13aGl0ZVwiPkRhaWx5IEpvdXJuYWw8L2gxPlxuICAgICAgICA8Zm9ybSBpZD1cImZvcm1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwibWItMFwiIGZvcj1cImpvdXJuYWxEYXRlXCI+U2VsZWN0IERhdGU8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiZGF0ZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cImpvdXJuYWxEYXRlXCIgaWQ9XCJqb3VybmFsRGF0ZVwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiam91cm5hbFRpdGxlLS1maWVsZHNldCBmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNvbmNlcHRzQ292ZXJlZFwiPkVudGVyIFRpdGxlPC9sZWdlbmQ+XG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBuYW1lPVwiY29uY2VwdHNDb3ZlcmVkXCIgaWQ9XCJjb25jZXB0c0NvdmVyZWRcIj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpvdXJuYWxFbnRyeS0tZmllbGRzZXQgZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1iLTBcIiBmb3I9XCJqb3VybmFsRW50cnlcIj5NYWluIEVudHJ5PC9sYWJlbD5cbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwiam91cm5hbEVudHJ5XCIgaWQ9XCJqb3VybmFsRW50cnlcIiBjb2xzPVwiMzBcIiByb3dzPVwiMTBcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9vZFNlbGVjdC0tZmllbGRzZXQgZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1iLTBcIiBmb3I9XCJtb29kU2VsZWN0XCI+U2VsZWN0IE1vb2Q8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwibW9vZFNlbGVjdFwiIGlkPVwibW9vZFNlbGVjdFwiPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSGFwcHlcIj5IYXBweTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSnVzdCBPa2F5XCI+SnVzdCBPa2F5PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJEaXNwYWlyXCI+RGlzcGFpcjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5zdHJ1Y3RvclNlbGVjdC0tZmllbGRzZXQgZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cIm1iLTBcIiBmb3I9XCJpbnN0cnVjdG9yU2VsZWN0XCI+U2VsZWN0IEluc3RydWN0b3I8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBuYW1lPVwiaW5zdHJ1Y3RvclNlbGVjdFwiIGlkPVwiaW5zdHJ1Y3RvclNlbGVjdFwiPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiSmlzaWUgRGF2aWRcIj5KaXNpZSBEYXZpZDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiS3Jpc3RlbiBOb3JyaXNcIj5LcmlzdGVuIE5vcnJpczwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tcHJpbWFyeSBidG4tc21cIiBpZD1cInN1Ym1pdEJ1dHRvblwiIHR5cGU9XCJidXR0b25cIj5SZWNvcmQgSm91cm5hbCBFbnRyeTwvYnV0dG9uPlxuICAgICAgICA8c2VjdGlvbiBpZD1cImZpbHRlckNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9vZEZpbHRlciBmb3JtLWNoZWNrXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJmb3JtLWNoZWNrXCIgZm9yPVwibW9vZEZpbHRlclJhZGlvXCI+RmlsdGVyIEpvdXJuYWwgRW50cmllcyBieSBNb29kPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJIYXBweVwiPkhhcHB5PGJyPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jaGVjay1pbnB1dFwiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJtb29kRmlsdGVyUmFkaW9cIiB2YWx1ZT1cIkp1c3QgT2theVwiPkp1c3QgT2theTxicj5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwibW9vZEZpbHRlclJhZGlvXCIgdmFsdWU9XCJEaXNwYWlyXCI+RGlzcGFpcjxicj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCIgaWQ9XCJzZWFyY2hFbnRyaWVzXCI+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiam91cm5hbEVudHJ5LXNlYXJjaFwiPlNlYXJjaCBqb3VybmFsIGVudHJpZXM8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJqb3VybmFsRW50cnktc2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJFbnRlciBzZWFyY2ggdGVybVwiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgPC9mb3JtPlxuICAgIDwvZGl2PlxuICAgIGBcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZvcm1IVE1MIiwiaW1wb3J0IEFQSSBmcm9tIFwiLi9kYXRhXCJcbmltcG9ydCBmb3JtSFRNTCBmcm9tIFwiLi9mb3JtSFRNTFwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2VudHJpZXNEb21cIlxuaW1wb3J0IGV2ZW50SGFuZGxlcnMgZnJvbSBcIi4vZXZlbnRIYW5kbGVyc1wiXG5cbmZvcm1IVE1MLmJ1aWxkRm9ybUZpZWxkcygpO1xuLy9UYXJnZXQgdGhlIHN1Ym1pdCBidXR0b24gYW5kIGFzc2lnbiB0aGUgdmFyaWFibGUgc3VibWl0QnV0dG9uIHRvIGl0XG5jb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1Ym1pdEJ1dHRvblwiKTtcblxuQVBJLmdldEVudHJpZXMoKS50aGVuKHBhcnNlZFJlc3BvbnNlID0+IERPTS5yZW5kZXJKb3VybmFsRW50cmllcyhwYXJzZWRSZXNwb25zZSkpO1xuXG5cbmNvbnN0IGRlbGV0ZUJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShcImRlbGV0ZVwiKVxuZGVsZXRlQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGV2ZW50SGFuZGxlcnMuaGFuZGxlRGVsZXRlQnV0dG9uKGJ1dHRvbi5pZClcbiAgICB9KTtcbn0pXG5cbi8qXG4gICAgZnVuY3Rpb24gcnVucyB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZCwgc3RvcmluZyB0aGUgdmFsdWVzIG9mIHRoZSB0YXJnZXR0ZWQgZWxlbWVudHMgaW4gdGhlIGlucHV0IGZvcm0gYXQgdGhlIHRpbWUgdGhlIGJ1dHRvbiBpcyBjbGlja2VkLiBUaGUgb3ZlcmFsbCBwdXJwb3NlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdG8gcG9zdCB0aGUgbmV3IGpvdXJuYWwgZW50cnkgaW50byB0aGUgQVBJLiBUaGVuIGl0IHdpbGwgZ2V0IHRoZSB1cGRhdGVkIGVudHJpZXMgZnJvbSB0aGUgQVBJIGFuZCB1cGRhdGUgdGhlIERPTSB3aXRoIHRoZSBuZXcgZW50cnkuXG4qL1xuc3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudEhhbmRsZXJzLnN1Ym1pdEhhbmRsZXIpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoXCJtb29kRmlsdGVyUmFkaW9cIikuZm9yRWFjaChidXR0b24gPT4ge1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXZlbnRIYW5kbGVycy5yYWRpb0hhbmRsZXIpfSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjam91cm5hbEVudHJ5LXNlYXJjaFwiKS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBldmVudEhhbmRsZXJzLnNlYXJjaEV2ZW50KVxuXG4iXX0=
