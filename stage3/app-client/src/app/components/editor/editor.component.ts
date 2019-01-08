import { Component, OnInit } from '@angular/core';

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

  defaultContent = {
    'Java': `public class Example {
     public void static main (String[] args) {
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

  constructor() { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
    this.editor.sblockScrolling = Infinity;
  }

  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    this.editor.getSession().setMode('ace/mode/' + this.modes[this.language]);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    const userCode = this.editor.getValue();
    console.log(userCode);
  }
}
