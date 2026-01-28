import { Component } from '@angular/core';

@Component({
  selector: 'app-info-message',
  standalone: true,
  imports: [],
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.css',
})
export class InfoMessageComponent {
  get debugOutput() {
    console.log('[InfoMessages] method getriggered');
    return 'InfoMessage Component Debug Output';
  }

  onLog() {
    console.log('Clicked!');
  }
}
