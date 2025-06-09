import { Component, computed, effect } from '@angular/core';
import { SOCIAL_MEDIA_ICONS } from '../../../core/constants/to-do-list.constant';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  selectedLanguage = computed(() => this.commonService.currentLanguage().languageCode);
  constructor(private commonService: CommonService) {}
  socialMediaDetails = SOCIAL_MEDIA_ICONS;

  onLanguageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('lang', lang);
    }
    this.commonService.currentLanguage.set({ languageCode: lang });
  }
}
