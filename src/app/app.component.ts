import { Component } from '@angular/core';

import { TasksComponent } from './tasks/tasks.component';
import { MessagesComponent } from "./messages/messages.component";
import { CounterComponent } from "./counter/counter.component";
import { interval, map } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet, RouterLink],
})
export class AppComponent {
    get debugOutput() {
    console.log('[AppComponent] "debugOutput" binding re-evaluated.');
    return 'AppComponent Component Debug Output';
  }

}
