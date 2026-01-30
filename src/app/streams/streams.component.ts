import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, map, Observable, Subscription, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'app-streams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit, OnDestroy {
  // Stream state
  isIntervalRunning = false;
  intervalSubscription: Subscription | null = null;
  streamValues: number[] = [];
  currentValue = 0;

  // HTTP example state
  isHttpRequestRunning = false;
  httpResponse = '';
  httpError = '';

  ngOnInit() {
    // Example: Uncomment to see memory leak warning
    // this.dangerousLeakingInterval();
  }

  ngOnDestroy() {
    // Clean up subscriptions to avoid memory leaks
    this.intervalSubscription?.unsubscribe();
  }

  // Example 1: Basic interval stream
  startIntervalStream() {
    if (this.isIntervalRunning) return;

    this.isIntervalRunning = true;
    this.streamValues = [];
    this.intervalSubscription = interval(1000)
      .pipe(
        map((value) => value * 1.05),
        tap((value) => this.currentValue = value),
        takeWhile(() => this.isIntervalRunning)
      )
      .subscribe({
        next: (value) => {
          this.streamValues.push(value);
        },
        error: (err) => console.error('Interval error:', err),
        complete: () => console.log('Interval completed')
      });
  }

  stopIntervalStream() {
    this.isIntervalRunning = false;
    this.intervalSubscription?.unsubscribe();
  }

  // Example 2: Simulate HTTP request
  simulateHttpRequest() {
    this.isHttpRequestRunning = true;
    this.httpResponse = '';
    this.httpError = '';

    // Simulate an HTTP request with delay
    const httpRequest$ = new Observable<string>((subscriber) => {
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% success rate
          subscriber.next('Success! Data fetched: { "id": 123, "name": "Example" }');
          subscriber.complete();
        } else {
          subscriber.error('Failed to fetch data: Server error');
        }
      }, 1500);
    });

    httpRequest$.subscribe({
      next: (response) => {
        this.httpResponse = response;
        this.isHttpRequestRunning = false;
      },
      error: (err) => {
        this.httpError = err;
        this.isHttpRequestRunning = false;
      }
    });
  }

  // Example 3: Dangerous leaking interval (for demonstration)
  dangerousLeakingInterval() {
    console.warn('⚠️ This will leak memory! Check browser dev tools.');
    interval(1000)
      .pipe(map((value) => value * 1.05))
      .subscribe({
        next: (value) => console.log('Leaking interval:', value)
      });
  }
}
