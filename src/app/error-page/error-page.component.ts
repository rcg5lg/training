import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  template: `
    <div class='jumbotron'>
      <div class="container">
        <h1>Woooops....</h1>
        <p>Page can not be found!</p>
        <p>Please <a href="#" class="btn btn-primary">report issue </a> or <a href="#" class="btn btn-primary">return to home</a></p>
     </div>
    </div>
  `,
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
