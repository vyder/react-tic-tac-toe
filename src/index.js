import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// props:
//    - value:   the cell value to display
//    - onClick: the delegate called when the cell is clicked
//
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// props:
//    - player:  the string identifier of the current player
//    - onClick: the delegate called when the cell is clicked
//
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares:  Array(9).fill(null),
            winner:   null,
            gameOver: false,
            // history: []
        };
    }

    computeState(squares) {
        const lines = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // cols
            [0,4,8], [2,4,6]           // diagonals
        ];

        let winner   = null;
        let hasEmpty = false;

        for(let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if(squares[a] && (squares[a] === squares[b])
                          && (squares[a] === squares[c])) {
                winner = squares[a];
                break;
            }

            // If any of the squares are empty
            if(!(squares[a] && squares[b] && squares[c])) {
                hasEmpty = true;
            }
        }


        if(winner) {
            this.setState({ winner: winner });
        }

        this.setState({ gameOver: (winner || !hasEmpty) });
    }

    onSquareClicked(index) {
        // Do nothing if game is over, or this cell is not empty
        if(this.state.gameOver || this.state.squares[index]) {
            return;
        }

        const newSquares = this.state.squares.slice();

        // this.state.history.push({squares: this.state.squares});

        newSquares[index] = this.props.player;
        this.setState({ squares: newSquares });

        // Update board state
        this.computeState(newSquares);


        // Notify parent
        this.props.onClick();
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]}
                       onClick={() => this.onSquareClicked(i)} />;
    }

    render() {
        const winner = this.state.winner;
        let status;

        if(this.state.gameOver) {
            if(winner) {
                status = winner + " wins!";

            } else {
                status = 'Game Over!';
            }
        } else {
            status = 'Next player: ' + this.props.player;
        }

        return (
          <div>
            <div className="status">{status}</div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPlayer: null
        }

        let isXFirst = (Math.floor(Math.random() * 2) === 0);
        let startingPlayer = isXFirst ? 'X' : 'O';

        this.state.currentPlayer = startingPlayer;
    }

    swapPlayer() {
        let nextPlayer = 'X';
        if(this.state.currentPlayer === 'X') {
            nextPlayer = 'O'
        }

        this.setState({ currentPlayer: nextPlayer });
    }

    handleClick() {
        this.swapPlayer();
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board player={this.state.currentPlayer} onClick={() => this.handleClick()}/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
