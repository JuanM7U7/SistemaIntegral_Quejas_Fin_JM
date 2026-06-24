using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SistemaIntegralQuejas.Models;
using System.Data;
using System.Globalization;
using System.Data.SqlClient;
using static SistemaIntegralQuejas.Controllers.ExpedienteController;
using System.Net.Sockets;
using System.IO;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Collections;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Security.Policy;
using Rotativa.AspNetCore;

namespace SistemaIntegralQuejas.Controllers
{

    public class AltaExpedienteController : Controller
    {
        private SQLMODEL conexionsql = new SQLMODEL();
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GuardarQueja(IFormCollection form)
        {
            int idqueja=99, abogadoqueja = 99, estadoqueja = 99, municipioqueja = 99, visitaduriaqueja = 99, sederegistro = 99,viainter=99;
            string hechos = "", nombrequejoso = "", apellidos = "", curp = "", fecharegistro = "", observaciones = "",abogadobitacora="",estadobicatcora="",municipiobitacora="",sederegistrobitacora="",viainterposbitacora="";

            idqueja = int.Parse(form["idquejaDC"]);
            abogadoqueja = int.Parse(form["Abogadoqueja"]);

             
            hechos = form["hechosDC"].ToString();

            if (hechos == "") 
            {
                hechos = form["hechos"].ToString();
            }
           // estadoqueja= int.Parse(form["estadoqueja"]);
            municipioqueja = int.Parse(form["municipioqueja"]);
            nombrequejoso = form["nombrequejoso"].ToString();
            apellidos = form["Apellidos"].ToString();
            curp = form["curp"].ToString();
            //visitaduriaqueja= int.Parse(form["visitaduriaqueja"]);
            fecharegistro = form["Fecha_Registro"].ToString();
            sederegistro = int.Parse(form["sedeRegistro"]);
			viainter = int.Parse(form["viainterpos"]);
            observaciones = form["observaciones"].ToString();

            string  query = "exec Sp_InsertQueja " +
            "" + idqueja + "," +
            "" + abogadoqueja + "," +
            "'" + hechos + "'," +
            "" + estadoqueja + "," +
            "" + municipioqueja + "," +
           // "'" + nombrequejoso + "'," +
           // "'" + apellidos + "'," +
           // "'" + curp + "'," +
            "" + visitaduriaqueja + "," +//<<-- este no va en la bitacora ya que está vacio
            "'" + fecharegistro + "'," +
             "" + sederegistro + ","+
             "" + viainter + ","+
            "'" + observaciones + "';";


            ArrayList lista = new ArrayList();

            abogadobitacora = form["abogado_desc"].ToString();
            estadobicatcora= form["estadoqueja_desc"].ToString();
            municipiobitacora= form["municipioqueja_desc"].ToString();
            sederegistrobitacora= form["sederegistro_desc"].ToString();
            viainterposbitacora= form["viainterdesc"].ToString();



            lista.Add(abogadobitacora);
            lista.Add(hechos);
           // lista.Add(estadobicatcora);
            lista.Add(municipiobitacora);
            lista.Add(fecharegistro);
            lista.Add(sederegistrobitacora);
            lista.Add(viainterposbitacora);
            lista.Add(observaciones);

            if (existecomplementoqueja(idqueja))
            {
                ArrayList listavalores = new ArrayList();
                listavalores = getComplementoQuejaBitacora(idqueja);
                ArmaBitacoraModificaComplementoqueja(lista, listavalores, idqueja.ToString());
            }
            else
            {
                ArmaBItacoraComplementoqueja(lista, idqueja.ToString());
            }

            return Json(new { estatus = conexionsql.InsertUpdateDelete(query)});
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



        public ArrayList getComplementoQuejaBitacora(int idqueja)
        {
            List <bitacoraComplementoqueja> complementoqueja = new List<bitacoraComplementoqueja> ();
            ArrayList listadoGeneral = new ArrayList();

           string query = "SP_regresainformacionBitacoraComplementoQueja "+ idqueja;
            string mensaje = "ok";
            var data = GetDatosGeneral(query);

            complementoqueja = ObtenerlistComplemento(data);

            foreach (bitacoraComplementoqueja item in complementoqueja)
            {
                listadoGeneral.Add(item.idAbogado);
                listadoGeneral.Add(item.Hechos);
                listadoGeneral.Add(item.municipio);
                listadoGeneral.Add(item.Fecha_registro);
                listadoGeneral.Add(item.id_sede);
                listadoGeneral.Add(item.id_via_interpos);
                listadoGeneral.Add(item.observaciobes);
            }

            return listadoGeneral;
        }


        public List<bitacoraComplementoqueja> ObtenerlistComplemento(DataTable data)
        {
            List<bitacoraComplementoqueja> lEscritoI = new List<bitacoraComplementoqueja>();
            string query_archivosadj = "";
            foreach (DataRow row in data.Rows)
            {
                bitacoraComplementoqueja escritoitem = new bitacoraComplementoqueja();
                escritoitem.idAbogado = Convert.ToInt32(row["id_abogado_recibe"].ToString());
                escritoitem.Hechos = (row["hechos"]).ToString();
                escritoitem.paso = (row["paso"]).ToString();
                escritoitem.municipio = row["estado"].ToString();
                escritoitem.Fecha_registro = row["fecha_registrro"].ToString();
                escritoitem.id_sede = int.Parse((row["id_sede"]).ToString());
                escritoitem.id_via_interpos = int.Parse(row["id_via_interposicion"].ToString());
                escritoitem.observaciobes = (row["observaciones"]).ToString();
                
                lEscritoI.Add(escritoitem);
            }

            return lEscritoI;

        }



        public bool existecomplementoqueja(int id_queja)
        {
            bool existecomplementoqueja = false;
            string query = "exec Sp_Verificar_primerComplementoQueja " + id_queja;

            int estado = int.Parse(conexionsql.ObtenerReader(query));

            if (estado > 0)
            {
                existecomplementoqueja = true;
            }


            return existecomplementoqueja;
        }

        public string ArmaBitacoraModificaComplementoqueja(ArrayList arregloValoresActuales, ArrayList arregloValoresanteriores, string id_queja)
        {
            string mensaje = "";


            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Modificación";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();
            bool problemas = false;
            ArrayList nombre_Campos = new ArrayList
            {
                "Abogado que recibe",
                "Hechos",
                "Lugar de los Hechos",
                "Fecha y hora de registro",
                "Sede de registro",
                "Vía de interposición",
                "Observaciones"
            };
            int id_quejaR = 0;

            for (int i = 0; i < arregloValoresActuales.Count; i++)
            {
                if (arregloValoresanteriores[i].ToString() != arregloValoresActuales[i].ToString())
                {
                    ContBitacora(txtcontBuilder, "Complemento de queja", tipoMod, nombre_Campos[i].ToString(), arregloValoresanteriores[i].ToString(), arregloValoresActuales[i].ToString(), Ipaccesible);
                }
            }

            //Crear_Bitacora

            if (id_queja == "")
            {
                id_quejaR = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE")); //Obtener el Número de expediente
            }
            else
            {
                id_quejaR = Convert.ToInt32(id_queja);// Genera el que está
            }
            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString()); // Crea la Bitácora

            return mensaje;
        }     
        public string ArmaBItacoraComplementoqueja(ArrayList arregloValores,string id_queja)
        {
            string mensaje = "";
            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Alta";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();
            bool problemas = false;
            // "id del escritoinicial", "fecha de Hechos", "lugar_hechos", "Calle", "Num. Ext", "Num. Int", "CP", "Colonia", "Circunstancias Hechos" };
            ArrayList nombre_Campos = new ArrayList
            {
                "Abogado que recibe",
                "Hechos",
                "Lugar de los hechos",
                "Fecha y hora de registro",
                "Sede de registro",
                "VÍa de interposición",
                "Observaciones"

            };
            int id_quejaR = 0;

            for (int i = 0; i < arregloValores.Count; i++)
            {
                if (arregloValores[i].ToString() != "-")
                {
                    ContBitacora(txtcontBuilder, "Complemento de queja", tipoMod, nombre_Campos[i].ToString(), "-", arregloValores[i].ToString(), Ipaccesible);
                }
            }

            //Crear_Bitacora

            if (id_queja == "")
            {
                id_quejaR = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE")); //Obtener el Número de expediente
            }
            else
            {
                id_quejaR = Convert.ToInt32(id_queja);// Genera el que está
            }
            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString()); // Crea la Bitácora

            return mensaje;
        }
        public void CrearBitacoraTXT(int idqueja, string contenido)
        {
            string rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Archivos\Bitacora", idqueja + ".txt");
            try
            {
                string directorio = Path.GetDirectoryName(rutaArchivo);
                if (!Directory.Exists(directorio))
                {
                    Directory.CreateDirectory(directorio);
                }
                List<BitacoraCambio> listaBit;

                if (System.IO.File.Exists(rutaArchivo) && new FileInfo(rutaArchivo).Length > 0)
                {
                    string contExis = System.IO.File.ReadAllText(rutaArchivo);
                    listaBit = JsonConvert.DeserializeObject<List<BitacoraCambio>>(contExis);
                }
                else
                {
                    listaBit = new List<BitacoraCambio>();
                }
                if (contenido != "")
                {
                    var lista = "[" + contenido + "]";
                    var newCont = JsonConvert.DeserializeObject<List<BitacoraCambio>>(lista);
                    listaBit.AddRange(newCont);
                }
                string newContJSON = JsonConvert.SerializeObject(listaBit, Formatting.Indented);
                System.IO.File.WriteAllText(rutaArchivo, newContJSON);
                //System.IO.File.AppendAllText(rutaArchivo, contenido);
            }
            catch (Exception ex)
            {
            }
        }

        public AltaExpedienteController(IWebHostEnvironment hostingEnvironment, IHttpContextAccessor httpContextAccessor)
        {

            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public void ContBitacora(StringBuilder txtcontBuilder, string apartado, string tipo, string campo, string antes, string despues, string ip)
        {
            var usuario = _httpContextAccessor.HttpContext.User;

            DateTime FechaHora = DateTime.Now;
            txtcontBuilder.Append("{\"Apartado\":").Append("\"" + apartado + "\"")
                .Append(",\"Tipo\":").Append("\"" + tipo + "\"")
                .Append(",\"Campo\":").Append("\"" + campo + "\"")
                .Append(",\"Antes\":").Append("\"" + antes + "\"")
                .Append(",\"Despues\":").Append("\"" + despues + "\"")
                .Append(",\"FechaHora\":").Append("\"" + FechaHora.ToString("yyyy-MM-dd HH:mm:ss") + "\"")
                .Append(",\"Usuario\":").Append("\"" + usuario.Identity.Name + "\"")
                .Append(",\"IP\":").Append("\"" + ip + "\"").Append("},");
        }
        public async Task<ActionResult> RegresaListaCatalogos(int identificadorQueja)
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();



            String query = "exec Sp_Select_Abogado";
            String query1 = "";
            String query2 = "";
            string mensaje = "";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_EstadoRM";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_sedes";
            listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_visitadurias";
            listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_ViaInterposicionQ";
            listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            /*Cargar informacion dentro de las pantallas*/
            query = "exec Sp_carga_informacion_Complementaria '"+ identificadorQueja + "'";
			query1 = "exec Sp_carga_informacion_Complementaria_peticionario '"+ identificadorQueja + "'";
            query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
            informacioncomplementaria = conexionsql.datoscomplementarios(query, ref mensaje,query1, query2);
            /*Cargar informacion dentro de las pantallas*/
            
            if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista_abogado = listaContenedora2,
                        lista_estado = listaContenedora3,
                        lista_municipio = listaContenedora4,
                        lista_autoridad = listaContenedora5,
                        lista_sedes = listaContenedora6,
                        listavisitadurias = listaContenedora7,
                        informarcionC=informacioncomplementaria,
                        listavi= listaContenedora8
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }

        public async Task<ActionResult> RegresaListaCatalogosCalf(int identificadorQueja, string version, int candado)
        {
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();
            List<espedientetema> informaciontemaexped = new List<espedientetema>();
            List<inforaportaciones> infoaportacioness = new List<inforaportaciones>();
            List<SelectGenerico> paso = new List<SelectGenerico>();
            validaIinfoDQOT datValDQOT = new validaIinfoDQOT();


            String query = "exec Sp_Select_Abogado";
            String query1 = "";
            String query2 = "";
            string mensaje = "";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_EstadoRM";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_sedes";
            listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_visitadurias";
            listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_ViaInterposicionQ";
            listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            /*Cargar informacion dentro de las pantallas*/
            query = "exec Sp_carga_info_Comp_Calif_DQOT '" + identificadorQueja + "','" + version + "', '" + "'";
            query1 = "exec Sp_carga_informacion_Complementaria_peticionario '" + identificadorQueja + "'";
            query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
            informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
            /*Cargar informacion dentro de las pantallas*/
            if (informacioncomplementaria.tipo_expediente == 1)
            {
                query = "exec Sp_Select_Aporta ''," + identificadorQueja;
            }
            else
            {
                query = "exec Sp_Select_Aporta "+ identificadorQueja +", ''";
            }
            infoaportacioness = conexionsql.Obtaport(query, ref mensaje);

            #region CONFIRMACION DE DATOS DQO
            query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
            query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + ", 'DQO'"; //JM
            datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
            #endregion

            query = "EXEC Sp_expe_tema '" + identificadorQueja + "'";
            informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

			query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
			paso = conexionsql.lista_SelectGenerica(query, ref mensaje); 

			if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista_abogado = listaContenedora2,
                        lista_estado = listaContenedora3,
                        lista_municipio = listaContenedora4,
                        lista_autoridad = listaContenedora5,
                        lista_sedes = listaContenedora6,
                        listavisitadurias = listaContenedora7,
                        informarcionC = informacioncomplementaria,
                        infoaportaciones = infoaportacioness,
                        lista_tema_expe = informaciontemaexped,
                        listavi = listaContenedora8,
                        datvaldqot= datValDQOT
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }

