import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ServerResponse } from '../interfaces/serverResponseInterface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private apiUrl: string = environment.apiUrl;

  private containerSource = new BehaviorSubject({});
  public containerObservableSubject = this.containerSource.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  checkContainerInfo(containerCode: string) {
    const options = { params: new HttpParams().append('numer', containerCode.toLowerCase() ) };
    this.http.get<ServerResponse>(`${this.apiUrl}`, options).subscribe(
      (response: ServerResponse) => {
        console.log('Server sent response data:', response);
        this.containerSource.next(Object.assign(response));
      },
      (error) => console.error(error)
    );

  }
}
