import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../common/header/header.component';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';

import { io, Socket } from "socket.io-client";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';


interface Poll {
  _id?: any
  question: string;
  options: any[];
  creatorId?: string
}

@Component({
  selector: 'app-poll-landing',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './poll-landing.component.html',
  styleUrl: './poll-landing.component.css'
})
export class PollLandingComponent implements OnInit {
  pollForm: FormGroup;
  polls: Poll[] = [];
  isCreateSectionVisible = false;
  userId!: string
  currentPage = 1;
  totalPages = 5;
  limit: number = 3
  pages: number[] = [];
  private socket!: Socket;

  constructor(private fb: FormBuilder, private _pollservice: PollService, private _router: Router, private _userservice: UserService) {
    this.pollForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        ['', Validators.required],
        ['', Validators.required]
      ])
    });


    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

  }

  ngOnInit() {
    this.availablepolls(this.currentPage)

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1)

    this.socket.emit("joinPolls")

    this.socket.on("pollsData", (polls: Poll[]) => {
      this.polls = polls
    })

    this.loaduserdetails()
    this.loadPolls();

    // Listen for real-time poll updates
    this.socket.on("pollUpdated", (updatedPoll: any) => {
      this.updatePollList(updatedPoll);
    });
  }

  toggleCreateSection() {
    this.isCreateSectionVisible = !this.isCreateSectionVisible;
  }


  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  changePage(page: number): void {
    console.log("hai from change page")
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.availablepolls(page)
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);

    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  loaduserdetails() {
    this._userservice.getCurrentUserProfile().subscribe((res: any) => {

      console.log("current user", res)
      console.log(res.data._id)
      this.userId = res.data._id
    })
  }

  onSubmit() {
    if (this.pollForm.valid) {
      const newPoll: Poll = {
        question: this.pollForm.value.question,
        options: this.pollForm.value.options.map((option: string) => ({ text: option }))
      };

      this._pollservice.createPoll(newPoll).subscribe((res: any) => {

        this.polls.unshift(newPoll);
        this.pollForm.reset();
        while (this.options.length > 2) {
          this.options.removeAt(this.options.length - 1);
        }
        window.location.reload();
      })
    }
  }



  availablepolls(page: number) {
    this._pollservice.getAllavailablepolls(page, this.limit).subscribe((res: any) => {
      console.log("all polls are", res)
      this.polls = res.data
      console.log("option",)
    })
  }


  vote(pollId: string, optionIndex: number) {
    console.log("you voted")
    console.log("vote id", pollId)
    console.log("option index", optionIndex)
    this.socket.emit("vote", { pollId, optionIndex, userId: this.userId });
  }

  loadPolls() {
    this.socket.emit("getPolls");
    this.socket.on("pollData", (polls: any[]) => {
      this.polls = polls;
    });
  }

  updatePollList(updatedPoll: any) {
    this.polls = this.polls.map(p => (p._id === updatedPoll._id ? updatedPoll : p));
  }


  deletePoll(pollId: string) {
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._pollservice.deletePoll(pollId).subscribe(
          (res: any) => {
            console.log("Poll deleted: ", res);

            this.availablepolls(this.currentPage)
            Swal.fire('Deleted!', 'Your poll has been deleted.', 'success');
          },
          (error) => {
            console.error("Error deleting story: ", error);
            Swal.fire('Error!', 'There was a problem deleting your story.', 'error');
          }
        );
      }
    });
  }
}
