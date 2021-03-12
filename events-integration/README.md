# Open511, DIT and camera integration

An original integration Camel + Spring boot. Scheduled event retrieval from Open511 and DIT for events as well as Camera list from ```images.drivebc.ca``` API.

## DO NOT USE AS IS

To avoid pain and suffering during development or containerization
Migrate route code to Quarkus before usage. If migrated make sure that Events are delivered to Proxy endpoint ```camel\quarkus\events-wrapper-with-push```
