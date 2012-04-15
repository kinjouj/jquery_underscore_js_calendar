module.exports['calendar tests'] = {
  "environment": "browser",
  "libs": ["jquery.js", "underscore.js"],
  "sources": ["calendar.js"],
  "tests": ["tests/*.js"],
  "resources": [
    { "path": "/api/calendar/2012/04", "content": JSON.stringify([1,3,5]) }
  ]
};
