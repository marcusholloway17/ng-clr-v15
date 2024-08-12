import { HttpClient } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { as, useQuery } from '@azlabsjs/ngx-query';
import { QueryState } from '@azlabsjs/rx-query';
import { Observable, catchError, filter, map, of } from 'rxjs';

/**
 * Creates an HTTP value query that return the value matchin the provided param
 */
export function createHTTPValueQuery(
  client: HttpClient,
  url: string,
  select: string,
  param?: string
) {
  const _url = param
    ? `${
        url.endsWith('/') ? url.substring(0, url.length - 1) : url
      }/${param}?_columns[]=${select}&_hidden[]=id`
    : `${url}?_columns[]=${select}&_hidden[]=id`;

  const response$ = as<Observable<QueryState>>(
    useQuery(
      () => {
        return client
          .request('GET', _url, {
            responseType: 'json',
          })
          .pipe(
            catchError(() => of({ [select]: '' })),
            map((response: any) => response[select])
          );
      },
      {
        name: _url,
        cacheTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
        cacheQuery: true,
      }
    )
  ).pipe(
    filter(
      (value: QueryState) =>
        typeof value.response != 'undefined' && value.response != null
    ),
    map((value) => value.response)
  );
  return response$;
}

@Injectable()
@Pipe({
  name: 'httpValue',
  pure: true,
  standalone: true,
})
export class HTTPValuePipe implements PipeTransform {
  // Class constructor
  constructor(private http: HttpClient) {}

  // Provides an aggregation query observable instance
  transform(param: string, url: string, select: string) {
    return createHTTPValueQuery(this.http, url, select, param);
  }
}
