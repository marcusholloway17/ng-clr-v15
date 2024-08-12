import { Injector, LOCALE_ID, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHeaderActions } from './modules/components/header-actions';
import { provideHeaderLinks } from './modules/components/header-links';
import {
  provideRouterChanges,
  provideRouterNavigate,
} from './modules/components/router';
import { provideDataViewConfigsForLink } from './modules/components/data-view';
import { LINKS } from './routes';
import {
  headerLinks,
  provideCommonStrings,
  provideLoginStrings,
} from './modules/helpers';
import { headerActions } from './actions';
import {
  AUTH_SERVICE,
  AuthStrategies,
  COMMON_STRINGS,
  LoginModule,
  // provideRedirectUrl,
} from './modules/login';
import { environment } from 'src/environments/environment.development';
import { SharedModule } from './shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QueryModule } from '@azlabsjs/ngx-query';
import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from '@ngx-translate/core';
import { HTTPRequest } from '@azlabsjs/requests';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogModule } from './modules/components/dialog';
import { DOCUMENT_SESSION_STORAGE, StorageModule } from '@azlabsjs/ngx-storage';
import { NgxCommonModule } from '@azlabsjs/ngx-common';
import { CachePipe } from '@azlabsjs/ngx-azl-cache';
import { HTTPValuePipe } from './modules/pipes';
import { YesNoPipe } from './modules/pipes/yes_no.pipe';
import { firstValueFrom, map } from 'rxjs';
import {
  UI_STATE_CONTROLLER,
  UIStateModule,
} from './modules/components/ui-action';
import { useLocalStrategy } from './modules/login/core';
import { DatagridModule } from './modules/components/datagrid';
import {
  NgxSmartFormModule,
  useBearerTokenInterceptor,
} from '@azlabsjs/ngx-smart-form';
import { DataComponentModule } from './modules/components/data';
import {
  NgxClrFormControlModule,
  useOptionsInterceptor,
} from '@azlabsjs/ngx-clr-form-control';
registerLocaleData(localeFr, 'fr');

