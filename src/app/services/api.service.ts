import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private httpClient: HttpClient, private router: Router) { }

  urlApi: string = "http://localhost/bitacorabackend/public/api/";

  getQuery(query: string) {
    const url = `${this.urlApi + query}`;
    return this.httpClient.get(url);
  }

  postQuery(query: string, params: any) {
    const url = `${this.urlApi + query}`;
    return this.httpClient.post(url, params);
  }

  getDataTipoValor(data: object) {
    return this.postQuery("general/tipovalor/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataTipoContribuyente(data: object) {
    return this.postQuery("general/tipocontri/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataTipoUbicacion(data: object) {
    return this.postQuery("general/ubicacion/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataProceso(data: object) {
    return this.postQuery("valores/proceso/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataProcesoDetalle(data: object) {
    return this.postQuery("valores/proceso/listar/detalle", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataDeudaContri(data: object) {
    return this.postQuery("valores/deudacontri/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataDeudaListar(data: object) {
    return this.postQuery("valores/deudadetalle/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  postDataProceso(data: object) {
    return this.postQuery("valores/procdeuda/guardar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  postDataLote(data: object) {
    return this.postQuery("lotes/lotemision/guardar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  postAnulaContriLote(data: object) {
    return this.postQuery("lotes/lotemision/anular-contrib", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataLoteListar(data: object) {
    return this.postQuery("lotes/lotemision/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataParteSel(data: object) {
    return this.postQuery("parte/parte/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataLoteDetalleListar(data: object) {
    return this.postQuery("lotes/lotedetalle/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataLoteListadoContrib(data: object) {
    return this.postQuery("lotes/lotemision/listado-contrib", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataLoteDeudaContrib(data: object) {
    return this.postQuery("lotes/lotemision/deuda-contrib", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataTipoSector(data: object) {
    return this.postQuery("general/tiposector/listar", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcolorvehiculoact(data: object) {
    return this.postQuery("vehiculo/colorvehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcolorvehiculoins(data: object) {
    return this.postQuery("vehiculo/colorvehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcolorvehiculosel(data: object) {
    return this.postQuery("vehiculo/colorvehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcolorvehiculoupd(data: object) {
    return this.postQuery("vehiculo/colorvehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getestadovehiculoact(data: object) {
    return this.postQuery("vehiculo/estadovehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getestadovehiculoins(data: object) {
    return this.postQuery("vehiculo/estadovehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getestadovehiculosel(data: object) {
    return this.postQuery("vehiculo/estadovehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getestadovehiculoupd(data: object) {
    return this.postQuery("vehiculo/estadovehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getgrupovehiculoact(data: object) {
    return this.postQuery("vehiculo/grupovehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getgrupovehiculoins(data: object) {
    return this.postQuery("vehiculo/grupovehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getgrupovehiculosel(data: object) {
    return this.postQuery("vehiculo/grupovehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getgrupovehiculoupd(data: object) {
    return this.postQuery("vehiculo/grupovehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcavehiculoact(data: object) {
    return this.postQuery("vehiculo/marcavehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcavehiculoins(data: object) {
    return this.postQuery("vehiculo/marcavehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcavehiculosel(data: object) {
    return this.postQuery("vehiculo/marcavehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcavehiculoupd(data: object) {
    return this.postQuery("vehiculo/marcavehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcamodvehiculoact(data: object) {
    return this.postQuery("vehiculo/marcamodvehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcamodvehiculoins(data: object) {
    return this.postQuery("vehiculo/marcamodvehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmarcamodvehiculosel(data: object) {
    return this.postQuery("vehiculo/marcamodvehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmodelovehiculoact(data: object) {
    return this.postQuery("vehiculo/modelovehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmodelovehiculoins(data: object) {
    return this.postQuery("vehiculo/modelovehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmodelovehiculosel(data: object) {
    return this.postQuery("vehiculo/modelovehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmodelovehiculoupd(data: object) {
    return this.postQuery("vehiculo/modelovehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipovehiculoact(data: object) {
    return this.postQuery("vehiculo/tipovehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipovehiculoins(data: object) {
    return this.postQuery("vehiculo/tipovehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipovehiculosel(data: object) {
    return this.postQuery("vehiculo/tipovehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipovehiculoupd(data: object) {
    return this.postQuery("vehiculo/tipovehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getvehiculoact(data: object) {
    return this.postQuery("vehiculo/vehiculo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getvehiculoins(data: object) {
    return this.postQuery("vehiculo/vehiculo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getvehiculosel(data: object) {
    return this.postQuery("vehiculo/vehiculo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getvehiculoupd(data: object) {
    return this.postQuery("vehiculo/vehiculo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcomisariaact(data: object) {
    return this.postQuery("comisaria/comisaria/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcomisariains(data: object) {
    return this.postQuery("comisaria/comisaria/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getcomisariaupd(data: object) {
    return this.postQuery("comisaria/comisaria/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentoact(data: object) {
    return this.postQuery("documento/documento/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentoins(data: object) {
    return this.postQuery("documento/documento/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentosel(data: object) {
    return this.postQuery("documento/documento/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentoupd(data: object) {
    return this.postQuery("documento/documento/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentonumeroact(data: object) {
    return this.postQuery("documento/documentonumero/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentonumeroins(data: object) {
    return this.postQuery("documento/documentonumero/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getdocumentonumerosel(data: object) {
    return this.postQuery("documento/documentonumero/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivoparteact(data: object) {
    return this.postQuery("parte/motivoparte/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivoparteins(data: object) {
    return this.postQuery("parte/motivoparte/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartesel(data: object) {
    return this.postQuery("parte/motivoparte/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getInicioSesion(data: object) {
    return this.postQuery("usuario/clavepwd/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getusuariosel(data: object) {
    return this.postQuery("usuario/usuario/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getTipoDocsel(data: object) {
    return this.postQuery("personal/tipodocu/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartecabact(data: object) {
    return this.postQuery("parte/motivopartecab/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartecabins(data: object) {
    return this.postQuery("parte/motivopartecab/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartecabsel(data: object) {
    return this.postQuery("parte/motivopartecab/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartecabupd(data: object) {
    return this.postQuery("parte/motivopartecab/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartedetact(data: object) {
    return this.postQuery("parte/motivopartedet/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartedetins(data: object) {
    return this.postQuery("parte/motivopartedet/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartedetsel(data: object) {
    return this.postQuery("parte/motivopartedet/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getmotivopartedetupd(data: object) {
    return this.postQuery("parte/motivopartedet/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getparteact(data: object) {
    return this.postQuery("parte/parte/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getparteest(data: object) {
    return this.postQuery("parte/parte/est", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getparteins(data: object) {
    return this.postQuery("parte/parte/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getparteupd(data: object) {
    return this.postQuery("parte/parte/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpartetipoact(data: object) {
    return this.postQuery("parte/partetipo/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpartetipoins(data: object) {
    return this.postQuery("parte/partetipo/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpartetiposel(data: object) {
    return this.postQuery("parte/partetipo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpartetipoupd(data: object) {
    return this.postQuery("parte/partetipo/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getsectoract(data: object) {
    return this.postQuery("sector/sector/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getsectorins(data: object) {
    return this.postQuery("sector/sector/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getsectorsel(data: object) {
    return this.postQuery("sector/sector/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getzonaact(data: object) {
    return this.postQuery("sector/zona/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getzonains(data: object) {
    return this.postQuery("sector/zona/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getzonasel(data: object) {
    return this.postQuery("sector/zona/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getzonaupd(data: object) {
    return this.postQuery("sector/zona/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipopersonalact(data: object) {
    return this.postQuery("personal/tipopersonal/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipopersonalins(data: object) {
    return this.postQuery("personal/tipopersonal/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getusuariocambiocontrasena(data: object) {
    return this.postQuery("usuario/usuario/cmbcontra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipopersonalsel(data: object) {
    return this.postQuery("personal/tipopersonal/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  gettipopersonalupd(data: object) {
    return this.postQuery("personal/tipopersonal/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getturnoact(data: object) {
    return this.postQuery("turno/turno/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getturnoins(data: object) {
    return this.postQuery("turno/turno/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getturnosel(data: object) {
    return this.postQuery("turno/turno/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioPermisoSel(data: object) {
    return this.postQuery("usuario/permiso/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioObjetoIns(data: object) {
    return this.postQuery("usuario/objeto/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioObjetoAct(data: object) {
    return this.postQuery("usuario/objeto/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioRolSel(data: object) {
    return this.postQuery("usuario/rol/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioRolIns(data: object) {
    return this.postQuery("usuario/rol/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioRolAct(data: object) {
    return this.postQuery("usuario/rol/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioSel(data: object) {
    return this.postQuery("usuario/usuario/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioIns(data: object) {
    return this.postQuery("usuario/usuario/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioAct(data: object) {
    return this.postQuery("usuario/usuario/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioClaveIns(data: object) {
    return this.postQuery("usuario/clave/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getIncidenciaSel(data: object) {
    return this.postQuery("incidencia/incidencia/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getincidenciaIns(data: object) {
    return this.postQuery("incidencia/incidencia/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilSel(data: object) {
    return this.postQuery("usuario/perfil/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilIns(data: object) {
    return this.postQuery("usuario/perfil/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilRolSel(data: object) {
    return this.postQuery("usuario/perfilrol/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilRolIns(data: object) {
    return this.postQuery("usuario/perfilrol/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioReg(data: object) {
    return this.postQuery("usuario/usuario/reg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  centroCostoSel(data: object) {
    return this.postQuery("usuario/centrocosto/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  usuarioCentroCostoSel(data: object) {
    return this.postQuery("usuario/usuariocentrocosto/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  serenoSel(data: object) {
    return this.postQuery("parte/sereno/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilpermisosPRM(data: object) {
    return this.postQuery("turno/per/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  perfilpermisosReg(data: object) {
    return this.postQuery("turno/per/reg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  supervisorSel(data: object) {
    return this.postQuery("parte/supervisor/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  isLogged() {
    let user_sess = localStorage.getItem("usu_id");
    return user_sess != null ? true : false;
  }

  validateSession(ruta: string) {
    if (this.isLogged()) {
      if (ruta == "login") {
        this.router.navigate(["login"]);
      } else {
        this.router.navigate([ruta]);
      }
    } else {
      this.router.navigate(["login"]);
    }
  }

  getMenu(data: object) {
    return this.postQuery("usuario/usuariocentrocosto/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getTraerExcel(p_fec_ini: string, p_fec_fin: string) {
    return (
      this.urlApi +
      "incidencia/incidencia/excel?p_inc_fecini=" +
      p_fec_ini +
      "&p_inc_fecfin=" +
      p_fec_fin
    );
  }

  getTraerExcelParte(p_par_fecini: string, p_par_fecfin: string) {
    return (
      this.urlApi +
      "parte/parte/excel?p_par_fecini=" +
      p_par_fecini +
      "&p_par_fecfin=" +
      p_par_fecfin
    );
  }

  incidenciaDer(data: object) {
    return this.postQuery("incidencia/incidencia/der", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getTipoPersonalSel(data: object) {
    return this.postQuery("personal/tipopersonal/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getTipoPersonalIns(data: object) {
    return this.postQuery("personal/tipopersonal/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpersonalact(data: object) {
    return this.postQuery("personal/personal/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpersonalins(data: object) {
    return this.postQuery("personal/personal/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpersonalsel(data: object) {
    return this.postQuery("personal/personal/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getpersonalupd(data: object) {
    return this.postQuery("personal/personal/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  incidenciaAct(data: object) {
    return this.postQuery("incidencia/incidencia/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  imagenSel(data: object) {
    return this.postQuery("parte/imagen/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getradioins(data: object) {
    return this.postQuery("radio/radio/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getradiosel(data: object) {
    return this.postQuery("radio/radio/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getradioupd(data: object) {
    return this.postQuery("radio/radio/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getradioact(data: object) {
    return this.postQuery("radio/radio/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  camaraSel(data: object) {
    return this.postQuery("incidencia/camara/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  camaraIns(data: object) {
    return this.postQuery("incidencia/camara/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  camaraAct(data: object) {
    return this.postQuery("incidencia/camara/act", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  zonaSel(data: object) {
    return this.postQuery("parte/zona/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  tipoIncidenciaSel(data: object) {
    return this.postQuery("incidencia/tipo/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  unidadSel(data: object) {
    return this.postQuery("incidencia/unidad/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  cerrarIncidencia(data: object) {
    return this.postQuery("incidencia/cerrar/ins", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

 incidenciaUpd(data: object) {
    return this.postQuery("incidencia/incidencia/upd", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  incidenciaImagenSel(data: object) {
    return this.postQuery("incidencia/imagen/sel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  incidenciaImagenDel(data: object) {
    return this.postQuery("incidencia/imagen/del", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  reporteIncidencia(p_inc_id: number, p_usu_id: number, p_mpc_id: number, p_mop_id: number, p_sec_id: number, p_veh_id: number, p_cec_id: number, p_tin_id: number, p_cam_id: number, p_uni_id: number, p_inc_fecini: string, p_inc_fecfin: string) {
    return (
      this.urlApi + "incidencia/reporte/sel?p_inc_id=" + p_inc_id +
      "&p_usu_id=" + p_usu_id +
      "&p_mpc_id=" + p_mpc_id +
      "&p_mop_id=" + p_mop_id +
      "&p_sec_id=" + p_sec_id +
      "&p_veh_id=" + p_veh_id +
      "&p_cec_id=" + p_cec_id +
      "&p_tin_id=" + p_tin_id +
      "&p_cam_id=" + p_cam_id +
      "&p_uni_id=" + p_uni_id +
      "&p_inc_fecini=" + p_inc_fecini +
      "&p_inc_fecfin=" + p_inc_fecfin);
  }

  reporteParte(p_par_id: number, p_pti_id: number, p_tur_id: number, p_veh_id: number, p_zon_id: number, p_sec_id: number, p_mop_id: number, p_prl_id: number, p_sup_id: number, p_usu_id: number, p_par_fecini: string, p_par_fecfin: string) {
    return (
      this.urlApi + "parte/reporte/sel?p_par_id=" + p_par_id +
      "&p_pti_id=" + p_pti_id +
      "&p_tur_id=" + p_tur_id +
      "&p_veh_id=" + p_veh_id +
      "&p_zon_id=" + p_zon_id +
      "&p_sec_id=" + p_sec_id +
      "&p_mop_id=" + p_mop_id +
      "&p_prl_id=" + p_prl_id +
      "&p_sup_id=" + p_sup_id +
      "&p_usu_id=" + p_usu_id +
      "&p_par_fecini=" + p_par_fecini +
      "&p_par_fecfin=" + p_par_fecfin);
  }

  //END POINTS NUEVOS PARA USAR
  
  Unidadorganizativasel(data: object) {
    return this.postQuery("maestro/unidadorganizativasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  Tipocontroldocumentosel(data: object) {
    return this.postQuery("maestro/tipocontroldocumentosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  Entregacontroldocumentosel(data: object) {
    return this.postQuery("documento/entregacontroldocumentosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  Controldocumentoutreg(data: object) {
    return this.postQuery("documento/controldocumentoutreg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  Controldocumentoutsel(data: object) {
    return this.postQuery("documento/controldocumentoutsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  //NUEVOS ENDPOINT
  getDataTipodocidesel(data: object) {
    return this.postQuery("maestro/tipodocidesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getDataSedessel(data: object) {
    return this.postQuery("inventario/sedessel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getDataAreadenominacionsel(data: object) {
    return this.postQuery("area/areadenominacionsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getGruposel(data: object) {
    return this.postQuery("inventario/sbngruposel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getClasesel(data: object) {
    return this.postQuery("inventario/sbnclasesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getFamiliasel(data: object) {
    return this.postQuery("inventario/sbnfamiliasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getEstadossel(data: object) {
    return this.postQuery("inventario/sbnestadosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getMarcasel(data: object) {
    return this.postQuery("inventario/marcasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getRecursopropiedadsel(data: object) {
    return this.postQuery("inventario/recursopropiedadsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getTiporecursosel(data: object) {
    return this.postQuery("inventario/tiporecursosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getRecursosel(data: object) {
    return this.postQuery("inventario/recursosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getRecursoreg(data: object) {
    return this.postQuery("inventario/recursoreg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getModelosel(data: object) {
    return this.postQuery("inventario/modelosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getColaboradorSel(data: object) {
    return this.postQuery("colaborador/colaboradorsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  //COMIENZA AQUI
  
  getsistemaoperativobasesel(data: object) {
    return this.postQuery("inventario/sistemaoperativobasesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsistemaoperativoversel(data: object) {
    return this.postQuery("inventario/sistemaoperativoversel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsistemaoperativoedisel(data: object) {
    return this.postQuery("inventario/sistemaoperativoedisel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettipoprocesadorsel(data: object) {
    return this.postQuery("inventario/tipoprocesadorsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getunidadmedidasel(data: object) {
    return this.postQuery("inventario/unidadmedidasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettipoalmacenamientosel(data: object) {
    return this.postQuery("inventario/tipoalmacenamientosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getinterfazalmacenamientosel(data: object) {
    return this.postQuery("inventario/interfazalmacenamientosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getformaalmacenamientosel(data: object) {
    return this.postQuery("inventario/formaalmacenamientosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getrecursotarjetavideosel(data: object) {
    return this.postQuery("inventario/recursotarjetavideosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getconectorsel(data: object) {
    return this.postQuery("inventario/conectorsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getconectorvideotiposel(data: object) {
    return this.postQuery("inventario/conectorvideotiposel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettarjetaredadaptadorsel(data: object) {
    return this.postQuery("inventario/tarjetaredadaptadorsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getrecursoalmacenamientosel(data: object) {
    return this.postQuery("inventario/recursoalmacenamientosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getrecursomonitorsel(data: object) {
    return this.postQuery("inventario/recursomonitorsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getmonitortecnologiasel(data: object) {
    return this.postQuery("inventario/monitortecnologiasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getmonitorpanelsel(data: object) {
    return this.postQuery("inventario/monitorpanelsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getrecursotecladosel(data: object) {
    return this.postQuery("inventario/recursotecladosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getconexiontecladosel(data: object) {
    return this.postQuery("inventario/conexiontecladosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getrecursotarjetaredsel(data: object) {
    return this.postQuery("inventario/recursotarjetaredsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketsel(data: object) {
    return this.postQuery("tickets/ticketsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketreg(data: object) {
    return this.postQuery("tickets/ticketreg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketgra(data: object) {
    return this.postQuery("tickets/ticketgra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getteamsel(data: object) {
    return this.postQuery("team/teamsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getstaffsel(data: object) {
    return this.postQuery("team/staffsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  gettopicsel(data: object) {
    return this.postQuery("team/topicsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getusersel(data: object) {
    return this.postQuery("team/usersel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketstatussel(data: object) {
    return this.postQuery("tickets/ticketstatussel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getobtenerip(data: object) {
    return this.getQuery("general/obtenerip").pipe(
      map((data) => {
        return data;
      })
    );
  }

}
