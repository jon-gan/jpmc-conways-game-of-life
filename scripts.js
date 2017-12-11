var state = []; // true if cell is live, false otherwise
var rows = 0;
var cols = 0;
var runOutput = undefined; // will hold the interval for updating the output

/**
 * Generates the HTML for requesting the user's input on live cells.
 */
var generateInput = function generateInput() {
    var inputHtml = [];
    inputHtml.push("<table>");
    for (let i = 0; i < rows; i++) {
        inputHtml.push("<tr>");
        for (let j = 0; j < cols; j++) {
            inputHtml.push("<td><input type=\"checkbox\"></td>");
        }
        inputHtml.push("</tr>");
    }
    inputHtml.push("</table>");
    return inputHtml.join("");
}

/**
 * Reads the user's input on live cells and sets the state accordingly.
 */
var readInitialState = function readInitialState() {
    state = []
    $("#input table tr").each(function() {
        var row = [];
        $(this).find("td").each(function() {
            var checkbox = $(this).find("input[type=\"checkbox\"]");
            row.push(checkbox.is(":checked") ? true : false);
        })
        state.push(row);
    })
}

/**
 * Generates the HTML for displaying the results.
 */
var generateOutput = function generateOutput() {
    var outputHtml = [];
    outputHtml.push("<table>");
    for (let i = 0; i < rows; i++) {
        outputHtml.push("<tr>");
        for (let j = 0; j < cols; j++) {
            if (state[i][j]) {
                outputHtml.push("<td class=\"live\"></td>");
            } else {
                outputHtml.push("<td></td>");
            }
        }
        outputHtml.push("</tr>");
    }
    outputHtml.push("</table>");
    return outputHtml.join("");
}

/**
 * Returns true if the row and col refers to a valid cell, false otherwise.
 */
var isInBounds = function isInBounds(row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Returns the number of live neighbors of the cell at the row and col.
 */
var countLiveNeighbors = function countLiveNeighbors(row, col) {
    let liveNeighbors = 0;
    let adjacent = [
        [row-1, col],
        [row-1, col+1],
        [row, col+1],
        [row+1, col+1],
        [row+1, col],
        [row+1, col-1],
        [row, col-1],
        [row-1, col-1]
    ];
    for (let i = 0; i < adjacent.length; i++) {
        if (isInBounds(adjacent[i][0], adjacent[i][1])
                && state[adjacent[i][0]][adjacent[i][1]]) {
            liveNeighbors++;
        }
    }
    return liveNeighbors;
}

/**
 * Returns true if the cell should be live in the next iteration, false otherwise.
 */
var willBeLive = function willBeLive(row, col) {
    let liveNeighbors = countLiveNeighbors(row, col);

    // live cell with 2 or 3 live neighbors lives, dies otherwise
    if (state[row][col]) {
        return liveNeighbors == 2 || liveNeighbors == 3;
    // dead cell with 3 live neighbors becomes live
    } else {
        return liveNeighbors == 3;
    }
}

/**
 * Updates the state stored in memory with which cells should be live.
 */
var updateState = function updateState() {
    var nextState = [];
    for (let i = 0; i < rows; i++) {
        var nextRow = [];
        for (let j = 0; j < cols; j++) {
            nextRow.push(willBeLive(i, j));
        }
        nextState.push(nextRow);
    }
    state = nextState;
}

/**
 * Causes the output to run and get updated continuously.
 */
var run = function run() {
    $("#output").empty();
    $("#output").append(generateOutput());
    runOutput = setInterval(function() {
        $("#output").empty();
        $("#output").append(generateOutput());
        updateState();
    }, 1000);
}

/**
 * Stops the updating the output display.
 */
var stop = function stop() {
    clearInterval(runOutput);
}

/**
 * Resets state and associated variables.
 */
var reset = function reset() {
    state = [];
    rows = 0;
    cols = 0;
    runOutput = undefined;
}

$(document).ready(function() {

    $("#reset").hide();
    $("#run").hide();
    $("#input").hide();
    $("#output").hide();

    $("#reset-button").click(function() {
        stop();
        $("#reset").hide();
        $("#output").hide();
        $("#settings").show();
    });

    $("#generate-button").click(function() {
        rows = $("#rows-input").val();
        cols = $("#cols-input").val();

        $("#input").empty();
        $("#input").append(generateInput());

        $("#settings").hide();
        $("#run").show();
        $("#input").show();
    });

    $("#run-button").click(function() {
        readInitialState();
        run();
        $("#run").hide();
        $("#input").hide();
        $("#reset").show();
        $("#output").show();
    });

});
