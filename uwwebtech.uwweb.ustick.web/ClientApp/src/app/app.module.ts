import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './core/layout/layout.component';
import { WallComponent } from './features/wall/wall.component';
import { TopicCardComponent } from './features/wall/topic-card/topic-card.component';
import { RetestDialogComponent } from './features/wall/retest/retest-dialog.component';
import { StrategySettingsComponent } from './features/strategy/strategy-settings.component';
import { CreateTestComponent } from './features/create-test/create-test.component';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    WallComponent,
    TopicCardComponent,
    RetestDialogComponent,
    StrategySettingsComponent,
    CreateTestComponent,
    ComingSoonComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
