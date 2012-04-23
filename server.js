var Server = require("qunit-express");

var s = new Server();
s.addReferenceDirectory("libs", "tests");
s.start();
