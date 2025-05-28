import { Component } from '@angular/core';
import { SOCIAL_MEDIA_ICONS } from '../../../core/constants/to-do-list.constant';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  imports: [CommonModule,TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(private commonService : CommonService){}
  socialMediaDetails = SOCIAL_MEDIA_ICONS;
  selectedLanguage: string = 'en';

  onLanguageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.selectedLanguage = lang;
    this.commonService.currentLanguage.set({ languageCode: lang });
  }
}
