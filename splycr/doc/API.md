# Splycr REST API Documentation

## Users
------------------------------

### Create

Description: Sign up a new User
- Request: `POST /api/users/`
    - Content Type: `multipart/form-data`
    - Body: form fields
        - username (String): The user's desired unique ID
        - password (String): The user's desired password
        - (optional) profile-picture (`image/*`): The user's profile picture 
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The user's unique ID
        - created: (Date) The date this user was created
        - profile-picture: (object) The file metadata for the profile picture (or default image)
- Response: 400
    - Content Type: `application/json`
    - Body: object
        - (String) [field]: the invalid value for this field
        - (String) message: description of valid options for this field
```
$ curl  -X POST
        -H Content-Type: multipart/form-data" 
        -F "username=Alice" -F "password=secret" 
        -F "@localpath/to/AlicePhoto.png"
        http://localhost:3000/api/users/
```

### Read

Description: Get a page of Users
- Request: `GET /api/users/[?page=0]`
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - count: (integer) total number of users
        - users: list of objects, each with
            - _id: (string) The user's unique ID
            - created: (Date) The date this user was created
            - profile-picture: (object) The file metadata for the profile picture (or default image)
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authenticated"
```
$ curl -c cookie.txt http://localhost:3000/api/users/
```

Description: Get a particular User, identified by :uid
- Request: `GET /api/users/:uid`
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The user's unique ID
        - created: (Date) The date this user was created
        - profile-picture: (object) The file metadata for the profile picture (or default image)
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authenticated"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
```
$ curl -c cookie.txt http://localhost:3000/api/users/:uid
```

### Update

TBD

### Delete

Description: Get a particular User, identified by :uid
- Request: `DELETE /api/users/:uid`
- Response: 200
    - Content Type: `application/json`
    - Body: "Successfully deleted user :uid"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
```
$ curl -X DELETE -c cookie.txt http://localhost:3000/api/users/:id
```

## Sources
------------------------------

### Create

Description: Upload a new source 
- Request: `POST /api/sources/:uid`
    - Content Type: `multipart/form-data`
    - Body: form fields
        - title (String): The source's title
        - source (`video/*`): The source itself
        - tags (String): CSVs of top-level tags for this source
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The source's unique ID
        - owner: (String) The unique id of this source's owner
        - title (String): The source's title
        - source (`video/*`): The source itself
        - tags (String): CSVs of top-level tags for this source
        - created: (Date) The date this source was created
- Response: 400
    - Content Type: `application/json`
    - Body: object
        - (String) [field]: the invalid value for this field
        - (String) message: description of valid options for this field
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid

```
$ curl  -X POST
        -c cookie.txt 
        -H Content-Type: multipart/form-data" 
        -F "title=Title Of Video"
        -F "@localpath/to/VideoSourceFile.mp4"
        http://localhost:3000/api/sources/:uid
```

### Read

Description: Download a paginated list of (public if :uid not current user) sources belonging to user :uid
- Request: `GET /api/sources/:uid/[?page=0]`
- Response: 200
    - Content Type: `application/json`
    - Body: list
        - object:
            - _id: (string) The source's unique ID
            - title (String): The source's title
            - owner: (String) The unique id of this source's owner
            - source (`video/*`): The source itself
            - tags (String): CSVs of top-level tags for this source
            - created: (Date) The date this source was created
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uids
```
$ curl  -c cookie.txt 
        http://localhost:3000/api/sources/:uid/?page=0
```

Description: Get the source metadata identified by :id
- Request: `GET /api/sources/:uid/:id/metadata/`
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The source's unique ID
        - title (String): The source's title
        - owner: (String) The unique id of this source's owner
        - source (`video/*`): The source itself
        - tags (String): CSVs of top-level tags for this source
        - created: (Date) The date this source was created
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authorized"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such source :id
```
$ curl  -c cookie.txt 
        http://localhost:3000/api/sources/:uid/:id/metadata/
```

Description: Download (part of) the source file identified by :id
- Request: `GET /api/sources/:uid/:id/`
    - (optional) Content Range: bytes :start-:stop
- Response: 200
    - Content Type: `video/*`
- Response: 206
    - Content Type: `video/*`
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authorized"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such source :id
- Response: 416
    - Content Type: `application/json`
    - Body: Out of range: [:start-:stop]
```
$ curl  -c cookie.txt 
        -H "Range: bytes=0-1000
        http://localhost:3000/api/sources/:uid/:id/
```

### Update

TBD

### Delete

Description: Delete the source file identified by :id
- Request: `DELETE /api/sources/:uid/:id/`
- Response: 200
    - Content Type: `application/json`
    - Body: "Successfully deleted source :id"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such source :id
