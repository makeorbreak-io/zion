import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SessionDashPage } from '../pages/session-dash/session-dash';
import { BidPage } from '../pages/bid/bid';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ServerCommService } from '../services/serverComm/serverComm.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SessionDashPage,
    BidPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SessionDashPage,
    BidPage
  ],
  providers: [
    ServerCommService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
