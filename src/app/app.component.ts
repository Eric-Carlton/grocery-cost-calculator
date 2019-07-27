import { Component } from '@angular/core';
import { LogInterceptorService } from './services/log-interceptor/log-interceptor.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(logInterceptorService: LogInterceptorService) {
    if (environment.interceptLogs) {
      logInterceptorService.interceptLogs();
    }
  }
}
