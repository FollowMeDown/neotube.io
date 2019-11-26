import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';

import {
    AddressesComponent,
    BlocksComponent,
    TransactionsComponent,
    AssetsComponent,
    NotfoundComponent,
    HomeComponent,
    AddressInfoComponent,
    BlockInfoComponent,
    AssetInfoComponent,
    TransactionInfoComponent,
    NotsearchComponent
} from './pages';

const PAGECOMPONENTS = [
    AddressesComponent,
    BlocksComponent,
    TransactionsComponent,
    AssetsComponent,
    NotfoundComponent,
    HomeComponent,
    AddressInfoComponent,
    BlockInfoComponent,
    AssetInfoComponent,
    TransactionInfoComponent,
    NotsearchComponent
];

@NgModule({
    declarations: [AppComponent, ...PAGECOMPONENTS],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, CoreModule, SharedModule],
    bootstrap: [AppComponent]
})
export class AppModule {}
