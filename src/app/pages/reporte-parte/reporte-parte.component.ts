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
  selector: "app-reporte-parte",
  templateUrl: "./reporte-parte.component.html",
})
export class ReporteParteComponent implements OnInit {
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

  p_par_id: string = "0";
  p_pti_id: string = "0";
  p_tur_id: string = "0";
  p_veh_id: string = "0";
  p_sec_id: string = "0";
  p_mpc_id: string = "0";
  p_mop_id: string = "0";
  p_prl_id: string = "0";
  p_sup_id: string = "0";
  p_usu_id: string = "0";
  p_par_fecini: string = "0";
  p_par_fecfin: string = "0";
  p_par_activo: string = "1";

  titulopant: string = "Reporte Parte";
  icono: string = "pe-7s-refresh-2";

  dataParte: any;
  locations: any = [];
  map: google.maps.Map;
  
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
    var url = this.api.getTraerExcelParte(this.p_par_fecini, this.p_par_fecfin);
    window.open(url, "_blank");
  }

  buscar() {
    const data_post = {
      p_par_id: this.p_par_id,
      p_pti_id: this.p_pti_id,
      p_tur_id: this.p_tur_id,
      p_veh_id: this.p_veh_id,
      p_sec_id: this.p_sec_id,
      p_mpc_id: this.p_mpc_id,
      p_mop_id: this.p_mop_id,
      p_prl_id: this.p_prl_id,
      p_sup_id: this.p_sup_id,
      p_usu_id: this.p_usu_id,
      p_par_fecini: this.p_par_fecini,
      p_par_fecfin: this.p_par_fecfin,
      p_par_activo: this.p_par_activo,
    };
    console.log(data_post);
    this.api.getDataParteSel(data_post).subscribe((data: any) => {
      if (data.length != 0) {
        this.dataParte = data;
        console.log(data);
        for (let clave of this.dataParte) {
          this.locations.push([
            "",
            Number(clave.par_ubicay),
            Number(clave.par_ubicax),
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
        this.dataParte = [];
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
