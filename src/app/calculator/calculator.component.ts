import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports:[],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  // Signal-based reactive state for display
  displayValue = signal('0');

  // Internal calculator state
  private firstOperand: number | null = null;
  private operator: string | null = null;
  private waitingForSecond = false;

  // Append number to display
  appendNumber(num: number) {
    if (this.waitingForSecond) {
      this.displayValue.set('' + num);
      this.waitingForSecond = false;
    } else {
      const current = this.displayValue();
      this.displayValue.set(current === '0' ? '' + num : current + num);
    }
  }

  // Add decimal point
  appendDot() {
    if (!this.displayValue().includes('.')) {
      this.displayValue.set(this.displayValue() + '.');
    }
  }

  // Clear all state and display
  clearAll() {
    this.displayValue.set('0');
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecond = false;
  }

  // Clear only current entry
  clearEntry() {
    this.displayValue.set('0');
  }

  // Remove last digit
  backspace() {
    const current = this.displayValue();
    this.displayValue.set(current.length > 1 ? current.slice(0, -1) : '0');
  }

  // Change sign of current number
  toggleSign() {
    const value = parseFloat(this.displayValue());
    this.displayValue.set((value * -1).toString());
  }

  // Set operation and prepare for next input
  setOperator(op: string) {
    const current = parseFloat(this.displayValue());

    if (this.firstOperand === null) {
      this.firstOperand = current;
    } else if (this.operator) {
      this.firstOperand = this.performCalculation();
    }

    this.operator = op;
    this.waitingForSecond = true;
  }

  // Compute result and reset
  calculateResult() {
    if (this.operator && this.firstOperand !== null) {
      const result = this.performCalculation();
      this.displayValue.set(result.toString());
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecond = false;
    }
  }

  // Perform calculation
  private performCalculation(): number {
    const secondOperand = parseFloat(this.displayValue());

    switch (this.operator) {
      case '+': return this.firstOperand! + secondOperand;
      case '-': return this.firstOperand! - secondOperand;
      case '*': return this.firstOperand! * secondOperand;
      case '/': return secondOperand !== 0 ? this.firstOperand! / secondOperand : 0;
      default: return secondOperand;
    }
  }
}
