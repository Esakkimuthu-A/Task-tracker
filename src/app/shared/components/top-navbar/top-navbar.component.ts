import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navbar',
  imports: [MatMenuModule,MatIconModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {
  @Input() addTaskAnimation !: boolean;
  @Input() userInitials !: string;
  @Input() userName !: string;
  @Input() userEmail !: string;
  @Input() imageUrl !: any;

  @Output() addTaskClicked = new EventEmitter<void>();
  
  constructor(private sharedService: SharedService,private router: Router){}

  onClick(e: MouseEvent): void {
    const task = e.currentTarget as HTMLElement;
    const rect = task.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < 15; i++) {
      const burst = document.createElement("div");
      burst.className = "burst";
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;
      burst.style.setProperty("--x", `${Math.random() * 200 - 100}px`);
      burst.style.setProperty("--y", `${Math.random() * 200 - 100}px`);
      burst.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
      task.appendChild(burst);
      setTimeout(() => burst.remove(), 700);
    }
  }

  onAddTask(){
    this.addTaskClicked.emit();
  }

  async logout() {
    await this.sharedService.signOut();
    this.router.navigate(['/login']);
  }

}
