import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PaginatorComponent } from './compontent/paginator/paginator.component';
import { LoadingComponent } from './compontent/loading/loading.component';

import { TranslatePipe } from './pipes/translate.pipe';
import { TransTypePipe } from './pipes/trans-type.pipe';
import { UnixTimePipe } from './pipes/unixtime.pipe';
import { UnlimitedNumberPipe } from './pipes/unlimited-number.pipe';

import { AssetColorDirective } from './directive/asset-color.directive';
import { TransBorderColorDirective } from './directive/trans-border-color.directive';
import { TransColorDirective } from './directive/trans-color.directive';

const COMPONENTS = [PaginatorComponent, LoadingComponent];
const PIPES = [TranslatePipe, TransTypePipe, UnixTimePipe, UnlimitedNumberPipe];
const DIRECTIVES = [AssetColorDirective, TransColorDirective, TransBorderColorDirective];

@NgModule({
    declarations: [...PIPES, ...COMPONENTS, ...DIRECTIVES],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, ReactiveFormsModule, ...PIPES, ...COMPONENTS, ...DIRECTIVES]
})
export class SharedModule {}
