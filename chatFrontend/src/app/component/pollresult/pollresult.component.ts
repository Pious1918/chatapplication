import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../common/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from '../../services/poll.service';

interface Poll {
  _id?: any
  question: string;
  options: any[];
  creatorId?: string
}
@Component({
  selector: 'app-pollresult',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './pollresult.component.html',
  styleUrl: './pollresult.component.css'
})
export class PollresultComponent implements OnInit {

  constructor(private _pollservice: PollService) { }

  polls: Poll[] = [];


  ngOnInit(): void {
    this.getUsercreatedPolls()
  }

  deletePoll(pollId: string) {
    this.polls = this.polls.filter((p) => p._id !== pollId);
  }



  getUsercreatedPolls() {
    this._pollservice.getUserPolls().subscribe((res: any) => {
      console.log("user created polls", res)
      this.polls = res.data
    })
  }
}
