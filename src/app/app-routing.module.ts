import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },

    { path: 'addresses/page/:page', component: AddressesComponent },
    { path: 'address/:address/page/:page', component: AddressInfoComponent },

    { path: 'assets/page/:page', component: AssetsComponent },
    { path: 'asset/:assetId/page/:page', component: AssetInfoComponent },
    { path: 'nep5/:assetId/page/:page', component: AssetInfoComponent },

    { path: 'blocks/page/:page', component: BlocksComponent },
    { path: 'block/:height/page/:page', component: BlockInfoComponent },

    { path: 'transactions/page/:page', component: TransactionsComponent },
    { path: 'transaction/:txid', component: TransactionInfoComponent },

    { path: 'notfound', component: NotfoundComponent },
    { path: 'notsearch/:id', component: NotsearchComponent },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
