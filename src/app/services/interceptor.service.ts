import { TokenstoreService } from './tokenstore.service';
import { HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RequestHeaderService implements HttpInterceptor {
    constructor(private tokenService: TokenstoreService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const urlSegments = this.parseUrl(req.url);
        let newRequest = req;

        if (urlSegments[0] === 'auth' && urlSegments[1] === 'validate') {
            console.log(1, req.url)
            newRequest = req.clone({
                headers: this.newHeader()
            });
        } else if (urlSegments[0] !== 'auth' && urlSegments[0] !== 'admin') {
            console.log(2, req.url)
            newRequest = req.clone({
                headers: this.newHeader()
            });
        }
        return next.handle(newRequest);
    }

    newHeader(): HttpHeaders {
        const token = this.tokenService.token;
        return new HttpHeaders({
            'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
        });
    }

    parseUrl(url: string): Array<string> {
        const routePaths = url.split('/').slice(3);
        const endpoint = routePaths.pop().split('?');
        routePaths.push(endpoint[0]);
        return routePaths;
    }

    // get authHeader(): HttpHeaders {
    //     if (!this.header) {
    //         const token = this.tokenService.token;
    //         console.log(token);
    //         this.header = new HttpHeaders({
    //             'authorization': `bearer ${token.access_token},bearer ${token.id_token}`
    //         });
    //     }
    //     return this.header;
    // }
}