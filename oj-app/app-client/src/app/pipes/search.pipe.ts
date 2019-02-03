import { Pipe, PipeTransform } from '@angular/core';

import { Problem } from '../models/problem.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // create a search pipe to filter the matched problems:
  // attention: change both the input term and problem name into lower case to get fit!
  // the return array contains the matched problems.
  transform(problems: Problem[], term: string): Problem[] {
    // console.log(problems);
    return problems.filter(
      problem => problem.name.toLowerCase().includes(term.toLowerCase())
    );
  }

}
