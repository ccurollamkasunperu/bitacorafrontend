import {
  Component,
  TemplateRef,
  OnInit,
  Input,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-incidencia",
  templateUrl: "./incidencia.component.html",
})
export class IncidenciaComponent implements OnInit {
  //Configuraciones Generales
  titulopant: string = "Incidencia";
  icono: string = "pe-7s-refresh-2";

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
  dataMotivo: any;
  dataSector: any;
  dataVehiculo: any;
  dataProceso: any;
  dataCentroCosto: any;
  rowSelected: any;
  dataUnidad: any;
  message = "";
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada: any = [];

  motivoid: string = "";
  sectorid: string = "";
  vehiculoid: string = "";
  telefono: string = "";
  direccion: string = "";
  descrip: string = "";
  x: string = "";
  y: string = "";

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
        } else {
          this.dataanteriorseleccionada = [];
        }
        let btnDetalleProceso = document.getElementById(
          "derivar"
        ) as HTMLButtonElement;
        btnDetalleProceso.disabled = false;
        let btnParte = document.getElementById(
          "registrarParte"
        ) as HTMLButtonElement;
        btnParte.disabled = false;
        let cerrarIncidencia = document.getElementById(
          "cerrarIncidencia"
        ) as HTMLButtonElement;
        cerrarIncidencia.disabled = false;
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
          1: "Parte seleccionada",
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

  //DATOS PARA EL SEL
  p_mpc_descri: string = "0";
  p_mpc_activo: string = "1";
  sec_id: string = "0";
  zon_id: string = "0";
  sec_activo: string = "1";

  veh_id: string = "0";
  tve_id: string = "0";
  mar_id: string = "0";
  mod_id: string = "0";
  esv_id: string = "0";
  cov_id: string = "0";
  veh_numpla: string = "0";
  mpc_id: string = "0";
  mpd_id: string = "0";
  veh_activo: string = "1";

  p_inc_id: string = "0";
  p_usu_id: string = "";
  p_mop_id: string = "";
  p_mpc_id: string = "";
  p_mpd_id: string = "0";
  p_sec_id: string = "";
  p_zon_id: string = "0";
  p_veh_id: string = "";
  p_cec_id: string = "0";
  p_inc_fecini: Date;
  p_inc_fecfin: Date;
  p_inc_activo: string = "1";
  p_zon_id_sel: string = "";
  p_tin_id: string = "";
  p_cam_id: string = "0";
  p_uni_id: string = "";
  dataZona: any;
  dataParteCab: any;
  dataParteMotivo: any;
  //FIN DATOS PARA EL SEL
  p_der_p_cec_id = "";
  dataParteTipo: any;

  p_inc_descri: string = "";
  dataUsuario: any;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent,
    public datepipe: DatePipe
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.api.validateSession("incidencia");
    this.p_inc_fecini = new Date();
    this.p_inc_fecfin = new Date();
    this.loadDataProceso();
    this.fillMotivo();
    this.fillSector();
    this.fillVehiculo();
    this.loadUsuarios();
    this.loadDataCentroCosto();
    this.loadDataZona();
    this.loadDataTipoIncidencia();
    this.loadDataUnidad();
    this.loadDataParteCab();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  grabarDerivacion() {
    const data_post = {
      p_inc_id: this.p_mpc_descri,
      p_cec_id: this.p_mpc_activo,
    };
  }

  incidenciaIns() {
    this.router.navigate(["/incidencia-ins"]);
  }

  cerrarIncidencia() {
    const dataPost = {
      p_inc_id: this.rowSelected[0],
      p_inc_descri: this.p_inc_descri,
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
          this.api.cerrarIncidencia(dataPost).subscribe((data: any) => {
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
                      // this.LimpiarFormulario();
                      document.getElementById("closeModal").click();
                      this.loadDataProceso();
                      this.p_inc_descri = "";
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

  loadDataParteCab() {
    const data_post = {
      p_mpc_descri: "",
      p_mpc_activo: 1,
    };

    this.api.getmotivopartecabsel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteCab = data;
    });
  }

  loadDataParteMotivo() {
    const data_post = {
      p_mop_id: 0,
      p_mpc_id: this.p_mpc_id,
      p_mpd_id: 0,
      p_mop_activo: 1,
    };

    this.api.getmotivopartesel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteMotivo = data;
    });
  }

  loadUsuarios() {
    const data_post = {
      p_usu_id: 0,
      p_usu_appeat: "",
      p_usu_activo: 1,
    };
    console.log(data_post);
    this.api.usuarioSel(data_post).subscribe((data: any) => {
      console.log(data);
      if (data.length != 0) {
        this.dataUsuario = data;
      } else {
        this.dataUsuario = [];
      }
      console.log(data);
    });
  }

  descargaExcel() {
    const pa_inc_id = parseInt(this.p_inc_id);
    const pa_usu_id = parseInt(localStorage.usu_id);
    const pa_mpc_id = this.p_mpc_id == "" ? 0 : parseInt(this.p_mpc_id);
    const pa_mop_id = this.p_mop_id == "" ? 0 : parseInt(this.p_mop_id);
    const pa_sec_id = this.p_sec_id == "" ? 0 : parseInt(this.p_sec_id);
    const pa_veh_id = this.p_veh_id == "" ? 0 : parseInt(this.p_veh_id);
    const pa_cec_id = parseInt(localStorage.getItem("cec_id"));
    const pa_tin_id = this.p_tin_id == "" ? 0 : parseInt(this.p_tin_id);
    const pa_cam_id = parseInt(this.p_cam_id);
    const pa_uni_id = this.p_uni_id == "" ? 0 : parseInt(this.p_uni_id);
    const pa_inc_fecini = this.datepipe.transform(this.p_inc_fecini, "y-MM-dd");
    const pa_inc_fecfin = this.datepipe.transform(this.p_inc_fecfin, "y-MM-dd");


    var url = this.api.reporteIncidencia(pa_inc_id, pa_usu_id, pa_mpc_id, pa_mop_id, pa_sec_id, pa_veh_id, pa_cec_id, pa_tin_id, pa_cam_id, pa_uni_id, pa_inc_fecini, pa_inc_fecfin);
    window.open(url, "_blank");
  }

  fillMotivo() {
    const data_post = {
      p_mpc_descri: this.p_mpc_descri,
      p_mpc_activo: this.p_mpc_activo,
    };

    this.api.getmotivopartecabsel(data_post).subscribe((data: any) => {
      this.dataMotivo = data;
    });
  }

  loadDataTipoIncidencia() {
    const data_post = {
      p_tin_id: 0,
      p_tin_activo: 1,
    };

    this.api.tipoIncidenciaSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteTipo = data;
    });
  }

  fillSector() {
    const data_post = {
      p_sec_id: this.sec_id,
      p_zon_id: this.zon_id,
      p_sec_activo: this.sec_activo,
    };

    this.api.getsectorsel(data_post).subscribe((data: any) => {
      this.dataSector = data;
    });
  }

  loadDataCentroCosto() {
    const data_post = {
      p_cec_id: 0,
      p_cec_activo: 1,
    };

    this.api.centroCostoSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataCentroCosto = data;
    });
  }

  editarIncidencia() {
    this.router.navigate(["/incidencia-upd/" + this.rowSelected[0]]);
  }

  procesaDerivacion() {
    if (this.p_der_p_cec_id == "") {
      swal.fire({
        title: "Error",
        text: "Seleccione una gerencia",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_inc_id: this.rowSelected[0],
        p_cec_id: this.p_der_p_cec_id,
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
            this.api.incidenciaDer(dataPost).subscribe((data: any) => {
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
                        // this.LimpiarFormulario();
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

  fillVehiculo() {
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
      p_veh_activo: this.veh_activo,
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
      this.dataVehiculo = data;
    });
  }

  registrarParte() {
    this.router.navigate(["/parte-ins/" + this.rowSelected[0]]);
  }

  loadDataZona() {
    const data_post = {
      p_zon_id: 0,
      p_zon_activo: 1,
    };

    this.api.getzonasel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataZona = data;
    });
  }

  loadDataUnidad() {
    const data_post = {
      p_uni_id: 0,
      p_uni_activo: 1,
    };

    this.api.unidadSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataUnidad = data;
    });
  }

  loadDataProceso() {
    const data_post = {
      p_inc_id: parseInt(this.p_inc_id),
      p_usu_id: this.p_usu_id == "" ? 0 : parseInt(this.p_usu_id),
      p_mpc_id: this.p_mpc_id == "" ? 0 : parseInt(this.p_mpc_id),
      p_mop_id: this.p_mop_id == "" ? 0 : parseInt(this.p_mop_id),
      p_sec_id: this.p_sec_id == "" ? 0 : parseInt(this.p_sec_id),
      p_veh_id: this.p_veh_id == "" ? 0 : parseInt(this.p_veh_id),
      p_cec_id: parseInt(localStorage.getItem("cec_id")),
      p_tin_id: this.p_tin_id == "" ? 0 : parseInt(this.p_tin_id),
      p_cam_id: parseInt(this.p_cam_id),
      p_uni_id: this.p_uni_id == "" ? 0 : parseInt(this.p_uni_id),
      p_inc_fecini: this.datepipe.transform(this.p_inc_fecini, "y-MM-dd"),
      p_inc_fecfin: this.datepipe.transform(this.p_inc_fecfin, "y-MM-dd"),
      p_inc_activo: parseInt(this.p_inc_activo),
    };
    console.log(data_post);

    this.api.getIncidenciaSel(data_post).subscribe((data: any) => {
      console.log(data);
      // let btnExportaExcel = document.getElementById(
      //   "descargaProceso"
      // ) as HTMLButtonElement;
      if (data.length != 0) {
        this.dataProceso = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        // btnExportaExcel.disabled = false;
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

    this.message = info[0] + " - " + info.firstName;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
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

  anulaMantenimiento() {
    if (this.dataanteriorseleccionada == "") {
      swal.fire({
        title: "Error",
        text: "Debes seleccionar una Incidencia",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_inc_id: parseInt(this.dataanteriorseleccionada[0]),
        p_inc_activo: 0,
      };
      swal
        .fire({
          title: "Mensaje",
          html: "¿Seguro de Anular Registro Seleccionado?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ACEPTAR",
          cancelButtonText: "CANCELAR",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.api.incidenciaAct(dataPost).subscribe((data: any) => {
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

  salir() { }

  LimpiarFormulario() {
    this.motivoid = "";
    this.sectorid = "";
    this.vehiculoid = "";
    this.telefono = "";
    this.x = "";
    this.y = "";
    this.direccion = "";
    this.descrip = "";
  }

  procesaRegistro() {
    if (this.descrip == "") {
      swal.fire({
        title: "Error",
        text: "Debe ingresar una descripción",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_usu_id: parseInt(localStorage.getItem("usu_id")),
        p_mop_id: parseInt(this.motivoid),
        p_sec_id: parseInt(this.sectorid),
        p_veh_id: parseInt(this.vehiculoid),
        p_inc_numtel: parseInt(this.telefono),
        p_inc_ubicax: this.x,
        p_inc_ubicay: this.y,
        p_inc_direcc: this.direccion,
        p_inc_descri: this.descrip,
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
            this.api.getincidenciaIns(dataPost).subscribe((data: any) => {
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
