import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
})
export class UsuarioComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = "inline-block";
  idvisSEL: string = "";

  titulopant: string = "Usuario";
  icono: string = "pe-7s-world";
  rowSelected: any;
  dtTrigger: Subject<any> = new Subject<any>();
  dataanteriorseleccionada: any = [];

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
        console.log(this.dataanteriorseleccionada);
        let btnContrasenia = document.getElementById(
          "nuevaContrasenia"
        ) as HTMLButtonElement;
        btnContrasenia.disabled = false;
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
          0: "Seleccione un usuario",
          1: "Usuario seleccionado",
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

  dataUsuario: any;
  modalRef: BsModalRef;
  message = "";

  p_usu_apepat: string;
  p_usu_apemat: string;
  p_usu_nombre: string;
  p_usu_loging: string;
  p_cec_id: string = "";
  p_pfr_id: string = "";

  p_usu_passwd: string;

  dataPerfil: any;
  dataCentroCosto: any;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.loadData();
    this.loadDataPerfil();
    this.loadDataCentroCosto();
  }
  someClickHandler(info: any): void {
    console.log(info);

    this.message = info[0] + " - " + info.firstName;
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  loadDataPerfil() {
    const data_post = {
      p_pfr_id: 0,
      p_prf_id: 0,
      p_rol_id: 0,
      p_pfr_activo: 1,
    };

    this.api.perfilRolSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataPerfil = data;
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

  loadData() {
    const data_post = {
      p_usu_id: 0,
      p_usu_appeat: "",
      p_usu_activo: 1,
    };

    this.api.usuarioSel(data_post).subscribe((data: any) => {
      console.log(data);

      if (data.length != 0) {
        this.dataUsuario = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataUsuario = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
      console.log(data);
    });
  }

  salir() {}

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
        p_usu_id: parseInt(this.dataanteriorseleccionada[0]),
        p_usu_activo: 0,
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
            this.api.usuarioAct(dataPost).subscribe((data: any) => {
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
                        this.loadData();
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

  limpiarFormulario() {
    this.p_usu_apepat = "";
    this.p_usu_apemat = "";
    this.p_usu_nombre = "";
    this.p_usu_loging = "";
    this.p_cec_id = "";
    this.p_pfr_id = "";
  }

  procesarContrasenia() {
    if (this.p_usu_passwd == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Contraseña",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_usu_id: this.rowSelected[0],
        p_usu_passwd: this.p_usu_passwd,
      };
      console.log(dataPost);

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
            this.api.usuarioClaveIns(dataPost).subscribe((data: any) => {
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
                        this.limpiarFormulario();
                        document.getElementById("closeModal").click();
                        this.loadData();
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

  procesaRegistro() {
    if (this.p_usu_apepat == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Apellido Paterno",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_usu_apemat == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Apellido Materno",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_usu_nombre == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Nombre",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_usu_loging == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Login",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_cec_id == "") {
      swal.fire({
        title: "Error",
        text: "Seleccione Centro de Costo",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_pfr_id == "") {
      swal.fire({
        title: "Error",
        text: "Seleccione Perfil",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_usu_apepat: this.p_usu_apepat,
        p_usu_apemat: this.p_usu_apemat,
        p_usu_nombre: this.p_usu_nombre,
        p_usu_loging: this.p_usu_loging,
        p_cec_id: this.p_cec_id,
        p_pfr_id: this.p_pfr_id,
      };
      console.log(dataPost);

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
            this.api.usuarioReg(dataPost).subscribe((data: any) => {
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
                        this.limpiarFormulario();
                        document.getElementById("closeModal").click();
                        this.loadData();
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
