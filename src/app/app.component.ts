import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Calculator } from './logic/Calculator';
import { Journal } from './models/Journal';
import { Person } from './models/Person';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatListOption, MatSelectionList } from '@angular/material';
import { TestingCompiler } from '@angular/core/testing/src/test_compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('nameField') nameField: ElementRef;
  @ViewChild('inlegField') inlegField: ElementRef;

  title = 'verrekenapp';
  deelnemerForm: FormGroup;
  journal: Journal;
  people = [];
  total: number;

  ngOnInit() {
    console.log(this.people);
    this.deelnemerForm = new FormGroup(
      {
        'naam': new FormControl(null, [Validators.required, this.validName.bind(this)]),
        'inleg': new FormControl(null, [Validators.required, this.validInleg.bind(this)])
      }
    );
  }

  constructor() { }

  delete(list: MatSelectionList) {
    this.journal = null;
    const options = list.options.toArray();
    const listSize = options.length;
    const newPeople = [];
    options.reverse().forEach((option, index) => {
      const item = this.people.pop();
      if (!option.selected) {
        newPeople.push(item);
      }
    });
    this.people = newPeople.reverse();
    this.total = new Calculator().calculateTotal(this.people);
  }

  canDelete(list: MatSelectionList) {
    return list.selectedOptions.selected.length > 0;
  }

  validName(control: FormControl): { [s: string]: boolean } {
    console.log(control);
    const value = control.value;
    const regexp = new RegExp('^[a-zA-Z]([a-zA-Z0-9]){2,14}');
    if (regexp.test(value) !== true) {
      return { value: false };
    } else {
      return null;
    }
  }

  validInleg(control: FormControl): { [s: string]: boolean } {
    const value = control.value;
    const regexp = new RegExp('^[0-9]{0,4}((\.[0-9]{0,3})?|(\,[0-9]{0,3})?)?$');
    if (regexp.test(value) !== true) {
      return { value: false };
    } else {
      return null;
    }
  }

  onSubmit() {
    this.nameField.nativeElement.blur();
    this.inlegField.nativeElement.blur();
    this.journal = null;
    const name = this.deelnemerForm.value['naam'];
    const amount = this.deelnemerForm.value['inleg'].replace(',', '.');
    this.people.push(new Person(name, + amount));
    this.total = new Calculator().calculateTotal(this.people);
    this.deelnemerForm.reset();
    this.deelnemerForm.markAsPristine();
    this.deelnemerForm.markAsUntouched();
    this.deelnemerForm.updateValueAndValidity();
  }

  calculate() {
    const calculator = new Calculator();
    this.journal = calculator.calculate(this.people);
  }

  canCalculate() {
    return this.people.length > 1;
  }
}
