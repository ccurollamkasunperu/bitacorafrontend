import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import swal from "sweetalert2";
import { AppComponent } from '../../app.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: "app-perfil-rol",
  templateUrl: "./perfil-rol.component.html",
})
export class PerfilRolComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = "inline-block";
  idvisSEL: string = "";

  titulopant: string = "Perfil-Rol";
  icono: string = "pe-7s-world";
  rowSelected: any;
  dtTrigger: Subject<any> = new Subject<any>();

  dataPerfilRol: any;
  modalRef: BsModalRef;

  dataPerfil: any;
  dataRol: any;

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
        // let btnContrasenia = document.getElementById(
        //   "nuevaContrasenia"
        // ) as HTMLButtonElement;
        // btnContrasenia.disabled = false;
        this.rowSelected = data;
        // console.log(this.rowSelected[0]);
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
          _: "Selected %d rows",
          0: "Seleccione un Perfil",
          1: "Perfil seleccionado",
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

  p_pfr_id: number = 0;
  p_prf_id: number = 0;
  p_rol_id: number = 0;
  p_pfr_activo: number = 1;

  param_prf_id: string = "";
  param_rol_id: string = "";

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService , 
    private appComponent: AppComponent,
    fb: FormBuilder) {
    this.appComponent.login = false; 
  }

  ngOnInit() {
    this.loadData();
    this.loadDataPerfil();
    this.loadDataRol();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  loadDataPerfil() {
    const data_post = {
      p_prf_id: 0,
      p_prf_activo: 1,
    };

    this.api.perfilSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataPerfil = data;
    });
  }
  
  limpiarFormulario(){
    this.param_prf_id="";
    this.param_rol_id="";
  }

  procesaPerfilRol() {
    if (this.param_prf_id == "") {
      swal.fire({
        title: "Error",
        text: "Debe Seleccionar Perfil",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.param_rol_id == "") {
      swal.fire({
        title: "Error",
        text: "Debe Seleccionar Rol",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {

      const dataPost = {
        p_prf_id: this.param_prf_id,
        p_rol_id: this.param_rol_id,
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
            this.api.perfilRolIns(dataPost).subscribe((data: any) => {
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
                      }, 500);
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

  loadDataRol() {
    const data_post = {
      p_rol_id: 0,
      p_rol_activo: 1,
    };

    this.api.usuarioRolSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataRol = data;
    });
  }

  loadData() {
    const data_post = {
      p_pfr_id: this.p_pfr_id,
      p_prf_id: this.p_prf_id,
      p_rol_id: this.p_rol_id,
      p_pfr_activo: this.p_pfr_activo,
    };

    this.api.perfilRolSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataPerfilRol = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataPerfilRol = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
      console.log(data);
    });
  }
}
