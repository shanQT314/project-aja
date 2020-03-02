# Splycr

A collaborative class assignment for UTSC's CSCC09 Web Development course.

This web application is a fully-featured multi-user video editor with client-side video post-processing and cloud-based storage for source files and projects.

## 

Link to deployed website: https://splycr.u4ium.org/

Link to youtube video: https://youtu.be/D3xLJ6RygOQ?t=30

Link to API Documentation: https://app.swaggerhub.com/apis-docs/otrante/c09/1.0.0#/users/signup


## Build and Run

```
cd splycr
npm install
npm start
```

## Team
- Joe Armitage
- Ahmad Shanqiti
- Adrian Wong

## Features 

### Beta
* *Watch*, *edit*, and *enjoy* most video formats
* *Clip* multiple videos together
* *Tag* sections of source videos to be used as clips
* Drag and drop support for *uploading* videos
* Editing includes:
    * *Save* a clip
    * *Join* separate clips from varied sources
    * *Trim* clips
* *Outputs* to mp4 video 
* Real time *preview* of your changes
* Potential *mobile* friendliness (no commitments here yet)

### Final
* *Share* the videos you’ve worked on 
* Add preset *transitions* between your videos
* Add introductions, titles, overlays, watermarks and credits using *templates*
* *Output* to most video container formats (as well as *GIFs!*) with a variety of codecs
* Add music or other *audio* channels overlaid or replacing clip audio
* Editing now also includes:
    * Change playback *speed*
    * *Rotate*, *reverse* and *resize*
    * *Snap clips* together by dragging and dropping
    * Change the *brightness*, *hue*, and much more!
* Video format, compression and re-encoding *conversions*

## Technologies Used

### Backend
* [Node.js](https://nodejs.org/en/) JavaScript runtime environment to build a **RESTful** API
* [MongoDB](https://www.mongodb.com/) to store and access data as JSON documents
* [Express](https://www.npmjs.com/package/express) web application framework to handle routing requests
* [FFmpeg](https://www.npmjs.com/package/ffmpeg) multimedia framework to decode, encode, filter and send video clips
* [Mocha](https://mochajs.org) framework for testing JS applications
* [Chai](https://www.chaijs.com/) Assertion library, also used for helping test JS applications
* [Google Cloud](https://console.cloud.google.com/) Using the Google Cloud Speech API in order to transcribe recordings into code
* [Web Workers](https://developers.google.com/web/fundamentals/primers/service-workers/) Used in order to do all the heavy stuff on other threads to ensure that the server doesn't take too long to process items

### Frontend
* [React](https://reactjs.org/) JavaScript library to develop an interactive UI
* [Interact.js](http://interactjs.io/) to improve drag and drop, and other gesture-based interactions
* [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) API to render/process edits and effects using client-side GPU


## Challenges
1. Avoiding load on server wherever possible by making full use of client-side resources, including client GPU
2. Clipping at interframes instead of keyframes without lag for rendering
3. Pre- and post-processing effects applied across clips and source media, integrating various codecs for flexibilty of input/output formats
4. Synchronizing audio- and video-channels in the rendered video as aligned in the editor
5. Simplification of a user interface with many features entry-level users do not need, while maintaining ready access to those features
