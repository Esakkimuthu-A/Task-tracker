import { Component } from '@angular/core';
import { SOCIAL_MEDIA_ICONS } from '../../../core/constants/to-do-list.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  socialMediaDetails = SOCIAL_MEDIA_ICONS;
}
