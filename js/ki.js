(function (window) {

  function KI(board) {
    this.board = board;
  }

  function freeTiles(board) {
    return board.freeTiles()
  }

  function evaluate(b) {
    return b.freeTiles() +
      0.1 * b.sum() + 0.2 * b.max();
  }

  /**
   *
   02      if depth = 0 or node is a terminal node
   03          return the heuristic value of node
   04      if maximizingPlayer
   05          v := -∞
   06          for each child of node
   07              v := max(v, alphabeta(child, depth - 1, α, β, FALSE))
   08              α := max(α, v)
   09              if β ≤ α
   10                  break (* β cut-off *)
   11          return v
   12      else
   13          v := ∞
   14          for each child of node
   15              v := min(v, alphabeta(child, depth - 1, α, β, TRUE))
   16              β := min(β, v)
   17              if β ≤ α
   18                  break (* α cut-off *)
   19          return v
   (* Initial call *)
   alphabeta(origin, depth, -∞, +∞, TRUE)
   * @param board
   * @param depth
   * @param alpha
   * @param beta
   * @param maxingPlayer
   * @returns {*}
   */
  KI.prototype.minMax = function (board, depth, alpha, beta, maxingPlayer, originalDepth) {
    console.log("depth: " + depth);
    if (depth == 0 || board.gameOver())
      return evaluate(board);

    if (maxingPlayer) { // MAX
      var bestV = -999;
      var bestM = -1;
      for (var i = 3; i >= 0; i--) {
        var b = board.copy();
        var c = b.move(i, true);
        if (c) {
          var n = this.minMax(b, depth - 1, alpha, beta, false);
          bestV = Math.max(bestV, n)
          if (n == bestV)
            bestM = i;
          alpha = Math.max(alpha, bestV);
          if (beta <= alpha) {
            return beta;
          }
        }
      }
      if (depth == originalDepth) {
        if (bestM != -1)
          this.board.move(bestM);
        this.board.show();
      }
      return bestV;
    }
    else { // MIN Opponent does bad stuff.
      var minV = 9999999999999;
      for (var i = 0; i < board.board.length; i++) {
        for (var j = 0; j < board.board[i].length; j++) {
          // fill random tile
          if (board.board[i][j] == 0) {
            for (var n = 1; n <= 2; n++) {
              var b = board.copy();
              b.board[i][j] = 2 * n;
              minV = Math.min(minV, this.minMax(b, depth - 1, alpha, beta, true));
              beta = Math.min(beta, minV);
              if (beta <= alpha)
                return alpha;
            }
          }
        }
      }
      return minV;
    }
  }


  this.KI = KI;
})
(window);