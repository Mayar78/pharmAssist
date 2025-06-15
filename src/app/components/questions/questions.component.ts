import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
 
 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../core/interfaces/questions.service';
import { AnswerData, Question } from '../../core/interfaces/Answer';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements  AfterViewInit, AfterViewChecked {
    @ViewChild('answerInput') answerInput!: ElementRef<HTMLTextAreaElement>;
  currentQuestionIndex = 0;
  answers: Record<string, string> = {};
  isSubmitted = false;
  isLoading = false;
  email: string = '';

  questions: Question[] = [
    {
      id: 'promptReason',
      text: '1. What prompted you to seek medical support at this time?',
      required: false,
      apiField: 'PromptReason'
    },
    {
      id: 'chronicConditions',
      text: '2. Do you have any chronic or recurring health conditions?',
      required: false,
      apiField: 'HasChronicConditions'
    },
    {
      id: 'conditionsImpact',
      text: '3. How have these conditions been affecting your daily life or routines?',
      required: false,
      apiField: 'TakesMedicationsOrTreatments'
    },
    {
      id: 'currentSymptoms',
      text: '4. Are you experiencing any specific symptoms or concerns right now?',
      required: false,
      apiField: 'CurrentSymptoms'
    }
  ];

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
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
  

  ngAfterViewChecked(): void {
    
    if (this.answerInput) {
      this.answerInput.nativeElement.focus();
    }
  }
  

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  onNext(): void {
    const answer = this.answerInput.nativeElement.value.trim();
    if (!answer) {
      this.toastr.warning('Please write an answer or click Skip.');
      return;
    }

    this.answers[this.currentQuestion.id] = answer;
    this.answerInput.nativeElement.value = '';

    if (!this.isLastQuestion) {
      this.currentQuestionIndex++;
    } else {
      this.submitAnswers();
    }
  }

  onSkip(): void {
    this.answers[this.currentQuestion.id] = 'Skipped';
    this.answerInput.nativeElement.value = '';

    if (!this.isLastQuestion) {
      this.currentQuestionIndex++;
    } else {
      this.submitAnswers();
    }
  }

  private submitAnswers(): void {
    this.isSubmitted = true;

    const apiAnswers: AnswerData = {
      PromptReason: this.answers['promptReason'] || '',
      HasChronicConditions: this.answers['chronicConditions'] || '',
      TakesMedicationsOrTreatments: this.answers['conditionsImpact'] || '',
      CurrentSymptoms: this.answers['currentSymptoms'] || '',
    };

    console.log('Submitting answers:', apiAnswers);

    this.questionsService.submitAnswers(apiAnswers).subscribe({
      next: (response) => {
        this.toastr.success('Your answers have been submitted successfully!');
        this.authService.loginAfterQuestions(this.email).subscribe({
          next: (res) => {
            this.router.navigate(['/main/home']);
          },
          error: (err) => {
            console.error('loginAfterQuestions error:', err);
            this.router.navigate(['/auth/login']);
          }
        });
      },
      error: (err) => {
        console.error('submitAnswers error:', err);
        this.toastr.error('Failed to submit answers. Please try again.');
        this.isSubmitted = false;
      }
    });
  }
}