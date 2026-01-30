import { Component } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-streams',
  standalone: true,
  imports: [],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.css'
})
export class StreamsComponent {

  ngOnInit(){

    // interval(1000).pipe(
    //   map((number) => number * 1.05)
    // ).subscribe(
    //   {
    //     next: (n) => console.log(n),
    //   }
    // )


    
    //HTTP:

    // .subscribe() triggert de request. Verschil ten opzichte van Kotlin?

  }

}
