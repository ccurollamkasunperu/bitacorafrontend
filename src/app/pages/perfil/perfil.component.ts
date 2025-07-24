import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import swal from "sweetalert2";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
})
export class PerfilComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  // isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = "inline-block";
  idvisSEL: string = "";

  titulopant: string = "Perfil";
  icono: string = "pe-7s-world";
  rowSelected: any;
  dtTrigger: Subject<any> = new Subject<any>();

  dataPerfil: any;
  modalRef: BsModalRef;
  dataanteriorseleccionada:any=[];

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
          1: "Perfil seleccionado"
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

  p_prf_id: number = 0;
  p_prf_activo: number = 1;

  p_prf_descri: string;
  p_prf_abrevi: string;
  p_prf_nombre: string;
  p_prf_ordene: string;

  constructor(private router: Router,private modalService: BsModalService, private api: ApiService, private appComponent: AppComponent) {
    this.appComponent.login = false; 
   }

  ngOnInit() {
    this.api.validateSession('perfil');
    this.loadData();
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
  loadData() {
    const data_post = {
      p_prf_id: 0,
      p_prf_activo: 1,
    };

    this.api.perfilSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataPerfil = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataPerfil = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
      console.log(data);
    });
  }

  limpiarFormulario() {
    this.p_prf_descri = "";
    this.p_prf_abrevi = "";
    this.p_prf_nombre = "";
  }

  procesaPerfil() {
    if (this.p_prf_descri == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Descripción",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else if (this.p_prf_abrevi == "") {
      swal.fire({
        title: "Error",
        text: "Debe Ingresar Abrevitatura",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_prf_descri: this.p_prf_descri,
        p_prf_abrevi: this.p_prf_abrevi,
        p_prf_nombre: this.p_prf_nombre,
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
            this.api.perfilIns(dataPost).subscribe((data: any) => {
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
