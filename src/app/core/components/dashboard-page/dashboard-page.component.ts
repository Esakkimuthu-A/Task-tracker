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
import { CommonModule } from '@angular/common';
import { corrections, HEADING_DETAILS } from '../../constants/to-do-list.constant';
import { AddLabel, AddTask, statusCount } from '../../models/to-do-list.model';
import { NavigationStart, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SharedService } from '../../../shared/services/shared.service';
import { getInitials, getStatusCounts } from '../../utilities/user.util';
import { TopNavbarComponent } from '../../../shared/components/top-navbar/top-navbar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dashboard-page',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatMenuModule, ReactiveFormsModule, FormsModule, MatSelectModule, CommonModule, SkeletonLoaderComponent, SnackBarComponent, FooterComponent, TopNavbarComponent, TranslateModule],
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
  noOfTaskCount: number = 0;
  addTaskForm !: FormGroup;
  addedLabels: AddLabel[] = [];
  tasks: AddTask[] = [];
  taskId: number = 0;
  userInput = '';

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
  initials: string = '';
  imageUrl: any;
  addTaskAnimation: boolean = false;
  minStartDate = new Date();
  collapsedStatus: { [status: string]: boolean } = {};
  taskCount: { [key: string]: number } = {};

  constructor(private dialog: MatDialog, private router: Router, private sharedService: SharedService, @Inject(PLATFORM_ID) private platformId: object, private sanitizer: DomSanitizer, private translateService: TranslateService) { }

  ngOnInit() {
    this.addTaskAnimation = false;
    this.formDeclaration();
    this.heading.forEach(item => {
      this.collapsedStatus[item.status] = false;
    });
    this.addTaskForm.get('startDate')?.valueChanges.subscribe(() => {
      this.addTaskForm.get('endDate')?.reset();
    });
    this.getCurrentUserData();
    this.getCurrentUserTask();
  }

  async getCurrentUserData() {
    const user = await this.sharedService.getCurrentUser();
    console.log(user);
    if (user?.user_metadata) {
      this.name = user.user_metadata?.name;
      this.email = user?.user_metadata.email;
      if (user?.user_metadata?.avatar_url) {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(user?.user_metadata?.avatar_url);
      }
      else {
        this.initials = getInitials(user.user_metadata?.name);
      }
    }
  }

  async getCurrentUserTask() {
    try {
      this.isLoading = true;
      const task = await this.sharedService.getUserTasks();
      if (task?.data?.length) {
        this.addTaskAnimation = false;
        this.tasks = [...task.data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.sharedService.statusCount.set(getStatusCounts(this.tasks))
        this.isLoading = false;
      }
      else {
        console.log("Please add your task");
        this.addTaskAnimation = true;
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
      maxHeight: '80vh',
      panelClass: 'custom-dialog-container'
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
      if (status) {
        this.updateTimeStamp(task);
        this.updateTaskStatus(task);
        // Once you move your task to 'Completed', it will be automatically deleted after 30 days from that date
        // console.log("complete task send mail");
      }
    }
  }

  async updateTimeStamp(task: any) {
    const data = await this.sharedService.completeTask(task);
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
          this.sharedService.statusCount.set(getStatusCounts(this.tasks))
        }
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  }

  getTasks(status: string) {
    return this.tasks.filter(t => t.status === status);
  }

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

  moveTaskDialog(taskId: number) {
    this.dialogRef = this.dialog.open(this.moveTasks, {
      width: '300px',
      height: '250px'
    });
    this.taskId = taskId;
  }

  getTranslatedCharacters(key: string): string[] {
    const translated = this.translateService.instant(key);
    if ('Segmenter' in Intl) {
      const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(translated), (s: any) => s.segment);
    }
    return Array.from(translated);
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

  autoCorrect() {
    const words = this.userInput.split(' ');
    const corrected = words.map(word =>
     corrections[word.toLowerCase()] || word
    );
    this.userInput = corrected.join(' ');
  }

  @HostListener('window:popstate')
  onPopState() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
        this.handlePopstateLogout();
      }
    });
  }

  async handlePopstateLogout() {
    try {
      await this.sharedService.signOut();
    } catch (error) {
      console.error('Error during signOut on popstate:', error);
    }
  }

}
