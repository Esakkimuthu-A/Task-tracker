import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  currentLanguage: WritableSignal<{ languageCode: string }> = signal({ languageCode: 'en' });

  constructor(private translate: TranslateService) {
    effect(() => {
      const langCode = this.currentLanguage().languageCode;
      this.initialLoading(langCode);
    });
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLanguage.set({ languageCode: lang });
  }

  initialLoading(language: string) {
    const supportLanguage = ["en", "ta"];
    const finalLanguage = supportLanguage.includes(language) ? language : 'en';
    this.translate.use(finalLanguage);
  }
}
