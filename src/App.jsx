//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';


// UIS ADMIN
import AgregarContador from 'ui/Administrador/contadores/agregarContador/AgregarContador';
import ListarContadores from 'ui/Administrador/contadores/listarContadores/ListarContadores';
import EditarContador from 'ui/Administrador/contadores/editarContador/EditarContador';

import AgregarJefeContabilidad from 'ui/Administrador/jefesContabilidad/agregarJefeContabilidad/AgregarJefeContabilidad';
import ListarJefesContabilidad from 'ui/Administrador/jefesContabilidad/listarJefeContabilidad/ListarJefesContabilidad';
import EditarJefeContabilidad from 'ui/Administrador/jefesContabilidad/editarJefeContabilidad/EditarJefeContabilidad';

// UIS CONTADOR
import AgregarCategoria from 'ui/Contador/categorias/agregarCategoria/AgregarCategoria';
import ListarCategorias from 'ui/Contador/categorias/listarCategorias/ListarCategorias';
import EditarCategoria from 'ui/Contador/categorias/editarCategoria/EditarCategoria';

import AgregarEgreso from 'ui/Contador/egresos/agregarEgreso/AgregarEgreso';
import ListarEgresos from 'ui/Contador/egresos/listarEgresos/ListarEgresos';
import EditarEgreso from 'ui/Contador/egresos/editarEgreso/EditarEgreso';

import RegistrarCuentaPorPagar from 'ui/Contador/cuentasporpagar/registrarCuentaPorPagar/RegistrarCuentaPorPagar';
import ListarCuentasPorPagar from 'ui/Contador/cuentasporpagar/listarCuentasPorPagar/ListarCuentasPorPagar';

// UIS JEFE CONTABILIDAD
import AgregarProveedor from 'ui/JefeContabilidad/proveedores/agregarProveedor/AgregarProveedor';
import ListarProveedores from 'ui/JefeContabilidad/proveedores/listarProveedor/ListarProveedores';
import EditarProveedor from 'ui/JefeContabilidad/proveedores/editarProveedor/EditarProveedor';


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRouteContador from 'utilities/ProtectedRoutes/ProtectedRouteContador';
import ProtectedRouteJefeContabilidad from 'utilities/ProtectedRoutes/ProtectedRouteJefeContabilidad';
import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';



function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<ProtectedRouteHome element={<Login />} />}
      />

      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteAdmin element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<Home />} />

      {/*  RUTAS CRUD CONTADOR*/}
        {/* Ruta Agregar Contador */}
        <Route path="agregar-contador" element={<AgregarContador />} />
        {/* Ruta Listar Contadores */}
        <Route path="listar-contadores" element={<ListarContadores />} />
        {/* Ruta Editar Contador */}
        <Route path="editar-contador/:id" element={<EditarContador />} />

      {/*  RUTAS CRUD JEFE CONTABILIDAD*/}
        {/* Ruta Agregar Jefe Contabilidad */}
        <Route path="agregar-jefe-contabilidad" element={<AgregarJefeContabilidad />} />
        {/* Ruta Listar Jefes Contabilidad */}
        <Route path="listar-jefes-contabilidad" element={<ListarJefesContabilidad />} />
        {/* Ruta Editar Jefe Contabilidad */}
        <Route path="editar-jefe-contabilidad/:id" element={<EditarJefeContabilidad />} />



      </Route>



      {/* RUTAS CONTADOR */}
      <Route
        path="/contador"
        element={
          <ProtectedRouteContador element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /usuario) */}
        <Route index element={<Home />} />

      {/*  RUTAS CRUD CATEGORIAS */}
        {/* Ruta Agregar Categoría */}
        <Route path="agregar-categoria" element={<AgregarCategoria />} />
        {/* Ruta Listar Categorías */}
        <Route path="listar-categorias" element={<ListarCategorias />} />
        {/* Ruta Editar Categoría */}
        <Route path="editar-categoria/:id" element={<EditarCategoria />} />

      {/*  RUTAS CRUD EGRESOS */}
        {/* Ruta Agregar Egreso */}
        <Route path="agregar-egreso" element={<AgregarEgreso />} />
        {/* Ruta Listar Egresos */}
        <Route path="listar-egresos" element={<ListarEgresos />} />
        {/* Ruta Editar Egreso */}
        <Route path="editar-egreso/:id" element={<EditarEgreso />} />

      {/*  RUTAS CRUD CUENTAS POR PAGAR */}
        {/* Ruta Registrar Cuenta por Pagar */}
        <Route path="egreso/registrar-cuenta-por-pagar/:id" element={<RegistrarCuentaPorPagar />} />
        {/* Ruta Listar Cuentas por Pagar */}
        <Route path="listar-cuentas-por-pagar" element={<ListarCuentasPorPagar />} />

      </Route>


      {/* RUTAS JEFE CONTABILIDAD */}
      <Route
        path="/jefe_contabilidad"
        element={
          <ProtectedRouteJefeContabilidad element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /jefe_contabilidad) */}
        <Route index element={<Home />} />

      {/*  RUTAS CRUD PROVEEEDORES */}
        {/* Ruta Agregar Proveedor */}
        <Route path="agregar-proveedor" element={<AgregarProveedor />} />
        {/* Ruta Listar Proveedor */}
        <Route path="listar-proveedores" element={<ListarProveedores />} />
        {/* Ruta Editar Proveedor */}
        <Route path="editar-proveedor/:id" element={<EditarProveedor />} />

      </Route>




      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;