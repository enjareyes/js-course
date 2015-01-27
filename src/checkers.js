
var board, currentPlayer, moveFrom, clickCounter;
//board represents the current state of the checkers board


var resetBoard = function () {
  board = [
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    ['wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X '],
    [' X ', 'wht', ' X ', 'wht', ' X ', 'wht', ' X ', 'wht'],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    [' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X ', ' X '],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X '],
    [' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ', 'red'],
    ['red', ' X ', 'red', ' X ', 'red', ' X ', 'red', ' X ']
  ];

  currentPlayer = 'wht';

  $(document).trigger('boardChange');
};

var numToChar = ["a", "b", "c", "d", "e", "f", "g", "h"];

var charToNum = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
}


$(document).on("invalidMove", function(event, message){
  alert(message);
});


var whichClick = function() {
  if (clickCounter == 1) {
    $(document).click(function(event) {
      var columnClass = $(event.target).attr("class"); //the class of the column being clicked
      var rowClass = $(event.target).parent().attr("class"); //the class of the row the column is in
      var therow = charToNum[rowClass.slice(-1)];
      var thecolumn = columnClass.slice(-1); //extracting the column number
      selectSquare(therow, thecolumn); //using the row and column to call selectSquare();
    })
  } else {
    $(document).click(function(event) {
      var col_class = $(event.target).attr("class");
      var row_class = $(event.target).parent().attr("class");
      var the_row = charToNum[row_class.slice(-1)];
      var the_col = col_class.slice(-1);
      moveTo(the_row, the_col);
    })
  }
};


clickCounter = 1

var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
    // whichClick();
  } 
  if (board[row][col] !== currentPlayer) {
    $(document).trigger('invalidMove', "You cannot move your opponents piece.")
    // whichClick();
  } else { // (board[row][col] == currentPlayer)
    console.log("reaching succesful selectSquare");
    moveFrom = board[row][col]; //save data 
    clickCounter = 2;
    // whichClick();
  }
};


var moveTo = function(torow, tocol) {
  var rowElement = $('.row.row-' + numToChar[torow]);
  var column = rowElement.children();
  var columnElement = $(column[tocol]);

  if (board[torow][tocol] !== ' X ') { 
    $(document).trigger('invalidMove', "You must move to an empty space.");
    whichClick();
  } else if (columnElement.hasClass('empty')) {
    $(document).trigger('invalidMove', "You cannot move to a red space.");   
    whichClick();
  } else {
    console.log("reached end of moveTo");
    board[torow][tocol] = currentPlayer;
    moveFrom = ' X ';
    console.log('Moved to row ' + torow + " : " + board[torow]);
    clickCounter = 1;
  }
}


$(document).ready(function() {
  resetBoard();
  // whichClick();
  selectSquare(2, 1);
  moveTo(3, 3); //invalid 
  // moveTo(3,2);

  // console.log(board);
})



//Driver 


var displayBoard = function () {
  var column = [0, 1, 2, 3, 4, 5, 6, 7];
  console.log("  | " + column.join("   "));
  console.log("-----------------------------------");
  for (var i = 0; i < board.length; i++) {
    console.log(numToChar[i] + " |" + board[i].join(" "));
  }
};

























