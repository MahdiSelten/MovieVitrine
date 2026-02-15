The project aims to be a real implementation of MovieVitrine Review Analysis and MovieVitrine Spam Detection, referred
in other repositories, the front-end is made using angular, implementating proper dynamic interfaces to showcase the movies.
The interfaces also showcase a contact form and under each movie, possibility to add a review which would be automatically
analyzed and classified through an API call that calls the model itself.
A pre-process pipeline was pre-defined to properly handle the user inputs, so when the model is called, the behavior persists on normal.
The back-end was using through consumption of previously trained models, exposing them as RESTFUL APIs.
A Mongo Database was also used to store data such as movies and users and accessed and manipulated also through FastAPI, predefining functions for CRUD.

The project also added common functionalities such as authentication and similar.

NOTE: Due to limitateions, current RNN model weights do not exist within the files, hereby, execution of a call to the review would require
another training and properly storing the file, this will be handled in the future.
