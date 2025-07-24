/// <reference types="@types/google.maps" />
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ApiService } from "src/app/services/api.service";
import { AppComponent } from "../../app.component";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { AnonymousSubject } from "rxjs/internal/Subject";

@Component({
  selector: 'app-documento-ins',
  templateUrl: './documento-ins.component.html',
  styleUrls: ['./documento-ins.component.css']
})
export class DocumentoInsComponent implements OnInit {
  titulopant: string = "Registro de Documento";
  icono: string = "pe-7s-refresh-2";

  p_tidoid: string = "0";

  dataMotivo: any;
  dataTipoDocumento: any;
  dataTipoenvio: any;

  cdu_id:string='0';
  tdr_id:string='0';
  cdu_nudore:string="";
  cdu_fedore:string="";
  cdu_nuexre:string="";
  bit_id:number=30;
  cdu_asures:string="";
  uor_id:string='0';
  ten_id:string='0';
  tdo_id:string='0';
  cdu_nudoor:string="";
  cdu_fedoor:string="";
  cdu_imgenv:string="";
  cdu_fencor:string="";
  cdu_usumov:string="";
  act: string | null = null;

  disabled_inputs:boolean=false;
  
  dataUnidadOrganizativa : any;
  p_coduor: string = "0";

  files: File[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private appComponent: AppComponent,
    private route: ActivatedRoute
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cdu_id = params.get('id');
    });

    this.route.queryParams.subscribe(params => {
      this.act = params['act'];
    });

    if (parseInt(this.cdu_id) == 0 || this.cdu_id == null) {
      this.cdu_id = '0';
    }else{
      this.loadData();
      this.disabled_inputs=true;

      if (this.act == "edit") {
        this.disabled_inputs=false;
      }else{
        this.disabled_inputs=true;
      }
    }

    this.loadTipoDocumento();
    this.loadUnidadOrganizativa();
    this.loadTipoEnvio();
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  loadTipoDocumento() {
    const data_post = {
      p_tdr_id: 0
    };

    this.api.Tipocontroldocumentosel(data_post).subscribe((data: any) => {
      this.dataTipoDocumento = data;
    });
  }

  loadUnidadOrganizativa() {
    const data_post = {
      p_codzon: "04"
    };

    this.api.Unidadorganizativasel(data_post).subscribe((data: any) => {
      this.dataUnidadOrganizativa = data;
    });
  }
  
  loadTipoEnvio() {
    const data_post = {
      p_tdr_id: 0
    };

    this.api.Entregacontroldocumentosel(data_post).subscribe((data: any) => {
      this.dataTipoenvio = data;
    });
  }

  Regresar(){
    this.router.navigate(["/documentos"]);
  }

  procesaRegistro() {
      var formData = new FormData();
      formData.append("p_cdu_id", String(this.cdu_id));
      formData.append("p_tdr_id", this.tdr_id);
      formData.append("p_cdu_nudore", this.cdu_nudore);
      formData.append("p_cdu_fedore", this.cdu_fedore);
      formData.append("p_cdu_nuexre", this.cdu_nuexre);
      formData.append("p_bit_id", String(this.bit_id));
      formData.append("p_cdu_asures", this.cdu_asures);
      formData.append("p_uor_id", this.uor_id);
      formData.append("p_ten_id", this.ten_id);
      formData.append("p_tdo_id", this.tdo_id);
      formData.append("p_cdu_nudoor", this.cdu_nudoor);
      formData.append("p_cdu_fedoor", this.cdu_fedoor);
      formData.append("p_cdu_imgenv", this.cdu_imgenv);
      formData.append("p_cdu_fencor", this.cdu_fencor);
      formData.append("p_cdu_usumov", this.cdu_usumov);
  
      this.files.forEach((element) => {
        formData.append("imagenes[]", element);
      });
  
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
            this.api.Controldocumentoutreg(formData).subscribe((data: any) => {
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
                        this.router.navigate(["/documentos"]);
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
      // }
  }

  loadData() {
    const data_post = {
      p_cdu_id: parseInt(this.cdu_id),
      p_tdr_id: 0,
      p_nudore: 0,
      p_fecini: "",
      p_fecfin: "",
      p_nuexre: "",
      p_bit_id: 0,
      p_tdo_id: 0,
      p_nudoor: 0,
      p_uor_id: 0,
      p_ten_id: 0,
      p_activo: 9,
    };
  
    this.api.Controldocumentoutsel(data_post).subscribe((data: any) => {
      console.log("Datos recibidos:", data[0]);

      this.cdu_id = data[0].cdu_id;
      this.tdr_id = data[0].tdr_id;
      this.cdu_nudore = data[0].nudore;
      this.cdu_fedore = data[0].fedore;
      this.cdu_nuexre = data[0].nuexre;
      this.bit_id = data[0].bit_id;
      this.cdu_asures = data[0].cdu_asures;
      this.uor_id = data[0].uor_id;
      this.ten_id = data[0].ten_id;
      this.tdo_id = data[0].tdo_id;
      this.cdu_nudoor = data[0].nudoor;
      this.cdu_fedoor = data[0].fedoor;
      this.cdu_fencor = data[0].fencor;
      this.cdu_usumov = data[0].usumov;
    });
  }
}
