import "./App.css";
import { forwardRef, useReducer } from "react";
import DigitButton from "./digitButton";
import OperationButton from "./operationButton";

export const ACTION = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  CLEAR: "clear",
};

const INTERGER_FORMATTER = new Intl.NumberFormat("en-in", {
  maximumFracttionDigits: 0,
});

function formatNumber(operand) {
  if (operand == null) return;

  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTERGER_FORMATTER.format(integer);
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ previousOperand, operation, currentOperand }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "/":
      computation = prev / curr;
      break;
    case "*":
      computation = prev * curr;
      break;
  }

  return computation.toString();
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite == true) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (state.currentOperand == null && payload.digit === ".") {
        return {
          ...state,
          currentOperand: "0.",
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTION.CLEAR:
      return {};

    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand === null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTION.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // dispatch({ type: ACTION.ADD_DIGIT, payload: { digit: 1 } });

  return (
    <div className="App">
      <div className="calculator-grid">
        <div className="output">
          <div className="previousOperand">
            {formatNumber(previousOperand)} {operation}
          </div>
          <div className="currentOperand">{formatNumber(currentOperand)}</div>
        </div>
        <button
          className="span-2"
          onClick={() => dispatch({ type: ACTION.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-2"
          onClick={() => dispatch({ type: ACTION.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
