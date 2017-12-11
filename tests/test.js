mocha.setup("bdd");
var expect = chai.expect;

describe("HTML Generation", function() {

    afterEach(function() {
      reset();
    });

    it("generates the HTML for collecting input, for a 1x1 grid", function() {
        rows = 1;
        cols = 1;
        expect(generateInput()).to.equal("<table><tr><td><input type=\"checkbox\"></td></tr></table>");
    });

    it("generates the HTML for collecting input, for a larger grid", function() {
        rows = 2;
        cols = 2;
        expect(generateInput()).to.equal("<table><tr><td><input type=\"checkbox\"></td><td><input type=\"checkbox\"></td></tr><tr><td><input type=\"checkbox\"></td><td><input type=\"checkbox\"></td></tr></table>");
    });

    it("reads in the input for the initial state properly", function() {
        rows = 1;
        cols = 2;
        $("body").append("<div id=input><table><tr><td><input type=\"checkbox\" checked></td><td><input type=\"checkbox\"></td></tr></table></div>");
        readInitialState();
        expect(state[0][0]).to.equal(true);
        expect(state[0][1]).to.equal(false);
        $("#input").remove();
    });

    it("generates the HTML for displaying the output, for a 1x1 grid", function() {
        rows = 1;
        cols = 1;
        state = [[true]];
        expect(generateOutput()).to.equal("<table><tr><td class=\"live\"></td></tr></table>");
    });

    it("generates the HTML for displaying the output, for a larger grid", function() {
        rows = 1;
        cols = 2;
        state = [[true, false]];
        expect(generateOutput()).to.equal("<table><tr><td class=\"live\"></td><td></td></tr></table>");
    });

});

describe("State Update", function() {

    beforeEach(function() {
        rows = 3;
        cols = 3;
        state = [[false, true, false], [false, true, true], [true, false, false]];
    })

    afterEach(function() {
      reset();
    });

    it("determines whether a row and column pair is out of bounds", function() {
        expect(isInBounds(0, 0)).to.equal(true);
        expect(isInBounds(2, 2)).to.equal(true);
        expect(isInBounds(-1, 0)).to.equal(false);
        expect(isInBounds(3, 0)).to.equal(false);
        expect(isInBounds(0, 3)).to.equal(false);
    });

    it("determines the number of live neighbors", function() {
        expect(countLiveNeighbors(0, 0)).to.equal(2); // test a cell at the edge
        expect(countLiveNeighbors(1, 1)).to.equal(3); // test a cell in the middle
    });

    it("determines when a cell should be live", function() {
        expect(willBeLive(0, 0)).to.equal(false); // test a dead cell that should remain dead
        expect(willBeLive(2, 1)).to.equal(true); // test a dead cell that should become live
        expect(willBeLive(1, 1)).to.equal(true); // test a live cell that should remain live
        expect(willBeLive(2, 0)).to.equal(false); // test a live cell that should become dead
    });

    it("updates the state", function() {
        updateState();
        expect(state[0][0]).to.equal(false); // test a dead cell that should remain dead
        expect(state[2][1]).to.equal(true); // test a dead cell that should become live
        expect(state[1][1]).to.equal(true); // test a live cell that should remain live
        expect(state[2][0]).to.equal(false); // test a live cell that should become dead
    });

});

mocha.run();