        ///21 07 2025: Ejectua el procedimiento almacenado para obtener las sedes, utilizaod en el form de Aportacion
        [HttpGet]
        public IActionResult ObtenerListaSedes()
        {
            string mensaje = "";
            string query = "exec Sp_Select_sedes";
            var listaSedes = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);

            if (listaSedes != null && listaSedes.Count > 0)
            {
                return Json(new { lista_sedes = listaSedes });
            }
            else
            {
                return Json(new { mensaje = "Error al obtener sedes: " + mensaje });
            }
        }

        //  Adair 25 09 2025 - metodos copiados del respaldo
        [HttpGet]
        public IActionResult ObtenerListaPaises()
        {
            string mensaje = "";
            string query = "exec Sp_Select_paises";
            var listaPaises = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);

            if (listaPaises != null && listaPaises.Count > 0)
            {
                return Json(new { lista_paises = listaPaises });
            }
            else
            {
                return Json(new { mensaje = "Error al obtener paises: " + mensaje });
            }
        }

        [HttpGet]
        public IActionResult ObtenerListaEstados()
        {
            string mensaje = "";
            string query = "exec Sp_Select_estados";
            var listaEstados = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);

            if (listaEstados != null && listaEstados.Count > 0)
            {
                return Json(new { lista_estados = listaEstados });
            }
            else
            {
                return Json(new { mensaje = "Error al obtener estados: " + mensaje });
            }
        }
        //metodos para actualizar e insertar las cedulas de calificacion, tambien el eliminar los id generales adair 16/12/2025

       
        // El metodo recibe un formData y envia la info a un procedimiento almacenado que realiza una edicion o una insercion de rgistro en la tabla deseada
        [HttpPost]
        public JsonResult GuardarEditarCedula(IFormCollection data)
        {
            Console.WriteLine(data);
            try
            {
                //  Datos del formulario 
                string tablaReferencia = data["tablaReferencia"]; // ORIENTACION, REMISION etc (debe coincidir con los nombres de las tablas de cedulas)
                int idEscrito = 0;
                int.TryParse(data["Input_ID"], out idEscrito);
                //int? idEscrito = null;
                //if (int.TryParse(data["Input_ID"], out int temp))
                //{
                //    idEscrito = temp;
                //}
                string idExp = idEscrito.ToString();
                string folio = data["Input_folio_C"];
                string lugarHechos = data["Input_LugarHechosDescripcion_C"];
                string fechaRecepcion = data["Input_FechaRecepcion_C"];
                string horaRecepcion = data["Input_HoraRecepcion_C"];
                string autoridad = data["Input_autoridadresp_C"];
                string institucion = data["Input_institucion_C"];
                string explicacion = data["ExplicacionCedula"];
                string sedeRegistro = data["sedeRegistro_C"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario_C"];
                string remitente = data["nomAbogado"];

                string Expediente = data["Input_ExpedienteAportacion_C"];
                string numOficio = data["Input_numOficio_C"];
                //  Datos personales ocultos 
                string tipoUsuario = data["tipo_usuario"];
                string edadStr = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                int IdPersonas = 0;
                if (!string.IsNullOrWhiteSpace(data["id_personas"]))
                {
                    int.TryParse(data["id_personas"], out IdPersonas);
                }
                // Bandera "documento" indica la persona que hizo la alta de cedula
                string documento = data["documento"];
                DateTime fecha = DateTime.Now;
                //  Documento 
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                // Se envia id escrito, si es una aportacion enviara el valor por defecto (0)
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                // En caso de haber un valor en el campo expediente lo envia, sino envia null
                                if (string.IsNullOrWhiteSpace(Expediente))
                                {
                                    cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Expediente", Expediente);
                                }
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", tablaReferencia);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                //// === Consulta Id_aportacion con el nuevo SP ===
                int? Id_aportacion = null;

                // Solo ejecutar este bloque si la tablaReferencia es "APORTACION"
                if (tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase))
                {
                    using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                    {
                        conn.Open();
                        using (SqlCommand cmd = new SqlCommand("Sp_IdAportacion", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Expediente",
                                string.IsNullOrWhiteSpace(Expediente) ? (object)DBNull.Value : Expediente);

                            if (!string.IsNullOrWhiteSpace(data["Id_aportacion"]))
                                cmd.Parameters.AddWithValue("@Id_aportacion", int.Parse(data["Id_aportacion"]));
                            else
                                cmd.Parameters.AddWithValue("@Id_aportacion", DBNull.Value);

                            // Usar ExecuteReader para mayor control
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    Id_aportacion = reader.IsDBNull(0) ? (int?)null : reader.GetInt32(0);
                                }
                                else
                                {
                                    // No se encontró ningún registro
                                    Id_aportacion = null;
                                }
                            }
                        }
                    }
                    Console.WriteLine($"ID UNICO APORTACION: {Id_aportacion}");
                }

                AportacionDatos datosAntes = null;
                if (tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase) && Id_aportacion.HasValue)
                {
                    datosAntes = ObtenerAportacionAnterior(Id_aportacion.Value);
                }

                OrientacionDatos antesOr = null;
                if (tablaReferencia.Equals("ORIENTACION", StringComparison.OrdinalIgnoreCase))
                {
                    antesOr = OrientacionAnterior(idEscrito);
                }

                IncompetenciaDatos antesIn = null;
                if (tablaReferencia.Equals("INCOMPETENCIA", StringComparison.OrdinalIgnoreCase))
                {
                    antesIn = IncompetenciaAnterior(idEscrito);
                }

                RemisionDatos antesRe = null;
                if (tablaReferencia.Equals("REMISION", StringComparison.OrdinalIgnoreCase))
                {
                    antesRe = RemisonAnterior(idEscrito);
                }

                AntecedenteDatos antesAnt = null;
                if (tablaReferencia.Equals("ANTECEDENTE", StringComparison.OrdinalIgnoreCase))
                {
                    antesAnt = AntecedenteAnterior(idEscrito);
                }


                //  Conversion edad a entero en caso de ser string
                int? edad = null;
                if (!string.IsNullOrWhiteSpace(edadStr) && edadStr != "null")
                {
                    edad = int.TryParse(edadStr, out int result) ? result : (int?)null;
                }
                //  LLAMAR AL PROCEDIMIENTO 
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("Sp_GuardarEditarCedula", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TablaReferencia", tablaReferencia);
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);
                    cmd.Parameters.AddWithValue("@IdPersonas", IdPersonas);
                    cmd.Parameters.AddWithValue("@Folio", folio ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                    cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                    cmd.Parameters.AddWithValue("@Autoridad", autoridad ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Numero_oficio", string.IsNullOrWhiteSpace(numOficio) ? (object)DBNull.Value : numOficio);
                    cmd.Parameters.AddWithValue("@Institucion", institucion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Remitente", string.IsNullOrWhiteSpace(remitente) ? (object)DBNull.Value : remitente);
                    cmd.Parameters.AddWithValue("@Explicacion", explicacion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@SedeRegistro", sedeRegistro ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ViaInterposicion", viaInterposicion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Abogado", abogado ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Peticionario", peticionario ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Expediente", string.IsNullOrWhiteSpace(Expediente) ? (object)DBNull.Value : Expediente);
                    cmd.Parameters.AddWithValue("@Edad", edad.HasValue ? (object)edad.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Sexo", sexo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Genero", genero ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@TipoUsuario", tipoUsuario ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Documento", documento ?? "NO");
                    cmd.Parameters.AddWithValue("@Id_aportacion", Id_aportacion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Estatus", 1); // Activo por defecto
                    cmd.ExecuteNonQuery();
                    foreach (SqlParameter p in cmd.Parameters)
                    {
                        Console.WriteLine($"{p.ParameterName} = {p.Value ?? "NULL"}");
                    }
                }
                // === Registrar en bitácora si es aportación ===
                if (tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase) && Id_aportacion.HasValue && datosAntes != null)
                {
                    RegistrarCambioAportacion(Id_aportacion.Value, "Lugar de Hechos", datosAntes.LugarHechos, lugarHechos);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Fecha de recepción", datosAntes.FechaRecepcion, fechaRecepcion, esFecha: true);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Hora de recepción", datosAntes.HoraRecepcion, horaRecepcion, esHora: true);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Autoridades", datosAntes.Autoridad, autoridad);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Expediente Aportación", datosAntes.Expediente, Expediente);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Explicación de la Aportación", datosAntes.Explicacion, explicacion);
                    RegistrarCambioAportacion(Id_aportacion.Value, "Sede de Registro", datosAntes.SedeRegistro, sedeRegistro);
                }
                if (tablaReferencia.Equals("ORIENTACION", StringComparison.OrdinalIgnoreCase) && antesOr != null)
                {
                    CambioOrientacion(idEscrito, "Lugar de Hechos", antesOr.LugarHechos, lugarHechos);
                    CambioOrientacion(idEscrito, "Fecha de recepción", antesOr.FechaRecepcion, fechaRecepcion, esFecha: true);
                    CambioOrientacion(idEscrito, "Hora de recepción", antesOr.HoraRecepcion, horaRecepcion, esHora: true);
                    CambioOrientacion(idEscrito, "Autoridades", antesOr.Autoridad, autoridad);
                    CambioOrientacion(idEscrito, "Institucion", antesOr.Institucion, institucion);
                    CambioOrientacion(idEscrito, "Explicación de la Orientacion", antesOr.Explicacion, explicacion);
                    CambioOrientacion(idEscrito, "Sede de Registro", antesOr.SedeRegistro, sedeRegistro);
                }
                if (tablaReferencia.Equals("INCOMPETENCIA", StringComparison.OrdinalIgnoreCase) && antesIn != null)
                {
                    CambioIncompetencia(idEscrito, "Lugar de Hechos", antesIn.LugarHechos, lugarHechos);
                    CambioIncompetencia(idEscrito, "Fecha de recepción", antesIn.FechaRecepcion, fechaRecepcion, esFecha: true);
                    CambioIncompetencia(idEscrito, "Hora de recepción", antesIn.HoraRecepcion, horaRecepcion, esHora: true);
                    CambioIncompetencia(idEscrito, "Institucion", antesIn.Institucion, institucion);
                    CambioIncompetencia(idEscrito, "Explicación de la Orientacion", antesIn.Explicacion, explicacion);
                    CambioIncompetencia(idEscrito, "Sede de Registro", antesIn.SedeRegistro, sedeRegistro);
                }
                if (tablaReferencia.Equals("REMISION", StringComparison.OrdinalIgnoreCase) && antesRe != null)
                {
                    CambioRemision(idEscrito, "Lugar de Hechos", antesRe.LugarHechos, lugarHechos);
                    CambioRemision(idEscrito, "Fecha de recepción", antesRe.FechaRecepcion, fechaRecepcion, esFecha: true);
                    CambioRemision(idEscrito, "Hora de recepción", antesRe.HoraRecepcion, horaRecepcion, esHora: true);
                    CambioRemision(idEscrito, "Institucion", antesRe.Institucion, institucion);
                    CambioRemision(idEscrito, "Explicación de la Orientacion", antesRe.Explicacion, explicacion);
                    CambioRemision(idEscrito, "Sede de Registro", antesRe.SedeRegistro, sedeRegistro);
                }
                if (tablaReferencia.Equals("ANTECEDENTE", StringComparison.OrdinalIgnoreCase) && antesAnt != null)
                {
                    CambioAntecedente(idEscrito, "Lugar de Hechos", antesAnt.LugarHechos, lugarHechos);
                    CambioAntecedente(idEscrito, "Fecha de recepción", antesAnt.FechaRecepcion, fechaRecepcion, esFecha: true);
                    CambioAntecedente(idEscrito, "Hora de recepción", antesAnt.HoraRecepcion, horaRecepcion, esHora: true);
                    CambioAntecedente(idEscrito, "Autoridad", antesAnt.Autoridad, autoridad);
                    CambioAntecedente(idEscrito, "Explicación de la Orientacion", antesAnt.Explicacion, explicacion);
                    CambioAntecedente(idEscrito, "Sede de Registro", antesAnt.SedeRegistro, sedeRegistro);
                }







                return Json(new { status = true, mensaje = "Cédula guardada" });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = "Error al guardar cédula: " + ex.Message });
            }
        }

        [HttpPost]
        public JsonResult InsertarCedula(IFormCollection data)
        {
            Console.WriteLine(data);
            try
            {
                //  Datos del formulario 
                string tablaReferencia = data["tablaReferencia"]; // ORIENTACION, REMISION etc (debe coincidir con los nombres de las tablas de cedulas)
                //int idEscrito = 0;
                //int.TryParse(data["Input_ID"], out idEscrito);
                int? idEscrito = null;
                if (int.TryParse(data["Input_ID"], out int temp))
                {
                    idEscrito = temp;
                }
                string folio = data["Input_folio_C"];
                string lugarHechos = data["Input_LugarHechosDescripcion_C"];
                string fechaRecepcion = data["Input_FechaRecepcion_C"];
                string horaRecepcion = data["Input_HoraRecepcion_C"];
                string autoridad = data["Input_autoridadresp_C"];
                string institucion = data["Input_institucion_C"];
                string explicacion = data["ExplicacionCedula"];
                string sedeRegistro = data["sedeRegistro_C"];
                string viaInterposicion = data["via_interposicion"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario"];
                string remitente = data["nomAbogado"];

                string Expediente = data["Input_ExpedienteAportacion_C"];
                string numOficio = data["Input_numOficio_C"];
                //  Datos personales ocultos 
                string tipoUsuario = data["tipo_usuario"];
                string edadStr = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                int IdPersonas = 0;
                if (!string.IsNullOrWhiteSpace(data["id_personas"]))
                {
                    int.TryParse(data["id_personas"], out IdPersonas);
                }
                // Bandera "documento" indica la persona que hizo la alta de cedula
                string documento = data["documento"];
                DateTime fecha = DateTime.Now;
                //  Documento 
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                // Se envia id escrito, si es una aportacion enviara el valor por defecto (0)
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                // En caso de haber un valor en el campo expediente lo envia, sino envia null
                                if (string.IsNullOrWhiteSpace(Expediente))
                                {
                                    cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                }
                                else
                                {
                                    cmd.Parameters.AddWithValue("@Expediente", Expediente);
                                }
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", tablaReferencia);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                //// === Consulta Id_aportacion con el nuevo SP ===
                int? Id_aportacion = null;

                // Solo ejecutar este bloque si la tablaReferencia es "APORTACION"
                if (tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase))
                {
                    using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                    {
                        conn.Open();
                        using (SqlCommand cmd = new SqlCommand("Sp_IdAportacion", conn))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@Expediente",
                                string.IsNullOrWhiteSpace(Expediente) ? (object)DBNull.Value : Expediente);

                            if (!string.IsNullOrWhiteSpace(data["Id_aportacion"]))
                                cmd.Parameters.AddWithValue("@Id_aportacion", int.Parse(data["Id_aportacion"]));
                            else
                                cmd.Parameters.AddWithValue("@Id_aportacion", DBNull.Value);

                            // Usar ExecuteReader para mayor control
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    Id_aportacion = reader.IsDBNull(0) ? (int?)null : reader.GetInt32(0);
                                }
                                else
                                {
                                    // No se encontró ningún registro
                                    Id_aportacion = null;
                                }
                            }
                        }
                    }
                    Console.WriteLine($"ID UNICO APORTACION: {Id_aportacion}");
                }

                int? edad = null;
                if (!string.IsNullOrWhiteSpace(edadStr) && edadStr != "null")
                {
                    edad = int.TryParse(edadStr, out int result) ? result : (int?)null;
                }
               


                //  LLAMAR AL PROCEDIMIENTO 
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("Sp_GuardarEditarCedula", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TablaReferencia", tablaReferencia);
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);
                    cmd.Parameters.AddWithValue("@IdPersonas", IdPersonas);
                    cmd.Parameters.AddWithValue("@Folio", folio ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                    cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                    cmd.Parameters.AddWithValue("@Autoridad", autoridad ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Numero_oficio", string.IsNullOrWhiteSpace(numOficio) ? (object)DBNull.Value : numOficio);
                    cmd.Parameters.AddWithValue("@Institucion", institucion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Remitente", string.IsNullOrWhiteSpace(remitente) ? (object)DBNull.Value : remitente);
                    cmd.Parameters.AddWithValue("@Explicacion", explicacion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@SedeRegistro", sedeRegistro ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ViaInterposicion", viaInterposicion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Abogado", abogado ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Peticionario", peticionario ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Expediente", string.IsNullOrWhiteSpace(Expediente) ? (object)DBNull.Value : Expediente);
                    cmd.Parameters.AddWithValue("@Edad", edad.HasValue ? (object)edad.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@Sexo", sexo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Genero", genero ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@TipoUsuario", tipoUsuario ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Documento", documento ?? "NO");
                    cmd.Parameters.AddWithValue("@Id_aportacion", Id_aportacion ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Estatus", 1); // Activo por defecto
                    cmd.ExecuteNonQuery();
                    foreach (SqlParameter p in cmd.Parameters)
                    {
                        Console.WriteLine($"{p.ParameterName} = {p.Value ?? "NULL"}");
                    }
                }

                // === Registrar en bitácora si es aportación ===
                if (tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase) && Id_aportacion.HasValue)
                {

                    // Decidir acción según estatus
                    string accion = "Insertar";

                    // Registrar campos clave en la bitácora
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Lugar de Echos(lugar)", "-", lugarHechos ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Fecha de recepción", "-", fechaRecepcion ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "HoraRecepccion", "-", horaRecepcion ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Nombre Peticionario", "-", peticionario ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Autoridades", "-", autoridad ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Lugar de Echos", "-", lugarHechos ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Expediente Aportacion", "-", Expediente ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Explicación de la Aportacion", "-", explicacion ?? "-");
                    RegistrarBitacoraAportacion(Id_aportacion.Value, accion, "Sede de Registro", "-", sedeRegistro ?? "-");

                }
                // Preparar bitácora
                StringBuilder txtcontBuilder = new StringBuilder();
                string tipoMod = "Insertar";
                string ipUsuario = ObtenerIP();
                string idExp = idEscrito.ToString();
                if (tablaReferencia.Equals("ORIENTACION", StringComparison.OrdinalIgnoreCase) && idEscrito.HasValue)
                {

                    // Decidir acción según estatus


                    // Registrar campos clave en la bitácora
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "ID", "-", idExp ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Folio", "-", folio ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Peticionario", "-", peticionario ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Lugar de Echos(lugar)", "-", lugarHechos ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Fecha de recepción", "-", fechaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "HoraRecepccion", "-", horaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Autoridades", "-", autoridad ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Institucion", "-", institucion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Explicación", "-", explicacion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Sede de Registro", "-", sedeRegistro ?? "-", ipUsuario);


                }
                if (tablaReferencia.Equals("INCOMPETENCIA", StringComparison.OrdinalIgnoreCase) && idEscrito.HasValue)
                {

                    // Decidir acción según estatus


                    // Registrar campos clave en la bitácora
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "ID", "-", idExp ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Folio", "-", folio ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Peticionario", "-", peticionario ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Lugar de Echos(lugar)", "-", lugarHechos ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Fecha de recepción", "-", fechaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "HoraRecepccion", "-", horaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Autoridades", "-", autoridad ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Institucion", "-", institucion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Explicación", "-", explicacion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Sede de Registro", "-", sedeRegistro ?? "-", ipUsuario);


                }
                if (tablaReferencia.Equals("REMISION", StringComparison.OrdinalIgnoreCase) && idEscrito.HasValue)
                {

                    // Decidir acción según estatus


                    // Registrar campos clave en la bitácora
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "ID", "-", idExp ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Folio", "-", folio ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Peticionario", "-", peticionario ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Lugar de Echos(lugar)", "-", lugarHechos ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Fecha de recepción", "-", fechaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "HoraRecepccion", "-", horaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Autoridades", "-", autoridad ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Institucion", "-", institucion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Explicación", "-", explicacion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Sede de Registro", "-", sedeRegistro ?? "-", ipUsuario);


                }
                if (tablaReferencia.Equals("ANTECEDENTE", StringComparison.OrdinalIgnoreCase) && idEscrito.HasValue)
                {

                    // Decidir acción según estatus


                    // Registrar campos clave en la bitácora
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "ID", "-", idExp ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Folio", "-", folio ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Peticionario", "-", peticionario ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Lugar de Echos(lugar)", "-", lugarHechos ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Fecha de recepción", "-", fechaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "HoraRecepccion", "-", horaRecepcion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Autoridades", "-", autoridad ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Institucion", "-", institucion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Explicación", "-", explicacion ?? "-", ipUsuario);
                    ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Sede de Registro", "-", sedeRegistro ?? "-", ipUsuario);


                }
                Console.WriteLine("BITACORA CONTENIDO: " + txtcontBuilder.ToString());

                // Registrar bitácora
                // Registrar bitácora solo si NO es aportación
                if (!tablaReferencia.Equals("APORTACION", StringComparison.OrdinalIgnoreCase) && idEscrito.HasValue)
                {
                    CrearBitacoraTXT(idEscrito.Value, txtcontBuilder.ToString());
                }


                return Json(new { status = true, mensaje = "Cédula guardada" });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = "Error al guardar cédula: " + ex.Message });
            }
        }

        [HttpPost]
        public IActionResult actualizarEstatusCedula(int expediente_id, string expediente, int id_tipo, string Ipaccesible)
        {
            Console.WriteLine("Expediente cédula ID recibido: " + expediente_id);
            Console.WriteLine("Expediente aportacion recibido: " + expediente);

            try
            {
                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();
                    //Llamada al Sp que actualiza o "borra" el estatus de las cedulas en su respectiva tabla
                    using (SqlCommand command = new SqlCommand("[dbo].[Sp_Borrar_Cedula]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ID_EXPEDIENTE", expediente_id);
                        command.Parameters.AddWithValue("@ID_APORTACION", expediente);
                        command.Parameters.AddWithValue("@ID_TIPO", id_tipo);

                        int totalActualizados = 0;

                        // Leer el resultado del SELECT dentro del SP
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                totalActualizados = reader.GetInt32(0);  // Asume que SELECT devuelve una columna: TotalActualizados
                            }
                        }
                        // Muestra el total de registros eliminados

                        // Preparar bitácora
                        StringBuilder txtcontBuilder = new StringBuilder();
                        string tipoMod = "Eliminación";
                        bool statusresp = false;
                        string idExp = expediente_id.ToString();
                        if (totalActualizados > 0)
                        {
                            var usuario = _httpContextAccessor.HttpContext.User;
                            string nombreUsuario = usuario.Identity.Name;
                            string ipUsuario = ObtenerIP();
                            statusresp = true;
                            ContBitacora(txtcontBuilder, "Cedula de Calificacion Provisional", tipoMod, "Cedula de Calificacion Provisional", idExp, "-", ipUsuario);


                            RegistrarBitacoraAportacion(
                                id_tipo,   // Id de la aportación
                                "Eliminar", // Acción
                                "Cedula de Calificacion Provisional de Aportacion",  // Campo genérico
                                id_tipo.ToString(), // Antes 
                                "-"     // Después (no aplica)
                            );
                            Console.WriteLine("BITACORA CONTENIDO: " + txtcontBuilder.ToString());

                            // Registrar bitácora
                            CrearBitacoraTXT(Convert.ToInt32(idExp), txtcontBuilder.ToString());

                            // Devolver respuesta al frontend                         

                            return Json(new
                            {
                                status = statusresp,
                                success = true,
                                message = $"Se eliminó {totalActualizados} cédula(s) correctamente."
                            });
                        }

                        else
                        {
                            return Json(new
                            {
                                success = false,
                                message = "No se pudo eliminar la cédula, o ya estaba inactiva."    // Caso de que ya se haya eliminado o no se encuentra el id de escrito en las tablas
                            });
                        }


                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"Error del servidor: {ex.Message}"
                });
            }
        }

        //fin del bloque
        /// David 16 06 2025 Agregue un nuevo metodo controlador para guardar los datos del formulario de orientacion
        /// Los datos se concatenan dentro del archivo txt creado cuando se registra el peticionario
        /// Ojo: Este metodo se auxilia de los demas metodos para armar el TXT
        /// Modificacion 26 06 2025: Ajuste a los cambios en los campos del formulario
        /// Cris y David Modificacion 15.07 2025: Ajuste a los cambios en los campos del formulario
        [HttpPost]
        public JsonResult GuardarOrientacion(IFormCollection data)
        {
            string referenciaCedula = "ORIENTACION";
            try
            {
                // === Bitácora ===
                var arregloCampos = new ArrayList
        {
            data["Input_ID"],
            data["Input_Peticionario"],
            data["Input_LugarHechosDescripcion"],
            data["Input_FechaRecepcion"],
            data["Input_HoraRecepcion"],
            data["Input_autoridadresp"],
            data["Input_institucion"],
            data["ExplicacionOrientacion"],
            data["sederegistro_desc"]
        };

                var nombresCampos = new ArrayList
        {
            "ID",
            "Peticionario",
            "Lugar de hechos (Lugar)",
            "Fecha de recepción",
            "HoraRecepcion",
            "Autoridades",
            "Institucion",
            "Explicacion de la Orientacion",
            "Sede de registro",
            
        };

                var txtBuilder = new StringBuilder();
                string tipoMod = "Alta";
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (Request.Headers.ContainsKey("X-Forwarded-For"))
                {
                    ip = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                }

                for (int i = 0; i < arregloCampos.Count; i++)
                {
                    if (!string.IsNullOrWhiteSpace(arregloCampos[i]?.ToString()))
                    {
                        ContBitacora(txtBuilder, "Cedula de Calificación Provisional de Orientación", tipoMod, nombresCampos[i].ToString(), "-", arregloCampos[i].ToString(), ip);
                    }
                }

                int idExp = int.TryParse(data["Input_ID"], out int idVal) ? idVal : 0;
                if (idExp == 0)
                {
                    idExp = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"));
                }

                CrearBitacoraTXT(idExp, txtBuilder.ToString());

                // === Datos del formulario ===
                string idEscrito = data["Input_ID"];
                string folio = data["Input_folio"];
                string lugarHechos = data["Input_LugarHechosDescripcion"];
                string fechaRecepcion = data["Input_FechaRecepcion"];
                string horaRecepcion = data["Input_HoraRecepcion"];
                string autoridad = data["Input_autoridadresp"];
                string institucion = data["Input_institucion"];
                string explicacion = data["ExplicacionOrientacion"];
                string sedeRegistro = data["sederegistro_desc"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario"];

                // === Datos personales ocultos ===
                string edad = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                string tipoUsuario = data["tipo_usuario"];

                // === Documento (nuevo campo) ===
                string documento = data["documento"];
                string id_personas = data["id_personas"];

                // === Estatus ===
                // Se envia siempre por defecto un 1 que representa que esta ACTIVO, cuando se quiera eliminar se cambiara por un 0 o INACTIVO
                int Estatus = 1;
                DateTime fecha = DateTime.Now;
                // === Archivo PDF ===
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", referenciaCedula);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // David 13 08 2025: Convertir la edad a null si es una cadena vacía o "null"
                int? edadInt = null;  // Usamos un tipo nullable int
                if (!string.IsNullOrWhiteSpace(edad) && edad != "null")
                {
                    edadInt = int.TryParse(edad, out int result) ? result : (int?)null;  // Parsear a entero si aplica
                }

                // === Guardar en base de datos ===
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    string sql = @"
                             INSERT INTO ORIENTACION (
                            Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion,
                            Autoridad, Institucion, Explicacion,
                            Sede_registro, Via_interposicion, Abogado, Peticionario,
                            Edad, Sexo, Genero, Tipo_usuario, Documento, Id_personas, Estatus
                        )
                        VALUES (
                            @IdEscrito, @Folio, @LugarHechos, @FechaRecepcion, @HoraRecepcion,
                            @Autoridad, @Institucion, @Explicacion,
                            @SedeRegistro, @ViaInterposicion, @Abogado, @Peticionario,
                            @Edad, @Sexo, @Genero, @TipoUsuario, @Documento, @IdPersona, @Estatus
                        )";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@IdEscrito", string.IsNullOrWhiteSpace(idEscrito) ? (object)DBNull.Value : idEscrito);
                        cmd.Parameters.AddWithValue("@Folio", folio);
                        cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                        cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                        cmd.Parameters.AddWithValue("@Autoridad", string.IsNullOrWhiteSpace(autoridad) ? (object)DBNull.Value : autoridad);
                        cmd.Parameters.AddWithValue("@Institucion", string.IsNullOrWhiteSpace(institucion) ? (object)DBNull.Value : institucion);
                        cmd.Parameters.AddWithValue("@Explicacion", string.IsNullOrWhiteSpace(explicacion) ? (object)DBNull.Value : explicacion);
                        cmd.Parameters.AddWithValue("@SedeRegistro", string.IsNullOrWhiteSpace(sedeRegistro) ? (object)DBNull.Value : sedeRegistro);
                        cmd.Parameters.AddWithValue("@ViaInterposicion", string.IsNullOrWhiteSpace(viaInterposicion) ? (object)DBNull.Value : viaInterposicion);
                        cmd.Parameters.AddWithValue("@Abogado", string.IsNullOrWhiteSpace(abogado) ? (object)DBNull.Value : abogado);
                        cmd.Parameters.AddWithValue("@Peticionario", string.IsNullOrWhiteSpace(peticionario) ? (object)DBNull.Value : peticionario);

                        cmd.Parameters.AddWithValue("@TipoUsuario", string.IsNullOrWhiteSpace(tipoUsuario) ? (object)DBNull.Value : tipoUsuario);
                        cmd.Parameters.AddWithValue("@Edad", edadInt.HasValue ? (object)edadInt.Value : (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Sexo", string.IsNullOrWhiteSpace(sexo) ? (object)DBNull.Value : sexo);
                        cmd.Parameters.AddWithValue("@Genero", string.IsNullOrWhiteSpace(genero) ? (object)DBNull.Value : genero);

                        cmd.Parameters.AddWithValue("@Documento", string.IsNullOrWhiteSpace(documento) ? (object)DBNull.Value : documento);
                        cmd.Parameters.AddWithValue("@IdPersona", string.IsNullOrWhiteSpace(id_personas) ? (object)DBNull.Value : int.Parse(id_personas));
                        cmd.Parameters.AddWithValue("@Estatus", Estatus);
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        /// Cris y David 17 06 2025 Se añadio un nuevo metodo para almacenar de forma local los datos del formulario de Remision
        /// Los datos se concatenan dentro del archivo txt creado cuando se registra el peticionario
        /// Ojo: Este metodo se auxilia de otros metodos para armar el TXT
        /// Cris y David 16 07 2025: Se modifico el controlador para el guardado local y el guardado en la BD

        [HttpPost]
        public JsonResult GuardarRemision(IFormCollection data)
        {
            string referenciaCedula = "REMISION";
            try
            {
                // ===================== BITÁCORA =====================
                var arregloCampos = new ArrayList
        {
            data["Input_ID"],
            data["Input_Peticionario"],
            data["Input_LugarHechosDescripcion"],
            data["Input_FechaRecepcion"],
            data["Input_HoraRecepcion"],
            data["Input_numOficio"],
            data["Input_institucion"],
            data["nomAbogado"],
            data["ExplicacionRemision"],
            data["sederegistro_desc"]         
        };

                var nombresCampos = new ArrayList
        {
            "ID",
            "Peticionario",
            "Lugar de hechos (Lugar)",
            "Fecha de recepción",
            "Hora de recepción",
            "Número de oficio",
            "Institución",
            "Remitente",
            "Explicación de la Remisión",
            "Sede Registro"
            
        };

                var txtBuilder = new StringBuilder();
                string tipoMod = "Alta";
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (Request.Headers.ContainsKey("X-Forwarded-For"))
                {
                    ip = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                }

                for (int i = 0; i < arregloCampos.Count; i++)
                {
                    if (!string.IsNullOrWhiteSpace(arregloCampos[i]?.ToString()))
                    {
                        ContBitacora(txtBuilder, "Cedula de Calificación Provisional de Remisión", tipoMod, nombresCampos[i].ToString(), "-", arregloCampos[i].ToString(), ip);
                    }
                }

                int idExp = int.TryParse(data["Input_ID"], out int idVal) ? idVal : 0;
                if (idExp == 0)
                {
                    idExp = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"));
                }

                CrearBitacoraTXT(idExp, txtBuilder.ToString());

                // ===================== DATOS PARA LA BD =====================
                string idEscrito = data["Input_ID"];
                string folio = data["Input_folio"];
                string lugarHechos = data["Input_LugarHechosDescripcion"];
                string fechaRecepcion = data["Input_FechaRecepcion"];
                string horaRecepcion = data["Input_HoraRecepcion"];
                string numOficio = data["Input_numOficio"];
                string institucion = data["Input_institucion"];
                string remitente = data["nomAbogado"];
                string explicacion = data["ExplicacionRemision"];
                string sedeRegistro = data["sederegistro_desc"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario"];

                // === Datos personales ocultos ===
                string edad = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                string tipoUsuario = data["tipo_usuario"];

                // === Documento adjunto ===
                string documento = data["documento"];
                string id_personas = data["id_personas"];

                // === Estatus ===
                // Se envia siempre por defecto un 1 que representa que esta ACTIVO, cuando se quiera eliminar se cambiara por un 0 o INACTIVO
                int Estatus = 1;
                DateTime fecha = DateTime.Now;
                // === Archivo PDF ===
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", referenciaCedula);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // David 13 08 2025: Convertir la edad a null si es una cadena vacía o "null"
                int? edadInt = null;  // Usamos un tipo null
                if (!string.IsNullOrWhiteSpace(edad) && edad != "null")
                {
                    edadInt = int.TryParse(edad, out int result) ? result : (int?)null;  // Parsear a entero si aplica
                }

                // ===================== INSERTAR EN BD =====================
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    string sql = @"
                INSERT INTO REMISION (
                    Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion,
                    Numero_oficio, Institucion, Remitente, Explicacion,
                    Sede_registro, Via_interposicion, Abogado, Peticionario, Tipo_usuario, Edad, Sexo, Genero,
                    Documento, Id_personas, Estatus

                )
                VALUES (
                    @IdEscrito, @Folio, @LugarHechos, @FechaRecepcion, @HoraRecepcion,
                    @NumeroOficio, @Institucion, @Remitente, @Explicacion,
                    @SedeRegistro, @ViaInterposicion, @Abogado, @Peticionario,@TipoUsuario, @Edad, @Sexo, @Genero,
                    @Documento, @IdPersona, @Estatus
                )";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@IdEscrito", string.IsNullOrWhiteSpace(idEscrito) ? (object)DBNull.Value : idEscrito);
                        cmd.Parameters.AddWithValue("@Folio", folio);
                        cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                        cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                        cmd.Parameters.AddWithValue("@NumeroOficio", numOficio);
                        cmd.Parameters.AddWithValue("@Institucion", institucion);
                        cmd.Parameters.AddWithValue("@Remitente", remitente);
                        cmd.Parameters.AddWithValue("@Explicacion", explicacion);
                        cmd.Parameters.AddWithValue("@SedeRegistro", sedeRegistro);
                        cmd.Parameters.AddWithValue("@ViaInterposicion", string.IsNullOrWhiteSpace(viaInterposicion) ? (object)DBNull.Value : viaInterposicion);
                        cmd.Parameters.AddWithValue("@Abogado", string.IsNullOrWhiteSpace(abogado) ? (object)DBNull.Value : abogado);
                        cmd.Parameters.AddWithValue("@Peticionario", string.IsNullOrWhiteSpace(peticionario) ? (object)DBNull.Value : peticionario);
                        cmd.Parameters.AddWithValue("@TipoUsuario", string.IsNullOrWhiteSpace(tipoUsuario) ? (object)DBNull.Value : tipoUsuario);
                        cmd.Parameters.AddWithValue("@Edad", edadInt.HasValue ? (object)edadInt.Value : (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Sexo", string.IsNullOrWhiteSpace(sexo) ? (object)DBNull.Value : sexo);
                        cmd.Parameters.AddWithValue("@Genero", string.IsNullOrWhiteSpace(genero) ? (object)DBNull.Value : genero);
                        cmd.Parameters.AddWithValue("@Documento", string.IsNullOrWhiteSpace(documento) ? (object)DBNull.Value : documento);
                        cmd.Parameters.AddWithValue("@IdPersona", string.IsNullOrWhiteSpace(id_personas) ? (object)DBNull.Value : int.Parse(id_personas));
                        cmd.Parameters.AddWithValue("@Estatus", Estatus);
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        /// David 27 06 2025 Se añadio un nuevo metodo para almacenar de forma local los datos del formulario de Incompetencia
        /// Los datos se concatenan dentro del archivo txt creado cuando se registra el peticionario
        /// Ojo: Este metodo se auxilia de otros metodos para armar el TXT
        /// David 17 07 2025: Se modifico el controlador para el guardado local y el guardado en la BD

        [HttpPost]
        public JsonResult GuardarIncompetencia(IFormCollection data)
        {
            string referenciaCedula = "INCOMPETENCIA";
            try
            {
                // ===================== BITÁCORA =====================
                var arregloCampos = new ArrayList
                {
                 data["Input_ID"],
                 data["Input_Peticionario"],
                 data["Input_LugarHechosDescripcion"],
                 data["Input_FechaRecepcion"],
                 data["Input_HoraRecepcion"],
                 data["Input_numOficio"],
                 data["Input_institucion"],
                 data["nomAbogado"],
                 data["ExplicacionIncompetencia"],
                 data["sederegistro_desc"]
                };

        var nombresCampos = new ArrayList
        {
            "ID",
            "Peticionario",
            "Lugar de hechos (Lugar)",
            "Fecha de recepción",
            "Hora de recepción",
            "Número de oficio",
            "Institución",
            "Remitente",
            "Explicación de la INCOMPETENCIA",
            "Sede Registro"
        };

                var txtBuilder = new StringBuilder();
                string tipoMod = "Alta";
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (Request.Headers.ContainsKey("X-Forwarded-For"))
                {
                    ip = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                }

                for (int i = 0; i < arregloCampos.Count; i++)
                {
                    if (!string.IsNullOrWhiteSpace(arregloCampos[i]?.ToString()))
                    {
                        ContBitacora(txtBuilder, "Cedula de Calificación Provisional de Incompetencia", tipoMod, nombresCampos[i].ToString(), "-", arregloCampos[i].ToString(), ip);
                    }
                }

                int idExp = int.TryParse(data["Input_ID"], out int idVal) ? idVal : 0;
                if (idExp == 0)
                {
                    idExp = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"));
                }

                CrearBitacoraTXT(idExp, txtBuilder.ToString());

                // ===================== DATOS PARA LA BD =====================
                string idEscrito = data["Input_ID"];
                string folio = data["Input_folio"];
                string lugarHechos = data["Input_LugarHechosDescripcion"];
                string fechaRecepcion = data["Input_FechaRecepcion"];
                string horaRecepcion = data["Input_HoraRecepcion"];
                string numOficio = data["Input_numOficio"];
                string institucion = data["Input_institucion"];
                string remitente = data["nomAbogado"];
                string explicacion = data["ExplicacionIncompetencia"];
                string sedeRegistro = data["sederegistro_desc"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario"];
                // === Datos personales ocultos ===
                string edad = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                string tipoUsuario = data["tipo_usuario"];

                // === Documento adjunto ===
                string documento = data["documento"];
                string id_personas = data["id_personas"];

                // === Estatus ===
                // Se envia siempre por defecto un 1 que representa que esta ACTIVO, cuando se quiera eliminar se cambiara por un 0 o INACTIVO
                int Estatus = 1;
                DateTime fecha = DateTime.Now;
                // === Archivo PDF ===
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", referenciaCedula);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // David 13 08 2025: Convertir la edad a null si es una cadena vacía o "null"
                int? edadInt = null;  // Usamos un tipo null
                if (!string.IsNullOrWhiteSpace(edad) && edad != "null")
                {
                    edadInt = int.TryParse(edad, out int result) ? result : (int?)null;  // Parsear a entero si aplica
                }

                // ===================== INSERTAR EN BD =====================
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    string sql = @"
                INSERT INTO INCOMPETENCIA (
                    Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion,
                    Numero_oficio, Institucion, Remitente, Explicacion,
                    Sede_registro, Via_interposicion, Abogado, Peticionario,Tipo_usuario, Edad, Sexo, Genero,
                    Documento, Id_personas, Estatus
                )
                VALUES (
                    @IdEscrito, @Folio, @LugarHechos, @FechaRecepcion, @HoraRecepcion,
                    @NumeroOficio, @Institucion, @Remitente, @Explicacion,
                    @SedeRegistro, @ViaInterposicion, @Abogado, @Peticionario, @TipoUsuario, @Edad, @Sexo, @Genero,
                    @Documento, @IdPersona, @Estatus
                )";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@IdEscrito", string.IsNullOrWhiteSpace(idEscrito) ? (object)DBNull.Value : idEscrito);
                        cmd.Parameters.AddWithValue("@Folio", folio);
                        cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                        cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                        cmd.Parameters.AddWithValue("@NumeroOficio", numOficio);
                        cmd.Parameters.AddWithValue("@Institucion", institucion);
                        cmd.Parameters.AddWithValue("@Remitente", remitente);
                        cmd.Parameters.AddWithValue("@Explicacion", explicacion);
                        cmd.Parameters.AddWithValue("@SedeRegistro", sedeRegistro);
                        cmd.Parameters.AddWithValue("@ViaInterposicion", string.IsNullOrWhiteSpace(viaInterposicion) ? (object)DBNull.Value : viaInterposicion);
                        cmd.Parameters.AddWithValue("@Abogado", string.IsNullOrWhiteSpace(abogado) ? (object)DBNull.Value : abogado);
                        cmd.Parameters.AddWithValue("@Peticionario", string.IsNullOrWhiteSpace(peticionario) ? (object)DBNull.Value : peticionario);
                        cmd.Parameters.AddWithValue("@TipoUsuario", string.IsNullOrWhiteSpace(tipoUsuario) ? (object)DBNull.Value : tipoUsuario);
                        cmd.Parameters.AddWithValue("@Edad", edadInt.HasValue ? (object)edadInt.Value : (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Sexo", string.IsNullOrWhiteSpace(sexo) ? (object)DBNull.Value : sexo);
                        cmd.Parameters.AddWithValue("@Genero", string.IsNullOrWhiteSpace(genero) ? (object)DBNull.Value : genero);
                        cmd.Parameters.AddWithValue("@Documento", string.IsNullOrWhiteSpace(documento) ? (object)DBNull.Value : documento);
                        cmd.Parameters.AddWithValue("@IdPersona", string.IsNullOrWhiteSpace(id_personas) ? (object)DBNull.Value : int.Parse(id_personas));
                        cmd.Parameters.AddWithValue("@Estatus", Estatus);
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        /// David 27 06 2025 Se añadio un nuevo metodo para almacenar de forma local los datos del formulario de Antecedente
        /// Los datos se concatenan dentro del archivo txt creado cuando se registra el peticionario
        /// Ojo: Este metodo se auxilia de otros metodos para armar el TXT
        /// David 17 07 2025: Se modifico el controlador para el guardado local y el guardado en la BD

        [HttpPost]
        public JsonResult GuardarAntecedente(IFormCollection data)
        {
            string referenciaCedula = "ANTECEDENTE";
            try
            {
                // ===================== BITÁCORA =====================
                var arregloCampos = new ArrayList
        {
            data["Input_ID"],
            data["Input_Peticionario"],
            data["Input_LugarHechosDescripcion"],
            data["Input_FechaRecepcion"],
            data["Input_HoraRecepcion"],
            data["Input_autoridadresp"],
            data["ExplicacionAntecedente"],
            data["sederegistro_desc"]

        };

                var nombresCampos = new ArrayList
        {
            "ID",
            "Peticionario",
            "Lugar de hechos (Lugar)",
            "Fecha de recepción",
            "HoraRecepcion",
            "Autoridades",
            "Explicacion de la Antecedente",
            "Sede de Registro"
        };

                var txtBuilder = new StringBuilder();
                string tipoMod = "Alta";
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (Request.Headers.ContainsKey("X-Forwarded-For"))
                {
                    ip = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                }

                for (int i = 0; i < arregloCampos.Count; i++)
                {
                    if (!string.IsNullOrWhiteSpace(arregloCampos[i]?.ToString()))
                    {
                        ContBitacora(txtBuilder, "Cedula de Calificación Provisional de Antecedente", tipoMod, nombresCampos[i].ToString(), "-", arregloCampos[i].ToString(), ip);
                    }
                }

                int idExp = int.TryParse(data["Input_ID"], out int idVal) ? idVal : 0;
                if (idExp == 0)
                {
                    idExp = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"));
                }

                CrearBitacoraTXT(idExp, txtBuilder.ToString());

                // ===================== DATOS PARA LA BD =====================
                string idEscrito = data["Input_ID"];
                string folio = data["Input_folio"];
                string lugarHechos = data["Input_LugarHechosDescripcion"];
                string fechaRecepcion = data["Input_FechaRecepcion"];
                string horaRecepcion = data["Input_HoraRecepcion"];
                string autoridad = data["Input_autoridadresp"];
                string explicacion = data["ExplicacionAntecedente"];
                string sedeRegistro = data["sederegistro_desc"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];
                string peticionario = data["Input_Peticionario"];

                // === Datos personales ocultos ===
                string edad = data["edad"];
                string sexo = data["sexo"];
                string genero = data["genero"];
                string tipoUsuario = data["tipo_usuario"];

                // === Documento adjunto ===
                string documento = data["documento"];
                string id_personas = data["id_personas"];

                // === Estatus ===
                // Se envia siempre por defecto un 1 que representa que esta ACTIVO, cuando se quiera eliminar se cambiara por un 0 o INACTIVO
                int Estatus = 1;
                DateTime fecha = DateTime.Now;
                // === Archivo PDF ===
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@Id_Expediente", idEscrito);
                                cmd.Parameters.AddWithValue("@Expediente", DBNull.Value);
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", referenciaCedula);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // David 13 08 2025: Convertir la edad a null si es una cadena vacía o "null"
                int? edadInt = null;  // Usamos un tipo null
                if (!string.IsNullOrWhiteSpace(edad) && edad != "null")
                {
                    edadInt = int.TryParse(edad, out int result) ? result : (int?)null;  // Parsear a entero si aplica
                }

                // ===================== INSERTAR EN BD =====================
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    string sql = @"
                    INSERT INTO ANTECEDENTE (
                        Id_escrito, Folio, Peticionario, Lugar_hechos, Fecha_recepcion, Hora_recepcion,
                        Autoridad, Explicacion,
                        Sede_registro, Via_interposicion, Abogado,
                        Edad, Genero, Sexo, Tipo_usuario,
                        Documento, Id_personas, Estatus
                    )
                    VALUES (
                        @IdEscrito, @Folio, @Peticionario, @LugarHechos, @FechaRecepcion, @HoraRecepcion,
                        @Autoridad, @Explicacion,
                        @SedeRegistro, @ViaInterposicion, @Abogado,
                        @Edad, @Genero, @Sexo,  @TipoUsuario,
                        @Documento, @IdPersona, @Estatus
                    )";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@IdEscrito", string.IsNullOrWhiteSpace(idEscrito) ? (object)DBNull.Value : idEscrito);
                        cmd.Parameters.AddWithValue("@Folio", folio);
                        cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                        cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                        cmd.Parameters.AddWithValue("@Autoridad", string.IsNullOrWhiteSpace(autoridad) ? (object)DBNull.Value : autoridad);
                        cmd.Parameters.AddWithValue("@Explicacion", string.IsNullOrWhiteSpace(explicacion) ? (object)DBNull.Value : explicacion);
                        cmd.Parameters.AddWithValue("@SedeRegistro", string.IsNullOrWhiteSpace(sedeRegistro) ? (object)DBNull.Value : sedeRegistro);
                        cmd.Parameters.AddWithValue("@ViaInterposicion", string.IsNullOrWhiteSpace(viaInterposicion) ? (object)DBNull.Value : viaInterposicion);
                        cmd.Parameters.AddWithValue("@Abogado", string.IsNullOrWhiteSpace(abogado) ? (object)DBNull.Value : abogado);
                        cmd.Parameters.AddWithValue("@Peticionario", string.IsNullOrWhiteSpace(peticionario) ? (object)DBNull.Value : peticionario);

                        cmd.Parameters.AddWithValue("@TipoUsuario", string.IsNullOrWhiteSpace(tipoUsuario) ? (object)DBNull.Value : tipoUsuario);
                        cmd.Parameters.AddWithValue("@Edad", edadInt.HasValue ? (object)edadInt.Value : (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Sexo", string.IsNullOrWhiteSpace(sexo) ? (object)DBNull.Value : sexo);
                        cmd.Parameters.AddWithValue("@Genero", string.IsNullOrWhiteSpace(genero) ? (object)DBNull.Value : genero);

                        cmd.Parameters.AddWithValue("@Documento", string.IsNullOrWhiteSpace(documento) ? (object)DBNull.Value : documento);
                        cmd.Parameters.AddWithValue("@IdPersona", string.IsNullOrWhiteSpace(id_personas) ? (object)DBNull.Value : int.Parse(id_personas));
                        cmd.Parameters.AddWithValue("@Estatus", Estatus);
                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        /// Cris y David 17 06 2025 Se añadio un nuevo metodo para almacenar de forma local los datos del formulario de Aportacion
        /// Los datos se concatenan dentro del archivo txt creado cuando se registra el peticionario
        /// Ojo: Este metodo se auxilia de otros metodos para armar el TXT
        ///David y Cris 21 07 2025: Se modifico el controlador para el guardado local y el guardado en la BD
        [HttpPost]
        public JsonResult GuardarAportacion(IFormCollection data)
        {
            string referenciaCedula = "APORTACION";
            try
            {
                // ===================== BITÁCORA =====================
                var arregloCampos = new ArrayList
        {
            data["Input_LugarHechosDescripcion"],
            data["Input_FechaRecepcion"],
            data["Input_HoraRecepcion"],
            data["Input_NombrePetAportacion"],
            data["Input_autoridadresp"],
            data["Input_ExpedienteAportacion"],
            data["JustificacionAportacion"],
            data["sedeRegistroAportacion"],

        };

                var nombresCampos = new ArrayList
        {
            "Lugar de hechos (Lugar)",
            "Fecha de recepción",
            "HoraRecepcion",
            "Nombre Peticionario",
            "Autoridades",
            "Expediente Aportacion",
            "Explicacion de la Aportacion",
            "Sede de Registro",

        };

                var txtBuilder = new StringBuilder();
                string tipoMod = "Alta";
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (Request.Headers.ContainsKey("X-Forwarded-For"))
                {
                    ip = Request.Headers["X-Forwarded-For"].FirstOrDefault();
                }

                for (int i = 0; i < arregloCampos.Count; i++)
                {
                    if (!string.IsNullOrWhiteSpace(arregloCampos[i]?.ToString()))
                    {
                        ContBitacora(txtBuilder, "Cedula de Calificacion Provisional de Aportacion", tipoMod, nombresCampos[i].ToString(), "-", arregloCampos[i].ToString(), ip);
                    }
                }



                // ===================== DATOS PARA LA BD =====================

                string lugarHechos = data["Input_LugarHechosDescripcion"];
                string fechaRecepcion = data["Input_FechaRecepcion"];
                string horaRecepcion = data["Input_HoraRecepcion"];
                string peticionario = data["Input_NombrePetAportacion"];
                string autoridad = data["Input_autoridadresp"];
                string Expediente = data["Input_ExpedienteAportacion"];
                string explicacion = data["JustificacionAportacion"];
                string sedeRegistro = data["sedeRegistroAportacion"];
                string viaInterposicion = data["select_viainterposicionc"];
                string abogado = data["usuarioL"];

                // === Estatus ===
                // Se envia siempre por defecto un 1 que representa que esta ACTIVO, cuando se quiera eliminar se cambiara por un 0 o INACTIVO
                int Estatus = 1;
                DateTime fecha = DateTime.Now;
                // === Archivo PDF ===
                var archivos = Request.Form.Files;
                string nombreArchivo = null;
                string tipoArchivo = null;
                // David - Dinamica al editar se necesita cargar el pdf nuevo
                string rutaDocumentoCedula = "Archivos_Cedulas";
                // Aprovechamos que tenemos el dato de tabla referencia para establecer las rutas de las carpetas de los documentos
                // Las rutas Archivos_X se definieron en los controladores de guardado de cada cedula, aqui solo las referenciamos
                // OJO Estas rutas son LOCALES, cuando se haga la migracion al server se necesitara cambiar estas direcciones

                if (archivos.Count > 0)
                {
                    foreach (var archivo in archivos)
                    {
                        tipoArchivo = Path.GetExtension(archivo.FileName).ToLower();

                        if (tipoArchivo == ".pdf" || tipoArchivo == ".jpg" || tipoArchivo == ".png")  // Archivo válido
                        {
                            nombreArchivo = archivo.FileName;

                            // Ruta donde se guardará el archivo
                            string rutaGuardado = Path.Combine(_hostingEnvironment.WebRootPath, "Uploads", rutaDocumentoCedula);
                            if (!Directory.Exists(rutaGuardado)) Directory.CreateDirectory(rutaGuardado);

                            string rutaArchivo = Path.Combine(rutaGuardado, nombreArchivo);
                            using var stream = new FileStream(rutaArchivo, FileMode.Create);
                            archivo.CopyTo(stream);

                            // Aquí se almacenara la información en la base de datos
                            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                            {
                                conn.Open();
                                SqlCommand cmd = new SqlCommand("Sp_GuardarArchivoAdjuntoCedula", conn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@Id_Expediente", DBNull.Value);
                                cmd.Parameters.AddWithValue("@Expediente", Expediente);
                                cmd.Parameters.AddWithValue("@Nombre_Archivo", nombreArchivo);
                                cmd.Parameters.AddWithValue("@Tipo_Archivo", Path.GetExtension(archivo.FileName).ToLower());
                                cmd.Parameters.AddWithValue("@Estatus", 1); // Se envia activo por defecto
                                cmd.Parameters.AddWithValue("@Tipo_Cedula", referenciaCedula);
                                cmd.Parameters.AddWithValue("@Fecha_Subida", fecha);
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }
                }

                // ===================== INSERTAR EN BD =====================
                int idAportacion = 0;
                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    string sql = @"
                        INSERT INTO APORTACION (
                          Lugar_hechos,Fecha_recepcion,Hora_recepcion,Peticionario,Autoridad,
                          Expediente,Explicacion,Sede_registro,Via_interposicion,Abogado,Estatus
                       )
                       VALUES (
                          @LugarHechos, @FechaRecepcion, @HoraRecepcion, @Peticionario,
                          @Autoridad, @Expediente, @Explicacion,
                         @SedeRegistro, @ViaInterposicion, @Abogado, @Estatus
                       );
                       SELECT SCOPE_IDENTITY();";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@LugarHechos", lugarHechos);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", string.IsNullOrWhiteSpace(fechaRecepcion) ? (object)DBNull.Value : DateTime.Parse(fechaRecepcion));
                        cmd.Parameters.AddWithValue("@HoraRecepcion", string.IsNullOrWhiteSpace(horaRecepcion) ? (object)DBNull.Value : TimeSpan.Parse(horaRecepcion));
                        cmd.Parameters.AddWithValue("@Peticionario", string.IsNullOrWhiteSpace(peticionario) ? (object)DBNull.Value : peticionario);
                        cmd.Parameters.AddWithValue("@Autoridad", string.IsNullOrWhiteSpace(autoridad) ? (object)DBNull.Value : autoridad);
                        cmd.Parameters.AddWithValue("@Expediente", string.IsNullOrWhiteSpace(Expediente) ? (object)DBNull.Value : Expediente);
                        cmd.Parameters.AddWithValue("@Explicacion", string.IsNullOrWhiteSpace(explicacion) ? (object)DBNull.Value : explicacion);
                        cmd.Parameters.AddWithValue("@SedeRegistro", string.IsNullOrWhiteSpace(sedeRegistro) ? (object)DBNull.Value : sedeRegistro);
                        cmd.Parameters.AddWithValue("@ViaInterposicion", string.IsNullOrWhiteSpace(viaInterposicion) ? (object)DBNull.Value : viaInterposicion);
                        cmd.Parameters.AddWithValue("@Abogado", string.IsNullOrWhiteSpace(abogado) ? (object)DBNull.Value : abogado);
                        cmd.Parameters.AddWithValue("@Estatus", Estatus);

                        object result = cmd.ExecuteScalar();
                        if (result != null && int.TryParse(result.ToString(), out int id))
                        {
                            idAportacion = id;
                        }
                    }
                }

                // 🔑 Ahora sí, crear la bitácora con el ID correcto
                CreaBitacoraAportaciones(idAportacion, txtBuilder.ToString());
                Console.WriteLine("ID aportación generado: " + idAportacion);


                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        //Funcinabilidad para crear y guardar las

        public void CreaBitacoraAportaciones(int idAportacion, string contenido)
        {
            string rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Archivos\BitacoraAportaciones", idAportacion + ".txt");
            try
            {
                string directorio = Path.GetDirectoryName(rutaArchivo);
                if (!Directory.Exists(directorio))
                {
                    Directory.CreateDirectory(directorio);
                }
                List<BitacoraCambio> listaBit;

                if (System.IO.File.Exists(rutaArchivo) && new FileInfo(rutaArchivo).Length > 0)
                {
                    string contExis = System.IO.File.ReadAllText(rutaArchivo);
                    listaBit = JsonConvert.DeserializeObject<List<BitacoraCambio>>(contExis);
                }
                else
                {
                    listaBit = new List<BitacoraCambio>();
                }
                if (contenido != "")
                {
                    var lista = "[" + contenido + "]";
                    var newCont = JsonConvert.DeserializeObject<List<BitacoraCambio>>(lista);
                    listaBit.AddRange(newCont);
                }
                string newContJSON = JsonConvert.SerializeObject(listaBit, Formatting.Indented);
                System.IO.File.WriteAllText(rutaArchivo, newContJSON);
                //System.IO.File.AppendAllText(rutaArchivo, contenido);
            }
            catch (Exception ex)
            {
            }
        }


        //public async Task<ActionResult> RegresaListaCatalogosCalfModifi(int identificadorQueja)
        //{
        //    List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
        //    List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

        //    informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();
        //    List<espedientetema> informaciontemaexped = new List<espedientetema>();
        //    List<inforaportaciones> infoaportacioness = new List<inforaportaciones>();
        //    List<SelectGenerico> paso = new List<SelectGenerico>();
        //    validaIinfoDQOT datValDQOT = new validaIinfoDQOT();


        //    String query = "exec Sp_Select_Abogado";
        //    String query1 = "";
        //    String query2 = "";
        //    string mensaje = "";
        //    listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_EstadoRM";
        //    listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_Estado";
        //    listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_autoridad";
        //    listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_sedes";
        //    listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_visitadurias";
        //    listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    query = "exec Sp_Select_ViaInterposicionQ";
        //    listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
        //    /*Cargar informacion dentro de las pantallas*/
        //    query = "exec Sp_carga_info_Comp_Calif '" + identificadorQueja + "'";
        //    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif '" + identificadorQueja + "'";
        //    query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
        //    informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
        //    /*Cargar informacion dentro de las pantallas*/
        //    if (informacioncomplementaria.tipo_expediente == 1)
        //    {
        //        query = "exec Sp_Select_Aporta ''," + identificadorQueja;
        //    }
        //    else
        //    {
        //        query = "exec Sp_Select_Aporta " + identificadorQueja + ", ''";
        //    }
        //    infoaportacioness = conexionsql.Obtaport(query, ref mensaje);
        //    #region CONFIRMACION DE DATOS DQO
        //    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
        //    query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja;
        //    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
        //    #endregion

        //    query = "EXEC Sp_expe_tema '" + identificadorQueja + "'";
        //    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

        //    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
        //    paso = conexionsql.lista_SelectGenerica(query, ref mensaje); ;
        //    if (listaContenedora3.Count > 0)
        //    {
        //        return Json(
        //            new
        //            {
        //                lista_abogado = listaContenedora2,
        //                lista_estado = listaContenedora3,
        //                lista_municipio = listaContenedora4,
        //                lista_autoridad = listaContenedora5,
        //                lista_sedes = listaContenedora6,
        //                listavisitadurias = listaContenedora7,
        //                informarcionC = informacioncomplementaria,
        //                infoaportaciones = infoaportacioness,
        //                lista_tema_expe = informaciontemaexped,
        //                listavi = listaContenedora8,
        //                datvaldqot = datValDQOT
        //            });
        //    }
        //    else
        //    {
        //        return Json(new { mensaje = "error" + mensaje });
        //    }
        //}

        public async Task<ActionResult> RegresaListaCatalogosCalfModifi(int identificadorQueja, string version, int candado)
        {
            #region declaraciones
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora5 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora6 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora7 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora8 = new List<SelectGenerico>();

            informacioncomplementaria informacioncomplementaria = new informacioncomplementaria();
            List<espedientetema> informaciontemaexped = new List<espedientetema>();
            List<inforaportaciones> infoaportacioness = new List<inforaportaciones>();
            List<SelectGenerico> paso = new List<SelectGenerico>();
            validaIinfoDQOT datValDQOT = new validaIinfoDQOT();


            String query = "exec Sp_Select_Abogado";
            String query1 = "";
            String query2 = "";
            string mensaje = "";
            #endregion

            #region consultas_select
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_EstadoRM";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_Estado";
            listaContenedora4 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_autoridad";
            listaContenedora5 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_sedes";
            listaContenedora6 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_visitadurias";
            listaContenedora7 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec Sp_Select_ViaInterposicionQ";
            listaContenedora8 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            #endregion

            #region cambiosVersion
            switch (version)
            {
                //case "DQO":
                //    break;
                case "CALIFICACION":
                    query = "exec Sp_carga_info_Comp_Calif_version'" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif_version '" + identificadorQueja + "','" + version + "'";//version DQO
                    query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
                    informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
                    /*Cargar informacion dentro de las pantallas*/
                    if (informacioncomplementaria.tipo_expediente == 1)
                    {
                        query = "exec Sp_Select_Aporta ''," + identificadorQueja;
                    }
                    else
                    {
                        query = "exec Sp_Select_Aporta " + identificadorQueja + ", ''";
                    }
                    infoaportacioness = conexionsql.Obtaport(query, ref mensaje);
                    #region CONFIRMACION DE DATOS DQO
                    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
                    query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + ", '" + version + "'"; //JM
                    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
                    #endregion

                    query = "EXEC Sp_expe_tema_version '" + identificadorQueja + "','" + version + "'";
                    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

                    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
                    paso = conexionsql.lista_SelectGenerica(query, ref mensaje);
                    break;
                case "MODIFICACION":
                    query = "exec Sp_carga_info_Comp_Calif_version'" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif_version '" + identificadorQueja + "','" + version + "'";//version DQO
                    query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
                    informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
                    /*Cargar informacion dentro de las pantallas*/
                    if (informacioncomplementaria.tipo_expediente == 1)
                    {
                        query = "exec Sp_Select_Aporta ''," + identificadorQueja;
                    }
                    else
                    {
                        query = "exec Sp_Select_Aporta " + identificadorQueja + ", ''";
                    }
                    infoaportacioness = conexionsql.Obtaport(query, ref mensaje);
                    #region CONFIRMACION DE DATOS DQO
                    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
                    query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + ", '" + version + "'"; //JM
                    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
                    #endregion

                    query = "EXEC Sp_expe_tema_version '" + identificadorQueja + "','" + version + "'";
                    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

                    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
                    paso = conexionsql.lista_SelectGenerica(query, ref mensaje);
                    break;
                 
                case "EDICION":
                    string version2 = "DQO";

                    query = "exec Sp_carga_info_Comp_Calif '" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif '" + identificadorQueja + "','" + version2 + "'";//version DQO
                    query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + identificadorQueja + "'";
                    informacioncomplementaria = conexionsql.datoscomplementariosCalif(query, ref mensaje, query1, query2);
                    /*Cargar informacion dentro de las pantallas*/
                    if (informacioncomplementaria.tipo_expediente == 1)
                    {
                        query = "exec Sp_Select_Aporta ''," + identificadorQueja;
                    }
                    else
                    {
                        query = "exec Sp_Select_Aporta " + identificadorQueja + ", ''";
                    }
                    infoaportacioness = conexionsql.Obtaport(query, ref mensaje);
                    #region CONFIRMACION DE DATOS DQO
                    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
                    query1 = "exec Sp_SELECT_ConfirmDQOT_pet_version " + identificadorQueja + ",''";
                    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
                    #endregion

                    query = "EXEC Sp_expe_tema '" + identificadorQueja + "','" + version2 + "'";
                    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

                    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
                    paso = conexionsql.lista_SelectGenerica(query, ref mensaje);

                    break;
                default:
                    break;
            }

            /*Cargar informacion dentro de las pantallas*/
            #endregion

            if (listaContenedora3.Count > 0)
            {
                return Json(
                    new
                    {
                        lista_abogado = listaContenedora2,
                        lista_estado = listaContenedora3,
                        lista_municipio = listaContenedora4,
                        lista_autoridad = listaContenedora5,
                        lista_sedes = listaContenedora6,
                        listavisitadurias = listaContenedora7,
                        informarcionC = informacioncomplementaria,
                        infoaportaciones = infoaportacioness,
                        lista_tema_expe = informaciontemaexped,
                        listavi = listaContenedora8,
                        datvaldqot = datValDQOT
                    });
            }
            else
            {
                return Json(new { mensaje = "error" + mensaje });
            }
        }
        
        
        public ActionResult ActualizaEstatus(IFormCollection form)
        {
            GuardarQueja(form);
            int idqueja = 99;
           idqueja = int.Parse(form["idquejaDC"]);
            string mensaje = "";
            bool estado = false;
            String query = "exec Sp_Update_Status_complementoqueja "+ idqueja;


            estado = conexionsql.InsertUpdateDelete(query);

            return Json(new { stauts = estado });
        }

        //Adair cambios nuevos 16/12/2025
        private void RegistrarBitacoraAportacion(int idAportacion, string accion, string campo, string antes, string despues)
        {
            string carpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/BitacoraAportaciones");
            if (!Directory.Exists(carpeta)) Directory.CreateDirectory(carpeta);

            string rutaArchivo = Path.Combine(carpeta, idAportacion + ".txt");

            List<BitacoraCambio> cambios = new List<BitacoraCambio>();

            if (System.IO.File.Exists(rutaArchivo))
            {
                string contenido = System.IO.File.ReadAllText(rutaArchivo);
                cambios = JsonConvert.DeserializeObject<List<BitacoraCambio>>(contenido) ?? new List<BitacoraCambio>();
            }

            var usuario = _httpContextAccessor.HttpContext.User;

            cambios.Add(new BitacoraCambio
            {
                Apartado = "Cedula de Calificacion Provisional de Aportacion",
                Tipo = accion,
                Campo = campo,
                Antes = antes,
                Despues = despues,
                IP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                FechaHora = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                Usuario = usuario.Identity.Name   // <-- igual que en ContBitacora
            });

            string json = JsonConvert.SerializeObject(cambios, Formatting.Indented);
            System.IO.File.WriteAllText(rutaArchivo, json);
        }

        private AportacionDatos ObtenerAportacionAnterior(int id)
        {
            var datos = new AportacionDatos();

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT 
                Lugar_hechos, 
                Fecha_recepcion, 
                Hora_recepcion,
                Peticionario,
                Autoridad,
                Expediente,
                Explicacion,
                Sede_registro
            FROM APORTACION
            WHERE Id_aportacion = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        datos.LugarHechos = dr["Lugar_hechos"]?.ToString();
                        datos.FechaRecepcion = dr["Fecha_recepcion"]?.ToString();
                        datos.HoraRecepcion = dr["Hora_recepcion"]?.ToString();
                        datos.Peticionario = dr["Peticionario"]?.ToString();
                        datos.Autoridad = dr["Autoridad"]?.ToString();
                        datos.Expediente = dr["Expediente"]?.ToString();
                        datos.Explicacion = dr["Explicacion"]?.ToString();
                        datos.SedeRegistro = dr["Sede_registro"]?.ToString();
                    }
                }
            }

            return datos;
        }

        private OrientacionDatos OrientacionAnterior(int id)
        {
            var datos = new OrientacionDatos();

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT 
                Lugar_hechos, 
                Fecha_recepcion, 
                Hora_recepcion,             
                Autoridad,
                Institucion,
                Explicacion,
                Sede_registro
            FROM ORIENTACION
            WHERE Id_escrito = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        datos.LugarHechos = dr["Lugar_hechos"]?.ToString();
                        datos.FechaRecepcion = dr["Fecha_recepcion"]?.ToString();
                        datos.HoraRecepcion = dr["Hora_recepcion"]?.ToString();
                        datos.Autoridad = dr["Autoridad"]?.ToString();
                        datos.Institucion = dr["Institucion"]?.ToString();
                        datos.Explicacion = dr["Explicacion"]?.ToString();
                        datos.SedeRegistro = dr["Sede_registro"]?.ToString();
                    }
                }
            }

            return datos;
        }
        private IncompetenciaDatos IncompetenciaAnterior(int id)
        {
            var datos = new IncompetenciaDatos();

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT 
                Lugar_hechos, 
                Fecha_recepcion, 
                Hora_recepcion,             
                Institucion,
                Explicacion,
                Sede_registro
            FROM INCOMPETENCIA
            WHERE Id_escrito = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        datos.LugarHechos = dr["Lugar_hechos"]?.ToString();
                        datos.FechaRecepcion = dr["Fecha_recepcion"]?.ToString();
                        datos.HoraRecepcion = dr["Hora_recepcion"]?.ToString();
                        datos.Institucion = dr["Institucion"]?.ToString();
                        datos.Explicacion = dr["Explicacion"]?.ToString();
                        datos.SedeRegistro = dr["Sede_registro"]?.ToString();
                    }
                }
            }

            return datos;
        }

        private RemisionDatos RemisonAnterior(int id)
        {
            var datos = new RemisionDatos();

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT 
                Lugar_hechos, 
                Fecha_recepcion, 
                Hora_recepcion,             
                Institucion,
                Explicacion,
                Sede_registro
            FROM REMISION
            WHERE Id_escrito = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        datos.LugarHechos = dr["Lugar_hechos"]?.ToString();
                        datos.FechaRecepcion = dr["Fecha_recepcion"]?.ToString();
                        datos.HoraRecepcion = dr["Hora_recepcion"]?.ToString();
                        datos.Institucion = dr["Institucion"]?.ToString();
                        datos.Explicacion = dr["Explicacion"]?.ToString();
                        datos.SedeRegistro = dr["Sede_registro"]?.ToString();
                    }
                }
            }

            return datos;
        }

        private AntecedenteDatos AntecedenteAnterior(int id)
        {
            var datos = new AntecedenteDatos();

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT 
                Lugar_hechos, 
                Fecha_recepcion, 
                Hora_recepcion,             
                Autoridad,
                Explicacion,
                Sede_registro
            FROM Antecedente
            WHERE Id_escrito = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);

                using (SqlDataReader dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        datos.LugarHechos = dr["Lugar_hechos"]?.ToString();
                        datos.FechaRecepcion = dr["Fecha_recepcion"]?.ToString();
                        datos.HoraRecepcion = dr["Hora_recepcion"]?.ToString();
                        datos.Autoridad = dr["Autoridad"]?.ToString();
                        datos.Explicacion = dr["Explicacion"]?.ToString();
                        datos.SedeRegistro = dr["Sede_registro"]?.ToString();
                    }
                }
            }

            return datos;
        }
        private void RegistrarCambioAportacion(int IdAportacion, string campo, string valorAnterior, string valorNuevo, bool esFecha = false, bool esHora = false)
        {
            valorAnterior ??= "";
            valorNuevo ??= "";

            bool hayCambio;

            if (esFecha)
            {
                // Intenta parsear ambos como DateTime
                bool okAntes = DateTime.TryParse(valorAnterior, out var fechaAnt);
                bool okNuevo = DateTime.TryParse(valorNuevo, out var fechaNue);

                if (okAntes && okNuevo)
                {
                    // Compara solo la parte de la fecha
                    hayCambio = fechaAnt.Date != fechaNue.Date;
                    // Normaliza formato para guardar en bitácora
                    valorAnterior = fechaAnt.ToString("yyyy-MM-dd");
                    valorNuevo = fechaNue.ToString("yyyy-MM-dd");
                }
                else
                {
                    // Si no se pudo parsear, compara cadenas normalizadas
                    hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                // Comparación normal para textos
                hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            if (hayCambio)
            {
                RegistrarBitacoraAportacion(
                    IdAportacion,
                    "Modificación",
                    campo,
                    string.IsNullOrWhiteSpace(valorAnterior) ? "-" : valorAnterior,
                    string.IsNullOrWhiteSpace(valorNuevo) ? "-" : valorNuevo
                );

                Console.WriteLine($"[Bitácora Aportación] Cambio en {campo}: '{valorAnterior}' → '{valorNuevo}'");
            }
        }

        private void CambioOrientacion(int idEscrito, string campo, string valorAnterior, string valorNuevo, bool esFecha = false, bool esHora = false)
        {



            valorAnterior ??= "";
            valorNuevo ??= "";

            bool hayCambio;
            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Modificación";
            string ipUsuario = ObtenerIP();


            if (esFecha)
            {
                // Intenta parsear ambos como DateTime
                bool okAntes = DateTime.TryParse(valorAnterior, out var fechaAnt);
                bool okNuevo = DateTime.TryParse(valorNuevo, out var fechaNue);

                if (okAntes && okNuevo)
                {
                    // Compara solo la parte de la fecha
                    hayCambio = fechaAnt.Date != fechaNue.Date;
                    // Normaliza formato para guardar en bitácora
                    valorAnterior = fechaAnt.ToString("yyyy-MM-dd");
                    valorNuevo = fechaNue.ToString("yyyy-MM-dd");
                }
                else
                {
                    // Si no se pudo parsear, compara cadenas normalizadas
                    hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                // Comparación normal para textos
                hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            if (hayCambio)
            {
                ContBitacora(
                    txtcontBuilder,
                    "Cedula de Calificacion Provisional",
                    tipoMod,
                    campo,                // ← aquí debería ir el nombre del campo cambiado
                    valorAnterior,
                    valorNuevo,
                    ipUsuario
                );

                Console.WriteLine($"[Bitácora Orientacion] Cambio en {campo}: '{valorAnterior}' → '{valorNuevo}'");

                // Guardar en archivo SOLO si hay contenido
                CrearBitacoraTXT(idEscrito, txtcontBuilder.ToString());
            }
        }

        private void CambioIncompetencia(int idEscrito, string campo, string valorAnterior, string valorNuevo, bool esFecha = false, bool esHora = false)
        {



            valorAnterior ??= "";
            valorNuevo ??= "";

            bool hayCambio;
            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Modificación";
            string ipUsuario = ObtenerIP();


            if (esFecha)
            {
                // Intenta parsear ambos como DateTime
                bool okAntes = DateTime.TryParse(valorAnterior, out var fechaAnt);
                bool okNuevo = DateTime.TryParse(valorNuevo, out var fechaNue);

                if (okAntes && okNuevo)
                {
                    // Compara solo la parte de la fecha
                    hayCambio = fechaAnt.Date != fechaNue.Date;
                    // Normaliza formato para guardar en bitácora
                    valorAnterior = fechaAnt.ToString("yyyy-MM-dd");
                    valorNuevo = fechaNue.ToString("yyyy-MM-dd");
                }
                else
                {
                    // Si no se pudo parsear, compara cadenas normalizadas
                    hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                // Comparación normal para textos
                hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            if (hayCambio)
            {
                ContBitacora(
                    txtcontBuilder,
                    "Cedula de Calificacion Provisional",
                    tipoMod,
                    campo,                // ← aquí debería ir el nombre del campo cambiado
                    valorAnterior,
                    valorNuevo,
                    ipUsuario
                );

                Console.WriteLine($"[Bitácora Incompetencia] Cambio en {campo}: '{valorAnterior}' → '{valorNuevo}'");

                // Guardar en archivo SOLO si hay contenido
                CrearBitacoraTXT(idEscrito, txtcontBuilder.ToString());
            }
        }

        private void CambioRemision(int idEscrito, string campo, string valorAnterior, string valorNuevo, bool esFecha = false, bool esHora = false)
        {



            valorAnterior ??= "";
            valorNuevo ??= "";

            bool hayCambio;
            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Modificación";
            string ipUsuario = ObtenerIP();


            if (esFecha)
            {
                // Intenta parsear ambos como DateTime
                bool okAntes = DateTime.TryParse(valorAnterior, out var fechaAnt);
                bool okNuevo = DateTime.TryParse(valorNuevo, out var fechaNue);

                if (okAntes && okNuevo)
                {
                    // Compara solo la parte de la fecha
                    hayCambio = fechaAnt.Date != fechaNue.Date;
                    // Normaliza formato para guardar en bitácora
                    valorAnterior = fechaAnt.ToString("yyyy-MM-dd");
                    valorNuevo = fechaNue.ToString("yyyy-MM-dd");
                }
                else
                {
                    // Si no se pudo parsear, compara cadenas normalizadas
                    hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                // Comparación normal para textos
                hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            if (hayCambio)
            {
                ContBitacora(
                    txtcontBuilder,
                    "Cedula de Calificacion Provisional",
                    tipoMod,
                    campo,                // ← aquí debería ir el nombre del campo cambiado
                    valorAnterior,
                    valorNuevo,
                    ipUsuario
                );

                Console.WriteLine($"[Bitácora Orientacion] Cambio en {campo}: '{valorAnterior}' → '{valorNuevo}'");

                // Guardar en archivo SOLO si hay contenido
                CrearBitacoraTXT(idEscrito, txtcontBuilder.ToString());
            }
        }

        private void CambioAntecedente(int idEscrito, string campo, string valorAnterior, string valorNuevo, bool esFecha = false, bool esHora = false)
        {



            valorAnterior ??= "";
            valorNuevo ??= "";

            bool hayCambio;
            StringBuilder txtcontBuilder = new StringBuilder(); //Declaración del stringBuilder
            string tipoMod = "Modificación";
            string ipUsuario = ObtenerIP();


            if (esFecha)
            {
                // Intenta parsear ambos como DateTime
                bool okAntes = DateTime.TryParse(valorAnterior, out var fechaAnt);
                bool okNuevo = DateTime.TryParse(valorNuevo, out var fechaNue);

                if (okAntes && okNuevo)
                {
                    // Compara solo la parte de la fecha
                    hayCambio = fechaAnt.Date != fechaNue.Date;
                    // Normaliza formato para guardar en bitácora
                    valorAnterior = fechaAnt.ToString("yyyy-MM-dd");
                    valorNuevo = fechaNue.ToString("yyyy-MM-dd");
                }
                else
                {
                    // Si no se pudo parsear, compara cadenas normalizadas
                    hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                // Comparación normal para textos
                hayCambio = !string.Equals(valorAnterior.Trim(), valorNuevo.Trim(), StringComparison.OrdinalIgnoreCase);
            }

            if (hayCambio)
            {
                ContBitacora(
                    txtcontBuilder,
                    "Cedula de Calificacion Provisional",
                    tipoMod,
                    campo,                // ← aquí debería ir el nombre del campo cambiado
                    valorAnterior,
                    valorNuevo,
                    ipUsuario
                );

                Console.WriteLine($"[Bitácora Orientacion] Cambio en {campo}: '{valorAnterior}' → '{valorNuevo}'");

                // Guardar en archivo SOLO si hay contenido
                CrearBitacoraTXT(idEscrito, txtcontBuilder.ToString());
            }
        }

        private string ObtenerIP()
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            // Si viene desde un proxy o balanceador
            if (string.IsNullOrEmpty(ip))
                ip = HttpContext.Request.Headers["X-Forwarded-For"];

            if (string.IsNullOrEmpty(ip))
                ip = "IP no disponible";

            return ip;
        }

        [HttpPost]
        public JsonResult ValidarExpediente(int idExpediente)
        {
            string estatus = string.Empty;

            using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("sp_ValidarTurnoExpediente", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Expediente", idExpediente); // 👈 aquí se manda al SP

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            estatus = reader["Estatus"].ToString();
                        }
                    }
                }
            }

            return Json(new { estatus = estatus }); // 👈 regresa al frontend
        }



    }

    /// <summary>
    /// david y cris se agregaron get pra mandar a la tabla se modificairon 15.07..2025
    /// </summary>
    public class AportacionDatos
    {
        public string LugarHechos { get; set; }
        public string FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string Peticionario { get; set; }
        public string Autoridad { get; set; }
        public string Expediente { get; set; }
        public string Explicacion { get; set; }
        public string SedeRegistro { get; set; }
    }

    public class OrientacionDatos
    {

        public string LugarHechos { get; set; }
        public string FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string Autoridad { get; set; }
        public string Institucion { get; set; }
        public string Explicacion { get; set; }
        public string SedeRegistro { get; set; }

    }

    public class IncompetenciaDatos
    {

        public string LugarHechos { get; set; }
        public string FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string Autoridad { get; set; }
        public string Institucion { get; set; }
        public string Explicacion { get; set; }
        public string SedeRegistro { get; set; }

    }

    public class RemisionDatos
    {

        public string LugarHechos { get; set; }
        public string FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string Autoridad { get; set; }
        public string Institucion { get; set; }
        public string Explicacion { get; set; }
        public string SedeRegistro { get; set; }

    }

    public class AntecedenteDatos
    {

        public string LugarHechos { get; set; }
        public string FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string Autoridad { get; set; }
        public string Institucion { get; set; }
        public string Explicacion { get; set; }
        public string SedeRegistro { get; set; }

    }

    public class OrientacionModel
    {
        public string Input_ID { get; set; }
        public string Input_folio { get; set; }
        public string Input_LugarHechos { get; set; }
        public string Input_FechaRecepcion { get; set; }
        public string Input_HoraRecepcion { get; set; }
        public string Input_autoridadresp { get; set; }
        public string Input_institucion { get; set; }
        public string ExplicacionOrientacion { get; set; }
        public string sedeRegistro { get; set; }
        public string select_viainterposicionc { get; set; }
        public string idAbogado { get; set; }
        public string Input_Peticionario { get; set; }
    }


    // David 17 07 2025: Modelo para el formulario de remision
    public class RemisionModel
    {
        public int Input_ID { get; set; }
        public string Input_folio { get; set; }
        public string Input_Peticionario { get; set; }
        public string Input_LugarHechos { get; set; }
        public DateTime Input_FechaRecepcion { get; set; }
        public TimeSpan Input_HoraRecepcion { get; set; }
        public string Input_NumeroOficio { get; set; }
        public string Input_Institucion { get; set; }
        public string Input_Remitente { get; set; }
        public string ExplicacionRemision { get; set; }
        public string ArchivoAdjunto { get; set; }
        public string TipoRemision { get; set; }
        public string sedeRegistro { get; set; }
        public string select_viainterposicionc { get; set; }
        public string idAbogado { get; set; }
    }

        // David 17 07 2025: Modelo para el formulario de incompetencia
    public class IncompetenciaModel
    {
        public int Input_ID { get; set; }
        public string Input_folio { get; set; }
        public string Input_Peticionario { get; set; }
        public string Input_LugarHechos { get; set; }
        public DateTime Input_FechaRecepcion { get; set; }
        public TimeSpan Input_HoraRecepcion { get; set; }
        public string Input_NumeroOficio { get; set; }
        public string Input_autoridadresp { get; set; }
        public string Input_Institucion { get; set; }
        public string Input_Remitente { get; set; }
        public string ExplicacionImcompetencia { get; set; }
        public string ArchivoAdjunto { get; set; }
        public string TipoRemision { get; set; }
        public string sedeRegistro { get; set; }
        public string select_viainterposicionc { get; set; }
        public string idAbogado { get; set; }
    }


    // Cris y David 16 07 2025: Modelo para el formulario de Antecedente
    public class AntecedenteModel
    {
        public string Input_ID { get; set; }
        public string Input_folio { get; set; }
        public string Input_LugarHechos { get; set; }
        public string Input_FechaRecepcion { get; set; }
        public string Input_HoraRecepcion { get; set; }
        public string Input_autoridadresp { get; set; }
        public string ExplicacionAntecendente { get; set; }
        public string sedeRegistro { get; set; }
        public string select_viainterposicionc { get; set; }
        public string idAbogado { get; set; }
        public string Input_Peticionario { get; set; }
    }

    // Cris y David 16 07 2025: Modelo para el formulario de Aportacion
    // Cris y David 16 07 2025: Modelo para el formulario de Aportacion
    public class AportacionModel
    {
        public string Input_LugarHechos { get; set; }
        public string Input_FechaRecepcion { get; set; }
        public string Input_HoraRecepcion { get; set; }
        public string Input_Peticionarioaportacion { get; set; }
        public string Input_autoridadresp { get; set; }
        public string Input_ExpedienteAportacion { get; set; }
        public string ExplicacionAportacion { get; set; }
        public string sedeRegistro { get; set; }
        public string select_viainterposicionc { get; set; }
        public string idAbogado { get; set; }

    }

    public class informacioncomplementaria
    {
        public int id_expediente { get; set; }
		public int id_abogado_recibe { get; set; }
		public string hechos { get; set; }
		public string fecha_registro { get; set; }
		public int id_sede { get; set; }
		public int id_lugar_hechos { get; set; }
        public int Via_interpos { get; set; }
        public int visitaduria { get; set; }
        public string observaciones { get; set; }
        public int id_especializado { get; set; }
        public int id_tras_op_pub { get; set; }
        public int tipo_expediente { get; set; }
        public int id_materia { get; set; }
        public int id_niv_riesgo { get; set; }
        public int id_programa { get; set; }
        public string estatus_Expediente { get; set; }
        public string fecha_mod { get; set; }

        public List<informacioncomplementariapeticionario> informacioncomplementariapeticionario { get; set; }
        public List<informacioncomplementariaautoridad> informacioncomplementariaautoridad { get; set; }

        public informacioncomplementaria() { }
        public informacioncomplementaria(int id_expediente, int id_abogado_recibe, string hechos, string fecha_registro, int id_sede, int id_lugar_hechos, List<informacioncomplementariapeticionario> icp, List<informacioncomplementariaautoridad> ica, int vi, int vis, string observaciones, int id_especializado, int id_tras_op_pub, int tipo_expediente, int id_materia, int id_niv_riesgo, int id_programa,string statusexp,string fecha_mod)
        {
            this.id_expediente = id_expediente;
            this.id_abogado_recibe = id_abogado_recibe;
            this.hechos = hechos;
            this.fecha_registro = fecha_registro;
            this.id_sede = id_sede;
            this.id_lugar_hechos = id_lugar_hechos;
            this.informacioncomplementariapeticionario = icp;
            this.informacioncomplementariaautoridad = ica;
            this.Via_interpos = vi;
            this.visitaduria = vis;
            this.observaciones = observaciones;

            this.id_especializado = id_especializado;
            this.id_tras_op_pub = id_tras_op_pub;
            this.tipo_expediente = tipo_expediente;
            this.id_materia = id_materia;
            this.id_niv_riesgo = id_niv_riesgo;
            this.id_programa = id_programa;
            this.estatus_Expediente = statusexp;
            this.fecha_mod = fecha_mod;
		}
    }

    public class informacioncomplementariapeticionario
    {
		public int id_registro { get; set; }
		public string nombre_peticionario { get; set; }
		public string curp { get; set; }
		public string tipo { get; set; }
		public string idtip_compet { get; set; }
		public int conreg { get; set; }

        public informacioncomplementariapeticionario() { }  

		public informacioncomplementariapeticionario(int id_registro, string nombre_peticionario, string curp, string tipo, string idtip_compet, int conreg)
		{
			this.id_registro = id_registro;
			this.nombre_peticionario = nombre_peticionario;
			this.curp = curp;
			this.tipo = tipo;
			this.idtip_compet = idtip_compet;
			this.conreg = conreg;
		}
	}

    public class informacioncomplementariaautoridad 
    {
        public string id_registro { get; set; }
        public string nombre_autoridad { get; set; }
        public string ambito { get; set; }

        public informacioncomplementariaautoridad() { }

        public informacioncomplementariaautoridad(string id_registro, string nombre_peticionario, string curp)
        {
            this.id_registro = id_registro;
            this.nombre_autoridad = nombre_peticionario;
            this.ambito = curp;
        }
    }

    public class validaIinfoDQOT
    {
        public int id_queja { get; set; }
        public string hechos { get; set; }
        public string lugar { get; set; }
        public string petic { get; set; }
        public string datospeti { get; set; }
        public int version { get; set; }

        public List<validaIinfoDQOTpet> infodatpeticio { get; set; }

        public validaIinfoDQOT() { }

        public validaIinfoDQOT(int id_queja, string hechos, string lugar, string petic, string datospeti, int version, List<validaIinfoDQOTpet> infodatpeticio)
        {
            this.id_queja = id_queja;
            this.hechos = hechos;
            this.lugar = lugar;
            this.petic = petic;
            this.datospeti = datospeti;
            this.version = version;
            this.infodatpeticio = infodatpeticio;
        }
    }

    public class validaIinfoDQOTpet
    {
        public int id_queja { get; set; }
        public string datospet { get; set; }
        public int version { get; set; }
        public int id_peticionario { get; set; }
        public string tipoPet { get; set; }

        public validaIinfoDQOTpet() { }

        public validaIinfoDQOTpet(int id_queja, string datospet, int version, int id_peticionario, string tipoPet)
        {
            this.id_queja = id_queja;
            this.datospet = datospet;
            this.version = version;
            this.id_peticionario = id_peticionario;
            this.tipoPet = tipoPet;
        }
    }

    public class espedientetema
    {
        public int id_tema { get; set; }
        public int id_expediente { get; set; }
        public string otro_tema { get; set; }
        public string descripcion { get; set; }

        public espedientetema() { }

        public espedientetema(int id_tema, int id_expediente, string otro_tema, string descripcion)
        {
            this.id_tema = id_tema;
            this.id_expediente = id_expediente;
            this.otro_tema = otro_tema;
            this.descripcion = descripcion;
        }
    }
    
    public class inforaportaciones
    {
        public int id_aportacion { get; set; }
        public int id_expediente { get; set; }
        public int id_expediente_apor { get; set; }
        public string descripcion { get; set; }
        public string noexpe { get; set; }
        public inforaportaciones() { }

        public inforaportaciones(int id_aportacion, int id_expediente, int id_expediente_apor, string descripcion, string noexpe)
        {
            this.id_aportacion = id_aportacion;
            this.id_expediente = id_expediente;
            this.id_expediente_apor = id_expediente_apor;
            this.descripcion = descripcion;
            this.noexpe = noexpe;
        }
    }

    public class bitacoraComplementoqueja
    {
        public int idAbogado { get; set; }
        public string Hechos { get; set; }
        public string paso { get; set; }
        public string municipio { get; set; }
        public string Fecha_registro { get; set; }
        public int id_sede { get; set; }
        public int id_via_interpos { get; set; }
        public string observaciobes { get;set; }


        public bitacoraComplementoqueja() 
        {

        }

        public bitacoraComplementoqueja(int i1,string s1,string s2,string s3,string s4,int i2,int i3,string s5)
        {
            idAbogado = i1;
            Hechos=s1;
            paso= s2;
            municipio = s3;
            Fecha_registro = s4;
            id_sede = i2;
            id_via_interpos = i3;
            observaciobes= s5;
        }

    }


    public class bitacoraTurnoPrel
    {
        public int status { get; set; }
        public string fechaTurno { get; set; }
        public int ClaveVis { get; set; }   
        public string no_memo { get; set; }
        public string fechaUltModificación { get; set; }

        public bitacoraTurnoPrel() { }
        public bitacoraTurnoPrel(int status, string fechaTurno, int claveVis, string no_memo, string fechaUltModificación)
        {
            this.status = status;
            this.fechaTurno = fechaTurno;
            ClaveVis = claveVis;
            this.no_memo = no_memo;
            this.fechaUltModificación = fechaUltModificación;
        }
    }

}
