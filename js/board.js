(function (window) {

  function Board() {
    this.size = 4;
    this.board = Array(this.size);
    for (var i = 0; i < this.board.length; i++) {
      this.board[i] = Array(this.size);
      for (var j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = 0;
      }
    }
    this.fillFreeTile(2);
  }

  Board.prototype.copy = function () {
    var b = new Board();
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        b.board[i][j] = this.board[i][j];
      }
    }
    return b;
  }

  Board.prototype.fillFreeTile = function (count) {
    var i = 0;
    while (i < count) {
      var x = Math.floor(Math.random() * this.size);
      var y = Math.floor(Math.random() * this.size);
      if (this.board[x][y] == 0) {
        this.board[x][y] = Math.random() > 0.5 ? 2 : 4;
        i++;
      }
    }
  }

  function title(board, x, y) {
    var showCoords = false;
    var s = (board.board[x][y] != 0 ? board.board[x][y] : "");
    if (showCoords) {
      s = x + "|" + y + "<br>" + s;
    }
    return s;
  }

  Board.prototype.show = function (id) {
    if (!id)
      id = "#board";
    if ($(id).find('.tile').length == this.size * this.size) {
      for (var rows = 0; rows < this.board.length; rows++) {
        for (var cols = 0; cols < this.board[rows].length; cols++) {
          var $cell = $(id).find("#" + cols + "-" + rows);
          $cell.html(title(this, cols, rows));
          for (var i = 0; i < 10; i++)
            $cell.removeClass("val-" + Math.pow(2, i));
          $cell.addClass("val-" + this.board[cols][rows]);
        }
      }
    }
    else {
      // create new
      $(id).empty();
      for (var rows = 0; rows < this.board.length; rows++) {
        for (var cols = 0; cols < this.board[rows].length; cols++) {
          var $c = $("<div id='" + cols + "-" + rows + "' class='tile'>" + title(this, cols, rows) + "</div>");
          if (this.board[cols][rows] > 0) $c.addClass("val-" + this.board[cols][rows]);
          $(id).append($c);
        }
      }
    }
  }
  Board.prototype.tile = function (x, y) {
    return this.board[x][y];
  }

  Board.prototype.freeTiles = function () {
    var c = 0;
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] == 0) c += 1;
      }
    }
    return c;
  }
  Board.prototype.sum = function () {
    var c = 0;
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        c += this.board[i][j] == 0;
      }
    }
    return c;
  }
  Board.prototype.max = function () {
    var c = 0;
    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        c = Math.max(this.board[i][j], c);
      }
    }
    return c;
  }


  Board.prototype.gameOver = function () {
    var gameOver = true;
    for (var x = 0; x < this.size - 1; x++) {
      for (var y = 0; y < this.size - 1; y++) {
        if (this.board[x][y] == this.board[x + 1][y])
          gameOver = false;
        if (this.board[x][y] == this.board[x][y + 1])
          gameOver = false;
      }
    }
    return gameOver;
  }
  Board.prototype.performMove = function (dir, silent) {
    var start = 0, end = 0, direction = 0, xoff = 0, yoff = 0;
    if (dir == 1 || dir == 2) {
      start = 0;
      end = this.size - 1;
      direction = 1;
    }
    else {
      start = this.size - 1
      end = 0;
      direction = -1;
    }
    if (dir <= 1) {
      yoff = direction;
    } else {
      xoff = direction;
    }
    var merged = Array(this.size);
    for (var n = 0; n < this.size; n++) {
      merged[n] = Array(this.size);
      for (var i = 0; i < merged[n].size; i++) {
        merged[n][i] = false;
      }
    }
    var changed = false;
    for (var n = 0; n < this.size; n++) {
      for (var i = 0; i < this.size; i++) {
        for (var k = start; k != end; k = k + direction) {
          var x = dir <= 1 ? n : k;
          var y = dir <= 1 ? k : n;
          if ((!merged[x + xoff][y + yoff] && !merged[x][y] && this.board[x][y] == this.board[x + xoff][y + yoff]) || this.board[x][y] == 0) {
            if (this.board[x + xoff][y + yoff] != 0) {
              changed = true;
            }
            merged[x][y] = (this.board[x + xoff][y + yoff] > 0 && this.board[x][y] > 0) || merged[x + xoff][y + yoff];
            this.board[x][y] += this.board[x + xoff][y + yoff];
            this.board[x + xoff][y + yoff] = 0;
            merged[x + xoff][y + yoff] = false;
          }
        }
      }
    }
    return changed;
  }
  /**
   *
   * @param dir: down = 0, up = 1, left = 2, right = 3
   */
  Board.prototype.move = function (dir, silent) {
    var changed = this.performMove(dir, silent);

    if (this.freeTiles() == 0) {
      if (!silent) {
        console.log("Game Over!");
        return -1;
      }
    }
    else {
      if (changed) {
        this.fillFreeTile(1);
        if (!silent) {
          this.show();
        }
        return 1;
      }
      else
        return 0;
    }
  }
  window.Board = Board;
})
(window);
