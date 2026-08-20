import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from "@supabase/supabase-js";
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
  admin_only: boolean,
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
const PROFILES = 'profiles';

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
  private _members = new BehaviorSubject<any[]>([]);
  // private _userEntries = new BehaviorSubject<any[]>([]);

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

  async signUp(credentials: { email: any, password: any, full_name: any }) {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name
          }
        }
      }); 
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

  // Getters (post loading)

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

  get members() {
    return this._members.asObservable();
  }

  // get userEntries() {
  //   return this._userEntries.asObservable();
  // }

  // Loaders

  async getUser() {
    const user = await this.supabase.auth.getUser();

    if (user.error) {
      console.log(user.error);
      return null;
    }

    return user.data.user;
  }

  async loadCategories() {
    const {data, error} = await this.supabase.from(CATEGORIES).select('*');
    if (error) {
      console.log("error ", error)
    }
    if(data) this._categories.next(data);
  }

  async loadRoles(cat_id: string) {
    const {data, error} = await this.supabase.from(ROLES).select('*').eq('category_id', cat_id);
    if (error) {
      console.log("error ", error)
    }
    if(data) this._roles.next(data);
  }

  async loadMembers() {
    const {data, error} = await this.supabase.from(GROUP_MEMBERS).select('*');
    
    if (error) {
      console.log(error);
      return;
    }

    this._members.next(data);
  }

  async loadEntry(role_id: string) {
    const entry = await this.getEntry(role_id);
    this._entry.next(entry);
    return entry;
  }

  async loadUserEntries(user_id: string) {
    const {data, error} = await this.supabase.from(ENTRIES).select('*').match({ user_id });
    if (error) {
      console.log("error ", error)
    }
    // if (data) this._userEntries.next(data);
    return data;
  }

  // getter (pre-loading)
  async getEntry(role_id: string): Promise<Entry | null> {
    const user = await this.getUser();

    const {data, error} = await this.supabase.from(ENTRIES).select('*').match({ user_id: user?.id, role_id }).maybeSingle();
    
    if (error) {
      console.log(error);
      return null;
    }
    
    return data;
  }

  async getRole(role_id: string): Promise<Role | null> {
    const {data, error} = await this.supabase.from(ROLES).select('*').eq('id', role_id).single();

    if (error) {
      console.log(error);
      return null;
    }

    return data;
  }

  async getMemberInfo(user_id: string) {
    const {data, error} = await this.supabase.from(GROUP_MEMBERS).select().match({user_id}).single();
    
    if (error) {
      console.log(error);
      return null;
    }

    return data;
  }

  // CRUD functions

  // entries
  async addEntry(role_id: string, hours: number, notes: string) {
    const user = await this.getUser();
    
    const user_id = user?.id;

    const user_in_group = await this.supabase.from(GROUP_MEMBERS).select("*").match({ user_id }).single();

    if (user_in_group.error) {
      console.log(user_in_group.error);
      return;
    }

    const group_id = user_in_group.data.group_id;

    const newEntry = {
      user_id,
      role_id,
      group_id,
      hours,
      notes
    }

    await this.supabase.from(ENTRIES).insert(newEntry);
  }

  async removeEntry(role_id: any) {
    const user = await this.getUser();
    await this.supabase.from(ENTRIES).delete().match({ user_id: user?.id, role_id });
  }

  async updateEntry(role_id: any, hours: number, notes: string) {
    const user = await this.getUser();
    await this.supabase.from(ENTRIES).update({ hours, notes }).match({ user_id: user?.id, role_id });
  }

  // members

  async inviteUser(email: string) {
    // making sure invitee is admin of group
    const user = await this.getUser();

    const admin_id = user?.id;
    const admin_in_group = await this.supabase.from(GROUP_MEMBERS).select('*').match({ user_id: admin_id }).single();
    
    if (admin_in_group.data.is_admin) {
      const add_user = await this.supabase.from(PROFILES).select('*').match({ email }).single();

      if (add_user.error) {
        console.log(add_user.error);
        throw new Error("User does not exist");
      }
      
      const new_member = {
        user_id: add_user.data?.id,
        group_id: admin_in_group.data.group_id,
        is_admin: false,
        full_name: add_user.data?.full_name,
      }
      await this.supabase.from(GROUP_MEMBERS).insert(new_member);
    } else {
      console.log("user is not admin");
    }
    
    return;
  }

  async removeMember(user_id: string) {
    // making sure user who is removing group member is admin of group
    const user = await this.getUser();

    const admin_id = user?.id;
    const admin_in_group = await this.supabase.from(GROUP_MEMBERS).select('*').match({user_id: admin_id}).single();
    
    if (admin_in_group.data.is_admin) {
      const { data, error } = await this.supabase.from(GROUP_MEMBERS).delete().match({user_id});

      if (error) {
        console.log(error);
        return;
      }

      console.log(data);
      return data;
    }
    console.log("user is not admin");
    return;
  }

  // handler
  
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

  // download entries

  async downloadEntries(user_id: string = '') {
    const { data, error } = user_id
      ? await this.supabase.from(ENTRIES).select().match({ user_id }).csv()
      : await this.supabase.from(ENTRIES).select().csv();

    if (error) {
      console.log(error);
      return;
    }
    return data;
  }
  
}
