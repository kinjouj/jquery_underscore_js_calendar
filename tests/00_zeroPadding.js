var assert = buster.assertions.assert;

buster.testCase("zeroPadding", {
  "zeroPadding test": function() {
    assert.equals("01", zeroPadding(1));
    assert.equals("12", zeroPadding(12));
    assert.equals(zeroPadding(), undefined);
    assert.equals(zeroPadding(null), null);
  }
});
