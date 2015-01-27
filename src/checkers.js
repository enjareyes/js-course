
var board, currentPlayer, moveFrom;
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

var validSpot = function(row, col){

}

// first click 
var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
  } 
  if (board[row][col] !== currentPlayer) {
    $(document).trigger('invalidMove', "You cannot move your opponents piece.")
  } else { // (board[row][col] == currentPlayer)
    moveFrom = board[row][col]; //save data 
    //listen for second click
  }
};

//second click
var moveTo = function(torow, tocol) {
  var rowElement = $('.row.row-' + numToChar[torow]);
  var column = rowElement.children();
  var columnElement = $(column[tocol]);
  console.log(columnElement);
  console.log(columnElement.hasClass('empty') === true);
  // var col_element = $(rowElement).eq(tocol);

  if (board[torow][tocol] !== ' X ') { 
    $(document).trigger('invalidMove', "You must move to an empty space.");
  } 
  // else if (col_element.hasClass('empty')) {
  else if (columnElement.hasClass('empty') === true) {
    console.log("reaching here")
    $(document).trigger('invalidMove', "You cannot move to a red space.");    
  } 
  else {
    board[torow][tocol] = currentPlayer;
    moveFrom = ' X ';
    console.log('Moved to row ' + torow + " : " + board[torow]);
  }
}


$(document).ready(function() {
  resetBoard();
  selectSquare(2, 1);
  moveTo(3, 3); //invalid 

  // console.log(board);
})





