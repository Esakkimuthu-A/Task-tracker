import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, TranslateModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(private translate: TranslateService, private commonService: CommonService) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currLang = localStorage.getItem('lang') ?? 'en';
      this.commonService.initialLoading(currLang);
    }

  }
}
