/// <reference types="@types/google.maps" />
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ApiService } from "src/app/services/api.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-ver-camara",
  templateUrl: "./ver-camara.component.html",
})
export class VerCamaraComponent implements OnInit {
  titulopant : string = "Cámaras en Mapa"
  icono : string = "pe-7s-next-2"
  map: google.maps.Map;
  latitud = -12.06499854;
  longitud = -77.0309262;
  inputGeorefX: string = "-12.06499854";
  inputGeorefY: string = "-77.0309262";
  inputMarkerX: string = "";
  inputMarkerY: string = "";
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";
  dataCamara: any;
  locations: any = [];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listarCamaras();
    // this.getCurrentLocation();
  }

  onMapReady(e) {
    this.map = e;
  }

  listarCamaras() {
    const data_post = {
      p_cam_id: parseInt(this.p_cam_id),
      p_cae_id: parseInt(this.p_cae_id),
      p_cae_activo: parseInt(this.p_cae_activo),
    };
    console.log(data_post);
    this.api.camaraSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataCamara = data;
        // console.log(data);
        for (let clave of this.dataCamara) {
          this.locations.push([
            "",
            Number(clave.cam_ubicax),
            Number(clave.cam_ubicay),
            0,
          ]);
        }
        console.log(this.locations);

        var marker, i;

        for (i = 0; i < this.locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              this.locations[i][1],
              this.locations[i][2]
            ),
            map: this.map,
          });
        }
      } else {
        this.dataCamara = [];
      }
    });
  }

  getCurrentLocation() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       console.log(position);
    //       this.latitud = position.coords.latitude;
    //       this.longitud = position.coords.longitude;
    //     },
    //     function () {
    //       alert("Unable to get the GPS location");
    //     },
    //     { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
    //   );
    // }
  }

  setPosition(position) {
    this.inputGeorefX = position.coords.latitude;
    this.inputGeorefY = position.coords.longitude;
    this.inputMarkerX = position.coords.latitude;
    this.inputMarkerY = position.coords.longitude;
  }
}
