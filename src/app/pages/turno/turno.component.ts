import {
  Component,
  TemplateRef,
  OnInit,
  Input,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-turno",
  templateUrl: "./turno.component.html",
})
export class TurnoComponent implements OnInit {
  //Variables
  horini: string = "";
  horfin: string = "";
  abrev: string = "";
  //Fin Variables
  //Configuraciones Generales
  titulopant: string = "Turno";
  icono: string = "pe-7s-clock";
  //Fin Configuraciones Generales

  //Desde aqui se declara variables el DATATABLES
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = "inline-block";
  idvisSEL: string = "";

  fb_fecini: Date;
  fb_fecfin: Date;
  tipoContrib: string = "";
  tipoValor: string = "";
  tipoSector: string = "";
  dataTipoContribuyente: any;
  dataTipoValor: any;
  dataTipoSector: any;
  dataProceso: any;
  rowSelected: any;
  message = "";
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada:any=[];

  tur_id: string = "0";
  tur_activo: string = "1";

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
          1: "Turno seleccionado",
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
    private api: ApiService,
     private appComponent: AppComponent
  ) {
    this.appComponent.login = false; 
  }

  ngOnInit() {
    this.api.validateSession('turno');
    this.loadDataProceso();
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
      p_tur_id: this.tur_id,
      p_tur_activo: this.tur_activo,
    };

    this.api.getturnosel(data_post).subscribe((data: any) => {
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
      console.log(data);
    });
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

  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, { class: clase });
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
          p_tur_id : parseInt(this.dataanteriorseleccionada[0]),
          p_tur_activo : 0
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
            this.api.getturnoact(dataPost).subscribe((data: any) => {
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

  LimpiarFormulario(){
    this.horini="";
    this.horfin="";
    this.abrev="";
  }

  procesaRegistro() {
    if (this.horini == "") {
      swal.fire({
        title: "Error",
        text: "Debe seleccionar un Motivo",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.horfin == "") {
      swal.fire({
        title: "Error",
        text: "Debe seleccionar un Motivo",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.abrev == "") {
      swal.fire({
        title: "Error",
        text: "Debe seleccionar un Motivo",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_tur_horini: this.horini,
        p_tur_horfin: this.horfin,
        p_tur_abrevi: this.abrev,
      };

      swal
        .fire({
          title: "Mensaje",
          html: "¿Seguro de Guardar Datos?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ACEPTAR",
          cancelButtonText: "CANCELAR",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api.getturnoins(dataPost).subscribe((data: any) => {
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
                        this.loadDataProceso();
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
        });
    }
  }
}
