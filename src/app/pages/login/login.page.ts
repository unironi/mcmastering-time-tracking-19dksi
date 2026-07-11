import { Component, OnInit } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
 import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonInput,
    IonButton
  ]
})

export class LoginPage implements OnInit {

  credentials!: FormGroup;

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.supabaseService.signIn(this.credentials.value).then(async data => {
      await loading.dismiss();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }, async err => {
      await loading.dismiss();
      this.showError('Login failed', err.message);
    });
  }
  
  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.supabaseService.signUp(this.credentials.value).then(async data => {
      await loading.dismiss();
      this.showError('Sign up successful', 'Please confirm your email')
    }, async err => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Registration failed',
        message: err.error.message,
        buttons: ['Ok']
      });
      await alert.present();
    });
  }

  async showError(title: any, msg: any) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['Ok']
    });
    await alert.present();
  }

}
