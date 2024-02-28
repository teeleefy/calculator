const { mean, median, mode } = require('./server');

beforeEach(function() {
  
});

describe("mean", function() {
  it("returns the average of an array of numbers", function() {
    expect(mean([1,2,3,4,5])).toBe(3);
    expect(mean([3,4,5])).toBe(4);
    
  });
});

describe("median", function() {
  it("returns the median of an array of numbers", function() {
    expect(median([4, 7, 1, 9, 9, 3])).toBe(4);
    expect(median([4, 7, 1, 9, 9, 3, 10])).toBe(7);
  });
});


describe("mode", function() {
  it("returns the mode of an array of numbers", function() {
    expect(mode([4, 7, 7])).toBe(7);
    expect(mode([4, 7, 1, 9, 9, 3, 10])).toBe(9);
  });
});

