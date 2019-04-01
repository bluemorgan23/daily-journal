/*
    Modularized version of former code. Created the API object that defines two methods, getEntries and postEntries.
    getEntries pulls the entries from the API with a fetch call
    postEntries will post a new to the API
*/
import DOM from "./entriesDom"
const url = "http://localhost:8088/allEntries";

const API = {

    getEntries: function() {
    return fetch(`${url}/?_expand=mood`)
        .then(response => response.json());
    },

    postEntries: function(newEntryObject) {
        return fetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(newEntryObject),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(() => API.getEntries())
            .then(response => DOM.renderJournalEntries(response));
    },

    deleteEntry: function(entryId) {
        return fetch(`${url}/${entryId}`, {
            method: "DELETE"
        })
    },

    putEntry: function(entryId, updatedEntryObject) {
        return fetch(`${url}/${entryId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedEntryObject)
        })
    },

    patchEntry: function(entryId, updatedEntryObject) {
        return fetch(`${url}/${entryId}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedEntryObject)
        })
    }

}

export default API;