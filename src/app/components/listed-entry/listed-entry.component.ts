import { Component, input, OnInit } from '@angular/core';
import { IonLabel, IonItem } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listed-entry',
  templateUrl: './listed-entry.component.html',
  styleUrls: ['./listed-entry.component.scss'],
  imports: [ IonLabel, IonItem, RouterLink ]
})
export class ListedEntryComponent {
  entry = input.required<any>();
}
