import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PollService {

  private _api = 'http://localhost:3000'

  constructor(private _http: HttpClient) { }


  createPoll(polldetails: any) {

    console.log("Poll details are ", polldetails)
    return this._http.post(`${this._api}/createpoll`, polldetails)
  }

  getAllavailablepolls(page: number, limit: number) {
    return this._http.get(`${this._api}/allpolls?page=${page}&limit=${limit}`)
  }

  getUserPolls() {
    return this._http.get(`${this._api}/userpolls`)
  }

  deletePoll(pollid: string) {
    return this._http.delete(`${this._api}/deletepoll/:${pollid}`)
  }
}
