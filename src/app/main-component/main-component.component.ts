import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit {

  prevInputValue: string;
  reactiveForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      containerNumber: new FormControl('', [Validators.required, Validators.maxLength(11)])
    });
  }

  inputRF() {
    const input = this.reactiveForm.get('containerNumber');
    const newSign = this.stringChangeDetector(input.value);
    const newSignIsChar = newSign.sign.match(/[a-z]/i);

    console.log('Введено:', newSign.sign, 'No-Prev:', !this.prevInputValue, 'Input index:', newSign.index, 'Match:', !!newSignIsChar);

    if (!this.prevInputValue && newSignIsChar) {
      this.prevInputValue = input.value[newSign.index];
      console.log('Перший корректний знак:', this.prevInputValue);
    } else if (!newSignIsChar && !this.prevInputValue) {
      console.log('Значення не принято!')
      input.setValue('');
    } else if (
      this.prevInputValue &&
      (newSign.action === 'add') &&
      newSign.index < 4 &&
      newSignIsChar) {
      this.prevInputValue = input.value;
      console.log('Значення буквенного інтервалу прийното!', this.prevInputValue);
    } else if (
      this.prevInputValue &&
      (newSign.action === 'add') &&
      newSign.index >= 4 &&
      newSignIsChar) {
      console.log('До числового інтервалу введено букву, повернуто:', this.prevInputValue);
      input.setValue(this.prevInputValue);
    }
  }

  stringChangeDetector(currentString: string) {
    const prevStrArr = this.prevInputValue ? this.prevInputValue.split('') : [];
    const currentStrArr = currentString.split('');
    console.log(prevStrArr, currentStrArr);

    for (let i = 0; i < (Math.max(prevStrArr.length, currentStrArr.length)); i++) {
      if (prevStrArr[i] === currentStrArr[i]) {
        continue;
      } else {
        const result = {
          index: i,
          sign: currentStrArr[i],
          action: (prevStrArr.length < currentStrArr.length) ? 'add' : (prevStrArr.length === currentStrArr.length) ? 'mod' : 'del',
        };
        return result;
      }

    }
  }

  onSubmitRF() {
    console.log('Форма засабмічена', this.reactiveForm.value);

  }

}
