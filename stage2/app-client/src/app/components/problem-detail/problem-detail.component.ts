import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {

  problem: Problem;

  constructor(
    private route: ActivatedRoute,
    @Inject('data') private data
  ) { }


  ngOnInit() {
    // subscribe: whenever the params have changed, the function is called
    this.route.params.subscribe(params => {
      // +: transfer string into number
      this.data.getProblem(+params['id'])
                .then(problem => this.problem = problem);
    });
  }

}
