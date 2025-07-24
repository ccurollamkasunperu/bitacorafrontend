import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ROUTES } from "./app.routes";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ChatComponent } from "./components/chat/chat.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoteComponent } from "./pages/lote/lote.component";
import { AgmCoreModule } from "@agm/core";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MantenimientoComponent } from "./pages/mantenimiento/mantenimiento.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { MarcaModeloComponent } from "./pages/marca-modelo/marca-modelo.component";
import { VehiculoComponent } from "./pages/vehiculo/vehiculo.component";
import { ZonaComponent } from "./pages/zona/zona.component";
import { SectorComponent } from "./pages/sector/sector.component";
import { TurnoComponent } from "./pages/turno/turno.component";
import { ParteComponent } from "./pages/parte/parte.component";
import { UsuarioComponent } from "./pages/usuario/usuario.component";
import { RolesComponent } from "./pages/roles/roles.component";
import { PerfilComponent } from "./pages/perfil/perfil.component";
import { ColorVehiculoComponent } from "./pages/color-vehiculo/color-vehiculo.component";
import { GrupoVehiculoComponent } from "./pages/grupo-vehiculo/grupo-vehiculo.component";
import { MarcaVehiculoComponent } from "./pages/marca-vehiculo/marca-vehiculo.component";
import { ModeloVehiculoComponent } from "./pages/modelo-vehiculo/modelo-vehiculo.component";
import { MotivoParteCabComponent } from "./pages/motivo-parte-cab/motivo-parte-cab.component";
import { MotivoParteDetComponent } from "./pages/motivo-parte-det/motivo-parte-det.component";
import { MotivoParteComponent } from "./pages/motivo-parte/motivo-parte.component";
import { PerfilRolComponent } from "./pages/perfil-rol/perfil-rol.component";
import { LoginComponent } from "./pages/login/login.component";
import { IncidenciaComponent } from "./pages/incidencia/incidencia.component";
import { PerfilPermisoComponent } from "./pages/perfil-permiso/perfil-permiso.component";
import { ParteInsComponent } from "./pages/parte-ins/parte-ins.component";
import { TreeviewModule } from "ngx-treeview";
import { IncidenciaInsComponent } from "./pages/incidencia-ins/incidencia-ins.component";
import { ReporteIncidenciaComponent } from "./pages/reporte-incidencia/reporte-incidencia.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ReporteParteComponent } from "./pages/reporte-parte/reporte-parte.component";
import { TipoPersonalComponent } from "./pages/tipo-personal/tipo-personal.component";
import { PersonalComponent } from "./pages/personal/personal.component";
import { RadioComponent } from "./pages/radio/radio.component";
import { AsignarRadioComponent } from "./pages/asignar-radio/asignar-radio.component";
import { NgxPrintModule } from "ngx-print";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CamaraComponent } from './pages/camara/camara.component';
import { VerCamaraComponent } from './pages/ver-camara/ver-camara.component';
import { CamaraInsComponent } from './pages/camara-ins/camara-ins.component';
import { DatePipe } from '@angular/common';
import { IncidenciaUpdComponent } from './pages/incidencia-upd/incidencia-upd.component';
import { DocumentosComponent } from './pages/documentos/documentos.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { DocumentoInsComponent } from './pages/documento-ins/documento-ins.component';
import { PatrimonioComponent } from './pages/patrimonio/patrimonio.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { InventarioInsComponent } from './pages/inventario-ins/inventario-ins.component';
import { ModalColaboradorComponent } from './components/modal-colaborador/modal-colaborador.component';
import { ModalRecursoComponent } from './components/modal-recurso/modal-recurso.component';
import { InventarioFichaComponent } from './pages/inventario-ficha/inventario-ficha.component';
import { ModalAlmacenamientoComponent } from './components/modal-almacenamiento/modal-almacenamiento.component';
import { ModalVideoComponent } from './components/modal-video/modal-video.component';
import { ModalRedComponent } from './components/modal-red/modal-red.component';
import { InventarioMonitorComponent } from './pages/inventario-monitor/inventario-monitor.component';
import { InventarioTecladoComponent } from './pages/inventario-teclado/inventario-teclado.component';
import { ModalMonitorComponent } from './components/modal-monitor/modal-monitor.component';
import { ModalTecladoComponent } from './components/modal-teclado/modal-teclado.component';
import { BitacoraComponent } from './pages/bitacora/bitacora.component';
import { BitacoraInsComponent } from './pages/bitacora-ins/bitacora-ins.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    ChatComponent,
    FooterComponent,
    LoteComponent,
    MantenimientoComponent,
    MarcaModeloComponent,
    VehiculoComponent,
    SectorComponent,
    TurnoComponent,
    ParteComponent,
    UsuarioComponent,
    RolesComponent,
    PerfilComponent,
    ColorVehiculoComponent,
    GrupoVehiculoComponent,
    MarcaVehiculoComponent,
    ModeloVehiculoComponent,
    MotivoParteCabComponent,
    MotivoParteDetComponent,
    MotivoParteComponent,
    PerfilRolComponent,
    LoginComponent,
    IncidenciaComponent,
    PerfilPermisoComponent,
    ParteInsComponent,
    IncidenciaInsComponent,
    ReporteIncidenciaComponent,
    DashboardComponent,
    ReporteParteComponent,
    TipoPersonalComponent,
    PersonalComponent,
    RadioComponent,
    AsignarRadioComponent,
    CamaraComponent,
    VerCamaraComponent,
    CamaraInsComponent,
    ZonaComponent,
    IncidenciaUpdComponent,
    DocumentosComponent,
    ReportesComponent,
    DocumentoInsComponent,
    PatrimonioComponent,
    InventarioComponent,
    InventarioInsComponent,
    ModalColaboradorComponent,
    ModalRecursoComponent,
    InventarioFichaComponent,
    ModalAlmacenamientoComponent,
    ModalVideoComponent,
    ModalRedComponent,
    InventarioMonitorComponent,
    InventarioTecladoComponent,
    ModalMonitorComponent,
    ModalTecladoComponent,
    BitacoraComponent,
    BitacoraInsComponent
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    HttpClientModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    NgxPrintModule,
    NgxDropzoneModule,
    QuillModule.forRoot(),    
    TreeviewModule.forRoot(),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyD5vGKR2yl1fnF1aT6tn-gPxPANhSBBg8Q",
      libraries: ["places"],
    }),
    RouterModule.forRoot(ROUTES, { useHash: false }),
    NgSelectModule,
    FormsModule
  ],
  providers: [NgSelectConfig, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
