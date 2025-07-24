import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TreeviewItem } from 'ngx-treeview';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import { Component,TemplateRef, OnInit, Input ,ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import swal from 'sweetalert2';

export class ProductService {
  getProducts(data:any): TreeviewItem[] {
    console.log(JSON.stringify(data));
    const vegetableCategory = new TreeviewItem(data);
    vegetableCategory.correctChecked(); // need this to make 'Vegetable' node to change checked value from true to false
    return [vegetableCategory];
  }
}
