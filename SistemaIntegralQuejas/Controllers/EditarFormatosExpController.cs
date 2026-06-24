using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaIntegralQuejas.Models;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using static SistemaIntegralQuejas.Controllers.ExpedienteController;

namespace SistemaIntegralQuejas.Controllers
{
    public class EditarFormatosExpController : Controller
    {
        private SQLMODEL conexionsql = new SQLMODEL();
        // GET: EditarFormatosExpController
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();

            }
            else
            {
                return RedirectToAction("IniciarSesion", "Login");
            }
        }

        // GET: EditarFormatosExpController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        public ActionResult PlantillaDPeticionario()
        {
            return View();
        }
        // GET: EditarFormatosExpController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: EditarFormatosExpController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: EditarFormatosExpController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: EditarFormatosExpController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: EditarFormatosExpController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: EditarFormatosExpController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
        public ActionResult GuardarDataComplPeticionario(IFormCollection form)
        {
            string numFrm = form["numFrm"].ToString();
            string idcomplementopet = form["idcomplementopet1"].ToString();
            int violenciamujer = 0;
            string Canalizaciondepen = "";
            string idEmbarazada = "";
            int idHijosvivos = 7;
            int idModalidadvio = 6;
            int idRelacionagresor = 8;
            string IngresosMensuales = "";
            int idTipoviole = 5;

            string migOrigen = "";
            string migDestino = "";
            string migidPrimeramex = "";

            string tipouser = form["qatu_petit-frmDatosPersonales" + numFrm].ToString();
            string curp = form["CURP_petit-frmDatosPersonales" + numFrm].ToString().ToUpper();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));

            string calle = form["calle_petit-frmDatosPersonales" + numFrm].ToString();
            string nexterior = form["nexterior_petit-frmDatosPersonales" + numFrm].ToString();
            string ninterior = form["ninterior_petit-frmDatosPersonales" + numFrm].ToString();
            string colonia = form["colonia_petit-frmDatosPersonales" + numFrm].ToString();
            string ciudad = form["ciudad_petit-frmDatosPersonales" + numFrm].ToString();
            string municipio = form["municipio_petit-frmDatosPersonales" + numFrm].ToString();
            string estado = form["estado_petit-frmDatosPersonales" + numFrm].ToString();
            string cp = form["cp_petit-frmDatosPersonales" + numFrm].ToString();
            string telefono = form["telefono_petit-frmDatosPersonales" + numFrm].ToString();
            string edad = form["edad_petit-frmDatosPersonales" + numFrm].ToString();
            string email = form["email_petit-frmDatosPersonales" + numFrm].ToString();
            int idSexo = int.Parse(form["radsexo_petit-frmDatosPersonales" + numFrm].ToString());
            string genero = form["genero_petit-frmDatosPersonales" + numFrm].ToString();
            string otroGenero = form["ogenero_petit-frmDatosPersonales" + numFrm].ToString();
            int idEscolaridad = int.Parse(form["escosel_petit-frmDatosPersonales" + numFrm].ToString());
            int idEstadoconyugal = int.Parse(form["econyugal_petit-frmDatosPersonales" + numFrm].ToString());
            int idOcupacion = int.Parse(form["ocupacion_petit-frmDatosPersonales" + numFrm].ToString());
            string Otraocupacion = form["ocupacioninpt_petit-frmDatosPersonales" + numFrm].ToString();
            string nacionalidad = form["chknacionalidad_petit-frmDatosPersonales" + numFrm].ToString();
            string sabeleer = form["chksleer_petit-frmDatosPersonales" + numFrm].ToString();
            int idDiscapacidad = int.Parse(form["discapacidad_petit-frmDatosPersonales" + numFrm].ToString());
            int idGruposocial = int.Parse(form["gsoci_petit-frmDatosPersonales" + numFrm].ToString());
            string otroGruposocial = form["gsociinpt_petit-frmDatosPersonales" + numFrm].ToString();
            string idLenguaindigena = form["leindi_petit-frmDatosPersonales" + numFrm].ToString();
            string otraLenguaindigena = form["oleindi_petit-frmDatosPersonales" + numFrm].ToString();
            string fechanac = form["fenac_petit-frmDatosPersonales" + numFrm].ToString();
            DateTime fechafin = DateTime.ParseExact(fechanac, "yyyy-MM-dd", CultureInfo.InvariantCulture);

            if (nacionalidad == "Extranjero")
            {
                migOrigen = form["migorig_petit-frmDatosPersonales" + numFrm].ToString();
                migDestino = form["migdesti_petit-frmDatosPersonales" + numFrm].ToString();
                migidPrimeramex = form["migprmex_petit-frmDatosPersonales" + numFrm].ToString();
            }

            if (form["radsinoviomu_petit-frmDatosPersonales" + numFrm].ToString() == "Si")
            {
                violenciamujer = 1;

                Canalizaciondepen = form["vmcanadep_petit-frmDatosPersonales" + numFrm].ToString();
                idEmbarazada = form["vmembara_petit-frmDatosPersonales" + numFrm].ToString();
                idHijosvivos = int.Parse(form["vmhijos_petit-frmDatosPersonales" + numFrm].ToString());
                idModalidadvio = int.Parse(form["vmmodvio_petit-frmDatosPersonales" + numFrm].ToString());
                idRelacionagresor = int.Parse(form["vmreviagr_petit-frmDatosPersonales" + numFrm].ToString());
                IngresosMensuales = form["vmingrmen_petit-frmDatosPersonales" + numFrm].ToString();
                idTipoviole = int.Parse(form["vmtvio_petit-frmDatosPersonales" + numFrm].ToString());
            }

            var queryPeticionario = "";
            String query = "";
            int idPetit = 0;

            List<RegRecepcion> peticionariolist = new List<RegRecepcion>();
            List<ComplementoPeticionario> complPeticionariolist = new List<ComplementoPeticionario>();

            // Se obtiene el id del peticionario registrado en la entrada a travez de la CURP o Nombre
            if (curp != "" && curp != "No proporcionado")
            {
                queryPeticionario = "EXEC Sp_GetPeticionarioc " + "'" + curp + "'";
            }
            else
            {
                queryPeticionario = "EXEC Sp_GetPeticionariocXNombre " + "'" + nombre + "'," + "'" + apellidop + "'," + "'" + apellidom + "'";
            }
            var data_abog_dqot = GetDatosGeneral(queryPeticionario);
            foreach (DataRow row in data_abog_dqot.Rows)
            {
                RegRecepcion userItem = new RegRecepcion();
                userItem.IdRegistro = Convert.ToInt32(row["ID_REGISTRO"]);
                peticionariolist.Add(userItem);
            }

            if (peticionariolist.Count > 0)
            {
                idPetit = Convert.ToInt32(peticionariolist[0].IdRegistro);

                // Se actualiza datos del peticionario que ingreso en la entrada si es necesario
                String queryPet = "exec Sp_Update_Peticionario " + idPetit + ",'" + nombre + "','" + apellidop + "','" + apellidom + "', '" + curp + "' ";
                conexionsql.InsertUpdateDelete(queryPet);
            }
            else
            {
                string queryip = "EXEC insertRegistro " +
                                         "'" + nombre + "'," +
                                         "'" + apellidop + "'," +
                                         "'" + apellidom + "'," +
                                         "'" + curp + "', ''";

                idPetit = conexionsql.InsertUpdateDeleteRegresaid(queryip);

            }

            // Se valida si quiere editar el complemento actual de peticionario

            if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
            {
                query = "exec Sp_InsertComplementoPeticionario " +
                "'" + tipouser + "'," +
                "'" + calle + "'," +
                "'" + nexterior + "'," +
                "'" + ninterior + "'," +
                "'" + colonia + "'," +
                "'" + ciudad + "'," +
                "'" + municipio + "'," +
                "'" + estado + "'," +
                "'" + cp + "'," +
                "'" + telefono + "'," +
                "'" + edad + "'," +
                "'" + email + "'," +
                "'" + idSexo + "'," +
                "" + idEscolaridad + "," +
                "" + idEstadoconyugal + "," +
                "" + idOcupacion + "," +
                "'" + Otraocupacion + "'," +
                "'" + nacionalidad + "'," +
                "'" + sabeleer + "'," +
                "" + idDiscapacidad + "," +
                "" + idGruposocial + "," +
                "'" + otroGruposocial + "'," +
                "'" + idLenguaindigena + "'," +
                "'" + otraLenguaindigena + "'," +
                "'" + fechanac + "'," +
                "'" + migOrigen + "'," +
                "'" + migDestino + "'," +
                "'" + migidPrimeramex + "'," +
                "" + violenciamujer + "," +
                "'" + Canalizaciondepen + "'," +
                "'" + idEmbarazada + "'," +
                "" + idHijosvivos + "," +
                "" + idModalidadvio + "," +
                "" + idTipoviole + "," +
                "" + idRelacionagresor + "," +
                "'" + IngresosMensuales + "'," +
                "" + idPetit + "," +
                "'" + genero + "'," +
                "'" + otroGenero + "'";

                //idcompet = conexionsql.InsertUpdateDeleteRegresaid(query); 

            }
            else
            {
                query = "exec Sp_UpdateComplementoPeticionario " +
                  "'" + tipouser + "'," +
                  "'" + calle + "'," +
                  "'" + nexterior + "'," +
                  "'" + ninterior + "'," +
                  "'" + colonia + "'," +
                  "'" + ciudad + "'," +
                  "'" + municipio + "'," +
                  "'" + estado + "'," +
                  "'" + cp + "'," +
                  "'" + telefono + "'," +
                  "'" + edad + "'," +
                  "'" + email + "'," +
                  "'" + idSexo + "'," +
                  "" + idEscolaridad + "," +
                  "" + idEstadoconyugal + "," +
                  "" + idOcupacion + "," +
                  "'" + Otraocupacion + "'," +
                  "'" + nacionalidad + "'," +
                  "'" + sabeleer + "'," +
                  "" + idDiscapacidad + "," +
                  "" + idGruposocial + "," +
                  "'" + otroGruposocial + "'," +
                  "'" + idLenguaindigena + "'," +
                  "'" + otraLenguaindigena + "'," +
                  "'" + fechanac + "'," +
                  "'" + migOrigen + "'," +
                  "'" + migDestino + "'," +
                  "'" + migidPrimeramex + "'," +
                  "" + violenciamujer + "," +
                  "'" + Canalizaciondepen + "'," +
                  "'" + idEmbarazada + "'," +
                  "" + idHijosvivos + "," +
                  "" + idModalidadvio + "," +
                  "" + idTipoviole + "," +
                  "" + idRelacionagresor + "," +
                  "'" + IngresosMensuales + "'," +
                  "" + idcomplementopet + "," +
                  "'" + genero + "'," +
                  "'" + otroGenero + "'";

                //idcompet = conexionsql.InsertUpdateDeleteRegresaid(query);

            }

            return Json(new { idcomplemento = conexionsql.InsertUpdateDeleteRegresaid(query), idpeticionario = idPetit, idqueja = 1, tipousuario = tipouser });

        }
        public ActionResult GetDataPeticionario(IFormCollection form)
        {

            string curp = form["curp"].ToString();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre"].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop"].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom"].ToString().ToLower()));

            String query = "";
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();

            if (curp != "" && curp != "No proporcionado")
            {
                query = "exec Sp_GetDataPeticionario " + "'" + curp.ToUpper() + "'";
            }
            else
            {
                query = "exec Sp_GetDataPeticionarioXNombre " + "'" + nombre + "'," + "'" + apellidop + "'," + "'" + apellidom + "'";
            }

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                PdfDatosPeticionario peticionario = new PdfDatosPeticionario();
                peticionario.IdComplementoPeticionario = Convert.ToInt32(row["ID_COMPLEMENTO_PETICIONARIO"]);
                peticionario.FkRegRecepcion = Convert.ToInt32(row["FK_REG_RECEPCION"]);
                peticionario.Nombre = (row["NOMBRE"]).ToString();
                peticionario.ApellidoPat = (row["APELLIDO_PAT"]).ToString();
                peticionario.ApellidoMat = (row["APELLIDO_MAT"]).ToString();
                peticionario.DocIdentificatorio = (row["DOC_IDENTIFICATORIO"]).ToString();
                peticionario.CodigoPostal = (row["CODIGO_POSTAL"]).ToString();
                peticionario.Colonia = (row["COLONIA"]).ToString();
                peticionario.Ciudad = (row["CIUDAD"]).ToString();
                peticionario.Municipio = (row["MUNICIPIO"]).ToString();
                peticionario.Estado = (row["ESTADO"]).ToString();
                peticionario.Calle = (row["CALLE"]).ToString();
                peticionario.NumExterior = (row["NUM_EXTERIOR"]).ToString();
                peticionario.NumInterior = (row["NUM_INTERIOR"]).ToString();
                peticionario.FechaNacimiento = Convert.ToDateTime(row["FECHA_NACIMIENTO"]);
                peticionario.Edad = (row["EDAD"]).ToString();
                peticionario.Telefono = (row["TELEFONO"]).ToString();
                peticionario.Email = (row["EMAIL"]).ToString();
                peticionario.TipoUsuario = (row["TIPO_USUARIO"]).ToString();
                peticionario.FkSexo = Convert.ToInt32(row["FK_SEXO"]);
                peticionario.Nacionalidad = (row["NACIONALIDAD"]).ToString();
                peticionario.SabeLeer = (row["SABE_LEER"]).ToString();
                peticionario.FkEscolaridad = Convert.ToInt32(row["FK_ESCOLARIDAD"]);
                peticionario.FkEstadoConyugal = Convert.ToInt32(row["FK_ESTADO_CONYUGAL"]);
                peticionario.FkOcupacion = Convert.ToInt32(row["FK_OCUPACION"]);
                peticionario.OtraOcupacion = (row["OTRA_OCUPACION"]).ToString();
                peticionario.FkDiscapacidad = Convert.ToInt32(row["FK_DISCAPACIDAD"]);
                peticionario.FkGrupoSocial = Convert.ToInt32(row["FK_GRUPO_SOCIAL"]);
                peticionario.OtroGsocial = (row["OTRO_GSOCIAL"]).ToString();
                peticionario.HablaLenguai = (row["HABLA_LENGUAI"]).ToString();
                peticionario.LenguaIndigena = (row["LENGUA_INDIGENA"]).ToString();
                peticionario.OrigenMigrante = (row["ORIGEN_MIGRANTE"]).ToString();
                peticionario.DestinoMigrante = (row["DESTINO_MIGRANTE"]).ToString();
                peticionario.PrimeravmexMigrante = (row["PRIMERAVMEX_MIGRANTE"]).ToString();
                peticionario.ViolenciaVm = Convert.ToInt32(row["VIOLENCIA_VM"]);
                peticionario.CanalizacionVm = (row["CANALIZACION_VM"]).ToString();
                peticionario.EmbarazadaVm = (row["EMBARAZADA_VM"]).ToString();
                peticionario.IngresosMensuales = (row["INGRESOS_MENSUALES"]).ToString();
                peticionario.FkHijosVivos = Convert.ToInt32(row["FK_HIJOS_VIVOS"]);
                peticionario.FkModalidadViolencia = Convert.ToInt32(row["FK_MODALIDAD_VIOLENCIA"]);
                peticionario.FkTipoViolencia = Convert.ToInt32(row["FK_TIPO_VIOLENCIA"]);
                peticionario.FkRelacionAgresor = Convert.ToInt32(row["FK_RELACION_AGRESOR"]);
                peticionario.Genero = (row["GENERO"]).ToString();
                peticionario.OtroGenero = (row["OTRO_GENERO"]).ToString();
                lPeticionario.Add(peticionario);

            }



            return Json(new { data = lPeticionario });

        }
        private DataTable GetDatosGeneral(string query)
        {

            DataTable dataTable = new DataTable();

            using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            dataTable.Load(reader);
                        }
                    }

                    return dataTable;
                }
                catch (Exception ex)
                {
                    throw;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        // Lista Escolaridad
        public ActionResult SelectEscolaridad()
        {
            List<GeneralModel.Selectmaster> escolaridadl = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_ESCOLARIDAD";
            string mensaje = "";
            escolaridadl = conexionsql.selectMaestro(query, ref mensaje);

            if (escolaridadl.Count > 0)
            {
                return Json(new { escolaridad = escolaridadl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }

        // Lista Escolaridad
        public ActionResult SelectEstadoConyugal()
        {
            List<GeneralModel.Selectmaster> estadoconyugall = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_ESTADO_CONYUGAL";
            string mensaje = "";
            estadoconyugall = conexionsql.selectMaestro(query, ref mensaje);

            if (estadoconyugall.Count > 0)
            {
                return Json(new { estadoconyugal = estadoconyugall });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Escolaridad

        // Lista Ocupacion
        public ActionResult SelectOcupacion()
        {
            List<GeneralModel.Selectmaster> ocupacionl = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_OCUPACION";
            string mensaje = "";
            ocupacionl = conexionsql.selectMaestro(query, ref mensaje);

            if (ocupacionl.Count > 0)
            {
                return Json(new { ocupacion = ocupacionl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Ocupacion

        // Lista Discapacidad
        public ActionResult SelectDiscapacidad()
        {
            List<GeneralModel.Selectmaster> discapacidadl = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_DISCAPACIDAD";
            string mensaje = "";
            discapacidadl = conexionsql.selectMaestro(query, ref mensaje);

            if (discapacidadl.Count > 0)
            {
                return Json(new { discapacidad = discapacidadl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Discapacidad

        // Lista Grupo Social
        public ActionResult SelectGrupoSocial()
        {
            List<GeneralModel.Selectmaster> gruposociall = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_GRUPO_SOCIAL";
            string mensaje = "";
            gruposociall = conexionsql.selectMaestro(query, ref mensaje);

            if (gruposociall.Count > 0)
            {
                return Json(new { gruposocial = gruposociall });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Grupo Social

        // Lista Hijos vivos peticionario
        public ActionResult SelectHijosVivos()
        {
            List<GeneralModel.Selectmaster> hijosvivosl = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_HIJOS_VIVOS";
            string mensaje = "";
            hijosvivosl = conexionsql.selectMaestro(query, ref mensaje);

            if (hijosvivosl.Count > 0)
            {
                return Json(new { hijosvivos = hijosvivosl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Hijos vivos peticionario

        // Lista Modalidada Violencia
        public ActionResult SelectModalidadViolencia()
        {
            List<GeneralModel.Selectmaster> modalidadviolencial = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_MODALIDAD_VIOLENCIA";
            string mensaje = "";
            modalidadviolencial = conexionsql.selectMaestro(query, ref mensaje);

            if (modalidadviolencial.Count > 0)
            {
                return Json(new { modalidadviolencia = modalidadviolencial });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Modalidada Violencia

        // Lista Tipo Violencia
        public ActionResult SelectTipoViolencia()
        {
            List<GeneralModel.Selectmaster> tipoviolencial = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_TIPO_VIOLENCIA";
            string mensaje = "";
            tipoviolencial = conexionsql.selectMaestro(query, ref mensaje);

            if (tipoviolencial.Count > 0)
            {
                return Json(new { tipoviolencia = tipoviolencial });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Tipo Violencia

        // Lista Relacion Agresor
        public ActionResult SelectRelacionAgresor()
        {
            List<GeneralModel.Selectmaster> relacionagresorl = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_RELACION_AGRESOR";
            string mensaje = "";
            relacionagresorl = conexionsql.selectMaestro(query, ref mensaje);

            if (relacionagresorl.Count > 0)
            {
                return Json(new { relacionagresor = relacionagresorl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Relacion Agresor 
        // Lista Paises
        public ActionResult SelectPaises()
        {
            List<GeneralModel.Selectmaster> relacionpais = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_PAISES";
            string mensaje = "";
            relacionpais = conexionsql.selectMaestro(query, ref mensaje);

            if (relacionpais.Count > 0)
            {
                return Json(new { relacionpaises = relacionpais });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Paises 
        public ActionResult selectsCreacionExpediente()
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();

            String query = "exec Sp_Select_Abogado";
            string mensaje = "";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);

            query = "exec Sp_Select_EstadoRM";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);



            if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista2 = listaContenedora2,
                        lista3 = listaContenedora3,
                        lista4 = listaContenedora4,
                        lista5 = listaContenedora5
                    });
            }
            else
            {
                // ViewData["Mensaje"] = "Error al Accesar";

                return Json(new { mensaje = "error" + mensaje });
                //return View();
            }
        }
        // Fin Lista Escolaridad

    }
}
