import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../mainService/main.service';
import { Subscription } from 'rxjs';
import { ServerResponse } from '../interfaces/serverResponseInterface';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit, OnDestroy  {

  subscriptions: Array<Subscription> = [];
  prevInputValue: string;
  reactiveForm: FormGroup;
  timer: any;
  formIsValid = true;
  containerInfo: ServerResponse;
  private checkSumUcoding = {
    a: 10,
    b: 12,
    c: 13,
    d: 14,
    e: 15,
    f: 16,
    g: 17,
    h: 18,
    i: 19,
    j: 20,
    k: 21,
    l: 23,
    m: 24,
    n: 25,
    o: 26,
    p: 27,
    q: 28,
    r: 29,
    s: 30,
    t: 31,
    u: 32,
    v: 34,
    w: 35,
    x: 36,
    y: 37,
    z: 38
  };

  constructor(
    public mainService: MainService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      containerNumber: new FormControl('', [Validators.required, Validators.maxLength(11)])
    });

    this.subscriptions.push(
      this.mainService.containerObservableSubject.subscribe(
        (data: ServerResponse) => {
          if (!!data.id) {
            this.containerInfo = Object.assign(data);
            console.log('Container data in component', this.containerInfo);
          } else {
            console.log('Data not yet received from server');
          }
        },
        (error) => console.error(error)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => {
        subscription.unsubscribe();
        subscription = null;
      }
    );
    this.subscriptions = [];
  }

  inputRF(): void {
    const input = this.reactiveForm.get('containerNumber');
    const stringIsValid: any = this.inputStringValidator(input.value);

    if (stringIsValid) {
      this.prevInputValue = input.value;
    } else if (!stringIsValid && !this.prevInputValue) {
      input.setValue('');
    } else if (input.value === '' && this.prevInputValue ) {
      input.setValue('');
    } else if (!stringIsValid && this.prevInputValue ) {
      input.setValue(this.prevInputValue);
    }
  }

  inputStringValidator(currentString: string): boolean {
    const lgth = currentString.length;
    let result: boolean;

    if (lgth === 0) {
      return true;
    }

    for (let i = 0; i < lgth; i++) {
      if (i < 4 && currentString[i].match(/[a-z]/i)) {
        result = true;
      } else if (i < 4 && !currentString[i].match(/[a-z]/i)) {
        result = false;
        break;
      } else if (i >= 4 && currentString[i].match(/[0-9]/)) {
        result = true;
      } else if (i >= 4 && !currentString[i].match(/[0-9]/)) {
        result =  false;
        break;
      }
    }

    this.formIsValid = result;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.formIsValid = true, 3500);

    return result;
  }

  containerNumberCheck(containerCode: string): boolean {
    const codeArr = containerCode.split('').slice(0, -1);
    let ekvivalent: number;
    const controlNumber = codeArr.reduce(
      (sum, sign, index) => {
        if (index <= 3) {
          ekvivalent = this.checkSumUcoding[sign.toLowerCase()];
        } else {
          ekvivalent = +sign;
        }
        const term = ekvivalent * Math.pow(2, index);
        return sum + term;
      }, 0
    );

    const matching = (controlNumber % 11 !== 10) ? controlNumber % 11 :  0;
    return matching === +containerCode[10];
  }

  onSubmitRF() {
    const input = this.reactiveForm.get('containerNumber');
    console.log('Форма засабмічена', this.reactiveForm.value);
    const check = this.containerNumberCheck(input.value);
    console.log(check);
    if (check) {
      this.mainService.checkContainerInfo(input.value);
    } else {
      this.messageService.add({severity: 'error', summary: 'Ошибка ввода!', detail: 'Неверный номер контейнера', life: 4500});
    }
  }
}
