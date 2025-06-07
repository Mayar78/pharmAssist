import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-firstpage',
  standalone: true,
  imports: [],
  templateUrl: './firstpage.component.html',
  styleUrl: './firstpage.component.css'
})
export class FirstpageComponent {
 

  ngAfterViewInit() {
  

    const options = {
      strings: ['To Your Health.', 'PharmAssist.'],
      typeSpeed: 70,
      backSpeed: 50,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      
    };

    new Typed('#typed-text', options);
  }

 
}
