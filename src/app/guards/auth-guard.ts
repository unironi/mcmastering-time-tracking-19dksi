import { CanMatchFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = (route, segments) => {
  return true;
};

export const adminGuard: CanMatchFn = async (route, segments) => {
  const supabaseService = inject(SupabaseService);
  const user = await supabaseService.getUser();
  const member_info = await supabaseService.getMemberInfo(user?.id ?? "");
  return member_info.is_admin;
};
