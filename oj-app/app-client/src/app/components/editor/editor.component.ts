import { Component, OnInit, Inject } from '@angular/core';

import { ActivatedRoute, Params} from '@angular/router';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;

  public languages: string[] = ['Java', 'C++', 'Python'];
  modes = {'Java': 'java', 'C++': 'c_cpp', 'Python': 'python'};
  language = 'Java';

  sessionId: string;

  output: string;

  defaultContent = {
    'Java': `public class Example {
     public static void main (String[] args) {
        // Let's start from here...

     }
}`,
    'C++': `#include <iostream>
using namespace std;

int main() {
    // Let's start from here...

return 0;
}`,
    'Python': `class Solution:
    def example():
      # Let's start from here...
      `
  };

  constructor(@Inject('collaboration') private collaboration,
              @Inject('data') private data,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // set session id equal to problem id:
    this.route.params
      .subscribe(params => {
        this.sessionId = params['id'];
        this.initEditor();
      });
  }

  initEditor(): void {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.sblockScrolling = Infinity;

    document.getElementsByTagName('textarea')[0].focus();

    // init collaboration service:
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;
    // set editor listener:
    this.editor.on('change', (e) => {
      console.log('editor changed by me: ' + JSON.stringify(e));
      if (this.editor.lastAppliedChange !== e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor moves: ' + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.modes[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
    this.output = '';
  }

  submit(): void {
    const userCode = this.editor.getValue();

    console.log(userCode);

    const data = {
      userCode: userCode,
      lang: this.language.toLowerCase()
    };
    this.data.buildAndRun(data)
      .then(res => this.output = res.text);
  }
}
