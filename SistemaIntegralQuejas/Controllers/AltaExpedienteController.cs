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
            string Ipaccesible = "LocalHost";
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
            string Ipaccesible = "LocalHost";
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

            #region CONFIRMACION DE DATOS DQOT
            query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
            query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + "','DQOT'"; ;
            datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
            #endregion

            query = "EXEC Sp_expe_tema '" + identificadorQueja + "'";
            informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

			query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
			paso = conexionsql.lista_SelectGenerica(query, ref mensaje); ;

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
        //    #region CONFIRMACION DE DATOS DQOT
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
                //case "DQOT":
                //    break;
                case "CALIFICACION":
                    query = "exec Sp_carga_info_Comp_Calif_version'" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif_version '" + identificadorQueja + "','" + version + "'";//version DQOT
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
                    #region CONFIRMACION DE DATOS DQOT
                    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
                    query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + "','" + version + "'";
                    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
                    #endregion

                    query = "EXEC Sp_expe_tema_version '" + identificadorQueja + "','" + version + "'";
                    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

                    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
                    paso = conexionsql.lista_SelectGenerica(query, ref mensaje);
                    break;
                case "MODIFICACION":
                    query = "exec Sp_carga_info_Comp_Calif_version'" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif_version '" + identificadorQueja + "','" + version + "'";//version DQOT
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
                    #region CONFIRMACION DE DATOS DQOT
                    query = "exec Sp_SELECT_ConfirmDQOT " + identificadorQueja;
                    query1 = "exec Sp_SELECT_ConfirmDQOT_pet " + identificadorQueja + "','" + version + "'"; ;
                    datValDQOT = conexionsql.SelectValDQOT(query, ref mensaje, query1);
                    #endregion

                    query = "EXEC Sp_expe_tema_version '" + identificadorQueja + "','" + version + "'";
                    informaciontemaexped = conexionsql.datostemaExpediente(query, ref mensaje);

                    query = "EXEC Sp_GetPaso_Expediente " + identificadorQueja + "";
                    paso = conexionsql.lista_SelectGenerica(query, ref mensaje);
                    break;
                 
                case "EDICION":
                    string version2 = "DQOT";

                    query = "exec Sp_carga_info_Comp_Calif '" + identificadorQueja + "','" + version + "'," + candado;//candado 1
                    query1 = "exec Sp_carga_informacion_Complementaria_peticionario_Calif '" + identificadorQueja + "','" + version2 + "'";//version DQOT
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
                    #region CONFIRMACION DE DATOS DQOT
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
