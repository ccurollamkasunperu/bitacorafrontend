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
  selector: 'app-patrimonio',
  templateUrl: './patrimonio.component.html',
  styleUrls: ['./patrimonio.component.css']
})
export class PatrimonioComponent implements OnInit {
  //VARIABLE TITULO
  titulopant : string = "Patrimonio"
  icono : string = "pe-7s-next-2"
  //FIN VARIABLE TITULO

  dataCamara: any;
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";
  
  //VARIABLES
    //VARIABLES NO DECLARADAS EN LA BD
    p_grupo_id="0";
    p_clase_id="0";
    p_familia_id="0";
    p_tdr_id="0";
    //VARIABLES NO DECLARADAS EN LA BD

  p_inv_id: string = "0";
  p_col_id: string = "0";
  p_ubi_id: string = "0";
  p_sed_id: string = "0";
  p_ard_id: string = "0";
  p_sbe_id: string = "0";
  p_mar_id: string = "0";
  p_inv_codsbn:string = "";
  p_inv_codgru:string = "";
  p_inv_codcla:string = "";
  p_inv_codfam:string = "";

    //ARREGLOS PARA LOS VALORES EN SELECT
    dataTipoDocumento: any;
    dataSedes: any;
    dataAreadenominacion: any;
    dataGrupos: any;
    dataClases: any;
    dataFamilias: any;
    dataEstados: any;
    dataMarcas: any;
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
    this.loadTipoDocumento();
    this.loadSedes();
    this.loadAreadenominacion();
    this.loadGrupos();
    this.loadClases();
    this.loadFamilias();
    this.loadEstados();
    this.loadMarcas();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
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

  loadTipoDocumento() {
    const data_post = {
      p_tdi_id: 0,
      p_tpe_id: 1
    };

    this.api.getDataTipodocidesel(data_post).subscribe((data: any) => {
      this.dataTipoDocumento = data;
    });
  }

  loadSedes() {
    const data_post = {
      p_sed_id: 0,
      p_sed_activo: 1
    };

    this.api.getDataSedessel(data_post).subscribe((data: any) => {
      this.dataSedes = data;
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
  
  loadGrupos() {
    const data_post = {
      p_sbg_id: 0,
      p_sbg_activo: 1
    };

    this.api.getGruposel(data_post).subscribe((data: any) => {
      this.dataGrupos = data;
    });
  }
  
  loadClases() {
    const data_post = {
      p_sbc_id: 0,
      p_sbg_id: 0,
      p_sbc_activo: 1,
    };

    this.api.getClasesel(data_post).subscribe((data: any) => {
      this.dataClases = data;
    });
  }
  
  loadFamilias() {
    const data_post = {
      p_sbf_id: 0,
      p_sbc_id: 0,
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

}
