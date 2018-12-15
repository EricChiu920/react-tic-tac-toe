import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createSquareBoard(x) {
    let board = [];
    for (let i = 0; i < x; i++) {
      let squares = [];
      for (let j = 0; j < x; j++) {
        squares.push(this.renderSquare(i));
      }
      board.push(<div className="board-row">{squares}</div>)
    }
    return board
  }

  render() {
    return (
      this.createSquareBoard(3)
    );
  }
}

class Game extends React.Component {
  state = {
    history: [{
      squares: Array(9).fill(null),
      location: '',
    }],
    xIsNext: true,
    stepNumber: 0,
  }

  handclick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const moveLocation = {
      0: '(col 1, row 1)',
      1: '(col 2, row 1)',
      2: '(col 3, row 1)',
      3: '(col 1, row 2)',
      4: '(col 2, row 2)',
      5: '(col 3, row 2)',
      6: '(col 1, row 3)',
      7: '(col 2, row 3)',
      8: '(col 3, row 3)',
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        location: moveLocation[i],
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });


  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move} ${this.state.history[move].location}` : `Go to game start`;
      const buttonStyle = move === this.state.stepNumber ? 'bold' : 'normal';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{fontWeight: buttonStyle}}>
            {desc}
          </button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status  = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handclick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
