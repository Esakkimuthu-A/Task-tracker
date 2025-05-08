import { Component, HostListener, Inject, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HEADING_DETAILS } from '../../constants/to-do-list.constant';
import { AddLabel, AddTask } from '../../models/to-do-list.model';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SharedService } from '../../../shared/services/shared.service';
@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatMenuModule, ReactiveFormsModule, FormsModule, MatSelectModule, CommonModule, SkeletonLoaderComponent, SnackBarComponent, FooterComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent {
  @ViewChild('taskDialog') taskDialog!: TemplateRef<any>;
  @ViewChild('snackRef') snackBar!: SnackBarComponent;
  @ViewChild('moveTasks') moveTasks!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  heading = HEADING_DETAILS;
  taskName: string = '';
  startDate: string = '';
  lastDate: string = '';
  isProfileMenuOpen = false;
  noOfTaskCount: number = 0;
  addTaskForm !: FormGroup;
  addedLabels: AddLabel[] = [];
  tasks: AddTask[] = [];
  mobileView: boolean = false;
  taskId: number = 0;

  labels: AddLabel[] = [
    { name: 'Bug', value: 'bug', color: 'white', backgroundColor: 'red' },
    { name: 'Feature', value: 'feature', color: 'white', backgroundColor: 'green' },
    { name: 'Improvement', value: 'improvement', color: 'black', backgroundColor: 'yellow' },
    { name: 'Documentation', value: 'documentation', color: 'black', backgroundColor: 'lightgray' },
    { name: 'Refactor', value: 'refactor', color: 'white', backgroundColor: 'purple' },
    { name: 'Performance', value: 'performance', color: 'white', backgroundColor: 'darkorange' },
    { name: 'Frontend', value: 'frontend', color: 'white', backgroundColor: 'blue' },
    { name: 'Backend', value: 'backend', color: 'white', backgroundColor: 'brown' },
    { name: 'API', value: 'api', color: 'black', backgroundColor: 'cyan' },
    { name: 'Database', value: 'database', color: 'white', backgroundColor: 'darkgreen' },
    { name: 'UI/UX', value: 'uiux', color: 'black', backgroundColor: 'pink' }
  ];

  isLoading: boolean = true;
  email: string = '';
  name: string = '';
  minStartDate = new Date();
  collapsedStatus: { [status: string]: boolean } = {};
  taskCount: { [key: string]: number } = {};

  constructor(private dialog: MatDialog, private router: Router, private sharedService: SharedService, @Inject(PLATFORM_ID) private platformId: object,) { }

  ngOnInit() {
    this.isLoading = false;
    this.formDeclaration();
    this.heading.forEach(item => {
      this.collapsedStatus[item.status] = false;
    });
    this.addTaskForm.get('startDate')?.valueChanges.subscribe(() => {
      this.addTaskForm.get('endDate')?.reset();
    });
    if (isPlatformBrowser(this.platformId)) {
      const innerWidth = window.innerWidth;
      if (innerWidth <= 1000) {
        this.mobileView = true;
      }
    }
    this.getCurrentUserData();
    this.getCurrentUserTask();
  }

  async getCurrentUserData() {
    const user = await this.sharedService.getCurrentUser();
    if (user?.user_metadata) {
      this.name = user.user_metadata?.name;
      this.email = user?.user_metadata.email;
    }
  }

  async getCurrentUserTask() {
    try {
      this.isLoading = true;
      const task = await this.sharedService.getUserTasks();
      if (task?.data?.length) {
        this.tasks = [...task.data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.isLoading = false;
      }
      else {
        console.log("Please add your task");
        this.isLoading = false;
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      this.snackBar.open('cancel', 'Error fetching tasks', 'error');
    }
  }

  formDeclaration() {
    this.addTaskForm = new FormGroup({
      task: new FormControl(null, Validators.required),
      description: new FormControl(null),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      selectedLabels: new FormControl(''),
      status: new FormControl('open')
    });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.taskDialog, {
      width: '400px',
      disableClose: true,
      maxHeight: '80vh'
    });
  }

  closeDialog() {
    this.dialogRef.close();
    this.addTaskForm.reset();
    this.addedLabels = [];
  }

  async saveTask() {
    if (this.addTaskForm.valid) {
      this.addTaskForm.get('selectedLabels')?.setValue([...this.addedLabels]);
      this.addTaskForm.get('status')?.setValue('open');
      const { task, description, startDate, endDate, selectedLabels, status } = this.addTaskForm.value;
      const data = await this.sharedService.addSupaData(task, description, startDate, endDate, selectedLabels, status);
      if (data) { 
        this.closeDialog();
        this.snackBar.open('check_circle', 'Task added successfully!', 'success');
        this.updateTaskCounts();
        this.addedLabels = [];
        this.addTaskForm.reset();
        this.getCurrentUserTask();
      }
    } else {
      this.snackBar.open('warning', 'Please fill all mandatory fields', 'warning');
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  addLabel() {
    const selectedValue = this.addTaskForm?.get('selectedLabels')?.value;
    const selectedLabel = this.labels.find(label => label.value === selectedValue);
    if (selectedLabel && !this.addedLabels.some(label => label.value === selectedLabel.value)) {
      this.addedLabels.push(selectedLabel);
      this.addTaskForm?.get('selectedLabels')?.setValue('');
    }
  }

  removeLabel(labelToRemove: { name: string; value: string; color: string }) {
    this.addedLabels = this.addedLabels.filter(label => label.value !== labelToRemove.value);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drag(event: DragEvent, task: any) {
    event.dataTransfer?.setData('text', task.id.toString());
  }

  drop(event: DragEvent, status: string) {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text');
    const task = this.tasks.find(t => t.id.toString() === taskId);
    if (task) {
      task.status = status;
      this.updateTaskCounts();
      this.updateTaskStatus(task);
      if(status == "completed"){
        // Once you move your task to 'Completed', it will be automatically deleted after 30 days from that date
        console.log("complete task send mail");
      }
    }
  }

  async updateTaskStatus(content: any): Promise<void> {
    const {
      id,
      task,
      description,
      startDate,
      endDate,
      selectedLabels,
      status
    } = content;
    const updatedData = {
      task,
      description,
      startDate,
      endDate,
      selectedLabels,
      status
    };
    try {
      const data = await this.sharedService.updateTask(id, updatedData);
      if (data) {
        const task = await this.sharedService.getUserTasks();
        if (task?.data?.length) {
          this.tasks = [...task.data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  getTasks(status: string) {
    return this.tasks.filter(t => t.status === status);
  }

  // ?????
  updateTaskCounts() {
    this.noOfTaskCount = this.tasks.filter(t => t.status === status).length;
  }

  getTaskCountByStatus(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

  toggleCollapse(status: string) {
    this.collapsedStatus[status] = !this.collapsedStatus[status];
  }

  isEndDateToday(currentDate: string | Date): boolean {
    const today = new Date();
    const userDate = new Date(currentDate);
    return userDate.getDate() === today.getDate() &&
      userDate.getMonth() === today.getMonth() &&
      userDate.getFullYear() === today.getFullYear();
  }

  // animations
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

  moveTaskDialog(taskId: number) {
    this.dialogRef = this.dialog.open(this.moveTasks, {
      width: '300px',
      height: '200px'
    });
    this.taskId = taskId;
  }

  moveContent(status: any) {
    this.dialogRef.close();
    const moveTask = this.tasks.find(val => val.id === this.taskId);
    if (moveTask) {
      moveTask.status = status;
      this.updateTaskStatus(moveTask);
    }
  }

  getEndDateFilter = (date: Date | null): boolean => {
    const start: Date | null = this.addTaskForm.get('startDate')?.value;
    if (!start || !date) {
      return false;
    }
    return date >= start;
  };

  startDateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date ? date >= today : false;
  };

  logout() {
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event | null) {
    if (isPlatformBrowser(this.platformId)) {
      const innerWidth = event !== null ? (event.target as Window)?.innerWidth : window?.innerWidth;
      if (innerWidth <= 1000) {
        this.mobileView = true;
      } else {
        this.mobileView = false;
      }
    }
  }
}
