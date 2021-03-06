import React from 'react';
import { Player } from './player';
import { Board } from './board';

interface HistorySnapshot {
    player:  Player,
    squares: Player[]
}

interface GameState {
    history:  HistorySnapshot[],
    winner:   Player,
    gameOver: boolean,
}

export class Game extends React.Component<any, GameState> {

    constructor(props: any) {
        super(props);

        let isXFirst = (Math.floor(Math.random() * 2) === 0);
        let startingPlayer = isXFirst ? Player.X : Player.O;

        this.state = {
            history: [{
                player: startingPlayer,
                squares: Array(9).fill(Player.null)
            }],
            winner: Player.null,
            gameOver: false
        }
    }

    computeState(squares: Player[]) {
        const lines = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // cols
            [0,4,8], [2,4,6]           // diagonals
        ];

        let winner   = Player.null;
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

        this.setState({
            winner:   winner,
            gameOver: !((winner === Player.null) && hasEmpty)
        });
    }

    handleClick(index : number) {
        const history = this.state.history;
        const current = history[history.length - 1];

        // Do nothing if game is over, or this cell is not empty
        if(this.state.gameOver || current.squares[index]) {
            return;
        }

        // Make a copy
        const newSquares = current.squares.slice();

        // Mark the spot
        newSquares[index] = current.player;

        // Swap player
        let nextPlayer = Player.X;
        if(current.player === Player.X) {
            nextPlayer = Player.O;
        }

        // Update state
        this.setState({
            history: history.concat({
                player:  nextPlayer,
                squares: newSquares,
            })
        });

        // Update board state
        this.computeState(newSquares);
    }

    jumpTo(moveIndex : number) {
        const history    = this.state.history;
        const newHistory = history.slice(0, moveIndex + 1);

        this.setState({
            history: newHistory
        });

        // Also update board state
        const squares = newHistory[newHistory.length - 1].squares;
        this.computeState(squares);
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];

        const winner = this.state.winner;
        let status;

        // Figure out status
        if(this.state.gameOver) {
            if(winner !== Player.null) {
                status = winner.toString() + " wins!";

            } else {
                status = 'Game Over!';
            }
        } else {
            status = 'Current player: ' + current.player;
        }


        // Create history moves buttons
        const moves = history.slice(0, history.length - 1).map((step, moveIndex) => {
            const desc = moveIndex ? ("Go to move #" + moveIndex) : "Start of Game";
            return (
                <li key={"move" + moveIndex}>
                    <button onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
                </li>
            );
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                           onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
