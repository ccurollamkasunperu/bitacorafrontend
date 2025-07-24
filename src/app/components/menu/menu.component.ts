import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styles: [],
})
export class MenuComponent implements OnInit {
  // menu: string ='<li><a href="#"> <i class="metismenu-icon pe-7s-tools"></i> MANTENIMIENTO <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i> </a> <ul><li> <a id="marca-modelo"> <i class="pe-7s-next-2"></i>a MARCA-MODELO </a> </li><li> <a id="marca-modelo"> <i class="pe-7s-next-2"></i>a VEHICULO </a> </li></ul></li><li><a href="#"> <i class="metismenu-icon pe-7s-tools"></i> SEGURIDAD <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i> </a> <ul><li> <a id="marca-modelo"> <i class="pe-7s-next-2"></i>a USUARIO </a> </li></ul></li>';
  // menu: any ='<span class="a">Page 1</span>';
  menu: any;
  element: HTMLElement;

  constructor(private api: ApiService, private router: Router) {
    this.cargarMenu();
  }

  ngOnInit() {
    /* this.cargarMenu(); */
    setTimeout(() => {
      document.getElementById('recargardiv').click();
    }, 500);
  }

  getRoute(event) {
    var goRoute = $(event.target).attr('class');
    this.router.navigate([goRoute]);
  }

  cargarMenu() {
    const data_post = {
      p_ucc_id: 0,
      p_usu_id: parseInt(localStorage.usu_id),
      p_cec_id: 0,
      p_pfr_id: 0,
      p_prf_id: 0,
      p_rol_id: 0,
      p_obj_id: 0,
      p_ucc_activo: 1,
    };
    console.log(data_post);

    /* this.api.usuarioCentroCostoSel(data_post).subscribe((data: any) => {
      this.menu = data.menu;
    }); */
  }
}
