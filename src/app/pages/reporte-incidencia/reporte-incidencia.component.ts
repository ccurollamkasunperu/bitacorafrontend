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
  selector: "app-reporte-incidencia",
  templateUrl: "./reporte-incidencia.component.html",
})
export class ReporteIncidenciaComponent implements OnInit {
  @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;
  options = {
    types: [],
    componentRestrictions: {
      country: "PE",
      // postalCode: "2000",
    },
  };

  inputGeorefX: string = "";
  inputGeorefY: string = "";
  inputMarkerX: string = "";
  inputMarkerY: string = "";
  address = "London";
  location: Location;
  loading: boolean;
  latitud = -12.06499854;
  longitud = -77.0309262;

  p_inc_id: string = "0";
  p_usu_id: string = "0";
  p_mop_id: string = "0";
  p_mpc_id: string = "0";
  p_mpd_id: string = "0";
  p_sec_id: string = "0";
  p_veh_id: string = "0";
  p_cec_id: string = "0";
  p_inc_fecini: string = "";
  p_inc_fecfin: string = "";
  p_inc_activo: string = "1";
  map: google.maps.Map;

  titulopant: string = "Reporte Incidencia";
  icono: string = "pe-7s-refresh-2";

  dataIncidencia: any;

  locations: any = [];
  // locations1: any = [];
  loca: any = [];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    //this.getCurrentLocation();
    // this.loadDataProceso();
  }

  mapClicked($event) {
    console.log($event);
    this.inputMarkerX = $event.coords.lat;
    this.inputMarkerY = $event.coords.lng;
    this.latitud = $event.coords.lat;
    this.longitud = $event.coords.lng;

    // this.geocodeLatLng();
  }

  exportar(): void {
    var url = this.api.getTraerExcel(this.p_inc_fecini, this.p_inc_fecfin);
    window.open(url, "_blank");
  }

  buscar() {
    var infowindow = new google.maps.InfoWindow();
    const data_post = {
      p_inc_id: this.p_inc_id,
      p_usu_id: this.p_usu_id,
      p_mop_id: this.p_mop_id,
      p_mpc_id: this.p_mpc_id,
      p_mpd_id: this.p_mpd_id,
      p_sec_id: this.p_sec_id,
      p_veh_id: this.p_veh_id,
      p_cec_id: this.p_cec_id,
      p_inc_fecini: this.p_inc_fecini,
      p_inc_fecfin: this.p_inc_fecfin,
      p_inc_activo: this.p_inc_activo,
    };
    // console.log(data_post);
    this.api.getIncidenciaSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataIncidencia = data;
        console.log(data);
        for (let clave of this.dataIncidencia) {
          this.locations.push([
            "",
            Number(clave.inc_ubicay),
            Number(clave.inc_ubicax),
            0,
            clave.inc_descri,
          ]);
        }
        // console.log(this.locations);

        var marker, i;

        var infoWindow = new google.maps.InfoWindow();
        var texto = "";
        for (i = 0; i < this.locations.length; i++) {
          var data = this.locations[i];
          // texto = this.locations[i][4];
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[1], data[2]),
            map: this.map,
          });

          (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
              infoWindow.setContent(
                "<div style = 'width:200px;min-height:40px;text-align:justify'>" + data[4] + "</div>"
              );
              infoWindow.open(this.map, marker);
            });
          })(marker, data);
        }
      } else {
        this.dataIncidencia = [];
      }
    });
  }

  onMapReady(e) {
    this.map = e;
  }

  loadDataProceso() {}

  handleAddressChange(address: Address) {
    console.log(address);
    console.log(address.geometry.location.lat());
    console.log(address.geometry.location.lng());
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
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
