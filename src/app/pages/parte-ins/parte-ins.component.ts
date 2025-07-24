/// <reference types="@types/google.maps" />
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { ApiService } from "src/app/services/api.service";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponent } from "../../app.component";

@Component({
  selector: "app-parte-ins",
  templateUrl: "./parte-ins.component.html",
})
export class ParteInsComponent implements OnInit {
  titulopant: string = "Registro de Parte";
  icono: string = "pe-7s-refresh-2";

  items = [
    {id: 1, name: 'Python'},
    {id: 2, name: 'Node Js'},
    {id: 3, name: 'Java'},
    {id: 4, name: 'PHP', disabled: true},
    {id: 5, name: 'Django'},
    {id: 6, name: 'Angular'},
    {id: 7, name: 'Vue'},
    {id: 8, name: 'ReactJs'},
  ];
  selected = [
    {id: 2, name: 'Node Js'},
    {id: 8, name: 'ReactJs'}
  ];

  dataParteTipo: any;
  dataParteMotivo: any;
  dataTipoVehiculo: any;
  dataVehiculo: any;
  dataSector: any;
  dataSereno: any;
  dataSupervisor: any;

  inputGeorefX: string = "";
  inputGeorefY: string = "";
  inputMarkerX: string = "";
  inputMarkerY: string = "";
  address = "London";
  location: Location;
  loading: boolean;
  latitud;
  longitud;
  p_mpc_id: string = "";
  dataZona: any;

  //Inputs Formulario
  p_inc_id: string = "";
  p_pti_id: string = "";
  p_veh_id: string = "";
  p_sec_id: string = "";
  p_mop_id: string = "";
  p_usu_id: string = localStorage.usu_id;
  p_prl_id: string = "";
  p_sup_id: string = "";
  p_zon_id: string = "";
  p_per_id: number = 0;
  p_par_descri: string = "";
  p_par_direcc: string = "";
  files: File[] = [];
  secselbool: boolean = true;
  secselpartmotiv: boolean = true;

  dataParteCab: any;
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
    private route: ActivatedRoute,
    private appComponent: AppComponent
  ) {
      this.appComponent.login = false;
  }

  ngOnInit() {
    this.p_inc_id = this.route.snapshot.params.inc_id;
    this.getCurrentLocation();
    this.loadDataParteTipo();
    /* this.loadDataParteMotivo(); */
    this.loadDataTipoVehiculo();
    this.loadDataVehiculo();
    /* this.loadDataSector(); */
    this.loadDataSupervisor();
    this.loadDataSereno();
    this.loadDataParteCab();
    this.loadDataZona();
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  loadDataSupervisor() {
    const data_post = {};

    this.api.supervisorSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataSupervisor = data;
    });
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
          this.p_par_direcc = response.results[0].formatted_address;
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  }

  loadDataSereno() {
    const data_post = {};

    this.api.serenoSel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataSereno = data;
    });
  }

  loadDataZona() {
    const data_post = {
      p_zon_id: 0,
      p_zon_activo: 1,
    };

    this.api.getzonasel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataZona = data;
    });
  }

  loadDataSector() {
    this.p_sec_id = "";
    const data_post = {
      p_sec_id: 0,
      p_zon_id: this.p_zon_id,
      p_sec_activo: 1,
    };

    this.api.getsectorsel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataSector = data;
      if (this.dataSector.length > 1) {
        this.secselbool = false;
      } else {
        this.p_sec_id = data[0].sec_id;
        this.secselbool = true;
      }
    });
  }

  loadDataVehiculo() {
    const data_post = {
      p_veh_id: 0,
      p_tve_id: 0,
      p_mar_id: 0,
      p_mod_id: 0,
      p_esv_id: 0,
      p_cov_id: 0,
      p_veh_numpla: "",
      p_veh_activo: 1,
    };

    this.api.getvehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataVehiculo = data;
    });
  }

  loadDataTipoVehiculo() {
    const data_post = {
      p_tve_id: 0,
      p_tve_activo: 1,
    };

    this.api.gettipovehiculosel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoVehiculo = data;
    });
  }

  loadDataParteTipo() {
    const data_post = {
      p_pti_id: 0,
      p_pti_activo: 1,
    };

    this.api.getpartetiposel(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataParteTipo = data;
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

  handleAddressChange(address: Address) {
    this.latitud = address.geometry.location.lat();
    this.longitud = address.geometry.location.lng();
    this.p_par_direcc = address.formatted_address;
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

  procesaParte() {
    // if (this.param_prf_id == "") {
    //   swal.fire({
    //     title: "Error",
    //     text: "Debe Seleccionar Perfil",
    //     icon: "error",
    //     confirmButtonColor: "#3085d6",
    //     confirmButtonText: "Aceptar",
    //   });
    // } else if (this.param_rol_id == "") {
    //   swal.fire({
    //     title: "Error",
    //     text: "Debe Seleccionar Rol",
    //     icon: "error",
    //     confirmButtonColor: "#3085d6",
    //     confirmButtonText: "Aceptar",
    //   });
    // } else {

    const data_post = {
      p_inc_id: this.p_inc_id,
      p_pti_id: this.p_pti_id,
      p_veh_id: this.p_veh_id,
      p_zon_id: this.p_zon_id,
      p_sec_id: this.p_sec_id,
      p_mop_id: this.p_mop_id,
      p_usu_id: this.p_usu_id,
      p_prl_id: this.p_prl_id,
      p_sup_id: this.p_sup_id,
      p_par_descri: this.p_par_descri,
      p_par_ubicax: this.longitud,
      p_par_ubicay: this.latitud,
      p_par_direcc: this.p_par_direcc,
    };

    console.log(data_post);
    var formData = new FormData();
    // const dataPost = {
    formData.append("p_inc_id", this.p_inc_id);
    formData.append("p_pti_id", this.p_pti_id);
    formData.append("p_veh_id", this.p_veh_id);
    formData.append("p_zon_id", this.p_zon_id);
    formData.append("p_sec_id", this.p_sec_id);
    formData.append("p_mop_id", this.p_mop_id);
    formData.append("p_usu_id", this.p_usu_id);
    formData.append("p_prl_id", this.p_prl_id);
    formData.append("p_sup_id", this.p_sup_id);
    formData.append("p_par_descri", this.p_par_descri);
    formData.append("p_par_ubicax", this.longitud);
    formData.append("p_par_ubicay", this.latitud);
    formData.append("p_par_direcc", this.p_par_direcc);
    // };
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
          this.api.getparteins(formData).subscribe((data: any) => {
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
                    this.router.navigate(["/parte"]);
                    setTimeout(() => {
                      // this.limpiarFormulario();
                      // document.getElementById("closeModal").click();
                      // this.loadData();
                    }, 500);
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
