import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from  '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  API_URL = environment.baseurl;
  constructor(private http: HttpClient) { }

  public get(url:any,headers:any){
    var headers = headers || {};
    return this.http.get(this.API_URL + url, {headers: headers});
  }

  public post(url:any,body:any,headers:any){
    var headers = headers || {};
    console.log('ur: ',body);
    return this.http.post(this.API_URL + url, body, {headers: headers});
  }

  public fileUpload(path:any,file:any): Observable<any>{
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options:any = { headers: headers, reportProgress: true, observe: 'events' };

    const formData = new FormData();
    formData.append('files',file);

    return this.http.post(`${this.API_URL}/api/files/uploads/${path}`,formData,options).pipe(
      catchError(this.errorMgmt)
    );
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
