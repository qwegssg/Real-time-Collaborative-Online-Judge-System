import { Injectable } from '@angular/core';
import { Problem } from "../models/problem.model";
import { PROBLEMS } from "../feed-problem";

@Injectable()
export class DataService {

  // assign the PROBLEMS array to a new array so that new problems can be added to the array
  problems: Problem[] = PROBLEMS;

  constructor() { }

  // get all the problems
  getProblems(): Problem[] {
    return this.problems;
  }
  // get specific problem by id
  getProblem(id: number): Problem {
    return this.problems.find((problem) => problem.id === id);
  }

  addProblem(problem: Problem): void {
    problem.id = this.problems.length + 1;
    this.problems.push(problem);
  }

}
