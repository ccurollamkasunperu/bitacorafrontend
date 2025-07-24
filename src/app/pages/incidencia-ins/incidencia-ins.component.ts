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
  selector: "app-incidencia-ins",
  templateUrl: "./incidencia-ins.component.html",
})
export class IncidenciaInsComponent implements OnInit {
  titulopant: string = "Registro de Incidencia";
  icono: string = "pe-7s-refresh-2";
  p_mpc_descri: string = "0";
  p_mpc_activo: string = "1";
  sec_id: string = "0";
  sec_activo: string = "1";
  motivoid: string = "";
  Zonaid: string = "";
  sectid: string = "0";
  vehiculoid: string = "";
  telefono: string = "";
  direccion: string = "";
  descrip: string = "";
  x: string = "";
  y: string = "";
  latitud = -12.06499854;
  longitud = -77.0309262;
  inputGeorefX: string = "";
  inputGeorefY: string = "";
  inputMarkerX: string = "";
  inputMarkerY: string = "";

  dataMotivo: any;
  dataZona: any;
  dataVehiculo: any;
  dataCentroCosto: any;
  dataSector: any;
  dataCamara: any;

  veh_id: string = "0";
  tve_id: string = "0";
  mar_id: string = "0";
  mod_id: string = "0";
  esv_id: string = "0";
  cov_id: string = "0";
  veh_numpla: string = "0";
  mpc_id: string = "0";
  mpd_id: string = "0";
  veh_activo: string = "1";
  p_mpc_id: string = "";
  p_mop_id: string = "";
  dataParteCab: any;
  dataParteMotivo: any;
  dataParteTipo: any;
  p_tin_id: string = "";
  files: File[] = [];
  p_sec_id: string = "";
  p_cam_id: string = "";
  secselpartmotiv: boolean = true;

  @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;
  options = {
    types: [],
    componentRestrictions: {
      country: "PE",
      // postalCode: "2000",
    },
  };

  map: google.maps.Map;

  constructor(
    private api: ApiService,
    private router: Router,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    //this.getCurrentLocation();
    this.fillMotivo();
    this.fillSector();
    this.fillVehiculo();
    this.loadDataParteCab();
    this.loadDataCamara();
    this.loadDataTipoIncidencia();
  }

  mapClicked($event) {
    this.inputMarkerX = $event.coords.lat;
    this.inputMarkerY = $event.coords.lng;
    this.latitud = $event.coords.lat;
    this.longitud = $event.coords.lng;

    this.geocodeLatLng();
  }

  onMapReady(e) {
    // alert("Mapa cargado");
    this.map = e;
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
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
          this.direccion = response.results[0].formatted_address;
          // infowindow.open(this.map, marker);
          // alert(response.results[0].formatted_address);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }

  // initMap(){
  //   const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
  //     zoom: 8,
  //     center: { lat: -34.397, lng: 150.644 },
  //     mapTypeControl: false,
  //   });
  // }

  loadDataCentroCosto() {
    const data_post = {
      p_cec_id: 0,
      p_cec_activo: 1,
    };

    this.api.centroCostoSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataCentroCosto = data;
    });
  }

  fillMotivo() {
    const data_post = {
      p_mpc_descri: this.p_mpc_descri,
      p_mpc_activo: this.p_mpc_activo,
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
  fillVehiculo() {
    const data_post = {
      p_veh_id: this.veh_id,
      p_tve_id: this.tve_id,
      p_mar_id: this.mar_id,
      p_mod_id: this.mod_id,
      p_esv_id: this.esv_id,
      p_cov_id: this.cov_id,
      p_veh_numpla: this.veh_numpla,
      p_mpc_id: this.mpc_id,
      p_mpd_id: this.mpd_id,
      p_veh_activo: this.veh_activo,
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
      this.dataVehiculo = data;
    });
  }

  handleAddressChange(address: Address) {
    console.log(address);
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
    this.direccion = address.formatted_address;
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          this.latitud = position.coords.latitude;
          this.longitud = position.coords.longitude;
        },
        function () {
          alert("Unable to get the GPS location");
        },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    }
  }

  setPosition(position) {
    this.inputGeorefX = position.coords.latitude;
    this.inputGeorefY = position.coords.longitude;
    this.inputMarkerX = position.coords.latitude;
    this.inputMarkerY = position.coords.longitude;
  }

  placeMarker($event) {
    console.log($event);
  }

  procesaRegistro() {
    // if (this.descrip == "") {
    //   swal.fire({
    //     title: "Error",
    //     text: "Debe ingresar una descripción",
    //     icon: "error",
    //     confirmButtonColor: "#3085d6",
    //     confirmButtonText: "Aceptar",
    //   });
    // } else {
    const dataPost = {
      p_usu_id: parseInt(localStorage.getItem("usu_id")),
      p_mop_id: parseInt(this.p_mop_id),
      p_zon_id: parseInt(this.Zonaid),
      p_sec_id: parseInt(this.sectid),
      p_veh_id: parseInt(this.vehiculoid),
      p_inc_numtel: parseInt(this.telefono),
      p_inc_ubicax: this.longitud,
      p_inc_ubicay: this.latitud,
      p_inc_direcc: this.direccion,
      p_inc_descri: this.descrip,
    };
    var formData = new FormData();
    formData.append("p_usu_id", String(localStorage.getItem("usu_id")));
    formData.append("p_mop_id", this.p_mop_id == "" ? "0" : this.p_mop_id);
    formData.append("p_sec_id", this.p_sec_id == "" ? "0" : this.p_sec_id);
    formData.append("p_veh_id", this.vehiculoid == "" ? "0" : this.vehiculoid);
    formData.append("p_tin_id", this.p_tin_id == "" ? "0" : this.p_tin_id);
    formData.append("p_cam_id", this.p_cam_id == "" ? "0" : this.p_cam_id);
    formData.append("p_inc_numtel", this.telefono);
    formData.append("p_inc_ubicax", String(this.longitud));
    formData.append("p_inc_ubicay", String(this.latitud));
    formData.append("p_inc_direcc", this.direccion);

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
          this.api.getincidenciaIns(formData).subscribe((data: any) => {
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
}