```
$ curl  -X DELETE
        -c cookie.txt 
        http://localhost:3000/api/sources/:uid/:id/
```


## Clips
------------------------------

### Create

Description: Save a new clip owned by the user uniquely identified by :uid
- Request: `POST /api/clips/:uid`
    - Content Type: `application/json`
    - Body: object
        - source (String): The unique id for the source from which this clip is cut
        - tags (String): CSVs of the tags for this clips
        - start (TimeIndex): The beginning of the clip
        - stop (TimeIndex): The ending of the clip
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The clip's unique ID
        - source (String): The unique id for the source from which this clip is cut
        - owner (String): The unique id of the owner of this clip
        - tags (String): CSVs of the tags for this clips
        - start (TimeIndex): The beginning of the clip
        - stop (TimeIndex): The ending of the clip
        - created: (Date) The date this clip was created
- Response: 400
    - Content Type: `application/json`
    - Body: object
        - (String) [field]: the invalid value for this field
        - (String) message: description of valid options for this field
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
```
$ curl  -X POST
        -c cookie.txt 
        -H Content-Type: "application/json"
        http://localhost:3000/api/clips/:uid/
```

### Read

Description: Get a paginated list of (public if :uid not current user) clips' data identified by the query string
- Request: `GET /api/clips/[?uid=all][&?vid=all][&?page=0][?tags[]=tag1][?tags[]=tag2]...`
- Response: 200
    - Content Type: `application/json`
    - Body: list
        - object:
            - _id: (string) The clip's unique ID
            - source (String): The unique id for the source from which this clip is cut
            - owner (String): The unique id of the owner of this clip
            - tags (String): CSVs of the tags for this clips
            - start (TimeIndex): The beginning of the clip
            - stop (TimeIndex): The ending of the clip
            - created: (Date) The date this clip was created
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authorized"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such video :vid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such tage :tag#
```
$ curl  -c cookie.txt 
    http://localhost:3000/api/clips/[?uid=all][&?vid=all][&?page=0][?tags[]=tag1][?tags[]=tag2]...
```

Description: Get the clip data identified by :id
- Request: `GET /api/clips//:uid/:id/`
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The clip's unique ID
        - source (String): The unique id for the source from which this clip is cut
        - owner (String): The unique id of the owner of this clip
        - tags (String): CSVs of the tags for this clips
        - start (TimeIndex): The beginning of the clip
        - stop (TimeIndex): The ending of the clip
        - created: (Date) The date this clip was created
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not authorized"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such source :id
```
$ curl  -c cookie.txt http://localhost:3000/api/clips/:id/
```

### Update

TBD

### Delete

Description: Delete the clip data identified by :id
- Request: `DELETE /api/clips/:id/`
- Response: 200
    - Content Type: `application/json`
    - Body: "Successfully deleted clip :id"
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such source :id
```
$ curl -X DELETE -c cookie.txt http://localhost:3000/api/clips/:id/
```

## Projects
------------------------------

### Create

Description: Save a new project owned by the user uniquely identified by :uid
- Request: `POST /api/projects/:uid`
    - Content Type: `application/json`
    - Body: object
        - clips (list):
            - (String) clipID
        - effects (list)
            - (object) effect:
                - start (TimeIndex): the start time index of this effect
                - stop (TimeIndex): the stop time index of this effect
                - type (String): the type of effect
                - data (String): the data associated with this effect
        - tags (String): CSVs of the tags for this projects
        - container (String): output container target
        - codec (String): output codec target
- Response: 200
    - Content Type: `application/json`
    - Body: object
        - _id: (string) The project's unique ID
        - owner (String): The unique id of the owner of this project
        - clips (list):
            - (String) clipID
        - effects (list)
            - (object) effect:
                - start (TimeIndex): the start time index of this effect
                - stop (TimeIndex): the stop time index of this effect
                - type (String): the type of effect
                - data (String): the data associated with this effect
        - tags (String): CSVs of the tags for this projects
        - container (String): output container target
        - codec (String): output codec target
- Response: 400
    - Content Type: `application/json`
    - Body: object
        - (String) [field]: the invalid value for this field
        - (String) message: description of valid options for this field
- Response: 401
    - Content Type: `application/json`
    - Body: "Not owner"
- Reponse: 404
    - Content Type: `application/json`
    - Body: No such user :uid
```
$ curl  -X POST
        -c cookie.txt 
        -H Content-Type: "application/json"
        http://localhost:3000/api/projects/:uid/
```

### Read

### Update

### Delete