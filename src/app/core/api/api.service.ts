import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    apiDo = environment.apiDomain;
    net = 'mainnet';
    mainOrigin = 'https://neotube.io';
    testOrigin = 'https://testnet.neotube.io';

    constructor(private http: HttpClient) {
        if (location.origin === this.testOrigin) {
            this.net = 'testnet';
            this.apiDo = environment.apiDotest;
        }
    }

    public CheckCondition(hash): Observable<any> {
        return this.http.post(`${this.apiDo}/api/index`, { method: 'checkcondition', params: [hash] });
    }

    // address
    public GetAddresses(pageIndex, pageSize): Observable<any> {
        return this.http.post(`${this.apiDo}/api/address`, { method: 'getaddresses', params: [pageIndex, pageSize] });
    }

    public GetPageTXByAddress(pageIndex, pageSize, address): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'getpagetxbyaddress', params: [pageIndex, pageSize, address] });
    }

    public GetAddrAssets(address): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'getaddrassets', params: [address] });
    }

    public GetAssetsHistorybyAddress(address, option): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'history', params: [address, option] });
    }

    // asset
    public GetAllAssets(pageIndex, pageSize): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'getallassets', params: [pageIndex, pageSize] });
    }

    public GetAssetInfo(assetId): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'getassetinfo', params: [assetId] });
    }

    public GetNep5Info(assetId): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'getnep5info', params: [assetId] });
    }

    public GetAddrByAssetID(pageIndex, pageSize, assetId): Observable<any> {
        return this.http.post(`${this.apiDo}/api/address`, { method: 'getaddrbyassetid', params: [pageIndex, pageSize, assetId] });
    }

    public GetRankByAssetID(pageIndex, pageSize, assetId): Observable<any> {
        return this.http.post(`${this.apiDo}/api/address`, { method: 'getrankbyassetid', params: [pageIndex, pageSize, assetId] });
    }

    public GetNep5RegisterInfo(id): Observable<any> {
        return this.http.post(`${this.apiDo}/api/asset`, { method: 'getnep5registerinfo', params: [id] });
    }

    // block
    public GetBlocks(pageIndex, pageSize): Observable<any> {
        return this.http.post(`${this.apiDo}/api/block`, { method: 'getblocks', params: [pageIndex, pageSize] });
    }

    public GetAllCounts(): Observable<any> {
        return this.http.post(`${this.apiDo}/api/index`, { method: 'queryallcounts' });
    }

    public GetTXByHeight(pageIndex, pageSize, height): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'gettxbyheight', params: [pageIndex, pageSize, height] });
    }

    public GetBlockByHeight(height): Observable<any> {
        return this.http.post(`${this.apiDo}/api/block`, { method: 'getblockbyheight', params: [height] });
    }

    // transaction
    public GetTransferByTXID(txid): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'gettransferbytxid', params: [txid] });
    }

    public GetNep5TransferByTXID(txid): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'getnep5transferbytxid', params: [txid] });
    }

    public GetTransactions(pageIndex, pageSize, transType): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'gettransactions', params: [pageIndex, pageSize, transType] });
    }

    public GetTXByTXID(txid): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'gettxbytxid', params: [txid] });
    }

    public GetScripts(txid): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'getscripts', params: [txid] });
    }
}
