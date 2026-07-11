import { ChangeDetectionStrategy, Component, inject, input, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Category } from '../../services/supabase.service';
import { IonLabel, IonItem, IonIcon } from "@ionic/angular/standalone";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [ IonLabel, IonItem, IonIcon, RouterLink ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  private platform = inject(Platform);
  category = input.required<Category>();
  isIos() {
    return this.platform.is('ios')
  }
}

