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

@Component({
  selector: 'app-inventario-ins',
  templateUrl: './inventario-ins.component.html',
  styleUrls: ['./inventario-ins.component.css']
})
export class InventarioInsComponent implements OnInit {  
  modalRef: BsModalRef;

  titulopant : string = "Inventario"
  icono : string = "pe-7s-next-2"

  dataCamara: any;
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";

  //VARIABLES
    //VARIABLES DECLARADAS EN LA BD
    p_rec_id:string ="0";
    p_rec_idpadr:string ="0";
    p_tir_id:string ="0";
    p_rpr_id:string ="0";
    p_esr_id:string ="0";
    p_ard_id:string ="0";
    p_mar_id:string ="0";
    p_mod_id:string ="0";
    p_col_id:string ="0";
    p_rec_codpat:string ="";
    p_rec_nombre:string ="";
    p_rec_numser:string ="";
    p_rec_colors:string ="";
    p_rec_observ:string ="";
    p_usu_id:string ="1";
    //FIN VARIABLES DECLARADAS EN LA BD

    //VARIABLES NO DECLARADAS EN LA BD
    p_grupo_id="0";
    p_clase_id="0";
    p_familia_id="0";
    p_tdr_id="0";
    colab_nombre="";    
    p_sbe_id: string = "0";
    rec_id:string = "";
    descripcodigo:string = "";
    rec_nombre:string = "";
    //FIN VARIABLES NO DECLARADAS EN LA BD

    //ARREGLOS PARA LOS VALORES EN SELECT
    dataTipoDocumento: any;
    dataSedes: any;
    dataGrupos: any;
    dataClases: any;
    dataFamilias: any;
    
    dataEstados: any;
    dataMarcas: any;
    dataPropiedad: any;
    dataAreadenominacion: any;
    dataTipoRecurso: any;
    dataModelo: any;
    //FIN PARA LOS ARREGLOS DE LOS VALORES EN SELECT
    
  //FIN VARIABLES

  //INICIO DATATABLES
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  rowSelected : any;
  dataanteriorseleccionada : any;

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
        let anular = document.getElementById('anular') as HTMLButtonElement;
        anular.disabled = false;
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
          1: "Marca Modelo seleccionado",
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
  //FIN DATATABLES

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadData();
    this.loadPropiedad();
    this.loadAreadenominacion();
    this.loadTipoRecurso();
    this.loadMarcas();
    this.loadModelo();
    this.loadEstados();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }
  
  onColaboradorSeleccionado(event: { col_id: number, col_nombre: string }) {
    console.log('ID:', event.col_id);
    console.log('Nombre:', event.col_nombre);

    this.p_col_id=event.col_id.toString();
    this.colab_nombre=event.col_nombre;

    this.modalRef.hide();
  }
  
  onRecursoSeleccionado(event: { rec_id: number, rec_codigo: string }) {
    console.log('ID:', event.rec_id);
    console.log('Tipo descripción:', event.rec_codigo);

    this.p_rec_idpadr = event.rec_id.toString();
    this.descripcodigo= event.rec_codigo.toString();
    
    this.modalRef.hide();
  }
  
  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, {class: clase});
  }

  loadPropiedad() {
    const data_post = {
      p_rpr_id: 0,
      p_rpr_activo: 1
    };

    this.api.getRecursopropiedadsel(data_post).subscribe((data: any) => {
      this.dataPropiedad = data;
    });
  }
  
  loadAreadenominacion() {
    const data_post = {
      p_ard_id: 0,
      p_acl_id: 0,
      p_ard_activo: 1
    };

    this.api.getDataAreadenominacionsel(data_post).subscribe((data: any) => {
      this.dataAreadenominacion = data;
    });
  }
  
  loadTipoRecurso() {
    const data_post = {
      p_tir_id: 0,
      p_tir_activo: 1
    };

    this.api.getTiporecursosel(data_post).subscribe((data: any) => {
      this.dataTipoRecurso = data;
    });
  }

  loadMarcas() {
    const data_post = {
      p_mar_id: 0,
      p_mar_activo: 1
    };

    this.api.getMarcasel(data_post).subscribe((data: any) => {
      this.dataMarcas = data;
    });
  }
  
  loadModelo() {
    const data_post = {
      p_mod_id: 0,
      p_mod_activo: 1
    };

    this.api.getModelosel(data_post).subscribe((data: any) => {
      this.dataModelo = data;
    });
  }

  loadEstados() {
    const data_post = {
      p_sbe_id: 0,
      p_sbe_activo: 1
    };

    this.api.getEstadossel(data_post).subscribe((data: any) => {
      this.dataEstados = data;
    });
  }

  anular() {
    if (this.dataanteriorseleccionada == "") {
      swal.fire({
        title: "Error",
        text: "Debes seleccionar una Cámara a anular",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      const dataPost = {
        p_cam_id: parseInt(this.dataanteriorseleccionada[0]),
        p_cam_activo: 0,
      };
      console.log(dataPost);
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
            this.api.camaraAct(dataPost).subscribe((data: any) => {
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

  loadData() {
    const data_post = {
      p_cam_id: parseInt(this.p_cam_id),
      p_cae_id: parseInt(this.p_cae_id),
      p_cae_activo: parseInt(this.p_cae_activo),
    };

    // console.log(data_post);
    this.api.camaraSel(data_post).subscribe((data: any) => {
      // let btnExportaExcel = document.getElementById(
      //   "descargaProceso"
      // ) as HTMLButtonElement;

      if (data.length != 0) {
        this.dataCamara = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        // btnExportaExcel.disabled = false;
      } else {
        this.dataCamara = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

  procesaRegistro(){
    const dataPost = {
      p_rec_id:(this.p_rec_id == null || this.p_rec_id === '') ? 0 : parseInt(this.p_rec_id),
      p_rec_idpadr:(this.p_rec_idpadr == null || this.p_rec_idpadr === '') ? 0 : parseInt(this.p_rec_idpadr),
      p_tir_id:(this.p_tir_id == null || this.p_tir_id === '') ? 0 : parseInt(this.p_tir_id),
      p_rpr_id:(this.p_rpr_id == null || this.p_rpr_id === '') ? 0 : parseInt(this.p_rpr_id),
      p_esr_id:(this.p_esr_id == null || this.p_esr_id === '') ? 0 : parseInt(this.p_esr_id),
      p_ard_id:(this.p_ard_id == null || this.p_ard_id === '') ? 0 : parseInt(this.p_ard_id),
      p_mar_id:(this.p_mar_id == null || this.p_mar_id === '') ? 0 : parseInt(this.p_mar_id),
      p_mod_id:(this.p_mod_id == null || this.p_mod_id === '') ? 0 : parseInt(this.p_mod_id),
      p_col_id:(this.p_col_id == null || this.p_col_id === '') ? 0 : parseInt(this.p_col_id),
      p_rec_codpat:this.p_rec_codpat,
      p_rec_nombre:this.p_rec_nombre,
      p_rec_numser:this.p_rec_numser,
      p_rec_colors:this.p_rec_colors,
      p_rec_observ:this.p_rec_observ,
      p_usu_id:(this.p_usu_id == null || this.p_usu_id === '') ? 0 : parseInt(this.p_usu_id)
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
        this.api.getRecursoreg(dataPost).subscribe((data: any) => {
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
                  this.router.navigate(["/inventario"]);
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

  onCancelar(){
    this.modalRef.hide();
  }
}
