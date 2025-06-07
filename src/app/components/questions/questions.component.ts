import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions = [
    "What prompted the seek medical support at this time?",
    "How have these conditions been affecting your daily life or routines?",
    "Do you have any chronic or recurring health conditions?",
    "Are you experiencing any specific symptoms or concerns right now?"
  ];

  currentIndex = 0;
  answers: string[] = new Array(this.questions.length).fill('');
  isAnswerFilled = false;

  constructor() {}

  ngOnInit() {}

  // التحقق من إذا كان المستخدم قد كتب إجابة
  checkAnswer() {
    this.isAnswerFilled = this.answers[this.currentIndex]?.trim() !== '';
  }

  // الانتقال للسؤال التالي مع حفظ الإجابة
  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.isAnswerFilled = false; // إعادة تعيين الحالة بعد الانتقال للسؤال التالي
    }
  }

  // تخطي السؤال دون حفظ الإجابة
  skip() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.isAnswerFilled = false; // إعادة تعيين الحالة بعد الانتقال للسؤال التالي
    }
  }

  preventScroll(event: Event) {
    event.preventDefault();
  }
}
