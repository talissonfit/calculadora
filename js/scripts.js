const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentOperation = "";
  }

  // 1. Adiciona dígitos 🔢
  addDigit(digit) {
    if (digit === "." && this.currentOperationText.innerText.includes(".")) {
      return;
    }

    this.currentOperation = digit;
    this.updateScreen();
  }

  // 2. Processa as operações ⚙️
  processOperation(operation) {
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }

    let operationValue;
    const previous = +this.previousOperationText.innerText.split(" ")[0];
    const current = +this.currentOperationText.innerText;

    switch (operation) {
      case "+":
        operationValue = previous + current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "-":
        operationValue = previous - current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "/":
        operationValue = previous / current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "*":
        operationValue = previous * current;
        this.updateScreen(operationValue, operation, current, previous);
        break;
      case "DEL":
        this.processDelOperator();
        break;
      case "CE":
        this.processClearCurrentOperation();
        break;
      case "C":
        this.processClearAllOperation();
        break;
      case "=":
        this.processEqualOperator();
        break;
      default:
        return;
    }
  }

  // 3. Atualiza a tela (Onde o zero morre!) 🖥️
  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null
  ) {
    if (operationValue === null) {
      // ✅ REGRA: Se tiver "0" e digitar outro número, substitui!
      if (this.currentOperationText.innerText === "0" && this.currentOperation !== ".") {
        this.currentOperationText.innerText = this.currentOperation;
      } else {
        this.currentOperationText.innerText += this.currentOperation;
      }
    } else {
      if (previous === 0) {
        operationValue = current;
      }

      // ✅ REGRA: Duas casas decimais se tiver ponto
      if (String(operationValue).includes(".")) {
        operationValue = parseFloat(operationValue.toFixed(2));
      }

      this.previousOperationText.innerText = `${operationValue} ${operation}`;
      this.currentOperationText.innerText = "";
    }
  }

  // 4. Troca de operação
  changeOperation(operation) {
    const mathOperations = ["*", "/", "+", "-"];
    if (!mathOperations.includes(operation)) return;

    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  // 5. Deleta dígito
  processDelOperator() {
    this.currentOperationText.innerText =
      this.currentOperationText.innerText.slice(0, -1);
  }

  // 6. Limpa atual
  processClearCurrentOperation() {
    this.currentOperationText.innerText = "";
  }

  // 7. Limpa tudo
  processClearAllOperation() {
    this.currentOperationText.innerText = "";
    this.previousOperationText.innerText = "";
  }

  // 8. Botão de Igual
  processEqualOperator() {
    let operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
    
    // Mostra o resultado final embaixo e limpa em cima
    let finalResult = this.previousOperationText.innerText.split(" ")[0];
    this.currentOperationText.innerText = finalResult;
    this.previousOperationText.innerText = "";
  }
}

const calc = new Calculator(previousOperationText, currentOperationText);

// Eventos de Clique
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;
    if (+value >= 0 || value === ".") {
      calc.addDigit(value);
    } else {
      calc.processOperation(value);
    }
  });
});

// Eventos de Teclado
window.addEventListener("keydown", (e) => {
  const value = e.key;
  if (+value >= 0 || value === ".") {
    calc.addDigit(value);
  } else if (value === "Enter") {
    e.preventDefault();
    calc.processOperation("=");
  } else if (value === "Backspace") {
    calc.processOperation("DEL");
  } else if (value === "Escape") {
    calc.processOperation("C");
  } else if (value === "," || value === ".") {
    calc.addDigit(".");
  } else if (["+", "-", "*", "/"].includes(value)) {
    calc.processOperation(value);
  }
});