import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { HammerModule } from "@angular/platform-browser";

import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import * as Hammer from "hammerjs";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { AngularFireStorageModule, BUCKET } from "@angular/fire/storage";

export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: "pan-y",
    });

    return mc;
  }
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, MainNavComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, "kerr-recipe"),
    AngularFireDatabaseModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    DragDropModule,
    BrowserAnimationsModule,
    HammerModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      registrationStrategy: "registerImmediately",
    }),
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
