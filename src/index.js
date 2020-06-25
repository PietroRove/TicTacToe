import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/* si tratta di un componente controllato (da Board): 
 * Square non mantiene più il proprio stato, riceve valori dal componente padre Board ed a sua volta lo informa di quando viene cliccato
 */
function Square(props) {
  //Square è un componente funzione, ha solo il metodo render e non tiene traccia del proprio stato interno
  return (
    <button
      className="square"

      style={{ color: props.color }}
      onClick={props.onClick}

    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    //ogni quadrato riceve il proprio valore corrente(state) dall'array degli stati della board
    return (
      <Square
        value={this.props.squares[i]}
        color={this.props.squares[i] == 'X' ? 'green' : 'red'}
        onClick={() => this.props.onClick(i)} //passo una funzione da Board a Square che viene chiamata ad ogni click. In questo modo modifico lo stato 
      />
    );
  }

  render() {
    return (
      <div>
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
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    /* viene fatta una copia per il principio dell'immutabilità. Vantaggi:
     * - Eliminare la mutazione diretta dei dati ci permette di mantenere versioni precedenti della storia della partita intatte cosicché siano riutilizzabili in seguito
     * - rilevare i cambiamenti in oggetti immutabili è molto più semplice: se il riferimento all'oggetto è diverso dal precedente allora l'oggetto è cambiato
     * - permette di creare componenti puri. I cambiamenti vengono identificati in modo semplice e di conseguenza si può capire quando un componente richiede una nuova renderizzazione
     * - https://it.reactjs.org/docs/optimizing-performance.html#examples
     */
    const history = this.state.history.slice(0, this.state.stepNumber + 1); //in questo modo se andiamo indietro nel tempo buttiamo via la "storia futura"
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //se il quadrato è già pieno o qualcuno ha già vinto la partita la funzione esce
    if (calculateWinner(squares) || squares[i]) { return; }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //step dovrebbe essere l'elemento dell'array che vado a mappare, move l'iteratore
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (<li key={move}>
        <button onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
      </li>);
    });

    let status;
    if (winner)
      status = 'Winner: ' + winner;
    else
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//herlper function
function calculateWinner(squares) {
  //sono le possibili combinazioni per la vittoria
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
