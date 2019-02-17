import { Person } from '../models/Person';
import { JournalItem } from '../models/JournalItem';
import { Journal } from '../models/Journal';

export class Calculator {
  constructor() {}

  calculate(persons: Person[]) : Journal {
    const total = this.calculateTotal(persons);
    const avg = total / persons.length;
    const journalItems: JournalItem[] = [];
    console.log(avg);
    const newPersons = persons.map(item => {
      const newInleg = item.inleg - avg;
      console.log(newInleg);
  
      return new Person(item.name, newInleg);
    });
    
    const aboveAVG = newPersons.filter(item => item.inleg > 0);
    const belowAVG = newPersons.filter(item => item.inleg < 0);
    
    while (belowAVG.length > 0) {
      const payer = belowAVG.pop();
      const receiver = aboveAVG.pop();
      if (receiver.inleg + payer.inleg < 0) {
        journalItems.push(new JournalItem(payer.name, receiver.name, Math.round(receiver.inleg * 100) / 100));
        payer.inleg += receiver.inleg;
        belowAVG.push(payer);
      } else {
        journalItems.push(new JournalItem(payer.name, receiver.name, Math.round(payer.inleg * -1 * 100) / 100));
        aboveAVG.push(receiver);
      }
    }

    return new Journal(total, journalItems);
  }

  calculateTotal(persons: Person[]) : number {
    const total = persons.reduce((prev, current) => prev + current.inleg, 0);
    return Math.round(total * 100) / 100;
  }
}