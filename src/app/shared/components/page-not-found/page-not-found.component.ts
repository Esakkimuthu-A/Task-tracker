import { Component, HostListener } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, TranslateModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(private translate: TranslateService, private commonService: CommonService,private router: Router) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currLang = localStorage.getItem('lang') ?? 'en';
      this.commonService.initialLoading(currLang);
    }
  }

  backToDashBoard(){
     this.router.navigate(['dashboard']);
  }

}
