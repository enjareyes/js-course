
var board, currentPlayer, validMove , validJump, clickCounter, redPlayer, whitePlayer;  //board represents the current state of the checkers board


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

  currentPlayer = whitePlayer;

  // states
  
  // 0 ->wating for my turn
  // 1 -> specting to slect piece
  // 2 -> specting to select target square

  
redPlayer = {
  name: 'red',
  state: 0
};

whitePlayer = {
  name: 'wht',
  state: 1
};

  $(document).trigger('boardChange');
};




var switchUser = function() {
  if (currentPlayer = whitePlayer) {
    whitePlayer.state = 0;
    redPlayer.state = 1;
    currentPlayer = redPlayer;
  };

  if (currentPlayer = redPlayer) {
    redPlayer.state = 0;
    whitePlayer.state = 1;
    currentPlayer = whitePlayer;
  };
};



var getCurrentUser = function() {
  if (whitePlayer.state === 0) {
    currentPlayer = redPlayer;
    //console.log(currentPlayer.name);
    return currentPlayer;
  };

  if (redPlayer.state === 0) {
    currentPlayer = whitePlayer;
    //console.log(currentPlayer.name);
    return currentPlayer;
  };
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


$(document).on("invalidMove", function(message){  //do I need 'event' argument in there? Why?
  alert(message);
});


var isValidMove = function() {
  validMove = false;

  if (currentPlayer === whitePlayer) {
    if (to_row == (from_row+1)) {
      if (to_col == (from_col) || (to_col == (from_col-1))) { //if it's in a diagonal only moving once space 
        if (board[to_row][to_col] == ' X ') { //and if the space is empty
        validMove = true;
       };  
      };
    };
  };
  if (currentPlayer === redPlayer) {
    if (to_row == (from_row-1)) {
      if ((to_col == (from_col-1)) || (to_col == (from_col))) {//if it's in a diagonal only moving once space 
        if (board[to_row][to_col] == ' X ') { //and if the space is empty
          validMove = true;
        };  
      } 
    };
  };

  if (validMove === true) { //double check it's not a red square
    if (columnElement.hasClass('empty')) { 
      console.log('no move');
      $(document).trigger('invalidMove', "You cannot move to a red space.");   
      validMove = false;
    } 
  };

  return validMove;
};



var jumped_player;

isValidJump = function() {
  validJump = false;

  if (currentPlayer === whitePlayer) {
    if (to_row == (from_row+2)) { //if it's in a diagonal moving two spaces (for a jump)
      if ((to_col == from_col + 1) ) {//check if its moving forward two column spaces
        if ((board[to_row-1][to_col-1] !== currentPlayer.name) && (board[to_row-1][to_col-1] !== ' X ')) {
          if (board[to_row][to_col] == ' X ') {
            jumped_player = 'red';
            validJump = true;
          };
        };
      };
    };
    if (to_col == (from_col-2)) { //check if it's moving back two column spaces
      if ((board[to_row-1][to_col+1] !== currentPlayer.name) && (board[to_row-1][to_col+1] !== ' X ')) {
        if (board[to_row][to_col] == ' X ') {
          jumped_player = 'red';
          validJump = true;
        };
      };
    };
  };
  if (currentPlayer === redPlayer) {
    if (to_row == (from_row-2)) { //if it's in a diagonal moving two spaces (for a jump)
      console.log('----Inside validMove jump section---')
      // console.log (board[to_row][to_col]);
      if ((to_col == (from_col - 3)) && (board[to_row][to_col] === ' X ')) { //check if its moving forward two column spaces
        if ((board[to_row+1][to_col+1] !== currentPlayer.name) && (board[to_row+1][to_col+1] !== ' X ')){
          jumped_player = 'wht';
          validJump = true;
        };
      };
      if ((to_col == from_col + 2) && (board[to_row][to_col] === ' X ')) { //check if it's moving back two column spaces
        if ((board[to_row+1][to_col-1] !== currentPlayer.name) && (board[to_row+1][to_col-1] !== ' X ')) {
          jumped_player = 'wht';
          validJump = true;
        };
      };
    };
  };

  if (validJump === true) {
    if (columnElement.hasClass('empty')) { 
      console.log('no jump');
      $(document).trigger('invalidMove', "You cannot move to a red space.");   
      validJump = false;
    } 
  };

  return validJump;
};



var isValid = function(from_row, from_col, to_row, to_col) {
  console.log("inside isValid now")
  from_col = (parseInt(from_col)+1) // why wasn't the from_col working like an integer?
  rowElement = $('.row.row-' + numToChar[to_row]);
  column = rowElement.children();
  columnElement = $(column[to_col]);


  isValidMove(from_row, from_col, to_row, to_col);
  isValidJump(from_row, from_col, to_row, to_col);

  if (validMove === true || validJump === true) {
    return true;
  };
};





var whichClick = function() {
    $('.col').click(function() {
      // console.log(this);
      // console.log($(this).parent());
      var columnClass = $(this).attr("class"); //the class of the column being clicked
      var rowClass = $(this).parent().attr("class"); //the class of the row the column is in
      var therow = charToNum[rowClass.slice(-1)]; //extracting the row letter and changing it to number
      var thecolumn = columnClass.slice(-1); //extracting the column number

      var currentPlayer = getCurrentUser()

      if (currentPlayer.state === 1) {
        if (selectSquare(therow, thecolumn) === true) {
          start_row = therow;
          start_col = thecolumn;
          currentPlayer.state = 2;
          return 
        };
      };

      if (currentPlayer.state === 2) {
        console.log("Waiting to choose target spot..");
        if(isValid(start_row, start_col, therow, thecolumn) === true) {
          makeMove(start_row, start_col, therow, thecolumn);
          switchUser(); 
          validJump = false;
          validMove = false;
        };
      };
    });
};


var from_row, from_col, to_row, to_col, rowElement, column, columnElement;



var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
    return false;
  };

  if (board[row][col] !== currentPlayer.name) {
    $(document).trigger('invalidMove', "You cannot move your opponents piece.")
    return false;
  };

  if (board[row][col] === currentPlayer.name) {
    console.log("succesfully selected piece to move");
    from_row = row; //save row and column.
    from_col = col;
    return true;
  }
};


// var selectTarget = function(from_row, from_col, to_row, to_col) {

//   isValid(from_row, from_col, to_row, to_col); //using data saved from selectSquare and selectTarget arguments

// }


var makeMove = function(from_row, from_col, to_row, to_col) {
console.log("Inside makeMove now...");
  if (validMove === true) {
    (console.log("reaching inside validMove===true"));
    board[to_row][to_col] = currentPlayer.name;
    board[from_row][from_col] = ' X ';
    console.log('Successfully moved to row ' + to_row + " : " + board[to_row]);
  }

  if (validJump === true) {
    board[to_row][to_col] = currentPlayer.name;
    board[from_row][from_col] = ' X ';
    jumped_player = ' X '; //replace jumped player with an empty space.
    console.log('Successfully jumped to row ' + to_row + " : " + board[to_row]);
  }

};




$(document).ready(function() {
  resetBoard();
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


























