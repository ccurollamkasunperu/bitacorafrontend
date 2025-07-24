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
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html'
})
export class VehiculoComponent implements OnInit {
  //Variables
  tipvehi:string ='';
  marcmodel:string ='';
  color:string ='';
  placa:string ='';
  codigo:string='';
  numserie:string='';
  nummotor:string='';
  anyofabr:string='';

  //Fin Variables

  //Configuraciones Generales
  titulopant : string = "Vehiculo"
  icono : string = "pe-7s-car"
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
  dataTipoSector: any;
  dataProceso: any;
  dataTipoVehiculo: any;
  dataMarcamodelo: any;
  dataColor: any;
  rowSelected: any;
  message = '';
  
  btnBlockDisabled = true;
  //Datos para el SEL
  veh_id : string = '0'
  tve_id : string = '0'
  mar_id : string = '0'
  mod_id : string = '0'
  esv_id : string = '0'
  cov_id : string = '0'
  veh_numpla : string = '0'
  mpc_id : string = '0'
  mpd_id : string = '0'
  veh_activo : string = '1'
  //Fin datos SEL

  //Datos para combo
  cmb_tve_id : string = '0'
  cmb_tve_activo : string = '1'

  cmb_mmo_id : string = '0';
  cmb_mar_id : string = '0';
  cmb_mod_id : string = '0';
  cmb_mmo_activo : string = '1';
  
  cmb_cov_id : string ='0';
  cmb_cov_activo : string ='1';
  //Fin datos para combo

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
          1: "Vehiculo seleccionado"
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
    this.api.validateSession('vehiculo');
    this.fillTipoVehiculo();
    this.fillMarcamodelo();
    this.fillColor();
    this.loadDataProceso();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  fillTipoVehiculo(){
    const data_post = {
      p_tve_id: this.cmb_tve_id,
      p_tve_activo: this.cmb_tve_activo,
    };
    
    this.api.gettipovehiculosel(data_post).subscribe((data: any) => {
      this.dataTipoVehiculo = data;
    });
  }

  fillMarcamodelo(){
    const data_post = {
      p_mmo_id : this.cmb_mmo_id,
      p_mar_id : this.cmb_mar_id,
      p_mod_id : this.cmb_mod_id,
      p_mmo_activo : this.cmb_mmo_activo,
    };
    
    this.api.getmarcamodvehiculosel(data_post).subscribe((data: any) => {
      this.dataMarcamodelo = data;
    });
  }
  
  fillColor(){
    const data_post = {
      p_cov_id : this.cmb_cov_id,
      p_cov_activo : this.cmb_cov_activo,
    };
    
    this.api.getcolorvehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataColor = data;
    });
  }

  loadDataProceso() {
    const data_post = {
      p_veh_id: this.veh_id,
      p_tve_id: this.tve_id,
      p_mar_id: this.mar_id,
      p_mod_id: this.mod_id,
      p_esv_id: this.esv_id,
      p_cov_id: this.cov_id,
      p_veh_numpla: this.veh_numpla,
      p_mpc_id: this.mpc_id,
      p_mpd_id: this.mpd_id,
      p_veh_activo: this.veh_activo
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
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
      console.log(data);
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
          p_veh_id : parseInt(this.dataanteriorseleccionada[0]),
          p_veh_activo : 0
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
            this.api.getvehiculoact(dataPost).subscribe((data: any) => {
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
    this.tipvehi="";
    this.marcmodel="";
    this.color="";
    this.placa="";
    this.codigo="";
    this.numserie="";
    this.nummotor="";
    this.anyofabr="";
  }

  procesaRegistro(){
    if(this.tipvehi == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un Tipo de vehiculo',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.marcmodel == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una Marca - Modelo',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.color == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un Color',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.placa == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe Ingresar una placa valida',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.codigo == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe ingrsar un código valido',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.numserie == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe ingresar el numero de serie',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.nummotor == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe ingresar el número de motor',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else if(this.anyofabr == ''){
      swal.fire({
        title: 'Error',
        text: 'Debe ingresar el año de fabricación',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
      });
    }
    else{
        const dataPost = {
          p_tve_id : parseInt(this.tipvehi),
          p_mmo_id : parseInt(this.marcmodel),
          p_cov_id : parseInt(this.color),
          p_veh_numpla : this.placa,
          p_veh_codigo : this.codigo,
          p_veh_numser : this.numserie,
          p_veh_nummot : this.nummotor,
          p_veh_anyfab : this.anyofabr,
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
            this.api.getvehiculoins(dataPost).subscribe((data: any) => {
              console.log(dataPost);
              console.log(data);
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
