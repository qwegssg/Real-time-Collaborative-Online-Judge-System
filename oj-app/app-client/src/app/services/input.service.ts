import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class InputService {

  // initialize the BehaviorSubject with EMPTY STRING, so that every problem will survive at the beginning
  private inputSubject$ = new BehaviorSubject<string>('');

  constructor() { }

  // setter: inputSubject$ acts as a consumer at this time.
  changeInput(term): void {
    this.inputSubject$.next(term);
  }

  // getter: inputSubject$ acts as a producer.
  getInput(): Observable<string> {
    return this.inputSubject$.asObservable();
  }

}
