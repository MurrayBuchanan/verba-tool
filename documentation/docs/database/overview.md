---
sidebar_position: 1
---

# Database Design
The system uses a PostgreSQL database, this allows for scalability and schema reinitialisation. This can be containerised or migrated to cloud services such as [Azure Database for PostgreSQL](https://azure.microsoft.com/en-gb/products/postgresql/) or [DevWeb Strathclyde](https://docs.cis.strath.ac.uk/devweb/postgresql/) 

![Entity-Relationship Diagram](/img/entity-relationship_diagram.png)

### Schemas

- **User:** This stores the user's id allowing for future scalability for RBAC without making architectural changes.
- **Profile:** This stores the data of an individual who is being monitored. 
- **Transcript Metadata:** This stores the main information associated with a transcript.
- **Transcript Segments:** This stores the text segments of a transcript.
- **Transcript Features:** This stores the linguistic indicator scores for a transcript.
- **Intervention:** This stores an intervention strategy, including goals, span and whether it was a success.
