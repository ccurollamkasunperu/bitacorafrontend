import { Component,TemplateRef, OnInit, Input ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import swal from 'sweetalert2';

@Component({
  selector: 'app-marca-modelo',
  templateUrl: './marca-modelo.component.html',
})

export class MarcaModeloComponent implements OnInit {
//Configuraciones Generales
  titulopant : string = "Marca - Modelo"
  icono : string = "pe-7s-next-2"

  //Fin Configuraciones Generales

  //Desde aqui se declara variables el DATATABLES
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  idvisSEL: string = '';
  marcaid: string = '';
  modeloid: string = '';

  fb_fecini: Date;
  fb_fecfin: Date;
  tipoContrib: string = '';
  tipoValor: string = '';
  tipoSector: string = '';
  dataTipoContribuyente: any;
  dataTipoValor: any;
  dataTipoSector: any;
  dataProceso: any;
  dataMarca: any;
  dataModelo: any;
  rowSelected:any;
  dataanteriorseleccionada:any=[];
  message = '';
  btnBlockDisabled = true;

  mar_id : string = '0';
  mar_activo: string = '1';
  mod_id: string = '0';
  mod_activo: string = '1';
  activo: boolean= false;

  //Datos para traer el SEL
  sel_mmo_id : string = '0';
  sel_mar_id : string = '0';
  sel_mod_id : string = '0';
  sel_mmo_activo : string = '1';
  //Fin datos para traer el SEL

  anios: any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 10,
    dom: 'Bfrtip',
    buttons: [
      'excel'
    ],
    select: true,
    responsive: true,
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $('td', row).off('click');
      $('td', row).on('click', () => {
          this.rowSelected = data;
          if (this.rowSelected !== this.dataanteriorseleccionada) {
            this.dataanteriorseleccionada = this.rowSelected;
          }else{
            this.dataanteriorseleccionada = [];
          }
          console.log(this.dataanteriorseleccionada);
          // let btnDetalleProceso = document.getElementById('tablaDataProceso') as HTMLButtonElement;
          // btnDetalleProceso.disabled = false;
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
          1: "Marca Modelo seleccionado"
        }
      },
      paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último"
      },
      aria: {
        sortAscending: ": Activar para ordenar la tabla en orden ascendente",
        sortDescending: ": Activar para ordenar la tabla en orden descendente"
      }
    }
  };
  //Aqui termina la declaracion variables del DATATABLES

  modalRef: BsModalRef;

  constructor(private router: Router,private modalService: BsModalService, private api: ApiService, private appComponent: AppComponent) {
   this.appComponent.login = false; 
  }

  ngOnInit() {
    this.api.validateSession('marca-modelo');
    this.loadDataProceso();
    this.fillMarca();
    this.fillModelo();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }
  
  fillMarca(){
    const data_post = {
      p_mar_id: this.mar_id,
      p_mar_activo: this.mar_activo,
    };
    
    this.api.getmarcavehiculosel(data_post).subscribe((data: any) => {
      this.dataMarca = data;
    });
  }
  
  fillModelo(){
    const data_post = {
      p_mod_id: this.mar_id,
      p_mod_activo: this.mar_activo,
    };

    this.api.getmodelovehiculosel(data_post).subscribe((data: any) => {
      this.dataModelo = data;
    });
  }

  loadDataProceso() {
    const data_post = {
      p_mmo_id : this.sel_mmo_id,
      p_mar_id : this.sel_mar_id,
      p_mod_id : this.sel_mod_id,
      p_mmo_activo : this.sel_mmo_activo,
    };

    this.api.getmarcamodvehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      let btnExportaExcel = document.getElementById('descargaProceso') as HTMLButtonElement;
      
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

  someClickHandler(info: any): void {
    console.log(info);
    this.message = info[0] + ' - ' + info.firstName;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }
  
  openModal(template: TemplateRef<any>, clase: string, idCiam: number, tipoModal: string) {
      this.modalRef = this.modalService.show(template, {class: clase});
  }
  
  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, {class: clase});
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
          p_mmo_id : parseInt(this.dataanteriorseleccionada[0]),
          p_mmo_activo : 0
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
            this.api.getmarcamodvehiculoact(dataPost).subscribe((data: any) => {
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

  salir(){}

  LimpiarFormulario(){
    this.marcaid="";
    this.modeloid="";
  }

  procesaRegistro(){
    if(this.modeloid == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un Modelo',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.marcaid == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una Marca',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else{
        const dataPost = {
          p_mar_id : parseInt(this.marcaid),
          p_mod_id : parseInt(this.modeloid)
        };

        swal.fire({
          title: 'Mensaje',
          html: "¿Seguro de Guardar Datos?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ACEPTAR',
          cancelButtonText: 'CANCELAR'
        }).then((result) => {
          if (result.isConfirmed) {
            this.api.getmarcamodvehiculoins(dataPost).subscribe((data: any) => {
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
                       this.LimpiarFormulario();
                       document.getElementById('closeModal').click();
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

}
