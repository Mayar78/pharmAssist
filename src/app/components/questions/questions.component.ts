import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../core/interfaces/questions.service';
import { Question } from '../../core/interfaces/Answer';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements AfterViewInit {
  @ViewChild('answerInput') answerInput!: ElementRef<HTMLTextAreaElement>;

  currentQuestionIndex = 0;
  answers: Record<string, string> = {};
  isSubmitted = false;
  isLoading = false;
  email: string = '';
  currentAnswer: string = '';


  questions = [
    {
      id: 'promptReason',
      text: '1. What prompted you to seek medical support at this time?',
      required: false,
      apiField: 'promptReason'
    },
    {
      id: 'chronicConditions',
      text: '2. Do you have any chronic or recurring health conditions?',
      required: false,
      apiField: 'hasChronicConditions'
    },
    {
      id: 'conditionsImpact',
      text: '3. How have these conditions been affecting your daily life or routines?',
      required: false,
      apiField: 'takesMedicationsOrTreatments'
    },
    {
      id: 'currentSymptoms',
      text: '4. Are you experiencing any specific symptoms or concerns right now?',
      required: false,
      apiField: 'currentSymptoms'
    }
  ];

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  ngAfterViewInit(): void {
    if (this.answerInput) {
      this.answerInput.nativeElement.focus();
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

onNext(): void {
  const answer = this.currentAnswer.trim();

 
  this.answers[this.currentQuestion.id] = answer;

  this.currentAnswer = '';

  if (!this.isLastQuestion) {
    this.currentQuestionIndex++;
  } else {
    this.submitAnswers();
  }
}

onSkip(): void {
  this.answers[this.currentQuestion.id] = '';
  this.currentAnswer = '';

  if (!this.isLastQuestion) {
    this.currentQuestionIndex++;
  } else {
    this.submitAnswers();
  }
}

private submitAnswers(): void {
  this.isSubmitted = true;

  const apiAnswers = {
    PromptReason: this.answers['promptReason'] || '',
    HasChronicConditions: this.answers['chronicConditions'] || '',
    TakesMedicationsOrTreatments: this.answers['conditionsImpact'] || '',
    CurrentSymptoms: this.answers['currentSymptoms'] || '',
  };

  this.questionsService.submitAnswers(apiAnswers).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Your answers have been submitted successfully!',
        showConfirmButton: true
      }).then(() => {
        this.router.navigate(['/main/profile']);
      });
    },
    error: (err) => {
      console.error('submitAnswers error:', err);
      Swal.fire('Error', 'Failed to submit answers. Please try again.', 'error');
      this.isSubmitted = false;
    }
  });
}

}
