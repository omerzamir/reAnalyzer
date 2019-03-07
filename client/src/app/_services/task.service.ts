import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { config } from '../../config';
import { environment } from '../../environments/environment';
import { FilterService } from './filter.service';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  serviceName: string = 'task';

  constructor(
    private http: HttpClient,
    private filterService: FilterService,
    private logsService: LogsService
  ) {}

  getTaskCountByStatus(): Observable<any> {
    return this.http
      .get(
        `${environment.apiUrl}/task/countByStatus`,
        this.filterService.config
      )
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from TaskCountByStatus'
          )
        ),
        catchError(
          this.logsService.handleError(
            this.serviceName,
            'getTaskCountByStatus',
            []
          )
        )
      );
  }

  getFieldCountPerInterval(interval): Observable<any> {
    const getObservableForInterval = field => {
      let newConfig = this.filterService.config;
      newConfig.params['field'] = field; //'due';
      newConfig.params['interval'] = interval;
      return this.http
        .get(`${environment.apiUrl}/task/fieldCountPerInterval`, newConfig)
        .pipe(
          tap(data => {
            this.logsService.log(
              this.serviceName,
              'fetched data from getFieldCountPerInterval'
            );
          }),
          catchError(
            this.logsService.handleError(
              this.serviceName,
              'getFieldCountPerInterval',
              []
            )
          )
        );
    };
    return forkJoin([
      getObservableForInterval('due'),
      getObservableForInterval('created'),
    ]);
  }

  getTagClouds(): Observable<any> {
    let newConfig = { ...this.filterService.config };
    newConfig.params['size'] = '40';
    return this.http.get(`${environment.apiUrl}/task/tagCloud`, newConfig).pipe(
      tap(data =>
        this.logsService.log(this.serviceName, 'fetched data from TagClouds')
      ),
      catchError(
        this.logsService.handleError(this.serviceName, 'getTagClouds', [])
      )
    );
  }

  getLeaderboard(): Observable<any> {
    let newConfig = { ...this.filterService.config };
    newConfig.params['size'] = '5';
    return this.http
      .get(`${environment.apiUrl}/task/leaderboard`, newConfig)
      .pipe(
        tap(data =>
          this.logsService.log(
            this.serviceName,
            'fetched data from Leaderboard'
          )
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getLeaderboard', [])
        )
      );
  }

  getTimeRates(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/task/endTimeRatio`, this.filterService.config)
      .pipe(
        tap(data =>
          this.logsService.log(this.serviceName, 'fetched data from TimeRates')
        ),
        catchError(
          this.logsService.handleError(this.serviceName, 'getTimeRates', [])
        )
      );
  }

  getTasksByFilter(filter: object) {
    let newFilter = { ...this.filterService.config, ...filter };
    console.log(newFilter);
  }
}
