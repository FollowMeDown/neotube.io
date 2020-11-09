import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
    apiDo = environment.apiDomain;
    net = 'mainnet';
    mainOrigin = 'https://neotube.io';
    testOrigin = 'https://testnet.neotube.io';

    lineTShirtAssetId1 = 'e7f98fb01ae20e49bbcb68149af65d68c28786cd';
    lineTShirtAssetId2 = '4487328b1e1ae8f73c7dab0595caf35118c2911a';

    constructor(private http: HttpClient) {
        if (location.origin.indexOf('testnet') > 0) {
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

    public GetAssetByAddress(address: string): Observable<any> {
        return this.http.post(`${this.apiDo}/api/address`, { method: 'getallassets', params: [address] });
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
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'gettxbytxid', params: [txid] }).pipe(
            map((res: any) => {
                if (res.code === 200 && res.result && res.result.nft_txs) {
                    res.result.nft_txs[0].image = this.holderNftImage(res.result.nft_txs[0]);
                }
                return res;
            })
        );
    }

    public GetScripts(txid): Observable<any> {
        return this.http.post(`${this.apiDo}/api/transactions`, { method: 'getscripts', params: [txid] });
    }

    // NFT
    public GetNfts(): Observable<any> {
        return this.http.get(`${this.apiDo}/api/nft`).pipe(
            map((res: any) => {
                if (res.code === 200 && res.result) {
                    res.result = this.holderNft(res.result);
                }
                return res;
            })
        );
    }

    public GetNftTxByAssetId(pageIndex, pageSize, assetId: string): Observable<any> {
        return this.http.post(`${this.apiDo}/api/nft/transactions`, {
            method: 'gettxbyassetid',
            params: [pageIndex, pageSize, assetId]
        });
    }

    public GetNftTxByTxId(txId: string): Observable<any> {
        return this.http.post(`${this.apiDo}/api/nft/transactions`, { method: 'getnfttxbytxid', params: [txId] }).pipe(
            map((res: any) => {
                if (res.code === 200 && res.result && res.result.nft_txs) {
                    res.result.nft_txs[0].image = this.holderNftImage(res.result.nft_txs[0]);
                }
                return res;
            })
        );
    }

    public GetNftRankByAssetID(pageIndex, pageSize, assetId): Observable<any> {
        return this.http.post(`${this.apiDo}/api/nft/address`, { method: 'getrankbyassetid', params: [pageIndex, pageSize, assetId] });
    }

    holderNft(nft: any) {
        return nft.map(item => {
            if (item.assetId === this.lineTShirtAssetId1) {
                item.image = `/assets/images/nft/${this.lineTShirtAssetId1}.png`;
            } else if (item.assetId === this.lineTShirtAssetId2) {
                item.image = `/assets/images/nft/${this.lineTShirtAssetId2}.png`;
            }
            return item;
        });
    }

    holderNftImage(nft: any) {
        let image = '';
        if (nft.assetId === this.lineTShirtAssetId1) {
            image = `/assets/images/nft/${this.lineTShirtAssetId1}.png`;
        } else if (nft.assetId === this.lineTShirtAssetId2) {
            image = `/assets/images/nft/${this.lineTShirtAssetId2}.png`;
        }
        return image;
    }
}
