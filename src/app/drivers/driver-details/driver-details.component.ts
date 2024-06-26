import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServices } from '../../services/api-services';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.scss',
})
export class DriverDetailsComponent implements OnInit {
  loading: boolean = true;
  onsearch: boolean = false;
  title = 'Driver Details';
  driver_id = '';
  filtervalue = 'all';
  searchValue = '';
  driverDetails: any;

  //table
  totalPage = 0;
  page = 1;
  orders: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiServices) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['driverId'] as string;
      this.driver_id = code;
    });
    console.log(this.driver_id);
    this.getDriverDetails();
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  getDriverDetails() {
    this.api.getDriverDetails(this.driver_id).subscribe({
      next: (res) => {
        this.driverDetails = res;
        console.log('driver details', res);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.loading = false;
      },
    });
  }

  statusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filtervalue = inputElement.value;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  searchOrderEvent(event: Event) {
    this.onsearch = true;
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    console.log(inputElement.value);
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
    // this.searchOrder(this.filtervalue, this.searchValue, this.currentPage);
  }

  searchOrder(page: string, status: string, searcgValue: string) {
    this.loading = true;
    this.api
      .getDriverOrders(this.driver_id, status, searcgValue, page)
      .subscribe({
        next: (res: any) => {
          this.orders = res.data;
          this.totalPage = res.last_page;
          console.log(res);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  nextPage() {
    if (this.page == this.totalPage) {
      return;
    }
    this.page++;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }

  prevPage() {
    if (this.page == 1) {
      return;
    }
    this.page--;
    this.searchOrder(this.page.toString(), this.filtervalue, this.searchValue);
  }
}
