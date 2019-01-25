import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { PROBLEMS } from '../feed-problem';

@Injectable()
export class DataService {

  private problemsSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) { }

  // get all the problems
  getProblems(): Observable<Problem[]> {
    this.http.get('api/v1/problems')
              .toPromise()
              .then((res: Response) => {
                this.problemsSource.next(res.json());
              })
      .catch(this.handleError);

    return this.problemsSource.asObservable();
  }

  // get specific problem by id
  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
                      .toPromise()
                      .then((res: Response) => res.json())
                      .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<Problem> {
   const headers = new Headers({ 'content-type': 'application/json' });
   const requestOptions = new RequestOptions({ headers: headers});
    return this.http.post('api/v1/problems', problem, requestOptions)
      .toPromise()
      .then((res: Response) => {
        // call getProblems again to update the list view when new problem is added
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  // error handler
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }
}
