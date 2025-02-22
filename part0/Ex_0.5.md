```mermaid
sequenceDiagram
    title 0.5 - Single page app diagram
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
```