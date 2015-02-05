
var board, currentPlayer, validMove , validJump, redPlayer, whitePlayer, game_over;  //board represents the current state of the checkers board


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

  game_over = false;

  // states
  // 0 ->wating for my turn
  // 1 -> specting to slect piece
  // 2 -> specting to select target square

  redPlayer = {
    name: 'red',
    state: 0,
    how_many_pieces_left: 12,
    how_many_turns_taken: 0
  };

  whitePlayer = {
    name: 'wht',
    state: 1,
    how_many_pieces_left: 12,
    how_many_turns_taken: 0
  };

  //$(document).trigger('boardChange');
};




var switchUser = function() {

  currentPlayer = getCurrentUser();

  if (currentPlayer == whitePlayer) {
    //console.log("making it into switchUser wht");
    whitePlayer.state = 0;
    redPlayer.state = 1;
    currentPlayer = redPlayer;
    return currentPlayer
  } else {
    //console.log("making it into switchUser red");
    redPlayer.state = 0;
    whitePlayer.state = 1;
    currentPlayer = whitePlayer;
    return currentPlayer
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



$(document).on('update', function () {
  for (var rowIndex = 0; rowIndex < board.length; rowIndex++) {
    var theRowClass = '.row-' + numToChar[rowIndex];
    //var row_object = $(theRowClass);
     
    for (var columnIndex = 0; columnIndex < 8; columnIndex++) {
      var theColClass = '.col-' + columnIndex;
      //var col_object = $(theColClass)
      var rowColClass = theRowClass + " " + theColClass;
      var boardSpot = $(rowColClass);

      //$(row).find(col);

      if (board[rowIndex][columnIndex] === 'wht') {
        $(boardSpot).addClass("white piece");
      };

      if (board[rowIndex][columnIndex] === 'red') {
        $(boardSpot).addClass("red piece");
      };

    };
  };
});



$(document).on("invalidMove", function(event, message){ 
  alert(message);
});


$(document).on("boardChange", function(message){  
  displayBoard();
});


$(document).on("taunt", function() {
  var taunt_options = ["Well well well.. who's the loser meow", "Don't fret sour puss", "Set my status to busy...busy stealing pieces right meow" ,"Your pieces are disappearing quicker than twinkies in the hands of a fat man", "Muahahaha", "Well, ain't that a b.", "Bye Felicia", "Your IQ involves the square root of -1"];
  var index = Math.floor((Math.random() * 7) + 0); 

  var the_taunt = taunt_options[index]; //select random index from taunt options array
  alert(the_taunt);
})

$(document).on("turnsTaken", function() {  
  console.log(whitePlayer.name + " has taken " + whitePlayer.how_many_turns_taken + " turns.");
  console.log(redPlayer.name + " has taken " + redPlayer.how_many_turns_taken + " turns.");
});

$(document).ready( function() {
  resetBoard();

  $(".start").click(function() {
    startGame();
  });

  $('#restart_turn').click(function() {
    console.log("Ok, restarting your turn. Please re-select a piece to move.");
    return currentPlayer.state = 1;
  });

});

var isValidMove = function(from_row, from_col, to_row, to_col) {
  from_col_plus = (parseInt(from_col)); // why wasn't the from_col working like an integer?

  rowElement = $('.row.row-' + numToChar[to_row]);
  column = rowElement.children();
  columnElement = $(column[to_col]);

  validMove = false;

  if (currentPlayer === whitePlayer) {
    if (to_row == (from_row+1)) {
      if ( (to_col == (from_col_plus+1)) || (to_col == (from_col_plus-1)) ) { //if it's in a diagonal only moving once space 
        if (board[to_row][to_col] == ' X ') { //and if the space is empty
        validMove = true;
       };  
      };
    };
  };
  if (currentPlayer === redPlayer) {
    if (to_row == (from_row-1)) {
      if ((to_col == (from_col_plus-1)) || (to_col == (from_col_plus+1))) {//if it's in a diagonal only moving once space 
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
    } else {
      validMove = true;
    };
  };

  console.log(validMove);
  return validMove;
};



var jumped_player, jumped_row, jumped_col;


isValidJump = function(from_row, from_col, to_row, to_col) {
  from_col_plus = (parseInt(from_col)); // why wasn't the from_col working like an integer?
  to_col_plus = (parseInt(to_col));
  rowElement = $('.row.row-' + numToChar[to_row]);
  column = rowElement.children();
  columnElement = $(column[to_col]);

  validJump = false;

  if (currentPlayer === whitePlayer) {
    if (to_row == (from_row+2)) { //if it's in a diagonal moving two spaces (for a jump)
      if ((to_col_plus == from_col_plus + 2) ) {//check if its moving forward two column spaces
        if ((board[to_row-1][to_col_plus-1] !== currentPlayer.name) && (board[to_row-1][to_col_plus-1] !== ' X ')) {
          if (board[to_row][to_col_plus] == ' X ') {
            jumped_player = redPlayer;
            jumped_row = (to_row-1);
            jumped_col = (to_col_plus-1);
            validJump = true;
          };
        };
      };
    };
    if (to_col_plus == (from_col_plus-2)) { //check if it's moving back two column spaces
      if ((board[to_row-1][to_col_plus+1] !== currentPlayer.name) && (board[to_row-1][to_col_plus+1] !== ' X ')) {
        if (board[to_row][to_col_plus] == ' X ') {
          jumped_player = redPlayer;
          jumped_row = (to_row-1);
          jumped_col = (to_col_plus+1);
          validJump = true;
        };
      };
    };
  };
  if (currentPlayer === redPlayer) {
    if (to_row == (from_row-2)) { //if it's in a diagonal moving two spaces (for a jump)
      // console.log (board[to_row][to_col_plus]);
      if ((to_col_plus == (from_col_plus - 2)) && (board[to_row][to_col_plus] === ' X ')) { //check if its moving forward two column spaces
        if ((board[to_row+1][to_col_plus+1] !== currentPlayer.name) && (board[to_row+1][to_col_plus+1] !== ' X ')){
          jumped_player = whitePlayer;
          jumped_row = (to_row+1);
          jumped_col = (to_col_plus+1);
          validJump = true;
        };
      };
      if ((to_col_plus == from_col_plus + 2) && (board[to_row][to_col_plus] === ' X ')) { //check if it's moving back two column spaces
        if ((board[to_row+1][to_col_plus-1] !== currentPlayer.name) && (board[to_row+1][to_col_plus-1] !== ' X ')) {
          jumped_player = whitePlayer;
          jumped_row = to_row+1
          jumped_col = to_col_plus-1
          validJump = true;
        };
      };
    };
  };

  if (validJump == true) {
    if (columnElement.hasClass('empty')) { 
      $(document).trigger('invalidMove', "You cannot move to a red space.");   
      validJump = false;
    } else {
      validJump = true;
    }
  };

  console.log (validJump);
  return validJump;
};



var isValid = function() {

  if (isValidMove(from_row, from_col, to_row, to_col) === true) {
    //console.log("True Inside IsValidMove");
    return true;
  };
  
  if (isValidJump(from_row, from_col, to_row, to_col) === true) {
    //console.log("True inside isValidJump");
    return true;
  };

};


var startGame = function() {
  resetBoard();
  alert("ALRIGHT lets play!! First up it's player: " + currentPlayer.name);
  $(document).trigger('update');
  whichClick();
}

var whichClick = function() {
    $('.col').click(function() {
      // console.log(this);
      // console.log($(this).parent());
      var columnClass = $(this).attr("class"); //the class of the column being clicked
      var rowClass = $(this).parent().attr("class"); //the class of the row the column is in
      var therow = charToNum[rowClass.slice(-1)]; //extracting the row letter and changing it to number
      var thecolumn = columnClass.split(' ')[1].slice(-1); //extracting the column number

      currentPlayer = getCurrentUser();

      if (currentPlayer.state === 1) {  
        if (selectSquare(therow, thecolumn) === true) {
          start_row = therow;
          start_col = thecolumn;
          currentPlayer.state = 2;
          return 
        };
      };

      if (currentPlayer.state === 2) {
        console.log("Waiting for player " + currentPlayer.name + " to choose target spot..");
        to_row = therow;
        to_col = thecolumn;

        if(isValid(start_row, start_col, to_row, to_col) === true) {
          makeMove(start_row, start_col, to_row, to_col);
          removeClasses(start_row, start_col);
          $(document).trigger('update'); //update board
          is_game_over();
          validJump = false;
          validMove = false;
          currentPlayer.how_many_turns_taken += 1
          switchUser(currentPlayer);
          console.log("Now waiting for " + currentPlayer.name + " to select a piece...")
        };
      };
    });
};


var removeClasses = function(startingRow, startingColumn) {
  for (var rowIndex = 0; rowIndex < board.length; rowIndex++) {
    var theRowClass = '.row-' + numToChar[rowIndex];
    //var row_object = $(theRowClass);
     
    for (var columnIndex = 0; columnIndex < 8; columnIndex++) {
      var theColClass = '.col-' + columnIndex;
      //var col_object = $(theColClass)
      var rowColClass = theRowClass + " " + theColClass;
      var boardSpot = $(rowColClass);
      $(boardSpot).removeClass("white red piece");
  
    };
  };

}

var from_row, from_col, to_row, to_col, rowElement, column, columnElement;



var selectSquare = function(row, col) {
  if (board[row][col] === ' X ') {
    $(document).trigger('invalidMove', "You selected an empty spot.");
    return false;
  };

  if (board[row][col] !== currentPlayer.name) {
    $(document).trigger('invalidMove', "Please select a piece to move.");
    return false;
  };

  if (board[row][col] === currentPlayer.name) {
    console.log("Succesfully selected piece to move");
    from_row = row; //save row and column.
    from_col = col;
    return true;
  }
};


var is_game_over = function() {
  if (redPlayer.how_many_pieces_left == 0) {
    game_over = true;
    $(document).trigger('turnsTaken');
    alert ("GAME OVER! " + whitePlayer.name + " has won!");
    return resetBoard();
  };
  if (whitePlayer.how_many_pieces_left == 0) {
    game_over = true;
    $(document).trigger('turnsTaken');
    alert ("GAME OVER! " + redPlayer.name + " has won!");
    return resetBoard();
  };
};


var makeMove = function(from_row, from_col, to_row, to_col) {

  if (validMove === true) {
    //(console.log("reaching inside validMove===true"));
    board[to_row][to_col] = currentPlayer.name;
    board[from_row][from_col] = ' X ';
    console.log('Successfully moved to row ' + to_row + " : " + board[to_row]);
    return 
  }

  if (validJump === true) {
    board[to_row][to_col] = currentPlayer.name;
    board[from_row][from_col] = ' X ';
    conquered_piece(jumped_row, jumped_col, jumped_player); //replace jumped player with an empty space.
    console.log('Successfully jumped over ' + jumped_player.name + ' to row ' + to_row + " : " + board[to_row]);
    $(document).trigger('taunt');
    $(document).trigger('boardChange');
    return 
  }
};


var conquered_piece = function(jumped_row, jumped_col, jumped_player) {
    board[jumped_row][jumped_col] = ' X '; //replace jumped player with an empty space.
    jumped_player.how_many_pieces_left -= 1; // updating pieces left 
}


var displayBoard = function () {
  var column = [0, 1, 2, 3, 4, 5, 6, 7];
  console.log("  | " + column.join("   "));
  console.log("-----------------------------------");
  for (var i = 0; i < board.length; i++) {
    console.log(numToChar[i] + " |" + board[i].join(" "));
  }
};



























