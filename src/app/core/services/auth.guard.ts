import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    router.navigate(['/login']);
    return false;
  }
  const supabaseAuthKey = Object.keys(localStorage).find(
    key => key.startsWith('sb-') && key.endsWith('auth-token')
  );
  const authData = supabaseAuthKey ? JSON.parse(localStorage.getItem(supabaseAuthKey)!) : null;
  const isLoggedIn = authData && !!authData.access_token;
  if (!isLoggedIn) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};
