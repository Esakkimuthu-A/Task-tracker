import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  imports: [MatIconModule, CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
  message: string = '';
  show: boolean = false;
  icon: string = 'check_circle';
  timeout: any;
  type: 'success' | 'warning' | 'error' | 'info' = 'success';

  open(icon: string, msg: string, type: 'success' | 'warning' | 'error' | 'info' = 'success', duration: number = 3000) {
    this.icon = icon;
    this.message = msg;
    this.type = type;
    this.show = true;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.close(), duration);
  }

  close() {
    this.show = false;
    clearTimeout(this.timeout);
  }
}
