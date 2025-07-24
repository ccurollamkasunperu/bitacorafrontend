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
  selector: "app-incidencia-upd",
  templateUrl: "./incidencia-upd.component.html",
})
export class IncidenciaUpdComponent implements OnInit {
  titulopant: string = "Editar Incidencia";
  icono: string = "pe-7s-refresh-2";
  @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;
  options = {
    types: [],
    componentRestrictions: {
      country: "PE",
      // postalCode: "2000",
    },
  };

  map: google.maps.Map;

  dataMotivo: any;
  dataSector: any;
  dataCamara: any;
  dataVehiculo: any;
  dataParteCab: any;
  dataParteMotivo: any;
  dataParteTipo: any;

  p_mpc_id: string = "";
  secselpartmotiv: boolean = true;

  //inputs formulario
  p_inc_id: string = "";
  p_usu_id: string = "";
  p_mop_id: string = "";
  p_sec_id: string = "";
  p_veh_id: string = "";
  p_tin_id: string = "";
  p_cam_id: string = "";
  p_inc_numtel: string = "";
  p_inc_ubicax: string = "";
  p_inc_ubicay: string = "";
  p_inc_direcc: string = "";

  param_inc_id: string = "";
  latitud;
  longitud;
  inputGeorefX: string = "";
  inputGeorefY: string = "";
  inputMarkerX: string = "";
  inputMarkerY: string = "";
  files: File[] = [];
  dataImagen: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private appComponent: AppComponent,
    private route: ActivatedRoute
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.param_inc_id = this.route.snapshot.params.inc_id;
    this.loadDataProceso();
    this.fillMotivo();
    this.fillSector();
    this.fillVehiculo();
    this.loadDataParteCab();
    this.loadDataCamara();
    this.loadDataTipoIncidencia();
    this.verImagenes();
  }

  mapClicked($event) {
    this.inputMarkerX = $event.coords.lat;
    this.inputMarkerY = $event.coords.lng;
    this.latitud = $event.coords.lat;
    this.longitud = $event.coords.lng;

    this.geocodeLatLng();
  }

  handleAddressChange(address: Address) {
    console.log(address);
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
    this.p_inc_direcc = address.formatted_address;
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  eliminarImagen(p_iin_id: string) {

    const data_post = {
      p_iin_id: parseInt(p_iin_id),
    };
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
        this.api.incidenciaImagenDel(data_post).subscribe((data: any) => {
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
                    this.verImagenes();
                    // this.router.navigate(["/incidencia"]);
                    // this.LimpiarFormulario();
                    // document.getElementById("closeModal").click();
                    // this.loadDataProceso();
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

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  verImagenes() {
    const data_post = {
      p_iin_id: 0,
      p_inc_id: parseInt(this.param_inc_id),
      p_iin_activo: 1,
    };
    this.api.incidenciaImagenSel(data_post).subscribe((data: any) => {
      console.log(data);
      if (data.length != 0) {
        this.dataImagen = data;
      } else {
        this.dataImagen = [];
      }
    });
  }

  editarRegistro() {
    const dataPost = {
      p_inc_id: parseInt(this.param_inc_id),
      p_usu_id: parseInt(localStorage.getItem("usu_id")),
      p_mop_id: parseInt(this.p_mop_id),
      p_sec_id: parseInt(this.p_sec_id),
      p_veh_id: parseInt(this.p_veh_id),
      p_tin_id: parseInt(this.p_tin_id),
      p_cam_id: parseInt(this.p_cam_id),
      p_inc_numtel: parseInt(this.p_inc_numtel),
      p_inc_ubicax: this.longitud,
      p_inc_ubicay: this.latitud,
      p_inc_direcc: this.p_inc_direcc,
    };

    var formData = new FormData();
    formData.append("p_inc_id", this.param_inc_id);
    formData.append("p_usu_id", String(localStorage.getItem("usu_id")));
    formData.append("p_mop_id", this.p_mop_id == "" ? "0" : this.p_mop_id);
    formData.append("p_sec_id", this.p_sec_id == "" ? "0" : this.p_sec_id);
    formData.append("p_veh_id", this.p_veh_id == "" ? "0" : this.p_veh_id);
    formData.append("p_tin_id", this.p_tin_id == "" ? "0" : this.p_tin_id);
    formData.append("p_cam_id", this.p_cam_id == "" ? "0" : this.p_cam_id);
    formData.append("p_inc_numtel", this.p_inc_numtel);
    formData.append("p_inc_ubicax", String(this.longitud));
    formData.append("p_inc_ubicay", String(this.latitud));
    formData.append("p_inc_direcc", this.p_inc_direcc);

    this.files.forEach((element) => {
      formData.append("imagenes[]", element);
    });

    console.log(dataPost);
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
          this.api.incidenciaUpd(formData).subscribe((data: any) => {
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
                      this.router.navigate(["/incidencia"]);
                      // this.LimpiarFormulario();
                      // document.getElementById("closeModal").click();
                      // this.loadDataProceso();
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

  onMapReady(e) {
    // alert("Mapa cargado");
    this.map = e;
  }
  geocodeLatLng() {
    // const input = (document.getElementById("latlng") as HTMLInputElement).value;
    // const latlngStr = input.split(",", 2);
    const latlng = {
      lat: parseFloat(this.inputMarkerX),
      lng: parseFloat(this.inputMarkerY),
    };
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();
    geocoder
      .geocode({ location: latlng })
      .then((response) => {
        if (response.results[0]) {
          // map.setZoom(11);

          // const marker = new google.maps.Marker({
          //   position: latlng,
          //   map: this.map,
          // });

          infowindow.setContent(response.results[0].formatted_address);
          this.p_inc_direcc = response.results[0].formatted_address;
          // infowindow.open(this.map, marker);
          // alert(response.results[0].formatted_address);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }

  loadDataProceso() {
    const data_post = {
      p_inc_id: parseInt(this.param_inc_id),
      p_usu_id: 0,
      p_mpc_id: 0,
      p_mop_id: 0,
      p_sec_id: 0,
      p_veh_id: 0,
      p_cec_id: 0,
      p_tin_id: 0,
      p_cam_id: 0,
      p_uni_id: 0,
      p_inc_fecini: "",
      p_inc_fecfin: "",
      p_inc_activo: 1,
    };
    console.log(data_post);

    this.api.getIncidenciaSel(data_post).subscribe((data: any) => {
      console.log(data[0]);
      if (data.length != 0) {
        this.p_tin_id = data[0].tin_id;
        this.p_sec_id = data[0].sec_id;
        this.p_mpc_id = data[0].mpc_id;

        this.p_veh_id = data[0].veh_id;
        this.p_cam_id = data[0].cam_id == null ? "" : data[0].cam_id;
        this.p_inc_numtel = data[0].inc_numtel;
        this.p_inc_direcc = data[0].inc_direcc;
        this.latitud = Number(data[0].inc_ubicay);
        this.longitud = Number(data[0].inc_ubicax);
      }
      this.loadDataParteMotivo();
      this.p_mop_id = data[0].mop_id;
    });
  }

  fillMotivo() {
    const data_post = {
      p_mpc_descri: "",
      p_mpc_activo: 1,
    };

    this.api.getmotivopartecabsel(data_post).subscribe((data: any) => {
      this.dataMotivo = data;
    });
  }

  fillSector() {
    const data_post = {
      p_sec_id: 0,
      p_zon_id: 0,
      p_sec_activo: 1,
    };

    this.api.getsectorsel(data_post).subscribe((data: any) => {
      this.dataSector = data;
    });
  }

  loadDataCamara() {
    const data_post = {
      p_cam_id: 0,
      p_cae_id: 0,
      p_cae_activo: 1,
    };

    this.api.camaraSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataCamara = data;
    });
  }

  fillVehiculo() {
    const data_post = {
      p_veh_id: 0,
      p_tve_id: 0,
      p_mar_id: 0,
      p_mod_id: 0,
      p_esv_id: 0,
      p_cov_id: 0,
      p_veh_numpla: "",
      p_mpc_id: 0,
      p_mpd_id: 0,
      p_veh_activo: 1,
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
      this.dataVehiculo = data;
    });
  }

  loadDataParteCab() {
    const data_post = {
      p_mpc_descri: "",
      p_mpc_activo: 1,
    };

    this.api.getmotivopartecabsel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteCab = data;
    });
  }

  loadDataParteMotivo() {
    this.p_mop_id = "";
    const data_post = {
      p_mop_id: 0,
      p_mpc_id: this.p_mpc_id,
      p_mpd_id: 0,
      p_mop_activo: 1,
    };

    this.api.getmotivopartesel(data_post).subscribe((data: any) => {
      this.dataParteMotivo = data;
      if (this.dataParteMotivo.length > 1) {
        this.secselpartmotiv = false;
      } else {
        this.p_mop_id = data[0].mop_id;
        this.secselpartmotiv = true;
      }
    });
  }

  loadDataTipoIncidencia() {
    const data_post = {
      p_tin_id: 0,
      p_tin_activo: 1,
    };

    this.api.tipoIncidenciaSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteTipo = data;
    });
  }
}
