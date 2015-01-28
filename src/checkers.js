
var board, currentPlayer, moveFrom, validMove , validJump, clickCounter;  //board represents the current state of the checkers board


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




var isvalidMove = function(from_row, from_col, torow, tocol) {
  from_col_plus = (parseInt(from_col)+1) // why wasn't the from_col working like an integer?

  if (currentPlayer === 'wht') {
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
        if (board[torow-1][tocol-1] !== currentPlayer) {
          validJump = true;
        };
      };
      if (tocol == (from_col-2)) { //check if it's moving back two column spaces
        if (board[torow-1][tocol+1] !== currentPlayer) {
          validJump = true;
        };
      };
    } else {
      validJump = false;
      validMove = false;
      console.log("INVALID MOVE for white");
    }
  };

  if (currentPlayer === 'red') {
    if (torow == (from_row-1)) {
      if ((tocol == (from_col-1)) || (tocol == (from_col_plus))) {//if it's in a diagonal only moving once space 
        // if (board[torow][tocol] == ' X ') { //and if the space is empty
          validMove = true;
        // };  
      } else {
        validJump = false;
      };
    } else if (torow == (from_row-2)) { //if it's in a diagonal moving two spaces (for a jump)
    console.log('----Inside validMove jump section---')
    console.log (board[torow][tocol]);
      if ((tocol == (from_col_plus - 3)) && (board[torow][tocol] === ' X ')) {//check if its moving forward two column spaces
        if (board[torow+1][tocol+1] !== currentPlayer) {
          validJump = true;
        };
      };
      if ((tocol == from_col + 2) && (board[torow][tocol] == ' X ')) { //check if it's moving back two column spaces
        if (board[torow+1][tocol-1] !== currentPlayer) {
          validJump = true;
        };
      };
    } else {
      validJump = false;
      validMove = false;
      console.log("INVALID MOVE for red");
    }
  } 
};




clickCounter = 1;


var whichClick = function() {
    $('.col').click(function() {
      // console.log(this);
      // console.log($(this).parent());
      var columnClass = $(this).attr("class"); //the class of the column being clicked
      var rowClass = $(this).parent().attr("class"); //the class of the row the column is in
      var therow = charToNum[rowClass.slice(-1)]; //extracting the row letter and changing it to number
      var thecolumn = columnClass.slice(-1); //extracting the column number
      
      if (clickCounter === 1) {
        console.log(currentPlayer + ' selected piece... ');
        selectSquare(therow, thecolumn); //using the row and column to call selectSquare();
      } else {
        console.log(currentPlayer + ' moving piece.. ');
        makeMove(therow, thecolumn);
      };
    });
      
};




var from_row, from_col, to_row, to_col;


var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
    // listen for click again
  } 
  if (board[row][col] !== currentPlayer) {
    $(document).trigger('invalidMove', "You cannot move your opponents piece.")
    //listen for click again
  } else {      // (board[row][col] == currentPlayer)
    console.log("succesfully selected piece to move");
    moveFrom = board[row][col]; //save data 
    from_row = row;
    from_col = col;
    clickCounter = 2;
    // return whichClick();
  }
};


var makeMove = function(torow, tocol) {
  to_row = torow;
  to_col = tocol;

  isvalidMove(from_row, from_col, to_row, to_col); //using data saved from selectSquare and makeMove arguments

  var rowElement = $('.row.row-' + numToChar[torow]);
  var column = rowElement.children();
  var columnElement = $(column[tocol]);

  if ((validMove == true) || (validJump == true)) {
    if (board[torow][tocol] !== ' X ') { 
      $(document).trigger('invalidMove', "You must move to an empty space.");
      return whichClick();
    } else if (columnElement.hasClass('empty')) {
      console.log('nope');
      $(document).trigger('invalidMove', "You cannot move to a red space.");   
      return whichClick();
    } else {
      board[torow][tocol] = currentPlayer;
      board[from_row][from_col] = ' X ';
      console.log('Moved to row ' + torow + " : " + board[torow]);
      validJump = false;
      validMove = false;
      console.log("Successfully made move!");
      clickCounter = 1; //reset counter and validmove/jump variables for next move
        if (currentPlayer === 'wht') {
          currentPlayer = 'red';
        } else { 
          currentPlayer = 'wht';
        };
      console.log("Players turn: " + currentPlayer);
      //return whichClick();
    } 
  } else {
    console.log("BOTH invalid - inside makeMove")
    whichClick();
  }
}



$(document).ready(function() {
  resetBoard();
  // whichClick();
  // selectSquare(2, 1);
  // makeMove(3, 3); //invalid 
  // makeMove(3,2); // valid 

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


























