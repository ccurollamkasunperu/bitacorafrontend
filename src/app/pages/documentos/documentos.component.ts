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
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})

export class DocumentosComponent implements OnInit {
  titulopant : string = "Documentos"
  icono : string = "pe-7s-next-2"
  
  cdu_id:string= '0';
  tdr_id:string= '0';
  nudore:string= '';
  fecini:string= '';
  fecfin:string= '';
  nuexre:string= '';
  bit_id:string= '0';
  tdo_id:string= '0';
  nudoor:string= '0';
  uor_id:string= '0';
  ten_id:string= '0';
  activo:string= '1';

  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  rowSelected : any;
  dataanteriorseleccionada : any;
  
  dataDocumentos: any;
  dataTipoDocumento : any;
  dataUnidadOrganizativa : any;
  p_tidoid: string = "0";
  p_coduor: string = "0";
  p_est_id: string = "1";
  
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: "full_numbers",
    pageLength: 10,
    dom: "Bfrtip",
    buttons: ["excel"],
    select: true,
    responsive: true,
    autoWidth: false,
    searching: true,
    columnDefs: [
      { width: "30px", targets: 0 },
      { width: "50px", targets: 1 },
      { width: "70px", targets: 2 },
      { width: "50px", targets: 3 },
      { width: "220px", targets: 4 },
      { width: "50px", targets: 5 },
      { width: "50px", targets: 6 },
    ],
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
        let anular = document.getElementById('anular') as HTMLButtonElement;
        anular.disabled = false;
      });
      return row;
    },
    language: {
      processing: "Procesando...",
      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ elementos",
      info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
      infoEmpty: "Mostrando ningún elemento.",
      infoFiltered: "(filtrado _MAX_ elementos total)",
      loadingRecords: "Cargando registros...",
      zeroRecords: "No se encontraron registros",
      emptyTable: "No hay datos disponibles en la tabla",
      select: {
        rows: {
          _: "%d filas seleccionadas",
          0: "Haga clic en una fila para seleccionarla",
          1: "Documento seleccionado",
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

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadDataProceso();
    this.loadTipoDocumento();
    this.loadUnidadOrganizativa();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  incidenciaIns() {
    this.router.navigate(["/documentos-ins"]);
  }

  loadTipoDocumento() {
    const data_post = {
      p_tdr_id: 0
    };

    this.api.Tipocontroldocumentosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoDocumento = data;
    });
  }

  editarDocumento(id:number){
    this.router.navigate(['/documentos-ins',id], { queryParams: { 
      act: 'edit'
    } }); 
  }
  
  loadUnidadOrganizativa() {
    const data_post = {
      p_codzon: "04"
    };

    this.api.Unidadorganizativasel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataUnidadOrganizativa = data;
    });
  }

  loadDataProceso() {
    const data_post = {
      p_cdu_id: parseInt(this.cdu_id),
      p_tdr_id: parseInt(this.tdr_id),
      p_nudore: parseInt(this.nudore),
      p_fecini: this.fecini,
      p_fecfin: this.fecfin,
      p_nuexre: this.nuexre,
      p_bit_id: parseInt(this.bit_id),
      p_tdo_id: parseInt(this.tdo_id),
      p_nudoor: parseInt(this.nudoor),
      p_uor_id: parseInt(this.uor_id),
      p_ten_id: parseInt(this.ten_id),
      p_activo: parseInt(this.activo),
    };
  
    this.api.Controldocumentoutsel(data_post).subscribe((data: any) => {
      console.log("Datos recibidos:", data);
    
      if (Array.isArray(data) && data.length > 0) {
        this.dataDocumentos = [...data];     
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataDocumentos = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw();
        });
      }
    });
  }
  

}
