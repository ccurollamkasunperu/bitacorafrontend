import { Component, OnInit, ViewChild, ElementRef , TemplateRef,EventEmitter,Input,Output } from '@angular/core';

import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Component({
  selector: 'app-modal-recurso',
  templateUrl: './modal-recurso.component.html',
  styleUrls: ['./modal-recurso.component.css']
})
export class ModalRecursoComponent implements OnInit {
  titulopant : string = "Recurso"
  icono : string = "pe-7s-next-2"

  //VARIABLES
    p_tdi_id: string = "0";
    p_col_numdoi: string = "";
    p_tge_id: string = "0";
    p_col_apepat: string = "";
    p_col_apemat: string = "";
    
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
    p_sbg_id: string = "";
    p_sbc_id: string = "";
    p_sbf_id: string = "";
    //ARREGLOS PARA LOS VALORES EN SELECT
    dataRecurso: any;

    dataTipoRecurso:any;
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
    columnDefs: [
      { targets: 0, width: "100px" },
      { targets: 1, width: "100px" },
      { targets: 2, width: "10px" },
      { targets: 3, width: "5px" },
    ],
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
          1: "Recurso seleccionado",
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

  @Input() inputPersona : any;
  @Output() confirmClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() seleccionarRecurso = new EventEmitter<{ rec_id: number, rec_codigo: string}>();

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadTipoRecurso();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
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
        this.dataRecurso = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        // btnExportaExcel.disabled = false;
      } else {
        this.dataRecurso = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

  SeleccionarRecurso(rec_id: number, rec_codigo: string) {
    this.seleccionarRecurso.emit({ rec_id, rec_codigo });
  }

  onCancelar(){
    this.cancelClicked.emit();
  }

}
