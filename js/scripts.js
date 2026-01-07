const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentOperation = "";
    this.maxDigits = 15;
    this.resetNext = false; // A nossa "bandeirinha" de reset
  }

  // --- Funções Auxiliares (Formatação e Visual) ---

  // Formata com vírgulas (123456 vir 123,456)
  formatDisplayNumber(numberString) {
    if (numberString === "") return "";
    let [integer, decimal] = numberString.split(".");
    integer = Number(integer).toLocaleString("en-US");
    if (decimal !== undefined) {
        return `${integer}.${decimal}`;
    } else {
        return integer;
    }
  }

  // Ajusta o tamanho da fonte
  adjustFontSize(element, textLength) {
      element.style.removeProperty('font-size');
      if (textLength > 18) {
          element.style.fontSize = "1.3rem";
      } else if (textLength > 13) {
          element.style.fontSize = "1.8rem";
      } else if (textLength > 10) {
          element.style.fontSize = "2.5rem";
      } 
  }

  // Mostra o balãozinho vermelho
  showWarning() {
      const oldToast = document.querySelector('.toast-warning');
      if(oldToast) oldToast.remove();

      const toast = document.createElement('div');
      toast.className = 'toast-warning'; 
      toast.innerText = `Can't enter more than ${this.maxDigits} digits.`;
      document.body.appendChild(toast);

      setTimeout(() => {
          toast.classList.add('show');
      }, 10);

      setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 400);
      }, 3000);
  }

  // --- Lógica Principal ---

  addDigit(digit) {
    // 🔥 CORREÇÃO PRINCIPAL AQUI:
    // Se a conta acabou (resetNext é true), limpa tudo antes de por o número novo
    if(this.resetNext) {
        this.currentOperationText.innerText = "";
        this.previousOperationText.innerText = "";
        this.resetNext = false; // Desliga o reset
    }

    let currentRawValue = this.currentOperationText.innerText.replace(/,/g, '');

    if (digit === "." && currentRawValue.includes(".")) {
      return;
    }

    if (currentRawValue.replace('.', '').length >= this.maxDigits && this.currentOperationText.innerText !== "0") {
        this.showWarning();
        return;
    }

    this.currentOperation = digit;
    this.updateScreen();
  }

  processOperation(operation) {
    // Se apertar OPERAÇÃO (+ - * /) logo depois do resultado, 
    // a gente NÃO reseta, a gente continua a conta com o resultado.
    if(this.resetNext && operation !== "C" && operation !== "CE") {
        this.resetNext = false;
    }

    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }

    let operationValue;
    const previous = +this.previousOperationText.innerText.split(" ")[0].replace(/,/g, '');
    const current = +this.currentOperationText.innerText.replace(/,/g, '');

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

  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null
  ) {
    if (operationValue === null) {
      let rawValue = this.currentOperationText.innerText.replace(/,/g, '');

      if (rawValue === "0" && this.currentOperation !== ".") {
        rawValue = this.currentOperation;
      } else {
        rawValue += this.currentOperation;
      }

      this.currentOperationText.innerText = this.formatDisplayNumber(rawValue);
      this.adjustFontSize(this.currentOperationText, this.currentOperationText.innerText.length);

    } else {
      if (previous === 0) {
        operationValue = current;
      }

      let resultString = operationValue.toLocaleString("en-US", { maximumFractionDigits: 10 });

      this.previousOperationText.innerText = `${resultString} ${operation}`;
      this.currentOperationText.innerText = "";
      
      this.currentOperationText.style.removeProperty('font-size');
    }
  }

  changeOperation(operation) {
    const mathOperations = ["*", "/", "+", "-"];
    if (!mathOperations.includes(operation)) return;

    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  processDelOperator() {
    let rawValue = this.currentOperationText.innerText.replace(/,/g, '').slice(0, -1);
    if(rawValue === "") rawValue = "0";
    this.currentOperationText.innerText = this.formatDisplayNumber(rawValue);
    this.adjustFontSize(this.currentOperationText, this.currentOperationText.innerText.length);
  }

  processClearCurrentOperation() {
    this.currentOperationText.innerText = "0";
    this.adjustFontSize(this.currentOperationText, 1);
  }

  processClearAllOperation() {
    this.currentOperationText.innerText = "0";
    this.previousOperationText.innerText = "";
    this.resetNext = false; // Garante que limpou o estado de reset também
    this.adjustFontSize(this.currentOperationText, 1);
  }

  processEqualOperator() {
    let operation = this.previousOperationText.innerText.split(" ")[1];
    
    // Se não tiver operação definida, não faz nada
    if(!operation) return;

    this.processOperation(operation);
    
    let finalResult = this.previousOperationText.innerText.split(" ")[0];
    this.currentOperationText.innerText = finalResult;
    this.previousOperationText.innerText = "";

    this.adjustFontSize(this.currentOperationText, finalResult.length);
    
    // 🔥 AQUI ESTAVA FALTANDO: Liga a bandeirinha de reset!
    this.resetNext = true; 
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