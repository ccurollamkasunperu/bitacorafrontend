/// <reference types="@types/google.maps" />
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ApiService } from "src/app/services/api.service";
import { AppComponent } from "../../app.component";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { AnonymousSubject } from "rxjs/internal/Subject";

@Component({
  selector: "app-camara-ins",
  templateUrl: "./camara-ins.component.html",
})
export class CamaraInsComponent implements OnInit {
  titulopant: string = "Registro de Cámara";
  icono: string = "pe-7s-refresh-2";

  latitud = -12.06499854;
  longitud = -77.0309262;
  inputGeorefX: string = "";
  inputGeorefY: string = "";
  inputMarkerX: string = "";
  inputMarkerY: string = "";

  p_cam_dire01: string = "";
  p_cam_dire02: string = "";
  p_cam_ubicax: string = "";
  p_cam_ubicay: string = "";
  p_direcc: string = "";

  @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;
  options = {
    types: [],
    componentRestrictions: {
      country: "PE",
      // postalCode: "2000",
    },
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  procesaRegistro() {
 
      const dataPost = {
        p_cam_dire01: this.p_cam_dire01,
        p_cam_dire02: this.p_cam_dire02,
        p_cam_ubicax: this.latitud,
        p_cam_ubicay: this.longitud,
        p_cae_id: 1,
      };
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
            this.api.camaraIns(dataPost).subscribe((data: any) => {
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
                        this.router.navigate(["/camara"]);
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

  map: google.maps.Map;

  mapClicked($event) {
    this.inputMarkerX = $event.coords.lat;
    this.inputMarkerY = $event.coords.lng;
    this.latitud = $event.coords.lat;
    this.longitud = $event.coords.lng;

    this.geocodeLatLng();
  }

  onMapReady(e) {
    this.map = e;
  }

  geocodeLatLng() {
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
          infowindow.setContent(response.results[0].formatted_address);
          this.p_direcc = response.results[0].formatted_address;
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
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
}
