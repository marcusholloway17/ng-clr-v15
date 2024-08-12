import { Injector } from '@angular/core';
import { HeaderAction } from './modules/components/header-actions';
import { lastValueFrom, map, of, withLatestFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AUTH_SERVICE, AuthServiceInterface } from './modules/login';
import { DIALOG, Dialog } from './modules/components/dialog';
import { Router } from '@angular/router';

/**
 * Handles logout action
 */
async function logout(
  prompt: string,
  _auth: AuthServiceInterface,
  _dialog: Dialog | null,
  _router: Router | null
) {
  let result = true;
  if (prompt && _dialog) {
    result = await _dialog.confirm(prompt);
  }
  // Case user did not confirm the delete action we drop from the execution context
  if (!result) {
    return;
  }

  // Logout application user
  if (_auth) {
    await lastValueFrom(_auth.signOut(true));
    return _router?.navigateByUrl('/');
  }

  // Log error to the console for no provided handler
  return console.error('No auth service provided handler provided.');
}

/**
 * Provides a default action array with support for logout if users is already logged in
 */
export function headerActions(actions: HeaderAction[] = []) {
  return (injector: Injector | null) => {
    if (injector) {
      const _translate = injector.get(TranslateService);
      const _auth = injector.get(AUTH_SERVICE);
      const _signedIn$ = _auth
        ? _auth.signInState$.pipe(
            map((state) => (state?.authToken ? true : false))
          )
        : of(false);

      // Case the translation service is present in the injector, we use it to translate action labels
      if (_translate) {
        return _translate
          .get([
            'app.prompt.logout',
            'app.actions.logout',
            ...actions.map((action) => action.label),
          ])
          .pipe(
            withLatestFrom(_signedIn$),
            map(([values, signedIn]) => {
              const _actions: HeaderAction[] = [];
              // We add users provided actions
              for (const action of actions) {
                _actions.push({
                  ...action,
                  label: values[action.label] ?? action.label,
                });
              }

              // Then we add logout action handler if users is signed in
              // TODO : Comment the code below to remove the signout button
              if (signedIn) {
                _actions.push({
                  label: values['app.actions.logout'] ?? 'Logout',
                  fn: (injector: Injector | null) => {
                    if (injector) {
                      const prompt =
                        values['app.prompt.logout'] ??
                        'You are about to logout from the application, please confirm to continue...';
                      const _dialog = injector.get(DIALOG);
                      const _router = injector.get(Router);
                      return logout(prompt, _auth, _dialog, _router);
                    }

                    throw new Error(
                      'No injector found in the logout handler context'
                    );
                  },
                });
              }

              // Returns the constructed list of actions
              return _actions;
            })
          );
      }
    }

    return of(actions);
  };
}
