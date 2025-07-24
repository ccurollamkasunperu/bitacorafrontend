import { Component, TemplateRef, OnInit, Input, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-inventario-monitor',
  templateUrl: './inventario-monitor.component.html',
  styleUrls: ['./inventario-monitor.component.css']
})
export class InventarioMonitorComponent implements OnInit {
modalRef: BsModalRef;

  titulopant : string = "Registrar Ficha"
  icono : string = "pe-7s-next-2"

  dataCamara: any;
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";

  //VARIABLES
    //VARIABLES NO DECLARADAS EN LA BD

    p_rec_id: string = "0";
    p_inv_id: string = "0";
    p_rec_idpadr: string = "0";
    p_tir_id: string = "0";
    p_rpr_id: string = "0";
    p_esr_id: string = "0";
    p_ard_id: string = "0";
    p_mar_id: string = "0";
    p_col_id: string = "0";
    p_rec_codpat: string = "";
    p_sbg_id: string = "0";
    p_sbc_id: string = "0";
    p_sbf_id: string = "0";
    
    p_grupo_id="0";
    p_clase_id="0";
    p_familia_id="0";
    p_tdr_id="0";
    //VARIABLES NO DECLARADAS EN LA BD

    p_sbe_id: string = "0";
    colab_nombre="";
    p_mod_id="0";

    //ARREGLOS PARA LOS VALORES EN SELECT
    dataTipoDocumento: any;
    dataInventario: any;
    dataSedes: any;
    dataAreadenominacion: any;
    dataGrupos: any;
    dataClases: any;
    dataFamilias: any;
    dataEstados: any;
    dataMarcas: any;
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
    this.loadAreadenominacion();
    this.loadGrupos();
    this.loadClases();
    this.loadFamilias();
    this.loadEstados();
    this.loadMarcas();
    this.loadModelo();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, {class: clase});
  }

  onAlmacenamientoSeleccionado(event: { col_id: number, col_nombre: string }) {
    console.log('ID:', event.col_id);
    console.log('Nombre:', event.col_nombre);

    this.p_col_id=event.col_id.toString();
    this.colab_nombre=event.col_nombre;

    this.modalRef.hide();
  }
  
  onVideoSeleccionado(event: { col_id: number, col_nombre: string }) {
    console.log('ID:', event.col_id);
    console.log('Nombre:', event.col_nombre);

    this.p_col_id=event.col_id.toString();
    this.colab_nombre=event.col_nombre;

    this.modalRef.hide();
  }
  
  onRedSeleccionado(event: { col_id: number, col_nombre: string }) {
    console.log('ID:', event.col_id);
    console.log('Nombre:', event.col_nombre);

    this.p_col_id=event.col_id.toString();
    this.colab_nombre=event.col_nombre;

    this.modalRef.hide();
  }
  
  onCancelar(){
    this.modalRef.hide();
  }

  loadGrupos() {
    const data_post = {
      p_sbg_id: 0,
      p_sbg_activo: 1
    };

    this.api.getGruposel(data_post).subscribe((data: any) => {
      this.dataGrupos = data;
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

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  loadClases() {
    const data_post = {
      p_sbc_id: 0,
      p_sbg_id: (this.p_sbg_id == null || this.p_sbg_id === '') ? 0 : parseInt(this.p_sbg_id),
      p_sbc_activo: 1,
    };

    this.api.getClasesel(data_post).subscribe((data: any) => {
      this.dataClases = data;
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

  loadFamilias() {
    const data_post = {
      p_sbf_id: 0,
      p_sbc_id: (this.p_sbc_id == null || this.p_sbc_id === '') ? 0 : parseInt(this.p_sbc_id),
      p_sbf_activo: 1,
    };

    this.api.getFamiliasel(data_post).subscribe((data: any) => {
      this.dataFamilias = data;
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
  
  loadMarcas() {
    const data_post = {
      p_mar_id: 0,
      p_mar_activo: 1
    };

    this.api.getMarcasel(data_post).subscribe((data: any) => {
      this.dataMarcas = data;
    });
  }

  incidenciaIns(){
    this.router.navigate(["/inventario-ins"]);
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
      p_rec_id: (this.p_rec_id == null || this.p_rec_id === '') ? 0 : parseInt(this.p_rec_id) ,
      p_inv_id: (this.p_inv_id == null || this.p_inv_id === '') ? 0 : parseInt(this.p_inv_id) ,
      p_rec_idpadr: (this.p_rec_idpadr == null || this.p_rec_idpadr === '') ? 0 : parseInt(this.p_rec_idpadr) ,
      p_tir_id: (this.p_tir_id == null || this.p_tir_id === '') ? 0 : parseInt(this.p_tir_id) ,
      p_rpr_id: (this.p_rpr_id == null || this.p_rpr_id === '') ? 0 : parseInt(this.p_rpr_id) ,
      p_esr_id: (this.p_esr_id == null || this.p_esr_id === '') ? 0 : parseInt(this.p_esr_id) ,
      p_ard_id: (this.p_ard_id == null || this.p_ard_id === '') ? 0 : parseInt(this.p_ard_id) ,
      p_mar_id: (this.p_mar_id == null || this.p_mar_id === '') ? 0 : parseInt(this.p_mar_id) ,
      p_col_id: (this.p_col_id == null || this.p_col_id === '') ? 0 : parseInt(this.p_col_id) ,
      p_rec_codpat: this.p_rec_codpat,
      p_sbg_id: (this.p_sbg_id == null || this.p_sbg_id === '') ? 0 : parseInt(this.p_sbg_id),
      p_sbc_id: (this.p_sbc_id == null || this.p_sbc_id === '') ? 0 : parseInt(this.p_sbc_id),
      p_sbf_id: (this.p_sbf_id == null || this.p_sbf_id === '') ? 0 : parseInt(this.p_sbf_id)
    };

    this.api.getRecursosel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataInventario = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        // btnExportaExcel.disabled = false;
      } else {
        this.dataInventario = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }
}
