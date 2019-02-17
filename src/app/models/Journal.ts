import { JournalItem } from './JournalItem';

export class Journal {
  constructor(
    public total: number,
    public items: JournalItem[] = []
  ) {}
}