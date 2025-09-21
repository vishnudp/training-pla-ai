import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private static sessionExpiredCount = 0;
  private static lastSessionExpiredTime = 0;
  private readonly MAX_SESSION_EXPIRED_ALERTS = 1;
  private readonly SESSION_EXPIRED_COOLDOWN = 30000; // 30 seconds

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.shouldHandleUnauthorized(req)) {
          console.log('Session expired - 401 Unauthorized detected for URL:', req.url);
          this.handleSessionExpired();
        }
        
        return throwError(error);
      })
    );
  }

  private shouldHandleUnauthorized(req: HttpRequest<any>): boolean {
    const currentTime = Date.now();
    
    // Prevent multiple session expired alerts
    if (AuthInterceptor.sessionExpiredCount >= this.MAX_SESSION_EXPIRED_ALERTS) {
      if (currentTime - AuthInterceptor.lastSessionExpiredTime < this.SESSION_EXPIRED_COOLDOWN) {
        console.log('Session expired alert already shown recently, ignoring 401');
        return false;
      } else {
        // Reset after cooldown period
        AuthInterceptor.sessionExpiredCount = 0;
      }
    }
    
    // Don't handle for certain URLs (like config files, assets, etc.)
    const ignoreUrls = [
      '/assets/',
      '/configuration',
      'configurations.json',
      '.json',
      '/static/',
      '/favicon',
      'angular'
    ];
    
    for (const ignoreUrl of ignoreUrls) {
      if (req.url.includes(ignoreUrl)) {
        console.log(`Ignoring 401 for URL: ${req.url}`);
        return false;
      }
    }
    
    return true;
  }

  private handleSessionExpired(): void {
    const currentTime = Date.now();
    
    // Increment counter and update timestamp
    AuthInterceptor.sessionExpiredCount++;
    AuthInterceptor.lastSessionExpiredTime = currentTime;
    
    console.log('Handling session expiry... Count:', AuthInterceptor.sessionExpiredCount);
    
    try {
      // Clear stored authentication data immediately and thoroughly
      localStorage.removeItem('loginData');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('cbpPlanFinalObj');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      sessionStorage.clear();
      
      // Get MatSnackBar service using injector to avoid circular dependency
      const snackBar = this.injector.get(MatSnackBar);
      
      // Show user-friendly message with action button
      const snackBarRef = snackBar.open(
        'Session expired. Please refresh the page to login again.', 
        'Refresh Page', 
        {
          duration: 10000, // Longer duration with action button
          panelClass: ['session-expired-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        }
      );
      
      let userActed = false;
      
      // Handle the refresh action
      snackBarRef.onAction().subscribe(() => {
        console.log('User clicked refresh, reloading page');
        userActed = true;
        this.performLogoutRefresh();
      });
      
      // Handle when snackbar is dismissed
      snackBarRef.afterDismissed().subscribe(() => {
        if (!userActed) {
          console.log('Snackbar dismissed, auto-refreshing page');
          this.performLogoutRefresh();
        }
      });
      
      // Auto-refresh after 10 seconds as fallback
      setTimeout(() => {
        if (!userActed) {
          console.log('Timeout reached, auto-refreshing page after session expiry');
          snackBarRef.dismiss();
          this.performLogoutRefresh();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error in handleSessionExpired:', error);
      // Ultimate fallback - reload the page immediately
      this.performLogoutRefresh();
    }
  }

  private performLogoutRefresh(): void {
    console.log('Performing logout refresh...');
    
    // Clear all authentication data again to be absolutely sure
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cached data that might affect login state
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Force reload to ensure fresh state
    // Adding a timestamp to prevent cached page loads
    const timestamp = new Date().getTime();
    window.location.href = window.location.origin + window.location.pathname + '?logout=' + timestamp + window.location.hash;
  }
}