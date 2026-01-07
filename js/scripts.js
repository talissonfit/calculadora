const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentOperation = "";
  }

  // Adiciona dígito na tela da calculadora
  addDigit(digit) {
    // Verifica se a operação atual já tem um ponto
    if (digit === "." && this.currentOperationText.innerText.includes(".")) {
      return;
    }

    this.currentOperation = digit;
    this.updateScreen();
  }

  // Processa todas as operações da calculadora
  processOperation(operation) {
    // Verifica se o valor atual está vazio
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      // Muda a operação se o anterior não estiver vazio
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }

    // Pega os valores atuais e anteriores
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

  // Muda os valores da tela
  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null
  ) {
    if (operationValue === null) {
      // Adiciona o número ao valor atual
      this.currentOperationText.innerText += this.currentOperation;
    } else {
      // Verifica se o valor é zero, se for, apenas adiciona o valor atual
      if (previous === 0) {
        operationValue = current;
      }

      // --- AQUI ESTÁ A MÁGICA DO :.2f ---
      // Se o resultado tiver ponto flutuante, fixa em 2 casas
      if (String(operationValue).includes(".")) {
          operationValue = operationValue.toFixed(2);
      }

      // Adiciona o valor anterior à tela
      this.previousOperationText.innerText = `${operationValue} ${operation}`;
      this.currentOperationText.innerText = "";
    }
  }

  // Muda a operação matemática
  changeOperation(operation) {
    const mathOperations = ["*", "/", "+", "-"];

    if (!mathOperations.includes(operation)) {
      return;
    }

    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  // Deleta o último dígito
  processDelOperator() {
    this.currentOperationText.innerText =
      this.currentOperationText.innerText.slice(0, -1);
  }

  // Limpa a operação atual
  processClearCurrentOperation() {
    this.currentOperationText.innerText = "";
  }

  // Limpa tudo
  processClearAllOperation() {
    this.currentOperationText.innerText = "";
    this.previousOperationText.innerText = "";
  }

  // Processa o botão de igual
  processEqualOperator() {
    const operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
    
    // TRUQUE FINAL: Traz o resultado para a tela principal arredondado
    // Se quiser ver o resultado no visor grande depois do igual:
    let result = this.previousOperationText.innerText.split(" ")[0];
    
    this.currentOperationText.innerText = result;
    this.previousOperationText.innerText = "";
  }
}

const calc = new Calculator(previousOperationText, currentOperationText);

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

// EVENTOS DE TECLADO (Para o Enter funcionar)
window.addEventListener("keydown", (e) => {
    const value = e.key;

    if(+value >= 0 || value === ".") {
        calc.addDigit(value);
    } 
    else if(value === "Enter") {
        e.preventDefault();
        calc.processOperation("="); 
    } 
    else if(value === "Backspace") {
        calc.processOperation("DEL"); 
    } 
    else if(value === "Escape") { 
        calc.processOperation("C");
    } 
    else if(value === "," || value === ".") {
        calc.addDigit(".");
    }
    else if(value === "+" || value === "-" || value === "*" || value === "/") {
        calc.processOperation(value);
    }
});