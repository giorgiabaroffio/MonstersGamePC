Storage Backend for SmartH2O Monster Game.
=================

Headers
-------
In order to allow future modifications it has been chosen to force the remote Host to choose the output format of the APIs.

This is done using the **Accept** HTTP Header.

**Accepted Formats**:

* application/json

If the header is not set as a common Web Application is goes for the default text/html format, that is currently non implemented.

If you receive a **501** : **not implemented** error first check the **Accept** Header of your request.

HTTP Methods
------------

* **GET** to obtain data
* **POST** to add new data or to do one time operations
* **PUT** to update elements
* **DELETE** to remove items


Stored Objects
--------------
**Question**

fields:

* id: { type: Number, min: 0, index: { unique: true }}
* question_text: { type: String, index: { unique: false }}
* answers : [ **Answer** ]
* correct_answer: { type: Number, min: 0}
* type: { type: Number, min: 0, index: { unique: false }}


**Answer**

fields:

* id: { type: Number, min: 0, index: { unique: true }}
* answer_text: { type: String, index: { unique: false }}


**Monster**

fields:

* id: { type: Number, min: 0, index: { unique: true }}
* name: { type: String, index: { unique: true }}
* type: { type: Number, min: 0, index: { unique: false }}


Error Handling
--------------
**JSON**

If there is an error during the process, due to a **Bad** **Route**, a **Missing** or **Wrong** **Parameter** or to an **Internal** **Server** **Error** an error message will be returned.

Format:

```json
{
    "status": "KO",
    "errors": [{"location": "url|body|query|status|internal", 
        "name": "parameter that has generate the error",
        "message": "description of the error"
        }]
}
```

Good Request
------------

**JSON**

If there are not errors during the operation the following object will be sent:

```json
{
    "status": "OK"
    ... //Other data related to the api
}
```

Routes
------

Format:

**METHOD** : **PATH** 
description:

* __location__ : name : __optional__|__mandatory__ : description
* ...

The following routes are corrently available:

**GET** : /  
    get the status of the server

**Question**
________________

**GET** : /question  
returns the list of the questions

* __query__ : type : __optional__ : returns only questions of that type

Example result:
```json
{
    "status": "OK",
    "search_metadata": {
        "count": 100,
        "refresh_url": "?since_id=0&count=100"
    },
    "questions": [
        {
            "question_text": "Does it work?",
            "correct_answer": 0,
            "answers": [
                0,
                1
            ],
            "id": 0
        }
    ]
}
```

**POST** : /question  
adds a new question

* __body__ : question_text : __mandatory__ : the text of the question 
* __body__ : correct_answer : __mandatory__ : the id of the correct answer
* __body__ : type : __mandatory__ : the number identifying the type (level) of difficulty



Example result:
```json
{
    "status" : "OK",
    "id" : 0
}
```



**GET** : /question/:questionId 
returns a question

Example result:
```json
{
    "status": "OK",
    "question": {
        "question_text": "Does it work?",
        "correct_answer": 0,
        "answers": [
            0,
            1
        ],
        "id": 0
    }
}
```


**POST** : /question/:questionId/answer
adds an answer to the question

* __body__ : answer : __mandatory__ : the answer to add to the question

**DELETE** : /question/:questionId/answer  
remove an answer from the question

* __body__ : answer : __mandatory__ : the answer to remove from the question

**DELETE** : /question/:questionId/answer/:answerId
remove an answer from the question (same as the previous one, but with the id explicit in the url)



**Answer**
________________

**GET** : /answer  
returns the list of the answers

Example result:
```json
{
    "status": "OK",
    "search_metadata": {
        "count": 100,
        "refresh_url": "?since_id=1&count=100"
    },
    "answers": [
        {
            "answer_text": "no",
            "id": 1
        },
        {
            "answer_text": "yes",
            "id": 0
        }
    ]
}
```

**POST** : /answer  
adds a new answer

* __body__ : answer_text : __mandatory__ : the text of the answer 

Example result:
```json
{
    "status" : "OK",
    "id" : 0
}
```

**GET** : /answer/:answerId 
returns an answer

Example result:
```json
{
    "status": "OK",
    "answer": {
        "answer_text": "yes",
        "id": 0
    }
}
```


**Monster**
________________

**GET** : /monster  
returns the list of the monsters

Example result:
```json
{
    "status": "OK",
    "search_metadata": {
        "count": 100,
        "refresh_url": "?since_id=1&count=100"
    },
    "answers": [
        {
            "answer_text": "no",
            "id": 1
        },
        {
            "answer_text": "yes",
            "id": 0
        }
    ]
}
```

**POST** : /answer  
adds a new answer

* __body__ : answer_text : __mandatory__ : the text of the answer 

Example result:
```json
{
    "status" : "OK",
    "id" : 0
}
```

**GET** : /answer/:answerId 
returns an answer

Example result:
```json
{
    "status": "OK",
    "answer": {
        "answer_text": "yes",
        "id": 0
    }
}
```