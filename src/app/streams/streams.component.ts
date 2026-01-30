import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  DecimalPipe,
  JsonPipe,
} from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  interval,
  map,
  filter,
  debounceTime,
  take,
  tap,
  Subscription,
  fromEvent,
  of,
  Subject,
  takeUntil,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-streams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe, DecimalPipe],
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css'],
})
export class StreamsComponent implements OnInit, OnDestroy {
  // Interval stream state
  isIntervalRunning = false;
  intervalSubscription: Subscription | null = null;

  intervalValues: number[] = [];
  intervalValues$: Subject<number[]> = new Subject<number[]>();

  mappedValues: number[] = [];
  mappedValues$: Subject<number[]> = new Subject<number[]>();

  filteredValues: number[] = [];
  filteredValues$: Subject<number[]> = new Subject<number[]>();

  takenValues: number[] = [];
  takenValues$: Subject<number[]> = new Subject<number[]>();

  unsafeStreamValues: number[] = [];
  unsafeStreamValues$: Subject<number[]> = new Subject<number[]>();
  unsafeStreamValuesSubscription: Subscription = new Subscription();

  // Search example state
  searchControl: FormControl = new FormControl('');
  searchResults: string[] = [];
  searchSubscription: Subscription | null = null;
  searchResults$: Subject<string[]> = new Subject<string[]>();
  searchInput$: Subject<Event> = new Subject<Event>();

  // Mouse move example state
  mouseMoveSubscription: Subscription | null = null;
  mouseMoves: { x: number; y: number }[] = [];

  // Custom data stream
  users = [
    { id: 1, name: 'Alice', age: 28 },
    { id: 2, name: 'Bob', age: 32 },
    { id: 3, name: 'Charlie', age: 24 },
  ];
  userStreamValues: string[] = [];
  userStreamValues$: Subject<string[]> = new Subject<string[]>();

  destroy$ = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    
  }

  ngOnDestroy() {
    // this.intervalSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.mouseMoveSubscription?.unsubscribe();
    // this.destroy$.emit();
  }

  emitValue(event: Event) {
    this.searchInput$.next(event);
  }

  stopStream() {
    this.destroy$.emit();
  }

  startIntervalStream() {
    if (this.isIntervalRunning) return;

    this.isIntervalRunning = true;
    this.intervalValues = [];
    this.mappedValues = [];
    this.filteredValues = [];
    this.takenValues = [];

    this.intervalSubscription = interval(100)
      .pipe(
        tap((value) => {
          this.intervalValues.push(value);
        }),
        map((value) => value * 2),
        tap((mappedValue) => this.mappedValues.push(mappedValue)),
        filter((value) => value % 3 === 0),
        tap((filteredValue) => this.filteredValues.push(filteredValue)),
        take(10),
        tap((takenValue) => this.takenValues.push(takenValue)),
      )
      .subscribe({
        next: (val) => console.log(val),
        complete: () => {
          this.isIntervalRunning = false;
          console.log('Interval stream completed after 10 values.');
          this.intervalValues$.next(this.intervalValues);
          this.mappedValues$.next(this.mappedValues);
          this.filteredValues$.next(this.filteredValues);
          this.takenValues$.next(this.takenValues);
        },
      });
  }

  stopIntervalStream() {
    this.isIntervalRunning = false;
    this.intervalSubscription?.unsubscribe();
  }

  startMouseMoveStream() {
    this.mouseMoves = [];
    this.mouseMoveSubscription = fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        debounceTime(100), // Throttle to reduce frequency
        map((event) => ({ x: event.clientX, y: event.clientY })), // Map to coordinates
      )
      .subscribe({
        next: (coordinates) => {
          this.mouseMoves.push(coordinates);
          if (this.mouseMoves.length > 20) {
            this.mouseMoves.shift(); // Keep only the last 20 moves
          }
          this.cdr.detectChanges();
        },
      });
  }

  stopMouseMoveStream() {
    this.mouseMoveSubscription?.unsubscribe();
  }

  startUserStream() {
    this.userStreamValues = [];
    of(...this.users)
      .pipe(
        map((user) => `${user.name} (${user.age} years old)`), // Transform user object
      )
      .subscribe({
        next: (userString) => {
          this.userStreamValues.push(userString);
          this.cdr.detectChanges();
        },
        complete: () => this.userStreamValues$.next(this.userStreamValues),
      });
  }

  dangerousLeakingInterval() {
    console.warn('⚠️ This will leak memory! Check browser dev tools.');
    this.unsafeStreamValuesSubscription = interval(1000)
      .pipe(
        map((value) => value * 1.05),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (value) => {
          console.log('Leaking interval:', value);
          this.unsafeStreamValues.push(value);
          this.unsafeStreamValues$.next(this.unsafeStreamValues);
        },
      });
  }
}
