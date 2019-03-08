/*
    Modularized version of former code. Created the API object that defines two methods, getEntries and postEntries.
    getEntries pulls the entries from the API with a fetch call
    postEntries will post a new to the API 
*/

const API = {

    getEntries: function() {
    return fetch("http://localhost:8088/allEntries")
        .then(response => response.json());
    },
    
    postEntries: function(newEntryObject) {
        return fetch("http://localhost:8088/allEntries", {
                method: "POST",
                body: JSON.stringify(newEntryObject),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json());
        }
}

