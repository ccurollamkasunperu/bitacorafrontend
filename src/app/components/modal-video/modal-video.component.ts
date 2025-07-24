import { Component, OnInit, ViewChild, ElementRef , TemplateRef,EventEmitter,Input,Output } from '@angular/core';

import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.css']
})
export class ModalVideoComponent implements OnInit {
  
  //VARIABLES
    p_col_id: string = "0";
    p_tdi_id: string = "0";
    p_col_numdoi: string = "";
    p_tge_id: string = "0";
    p_ard_id: string = "0";
    p_col_apepat: string = "";
    p_col_apemat: string = "";

    p_cnt_id: string = "0";
    p_cvt_id: string = "0";
    p_mar_id: string = "0";
    p_mod_id: string = "0";
    p_ume_id: string = "0";
    p_esr_id: string = "0";
    //ARREGLOS PARA LOS VALORES EN SELECT
    dataTipoDocumento: any;
    dataColaboradores: any;
    dataConector: any;
    dataTipoConector: any;
    dataMarcas: any;
    dataModelo: any;
    dataUnidadMedida: any;
    dataEstados: any;
    //FIN PARA LOS ARREGLOS DE LOS VALORES EN SELECT
  //FIN VARIABLES

  @ViewChild('contenidoDiv', { static: false }) contenidoDiv!: ElementRef;

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

  @Input() inputPersona : any;;
  @Output() confirmClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() seleccionarColaborador = new EventEmitter<{ col_id: number, col_nombre: string }>();

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    //this.loadData();
    this.loadTipoDocumento();
    this.loadConector();
    this.loadTipoConector();
    this.loadMarcas();
    this.loadModelo();
    this.loadUnidadMedida();
    this.loadEstados();
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

  loadEstados() {
    const data_post = {
      p_sbe_id: 0,
      p_sbe_activo: 1
    };

    this.api.getEstadossel(data_post).subscribe((data: any) => {
      this.dataEstados = data;
    });
  }

  loadUnidadMedida() {
    const data_post = {
      p_ume_id: 0,
      p_cum_id: 3,
      p_umb_id: 0,
      p_ume_activo: 1
    };

    this.api.getunidadmedidasel(data_post).subscribe((data: any) => {
      this.dataUnidadMedida = data;
    });
  }
  
  loadConector() {
    const data_post = {
      p_cnt_id: 0,
      p_cnt_activo: 1
    };

    this.api.getconectorsel(data_post).subscribe((data: any) => {
      this.dataConector = data;
    });
  }
  
  loadTipoConector() {
    const data_post = {
      p_cvt_id: 0,
      p_cvt_activo: 1
    };

    this.api.getconectorvideotiposel(data_post).subscribe((data: any) => {
      this.dataTipoConector = data;
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

  loadTipoDocumento() {
    const data_post = {
      p_tdi_id: 0,
      p_tpe_id: 1
    };

    this.api.getDataTipodocidesel(data_post).subscribe((data: any) => {
      this.dataTipoDocumento = data;
    });
  }

  loadData() {
    const data_post = {
      p_col_id: parseInt(this.p_col_id),
      p_tdi_id: parseInt(this.p_tdi_id),
      p_col_numdoi: this.p_col_numdoi,
      p_tge_id: parseInt(this.p_tge_id),
      p_ard_id: parseInt(this.p_ard_id),
      p_col_apepat: this.p_col_apepat,
      p_col_apemat: this.p_col_apemat
    };

    this.api.getColaboradorSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataColaboradores = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        // btnExportaExcel.disabled = false;
      } else {
        this.dataColaboradores = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

  SeleccionarColaborador(col_id: number, col_nombre: string) {
    this.seleccionarColaborador.emit({ col_id, col_nombre });
  }

  onCancelar(){
    this.cancelClicked.emit();
  }
}
