import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { ReportesComponent } from "./pages/reportes/reportes.component";
import { PatrimonioComponent } from "./pages/patrimonio/patrimonio.component";
import { InventarioComponent } from "./pages/inventario/inventario.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { InventarioInsComponent } from "./pages/inventario-ins/inventario-ins.component";
import { InventarioFichaComponent } from "./pages/inventario-ficha/inventario-ficha.component";
import { InventarioMonitorComponent } from "./pages/inventario-monitor/inventario-monitor.component";
import { InventarioTecladoComponent } from "./pages/inventario-teclado/inventario-teclado.component";

import { BitacoraComponent } from "./pages/bitacora/bitacora.component";
import { BitacoraInsComponent } from "./pages/bitacora-ins/bitacora-ins.component";

export const ROUTES: Routes = [
  { path: "bitacora", component: BitacoraComponent },
  { path: "bitacora-ins", component: BitacoraInsComponent },
  { path: "patrimonio", component: PatrimonioComponent },
  { path: "inventario", component: InventarioComponent },
  { path: "inventario-ins", component: InventarioInsComponent },
  { path: "inventario-ficha/:idrec", component: InventarioFichaComponent },
  { path: "inventario-monitor/:idrec", component: InventarioMonitorComponent },
  { path: "inventario-teclado/:idrec", component: InventarioTecladoComponent },
  { path: "reportes", component: ReportesComponent },
  { path: "dashboard", component: DashboardComponent },

  /* 
  { path: "documentos-ins", component: DocumentoInsComponent },
  { path: "documentos-ins/:id", component: DocumentoInsComponent },
  { path: "reportes", component: ReportesComponent },

  { path: "marca-modelo", component: MarcaModeloComponent },
  { path: "vehiculo", component: VehiculoComponent },
  { path: "zona", component: ZonaComponent },
  { path: "sector", component: SectorComponent },
  { path: "turno", component: TurnoComponent },
  { path: "parte", component: ParteComponent },
  { path: "incidencia", component: IncidenciaComponent },
  { path: "lote", component: LoteComponent },
  { path: "usuario", component: UsuarioComponent },
  { path: "roles", component: RolesComponent },
  { path: "perfil", component: PerfilComponent },
  { path: "color-vehiculo", component: ColorVehiculoComponent },
  { path: "grupo-vehiculo", component: GrupoVehiculoComponent },
  { path: "reporte-incidencia", component: ReporteIncidenciaComponent },
  { path: "marca-vehiculo", component: MarcaVehiculoComponent },
  { path: "modelo-vehiculo", component: ModeloVehiculoComponent },
  { path: "motivo-parte", component: MotivoParteComponent },
  { path: "motivo-parte-cab", component: MotivoParteCabComponent },
  { path: "motivo-parte-det", component: MotivoParteDetComponent },
  { path: "perfil-rol", component: PerfilRolComponent },
  { path: "permiso", component: PerfilPermisoComponent },
  { path: "parte-ins/:inc_id", component: ParteInsComponent },
  { path: "incidencia-ins", component: IncidenciaInsComponent },
  { path: "reporte-parte", component: ReporteParteComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "tipo-personal", component: TipoPersonalComponent },
  { path: "personal", component: PersonalComponent },
  { path: "radio", component: RadioComponent },
  { path: "camara", component: CamaraComponent },
  { path: "asignar-radio", component: AsignarRadioComponent },
  { path: "ver-camara", component: VerCamaraComponent },
  { path: "camara-ins", component: CamaraInsComponent },
  { path: "incidencia-upd/:inc_id", component: IncidenciaUpdComponent }, 
   */

  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent },
  // { path: "", pathMatch: "full", redirectTo: "login" },
  // { path: "**", pathMatch: "full", redirectTo: "login" },
];
