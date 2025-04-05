import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  tests: any[] = [];
  currentTest: any;
  currentQuestionIndex: number = 0;
  quizStarted: boolean = false;
  selectedAnswer: { [questionId: number]: string } = {};
  isQuizAnswered: boolean = false;

  // Timer
  timeLeft: number = 0;
  timerDuration: number = 0;
  timerInterval: any;
  timerColor: string = 'green';

  // Modals
  submissionResult: any = null;
  showSubmissionPopup: boolean = false;
  testResults: any[] = [];
  showResultsModal: boolean = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizService.getAllTests().subscribe(data => {
      this.tests = data;
    });

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id');
      if (id) this.loadTestQuestions(id);
    });
  }

  startTest(testId: number): void {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;

    this.quizService.getQuestionsByTest(testId).subscribe(data => {
      this.currentTest = data;
      this.router.navigate([`/quiz/${testId}`]);

      this.timerDuration = (this.currentTest.testDTO.time || 1) * 60;
      this.timeLeft = this.timerDuration;
      this.startTimer();
    });
  }

  loadTestQuestions(testId: number): void {
    this.quizService.getQuestionsByTest(testId).subscribe(data => {
      this.currentTest = data;
      this.quizStarted = true;

      this.timerDuration = (this.currentTest.testDTO.time || 1) * 60;
      this.timeLeft = this.timerDuration;
      this.startTimer();
    });
  }

  answerQuestion(questionId: number, answer: string): void {
    this.selectedAnswer[questionId] = answer;
  }

  nextQuestion(): void {
    const currentId = this.currentTest.questions[this.currentQuestionIndex].id;
    if (!this.selectedAnswer[currentId]) {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (this.currentQuestionIndex < this.currentTest.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  submitTest(autoSubmit: boolean = false): void {
    if (!this.currentTest || !this.currentTest.testDTO?.id) {
      console.error('Missing test ID');
      return;
    }

    const submitData = {
      testId: this.currentTest.testDTO.id,
      responses: Object.keys(this.selectedAnswer).map(questionId => ({
        questionId: +questionId,
        selectedOption: this.selectedAnswer[+questionId]
      }))
    };

    const allAnswered = Object.keys(this.selectedAnswer).length === this.currentTest.questions.length;

    if (allAnswered || autoSubmit) {
      clearInterval(this.timerInterval);
      this.quizService.submitTest(submitData).subscribe(response => {
        this.submissionResult = response;
        this.showSubmissionPopup = true;
        this.isQuizAnswered = true;
        this.quizStarted = false;
      }, error => {
        console.error('Submission error:', error);
      });
    } else if (!autoSubmit) {
      alert('Please answer all questions before submitting.');
    }
  }

  closePopup(): void {
    this.showSubmissionPopup = false;
    this.router.navigate(['/quiz']);
  }

  startTimer(): void {
    this.updateTimerColor();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerColor();
      } else {
        clearInterval(this.timerInterval);
        this.submitTest(true);
      }
    }, 1000);
  }

  updateTimerColor(): void {
    const percentLeft = (this.timeLeft / this.timerDuration) * 100;
    if (percentLeft <= 10) {
      this.timerColor = 'red';
    } else if (percentLeft <= 50) {
      this.timerColor = 'orange';
    } else {
      this.timerColor = 'green';
    }
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  get circumference(): number {
    return 2 * Math.PI * 45;
  }

  get progressOffset(): number {
    return this.circumference * (1 - this.timeLeft / this.timerDuration);
  }

  // View all results in a modal
  viewAllResults(): void {
    this.quizService.getTestResults().subscribe(results => {
      this.testResults = results;
      this.showResultsModal = true;
    });
  }

  closeResultsModal(): void {
    this.showResultsModal = false;
  }
}
