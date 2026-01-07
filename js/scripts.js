const previousOperationText = document.querySelector("#previous-operation")
const currentOperationText = document.querySelector("#current-operation")
const buttons = document.querySelectorAll("#buttons-container button") 

class Calculator {
    constructor(previousOperationText, currentOperationText) {
        this.previousOperationText = previousOperationText;
        this.currentOperationText = currentOperationText;
        this.currentOperation = "";
    }

    addDigit(digit) {

        // check if current operation already has a dot
        if(digit === "." && this.currentOperationText.innerText.includes(".")) {
            return;
        }

        this.currentOperation = digit;
        this.updateScreen();
    } 

    // process all calculator operations
    processOperation(operation) {
        // check if current is empty
        if(this.currentOperationText.innerText === "" && operation !== "C") {
            // Change operation
            if(this.previousOperationText.innerText !== "") {
                this.changeOperation(operation);
            }
            return;
        }

        // Get current and previous value
        let operationValue
        const previous = +this.previousOperationText.innerText.split(" ")[0];
        const current = +this.currentOperationText.innerText;
        
        switch(operation) {
            case "+":
                operationValue = previous + current
                this.updateScreen(operationValue, operation, current, previous);
                break;
            case "-":
                operationValue = previous - current
                this.updateScreen(operationValue, operation, current, previous);
                break;
            case "*":
                operationValue = previous * current
                this.updateScreen(operationValue, operation, current, previous);
                break;
            case "/":
                operationValue = previous / current
                this.updateScreen(operationValue, operation, current, previous);
                break;
            // ...restante do código acima
            case "DEL":
                this.processDelOperator(); // Sem conta matemática aqui!
                break;
            case "CE":
                this.processClearCurrentOperation();
                break;
            case "C":
                this.processClearOperation();
                break;
            case "=":
                this.processEqualOperator();
                break;
            // ...
            default:
                return;
                
        }

    }

    // change values of the canculator screen
    updateScreen(
        operationValue = null, 
        operation = null, 
        current = null, 
        previous = null
    ) {
        if(operationValue === null) {
            this.currentOperationText.innerText += this.currentOperation;
        }else{
            //check if value is zero, if it is just add current value
            if(previous === 0) {
                operationValue = current
            }

            // add current value to previous
            this.previousOperationText.innerText = `${operationValue} ${operation}`;
            this.currentOperationText.innerText = "";
        }
    }

    // Change math operation
    changeOperation(operation) {

        const mathOperations = ["*", "+", "/", "-"]
        if(!mathOperations.includes(operation)) {
            return;
        }

        this.previousOperationText.innerText = this.previousOperationText.innerText.slice(0, -1) + operation;
    }

    // Delet the last digit
    processDelOperator() {
        this.currentOperationText.innerText = this.currentOperationText.innerText.slice(0, -1);

    }

    // Clear current operation
    processClearCurrentOperation() {
        this.currentOperationText.innerText = "";
    }

    // Process Clear all operation
    processClearOperation() {
        this.currentOperationText.innerText = "";
        this.previousOperationText.innerText = "";

    }

    // Process all operation
    processEqualOperator() {
        // 1. Faz a conta normal (igual fazia antes)
        const operation = previousOperationText.innerText.split(" ")[1];
        this.processOperation(operation);

        // 2. O TRUQUE MÁGICO ✨
        // Pega o resultado que ficou lá em cima (pequeno) e traz para baixo
        const result = this.previousOperationText.innerText.split(" ")[0];

        // Mostra no visor grande
        this.currentOperationText.innerText = result;

        // Limpa o visor de cima (tira o sinal e o número antigo)
        this.previousOperationText.innerText = "";

        // Atualiza a memória da calculadora para continuar a conta
        this.currentOperation = result;
    }

    
 }

const calc = new Calculator(previousOperationText, currentOperationText);

buttons.forEach((btn) => { // Agora coincide com a variável do topo
    btn.addEventListener("click", (e) => {
        const value = e.target.innerText;
        if (+value >= 0 || value === ".") {
            calc.addDigit(value);
        } else {
            calc.processOperation(value);
            
        }
    // ... código anterior dos botões ...
    }) 
})

// EVENTOS DE TECLADO (COLE NO FINAL DO ARQUIVO JS)
window.addEventListener("keydown", (e) => {
    const value = e.key;

    if(+value >= 0 || value === ".") {
        calc.addDigit(value);
    } 
    else if(value === "Enter") {
        e.preventDefault(); // <--- ISSO IMPEDE O ENTER DE "CLICAR" EM OUTRA COISA
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
    else {
        calc.processOperation(value);
    }
});
