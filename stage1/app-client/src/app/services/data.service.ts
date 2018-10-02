import { Injectable } from '@angular/core';
import { Problem } from "../models/problem.model";
import { PROBLEMS } from "../feed-problem";

@Injectable()
export class DataService {

  constructor() { }

  // get all the problems
  getProblems(): Problem[] {
    return PROBLEMS;
  }
  // get specific problem by id
  getProblem(id: number): Problem {
    return PROBLEMS.find((problem) => problem.id === id);
  }

}
