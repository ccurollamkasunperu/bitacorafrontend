import { Component,TemplateRef, OnInit, Input ,ViewChild,Injectable,ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { isNil, remove, reverse } from 'lodash';
import {TreeviewItem, TreeviewConfig, TreeviewHelper, TreeviewComponent,TreeviewEventParser, OrderDownlineTreeviewEventParser, DownlineTreeviewItem} from 'ngx-treeview';
import { ProductService } from './product.service';

@Injectable()
export class ProductTreeviewConfig extends TreeviewConfig {
  hasAllCheckBox = false;
  hasFilter = false;
  hasCollapseExpand = false;
  maxHeight = 1200;
}

@Component({
  selector: 'app-perfil-permiso',
  templateUrl: './perfil-permiso.component.html',
  providers: [
    ProductService,
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewConfig, useClass: ProductTreeviewConfig }
  ]
})
export class PerfilPermisoComponent implements OnInit {
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;

  items: TreeviewItem[];
  rows: string[];

  titulopant: string = "Perfil Permiso";
  icono: string = "pe-7s-world";

  form: FormGroup;

  //Desde aqui se declara variables el DATATABLES
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = "inline-block";
  idvisSEL: string = "";
  sec_id: string = "0";
  sec_activo: string = "1";

  fb_fecini: Date;
  fb_fecfin: Date;
  tipoContrib: string = "";
  dataTipoContribuyente: any;
  dataTipoValor: any;
  dataTipoSector: any;
  dataProceso: any;
  dataPerfil: any;
  dataObjeto: any;
  dataEnvioPermisos: any;
  rowSelected: any;
  message = "";
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada:any=[];
  perfil: string = "1";
  idoc: string = "1";
  descrip: string = "";
  abrevi: string = "";
  p_prf_id: string = "0";
  p_prf_activo: string = "1";

  selp_prf_id: string = "0";
  selp_prf_activo: string = "1";

  sel_p_prm_id: string = "0";
  sel_p_prf_id: string = "0";
  sel_p_obj_id: string = "0";
  sel_p_pmt_id: string = "0";
  sel_p_prm_activo: string = "1";

  p_prm_id: string = "0";
  p_obj_id: string = "0";
  p_obj_idpadr: string = "0";
  p_pmt_id: string = "0";
  p_prm_activo: string = "9";
  valuessons: string = "";
  tomante: string = "";
  seleccionados: string = "";
  trufals:boolean;

  dtTrigger: Subject<any> = new Subject<any>();
  
