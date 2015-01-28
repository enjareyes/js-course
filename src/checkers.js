
var board, currentPlayer, moveFrom, clickCounter;  //board represents the current state of the checkers board


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




var validMove , validJump;


var isvalidMove_white = function(from_row, from_col, torow, tocol) {
  from_col_plus = (parseInt(from_col)+1)

  if (torow == (from_row+1)) {
    if (tocol == (from_col_plus) || (tocol == (from_col-1))) { //if it's in a diagonal only moving once space 
      //if (board[torow][tocol] == ' X ') { //and if the space is empty
      validMove = true;
     // };  
    } else {
      validMove = false;
    };
  } else if (torow == (from_row+2)) { //if it's in a diagonal moving two spaces (for a jump)
    if ((tocol == from_col_plus + 1) ) {//check if its moving forward two column spaces
      if (board[torow-1][tocol-1] == 'red') {
        validJump = true;
      };
    };
    if (tocol == (from_col-2)) { //check if it's moving back two column spaces
      if (board[torow-1][tocol+1] == 'red') {
        validJump = true;
      };
    };
  } else {
    validJump = false;
    validMove = false;
    console.log("INVALID white");
  }
}


var isValidMove_red = function(from_row, from_col, torow, tocol) {
  from_col_plus = (parseInt(from_col)+1)

  if (torow == (from_row-1)) {
    if ((tocol == (from_col-1)) || (tocol == (from_col_plus))) {//if it's in a diagonal only moving once space 
      // if (board[torow][tocol] == ' X ') { //and if the space is empty
        validMove = true;
      // };  
    } else {
      validJump = false;
    };
  } else if (torow == (from_row-2)) { //if it's in a diagonal moving two spaces (for a jump)
    if ((tocol == from_col_plus - 3) && (board[torow][tocol] == ' X ')) {//check if its moving forward two column spaces
      if (board[torow+1][tocol+1] == 'red') {
        validJump = true;
      };
    };
    if ((tocol == from_col + 2) && (board[torow][tocol] == ' X ')) { //check if it's moving back two column spaces
      if (board[torow+1][tocol-1] == 'red') {
        validJump = true;
      };
    };
  } else {
    validJump = false;
    validMove = false;
    console.log("INVALID red");
  }
}





clickCounter = 1;


var whichClick = function() {

    $('.col').click(function() {
      // console.log('----- ');
      // console.log(this);
      // console.log($(this).parent());
      var columnClass = $(this).attr("class"); //the class of the column being clicked
      var rowClass = $(this).parent().attr("class"); //the class of the row the column is in
      var therow = charToNum[rowClass.slice(-1)];
      var thecolumn = columnClass.slice(-1); //extracting the column number
      
      if (clickCounter === 1) {
        console.log(currentPlayer + 'selected piece: ');
        selectSquare(therow, thecolumn); //using the row and column to call selectSquare();
      } else {
        console.log(currentPlayer + 'moving piece to: ');
        moveTo(therow, thecolumn);
      };
    });
      
};




var from_row, from_col, to_row, to_col;


var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
    // whichClick();
  } 
  if (board[row][col] !== currentPlayer) {
    $(document).trigger('invalidMove', "You cannot move your opponents piece.")
    // whichClick();
  } else { // (board[row][col] == currentPlayer)
    console.log("succesfully selected piece to move");
    moveFrom = board[row][col]; //save data 
    from_row = row;
    from_col = col;
    clickCounter = 2;
    // return whichClick();
  }
};


var moveTo = function(torow, tocol) {
  to_row = torow;
  to_col = tocol;

  if (currentPlayer === 'wht') {
    isvalidMove_white(from_row, from_col, to_row, to_col);
  } else {
    isValidMove_red(from_row, from_col, to_row, to_col);
  };

  var rowElement = $('.row.row-' + numToChar[torow]);
  var column = rowElement.children();
  var columnElement = $(column[tocol]);

  if ((validMove == true) || (validJump == true)) {
    if (board[torow][tocol] !== ' X ') { 
      $(document).trigger('invalidMove', "You must move to an empty space.");
      whichClick();
    } else if (columnElement.hasClass('empty')) {
      console.log('nope');
      $(document).trigger('invalidMove', "You cannot move to a red space.");   
      whichClick();
    } else {
      console.log("reached end of moveTo!");
      board[torow][tocol] = currentPlayer;
      moveFrom = ' X ';
      console.log('Moved to row ' + torow + " : " + board[torow]);
      validJump = false;
      validMove = false;
      clickCounter = 1; //reset counter and validmove/jump variables for next move
        if (currentPlayer === 'wht') {
          currentPlayer = 'red';
        } else { 
          currentPlayer = 'wht';
        };
      console.log("Current players turn: " + currentPlayer);
      // whichClick();
    } 
  } else {
    console.log("BOTH false inside moveTo")
    whichClick();
  }
}


$(document).ready(function() {
  resetBoard();
  // whichClick();
  // selectSquare(2, 1);
  // moveTo(3, 3); //invalid 
  // moveTo(3,2); // valid 
  // moveTo(5, 5) //invalid without jumping a piece
  // console.log(board);

  whichClick();
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

























