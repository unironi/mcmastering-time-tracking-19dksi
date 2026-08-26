import { Component, inject, OnInit } from '@angular/core';
import { IonToast, IonFooter, IonButton, IonTextarea, IonInput, IonItem, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";
import { ActivatedRoute, Router } from '@angular/router';
import { Role, SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
  imports: [ FormsModule, IonToast, IonButton, IonFooter, IonTextarea, IonInput, IonItem, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent ]
})
export class EntryPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);

  // entry$ = this.supabaseService.entry;

  role_info!: Role | null;
  role_id!: string;
  cat_id!: string;

  hours: number = 0;
  notes: string = '';
  entry: any;

  constructor() { }

  async ngOnInit() {
    this.role_id = this.activatedRoute.snapshot.paramMap.get('role_id') as string;
    this.cat_id = this.activatedRoute.snapshot.paramMap.get('category_id') as string;
    this.role_info = await this.supabaseService.getRole(this.role_id);

    // this.entry$.subscribe(e => {
      this.entry = await this.supabaseService.loadEntry(this.role_id);
      if (this.entry) {
        this.hours = this.entry.hours as number;
        this.notes = this.entry.notes as string;
      }
    // });
  }

  async saveChanges() {
    const entry = await this.supabaseService.getEntry(this.role_id);
  // this.entry$.subscribe(async entry => {
    if (entry) { // if entry exists, update it
      if (this.hours <= 0 && this.notes == "") {
        await this.supabaseService.removeEntry(this.role_id);
        console.log("removed entry");
      } else {
        await this.supabaseService.updateEntry(this.role_id, this.hours, this.notes);
        console.log("saved changes");
      }
      
    } else { // otherwise create the entry if hours and notes has been populated
      if (this.hours > 0 && this.notes != null) {
        await this.supabaseService.addEntry(this.role_id, this.hours, this.notes);
        console.log("new entry added");
      }
    }
    await this.supabaseService.loadEntry(this.role_id);
  // })
  }

  async remove() {
    await this.supabaseService.removeEntry(this.role_id);
    this.hours = 0;
    this.notes = "";
    console.log("removed entry");
  }

  goBack() {
    return this.router.url.includes('recent-entries') ? '/recent-entries' : `/category/${this.cat_id}`;
  }

}
