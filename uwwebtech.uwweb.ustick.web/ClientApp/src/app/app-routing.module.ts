import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WallComponent } from './features/wall/wall.component';
import { CreateTestComponent } from './features/create-test/create-test.component';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'wall' },
  { path: 'wall', component: WallComponent },
  { path: 'create-test', component: CreateTestComponent },
  { path: 'wall-of-fame', redirectTo: 'wall' },
  { path: 'performance', component: ComingSoonComponent },
  { path: '**', redirectTo: 'wall' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
