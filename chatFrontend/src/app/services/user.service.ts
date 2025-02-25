import { Injectable } from '@angular/core';
import { IloginData, IUser } from '../interfaces/user.interfaces';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  private socket!: Socket;

  private _api = 'http://localhost:3000'
  constructor(private _http: HttpClient) { }


  registerUser(userData: IUser) {
    console.log("userdata @ services", userData)
    return this._http.post(`${this._api}/register`, userData)
  }


  loginUser(loginData: IloginData) {
    return this._http.post(`${this._api}/login`, { loginData })
  }


  getCurrentUserProfile() {
    return this._http.get(`${this._api}/userdetails`)
  }

  selectUserdetails(userid: string) {
    return this._http.get(`${this._api}/selectuserdetails/:${userid}`)
  }


  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  getCurrentSearchTerm() {
    return this.searchTermSubject.value;
  }

  searchAllUsers(term: string) {
    return this._http.get(`${this._api}/search?query=${term}`)
  }

  allUsers() {
    return this._http.get(`${this._api}/all`)
  }

  joinChat(userId: any) {
    this.socket.emit("join", userId);
  }


  getChatHistory(userId1: any, userId2: any) {
    return this._http.get(`${this._api}/messages/${userId1}/${userId2}`);
  }


  saveProfileImageToDB(s3Url: string) {
    return this._http.put(`${this._api}/upateImage`, { s3Url })
  }


  updateUsername(name: string) {
    return this._http.put(`${this._api}/updatename`, { name })
  }


  changestatus(userId: any) {
    return this._http.put(`${this._api}/updatestatus`, userId)
  }

}
