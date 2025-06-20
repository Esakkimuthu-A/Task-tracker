import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const sharedService = inject(SharedService);

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    router.navigate(['/login']);
    return false;
  }

  const isLoggedIn = await sharedService.isAuthenticated();
  console.log(isLoggedIn);
  if (!isLoggedIn) {
    console.log('if')
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};
