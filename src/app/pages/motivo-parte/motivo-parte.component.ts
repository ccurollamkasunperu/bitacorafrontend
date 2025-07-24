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
  selector: 'app-motivo-parte',
  templateUrl: './motivo-parte.component.html'
})
export class MotivoParteComponent implements OnInit {

  //Variables
  color:string='';
  descrip: string='';
  abrev: string='';
  //Fin variables

  //Configuraciones Generales
  titulopant : string = "Motivo Parte";
  icono : string = "pe-7s-note";
  //Fin Configuraciones Generales

  //Desde aqui se declara variables el DATATABLES
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  idvisSEL: string = '';

  fb_fecini: Date;
  fb_fecfin: Date;
  tipoContrib: string = '';
  tipoValor: string = '';
  tipoSector: string = '';
  dataTipoContribuyente: any;
  dataTipoValor: any;
  datamotcabece: any;
  datamotdetall: any;
  dataTipoSector: any;
  dataProceso: any;
  rowSelected: any;
  dataColor: any;
  message = '';
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada:any=[];

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
          1: "Motivo Parte seleccionado"
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

  //DATOS PARA EL SEL
  p_mop_id : string = '0';
  p_mpc_id : string = '0';
  p_mpd_id : string = '0';
  p_mop_activo : string = '1';
  //FIN DATOS PARA EL SEL
  
  sel_p_mpd_id : string = '0';
  sel_p_mpd_activo : string = '1';
  
  sel_p_mpc_descri : string = '0';
  sel_p_mpc_activo : string = '1';

  mpcid:string='';
  mpdid:string='';

  modalRef: BsModalRef;

  constructor(private router: Router,private modalService: BsModalService, private api: ApiService, private appComponent: AppComponent) {
   this.appComponent.login = false; 
  }

  ngOnInit() {
    this.api.validateSession('motivo-parte');
    this.fillMotDetalle();
    this.fillMotCabecera();
    this.loadDataProceso();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  fillMotCabecera(){
    const data_post = {
      p_mpc_descri: this.sel_p_mpc_descri,
      p_mpc_activo: this.sel_p_mpc_activo,
    };
    
    this.api.getmotivopartecabsel(data_post).subscribe((data: any) => {
      console.log(data);
      this.datamotcabece = data;
    });
  }

  fillMotDetalle(){
      const data_post = {
        p_mpd_id: this.sel_p_mpd_id,
        p_mpd_activo: this.sel_p_mpd_activo
      };
      
      this.api.getmotivopartedetsel(data_post).subscribe((data: any) => {
        console.log(data);
        this.datamotdetall = data;
      });
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  loadDataProceso() {
    const data_post = {
      p_mop_id: this.p_mop_id,
      p_mpc_id: this.p_mpc_id,
      p_mpd_id: this.p_mpd_id,
      p_mop_activo: this.p_mop_activo,
    };

    this.api.getmotivopartesel(data_post).subscribe((data: any) => {
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
          p_mop_id : parseInt(this.dataanteriorseleccionada[0]),
          p_mop_activo : 0
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
            this.api.getmotivoparteact(dataPost).subscribe((data: any) => {
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
    this.mpcid="";
    this.mpdid="";
  }

  procesaRegistro(){
    if(this.mpcid == ''){
      swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un Motivo Cabecera',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.mpdid == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe ingresar un Motivo Detalle',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else{
      const dataPost = {
        p_mpc_id : this.mpcid,
        p_mpd_id : this.mpdid
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

          this.api.getmotivoparteins(dataPost).subscribe((data: any) => {
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
