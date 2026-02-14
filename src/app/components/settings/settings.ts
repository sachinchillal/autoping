import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
})
export class Settings {
  constructor(protected readonly themeService: ThemeService) {}
}
