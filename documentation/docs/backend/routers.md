---
sidebar_position: 6
---

# Routers
The server exposes a REST API with 4 routers: upload, transcripts, profiles, and interventions, which support create, read, update, and delete (CRUD) operations to manage user data. 

### Upload Router
- ```POST/upload```: Upload the conversation

### Transcript Router
- ```GET/transcripts```: Get all transcripts
- ```GET/transcripts/{transcript_id}```: Get a transcript
- ```DELETE/transcripts/{transcript_id}```: Delete a transcript

### Intervention Router
- ```POST/intervention```: Create an intervention
- ```GET/intervention```: Get all interventions
- ```GET/intervention/{intervention_id}```: Get an intervention
- ```PUT/intervention/{intervention_id}```: Update an intervention
- ```DELETE/intervention/{intervention_id}```: Delete an intervention

### Profile Router
- ```POST/profile```: Create a profile
- ```GET/profile```: Get all profiles for user
- ```GET/profile/{profile_id}```: Get a profile
- ```UPDATE/profile/{profile_id}```: Update a profile
- ```DELETE/profile/{profile_id}```: Delete a profile

The endpoints return HTTP status codes: 200, 404, and 500, rolling back any database changes when an exception occurs.

Additional endpoints can be added by adding the router to main.py, registering it using ```app.include_router(routerName.router)```