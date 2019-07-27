import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ServerLogLevels } from '../../enums/server-log-levels';
import { ClientLogLevels } from '../../enums/client-log-levels';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogInterceptorService {
  constructor(protected http: HttpClient) {}

  interceptLogs() {
    const _this = this;
    for (const key in window.console) {
      if (
        ClientLogLevels[key] != null &&
        ClientLogLevels[key] <=
          ClientLogLevels[environment.interceptLogs.maxLevel]
      ) {
        const oldMethod = console[key];
        window.console[key] = function() {
          _this.http
            .post(environment.logInterceptorEndpoint, {
              level: ServerLogLevels[ClientLogLevels[key]],
              arguments: [...arguments]
            })
            .subscribe();
          oldMethod(...arguments);
        };
      }
    }
  }
}
