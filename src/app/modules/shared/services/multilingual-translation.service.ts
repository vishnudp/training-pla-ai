import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultilingualTranslationService {
  currentLanguage = 'en';
  languages: string[] = ['en', 'hi']
  private languageChange = new BehaviorSubject<string>('');
  public languageChange$ = this.languageChange.asObservable();
  constructor() { }

  initializeLanguage() {
    const language = localStorage.getItem('lang');
    if (language) {
      this.currentLanguage = language;
     
      this.languageChange.next(this.currentLanguage);
    } else {
      localStorage.setItem('lang', this.currentLanguage);
      this.languageChange.next(this.currentLanguage);
    }
  }

  setlanguageChange(lang: string) {
    this.languageChange.next(lang);
  }
}
