import { Component, OnInit } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  @Output() onTimeOff = new EventEmitter<Boolean>();
  constructor() { }
  time : number = 1500000; //minlisegundos
  timer; 

  triggerTimer() {
    this.timer = setInterval(() => {
        if(this.time == 0) {
          clearInterval(this.timer);
          this.onTimeOff.emit(true);
        }else {
          this.time -= 1000;
          //console.log(this.time);
        }
    }, 1000)
  }

  ngOnInit(): void {
    this.triggerTimer()
  }

}
