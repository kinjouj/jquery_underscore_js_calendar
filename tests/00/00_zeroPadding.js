test("zeroPadding", function() {
  equal("01", zeroPadding(1), "argument is '1' returned '01'");
  equal("12", zeroPadding(12), "argument is '12' returned '12'");
  equal(zeroPadding(), undefined, "argument is undefined returned undefined");
  equal(zeroPadding(null), null, "argument is null returned null");
});
