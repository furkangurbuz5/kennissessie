import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TasksComponent } from './tasks/tasks.component';
import { MessagesComponent } from './messages/messages.component';
import { StreamsComponent } from './streams/streams.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
  { path: 'home', component: StartComponent, title: 'Kennissessie Angular(PRs)' },
  { path: 'rxjs', component: StreamsComponent, title: 'RxJS' },
  { path: 'services', component: TasksComponent, title: 'Services' },
  { path: 'changedetection', component: MessagesComponent, title: 'Change Detection' },
];
