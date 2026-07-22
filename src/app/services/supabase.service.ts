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
  notes: string;
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
  event_type: string,
  entry_code: string,
  admin_only: boolean,
  support_text: string,
  created_by: string,
  created_at: string,
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

  private _currentUser = new BehaviorSubject<any>(null);
  private _entry = new BehaviorSubject<Entry | null>(null);
  private _categories = new BehaviorSubject<Category[]>([]);
  private _roles = new BehaviorSubject<Role[]>([]);

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

  get entry() {
    return this._entry.asObservable();
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
    if(query.data) this._roles.next(query.data);
  }

  async loadEntry(role_id: string) {
    const entry = await this.getEntry(role_id);
    this._entry.next(entry);
    return entry;
  }

  async getEntry(role_id: string): Promise<Entry | null> {
    const user = await this.supabase.auth.getUser();

    if (user.error) {
      console.log(user.error);
      return null;
    }

    const query = await this.supabase.from(ENTRIES).select('*').match({ user_id: user.data.user?.id, role_id }).maybeSingle();
    
    if (query.error) {
      console.log(query.error);
      //this._entryError.next(query.error);
      return null;
    }
    // } else {
    //   console.log("no entry error");
    //   this._entryError.next(null);
    // }
    
    return query.data;
  }

  // CRUD functions

  // entries
  async addEntry(role_id: string, hours: number, notes: string) {
    const user_id = await this.supabase.auth.getUser();

    if (user_id.error) {
      console.log(user_id.error);
      return;
    }

    const newEntry = {
      user_id: user_id.data.user?.id,
      role_id,
      hours,
      notes
    }

    await this.supabase.from(ENTRIES).insert(newEntry);
  }

  async removeEntry(id: any) {
    await this.supabase.from(ENTRIES).delete().match({ id });
  }

  async updateEntry(role_id: any, hours: number, notes: string) {
    const user_id = await this.supabase.auth.getUser();
    await this.supabase.from(ENTRIES).update({ hours, notes }).match({ user_id: user_id.data.user?.id, role_id: role_id });
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
        // this.loadEntry();
      }
    )
    .subscribe();

    this.entriesSubscribed = true;
  }

  // categories

  // roles

  async getRole(role_id: string): Promise<Role | null> {
    const query = await this.supabase.from(ROLES).select('*').eq('id', role_id).single();
    if (query.data) return query.data;
    else return null;
  }
  
}
