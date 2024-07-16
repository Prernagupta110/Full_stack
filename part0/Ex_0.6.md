```mermaid
sequenceDiagram
    title 0.6 - New note in Single page app diagram
    participant Browser
    participant Server

    Browser->Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate Server
    Server-->Browser: HTML document
    deactivate Server

    Browser->Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate Server
    Server-->Browser: the CSS file
    deactivate Server

    Browser->Server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate Server
    Server-->Browser: the JavaScript file
    deactivate Server
    note right of Browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    Browser->Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate Server
    Server-->Browser: [{content: "Hello!", date: "2024-04-21T14:15:39.733Z"},...]
    deactivate Server
    note right of Browser: The browser executes the callback function  that renders the notes

    Browser->Server: POST [https://studies.cs.helsinki.fi/exampleapp/new_note_spa]
    activate Server
    Server-->Browser: application/json [{content: "HOLAA", date: "2024-04-22T00:22:39.904Z"}]
    deactivate Server
    note right of Browser:The server responds with HTTP status code 201
```