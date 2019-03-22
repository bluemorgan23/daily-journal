/*
    Modularized version of former code. Created the API object that defines two methods, getEntries and postEntries.
    getEntries pulls the entries from the API with a fetch call
    postEntries will post a new to the API 
*/
const url = "http://localhost:8088/allEntries";

const API = {

    getEntries: function() {
    return fetch(url)
        .then(response => response.json());
    },
    
    postEntries: function(newEntryObject) {
        return fetch(url, {
                method: "POST",
                body: JSON.stringify(newEntryObject),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json());
    }

    // deleteEntry: function(entryId) {
    //     fetch(`${url}/${entryId}`, {
    //         method: "DELETE"
    //     })
    // }
    
}

const deleteEntry = (entryId) => fetch(`${url}/${entryId}`, {
    method: "DELETE"
})
