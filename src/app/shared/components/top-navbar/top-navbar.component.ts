import { Component, computed, effect, EventEmitter, input, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-top-navbar',
  imports: [MatMenuModule, MatIconModule, NgChartsModule, MatDialogModule, MatTooltipModule, TranslateModule,CommonModule],
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
  @ViewChild('chartContent') chartContent!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isValid !: boolean;

  public doughnutChartData: ChartData<'doughnut'> | undefined;

  public doughnutChartType: ChartType = 'doughnut';

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    aspectRatio: 1,
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1000,
      easing: 'linear',
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  constructor(private sharedService: SharedService, private router: Router, private dialog: MatDialog) {
    effect(() =>{
     const count = this.sharedService.statusCount();
     const allZero = Object.values(count).every(val => val === 0);
     this.isValid = !allZero;
      this.doughnutChartData = {
        labels: ['Open', 'In Progress', 'Completed'],
        datasets: [
          {
            data: [
              count.open,
              count.inProgress,
              count.completed,
            ],
            backgroundColor: ['gray', 'rgb(238, 230, 0)', 'rgb(0, 153, 102)'],
            hoverOffset: 8,
            borderWidth: 0,
          },
        ],
      };
    })
   }

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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.shiftKey && event.key.toLowerCase() === 't') {
      event.preventDefault();
      this.onAddTask();
    }
  }

  onAddTask() {
    this.addTaskClicked.emit();
  }

  async logout() {
    await this.sharedService.signOut();
    this.router.navigate(['/login']);
  }

  viewChart() {
    this.dialogRef = this.dialog.open(this.chartContent, {
      width: '500px',
      height: '550px'
    });
  }
}