// Add cog and angle icons
// Uncomment code below to enable clarity cog and angle icon for logout component
// ClarityIcons.addIcons(cogIcon, angleIcon);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,

    // Http CLient Import for HTTP client request
    HttpClientModule,

    // Query Module
    QueryModule.forRoot({
      httpClient: HttpClient as Type<any>,
    }),

    // Translate Module imports
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    // Register a dialog module
    // Provide a diable implementation that will replace default window dialog
    DialogModule.forRoot(),

    // Register the storage module
    StorageModule.forRoot({
      prefix: 'app.name', // TODO: Change this to application name
      secret: environment.storage.secret,
    }),

    NgxCommonModule.forRoot({
      // Add pipe transformation routes
      pipeTransformMap: {
        azlcache: CachePipe,
        translate: TranslatePipe,
        yN: YesNoPipe,
        httpValue: HTTPValuePipe,
      },
    }),

    // Provides services, guards and interceptors for the login module
    LoginModule.forRoot({
      handleActions: (injector: Injector) => {
        return {
          success: async () => {
            const message = await firstValueFrom(
              injector
                .get(COMMON_STRINGS)
                .pipe(map((state) => state.successful))
            );

            injector.get(UI_STATE_CONTROLLER).endAction(message, 'success');
          },
          failure: async () => {
            const message = await firstValueFrom(
              injector
                .get(COMMON_STRINGS)
                .pipe(map((state) => state.authenticationFailed))
            );

            injector.get(UI_STATE_CONTROLLER).endAction(message, 'bad-request');
          },
          error: async (err: unknown) => {
            injector
              .get(UI_STATE_CONTROLLER)
              .endAction('Request Error!', 'request-error');
          },
          performingAction: () => {},
        };
      },
      authConfigProvider: (injector: Injector) => {
        return {
          strategies: [
            {
              id: AuthStrategies.LOCAL,
              strategy: useLocalStrategy({
                client: injector.get(HttpClient),
                host: environment.auth.local.host,
                storage: injector.get(DOCUMENT_SESSION_STORAGE),
                endpoints: {
                  users: 'api/v2/user',
                  signIn: 'api/v2/login',
                  signOut: 'api/v2/logout',
                },
                // driver: 'legacy',
                // TODO: Provide auth result callback if required
                // authResultCallback: (
                //   result: Partial<SignInResultInterface>
                // ) => {
                //   // TODO: Provide a sign in state interceptor implementation
                //   // The interceptor must return true for the sign in to continue
                //   return true;
                // },
              }),
            },
          ],
          autoLogin: true,
        };
      },
      authClientConfigProvider: () => ({ ...environment.auth.local.clients }),
      strings: provideLoginStrings,
    }),

    // Datagrid configuration
    DatagridModule.forRoot({
      pagination: { page: 'page', perPage: 'per_page' },
      pageSize: 15,
      pageSizeOptions: [15, 50, 100],
      sort: {
        asQuery: false,
        by: 'by',
        order: 'order',
        ascending: 'asc',
        descending: 'desc',
      },
    }),

    // Smart form
    NgxSmartFormModule.forRoot({
      submitRequest: {
        interceptorFactory: useBearerTokenInterceptor(
          async (injector) =>
            await firstValueFrom(
              injector
                .get(AUTH_SERVICE)
                .signInState$.pipe(map((state) => state?.authToken ?? ''))
            )
        ),
      },
      serverConfigs: {
        api: {},
      },
      // Path to the form assets
      // This path will be used the http handler to load the forms in cache
      formsAssets: '/assets/resources/forms.json',
    }),

    // Smart form control
    NgxClrFormControlModule.forRoot({
      options: {
        url: environment.forms.host, // Case using table:table_name configuration option, this configuration is required for sending queries to the server
        requests: {
          interceptorFactory: useOptionsInterceptor(
            async (request, injector) => {
              const _token = await firstValueFrom(
                injector
                  .get(AUTH_SERVICE)
                  .signInState$.pipe(map((state) => state?.authToken ?? ''))
              );
              return request.clone({
                setHeaders: { Authorization: `Bearer ${_token}` },
              });
            }
          ),
          // queries: {
          //   // .. queries configurations per control names
          // },
        },
      },
      uploads: {
        options: {
          interceptorFactory: (injector: Injector) => {
            // Replace the interceptor function by using the injector
            return (request: HTTPRequest, next) => {
              const body: any = request.body;
              // Add volume information to upload body if present in environment
              if (body && environment.storage.volume.id) {
                body['volume'] = environment.storage.volume.id;
              }

              // TODO: Uncomment the code below to enable upload
              // Add parent directory id to upload body if provided in environment vairables
              // const parentId = environment.api.helpers.storage.directory.id;
              // if (body && parentId) {
              //   body['parent'] = environment.api.helpers.storage.volume.id;
              // }

              // TODO: Provide request interceptors
              request = request.clone({
                options: {
                  ...request.options,
                  headers: {
                    ...request.options.headers,
                    'x-client-id': environment.storage.client_id,
                    'x-client-secret': environment.storage.client_secret,
                  },
                },
                body,
              });
              return next(request);
            };
          },
        },
        url: environment.storage.host + environment.storage.paths.updload,
      },
    }),

    // UI state
    UIStateModule.forRoot(),

    // Internationalization
    DataComponentModule.forRoot(provideCommonStrings),
  ],
  providers: [
    // Provide router strategy for the application using links configuration
    provideDataViewConfigsForLink(LINKS),
    provideRouterNavigate(),
    provideRouterChanges(),
    // Provides router strategies for the application using links configuration

    // Add header links to the UI
    provideHeaderLinks(headerLinks(LINKS, false)),

    // Add header actions to the UI
    provideHeaderActions(headerActions([])),
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },

    // Provide redirect url path
    // provideRedirectUrl(environment.auth.redirect.url),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
