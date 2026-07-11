import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Role } from '../../services/supabase.service';
import { IonLabel, IonItem, IonIcon } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  imports: [ IonLabel, IonItem, IonIcon, RouterLink ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleComponent {
  private platform = inject(Platform);
  role = input.required<Role>();

  isIos() {
    return this.platform.is('ios')
  }

}
