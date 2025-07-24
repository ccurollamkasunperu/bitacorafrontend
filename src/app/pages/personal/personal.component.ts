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
  selector: 'app-personal',
  templateUrl: './personal.component.html'
})
export class PersonalComponent implements OnInit {

//Variables
color:string='';
descrip: string='';
abrev: string='';
//Fin variables

//Configuraciones Generales
titulopant : string = "Personal"
icono : string = "pe-7s-paint-bucket"
//Fin Configuraciones Generales

//Desde aqui se declara variables el DATATABLES
@ViewChild(DataTableDirective, { static: false })
dtElement: DataTableDirective;
isDtInitialized: boolean = false;
varTmpDisplayCreaReg: string = 'inline-block';
idvisSEL: string = '';

tip_pers : string ="";
tip_docu : string ="";
fb_fecini: Date;
fb_fecfin: Date;
tipoContrib: string = '';
tipoValor: string = '';
tipoSector: string = '';
dataTipoContribuyente: any;
dataTipoValor: any;
dataTipoSector: any;
dataProceso: any;
rowSelected: any;
dataColor: any;
dataTipPersonal: any;
dataTipDocu: any;
message = '';
btnBlockDisabled = true;
numdoc_maxlength: string = '';
numdoc_minlength: string = '';

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
        1: "Color Vehiculo seleccionado"
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
sel_sco_id : string = '0';
sel_sco_activo : string = '1';
//FIN DATOS PARA EL SEL

p_prl_id : string ='0';
p_tip_id : string ='0';
p_prl_apepat : string ="";
p_prl_activo : string ='1';

p_tip_id_sel:string = '0';
p_tip_activo_sel:string = '1';

ndocidenti:string = "";
apepatern:string = "";
apematern:string = "";
nombres:string = "";
direcci:string = "";

modalRef: BsModalRef;

constructor(private router: Router,private modalService: BsModalService, private api: ApiService, private appComponent: AppComponent) {
  this.appComponent.login = false;
}

ngOnInit(){
  this.api.validateSession('personal');
  this.loadDataProceso();
  this.loadTipPersonal();
  this.loadTipDocu();
}

ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}

descargaExcel() {
  let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
  btnExcel.click();
}

loadTipPersonal() {
  const data_post = {
    p_tip_id : this.p_tip_id_sel,
    p_tip_activo : this.p_tip_activo_sel
  };

  this.api.getTipoPersonalSel(data_post).subscribe((data: any) => {
    this.dataTipPersonal = data;
  });
}

loadTipDocu() {
  const data_post = {
    p_tdi_id: 0,
    p_tdi_activo: 1,
  };

  this.api.getTipoDocsel(data_post).subscribe((data: any) => {
    this.dataTipDocu = data;
  });
}
Numdocidenti(){
  if (this.ndocidenti.length < parseInt(this.numdoc_minlength)) {
    swal.fire({
      title: 'Error',
      text: 'Debes ingresar un Número de Documento valido',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
}

ReloadSelectparser() {
  const data_post = {
    p_tdi_id: parseInt(this.tip_docu),
    p_tdi_activo: 1,
  };

  this.api.getTipoDocsel(data_post).subscribe((data: any) => {
    console.log(data);
    this.ndocidenti = "";
    this.numdoc_minlength = data[0].tdi_lonmin;
    this.numdoc_maxlength = data[0].tdi_lonmax;
  });
}

loadDataProceso() {
  const data_post = {
    p_prl_id : this.p_prl_id,
    p_tip_id : this.p_tip_id,
    p_prl_apepat : this.p_prl_apepat,
    p_prl_activo : this.p_prl_activo
  };

  this.api.getpersonalsel(data_post).subscribe((data: any) => {
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
        p_prl_id : parseInt(this.dataanteriorseleccionada[0]),
        p_prl_activo : 0
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
          this.api.getpersonalact(dataPost).subscribe((data: any) => {
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
  this.tip_pers="";
  this.tip_docu="";
  this.ndocidenti="";
  this.apepatern="";
  this.apematern="";
  this.nombres="";
  this.direcci="";
}

restrictNumeric(e) {
  let input;
  if (e.metaKey || e.ctrlKey) {
    return true;
  }
  if (e.which === 32) {
   return false;
  }
  if (e.which === 0) {
   return true;
  }
  if (e.which < 33) {
    return true;
  }
  input = String.fromCharCode(e.which);
  return !!/[\d\s]/.test(input);
}

keyPressLETTERS(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  // Only Numbers 0-9
  if ((charCode < 48 || charCode > 57)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

procesaRegistro(){
  if(this.tip_pers == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe Seleccionar un Tipo Persona',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.tip_docu == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe Seleccionar un Tipo de Documento',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.ndocidenti == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe ingresar una Número de Documento',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.apepatern == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe ingresar un Apellido Paterno',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.apematern == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe ingresar un Apellido Materno',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.nombres == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe ingresar un Nombre',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else if(this.direcci == ''){
    swal.fire({
      title: 'Error',
      text: 'Debe ingresar una dirección válida',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
  }
  else{
    const dataPost = {
      p_tip_id : parseInt(this.tip_pers),
      p_tdi_id : parseInt(this.tip_docu),
      p_prl_numdoi : this.ndocidenti,
      p_prl_apepat : this.apepatern,
      p_prl_apemat : this.apematern,
      p_prl_nombre : this.nombres,
      p_prl_direcc : this.direcci,
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
        this.api.getpersonalins(dataPost).subscribe((data: any) => {
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
