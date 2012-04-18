module.exports['calendar tests'] = {
  "environment": "browser",
  "libs": ["libs/*.js"],
  "sources": ["calendar.js"],
  "tests": ["tests/*.js"],
  "resources": [
    { "path": "/api/calendar/2012", "content": JSON.stringify({ "4": [1,3,5] }) }
  ]
};
