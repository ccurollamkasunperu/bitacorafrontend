import { Component, TemplateRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";
import { DatePipe } from '@angular/common'

@Component({
  selector: "app-parte",
  templateUrl: "./parte.component.html",
})
export class ParteComponent implements OnInit {
  //Configuraciones Generales
  titulopant: string = "Parte";
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
  dataProceso: any;
  rowSelected: any;
  message = "";
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada: any = [];

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
        let imprimirParte = document.getElementById(
          "imprimirParte"
        ) as HTMLButtonElement;
        imprimirParte.disabled = false;
        let verImagenes = document.getElementById(
          "verImagenes"
        ) as HTMLButtonElement;
        verImagenes.disabled = false;
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

  //Datos para Sel
  p_par_id: string = "0";
  p_pti_id: string = "";
  p_tur_id: string = "0";
  p_veh_id: string = "";
  p_sec_id: string = "";
  p_zon_id: string = "";
  p_mpc_id: string = "0";
  p_mop_id: string = "0";
  p_prl_id: string = "0";
  p_sup_id: string = "0";
  p_usu_id: string = "0";
  p_par_fecini: Date;
  p_par_fecfin: Date;
  p_par_activo: string = "1";
  //Fin datos para Sel

  dataVehiculo: any;
  dataTipoVehiculo: any;
  dataParteTipo: any;
  dataParteMotivo: any;
  dataSector: any;
  dataParteCab: any;
  dataZona: any;
  print_numero_inc: string;
  print_fecha_inc: string;
  print_tipo_inc: string;
  print_motivo_inc: string;
  print_submotivo_inc: string;
  print_turno_inc: string;
  print_descripcion_inc: string;
  print_vehiculo_inc: string;
  print_sereno_inc: string;
  print_supervisor_inc: string;
  print_tipveh_inc: string;
  print_veh_inc: string;
  print_direccion_inc: string;
  print_sector_inc: string;

  dataImagen: any;

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
    this.loadDataProceso();
    this.api.validateSession("parte");
    this.loadDataVehiculo();
    this.loadDataTipoVehiculo();
    this.loadDataParteTipo();
    this.loadDataSector();
    this.loadDataParteCab();
    this.p_par_fecini = new Date();
    this.p_par_fecfin = new Date();
    this.loadDataZona();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    const pa_par_id = this.p_par_id == "" ? 0 : parseInt(this.p_par_id);
    const pa_pti_id = this.p_pti_id == "" ? 0 : parseInt(this.p_pti_id);
    const pa_tur_id = this.p_tur_id == "" ? 0 : parseInt(this.p_tur_id);
    const pa_veh_id = this.p_veh_id == "" ? 0 : parseInt(this.p_veh_id);

    const pa_zon_id = this.p_zon_id == "" ? 0 : parseInt(this.p_zon_id);
    const pa_mpc_id = this.p_mpc_id == "" ? 0 : parseInt(this.p_mpc_id);
    const pa_mop_id = this.p_mop_id == "" ? 0 : parseInt(this.p_mop_id);
    const pa_prl_id = this.p_prl_id == "" ? 0 : parseInt(this.p_prl_id);
    const pa_sup_id = this.p_sup_id == "" ? 0 : parseInt(this.p_sup_id);
    const pa_usu_id = parseInt(localStorage.getItem("usu_id"));
    const pa_par_fecini = this.datepipe.transform(this.p_par_fecini, 'y-MM-dd');
    const pa_par_fecfin = this.datepipe.transform(this.p_par_fecfin, 'y-MM-dd');
    var url = this.api.reporteParte(pa_par_id, pa_pti_id, pa_tur_id, pa_veh_id, pa_zon_id, pa_mpc_id, pa_mop_id, pa_prl_id, pa_sup_id, pa_usu_id, pa_par_fecini, pa_par_fecfin);
    window.open(url, "_blank");
  }

  parteIns() {
    this.router.navigate(["/parte-ins/0"]);
  }

  btnVerImagenes() {
    const data_post = {
      p_pim_id: 0,
      p_par_id: parseInt(this.rowSelected[0]),
      p_pim_activo: 1,
    };
    this.api.imagenSel(data_post).subscribe((data: any) => {
      console.log(data);
      if (data.length != 0) {
        this.dataImagen = data;
      } else {
        this.dataImagen = [];
      }
    });
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

  loadDataVehiculo() {
    const data_post = {
      p_veh_id: 0,
      p_tve_id: 0,
      p_mar_id: 0,
      p_mod_id: 0,
      p_esv_id: 0,
      p_cov_id: 0,
      p_veh_numpla: "",
      p_veh_activo: 1,
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataVehiculo = data;
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

  btnImprimirParte() {
    const data_post = {
      p_par_id: parseInt(this.rowSelected[0]),
      p_pti_id: 0,
      p_tur_id: 0,
      p_veh_id: 0,
      p_zon_id: 0,
      p_sec_id: 0,
      p_mpc_id: 0,
      p_mop_id: 0,
      p_prl_id: 0,
      p_sup_id: 0,
      p_usu_id: 0,
      p_par_fecini: "",
      p_par_fecfin: "",
      p_par_activo: 1,
    };
    this.api.getDataParteSel(data_post).subscribe((data: any) => {
      console.log(data);
      if (data.length != 0) {
        // this.print_numero_inc = "RONALDO";
        this.print_numero_inc = data[0].par_numero;
        this.print_fecha_inc = data[0].par_fechor;
        this.print_tipo_inc = data[0].pti_descri;
        this.print_turno_inc = data[0].tur_descri;
        this.print_motivo_inc = data[0].mpc_descri;
        this.print_submotivo_inc = data[0].mpa_descri;
        this.print_descripcion_inc = data[0].par_descri;
        this.print_sereno_inc = data[0].prl_nomser;
        this.print_supervisor_inc = data[0].prl_nomsup;
        this.print_sector_inc = data[0].sec_descri;
        this.print_direccion_inc = data[0].par_direcc;
        this.print_vehiculo_inc = data[0].veh_numpla;
        this.print_tipveh_inc = data[0].tve_descri;
      }
    });
  }

  loadDataTipoVehiculo() {
    const data_post = {
      p_tve_id: 0,
      p_tve_activo: 1,
    };

    this.api.gettipovehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoVehiculo = data;
    });
  }

  loadDataParteTipo() {
    const data_post = {
      p_pti_id: 0,
      p_pti_activo: 1,
    };

    this.api.getpartetiposel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteTipo = data;
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

  loadDataSector() {
    const data_post = {
      p_sec_id: 0,
      p_zon_id: 0,
      p_sec_activo: 1,
    };

    this.api.getsectorsel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataSector = data;
    });
  }



  loadDataProceso() {
    const data_post = {
      p_par_id: this.p_par_id == "" ? 0 : parseInt(this.p_par_id),
      p_pti_id: this.p_pti_id == "" ? 0 : parseInt(this.p_pti_id),
      p_tur_id: this.p_tur_id == "" ? 0 : parseInt(this.p_tur_id),
      p_veh_id: this.p_veh_id == "" ? 0 : parseInt(this.p_veh_id),
      p_sec_id: this.p_sec_id == "" ? 0 : parseInt(this.p_sec_id),
      p_zon_id: this.p_zon_id == "" ? 0 : parseInt(this.p_zon_id),
      p_mpc_id: this.p_mpc_id == "" ? 0 : parseInt(this.p_mpc_id),
      p_mop_id: this.p_mop_id == "" ? 0 : parseInt(this.p_mop_id),
      p_prl_id: this.p_prl_id == "" ? 0 : parseInt(this.p_prl_id),
      p_sup_id: this.p_sup_id == "" ? 0 : parseInt(this.p_sup_id),
      p_usu_id: parseInt(localStorage.getItem("usu_id")),
      p_par_fecini: this.datepipe.transform(this.p_par_fecini, 'y-MM-dd'),
      p_par_fecfin: this.datepipe.transform(this.p_par_fecfin, 'y-MM-dd'),
      p_par_activo: this.p_par_activo,
    };

    console.log(data_post);
    this.api.getDataParteSel(data_post).subscribe((data: any) => {

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
        text: "Debes seleccionar un Proceso a anular",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_par_id: parseInt(this.dataanteriorseleccionada[0]),
        p_par_activo: 0,
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
            this.api.getparteact(dataPost).subscribe((data: any) => {
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

  LimpiarFormulario() { }

  procesaRegistro() { }
}
