import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Subject } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styles: []
})
export class LoteComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  idvisSEL: string = '';

  fb_fecini: Date;
  fb_fecfin: Date;
  tipoContrib: string = '';
  tipoValor: string = '';
  tipoSector: string = '';
  dataTipoContribuyente: any;
  dataTipoValor: any;
  dataTipoSector: any;
  dataProceso: any;
  rowSelected: any;
  message = '';
  btnBlockDisabled = true;

  anios: any;
  dataanteriorseleccionada:any=[];

  dtTrigger: Subject<any> = new Subject<any>();

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
          1: "Lote seleccionado"
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



  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.api.validateSession('lote');
    let btnDetalleProceso = document.getElementById('detalleProceso') as HTMLButtonElement;
    let btnExportaExcel = document.getElementById('descargaProceso') as HTMLButtonElement;
    btnDetalleProceso.disabled = true;
    btnExportaExcel.disabled = true;

    this.fillTipoContribuyente();
    this.fillTipoValor();
    this.fillTipoSector();
    this.fb_fecini = new Date();
    this.fb_fecfin = new Date();
    this.loadDataProceso();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  someClickHandler(info: any): void {
    console.log(info);

    this.message = info[0] + ' - ' + info.firstName;
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  verDetalleProceso() {
    console.log(this.rowSelected[0]);
    this.router.navigate(['/listado-contrib-lote', this.rowSelected[0]]);
  }

  nuevoProceso() {
    this.router.navigate(['/nuevo-lote']);
  }

  loadDataProceso() {
    const data_post = {
      p_mmo_id : 0,
      p_mar_id : 0,
      p_mod_id : 0,
      p_mmo_activo : 1,
    };

    this.api.getmarcamodvehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      let btnExportaExcel = document.getElementById('descargaProceso') as HTMLButtonElement;
      
      if (data.length != 0) {
        this.dataProceso = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        btnExportaExcel.disabled = false;
      } else {
        this.dataProceso = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });
  }

  anulaRegistro() {
    console.log('Anula registro');
  }

  fillTipoContribuyente() {
    const data_post = {
      p_tipcon: 0,
    };

    this.api.getDataTipoContribuyente(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoContribuyente = data;
    });
  }

  fillTipoValor() {
    const data_post = {
      p_tipval: 0,
    };

    this.api.getDataTipoValor(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoValor = data;
    });
  }

  fillTipoSector() {
    const data_post = {
    };

    this.api.getDataTipoSector(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoSector = data;
    });
  }

}
