import { Component, OnInit } from '@angular/core';
import { ApiServices } from '../services/api-services';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
// import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-earning-statistic',
  templateUrl: './earning-statistic.component.html',
  styleUrl: './earning-statistic.component.scss',
})
export class EarningStatisticComponent implements OnInit {
  total: number = 0;
  // chart
  data: any;

  options: any;
  // end chart
  title: string = 'Earning Statistics';
  filtervalue: string = 'delivered';
  loadingpage: boolean = true;
  inputData: any = [];
  from: string = '';
  rental_name: string = '';
  to: string = '';
  onsearch: boolean = true;
  nextPage: string = '';
  prevPage: string = '';
  totalItem: string = '';
  currentPage = '1';
  payoutAccount: any;
  totalItems: any = [];
  displayedItems: any[] = [];
  selectedDate: string;
  startDate: string;
  endDate: string;

  currentDate: string;

  constructor(private apiService: ApiServices, public datePipe: DatePipe) {
    const today = new Date();
    // Format the current date to 'yyyy-MM-dd'
    this.currentDate = this.datePipe.transform(today, 'yyyy-MM-dd') ?? '';

    // Get the date 3 days ago
    const threeDaysAgoDate = new Date(today);
    threeDaysAgoDate.setDate(today.getDate() - 3);
    this.startDate =
      this.datePipe.transform(threeDaysAgoDate, 'yyyy-MM-dd') ?? '';

    // Get the date 3 days ahead
    const threeDaysAheadDate = new Date(today);
    threeDaysAheadDate.setDate(today.getDate() + 3);
    this.endDate =
      this.datePipe.transform(threeDaysAheadDate, 'yyyy-MM-dd') ?? '';
  }
  ngOnInit(): void {
    // Get the current date
    // Initialize with current date
    // this.getWeeksInMonth(2024, 12);
    // this.getEarningsOrders(this.currentPage);
    this.getEarnings(this.currentPage);
    console.log([this.startDate, this.endDate]);
  }

  getStartDate(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.startDate = inputElement.value;
    this.endDate = inputElement.value;
  }

  getEndDate(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    console.log(inputElement.value);
    this.endDate = inputElement.value;

    this.getEarnings(this.currentPage);
    // this.getEarningsOrders(this.currentPage);
  }

  getEarningsOrders(page: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarningsOrders(
          { startDate: this.startDate, endDate: this.endDate },
          page
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(res['total']);
            this.displayedItems = res['data'];
            this.from = res['from'] ?? '';
            this.to = res['to'] ?? '';
            this.totalItem = res['total'] ?? '';
            this.totalItems =
              res['links'].length !== 0 ? res['links'].slice(1, -1) : [];
            console.log(this.displayedItems);
            this.nextPage =
              res['next_page_url'] != null ? res['next_page_url'] : '';
            this.prevPage =
              res['prev_page_url'] != null ? res['prev_page_url'] : '';
            this.loadingpage = false;
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error.message);
            this.loadingpage = false;
          },
        });
    }
  }

  onPageChange(startIndex: string, page: string) {
    console.log(startIndex);
    this.getEarnings(page);
    // console.log(this.currentPage);
  }

  nextChangePage() {
    if (this.nextPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarnings(this.nextPage.split('=')[1]);
  }

  prevChangePage() {
    if (this.prevPage == '') {
      return;
    }
    // console.log(this.nextPage.split('=')[1]);
    this.getEarnings(this.prevPage.split('=')[1]);
  }

  getWeeksInMonth(
    year: number,
    month: number
  ): { start: string; end: string; days: string[] }[] {
    const weeks: { start: string; end: string; days: string[] }[] = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    let currentWeekStart = new Date(firstDayOfMonth);
    let currentWeekEnd = new Date(firstDayOfMonth);
    let currentWeekDays: string[] = [];

    while (currentWeekStart <= lastDayOfMonth) {
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
      if (currentWeekEnd > lastDayOfMonth) {
        currentWeekEnd = new Date(lastDayOfMonth);
      }

      for (
        let d = new Date(currentWeekStart);
        d <= currentWeekEnd;
        d.setDate(d.getDate() + 1)
      ) {
        currentWeekDays.push(
          `${d.getFullYear()}/${this.formatNumber(
            d.getDate()
          )}/${this.formatNumber(d.getMonth() + 1)}`
        );
      }

      weeks.push({
        start: `${currentWeekStart.getFullYear()}/${this.formatNumber(
          currentWeekStart.getDate()
        )}/${this.formatNumber(currentWeekStart.getMonth() + 1)}`,
        end: `${currentWeekEnd.getFullYear()}/${this.formatNumber(
          currentWeekEnd.getDate()
        )}/${this.formatNumber(currentWeekEnd.getMonth() + 1)}`,
        days: [...currentWeekDays],
      });

      currentWeekStart.setDate(currentWeekEnd.getDate() + 1);
      currentWeekDays = [];
    }
    console.log(weeks);
    return weeks;
  }

  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  getEarnings(page: string) {
    this.loadingpage = true;
    if (typeof localStorage !== 'undefined') {
      var token: any = localStorage.getItem('token');
      this.apiService
        .getEarnings({ startDate: this.startDate, endDate: this.endDate }, page)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(res['total']);
            this.displayedItems = res['data']['data'];
            this.from = res['data']['from'] ?? '';
            this.to = res['data']['to'] ?? '';
            this.totalItem = res['data']['total'] ?? '';
            this.totalItems =
              res['data']['links'].length !== 0
                ? res['data']['links'].slice(1, -1)
                : [];
            // console.log(this.displayedItems);
            this.nextPage =
              res['data']['next_page_url'] != null
                ? res['data']['next_page_url']
                : '';
            this.prevPage =
              res['data']['prev_page_url'] != null
                ? res['data']['prev_page_url']
                : '';
            this.total = res['total_commission'];
            this.loadingpage = false;
            this.openChart(res['data']['data']);
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error.message);
            this.loadingpage = false;
          },
        });
    }
  }

  openChart(data: any) {
    console.log(
      data.map((ele: { created_at: any }) =>
        this.datePipe.transform(ele.created_at, 'MMMM d, y')
      )
    );
    const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: data.map((ele: { created_at: any }) =>
        this.datePipe.transform(ele.created_at, 'MMMM d, y')
      ),
      datasets: [
        {
          label: `Earnings From ${this.startDate} to ${this.endDate}`,
          data: data.map((ele: { commission: any }) => ele.commission),
          fill: true,
          tension: 0.4,
          borderColor: '#7cae41',
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            // color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            // color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            // color: surfaceBorder,
          },
        },
      },
      onClick: (_: any, elements: any) => {
        if (elements.length) {
          // The user clicked on a label
          console.log(data[elements[0].index]);
        }
      },
    };
  }
}
