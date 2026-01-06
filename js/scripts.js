const previousOperationText = document.querySelector("#previous-operation")
const currentOperationText = document.querySelector("#current-operation") // Corrigido #
const buttons = document.querySelectorAll("#buttons-container button") // Corrigido para plural

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
            case "DEL":
                operationValue = previous / current
                this.processDelOperator();
                break;
            case "CE":
                operationValue = previous / current
                this.processClearCurrentOperation();
                break;
            case "C":
                operationValue = previous / current
                this.processClearOperation();
                break;
            case "=":
                operationValue = previous / current
                this.processEqualOperator();
                break;
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

        const operation = previousOperationText.innerText.split(" ")[1];
        this.processOperation(operation);

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
    }) 
})
