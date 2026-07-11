import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Entry {
  id: string;
  user_id: string;
  group_id: string;
  role_id: string;
  hours: number;
  created_at: string;
  updated_at: string;  
}

export interface Category {
  id: string,
  group_id: string,
  name: string,
  created_by: string,
  created_at: string
}

export interface Role {
  id: string,
  category_id: string,
  name: string,
  weight: number,
  description: string,
  created_by: string,
  created_at: string
}

const ENTRIES = 'entries';
const CATEGORIES = 'categories';
const ROLES = 'roles';
const GROUP_MEMBERS = 'group_members';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  supabase: SupabaseClient;
  entriesSubscribed: boolean = false;

  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  private _entries: BehaviorSubject<any> = new BehaviorSubject([]);
  private _categories = new BehaviorSubject<Category[]>([]);
  private _roles: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);

      if (event == 'SIGNED_IN') {
        this._currentUser.next(session?.user);
        this.loadEntries();
      } else {
        this._currentUser.next(false);
      }
    })
  }

  // Registration functions

  async signUp(credentials: { email: any, password: any }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp(credentials); 
      if (error) reject(error);
      else resolve(data);
    })
  }

  async signIn(credentials: { email: any, password: any }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signInWithPassword(credentials); 
      if (error) reject(error);
      else resolve(data);
    })
  }

  async signOut() {
    await this.supabase.auth.signOut();

    this.supabase.removeAllChannels(); // remove's all of client's subscriptions
    this.entriesSubscribed = false;

    this.router.navigateByUrl('/');
  }

  // Getters

  get categories() {
    return this._categories.asObservable();
  }

  get roles() {
    return this._roles.asObservable();
  }

  get entries() {
    return this._entries.asObservable();
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }

  // fetch updates

  async loadCategories() {
    const query = await this.supabase.from(CATEGORIES).select('*');
    console.log("data ", query.data);
    console.log("error ", query.error)
    if(query.data) this._categories.next(query.data);
  }

  async loadRoles(cat_id: string) {
    const query = await this.supabase.from(ROLES).select('*').eq('category_id', cat_id);
    console.log("error ", query.error);
    console.log("data", query.data);
    this._roles.next(query.data);
  }

  async loadEntries() {
    const query = await this.supabase.from(ENTRIES).select('*');
    // console.log(query.data);
    this._entries.next(query.data);
  }

  // CRUD functions

  // entries
  async addEntry(role_id: string, hours: number) {
    const user_id = await this.supabase.auth.getUser();

    if (user_id.error) {
      console.log(user_id.error);
      return;
    }

    const newEntry = {
      user_id: user_id.data.user?.id,
      role_id,
      hours
    }

    const result = await this.supabase.from(ENTRIES).insert(newEntry);
  }

  async removeEntry(id: any) {
    await this.supabase.from(ENTRIES).delete().match({ id });
  }

  async updateEntry(id: any, hours: number) {
    await this.supabase.from(ENTRIES).update({ hours }).match({ id });
  }
  
  handleEntriesChange() {
    if (this.entriesSubscribed) return;

    console.log('subscribing...');

    this.supabase
    .channel('db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'entries'
      },
      (payload) => {
        console.log(payload);
        this.loadEntries();
      }
    )
    .subscribe();

    this.entriesSubscribed = true;
  }

  // categories

  // roles
  
}
