import {
  Component,
  TemplateRef,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
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
  selector: 'app-bitacora-ins',
  templateUrl: './bitacora-ins.component.html',
  styleUrls: ['./bitacora-ins.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class BitacoraInsComponent implements OnInit {  
  modalRef: BsModalRef;

  titulopant : string = "Registro"
  icono : string = "pe-7s-next-2"

  dataCamara: any;
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";

  //VARIABLES
    //VARIABLES DECLARADAS EN LA BD
    p_topiid:string ="0";
    p_userid:string ="0";
    p_numeip:string ='';
    p_asunto:string ='';
    p_observ:string ='';
    p_numcel:string ='';

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
    dataTopic: any;

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
    this.p_userid = '2458' ;
    this.loadTopic();
    this.loadObtenerIp();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
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
      console.log(data);
      this.dataTopic = data;
    });
  }
  
  loadObtenerIp() {
    const data_post = {};

    this.api.getobtenerip(data_post).subscribe((data: any) => {
      this.p_numeip = data.ip;
      console.log(this.p_numeip);
    });
  }

  procesaRegistro(){
    const dataPost = {
      p_topiid:(this.p_topiid == null || this.p_topiid === '') ? 0 : parseInt(this.p_topiid),
      p_userid:(this.p_userid == null || this.p_userid === '') ? 0 : parseInt(this.p_userid),
      p_numeip:this.p_numeip,
      p_asunto:this.p_asunto,
      p_observ:this.p_observ,
      p_numcel:this.p_numcel
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
        this.api.getticketgra(dataPost).subscribe((data: any) => {
          if(data[0].v_error == 0){
            swal.fire({
              title: 'Exito',
              text: data[0].v_mensa.trim(),
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.value) {
                setTimeout(() => {
                  this.router.navigate(["/bitacora"]);
                }, 300);
              }
            });
          }else{
            swal.fire({
                title: 'Error',
                text: data[0].v_mensa.trim(),
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              });
          }
        });
      }
    })
  }
}