  dtOptions: any = {
    pagingType: "full_numbers",
    pageLength: 10,
    dom: "Bfrtip",
    buttons: ["excel"],
    select: true,
    responsive: true,
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $("td", row).off("click");
      $("td", row).on("click", () => {
        this.rowSelected = data;
          if (this.rowSelected !== this.dataanteriorseleccionada) {
            this.dataanteriorseleccionada = this.rowSelected;
          }else{
            this.dataanteriorseleccionada = [];
          }
          console.log(this.dataanteriorseleccionada);
          let btnDetalleProceso = document.getElementById('tablaDataProceso') as HTMLButtonElement;
          btnDetalleProceso.disabled = false;
      });
      return row;
    },
    language: {
      processing: "Procesando...",

      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
      info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
      infoEmpty: "Mostrando ningún elemento.",
      infoFiltered: "(filtrado _MAX_ elementos total)",
      infoPostFix: "",
      loadingRecords: "Cargando registros...",
      zeroRecords: "No se encontraron registros",
      emptyTable: "No hay datos disponibles en la tabla",
      select: {
        rows: {
          _: "%d filas seleccionadas",
          0: "Haga clic en una fila para seleccionarla",
          1: "Sector seleccionado",
        },
      },
      paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último",
      },
      aria: {
        sortAscending: ": Activar para ordenar la tabla en orden ascendente",
        sortDescending: ": Activar para ordenar la tabla en orden descendente",
      },
    },
  };
  //Aqui termina la declaracion variables del DATATABLES

  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService , 
    private appComponent: AppComponent,
    private service: ProductService,
    fb: FormBuilder) {
    this.appComponent.login = false; 
    this.form = fb.group({
      dataEnvioPermisos:  new FormArray([])
     });
  }

  ngOnInit() {
    this.fillPermisos();
    this.api.validateSession('permiso');
    this.loadDataProceso();
    this.fillPerfil();
    this.fillObjeto();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector(
      "#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5"
    ) as HTMLButtonElement;
    btnExcel.click();
  }

  loadDataProceso() {
    const data_post = {
      p_prf_id: this.selp_prf_id,
      p_prf_activo: this.selp_prf_activo,
    };

    this.api.perfilSel(data_post).subscribe((data: any) => {
      console.log(data);
      let btnExportaExcel = document.getElementById(
        "descargaProceso"
      ) as HTMLButtonElement;

      if (data.length != 0) {
        this.dataProceso = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        btnExportaExcel.disabled = false;
      } else {
        this.dataProceso = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

  fillPermisos() {
    const data_post = {
      p_prm_id: this.p_prm_id,
      p_prf_id: this.perfil,
      p_obj_id: this.p_obj_id,
      p_obj_idpadr: this.p_obj_idpadr,
      p_pmt_id: this.p_pmt_id,
      p_prm_activo: this.p_prm_activo,
    };
    console.log(data_post);
    this.api.perfilpermisosPRM(data_post).subscribe((data: any) => {
      this.items = this.service.getProducts(data);
    });
  }

  fillPerfil() {
    const data_post = {
      p_prf_id: this.p_prf_id,
      p_prf_activo: this.p_prf_activo,
    };

    this.api.perfilSel(data_post).subscribe((data: any) => {
      this.dataPerfil = data;
    });
  }
  
  fillObjeto() {
    const data_post = {
      p_prm_id: this.sel_p_prm_id,
      p_prf_id: this.sel_p_prf_id,
      p_obj_id: this.sel_p_obj_id,
      p_pmt_id: this.sel_p_pmt_id,
      p_prm_activo: this.sel_p_prm_activo,
    };

    this.api.usuarioPermisoSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataObjeto = data;
    });
  }

  onCheckboxChange(event: any) {
    const dataEnvioPermisos = (this.form.controls.dataEnvioPermisos as FormArray);
    if (event.target.checked) {
      dataEnvioPermisos.push(new FormControl(event.target.value));
      console.log(dataEnvioPermisos);
    } else {
      const index = dataEnvioPermisos.controls
      .findIndex(x => x.value === event.target.value);
      dataEnvioPermisos.removeAt(index);
      console.log(dataEnvioPermisos);
    }
  }

  submit() {
    console.log(this.form.value);
  }

  someClickHandler(info: any): void {
    console.log(info);

    this.message = info[0] + " - " + info.firstName;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  nuevoMantenimiento() {
    this.router.navigate(["/mantenimiento/nuevo"]);
  }

  openModal(
    template: TemplateRef<any>,
    clase: string,
    idCiam: number,
    tipoModal: string
  ) {
    this.modalRef = this.modalService.show(template, { class: clase });
  }

  openModalShow(template: TemplateRef<any>, clase: string, id:string) {
    this.trufals = false;
    this.perfil = id;
    this.idoc=id;
    this.fillPermisos();
    this.items=[];
    setTimeout(() => {
      this.modalRef = this.modalService.show(template, { class: clase });
    }, 500);
    this.trufals = true;
  }

  anulaMantenimiento(){
      if (this.dataanteriorseleccionada == '') {
        swal.fire({
          title: 'Error',
          text: 'Debes seleccionar un Proceso a anular',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
        });
      }else{
        const dataPost = {
          p_sec_id : parseInt(this.dataanteriorseleccionada[0]),
          p_sec_activo : 0
        };
        swal.fire({
          title: 'Mensaje',
          html: "¿Seguro de Anular Registro Seleccionado?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ACEPTAR',
          cancelButtonText: 'CANCELAR'
        }).then((result) => {
          if (result.isConfirmed) {
            this.api.getsectoract(dataPost).subscribe((data: any) => {
              if(data[0].error == 0){
                swal.fire({
                  title: 'Exito',
                  text: data[0].mensa.trim(),
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
                }).then((result) => {
                  if (result.value) {
                    setTimeout(() => {
                       this.loadDataProceso();
                    }, 300);
                  }
                });
              }else{
                swal.fire({
                    title: 'Error',
                    text: data[0].mensa.trim(),
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar',
                  });
              }
            });
          }
        })
      }
  }

  salir() {}

  LimpiarFormulario() {
    this.descrip="";
    this.abrevi="";
  }

  procesaRegistro(textstring:string) {
      let menca = textstring;
      menca = menca.replace('|',""); 
      var toms:string;
      toms=menca;

      const dataPost = {
        p_prf_id: parseInt(this.idoc),
        p_prm_id: toms
      };

      this.api.perfilpermisosReg(dataPost).subscribe((data: any) => {
        console.log(data);
        if (data[0].error == 0) {
          swal
            .fire({
              title: "Exito",
              text: data[0].mensa.trim(),
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
            })
            .then((result) => {
              if (result.value) {
                setTimeout(() => {
                  this.LimpiarFormulario();
                  document.getElementById("closeModal").click();
                }, 300);
              }
            });
        } else {
          swal.fire({
            title: "Error",
            text: data[0].mensa.trim(),
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          });
        }
      });
  }

  onSelectedChange(downlineItems: DownlineTreeviewItem[]): void {
    this.rows = [];
    downlineItems.forEach(downlineItem => {
      const item = downlineItem.item;
      const value = item.value;
      const texts = [];
      let parent = downlineItem.parent;
      while (!isNil(parent)) {
        parent = parent.parent;
      }
      const reverseTexts = reverse(texts);
      const row = `${reverseTexts.join('|')} | ${value}`;
      this.rows.push(row);
    });
  }

  removeItem(item: TreeviewItem): void {
    for (const tmpItem of this.items) {
      if (tmpItem === item) {
        remove(this.items, item);
      } else {
        if (TreeviewHelper.removeItem(tmpItem, item)) {
          break;
        }
      }
    }

    this.treeviewComponent.raiseSelectedChange();
  }

}
