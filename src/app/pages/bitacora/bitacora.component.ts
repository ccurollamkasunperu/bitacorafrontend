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
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})

export class BitacoraComponent implements OnInit {
  //VARIABLE TITULO
  titulopant : string = "Bitacora"
  icono : string = "pe-7s-next-2"
  //FIN VARIABLE TITULO

  dataTicket: any;
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";
  
  //VARIABLES
    //VARIABLES NO DECLARADAS EN LA BD
    p_grupo_id="0";
    p_clase_id="0";
    p_familia_id="0";
    p_tdr_id="0";

    p_numtkt:string = '';
    p_teamid:string = '0';
    p_stafid:string = '0';
    p_topiid:string = '0';
    p_userid:string = '0';
    p_statid:string = '0';
    p_fecini:string = '';
    p_fecfin:string = '';
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
    dataTeam: any;
    dataStaff: any;
    dataTopic: any;
    dataUsuario: any;
    dataTicketEstados: any;

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
    autoWidth: false,
    searching: true,
    columnDefs: [
      { width: "90px", targets: 0 },
      { width: "50px", targets: 1 },
      { width: "120px", targets: 2 },
      { width: "190px", targets: 3 },
      { width: "40px", targets: 4 }
    ],
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
    const hoy = new Date();
    const fechaformato = hoy.toISOString().substring(0, 10);
    
    this.p_fecini = fechaformato;
    this.p_fecfin = fechaformato;
    this.p_userid = '2458';

    this.loadData();
    this.loadTeam();
    this.loadTopic();
    this.loadUsuario();
    this.loadTicketEstados();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
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

  loadTeam() {
    const data_post = {
      p_teamid: 0,
    };

    this.api.getteamsel(data_post).subscribe((data: any) => {
      this.dataTeam = data;
    });
  }
  
  loadStaffsel() {
    const data_post = {
      p_stafid: 0,
      p_teamid: (this.p_teamid == null || this.p_teamid === '') ? 0 : parseInt(this.p_teamid),
      p_activo: 1,
      p_admins: 9,
    };

    this.api.getstaffsel(data_post).subscribe((data: any) => {
      this.dataStaff = data;
    });
  }
  
  loadTopic() {
    const data_post = {
      p_topiid: 0,
      p_toppid: 0,
      p_teamid: 0,
      p_stafid: 0,
      p_isbita: 0,
    };

    this.api.gettopicsel(data_post).subscribe((data: any) => {
      this.dataTopic = data;
    });
  }
  
  loadTicketEstados() {
    const data_post = {
      p_statid: 0
    };

    this.api.getticketstatussel(data_post).subscribe((data: any) => {
      this.dataTicketEstados = data;
    });
  }
  
  loadUsuario() {
    const data_post = {
      p_userid: 0
    };

    this.api.getusersel(data_post).subscribe((data: any) => {
      this.dataUsuario = data;
    });
  }
  
  loadArea() {
    const data_post = {
      p_userid: 0
    };

    this.api.getusersel(data_post).subscribe((data: any) => {
      this.dataUsuario = data;
    });
  }

  loadData() {
    const data_post = {
      p_numtkt: (this.p_numtkt == null || this.p_numtkt === '') ? 0 : parseInt(this.p_numtkt),
      p_teamid: (this.p_teamid == null || this.p_teamid === '') ? 0 : parseInt(this.p_teamid),
      p_stafid: (this.p_stafid == null || this.p_stafid === '') ? 0 : parseInt(this.p_stafid),
      p_topiid: (this.p_topiid == null || this.p_topiid === '') ? 0 : parseInt(this.p_topiid),
      p_userid: (this.p_userid == null || this.p_userid === '') ? 0 : parseInt(this.p_userid),
      p_statid: (this.p_statid == null || this.p_statid === '') ? 0 : parseInt(this.p_statid),
      p_fecini: this.p_fecini,
      p_fecfin: this.p_fecfin,
    };

    this.api.getticketsel(data_post).subscribe((data: any) => {

      if (data.length != 0) {
        this.dataTicket = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataTicket = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

}
