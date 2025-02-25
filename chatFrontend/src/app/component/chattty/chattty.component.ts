import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { io, Socket } from 'socket.io-client'
import Swal from 'sweetalert2';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Database, Picker } from 'emoji-picker-element';


interface User {
  id: any;
  name: string;
  avatar?: string;
  status?: boolean;
  lastMessage?: string;
  profileImage: string
  lastMessageTime?: string;
}

interface Message {
  id?: number;
  text: string;
  sent: boolean;
  time: string;
}

@Component({
  selector: 'app-chattty',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,],
  templateUrl: './chattty.component.html',
  styleUrl: './chattty.component.css'
})
export class ChatttyComponent implements OnInit, AfterViewChecked {

  private socket!: Socket;

  currentUser = {
    _id: 0,
    name: '',
    avatar: ''
  };



  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  defaultProfilePic: any = ''
  searchTerm: string = '';
  searchTermSubject = new Subject<string>()
  searchSubscription: Subscription = new Subscription()
  users: User[] = [];
  showProfileMenu = false;
  filteredUsers: User[] = [...this.users];
  selectedUser: any | null = null;
  messages: any[] = [];
  newMessage: string = '';


  constructor(private _userService: UserService, private _router: Router) {

    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    this._userService.getCurrentUserProfile().subscribe((res: any) => {
      console.log("user details", res)
      this.currentUser.name = res.data.name
      this.currentUser._id = res.data._id
      this.defaultProfilePic = res.data.profileImage
      this.joinChat(this.currentUser._id)

    })
  }




  ngOnInit(): void {

    this.searchTerm = this._userService.getCurrentSearchTerm()
    this.filteredUsers = [...this.users];
    this.allusers()

    this.socket.on("receiveMessage", (message: any) => {
      console.log("Incoming message", message)

      if (this.selectedUser && this.selectedUser._id === message.senderId) {
        console.log("meddage received")
        this.messages.push({
          id: this.messages.length + 1,
          text: message.text,
          sent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        })

        setTimeout(() => this.scrollToBottom(), 0);

      }
    })
  }


  ngAfterViewChecked(): void {
    this.scrollToBottom()
  }

  // Connect user
  joinChat(userId: any) {
    this.socket.emit("join", userId);
  }


  allusers() {
    this._userService.allUsers().subscribe((res: any) => {
      console.log("all user", res.data)
      this.users = res.data
      this.filteredUsers = [...this.users];

    })
  }


  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }



  onSearchTermChange(term: string) {
    this.searchTerm = term
    this._userService.updateSearchTerm(term)
    this.searchTermSubject.next(term)
    if (term.trim() === '') {
      this.filteredUsers = [...this.users];
    } else {


      this._userService.searchAllUsers(term).subscribe((res: any) => {
        console.log("search user", res.data)

        this.filteredUsers = res.data

      })

    }
  }

  selectedUserdetails(userid: string) {
    this._userService.selectUserdetails(userid).subscribe((res: any) => {
      console.log("selected userdetails", res)
    })
  }

  selectUser(user: any): void {

    this.selectedUser = user;
    this._userService.getChatHistory(this.currentUser._id, user._id).subscribe((messages: any) => {
      this.messages = messages.chats.map((message: any) => ({
        ...message,
        sent: message.senderId === this.currentUser._id,
        time: new Date(message.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format time

      }))
    })

    this.selectedUserdetails(user._id)
  }

  deselectUser(): void {
    this.selectedUser = null;
  }



  sendMessage(selecteduser: any): void {

    const receiver = selecteduser.name
    const receiverId = selecteduser._id
    console.log(`receiver: ${receiver} , receiverId: ${receiverId}`)

    const senderId = this.currentUser._id
    const senderName = this.currentUser.name
    console.log(`sender:${senderName} ,senderID: ${senderId}`)


    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message: Message = {
      text: this.newMessage,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.messages.push(message);


    const userIndex = this.users.findIndex(u => u.id === this.selectedUser!._id);
    if (userIndex !== -1) {
      this.users[userIndex].lastMessage = this.newMessage;
      this.users[userIndex].lastMessageTime = 'Just now';
    }


    const socketmessage = {
      senderId,
      receiverId,
      text: this.newMessage
    }

    console.log("socker msg", socketmessage)
    this.socket.emit("sendMessage", socketmessage)

    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  logout() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay logged in'
    }).then((result) => {

      if (result.isConfirmed) {

        let idd = this.currentUser._id
        this._userService.changestatus(idd).subscribe((res: any) => {
          console.log("haii")
          localStorage.removeItem('userToken')
          this._router.navigate(['/login']);
          Swal.fire(
            'Logged Out!',
            'You have successfully logged out.',
            'success'
          )

        })

      }
    })
  }





  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      setTimeout(() => {
        const clickHandler = (event: any) => {
          this.showProfileMenu = false;
          document.removeEventListener('click', clickHandler);
        };
        document.addEventListener('click', clickHandler);
      }, 0);
    }
  }

}
