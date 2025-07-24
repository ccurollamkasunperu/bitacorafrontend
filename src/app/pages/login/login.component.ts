import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  inputUsuario: string = "";
  inputPassword: string = "";
  sessionMsg: string = "";
  ip: string = "";

  constructor(
    private router: Router,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = true;
  }

  ngOnInit() {
    this.api.validateSession("login");
  }

  loginUser() {
    const dataPost = {
      p_usu_loging: this.inputUsuario,
      p_usu_passwd: this.inputPassword,
    };
    this.sessionMsg = '<i class="fa fa-check" aria-hidden="true"></i> ' + "BIENVENIDO";

      localStorage.setItem("usu_apemat", "SILUPU");
      localStorage.setItem("usu_apepat", "CURO");
      localStorage.setItem("usu_id", "1");
      localStorage.setItem("usu_loging", "CCURO");
      localStorage.setItem("usu_nombre", "CARLOS AIRTON");
      localStorage.setItem("usu_nomcom", "CARLOS AIRTON CURO SILUPU");
      localStorage.setItem("cec_id", "1");

      setTimeout(() => {
        this.router.navigate(["/dashboard"]);
      }, 1500);
    }
  /* loginUser() {
    const dataPost = {
      p_usu_loging: this.inputUsuario,
      p_usu_passwd: this.inputPassword,
    };
    this.api.getInicioSesion(dataPost).subscribe((data: any) => {
      if (data[0].error == 0) {
        this.sessionMsg =
          '<i class="fa fa-check" aria-hidden="true"></i> ' + data[0].mensa;
        let idusuario = data[0].numid;

        const data_post = {
          p_usu_id: parseInt(idusuario),
          p_usu_appeat: "",
          p_usu_activo: 1,
        };

        this.api.getusuariosel(data_post).subscribe((data: any) => {
          localStorage.setItem("usu_apemat", data[0].usu_apemat);
          localStorage.setItem("usu_apepat", data[0].usu_apepat);
          localStorage.setItem("usu_id", data[0].usu_id);
          localStorage.setItem("usu_loging", data[0].usu_loging);
          localStorage.setItem("usu_nombre", data[0].usu_nombre);
          localStorage.setItem("usu_nomcom", data[0].usu_nomcom);
          localStorage.setItem("cec_id", data[0].cec_id);
        });

        setTimeout(() => {
          this.router.navigate(["/dashboard"]);
        }, 1500);
      } else {
        this.sessionMsg =
          '<i class="fa fa-times" aria-hidden="true"></i> ' + data[0].mensa;
      }
    });
  } */
}
