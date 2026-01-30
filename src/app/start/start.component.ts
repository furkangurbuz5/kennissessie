import { Component } from '@angular/core';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css',
})
export class StartComponent {
  sections: { [key: string]: boolean } = {
    structure: false,
    template: false,
    logic: false,
    inputs: false,
    di: false,
    performance: false,
    http: false,
    testing: false,
    styling: false,
    errors: false,
    docs: false,
    modern: false,
    security: false,
    accessibility: false,
    i18n: false,
  };

  toggleSection(section: string) {
    this.sections[section] = !this.sections[section];
  }
}
