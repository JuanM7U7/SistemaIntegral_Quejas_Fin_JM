using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
//Subir archivos
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.VisualStudio.Web.CodeGeneration.Design;
using NuGet.Packaging.Signing;
using Rotativa.AspNetCore;
using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Linq;
using System.Reflection;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.WebRequestMethods;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;
using System.Drawing;
using System.Net.WebSockets;
using System.Runtime.Serialization;
using static SistemaIntegralQuejas.Controllers.ExpedienteController;
using System.Numerics;
using System.Security.Policy;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Server.HttpSys;
using System.Runtime.ConstrainedExecution;
using System.Collections;
using Microsoft.AspNetCore.Http.Extensions;

namespace SistemaIntegralQuejas.Controllers
{
    public class ExpedienteController : Controller
    {
        private SQLMODEL conexionsql = new SQLMODEL();
        // GET: ExpedienteController
        private static EscritoModificado escrito;
        private static ActacModificado actaC;
        static int id_queja = 0;
        static int UltimoID_Recuperado = 0;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string rutaencabezado=null;
        string rutapie =null;
        string rutaencabezado1 =null;
        string rutapie1 =null;
        string host = "https://localhost:7126";
        string bitacora = "";
        //https://localhost:7126/

        public ExpedienteController(IWebHostEnvironment hostingEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            Encabezado controlador = new Encabezado();
            PieDePagina controladorpie = new PieDePagina();

            _hostingEnvironment = hostingEnvironment;
            _httpContextAccessor = httpContextAccessor;

            //rutaencabezado = controlador.Index().ToString();
            //rutapie = controladorpie.Index().ToString();
            //rutaencabezado1 = controlador.Index1().ToString();
            //rutapie1 = controladorpie.Index1().ToString();

            rutaencabezado ="https://"+_httpContextAccessor.HttpContext.Request.Headers.Host + "/Encabezado/Index";
            rutapie = "https://" + _httpContextAccessor.HttpContext.Request.Headers.Host + "/PieDePagina/Index";
            rutaencabezado1 = "https://" + _httpContextAccessor.HttpContext.Request.Headers.Host + "/Encabezado/Index1";
            rutapie1 = "https://" + _httpContextAccessor.HttpContext.Request.Headers.Host + "/PieDePagina/Index1";
            bitacora = "https://" + _httpContextAccessor.HttpContext.Request.Headers.Host + "wwwroot/Archivos/Bitacora";


        }



        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Index1()
        {
            return View();
        }

        public ActionResult PlantillaDPeticionario()
        {
            return View();
        }
        public ActionResult BuscadorFormatos()
        {
            //return new View
            return View();
        }
        public ActionResult BuscadorCedulas()
        {
            return View();
        }
        public ActionResult Calificacion()
        {

            return View();
        }
        public ActionResult VistaCalificacion()
        {

            return View();
        }


        // GET: ExpedienteController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }
        // GET: ExpedienteController/Create
        public ActionResult Create()
        {
            return View();
        }
        // POST: ExpedienteController/Create
        [HttpPost]
        //[ValidateAntiForgeryToken]

        [HttpPost]
        public ActionResult RegresaIDSFormatos_chris(int idExp)
        {
            string mensajet = "";
            int idqueja = idExp;

            List<CancelacionExpedientesPeticionarios> listformatos = new List<CancelacionExpedientesPeticionarios>();
            List<CancelacionExpedientesActaC> listformatos1 = new List<CancelacionExpedientesActaC>();
            List<CancelacionExpedientesActaC> listformatos2 = new List<CancelacionExpedientesActaC>();
            List<TblActac> arreglo_actac = new List<TblActac>();
            String query_RegresaPeticionarios = "exec Sp_Regresa_Peticionarios_AcepIDS '" + idqueja + "'";
            String query_Regresa_ActaC = "exec Sp_Regresa_ActaC_AcepIDS '" + idqueja + "'";
            String query_Regresa_Escrito = "exec Sp_Regresa_Escrito_AcepIDS '" + idqueja + "'";


            var data = GetDatosGeneral(query_RegresaPeticionarios);
            var data1 = GetDatosGeneral(query_Regresa_ActaC);
            var data2 = GetDatosGeneral(query_Regresa_Escrito);


            foreach (DataRow row in data.Rows)
            {

                CancelacionExpedientesPeticionarios escritoitem = new CancelacionExpedientesPeticionarios();
                escritoitem.idExp = Convert.ToInt32(row["FK_EXPEDIENTE"].ToString());
                escritoitem.idComplementoPeticionario = Convert.ToInt32(row["complemento_pet"].ToString());
                escritoitem.idPeticionario = Convert.ToInt32(row["peticionario"].ToString());
                escritoitem.NombrePeticionario = Convert.ToString(row["nombre_Peticionario"]);
                listformatos.Add(escritoitem);
            }

            foreach (DataRow row in data1.Rows)
            {
                if (row["FK_ACTAC"].ToString()!=null&& row["FK_ACTAC"].ToString()!="")
                {
                    CancelacionExpedientesActaC escritoitem = new CancelacionExpedientesActaC();
                    escritoitem.IDexp = Convert.ToInt32(row["FK_EXPEDIENTE"].ToString());
                    escritoitem.IDActaC = Convert.ToInt32(row["FK_ACTAC"].ToString());
                    listformatos1.Add(escritoitem);
                }
            }

            foreach (DataRow row in data2.Rows)
            {

                CancelacionExpedientesActaC escritoitem = new CancelacionExpedientesActaC();
                escritoitem.IDexp = Convert.ToInt32(row["FK_EXPEDIENTE"].ToString());
                escritoitem.IDActaC = Convert.ToInt32(row["FK_ESCRITO_OK"].ToString());
                listformatos2.Add(escritoitem);
            }

            return Json(new { lista1 = listformatos, lista2 = listformatos1, lista3 = listformatos2 });
        }

        /*Guardadp delacta circunstanciada cuando se da de alta*/
        public ActionResult GuardaActaCircunstanciadaAlta(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
            string[] hora_completa = form["horaInicio"].ToString().Split(":");
            string[] horaHechosC = form["horaHechos"].ToString().Split(":");
            string[] horaTerminoc = form["horaTermino"].ToString().Split(":");



            try
            {


                int lugar = int.Parse(form["id_lugar"].ToString());
                int diaFecha = int.Parse(form["diaFecha"].ToString());
                int mes = int.Parse(form["id_mes"].ToString());
                int anio = int.Parse(form["id_anio"].ToString());
                int idAbogado = int.Parse(form["idabogado"].ToString());
                string nomAbogado = form["nomAbogado"].ToString();
                string puestoAbogado = form["puestoAbogado"].ToString();
                string areaAbogado = form["areaAbogado"].ToString();
                TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa[0]), int.Parse(hora_completa[1]));
                string fechaInicioCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaInicio.ToString();
                string ubicacion = form["ubicacion"].ToString();
                int idPet = int.Parse(form["idpet"].ToString());
                string nombrePet = form["nombrePet"].ToString();
                string origenPet = form["origenPetval"].ToString();
                int consentimiento = int.Parse(form["idconsentimiento"].ToString());
                int identificacionPet = int.Parse(form["idcredencial"].ToString());
                int edadPet = int.Parse(form["edadPet"].ToString());

                //AGREGE ESTOS CAMPOS QUE FALTABAN
                string sabePet = form["sabeleerPet"].ToString();
                string escolaridad = form["escolaridad"].ToString();
                //--------------------------------

                string callePet = form["callePet"].ToString();
                string numextPet = form["numextPet"].ToString();
                string cpPet = form["cpPet"].ToString();
                string coloniaPet = form["coloniaPet"].ToString();
                string municipioPet = form["municipioPet"].ToString();

                //AGREGE ESTE CAMPO
                string estadoPet = form["estadoPet"].ToString();
                //-----------------------------------------

                string ocupacionPet = form["ocupacionPet"].ToString();
                string telPet = form["telPet"].ToString();
                string correoPet = form["correoPet"].ToString();
                int idEscrito = int.Parse(form["idEscrito_"].ToString());
                TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC[0]), int.Parse(horaHechosC[1]));
                string fechaHechos = form["fechaHechos"].ToString() + ' ' + horaHechos;
                string ubiHechos = form["ubiHechos"].ToString();
                string hechos = form["hechos"].ToString();
                TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc[0]), int.Parse(horaTerminoc[1]));
                string fechaTerminoCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaTermino.ToString();
                int origenPetExt = 0;
                string ComplementoPetExt = "";
                

                if (origenPet == "218")
                {
                    origenPetExt = int.Parse(form["origenPetvalExt"].ToString());
                    ComplementoPetExt = form["origenPetExtedo"].ToString();
                }

                query = "[dbo].[InsertActac]";

                SqlCommand cmd = new SqlCommand(conexionsql.ConnectionStrng());
                cmd.Connection = conexionsql.conexion(ref mensajet);
                cmd.CommandText = query;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = 5;
                cmd.Parameters.Add("@lugar", System.Data.SqlDbType.Int).Value = lugar;
                cmd.Parameters.Add("@diaFecha", System.Data.SqlDbType.Int).Value = diaFecha;
                cmd.Parameters.Add("@mes", System.Data.SqlDbType.Int).Value = mes;
                cmd.Parameters.Add("@anio", System.Data.SqlDbType.Int).Value = anio;
                cmd.Parameters.Add("@idAbogado", System.Data.SqlDbType.Int).Value = idAbogado;
                cmd.Parameters.Add("@horaInicio", System.Data.SqlDbType.DateTime).Value = fechaInicioCompleta;
                cmd.Parameters.Add("@ubicacion", System.Data.SqlDbType.VarChar).Value = ubicacion;
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idPet;
                cmd.Parameters.Add("@concentimiento", System.Data.SqlDbType.Int).Value = consentimiento;
                cmd.Parameters.Add("@origenPet", System.Data.SqlDbType.VarChar).Value = origenPet;
                cmd.Parameters.Add("@identificacionPet", System.Data.SqlDbType.Int).Value = identificacionPet;
                cmd.Parameters.Add("@idEscrito", System.Data.SqlDbType.Int).Value = idEscrito;
                cmd.Parameters.Add("@horaHechos", System.Data.SqlDbType.VarChar).Value = fechaHechos;
                cmd.Parameters.Add("@hechos", System.Data.SqlDbType.Text).Value = hechos;
                cmd.Parameters.Add("@ubiHechos", System.Data.SqlDbType.VarChar).Value = ubiHechos;
                cmd.Parameters.Add("@horaTermino", System.Data.SqlDbType.DateTime).Value = fechaTerminoCompleta;
                cmd.Parameters.Add("@origenPetExt", System.Data.SqlDbType.Int).Value = origenPetExt;
                cmd.Parameters.Add("@OrigenPetExtComp", System.Data.SqlDbType.VarChar).Value = ComplementoPetExt;
                cmd.Parameters.Add("@ultimo_id_insertado", SqlDbType.Int).Direction = ParameterDirection.Output;
                
                //AGREGADO ABBY 01/10/2024
                //-----------------------------------------------------------------
                cmd.ExecuteNonQuery();

                UltimoID_Recuperado = Convert.ToInt32(cmd.Parameters["@ultimo_id_insertado"].Value);

                mensajet = "ok";

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }
            return Json(new { mensaje = mensajet });
        }
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
        public ActionResult GeneraEscritoInicialModif(IFormCollection form)
        {

            int id_ultimoLE = 0;
            string mensajet = "";
            string query = "";

            int id = int.Parse(form["id_escritoigenerado"].ToString());
            string mensaje = "";

            try
            {
                query = "exec Sp_Regresa_Escrito_Inicial_Queja " + id;
                escrito = conexionsql.regresaEscritoInicial(1, query, ref mensaje);
                mensaje = "ok";
            }
            catch (Exception)
            {

                mensaje = "error";
            }

            return Json(new { mensaje = mensaje, listat = escrito });

        }

        public ActionResult GuardaEscritoInicial(IFormCollection form)
        {

            // int id_queja = 0;
            int id_ultimoLE = 0;
            string mensajet = "";
            string query = "";
            int idQueja = int.Parse(form["Input_ID"].ToString());
            //  int idQueja = int.Parse(form["id_quejaei"].ToString());
            int compet = int.Parse(form["ID_CompPeticionario"].ToString());
            string senencia = form["sino"].ToString();
            int idescritoi = form["id_escritoigenerado"].ToString() != "" ? int.Parse(form["id_escritoigenerado"].ToString()) : 0;

            try
            {

                int peticionarios = 0;
                string Fecha_hechos = "";
                int Lugar_hechosMun = 0;
                string Circunstancia_hechos = "";
                string nombres_Finales;
                string cargo;
                string[] arreglonombres_Finales;
                string[] arreglocargo;
                string Autoridades = "";
                string[] arregloAutoridades;
                /*Complemento de la Dirección si sabe la dirección Completa*/

                string calle = "";
                int numext = 0;
                int numint = 0;
                string cp = "";
                string colonia = "";

                if (senencia == "si")
                {
                    peticionarios = int.Parse(form["ID_Peticionario"].ToString());
                    Fecha_hechos = form["Input_FechaHechos"].ToString() + form["Input_HoraHechos"].ToString();
                    Lugar_hechosMun = int.Parse(form["lugarselect"].ToString());
                    Circunstancia_hechos = form["CircunstanciasHechos"].ToString();
                    nombres_Finales = form["Input_nombres"].ToString();
                    arreglonombres_Finales = nombres_Finales.Split(',');
                    cargo = form["Input_cargo"].ToString();
                    arreglocargo = cargo.Split(',');
                    Autoridades = form["Input_autoridades"].ToString();
                    arregloAutoridades = Autoridades.Split(',');
                    /*Complemento de la Dirección si sabe la dirección Completa*/

                    calle = form["calleLH"].ToString();
                    numext = int.Parse(form["numextLH"].ToString());
                    numint = int.Parse(form["numintLH"].ToString());
                    cp = form["cpLH"].ToString();
                    colonia = form["coloniaLH"].ToString();
                }
                else
                {
                    peticionarios = int.Parse(form["ID_Peticionario"].ToString());
                    Fecha_hechos = form["Input_FechaHechos"].ToString() + form["Input_HoraHechos"].ToString();
                    Lugar_hechosMun = int.Parse(form["lugarselect"].ToString());
                    Circunstancia_hechos = form["CircunstanciasHechos"].ToString();
                    nombres_Finales = form["Input_nombres"].ToString();
                    arreglonombres_Finales = nombres_Finales.Split(',');
                    cargo = form["Input_cargo"].ToString();
                    arreglocargo = cargo.Split(',');
                    Autoridades = form["Input_autoridades"].ToString();
                    arregloAutoridades = Autoridades.Split(',');

                }
                query = "[dbo].[insertEscritoInicial_OK]";

                SqlCommand cmd = new SqlCommand(conexionsql.ConnectionStrng());
                cmd.CommandText = query;
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idescritoi;
                cmd.Parameters.Add("@peticionarios", System.Data.SqlDbType.Int).Value = peticionarios;
                cmd.Parameters.Add("@comp_peticionario", System.Data.SqlDbType.Int).Value = compet;
                cmd.Parameters.Add("@fecha_hechos", System.Data.SqlDbType.DateTime).Value = Fecha_hechos;
                cmd.Parameters.Add("@lugar_hechos_mun", System.Data.SqlDbType.Int).Value = Lugar_hechosMun;
                cmd.Parameters.Add("@circunstancia_hechos", System.Data.SqlDbType.Text).Value = Circunstancia_hechos;
                cmd.Parameters.Add("@ruta_documento", System.Data.SqlDbType.Text).Value = "RUTA_ARCHIVO";
                cmd.Parameters.Add("@nombres_finales", System.Data.SqlDbType.VarChar).Value = nombres_Finales;
                cmd.Parameters.Add("@calle", System.Data.SqlDbType.VarChar).Value = calle;
                cmd.Parameters.Add("@numext", System.Data.SqlDbType.VarChar).Value = numext;
                cmd.Parameters.Add("@numint", System.Data.SqlDbType.VarChar).Value = numint;
                cmd.Parameters.Add("@cp", System.Data.SqlDbType.VarChar).Value = cp;
                cmd.Parameters.Add("@colonia", System.Data.SqlDbType.VarChar).Value = colonia;
                cmd.Parameters.Add("@idqueja", System.Data.SqlDbType.Int).Value = idQueja;
                cmd.Parameters.Add("@id_escrito", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@id_ultimo_insertadoLE", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();

                id_queja = Convert.ToInt32(cmd.Parameters["@id_escrito"].Value);
                //id_ultimoLE = Convert.ToInt32(cmd.Parameters["@id_ultimo_insertadoLE"].Value);
                mensajet = "ok";

                for (int i = 0; i < arreglonombres_Finales.Length; i++)
                {
                    if (arreglonombres_Finales[i].ToString() != "")
                    {
                        query = "exec SP_insertEnlaceAutoridadEscrito " + idescritoi + " ,'" + arregloAutoridades[i] + "' ,'" + arreglonombres_Finales[i] + "' ,'" + arreglocargo[i] + "'";
                        bool sino = conexionsql.InsertUpdateDelete(query);

                        if (sino)
                        {
                            mensajet = "ok";
                        }
                        else
                        {
                            mensajet = "Error al Insertar";
                        }
                    }
                    else { }
                }
            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }

            return Json(new { mensaje = mensajet });

        }

        public bool existeturnopreliminar(int id_queja)
        {
            bool existecomplementoqueja = false;
            string query = "exec Sp_Verificar_primerTurnoPreliminarQueja " + id_queja;

            int estado = int.Parse(conexionsql.ObtenerReader(query));

            if (estado > 0)
            {
                existecomplementoqueja = true;
            }


            return existecomplementoqueja;
        }

        public List<bitacoraTurnoPrel> ObtenerlistTurnoPrel(DataTable data)
        {
            List<bitacoraTurnoPrel> lEscritoI = new List<bitacoraTurnoPrel>();
            string query_archivosadj = "";
            foreach (DataRow row in data.Rows)
            {
                bitacoraTurnoPrel escritoitem = new bitacoraTurnoPrel();
                escritoitem.status = Convert.ToInt32(row["status"].ToString());
                escritoitem.fechaTurno = (row["fechaTurno"]).ToString();
                escritoitem.ClaveVis = int.Parse((row["clavevis"]).ToString());
                escritoitem.no_memo = row["nomemo"].ToString();
                escritoitem.fechaUltModificación = row["fechaultmod"].ToString();

                lEscritoI.Add(escritoitem);
            }

            return lEscritoI;

        }

        public ArrayList getTurnoPrelQuejaBitacora(int idqueja)
        {
            List<bitacoraTurnoPrel> complementoqueja = new List<bitacoraTurnoPrel>();
            ArrayList listadoGeneral = new ArrayList();

            string query = "SP_regresainformacionTurnoPrelQueja " + idqueja;
            string mensaje = "ok";
            var data = GetDatosGeneral(query);

            complementoqueja = ObtenerlistTurnoPrel(data);

            foreach (bitacoraTurnoPrel item in complementoqueja)
            {
                listadoGeneral.Add(item.status);
                listadoGeneral.Add(item.fechaTurno);
                listadoGeneral.Add(item.ClaveVis);
                listadoGeneral.Add(item.no_memo);
                listadoGeneral.Add(item.fechaUltModificación);
            }

            return listadoGeneral;
        }


        public async Task<ActionResult> TurnoPreliminar(IFormCollection form)
        {
            string queryupdatestatusext = "";
            string queryupdatetblturno = "";
            string queryinsert_memo = "";
            int status_exp = 6;
            string mensajet = "no";

            //var num_memorandum = form["num_memosendexp"].ToList();
            string fk_area_origen = form["area_origen"].ToString();
            string fk_usuario = form["usuario_registra"].ToString();

            List<Memorandum> lstNumMemos = JsonConvert.DeserializeObject<List<Memorandum>>(form["num_memosendexp"].ToString());
            List<ExpedienteTurnoModificado> lstExpedientesTurnados = JsonConvert.DeserializeObject<List<ExpedienteTurnoModificado>>(form["dataexpturno"].ToString());
            bool resp = false;

            if (lstExpedientesTurnados.Count > 0)
            {
                foreach (Memorandum nm in lstNumMemos)
                {
                    string asunto = "Remisión de escritos iniciales de quejas a la " + lstExpedientesTurnados[0].Txtvisitaduria + " Visitaduría";
                    queryinsert_memo = "exec Sp_Insert_Memorandum '" + nm.num_memo + "','" + fk_area_origen + "','" + nm.visitaduria + "','" + asunto + "','" + fk_usuario + "', '" + nm.destinatario + "'";
                    int n_memo = conexionsql.InsertUpdateDeleteRegresaid(queryinsert_memo);

                    if (n_memo > 0)
                    {
                        ArrayList arreglovalores = new ArrayList();
                        foreach (ExpedienteTurnoModificado expedT in lstExpedientesTurnados.Where(x=> x.Clavevisitaduria==nm.visitaduria))
                        {
                            string visitaduria = "";
                            switch (expedT.Clavevisitaduria)
                            {
                                case 1: visitaduria = "Prímera Visitaduría General";
                                    break;
                                case 2: visitaduria = "Segunda Visitaduría General";
                                    break;
                                case 3: visitaduria = "Tercera Visitaduría General";
                                    break;
                                case 4: visitaduria = "Cuarta Visitaduría General";
                                    break;
                                default: visitaduria = "No tiene";
                                    break;
                            }

                            arreglovalores.Add("Turno Preliminar");
                            arreglovalores.Add(expedT.Fechaturnovisitaduriatxt);
                            arreglovalores.Add(visitaduria);
                            arreglovalores.Add(n_memo);
                            arreglovalores.Add(expedT.FechastrFinDqot);


                            if (existeturnopreliminar(int.Parse(expedT.IdExpediente)))
                            {
                                ArrayList listavalores = new ArrayList();
                                listavalores = getTurnoPrelQuejaBitacora(int.Parse(expedT.IdExpediente));
                                ArmaBitacoraModificaturnoPreliminar(arreglovalores, listavalores, expedT.IdExpediente);
                            }
                            else
                            {
                                ArmaBItacoraTurnoPreliminar(arreglovalores, expedT.IdExpediente);
                            }




                            queryupdatestatusext = "exec Sp_Update_Status_Expediente '" + expedT.IdExpediente + "','" + status_exp + "'";
                            int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);

                            if (sino > 0)
                            {
                                queryupdatetblturno = "exec Sp_Update_Expediente_Turno '" + expedT.IdExpediente + "','" + expedT.Fechaturnovisitaduriatxt + "', '" + expedT.Clavevisitaduria + "', '" + n_memo + "', '" + expedT.FechastrFinDqot + "'";
                                int sinot = conexionsql.InsertUpdateDeleteRegresaid(queryupdatetblturno);
                                if (sinot > 0)
                                {
                                    resp = true;
                                    mensajet = "ok";
                                }
                            }




                           
                        }
                    }
                }
            }
            return Json(new { mensaje = mensajet, data = resp });
        }


        public string ArmaBitacoraModificaturnoPreliminar(ArrayList arregloValoresActuales, ArrayList arregloValoresanteriores, string id_queja)
        {
            string mensaje = "";
            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "Modificación";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();

            ArrayList nombre_Campos = new ArrayList
     {
         "Status",
         "Fecha Turno Vis.",
         "Clave vis",
         "No_Memo",
         "Fecha ult Modif. DQO"
     };

            int id_quejaR = string.IsNullOrEmpty(id_queja)
                ? int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"))
                : Convert.ToInt32(id_queja);

            // Usamos el mínimo de elementos entre actuales, anteriores y nombres
            int limite = Math.Min(arregloValoresActuales.Count, Math.Min(arregloValoresanteriores.Count, nombre_Campos.Count));

            for (int i = 0; i < limite; i++)
            {
                string valorActual = arregloValoresActuales[i]?.ToString() ?? "(sin valor)";
                string valorAnterior = arregloValoresanteriores[i]?.ToString() ?? "(-)";

                if (valorAnterior != valorActual)
                {
                    ContBitacora(txtcontBuilder,
                                 "Turno Preliminar",
                                 tipoMod,
                                 nombre_Campos[i].ToString(),
                                 valorAnterior,
                                 valorActual,
                                 Ipaccesible);
                }
            }

            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());
            return mensaje;
        }

 public string ArmaBItacoraTurnoPreliminar(ArrayList arregloValores, string id_queja)
 {
     string mensaje = "";
     StringBuilder txtcontBuilder = new StringBuilder();
     string tipoMod = "Alta";
    string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();

     ArrayList nombre_Campos = new ArrayList
     {
         "Estatus Expediente",
         "Fecha de Turno Vis.",
         "Visitaduría",
         "Numero de Memo",
         "Fecha de ult Modif. DQO"
     };

     int id_quejaR = string.IsNullOrEmpty(id_queja)
         ? int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"))
         : Convert.ToInt32(id_queja);

     int limite = Math.Min(arregloValores.Count, nombre_Campos.Count);
     for (int i = 0; i < limite; i++)
     {
         string valorActual = arregloValores[i]?.ToString() ?? "-";
         if (valorActual != "-")
         {
             ContBitacora(txtcontBuilder,
                          "Turno Preliminar",
                          tipoMod,
                          nombre_Campos[i].ToString(),
                          "(sin valor previo)",
                          valorActual,
                          Ipaccesible);
         }
     }

     CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());
     return mensaje;
 }

        public class Memorandum
        {
            public int visitaduria { get; set; }
            public string num_memo { get; set; }
            public int destinatario { get; set; }
            public Memorandum() { }
            public Memorandum(int visitaduria, string num_memo, int destinatario)
            {
                this.visitaduria = visitaduria;
                this.num_memo = num_memo;
                this.destinatario = destinatario;
            }
        }

        public async Task<ActionResult> ActualizaMemorandumDqot(IFormCollection form)
        {

            string queryinsert_memo = "";
            string mensajet = "no";

            string num_memorandum = form["num_memosendexp"].ToString();
            string fk_area_origen = form["area_origen"].ToString();
            string fk_usuario = form["usuario_registra"].ToString();

            List<ExpedienteTurnoModificado> lstComplementoMemo = JsonConvert.DeserializeObject<List<ExpedienteTurnoModificado>>(form["dataexpcomp"].ToString());
            bool resp = false;

            if (lstComplementoMemo.Count > 0)
            {
                for (int i = 0; i < lstComplementoMemo.Count; i++)
                {
                    queryinsert_memo = "exec Sp_UpdateMemorandumDqot " + lstComplementoMemo[i].FkMemorandum + " ,'" + lstComplementoMemo[i].IdExpediente + "' ,'" + lstComplementoMemo[i].NumFojas + "' ,'" + lstComplementoMemo[i].Observaciones + "'";
                    bool sino = conexionsql.InsertUpdateDelete(queryinsert_memo);
                }

                mensajet = "ok";
                resp = true;
            }

            return Json(new { mensaje = mensajet, data = resp });

        }


        public ActionResult GeneraEscritoInicial(IFormCollection form)
        {
            int id_ultimoLE = 0;
            string mensajet = "";
            string query = "";
            int idQueja = int.Parse(form["Input_ID"].ToString());
            //string id = form["Input_ID"].ToString();
            string senencia = form["sino"].ToString();
            int idescritoi = form["id_escritoigenerado"].ToString() != "" ? int.Parse(form["id_escritoigenerado"].ToString()) : 0;

            string peticionarios = "";
            string Fecha_hechos = "";
            int Lugar_hechosMun = 0;
            string Circunstancia_hechos = "";
            string nombres_Finales;
            string cargo;
            string[] arreglonombres_Finales;
            string[] arreglocargo;
            string Autoridades = "";
            string[] arregloAutoridades;
            /*Complemento de la Dirección si sabe la dirección Completa*/
            string[] txtPeticionarios;

            string calle = "";
            int numext = 0;
            int numint = 0;
            string cp = "";
            string colonia = "";
           

            if (senencia == "si")
            {
                peticionarios = form["Input_Peticionario"].ToString();
                txtPeticionarios = peticionarios.Split('/');
                Fecha_hechos = form["Input_FechaHechos"].ToString() + ' ' + form["Input_HoraHechos"].ToString();
                Lugar_hechosMun = int.Parse(form["lugarselect"].ToString());
                Circunstancia_hechos = form["CircunstanciasHechos"].ToString();
                nombres_Finales = form["Input_nombres"].ToString();
                arreglonombres_Finales = nombres_Finales.Split(',');
                cargo = form["Input_cargo"].ToString();
                arreglocargo = cargo.Split(',');
                Autoridades = form["autoridadesselect"].ToString();
                arregloAutoridades = Autoridades.Split(',');
                /*Complemento de la Dirección si sabe la dirección Completa*/

                calle = form["calleLH"].ToString();
                numext = int.Parse(form["numextLH"].ToString());
                numint = int.Parse(form["numintLH"].ToString());
                cp = form["cpLH"].ToString();
                colonia = form["coloniaLH"].ToString();
            }
            else
            {
                peticionarios = form["Input_Peticionario"].ToString();
                txtPeticionarios = peticionarios.Split('/');
                Fecha_hechos = form["Input_FechaHechos"].ToString() + ' ' + form["Input_HoraHechos"].ToString();
                Lugar_hechosMun = int.Parse(form["lugarselect"].ToString());
                Circunstancia_hechos = form["CircunstanciasHechos"].ToString();
                nombres_Finales = form["Input_nombres"].ToString();
                arreglonombres_Finales = nombres_Finales.Split(',');
                cargo = form["Input_cargo"].ToString();
                arreglocargo = cargo.Split(',');
                Autoridades = form["autoridadesselect"].ToString();
                arregloAutoridades = Autoridades.Split(',');

            }

            try
            {
                query = "[dbo].[insertEscritoInicial_OK]";

                SqlCommand cmd = new SqlCommand(conexionsql.ConnectionStrng());
                //cmd.Connection = conn;
                cmd.CommandText = query;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idescritoi;
                cmd.Parameters.Add("@peticionarios", System.Data.SqlDbType.Int).Value = txtPeticionarios[0];
                cmd.Parameters.Add("@comp_peticionario", System.Data.SqlDbType.Int).Value = txtPeticionarios[1];
                cmd.Parameters.Add("@fecha_hechos", System.Data.SqlDbType.DateTime).Value = Fecha_hechos;
                cmd.Parameters.Add("@lugar_hechos_mun", System.Data.SqlDbType.Int).Value = Lugar_hechosMun;
                cmd.Parameters.Add("@circunstancia_hechos", System.Data.SqlDbType.Text).Value = Circunstancia_hechos;
                cmd.Parameters.Add("@ruta_documento", System.Data.SqlDbType.Text).Value = "RUTA_ARCHIVO";
                cmd.Parameters.Add("@nombres_finales", System.Data.SqlDbType.VarChar).Value = nombres_Finales;
                cmd.Parameters.Add("@calle", System.Data.SqlDbType.VarChar).Value = calle;
                cmd.Parameters.Add("@numext", System.Data.SqlDbType.VarChar).Value = numext;
                cmd.Parameters.Add("@numint", System.Data.SqlDbType.VarChar).Value = numint;
                cmd.Parameters.Add("@cp", System.Data.SqlDbType.VarChar).Value = cp;
                cmd.Parameters.Add("@colonia", System.Data.SqlDbType.VarChar).Value = colonia;
                cmd.Parameters.Add("@idqueja", System.Data.SqlDbType.Int).Value = idQueja;
                cmd.Parameters.Add("@id_escrito", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@id_ultimo_insertadoLE ", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Connection.Open();
                cmd.ExecuteNonQuery();

                id_queja = Convert.ToInt32(cmd.Parameters["@id_escrito"].Value);
                //id_ultimoLE = Convert.ToInt32(cmd.Parameters["@id_ultimo_insertadoLE"].Value);
                mensajet = "ok";

                for (int i = 0; i < arregloAutoridades.Length; i++)
                {
                    if (arregloAutoridades[i].ToString() != "")
                    {
                        query = "exec SP_insertEnlaceAutoridadEscrito " + id_queja + " ,'" + arregloAutoridades[i] + "' ,'" + arreglonombres_Finales[i] + "' ,'" + arreglocargo[i] + "'";
                        bool sino = conexionsql.InsertUpdateDelete(query);

                        if (sino)
                        {
                            mensajet = "ok";
                        }
                        else
                        {
                            mensajet = "Error al Insertar";
                        }
                    }
                    else { }
                }
            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }

            query = "exec Sp_Regresa_Escrito_Inicial_Queja " + id_queja;
            string mensaje = "ok";
            escrito = conexionsql.regresaEscritoInicial(1, query, ref mensaje);
            mensaje = "ok";



            return Json(new { mensaje = mensaje, listat = escrito });

        }



        public bool ArmaBitacoraModificaEscritoInicial(
             ArrayList arregloValoresActuales,
             ArrayList arregloValoresanteriores,
             string id_queja,
             bool entroDirecCompleta,
             bool tieneAarchivo,
             bool tieneautoridades)
        {
            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "Modificación";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();

            ArrayList nombre_Campos = new ArrayList
    {
                "id del escritoinicial",
                "fecha de Hechos",
                "hora de Hechos",
                "lugar_hechos",
                "Sabe dirección completa",
                "Calle",
                "Num. Ext",
                "Num. Int",
                "CP",
                "Colonia",
                "Circunstancias Hechos",
                "Archivo Cargado"
    };

            int id_quejaR = 0;
            int indexAutoridades = 12; // Índice donde empiezan las autoridades

            // Determinar el máximo de elementos a procesar
            int maxCount = Math.Max(arregloValoresActuales.Count, arregloValoresanteriores.Count);

            for (int i = 0; i < maxCount; i++)
            {
                // Obtener valores con validación de índice
                var anterior = i < arregloValoresanteriores.Count
                    ? (arregloValoresanteriores[i] ?? "").ToString().Trim()
                    : "";
                var actual = i < arregloValoresActuales.Count
                    ? (arregloValoresActuales[i] ?? "").ToString().Trim()
                    : "";

                string nombreCampo;

                if (i < indexAutoridades)
                {
                    // Campos fijos
                    nombreCampo = nombre_Campos[i].ToString();
                }
                else
                {
                    // Campos de autoridades (dinámicos)
                    int indexRelativo = i - indexAutoridades;
                    int numeroAutoridad = (indexRelativo / 3) + 1;
                    int tipoCampo = indexRelativo % 3;

                    switch (tipoCampo)
                    {
                        case 0:
                            nombreCampo = $"Nombre Autoridad {numeroAutoridad}";
                            break;
                        case 1:
                            nombreCampo = $"Cargo Autoridad {numeroAutoridad}";
                            break;
                        case 2:
                            nombreCampo = $"Id de autoridad {numeroAutoridad}";
                            break;
                        default:
                            nombreCampo = "Campo desconocido";
                            break;
                    }
                }

                // Solo registrar si hay cambio
                if (anterior != actual)
                {
                    ContBitacora(txtcontBuilder, "Escrito Inicial de queja",
                        tipoMod, nombreCampo, anterior, actual, Ipaccesible);
                }
            }

            // Crear bitácora
            id_quejaR = string.IsNullOrEmpty(id_queja)
                ? int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"))
                : Convert.ToInt32(id_queja);

            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());
            return txtcontBuilder.Length == 0; // true si no hubo datos
        }
        public bool ArmaBitacoraAltaEscritoInicial(
                    ArrayList arregloValores,
                    string id_queja,
                    bool entroDirecCompleta,
                    bool tieneAarchivo,
                    bool tieneautoridades)
        {
            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "Alta";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();

            ArrayList nombre_Campos = new ArrayList
    {
                "id del escritoinicial",
                "fecha de Hechos",
                "Hora de Hechos",
                "lugar de los hechos",
                "Sabe dirección completa",
                "Calle",
                "Num. Ext",
                "Num. Int",
                "CP",
                "Colonia",
                "Circunstancias Hechos",
                "Archivo Cargado"
    };

            int id_quejaR = 0;
            int indexAutoridades = 12; // Índice donde empiezan las autoridades

            for (int i = 0; i < arregloValores.Count; i++)
            {
                string valor = (arregloValores[i] ?? "").ToString().Trim();
                string nombreCampo;

                if (i < indexAutoridades)
                {
                    // Campos fijos
                    nombreCampo = nombre_Campos[i].ToString();
                }
                else
                {
                    // Campos de autoridades (dinámicos)
                    int indexRelativo = i - indexAutoridades;
                    int numeroAutoridad = (indexRelativo / 3) + 1;
                    int tipoCampo = indexRelativo % 3;

                    switch (tipoCampo)
                    {
                        case 0:
                            nombreCampo = $"Nombre Autoridad {numeroAutoridad}";
                            break;
                        case 1:
                            nombreCampo = $"Cargo Autoridad {numeroAutoridad}";
                            break;
                        case 2:
                            nombreCampo = $"Id de autoridad {numeroAutoridad}";
                            break;
                        default:
                            nombreCampo = "Campo desconocido";
                            break;
                    }
                }

                if (!string.IsNullOrEmpty(valor) && valor != "-" && valor != "--")
                {
                    ContBitacora(txtcontBuilder, "Escrito Inicial de queja",
                        tipoMod, nombreCampo, "-", valor, Ipaccesible);
                }
            }

            id_quejaR = string.IsNullOrEmpty(id_queja)
                ? int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"))
                : Convert.ToInt32(id_queja);

            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());
            return txtcontBuilder.Length == 0;
        }

        public async Task<ActionResult> GeneraEscritoInicialnuevo(IFormCollection form)
        {

            ArrayList arregloValores = new ArrayList();
            string mensajet = "";
            string mensaje = "";
            string query = "";
            string queryf = "";
            string[] txtPeticionarios;
            long uploaded_size = 0;
            string path_for_Uploaded_Files = _hostingEnvironment.WebRootPath + "\\Uploads\\escrito_inicialdequeja\\";
            List<EnlaceEscritoAutoridad> lstAutoridades = JsonConvert.DeserializeObject<List<EnlaceEscritoAutoridad>>(form["autoridades"].ToString());
            List<EnlaceArchivoadjuntoEscritoi> lstUploadsinsert = JsonConvert.DeserializeObject<List<EnlaceArchivoadjuntoEscritoi>>(form["arrOploadsinsert"].ToString());
            int idQueja = int.Parse(form["Input_ID"].ToString());
            int idenlace = form["idenlaceformatquejaei"].ToString() != "" ? int.Parse(form["idenlaceformatquejaei"].ToString()) : 0;
            int idescritoinicial = form["id_escritoigenerado"].ToString() != "" ? int.Parse(form["id_escritoigenerado"].ToString()) : 0;
            string peticionarios = form["Input_Peticionario"].ToString();
            txtPeticionarios = peticionarios.Split('/');
            string Fecha_hechos = form["Input_FechaHechos"].ToString() + ' ' + form["Input_HoraHechos"].ToString();
            int lugarHechos = int.Parse(form["Input_LugarHechos"].ToString());
            bool direccionCompleta = bool.Parse(form["CheckDcompleta"].ToString());
            string calleLH = "";
            string coloniaLH = "";
            string numextLH = "";
            string numintLH = "";
            string cpLH = "";
            string CircunstanciasHechos = form["CircunstanciasHechos"].ToString() != "" ? form["CircunstanciasHechos"].ToString() : "";
            string tipofrm = form["tipoform"].ToString();
            string sabeDireccionCompleta = "NO";

            // Subir archivo adjunto escrito inicial
            var uploaded_files = Request.Form.Files;
            int iCounter = 0;
            int iCounteredit = int.Parse(form["conteditfiles"].ToString());
            string sFiles_uploaded = "";
            List<string> list_Files = new List<string>();

            bool direccionCompletac = false, hayarchivo = false, hayautoridades = false;

            arregloValores.Add(idQueja);
            //arregloValores.Add(txtPeticionarios[0]);
            //arregloValores.Add(txtPeticionarios[1]);
            arregloValores.Add(form["Input_FechaHechos"].ToString());
            arregloValores.Add(form["Input_HoraHechos"].ToString());
            arregloValores.Add(form["Input_LugarHechosDescripcion"].ToString());
            // --------------------------------------------------- Registrar escrito inicial 

            try
            {
                if (direccionCompleta)
                {
                    sabeDireccionCompleta = "SI";
                    direccionCompletac = true;
                    calleLH = form["calleLH"].ToString();
                    numextLH = form["numextLH"].ToString();
                    if (form["numintLH"].ToString() != "") numintLH = form["numintLH"].ToString();
                    cpLH = form["cpLH"].ToString();
                    coloniaLH = form["coloniaLH"].ToString();

                    //Adicion de elementos dentro del arreglo del escrito
                    arregloValores.Add(sabeDireccionCompleta);
                    arregloValores.Add(calleLH);
                    arregloValores.Add(numextLH);
                    arregloValores.Add(numintLH);
                    arregloValores.Add(cpLH);
                    arregloValores.Add(coloniaLH);

                }
                else
                {
                    arregloValores.Add(sabeDireccionCompleta);
                    arregloValores.Add("-");
                    arregloValores.Add("-");
                    arregloValores.Add("-");
                    arregloValores.Add("-");
                    arregloValores.Add("-");
                }

                arregloValores.Add(CircunstanciasHechos);


                query = "Sp_Verificar_primeractaQueja " + idQueja;
                /*Recoge Información anterior*/
                List<EscritoUpdate> lista_anterior = getEscritoBitacora(idescritoinicial);
                /*Recoge Información anterior*/
                int couentaRegistros = int.Parse(conexionsql.ObtenerReader(query));

                query = "[dbo].[insertEscritoInicial_OK]";
                string msg = "";
                SqlCommand cmd = new SqlCommand(query, conexionsql.conexion(ref mensajet));
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idescritoinicial;
                cmd.Parameters.Add("@peticionarios", System.Data.SqlDbType.Int).Value = txtPeticionarios[0];
                cmd.Parameters.Add("@comp_peticionario", System.Data.SqlDbType.Int).Value = txtPeticionarios[1];
                cmd.Parameters.Add("@fecha_hechos", System.Data.SqlDbType.DateTime).Value = Fecha_hechos;
                cmd.Parameters.Add("@lugar_hechos_mun", System.Data.SqlDbType.Int).Value = lugarHechos;
                cmd.Parameters.Add("@circunstancia_hechos", System.Data.SqlDbType.Text).Value = CircunstanciasHechos;
                cmd.Parameters.Add("@ruta_documento", System.Data.SqlDbType.Text).Value = "no";
                //cmd.Parameters.Add("@nombres_finales", System.Data.SqlDbType.VarChar).Value = nombres_Finales;
                cmd.Parameters.Add("@calle", System.Data.SqlDbType.VarChar).Value = calleLH;
                cmd.Parameters.Add("@numext", System.Data.SqlDbType.VarChar).Value = numextLH;
                cmd.Parameters.Add("@numint", System.Data.SqlDbType.VarChar).Value = numintLH;
                cmd.Parameters.Add("@cp", System.Data.SqlDbType.VarChar).Value = cpLH;
                cmd.Parameters.Add("@colonia", System.Data.SqlDbType.VarChar).Value = coloniaLH;
                cmd.Parameters.Add("@idqueja", System.Data.SqlDbType.Int).Value = idQueja;

                cmd.Parameters.Add("@id_escrito", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@id_ultimo_insertadoLE ", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                if (cmd.Parameters["@id_escrito"].Value != DBNull.Value)
                {
                    idescritoinicial = Convert.ToInt32(cmd.Parameters["@id_escrito"].Value);
                }




                // --------------------------------------------------- Fin Registrar escrito inical

                //ArmaBitacoraAltaEscritoInicial(arregloValores, idQueja.ToString());
                // --------------------------------------------------- Subir archivo adjunto escrito inicial

                if (uploaded_files.Count > 0)
                {
                    hayarchivo = true;
                    string queryenlaceescritoiuploads = "";

                    if (tipofrm == "index")
                    {
                        string updateArchivosadj = "UPDATE ENLACE_ARCHIVOADJUNTO_ESCRITOI SET FK_STATUS = 3 WHERE ID_ESCRITOINICIAL = '" + idescritoinicial + "'";
                        bool respbol = conexionsql.InsertUpdateDelete(updateArchivosadj);
                    }
                    //else
                    //{
                    //    if (lstUploadsinsert != null)
                    //    {
                    //        string noupdateinsertados = "";

                    //        for (int i = 0; i < lstUploadsinsert.Count; i++)
                    //        {
                    //            noupdateinsertados = "UPDATE ENLACE_ARCHIVOADJUNTO_ESCRITOI SET FK_STATUS = 3 WHERE PK_ENLACE_ADJESCRITOI != '" + lstUploadsinsert[i].PkEnlaceAdjescritoi + "'";
                    //            bool sino = conexionsql.InsertUpdateDelete(noupdateinsertados);
                    //        }
                    //    }
                    //}


                    foreach (var uploaded_file in uploaded_files)
                    {

                        //----< Cargar archivo >----

                        iCounter++;
                        iCounteredit++;
                        uploaded_size += uploaded_file.Length;
                        string type_archivo = System.IO.Path.GetExtension(uploaded_file.FileName);
                        sFiles_uploaded += "\n" + uploaded_file.FileName;
                        list_Files.Add(uploaded_file.FileName);

                        //< Renombrar nombre del archivo nomenclatura escritoi > 
                        string uploaded_Filename = uploaded_file.FileName;
                        string new_Filename_on_Server = path_for_Uploaded_Files + "\\" + uploaded_Filename;
                        //</ FIN  Renombrar nombre del archivo nomenclatura escritoi  >

                        // Copiar a carpeta
                        using (FileStream stream = new FileStream(new_Filename_on_Server, FileMode.Create))
                        {
                            await uploaded_file.CopyToAsync(stream);
                        }
                        arregloValores.Add(uploaded_Filename);
                        // Registrar ruta a la base de datos
                        queryenlaceescritoiuploads = "exec Sp_Insert_Enlace_Archivosaj_Escritoi " + idescritoinicial + " ,'" + uploaded_Filename + "' ,'" + type_archivo + "'";
                        bool sinoc = conexionsql.InsertUpdateDelete(queryenlaceescritoiuploads);

                    }

                }
                else
                {
                    arregloValores.Add("-");
                }


                // --------------------------------------------------- Si hay autoridades se registran
                string queryenlaceautoridad = "";
                string queryeliminaautoridad = "";
                if (lstAutoridades.Count > 0)
                {
                    hayautoridades = true;
                    queryeliminaautoridad = "UPDATE ENLACE_ESCRITO_AUTORIDAD SET Fk_Status = 3 WHERE Id_queja = " + idQueja;
                    bool eliminado = conexionsql.InsertUpdateDelete(queryeliminaautoridad);

                    for (int i = 0; i < lstAutoridades.Count; i++)
                    {
                        queryenlaceautoridad = "exec SP_insertEnlaceAutoridadEscrito " + idescritoinicial + " ,'" + lstAutoridades[i].IdAutoridad + "' ,'" + lstAutoridades[i].NombrePersona + "' ,'" + lstAutoridades[i].CargoPersona + "', '" + idQueja + "'";
                        bool sino = conexionsql.InsertUpdateDelete(queryenlaceautoridad);

                        arregloValores.Add(lstAutoridades[i].NombrePersona.ToString());
                        arregloValores.Add(lstAutoridades[i].CargoPersona.ToString());
                        arregloValores.Add(lstAutoridades[i].IdAutoridad.ToString());


                    }

                }
                else
                {
                    arregloValores.Add('-');
                    arregloValores.Add('-');
                    arregloValores.Add('-');
                }
                if (couentaRegistros != 0)
                {

                    ArrayList arregloanterior = new ArrayList();

                    foreach (EscritoUpdate objeto in lista_anterior)
                    {
                        string fecha = objeto.FechaHechos.Split(" ")[0].ToString();
                        string hora = objeto.FechaHechos.Split(" ")[1].ToString();
                        arregloanterior.Add(idQueja.ToString());
                        arregloanterior.Add(fecha);
                        arregloanterior.Add(hora);
                        arregloanterior.Add(objeto.cvemun);

                        if (objeto.calle != "")
                        {

                            arregloanterior.Add("SI");
                            arregloanterior.Add(objeto.calle);
                            arregloanterior.Add(objeto.numero_ext);
                            arregloanterior.Add(objeto.numero_int);
                            arregloanterior.Add(objeto.CP);
                            arregloanterior.Add(objeto.colonia);
                        }
                        else
                        {
                            arregloanterior.Add("NO");
                            arregloanterior.Add("-");
                            arregloanterior.Add("-");
                            arregloanterior.Add("-");
                            arregloanterior.Add("-");
                            arregloanterior.Add("-");
                        }

                        arregloanterior.Add(objeto.circuns_Hechos);
                        if (objeto.Rutaarchivo.Count != 0) arregloanterior.Add(objeto.Rutaarchivo[0].RutaArchivo); else arregloanterior.Add('-');

                        /*Apartado Autoridad*/

                        arregloanterior.Add("-");
                        arregloanterior.Add("-");
                        arregloanterior.Add("-");
                        /*Apartado Autoridad*/


                        ArmaBitacoraModificaEscritoInicial(arregloValores, arregloanterior, idQueja.ToString(), direccionCompletac, hayarchivo, hayautoridades);
                        queryf = "exec Sp_Regresa_Escrito_Inicial_Queja " + idescritoinicial;
                        mensaje = "ok";
                        escrito = conexionsql.regresaEscritoInicial(1, queryf, ref mensaje);
                        mensaje = "ok";
                    }
                }
                else
                {

                    ArmaBitacoraAltaEscritoInicial(arregloValores, idQueja.ToString(), direccionCompletac, hayarchivo, hayautoridades);

                    queryf = "exec Sp_Regresa_Escrito_Inicial_Queja " + idescritoinicial;
                    mensaje = "ok";
                    escrito = conexionsql.regresaEscritoInicial(1, queryf, ref mensaje);
                    mensaje = "ok";


                }
            }
            catch (Exception e)
            {

                mensaje = e.Message;
            }
            return Json(new { mensaje = mensaje, listat = escrito });


        }

        public ActionResult GeneraActaCircunstanciada(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
            // int UltimoID_Recuperado = 0;
            int idactac = form["id_actacgenerado"].ToString() != "" ? int.Parse(form["id_actacgenerado"].ToString()) : 0;
            string[] hora_completa = form["horaInicio"].ToString().Split(":");
            string[] horaHechosC = form["horaHechos"].ToString().Split(":");
            string[] horaTerminoc = form["horaTermino"].ToString().Split(":");

            int lugar = int.Parse(form["id_lugar"].ToString());
            int diaFecha = int.Parse(form["diaFecha"].ToString());
            int mes = int.Parse(form["id_mes"].ToString());
            int anio = int.Parse(form["id_anio"].ToString());
            int idAbogado = int.Parse(form["idabogado"].ToString());
            string nomAbogado = form["nomAbogado"].ToString();
            string puestoAbogado = form["puestoAbogado"].ToString();
            string areaAbogado = form["areaAbogado"].ToString();
            TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa[0]), int.Parse(hora_completa[1]));
            string fechaInicioCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaInicio.ToString();
            string ubicacion = form["ubicacion"].ToString();
            int idPet = int.Parse(form["idpeticionarioelegido"].ToString());
            string nombrePet = form["nombrePet"].ToString();
            string origenPet = form["origenPetval"].ToString();
            int consentimiento = int.Parse(form["idconsentimiento"].ToString());
            int identificacionPet = int.Parse(form["idcredencial"].ToString());
            //int edadPet = int.Parse(form["edadPet"].ToString());
            int nformulario = int.Parse(form["numeroformulario"]);
            int edadPet = 0;

            var edadStr = form["edadPet" + nformulario].ToString();

            if (!string.IsNullOrEmpty(edadStr) && edadStr != "No proporcionado")
            {
                int.TryParse(edadStr, out edadPet);
            }

            //AGREGE ESTOS CAMPOS QUE FALTABAN
            string sabePet = form["sabeleerPet"].ToString();
            string escolaridad = form["escolaridad"].ToString();
            //--------------------------------

            string callePet = form["callePet"].ToString();
            string numextPet = form["numextPet"].ToString();
            string cpPet = form["cpPet"].ToString();
            string coloniaPet = form["coloniaPet"].ToString();
            string municipioPet = form["municipioPet"].ToString();

            //AGREGE ESTE CAMPO
            string estadoPet = form["estadoPet"].ToString();
            //-----------------------------------------

            string ocupacionPet = form["ocupacionPet"].ToString();
            string telPet = form["telPet"].ToString();
            string correoPet = form["correoPet"].ToString();
            int idEscrito = int.Parse(form["idEscrito_"].ToString());
            TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC[0]), int.Parse(horaHechosC[1]));
            string fechaHechos = form["fechaHechos"].ToString() + ' ' + horaHechos;
            string ubiHechos = form["ubiHechos"].ToString();
            string hechos = form["hechos"].ToString();
            TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc[0]), int.Parse(horaTerminoc[1]));
            string fechaTerminoCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaTermino.ToString();
            int origenPetExt = 0;
            string ComplementoPetExt = "";


            if (origenPet == "218")
            {
                origenPetExt = int.Parse(form["origenPetvalExt"].ToString());
                ComplementoPetExt = form["origenPetExtedo"].ToString();
            }

            try
            {
                query = "[dbo].[InsertActac]";

                SqlCommand cmd = new SqlCommand(conexionsql.ConnectionStrng());
                cmd.CommandText = query;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idactac;
                cmd.Parameters.Add("@lugar", System.Data.SqlDbType.Int).Value = lugar;
                cmd.Parameters.Add("@diaFecha", System.Data.SqlDbType.Int).Value = diaFecha;
                cmd.Parameters.Add("@mes", System.Data.SqlDbType.Int).Value = mes;
                cmd.Parameters.Add("@anio", System.Data.SqlDbType.Int).Value = anio;
                cmd.Parameters.Add("@idAbogado", System.Data.SqlDbType.Int).Value = idAbogado;
                cmd.Parameters.Add("@horaInicio", System.Data.SqlDbType.DateTime).Value = fechaInicioCompleta;
                cmd.Parameters.Add("@ubicacion", System.Data.SqlDbType.VarChar).Value = ubicacion;
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idPet;
                cmd.Parameters.Add("@concentimiento", System.Data.SqlDbType.Int).Value = consentimiento;
                cmd.Parameters.Add("@origenPet", System.Data.SqlDbType.VarChar).Value = origenPet;
                cmd.Parameters.Add("@identificacionPet", System.Data.SqlDbType.Int).Value = identificacionPet;
                cmd.Parameters.Add("@idEscrito", System.Data.SqlDbType.Int).Value = idEscrito;
                cmd.Parameters.Add("@horaHechos", System.Data.SqlDbType.VarChar).Value = fechaHechos;
                cmd.Parameters.Add("@hechos", System.Data.SqlDbType.Text).Value = hechos;
                cmd.Parameters.Add("@ubiHechos", System.Data.SqlDbType.VarChar).Value = ubiHechos;
                cmd.Parameters.Add("@horaTermino", System.Data.SqlDbType.DateTime).Value = fechaTerminoCompleta;
                cmd.Parameters.Add("@origenPetExt", System.Data.SqlDbType.Int).Value = origenPetExt;
                cmd.Parameters.Add("@OrigenPetExtComp", System.Data.SqlDbType.VarChar).Value = ComplementoPetExt;
                cmd.Parameters.Add("@ultimo_id_insertado", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Connection.Open();

                cmd.ExecuteNonQuery();

                UltimoID_Recuperado = Convert.ToInt32(cmd.Parameters["@ultimo_id_insertado"].Value);

                mensajet = "ok";


                actaC = new ActacModificado();

                query = "exec Sp_Regresa_Acta_Circunstanciada " + UltimoID_Recuperado;
                string mensaje = "";
                actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
                mensajet = "ok";

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }
            return Json(new { mensaje = mensajet, listat = actaC });


        }

        //ALTA ID ACTA
        public ActionResult GeneraActaCircunstanciadaNuevo(IFormCollection form)
        {
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();
            String query = "";
            string mensajet = "";
            string mensaje = "";

            //variables para la creación de Bitacora
            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "";

            // int UltimoID_Recuperado = 0;
            int nformulario = int.Parse(form["numeroformulario"].ToString());

            int idactac = form["id_actacgenerado" + nformulario].ToString() != "" ? int.Parse(form["id_actacgenerado" + nformulario].ToString()) : 0;
            string[] hora_completa = form["horaInicio" + nformulario].ToString().Split(":");
            string[] horaHechosC = form["horaHechos" + nformulario].ToString().Split(":");
            string[] horaTerminoc = form["horaTermino" + nformulario].ToString().Split(":");

            int lugar = int.Parse(form["id_lugar" + nformulario].ToString());
            int diaFecha = int.Parse(form["diaFecha" + nformulario].ToString());
            int mes = int.Parse(form["id_mes" + nformulario].ToString());
            int anio = int.Parse(form["id_anio" + nformulario].ToString());
            int idAbogado = int.Parse(form["idabogado" + nformulario].ToString());
            string nomAbogado = form["nomAbogado" + nformulario].ToString();
            string puestoAbogado = form["puestoAbogado" + nformulario].ToString();
            string areaAbogado = form["areaAbogado" + nformulario].ToString();
            TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa[0]), int.Parse(hora_completa[1]));
            string fechaInicioCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaInicio.ToString();
            string ubicacion = form["ubicacion" + nformulario].ToString();
            int idPet = int.Parse(form["idpeticionarioelegido" + nformulario].ToString());
            string nombrePet = form["nombrePet" + nformulario].ToString();
            string origenPet = form["origenPet" + nformulario].ToString();
            int consentimiento = int.Parse(form["idconsentimiento" + nformulario].ToString());
            int identificacionPet = int.Parse(form["idcredencial" + nformulario].ToString());
            int edadPet = int.Parse(form["edadPet" + nformulario].ToString());

            //AGREGE ESTOS CAMPOS QUE FALTABAN
            string sabePet = form["sabeleerPet" + nformulario].ToString();
            string escolaridad = form["escolaridad" + nformulario].ToString();
            //--------------------------------

            string callePet = form["callePet" + nformulario].ToString();
            string numextPet = form["numextPet" + nformulario].ToString();
            string cpPet = form["cpPet" + nformulario].ToString();
            string coloniaPet = form["coloniaPet" + nformulario].ToString();
            string municipioPet = form["municipioPet" + nformulario].ToString();

            //AGREGE ESTE CAMPO
            string estadoPet = form["estadoPet" + nformulario].ToString();
            //-----------------------------------------

            string ocupacionPet = form["ocupacionPet" + nformulario].ToString();
            string telPet = form["telPet" + nformulario].ToString();
            string correoPet = form["correoPet" + nformulario].ToString();
            int idEscrito = int.Parse(form["idEscrito_" + nformulario].ToString());
            TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC[0]), int.Parse(horaHechosC[1]));
            string fechaHechos = form["fechaHechos" + nformulario].ToString() + ' '  + horaHechos;
            string fechaHechosdata = form["fechaHechos" + nformulario].ToString();
            string ubiHechos = form["ubiHechos" + nformulario].ToString();
            string hechos = form["hechos" + nformulario].ToString();
            TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc[0]), int.Parse(horaTerminoc[1]));
            string fechaTerminoCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaTermino.ToString();
            int origenPetExt = 0;
            string ComplementoPetExt = "";
            int idqueja = int.Parse(form["idquejaactac" + nformulario].ToString());
           


            if (origenPet == "218")
            {
                origenPetExt = int.Parse(form["origenPetvalExt" + nformulario].ToString());
                ComplementoPetExt = form["origenPetExtedo" + nformulario].ToString();
            }

            try
            {
                ActacModificado actaAlta = new ActacModificado();

                query = "Get_ActacAlta " + idactac;
                

                actaAlta = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
                SqlCommand cmd = null;

                query = "exec Sp_GET_MES " + mes;
                string mesdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_LUGAR " + lugar;
                string lugardesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_NOMBABOGADO " + idAbogado;
                string abogadodesc = conexionsql.ObtenerReader(query);
                string consentimientodesc = consentimiento == 1 ? "SI" : consentimiento == 2 ? "NO" : "";
                query = "Sp_GET_LUGAR " + origenPet;
                string origenPetdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_NOMBPETICIONARIO " + idPet;
                string idPetdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_IDENTI " + identificacionPet;
                string identificacionPetdesc = conexionsql.ObtenerReader(query);
                //string origenPetExtdesc = origenPetExt == 0 ? "-" : origenPetExt != 0 ? "Extranjero" :  "";
                //query = "exec Sp_GET_HORAFINAL " + fechaTerminoCompleta;
                //string horaTerminoe = conexionsql.ObtenerReader(query);

                query = "[dbo].[InsertActacAlta]";

                cmd = new SqlCommand(query, conexionsql.conexion(ref mensajet));

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idactac;
                cmd.Parameters.Add("@lugar", System.Data.SqlDbType.Int).Value = lugar;
                cmd.Parameters.Add("@diaFecha", System.Data.SqlDbType.Int).Value = diaFecha;
                cmd.Parameters.Add("@mes", System.Data.SqlDbType.Int).Value = mes;
                cmd.Parameters.Add("@anio", System.Data.SqlDbType.Int).Value = anio;
                cmd.Parameters.Add("@idAbogado", System.Data.SqlDbType.Int).Value = idAbogado;
                cmd.Parameters.Add("@horaInicio", System.Data.SqlDbType.DateTime).Value = fechaInicioCompleta;
                cmd.Parameters.Add("@ubicacion", System.Data.SqlDbType.VarChar).Value = ubicacion;
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idPet;
                cmd.Parameters.Add("@concentimiento", System.Data.SqlDbType.Int).Value = consentimiento;
                cmd.Parameters.Add("@origenPet", System.Data.SqlDbType.VarChar).Value = origenPet;
                cmd.Parameters.Add("@identificacionPet", System.Data.SqlDbType.Int).Value = identificacionPet;
                cmd.Parameters.Add("@idEscrito", System.Data.SqlDbType.Int).Value = idEscrito;
                cmd.Parameters.Add("@horaHechos", System.Data.SqlDbType.VarChar).Value = fechaHechos;
                cmd.Parameters.Add("@hechos", System.Data.SqlDbType.Text).Value = hechos;
                cmd.Parameters.Add("@ubiHechos", System.Data.SqlDbType.VarChar).Value = ubiHechos;
                cmd.Parameters.Add("@horaTermino", System.Data.SqlDbType.DateTime).Value = fechaTerminoCompleta;
                cmd.Parameters.Add("@origenPetExt", System.Data.SqlDbType.Int).Value = origenPetExt;
                cmd.Parameters.Add("@OrigenPetExtComp", System.Data.SqlDbType.VarChar).Value = ComplementoPetExt;
                cmd.Parameters.Add("@idQueja", System.Data.SqlDbType.VarChar).Value = idqueja;
                cmd.Parameters.Add("@ultimo_id_insertado", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();

                UltimoID_Recuperado = Convert.ToInt32(cmd.Parameters["@ultimo_id_insertado"].Value);

                mensajet = "ok";


                if (actaAlta.Id == 0)
                {
                   
                    tipoMod = "Alta";

                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Lugar", "-", lugardesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Día", "-", diaFecha.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Mes", "-", mesdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Año", "-", anio.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Abogado(a)", "-", abogadodesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Inicio", "-", horaInicio.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación", "-", ubicacion, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Agraviado(a) / Quejoso(a)", "-", idPetdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Consentimiento", "-", consentimientodesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario(a)", "-", origenPetdesc, Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario Extranjero", "-", origenPetExtdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Identificación", "-", identificacionPetdesc, Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Escrito", "-", idEscrito.ToString(), Ipaccesible);
                     ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Fecha de Hechos", "-", fechaHechosdata, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Hechos", "-", horaHechos.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación de Hechos", "-", ubiHechos, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hechos", "-", hechos, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Termino", "-", horaTermino.ToString(), Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Complemento de Peticionario", "-", ComplementoPetExt, Ipaccesible);
                   
                }

                else
                {

                    tipoMod = "Modificación";
                    if (actaAlta.Lugar != lugardesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Lugar", actaAlta.Lugar, lugardesc, Ipaccesible); }
                    if (actaAlta.DiaFecha != diaFecha) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Día", actaAlta.DiaFecha.ToString(), diaFecha.ToString(), Ipaccesible); }
                    if (actaAlta.Mes != mesdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Mes", actaAlta.Mes, mesdesc, Ipaccesible); }
                    if (actaAlta.Anio != anio.ToString()) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Año", actaAlta.Anio, anio.ToString(), Ipaccesible); }
                    if (actaAlta.NomAbogado != abogadodesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Abogado(a)", actaAlta.NomAbogado, abogadodesc, Ipaccesible); }
                    if (actaAlta.HoraInicio != horaInicio) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Inicio", actaAlta.HoraInicio.ToString(), horaInicio.ToString(), Ipaccesible); }
                    if (actaAlta.Ubicacion != ubicacion) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación", actaAlta.Ubicacion, ubicacion, Ipaccesible); }
                    //if (actaAlta.idPet.ToString() != idPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Peticionario", actaAlta.idPet.ToString(), idPetdesc, Ipaccesible); }
                    if (actaAlta.Consentimiento != consentimientodesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Consentimiento", actaAlta.Consentimiento, consentimientodesc, Ipaccesible); }
                    if (actaAlta.OrigenPet != origenPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario(a)", actaAlta.EstadoPet, origenPetdesc, Ipaccesible); }
                    //if (actaAlta.OrigenPeticionarioExterno != origenPetExtdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario Externo", actaAlta.OrigenPeticionarioExterno, origenPetExtdesc, Ipaccesible); }
                    if (actaAlta.IdentificacionPet != identificacionPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Identificación", actaAlta.IdentificacionPet, identificacionPetdesc, Ipaccesible); }
                    if (actaAlta.FechaHechos != fechaHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Fecha de Hechos", actaAlta.FechaHechos, fechaHechos, Ipaccesible); }
                    if (actaAlta.HoraHechos.ToString() != fechaHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Hechos", actaAlta.HoraHechos.ToString(), horaHechos.ToString(), Ipaccesible); }
                    if (actaAlta.UbiHechos != ubiHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación de Hechos", actaAlta.UbiHechos, ubiHechos, Ipaccesible); }
                    if (actaAlta.Hechos != hechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hechos", actaAlta.Hechos, hechos, Ipaccesible); }
                    if (actaAlta.HoraTermino != horaTermino) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Termino", actaAlta.HoraTermino.ToString(), horaTermino.ToString(), Ipaccesible); }



                }
          

               
            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }
            actaC = new ActacModificado();
            Console.WriteLine("ID INSERTADO: " + UltimoID_Recuperado);

            query = "exec Sp_Regresa_Acta_CircunstanciadaNuevo " + UltimoID_Recuperado;
            
            actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
            mensajet = "ok";


            CrearBitacoraTXT(idqueja, txtcontBuilder.ToString());
            return Json(new
            {
                mensaje = mensajet,
                idActac = UltimoID_Recuperado,
                listat = actaC
            });


        }
        public ActionResult ActualizaEnlaceFormatoQueja(IFormCollection form)
        {
            string idActaC = form["id_documento"];
            string idEnlace = form["id_enlace"];
            string documento = form["documento"];

            string query = $"exec Sp_UpdateEnlaceFormatoQueja '{idActaC}','{idEnlace}','{documento}'";

            conexionsql.InsertUpdateDelete(query);

            return Json(new
            {
                status = true,
                respidenlacequeja = idEnlace
            });
        }
        //public ActionResult ActualizaEnlaceFormatoQueja(IFormCollection form)
        //{
        //    string idActaC = form["id_documento"].ToString(); // id escrito
        //    string idEnlace = form["id_enlace"].ToString(); // id queja
        //    string documento = form["documento"].ToString(); // tipo documento
        //    string query = "";
        //    bool statusresp = false;

        //    query = "exec Sp_UpdateEnlaceFormatoQueja '" + idActaC + "','" + idEnlace + "', '" + documento + "'";
        //    int idenlacequeja = conexionsql.InsertUpdateDeleteRegresaid(query);

        //    if (idenlacequeja > 0)
        //    {
        //        statusresp = true;
        //    }
        //    else
        //    {
        //        statusresp = false;
        //    }


        //    return Json(new { status = statusresp, respidenlacequeja = idenlacequeja });
        //}

        public ActionResult DiasAgregar()
        {
            string resultado="";
            string mensaje = "";
            String query = "exec RegresaDiasFinMes";
            resultado = conexionsql.ObtenerReader(query);

            if (resultado!= null)
            {
                return Json(new { dias = resultado });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }

        public ActionResult InsertEnlaceFormatoQueja(IFormCollection form)
        {
            string idqueja = form["id_queja"].ToString();
            string idescrito = form["id_escrito"].ToString();
            string id_actac = form["id_actac"].ToString();
            string idcomplementopet = form["id_complementopet"].ToString();
            string idpeticionario = form["id_peticionario"].ToString();

            string query = "";
            bool statusresp = false;

            query = "exec Sp_InsertaEnlaceFormatoQuejaActac '" + idqueja + "','" + idescrito + "', '" + id_actac + "', '" + idcomplementopet + "','" + idpeticionario + "'";
            int idenlacequeja = conexionsql.InsertUpdateDeleteRegresaid(query);

            if (idenlacequeja > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }


            return Json(new { status = statusresp, idinsertado = idenlacequeja });
        }



        //EN BUSCA TABLA
        public ActionResult GuardaActaC(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
            string[] hora_completa = form["horaInicio"].ToString().Split(":");
            string[] horaHechosC = form["horaHechos"].ToString().Split(":");
            string[] horaTerminoc = form["horaTermino"].ToString().Split(":");
            int idActaC = 0;


            string mensaje = "";

            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();


            if (form["idactac"] != "")
            {
                idActaC = int.Parse(form["idactac"].ToString());
            }
            else
            {
                idActaC = 0;
            }

            int lugar = int.Parse(form["lugar"].ToString());
            int diaFecha = int.Parse(form["diaFecha"].ToString());
            int mes = int.Parse(form["mes"].ToString());
            int anio = int.Parse(form["anioND"].ToString());
            int idAbogado = int.Parse(form["idabogado"].ToString());
            string nomAbogado = form["nomAbogado"].ToString();
            string puestoAbogado = form["puestoAbogado"].ToString();
            string areaAbogado = form["areaAbogado"].ToString();
            TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa[0]), int.Parse(hora_completa[1]));
            string fechaInicioCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaInicio.ToString();
            string ubicacion = form["ubicacion"].ToString();
            int.TryParse(form["idpet"], out int idPet);
            string nombrePet = form["nombrePet"].ToString();
            string origenPet = form["origenPet"].ToString();
            int consentimiento = int.Parse(form["consentimiento"].ToString());
            int identificacionPet = int.Parse(form["identificacionPet"].ToString());
            //int edadPet = int.Parse(form["edadPet"].ToString());
            string edadStr = form["edadPet"].ToString();

            int edadPet = 0;

            if (!string.IsNullOrWhiteSpace(edadStr) && edadStr != "No proporcionado")
            {
                int.TryParse(edadStr, out edadPet);
            }
            //AGREGE ESTOS CAMPOS QUE FALTABAN
            string sabePet = form["sabeleerPet"].ToString();
            string escolaridad = form["escolaridad"].ToString();
            //--------------------------------
            string callePet = form["callePet"].ToString();
            string numextPet = form["numextPet"].ToString();
            string cpPet = form["cpPet"].ToString();
            string coloniaPet = form["coloniaPet"].ToString();
            string municipioPet = form["municipioPet"].ToString();
            //AGREGE ESTE CAMPO
            string estadoPet = form["estadoPet"].ToString();//n734110058
            //-----------------------------------------
            string ocupacionPet = form["ocupacionPet"].ToString();
            string telPet = form["telPet"].ToString();
            string correoPet = form["correoPet"].ToString();
            int idEscrito = int.Parse(form["idEscrito_"].ToString());
            TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC[0]), int.Parse(horaHechosC[1]));
            string fechaHechos = form["fechaHechos"].ToString();
            string ubiHechos = form["ubiHechos"].ToString();
            string hechos = form["hechos"].ToString();
            TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc[0]), int.Parse(horaTerminoc[1]));
            string fechaTerminoCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaTermino.ToString();
            int origenPetExt = 0;
            string ComplementoPetExt = "";

            int diqueja = Int32.Parse(form["idqueja"].ToString());
            int idcomplemento_pet = Int32.Parse(form["idcompet"].ToString());
            int id_escrito = Int32.Parse(form["idescritoim"].ToString());
            int idpeticionario = Int32.Parse(form["idpeti"].ToString());
         

            if (origenPet == "218")
            {
                origenPetExt = int.Parse(form["origenPetvalExt"].ToString());
                ComplementoPetExt = form["origenPetExtedo"].ToString();
            }

            try
            {
                ActacModificado actaAlta = new ActacModificado();

                query = "Get_ActacAlta " + idActaC;


                actaAlta = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
                SqlCommand cmd = null;

                query = "exec Sp_GET_MES " + mes;
                string mesdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_LUGAR " + lugar;
                string lugardesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_NOMBABOGADO " + idAbogado;
                string abogadodesc = conexionsql.ObtenerReader(query);
                string consentimientodesc = consentimiento == 1 ? "SI" : consentimiento == 2 ? "NO" : "";
                query = "Sp_GET_LUGAR " + origenPet;
                string origenPetdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_NOMBPETICIONARIO " + idPet;
                string idPetdesc = conexionsql.ObtenerReader(query);
                query = "Sp_GET_IDENTI " + identificacionPet;
                string identificacionPetdesc = conexionsql.ObtenerReader(query);
                string origenPetExtdesc = origenPetExt == 0 ? "-" : origenPetExt != 0 ? "Extranjero" : "";
                //query = "exec Sp_GET_HORAFINAL " + fechaTerminoCompleta;
                //string horaTerminoe = conexionsql.ObtenerReader(query);


                query = "[dbo].[InsertActac]";
                SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng());
                cmd = new SqlCommand(query, connection);
                //SqlCommand cmd = new SqlCommand(conexionsql.ConnectionStrng());
                //cmd.CommandText = query;

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idActaC;
                cmd.Parameters.Add("@lugar", System.Data.SqlDbType.Int).Value = lugar;
                cmd.Parameters.Add("@diaFecha", System.Data.SqlDbType.Int).Value = diaFecha;
                cmd.Parameters.Add("@mes", System.Data.SqlDbType.Int).Value = mes;
                cmd.Parameters.Add("@anio", System.Data.SqlDbType.Int).Value = anio;
                cmd.Parameters.Add("@idAbogado", System.Data.SqlDbType.Int).Value = idAbogado;
                cmd.Parameters.Add("@horaInicio", System.Data.SqlDbType.DateTime).Value = fechaInicioCompleta;
                cmd.Parameters.Add("@ubicacion", System.Data.SqlDbType.VarChar).Value = ubicacion;
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idpeticionario;
                cmd.Parameters.Add("@concentimiento", System.Data.SqlDbType.Int).Value = consentimiento;
                cmd.Parameters.Add("@origenPet", System.Data.SqlDbType.VarChar).Value = origenPet;
                cmd.Parameters.Add("@identificacionPet", System.Data.SqlDbType.Int).Value = identificacionPet;
                cmd.Parameters.Add("@idEscrito", System.Data.SqlDbType.Int).Value = idEscrito;
                cmd.Parameters.Add("@horaHechos", System.Data.SqlDbType.VarChar).Value = fechaHechos + ' ' + horaHechos;
                cmd.Parameters.Add("@hechos", System.Data.SqlDbType.Text).Value = hechos;
                cmd.Parameters.Add("@ubiHechos", System.Data.SqlDbType.VarChar).Value = ubiHechos;
                cmd.Parameters.Add("@horaTermino", System.Data.SqlDbType.DateTime).Value = fechaTerminoCompleta;
                cmd.Parameters.Add("@origenPetExt", System.Data.SqlDbType.Int).Value = origenPetExt;
                cmd.Parameters.Add("@OrigenPetExtComp", System.Data.SqlDbType.VarChar).Value = ComplementoPetExt;
                cmd.Parameters.Add("@idQueja", System.Data.SqlDbType.Int).Value = diqueja;
                cmd.Parameters.Add("@compet", System.Data.SqlDbType.Int).Value = idcomplemento_pet;
                cmd.Parameters.Add("@idescritoi", System.Data.SqlDbType.Int).Value = id_escrito;
                cmd.Parameters.Add("@idpeti", System.Data.SqlDbType.Int).Value = idpeticionario;
                cmd.Parameters.Add("@ultimo_id_insertado", SqlDbType.Int).Direction = ParameterDirection.Output;
                
                cmd.Connection.Open();

                cmd.ExecuteNonQuery();

                UltimoID_Recuperado = Convert.ToInt32(cmd.Parameters["@ultimo_id_insertado"].Value);

                mensajet = "ok";


                if (actaAlta.Id == 0)
                {

                    tipoMod = "Alta";

                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Lugar", "-", lugardesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Día", "-", diaFecha.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Mes", "-", mesdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Año", "-", anio.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Abogado(a)", "-", abogadodesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Inicio", "-", horaInicio.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación", "-", ubicacion, Ipaccesible); ;
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Agraviado(a) / Quejoso(a)", "-", idPetdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Consentimiento", "-", consentimientodesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario(a)", "-", origenPetdesc, Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario Extranjero", "-", origenPetExtdesc, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Identificación", "-", identificacionPetdesc, Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Escrito", "-", idEscrito.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Fecha de Hechos", "-", fechaHechos, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Hechos", "-", horaHechos.ToString(), Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación de Hechos", "-", ubiHechos, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hechos", "-", hechos, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Termino", "-", horaTermino.ToString(), Ipaccesible);
                    //ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Complemento de Peticionario", "-", ComplementoPetExt, Ipaccesible);
                }

                else
                {
                    tipoMod = "Modificación";
                    if (actaAlta.Lugar != lugardesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Lugar", actaAlta.Lugar, lugardesc, Ipaccesible); }
                    if (actaAlta.DiaFecha != diaFecha) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Día", actaAlta.DiaFecha.ToString(), diaFecha.ToString(), Ipaccesible); }
                    if (actaAlta.Mes != mesdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Mes", actaAlta.Mes, mesdesc, Ipaccesible); }
                    if (actaAlta.Anio != anio.ToString()) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Año", actaAlta.Anio, anio.ToString(), Ipaccesible); }
                    if (actaAlta.NomAbogado != abogadodesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Abogado(a)", actaAlta.NomAbogado, abogadodesc, Ipaccesible); }
                    if (actaAlta.HoraInicio != horaInicio) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Inicio", actaAlta.HoraInicio.ToString(), horaInicio.ToString(), Ipaccesible); }
                    if (actaAlta.Ubicacion != ubicacion) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación", actaAlta.Ubicacion, ubicacion, Ipaccesible); }
                    //if (actaAlta.idPet.ToString() != idPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Peticionario", actaAlta.idPet.ToString(), idPetdesc, Ipaccesible); }
                    if (actaAlta.Consentimiento != consentimientodesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Consentimiento", actaAlta.Consentimiento, consentimientodesc, Ipaccesible); }
                    if (actaAlta.OrigenPet != origenPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario(a)", actaAlta.OrigenPet, origenPetdesc, Ipaccesible); }
                    //if (actaAlta.OrigenPeticionarioExterno != origenPetExtdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Origen de Peticionario Externo", actaAlta.OrigenPeticionarioExterno, origenPetExtdesc, Ipaccesible); }
                    if (actaAlta.IdentificacionPet != identificacionPetdesc) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Identificación", actaAlta.IdentificacionPet, identificacionPetdesc, Ipaccesible); }
                    if (actaAlta.FechaHechos != fechaHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Fecha de Hechos", actaAlta.FechaHechos, fechaHechos, Ipaccesible); }
                    if (actaAlta.HoraHechos.ToString() != fechaHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Hechos", actaAlta.HoraHechos.ToString(), horaHechos.ToString(), Ipaccesible); }
                    if (actaAlta.UbiHechos != ubiHechos) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Ubicación de Hechos", actaAlta.UbiHechos, ubiHechos, Ipaccesible); }
                    if (actaAlta.HoraTermino != horaTermino) { ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hora de Termino", actaAlta.HoraTermino.ToString(), horaTermino.ToString(), Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Acta Circunstanciada", tipoMod, "Hechos", actaAlta.Hechos.ToString(), hechos, Ipaccesible);



                }

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }

            if (form["idqueja"].ToString() != "")
            {

            }
            CrearBitacoraTXT(diqueja, txtcontBuilder.ToString());
            return Json(new { mensaje = mensajet, listat = actaC });

        }

        public ActionResult GuardaActaCmas(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
            try
            {
                string[] hora_completa = form["horaInicio"].ToString().Split(":");
                string[] horaHechosC = form["horaHechos"].ToString().Split(":");
                string[] horaTerminoc = form["horaTermino"].ToString().Split(":");

                int idActaC = int.Parse(form["idactac"].ToString());
                int lugar = int.Parse(form["id_lugar"].ToString());
                int diaFecha = int.Parse(form["diaFecha"].ToString());
                int mes = int.Parse(form["mes"].ToString());
                int anio = int.Parse(form["anio"].ToString());
                int idAbogado = int.Parse(form["idabogado"].ToString());
                string nomAbogado = form["nomAbogado"].ToString();
                string puestoAbogado = form["puestoAbogado"].ToString();
                string areaAbogado = form["areaAbogado"].ToString();
                TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa[0]), int.Parse(hora_completa[1]));
                string fechaInicioCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaInicio.ToString();
                string ubicacion = form["ubicacion"].ToString();
                int idPet = int.Parse(form["idpet"].ToString());
                string nombrePet = form["nombrePet"].ToString();
                string origenPet = form["origenPet"].ToString();
                int consentimiento = int.Parse(form["consentimiento"].ToString());
                int identificacionPet = int.Parse(form["identificacionPet"].ToString());
                int edadPet = int.Parse(form["edadPet"].ToString());
                //AGREGE ESTOS CAMPOS QUE FALTABAN
                string sabePet = form["sabeleerPet"].ToString();
                string escolaridad = form["escolaridad"].ToString();
                //--------------------------------
                string callePet = form["callePet"].ToString();
                string numextPet = form["numextPet"].ToString();
                string cpPet = form["cpPet"].ToString();
                string coloniaPet = form["coloniaPet"].ToString();
                string municipioPet = form["municipioPet"].ToString();
                //AGREGE ESTE CAMPO
                string estadoPet = form["estadoPet"].ToString();
                //-----------------------------------------
                string ocupacionPet = form["ocupacionPet"].ToString();
                string telPet = form["telPet"].ToString();
                string correoPet = form["correoPet"].ToString();
                int idEscrito = int.Parse(form["idEscrito_"].ToString());
                TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC[0]), int.Parse(horaHechosC[1]));
                string fechaHechos = form["fechaHechos"].ToString();
                string ubiHechos = form["ubiHechos"].ToString();
                string hechos = form["hechos"].ToString();
                TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc[0]), int.Parse(horaTerminoc[1]));
                string fechaTerminoCompleta = DateTime.Now.Year.ToString() + '-' + DateTime.Now.Month.ToString() + '-' + DateTime.Now.Day.ToString() + ' ' + horaTermino.ToString();
                int origenPetExt = 0;
                string ComplementoPetExt = "";

                if (origenPet == "218")
                {
                    origenPetExt = int.Parse(form["origenPetvalExt"].ToString());
                    ComplementoPetExt = form["origenPetExtedo"].ToString();
                }
                query = "[dbo].[InsertActac]";

                System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(conexionsql.ConnectionStrng());
                cmd.CommandText = query;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@ids", System.Data.SqlDbType.Int).Value = idActaC;
                cmd.Parameters.Add("@lugar", System.Data.SqlDbType.Int).Value = lugar;
                cmd.Parameters.Add("@diaFecha", System.Data.SqlDbType.Int).Value = diaFecha;
                cmd.Parameters.Add("@mes", System.Data.SqlDbType.Int).Value = mes;
                cmd.Parameters.Add("@anio", System.Data.SqlDbType.Int).Value = anio;
                cmd.Parameters.Add("@idAbogado", System.Data.SqlDbType.Int).Value = idAbogado;
                cmd.Parameters.Add("@horaInicio", System.Data.SqlDbType.DateTime).Value = fechaInicioCompleta;
                cmd.Parameters.Add("@ubicacion", System.Data.SqlDbType.VarChar).Value = ubicacion;
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idPet;
                cmd.Parameters.Add("@concentimiento", System.Data.SqlDbType.Int).Value = consentimiento;
                cmd.Parameters.Add("@origenPet", System.Data.SqlDbType.VarChar).Value = origenPet;
                cmd.Parameters.Add("@identificacionPet", System.Data.SqlDbType.Int).Value = identificacionPet;
                cmd.Parameters.Add("@idEscrito", System.Data.SqlDbType.Int).Value = idEscrito;
                cmd.Parameters.Add("@horaHechos", System.Data.SqlDbType.VarChar).Value = fechaHechos;
                cmd.Parameters.Add("@hechos", System.Data.SqlDbType.Text).Value = hechos;
                cmd.Parameters.Add("@ubiHechos", System.Data.SqlDbType.VarChar).Value = ubiHechos;
                cmd.Parameters.Add("@horaTermino", System.Data.SqlDbType.DateTime).Value = fechaTerminoCompleta;
                cmd.Parameters.Add("@origenPetExt", System.Data.SqlDbType.Int).Value = origenPetExt;
                cmd.Parameters.Add("@OrigenPetExtComp", System.Data.SqlDbType.VarChar).Value = ComplementoPetExt;
                cmd.Parameters.Add("@ultimo_id_insertado", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Connection.Open();

                cmd.ExecuteNonQuery();

                UltimoID_Recuperado = Convert.ToInt32(cmd.Parameters["@ultimo_id_insertado"].Value);

                mensajet = "ok";

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }
            return Json(new { mensaje = mensajet, listat = actaC });
        }
        public ActionResult GeneraActaCircunstanciadaModificada(IFormCollection form)
        {
            int idActaC = int.Parse(form["idactac"].ToString());
            actaC = new ActacModificado();
            int id_ultimoLE = 0;
            string mensajet = "";
            string query = "";

            query = "exec Sp_Regresa_Acta_Circunstanciada " + idActaC;
            string mensaje = "";
            actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
            mensajet = "ok";
            return Json(new { mensaje = mensajet, listat = actaC });
        }
        public ActionResult MemorandumdqotPDF(int idmemorandum)
        {
            TempData["idmemorandumt"] = idmemorandum;
            return RedirectToAction("Memorandum_Remisión");
        }

        public ViewAsPdf Memorandum_Remisión() //Cambio del nombre para que no sea vea en el navegador al generar el PDF -Fred
        {

            int? num_memo = (int?)TempData["idmemorandumt"];
            var listmemorandum = new List<MemorandumModificado>();
            //List<MemorandumModificado> listmemorandum = new List<MemorandumModificado>();

            List<Area> arreglo_areas = new List<Area>();
            List<Area> arreglo_areasdes = new List<Area>();
            List<Usuario> usuarios = new List<Usuario>();

            String query = "exec Sp_Select_Data_Memorandum '" + num_memo + "'";
            String query_areaor = "";
            String query_areades = "";
            String query_titularareades = "";
            String query_expxmemo = "";
            var data = GetDatosGeneral(query);


            foreach (DataRow row in data.Rows)
            {

                MemorandumModificado itemmemorandum = new MemorandumModificado();
                //itemformatos.IdUnionFormatosQueja = Convert.ToInt32(row["ID_UNION_FORMATOS_QUEJA"]);
                itemmemorandum.PkMemorandum = Int32.Parse(row["PK_MEMORANDUM"].ToString());
                itemmemorandum.NumMemorandum = (row["NUM_MEMORANDUM"]).ToString();
                itemmemorandum.FechaDeCreacion = Convert.ToDateTime(row["FECHA_DE_CREACION"]);

                // Datos de area origen memo
                query_areaor = "exec Sp_GetDataAreas " + "'" + Convert.ToInt32(row["FK_AREA_ORIGEN"]) + "'";
                var data_areaor = GetDatosGeneral(query_areaor);
                List<Area> areaorlist = new List<Area>();

                foreach (DataRow row_areaor in data_areaor.Rows)
                {
                    Area itemArea = new Area();
                    itemArea.IdArea = Convert.ToInt32(row_areaor["ID_AREA"]);
                    itemArea.Descripcion = (row_areaor["DESCRIPCION"]).ToString();
                    itemArea.Siglas = (row_areaor["SIGLAS"]).ToString();
                    areaorlist.Add(itemArea);
                }
                // Fin Datos de area origen memo

                // Datos de area destino memo
                query_areades = "exec Sp_GetDataAreas " + "'" + Convert.ToInt32(row["FK_AREA_DESTINATARIO"]) + "'";
                var data_areades = GetDatosGeneral(query_areades);
                List<Area> areadeslist = new List<Area>();

                foreach (DataRow row_areaor in data_areades.Rows)
                {
                    Area itemArea = new Area();
                    itemArea.IdArea = Convert.ToInt32(row_areaor["ID_AREA"]);
                    itemArea.Descripcion = (row_areaor["DESCRIPCION"]).ToString();
                    itemArea.Siglas = (row_areaor["SIGLAS"]).ToString();
                    areadeslist.Add(itemArea);
                }
                // Fin Datos de area destino memo

                // Agregar Titular del area a la visitaduria que se le asigno
                // Obtener Titular del área (Visitador General)
                var idAreaDestino = Convert.ToInt32(row["FK_AREA_DESTINATARIO"]);
                string query_titulardes = @"SELECT TOP 1 * FROM USUARIOS WHERE FK_ID_AREA = " + idAreaDestino + @" AND CARGO_DOCUMENTOS LIKE '%VISITADOR%'";

                var data_titulardes = GetDatosGeneral(query_titulardes);

                List<Usuario> listTitulardes = new List<Usuario>();

                foreach (DataRow row_tdes in data_titulardes.Rows)
                {
                    Usuario userItem = new Usuario();
                    userItem.IdUsuario = Convert.ToInt32(row_tdes["ID_USUARIO"]);
                    userItem.Nombre = row_tdes["NOMBRE"].ToString().ToUpper();
                    userItem.Ap = row_tdes["AP"].ToString().ToUpper();       // Apellido paterno
                    userItem.Am = row_tdes["AM"].ToString().ToUpper();       // Apellido materno
                    userItem.GradoAcademico = row_tdes["GRADO_ACADEMICO"].ToString().ToUpper();
                    userItem.CargoDocumentos = row_tdes["CARGO_DOCUMENTOS"].ToString().ToUpper();

                    listTitulardes.Add(userItem);
                }

                // Asignar a tu MemorandumModificado
                itemmemorandum.lstUsuario = listTitulardes;

                // Fin Titular de area a la visitaduria que se le asigno

                // Datos Director(a) de quejas -Fred
                string query_direct = @"SELECT TOP 1 * FROM USUARIOS WHERE ROL = 'ADMIN_DQOT' AND CARGO_DOCUMENTOS LIKE '%DIRECTOR%'";

                var data_direct = GetDatosGeneral(query_direct);

                Usuario direct = null;

                foreach (DataRow rowDirect in data_direct.Rows)
                {
                    direct = new Usuario();
                    direct.Nombre = rowDirect["NOMBRE"].ToString().ToUpper();
                    direct.Ap = rowDirect["AP"].ToString().ToUpper();
                    direct.Am = rowDirect["AM"].ToString().ToUpper();
                    direct.GradoAcademico = rowDirect["GRADO_ACADEMICO"].ToString().ToUpper();
                    direct.CargoDocumentos = rowDirect["CARGO_DOCUMENTOS"].ToString().ToUpper();
                }

                itemmemorandum.DirectQuejas = direct;
                // fin de la obtención de los datos del director(a) de quejas;


                // Agregar expedientes ligados a ese memo 
                query_expxmemo = "exec Sp_GetDataExpxmemo " + "'" + Convert.ToInt32(row["PK_MEMORANDUM"]) + "'";
                var data_expxmemo = GetDatosGeneral(query_expxmemo);
                List<ExpedienteTurno> listExpxmemo = new List<ExpedienteTurno>();

                foreach (DataRow row_tdes in data_expxmemo.Rows)
                {
                    ExpedienteTurno itemExp = new ExpedienteTurno();
                    itemExp.PkExpedienteTurno = (Convert.ToInt32(row_tdes["pk_expediente_turno"]));
                    itemExp.IdExpediente = (row_tdes["id_expediente"]).ToString();

                    if (!string.IsNullOrEmpty((row_tdes["num_fojas"]).ToString()))
                    { itemExp.NumFojas = (Convert.ToInt32(row_tdes["num_fojas"])); }
                    else { itemExp.NumFojas = 0; }

                    if (!string.IsNullOrEmpty((row_tdes["observaciones"]).ToString()))
                    { itemExp.Observaciones = (row_tdes["observaciones"]).ToString(); }
                    else { itemExp.Observaciones = "Ninguna"; }

                    listExpxmemo.Add(itemExp);
                }
                // Fin Agregar expedientes ligados a ese memo

                itemmemorandum.lstArea = areaorlist;
                itemmemorandum.lstAreades = areadeslist;
                itemmemorandum.lstUsuario = listTitulardes;
                itemmemorandum.lstExpturnados = listExpxmemo;

                listmemorandum.Add(itemmemorandum);
            }


            return new ViewAsPdf("PlantillaMemoDqot", listmemorandum)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 20, Right = 20 },

                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado + " --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html " + rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }

        public ActionResult VerPDF(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Escrito_Inicial_de_Queja");
        }

        public ActionResult Plantilla_Datos_DQOT(int idq)
        {
            TempData["idescritort"] = idq;
            return RedirectToAction("InfoRecabadaDQOT");
        }

        public ActionResult Plantilla_Cedula_Calificacion(int idq)
        {
            TempData["idescritort"] = idq;
            return RedirectToAction("Cedulac");
        }

        public ActionResult Plantilla_Cedula_Modificacion(int idq)
        {
            TempData["idescritort"] = idq;
            return RedirectToAction("modificacion");
        }

        // Cris y David 05 08 2025: Metodos base CedulaABC para la impresion del pdf (traidos del ejemplo de Yere)
        public ActionResult CedulaOrientacion(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Cedula_Orientacion");
        }
        public ActionResult CedulaRemision(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Cedula_Remision");
        }

        public ActionResult CedulaIncompetencia(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Cedula_Incompetencia");
        }

        public ActionResult CedulaAntecedente(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Cedula_Antecedente");
        }

        public ActionResult CedulaAportacion()
        {
            return RedirectToAction("Cedula_Aportacion");
        }

        public ActionResult BitacoraCambiosPDF(int idexped)
        {
            TempData["idexped"] = idexped;
            return RedirectToAction("BitCambios");
        }
        public ActionResult BitacoraCambiosAportacionPDF(int idAportacion)
        {
            TempData["idAportacion"] = idAportacion;
            return RedirectToAction("BitCambiosAportacion");
        }


        public ViewAsPdf modificacion()
        {
            var pdfescritoi = new List<cedulaCalificacion>();
            var pdfescritoipet = new List<peticionariocedula>();
            var pdfescritoiAHV = new List<authecCedula>();
            var pdfescritoconclu=new List<SelectCausaC>();

            int? idei = (int?)TempData["idescritort"];


            /*Primera parte*/
            string query = "exec Sp_regresa_DQOT_Cedula " + idei+",'MODIFICACION'";
            var data = GetDatosGeneral(query);
            foreach (DataRow row in data.Rows)
            {

                cedulaCalificacion itemPdfei = new cedulaCalificacion();
                itemPdfei.Expediente = row["expediente"].ToString();
                itemPdfei.fecha_Hora_registro = row["fecha_registrro"].ToString();
                itemPdfei.fecha_RFV = row["fecharecepfis"].ToString();
                itemPdfei.VIA_ENTRADA = row["viainter"].ToString();
                itemPdfei.materia = row["materia"].ToString();
                itemPdfei.lugar_Hechos = row["lugar_hechos"].ToString();
                itemPdfei.fecha_Hora_turnoe = row["fechaturnovisitaduriaelectronico"].ToString();
                itemPdfei.fecha_TA = row["fechaturnoabogadovg"].ToString();
                itemPdfei.fecha_calificacion = row["fecha_calificacion"].ToString();
                itemPdfei.FECHA_ULTIMA_MODIFI = row["FEHCA_ULTIMA_MODIFI"].ToString();
                itemPdfei.programa = row["programa"].ToString();
                itemPdfei.id = int.Parse(row["id_expediente"].ToString());
                itemPdfei.visitaduría = row["visitaduria"].ToString();
                itemPdfei.abogado = row["abogado"].ToString();
                itemPdfei.visitador = row["visitador"].ToString();
                itemPdfei.hechos = row["hechos"].ToString();
                itemPdfei.fechactual = DateTime.Now;


                pdfescritoi.Add(itemPdfei);
            }
            /*Primera parte*/

            /*Segunda parte*/
            query = "exec Sp_regresa_peticionario_Cedula " + idei + ",'MODIFICACION'";
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                peticionariocedula itemPdfei = new peticionariocedula();

                itemPdfei.id = int.Parse(row["ID_REGISTRO"].ToString());
                itemPdfei.tipopet = row["TIPO_USUARIO"].ToString();
                itemPdfei.nombrepet = row["nombre_completo"].ToString();

                pdfescritoipet.Add(itemPdfei);
            }
            /*Segunda parte*/


            /*Tercera parte */
            query = "exec Sp_regresa_AutHV_Cedula " + idei + ",'MODIFICACION'"; ;
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                authecCedula itemPdfei = new authecCedula();

                itemPdfei.autoridad = row["AUTORIDAD"].ToString();
                itemPdfei.HV = row["MATERIA"].ToString();
                itemPdfei.DH = row["DESDH"].ToString();

                pdfescritoiAHV.Add(itemPdfei);
            }
            /*Tercera parte */
            /*Cuarta parte*/
            query = "exec Sp_regresa_causac_Cedula " + idei + ",'MODIFICACION'"; ;
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                SelectCausaC itemPdfei = new SelectCausaC(0, row["fechaa"].ToString(), row["causaa"].ToString(), row["conclusion"].ToString(), row["actorest"].ToString(), row["observar"].ToString());


                pdfescritoconclu.Add(itemPdfei);
            }
            /*Cuarta parte*/
            if (pdfescritoi.Count == 0)
            {
                pdfescritoi.Add(new cedulaCalificacion());
            }

            pdfescritoi[0].listpet = pdfescritoipet;
            pdfescritoi[0].listauth = pdfescritoiAHV;
            pdfescritoi[0].listacasa = pdfescritoconclu;

            return new ViewAsPdf("Plantilla_Cedula_Modificacion", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 5, Right = 5 },
                // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF + ".pdf"),
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html "+rutaencabezado1+" --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html "+rutapie1+" --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }
            // David 29 07 2025: Controlador obtiene info del petit en la alta de orientacion el cual hizo la alta (documento = 1 en la BD)
        private CedulaOrientacionModel ObtenerDatosCedulaOrientacion(string idEscrito)
        {
            using (var conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();

                string sql = @"
            SELECT TOP 1 Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion, Peticionario, 
                         Autoridad, Institucion, Explicacion, Abogado
            FROM ORIENTACION
            WHERE id_escrito = @IdEscrito AND Documento = 'SI'
            ORDER BY id_orientacion DESC";
                // Obtiene el registro del petit segun coincida el id de escrito generado y que haya sido quien dio la alta (btn guardar)

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new CedulaOrientacionModel
                            {
                                IdEscrito = reader["Id_escrito"]?.ToString(),
                                Folio = reader["Folio"]?.ToString(),
                                LugarRecepcion = reader["Lugar_hechos"]?.ToString(),
                                FechaRecepcion = (DateTime)(reader["Fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["Fecha_recepcion"])),
                                HoraRecepcion = (TimeSpan)(reader["Hora_recepcion"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)reader["Hora_recepcion"]),
                                Peticionario = reader["Peticionario"]?.ToString(),
                                Autoridad = reader["Autoridad"]?.ToString(),
                                Institucion = reader["Institucion"]?.ToString(),
                                Explicacion = reader["Explicacion"]?.ToString(),
                                Abogado = reader["Abogado"]?.ToString()?.ToUpper()
                                // Estos datos extraidos se utilizaran para hacer el llenado de campos en la rotativa - pdf de la alta

                            };
                        }
                    }
                }
            }

            return null;
        }

            // Cris y David 06 08 2025: Controlador que hace una peticion de busqueda de datos de la alta realizada en la tabla de remision
        private CedulaRemisionModel ObtenerDatosCedulaRemision(string idEscrito)
        {
            using (var conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();

                string sql = @"
            SELECT TOP 1 Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion, Peticionario, 
                         Numero_oficio, Institucion, Remitente, Explicacion, Abogado
            FROM REMISION
            WHERE Id_escrito = @IdEscrito AND documento = 'SI'
            ORDER BY Id_remision DESC";
                // Obtiene el registro del petit segun coincida el id de escrito generado y que haya sido quien dio la alta (btn guardar)

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new CedulaRemisionModel
                            {
                                IdEscrito = reader["Id_escrito"]?.ToString(),
                                Folio = reader["Folio"]?.ToString(),
                                LugarRecepcion = reader["Lugar_hechos"]?.ToString(),
                                FechaRecepcion = (DateTime)(reader["Fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["Fecha_recepcion"])),
                                HoraRecepcion = (TimeSpan)(reader["Hora_recepcion"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)reader["Hora_recepcion"]),
                                Peticionario = reader["Peticionario"]?.ToString(),
                                Oficio = reader["Numero_oficio"]?.ToString(),
                                Institucion = reader["Institucion"]?.ToString(),
                                Remitente = reader["Remitente"]?.ToString(),
                                Explicacion = reader["Explicacion"]?.ToString(),
                                Abogado = reader["Abogado"]?.ToString()?.ToUpper()
                                // Estos datos extraidos se utilizaran para hacer el llenado de campos en la rotativa - pdf de la alta

                            };
                        }
                    }
                }
            }

            return null;
        }

        // Cris y David 06 08 2025: Controlador que hace una peticion de busqueda de datos de la alta realizada en la tabla de incompetencia
        private CedulaIncompetenciaModel ObtenerDatosCedulaIncompetencia(string idEscrito)
        {
            using (var conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();

                  string sql = @"
                    SELECT TOP 1 Id_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion, Peticionario, 
                                 Numero_oficio, Institucion, Remitente, Explicacion, Abogado
                    FROM INCOMPETENCIA
                    WHERE Id_escrito = @IdEscrito AND Documento = 'SI'
                    ORDER BY Id_incompetencia DESC";
                // Obtiene el registro del petit segun coincida el id de escrito generado y que haya sido quien dio la alta (btn guardar)

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new CedulaIncompetenciaModel
                            {
                                IdEscrito = reader["Id_escrito"]?.ToString(),
                                Folio = reader["Folio"]?.ToString(),
                                LugarRecepcion = reader["Lugar_hechos"]?.ToString(),
                                FechaRecepcion = (DateTime)(reader["Fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["Fecha_recepcion"])),
                                HoraRecepcion = (TimeSpan)(reader["Hora_recepcion"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)reader["Hora_recepcion"]),
                                Peticionario = reader["Peticionario"]?.ToString(),
                                Oficio = reader["Numero_oficio"]?.ToString(),
                                Institucion = reader["Institucion"]?.ToString(),
                                Remitente = reader["Remitente"]?.ToString(),
                                Explicacion = reader["Explicacion"]?.ToString(),
                                Abogado = reader["Abogado"]?.ToString()?.ToUpper()
                                // Estos datos extraidos se utilizaran para hacer el llenado de campos en la rotativa - pdf de la alta

                            };
                        }
                    }
                }
            }

            return null;
        }

        // Cris y David 06 08 2025: Controlador que hace una peticion de busqueda de datos de la alta realizada en la tabla de antecedente
        private CedulaAntecedenteModel ObtenerDatosCedulaAntecedente(string idEscrito)
        {
            using (var conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();

                string sql = @"
                    SELECT TOP 1 ID_escrito, Folio, Lugar_hechos, Fecha_recepcion, Hora_recepcion,
		                Autoridad, Peticionario, Explicacion, Abogado
                    FROM ANTECEDENTE
                    WHERE Id_escrito = @IdEscrito AND documento = 'SI'
                    ORDER BY Id_antecedente DESC";
                // Obtiene el registro del petit segun coincida el id de escrito generado y que haya sido quien dio la alta (btn guardar)

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@IdEscrito", idEscrito);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new CedulaAntecedenteModel
                            {
                                IdEscrito = reader["ID_escrito"]?.ToString(),
                                Folio = reader["Folio"]?.ToString(),
                                LugarRecepcion = reader["lugar_hechos"]?.ToString(),
                                FechaRecepcion = (DateTime)(reader["Fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["Fecha_recepcion"])),
                                HoraRecepcion = (TimeSpan)(reader["Hora_recepcion"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)reader["Hora_recepcion"]),
                                Peticionario = reader["Peticionario"]?.ToString(),
                                Autoridad = reader["Autoridad"]?.ToString(),
                                Explicacion = reader["Explicacion"]?.ToString(),
                                Abogado = reader["Abogado"]?.ToString()?.ToUpper()
                                // Estos datos extraidos se utilizaran para hacer el llenado de campos en la rotativa - pdf de la alta

                            };
                        }
                    }
                }
            }

            return null;
        }

        // Cris y David 06 08 2025: Controlador que hace una peticion de busqueda de datos de la alta realizada en la tabla de aportacion
        private CedulaAportacionModel ObtenerDatosCedulaAportacion()
        {
            using (var conn = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                conn.Open();

                string sql = @"
                    SELECT TOP 1 Lugar_hechos, Fecha_recepcion, Hora_recepcion,
		                Autoridad, Peticionario, Explicacion, Abogado,Expediente
                    FROM APORTACION
                    ORDER BY Id_aportacion DESC";
                // Obtiene el registro del petit segun coincida el id de escrito generado y que haya sido quien dio la alta (btn guardar)

                using (var cmd = new SqlCommand(sql, conn))
                {
                    

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())  
                        {
                            return new CedulaAportacionModel
                            {
                                LugarRecepcion = reader["lugar_hechos"]?.ToString(),
                                FechaRecepcion = (DateTime)(reader["fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(reader["fecha_recepcion"])),
                                HoraRecepcion = (TimeSpan)(reader["Hora_recepcion"] == DBNull.Value ? (TimeSpan?)null : (TimeSpan)reader["Hora_recepcion"]),
                                Peticionario = reader["Peticionario"]?.ToString(),
                                Autoridad = reader["Autoridad"]?.ToString(),
                                Explicacion = reader["Explicacion"]?.ToString(),
                                Abogado = reader["Abogado"]?.ToString()?.ToUpper(),
                                Expediente = reader["Expediente"]?.ToString()?.ToUpper()
                                // Estos datos extraidos se utilizaran para hacer el llenado de campos en la rotativa - pdf de la alta

                            };
                        }
                    }
                }
            }

            return null;
        }


        // Yere 28 07 2025: Traidos desde el SS
        // David: Agregue algunas verificaciones antes del return 
        public IActionResult Cedula_Orientacion(string idescrito = null)
        {
            idescrito ??= TempData["idescritort"]?.ToString();
            

            if (string.IsNullOrEmpty(idescrito))
                return Content("No se recibió el ID del expediente.");
            // No le llego un id de expediente

            var datos = ObtenerDatosCedulaOrientacion(idescrito);
            // Almaceno en datos la informacion de la consulta en la tabla mediante el metodo descrito

            if (datos == null)
                return Content("No se encontraron datos para generar el PDF.");
            // Hubo un problema al consultar los datos en la tabla - algunos o tosos los campos estan vacios


            return new ViewAsPdf("CedulaOrientacion", datos)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado +
                                 " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " +
                                 rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }

            // Cris y David 05 08 2025: Segundo metodo aux para la visualizacion de rotativa - pdf. Verifica que haya un id de expediente, luego llama al metodo de busqeuda para traer el registro ed la tabla y armar el pdf
        public IActionResult Cedula_Remision(string idescrito = null)
        {
            idescrito ??= TempData["idescritort"]?.ToString();


            if (string.IsNullOrEmpty(idescrito))
                return Content("No se recibió el ID del expediente.");
                // No le llego un id de expediente

            var datos = ObtenerDatosCedulaRemision(idescrito);
            // Almaceno en datos la informacion de la consulta en la tabla mediante el metodo descrito

            if (datos == null)
                return Content("No se encontraron datos para generar el PDF.");
                // Hubo un problema al consultar los datos en la tabla - algunos o tosos los campos estan vacios

            return new ViewAsPdf("CedulaRemision", datos)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado +
                                 " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " +
                                 rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }

            // Cris y David 05 08 2025: Segundo metodo aux para la visualizacion de rotativa - pdf. Verifica que haya un id de expediente, luego llama al metodo de busqeuda para traer el registro ed la tabla y armar el pdf
        public IActionResult Cedula_Incompetencia(string idescrito = null)
        {
            idescrito ??= TempData["idescritort"]?.ToString();


            if (string.IsNullOrEmpty(idescrito))
                return Content("No se recibió el ID del expediente.");
            // No le llego un id de expediente

            var datos = ObtenerDatosCedulaIncompetencia(idescrito);
            // Almaceno en datos la informacion de la consulta en la tabla mediante el metodo descrito

            if (datos == null)
                return Content("No se encontraron datos para generar el PDF.");
            // Hubo un problema al consultar los datos en la tabla - algunos o tosos los campos estan vacios

            return new ViewAsPdf("CedulaIncompetencia", datos)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado +
                                 " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " +
                                 rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }

            // Cris y David 05 08 2025: Segundo metodo aux para la visualizacion de rotativa - pdf. Verifica que haya un id de expediente, luego llama al metodo de busqeuda para traer el registro ed la tabla y armar el pdf
        public IActionResult Cedula_Antecedente(string idescrito = null)
        {
            idescrito ??= TempData["idescritort"]?.ToString();


            if (string.IsNullOrEmpty(idescrito))
                return Content("No se recibió el ID del expediente.");
            // No le llego un id de expediente

            var datos = ObtenerDatosCedulaAntecedente(idescrito);
            // Almaceno en datos la informacion de la consulta en la tabla mediante el metodo descrito

            if (datos == null)
                return Content("No se encontraron datos para generar el PDF.");


            return new ViewAsPdf("CedulaAntecedente", datos)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado +
                                 " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " +
                                 rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }

            // Cris y David 05 08 2025: Segundo metodo aux para la visualizacion de rotativa - pdf. Verifica que haya un id de expediente, luego llama al metodo de busqeuda para traer el registro ed la tabla y armar el pdf
        public IActionResult Cedula_Aportacion()
        {

            var datos = ObtenerDatosCedulaAportacion();
            // No le llego un id de expediente

            if (datos == null)
                return Content("No se encontraron datos para generar el PDF.");
            // Hubo un problema al consultar los datos en la tabla - algunos o tosos los campos estan vacios

            return new ViewAsPdf("CedulaAportacion", datos)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado +
                                 " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " +
                                 rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }


        public ViewAsPdf BitCambios()
        {
            var pdfcedula = new List<CedulaBitacoraCambios>();
            CedulaBitacoraCambios pdfcbc = new CedulaBitacoraCambios();
            List<BitacoraCambio> bitcam = null;

            int? idex = (int?)TempData["idexped"];

            string rutaArchivo = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/Bitacora", idex + ".txt");
            if (System.IO.File.Exists(rutaArchivo))
            {
                string contenido = System.IO.File.ReadAllText(rutaArchivo);
                bitcam = JsonConvert.DeserializeObject<List<BitacoraCambio>>(contenido);
            }
            pdfcbc.id_queja= idex.ToString();
            pdfcbc.FechaHoraImpr= DateTime.Now;
            pdfcbc.biracambios = bitcam;
            pdfcedula.Add(pdfcbc);

            return new ViewAsPdf("Plantilla_Bitacora_de_Cambios_Con_Hechos", pdfcedula)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 5, Right = 5 },
                // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF + ".pdf"),
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html "+rutaencabezado1+" --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html "+rutapie1+" --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }

        public ViewAsPdf BitCambiosAportacion()
        {
            var pdfcedula = new List<CedulaBitacoraCambios>();
            CedulaBitacoraCambios pdfcbc = new CedulaBitacoraCambios();
            List<BitacoraCambio> bitcam = null;

            int? idAportacion = (int?)TempData["idAportacion"];

            string rutaArchivo = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/Archivos/BitacoraAportaciones",
                idAportacion + ".txt"
            );

            if (System.IO.File.Exists(rutaArchivo))
            {
                string contenido = System.IO.File.ReadAllText(rutaArchivo);
                bitcam = JsonConvert.DeserializeObject<List<BitacoraCambio>>(contenido);
            }

            pdfcbc.id_queja = idAportacion.ToString();
            pdfcbc.FechaHoraImpr = DateTime.Now;
            pdfcbc.biracambios = bitcam ?? new List<BitacoraCambio>();
            pdfcedula.Add(pdfcbc);

            return new ViewAsPdf("Plantilla_Bitacora_de_Cambios_Con_Hechos", pdfcedula)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 5, Right = 5 },
                // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF + ".pdf"),
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado1 + " --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html " + rutapie1 + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }




        public ActionResult ActualizaAceptados()
        {
            string[] idsacept = (string[])TempData["acep"];
            bool hayidsAceptados = (bool)TempData["hayidsAceptados"];
            if (hayidsAceptados)
            {
                for (int i = 0; i < idsacept.Length; i++)
                {
                    string queryupdatestatusext = "exec Sp_Update_Status_Expediente '" + idsacept[i] + "','7'";
                    int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);
                }
            }


            return Json(new { mensaje = "ok" });
        }

        public ActionResult ActualizaDatoscompementariosPetVAV(int idqueja,int status, int peticionario, string tipope)
        
        {
            int idq = idqueja, stat = status;

                    string queryupdatestatusext = "exec Sp_updateConfirmPet " + idqueja + ","+ status + "," + peticionario + ",'" + tipope + "'";
                    int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);

            return Json(new { mensaje = "ok" });
        }


        public IActionResult GenerarFormatoRechazo([FromBody] FormatoRechazoRequest model) // PDF Rechazado -Fred
        {
            if (model == null)
                return BadRequest();

            // Actualizar rechazados
            foreach (var obs in model.Observaciones)
            {
                string query = $"exec Sp_Update_Status_Expediente '{obs.IdExpediente}','8'";
                conexionsql.InsertUpdateDeleteRegresaid(query);
            }
            // si no hay observaciones -> solo aceptados
            if (model.Observaciones == null || model.Observaciones.Count == 0)
            {
                foreach (var id in model.IdsAceptados)
                {
                    string query = $"exec Sp_Update_Status_Expediente '{id}','7'";
                    conexionsql.InsertUpdateDeleteRegresaid(query);
                }

                return Json(new { soloAceptados = true });
            }
            // Obtener datos del Director(a) de Quejas
            string query_direct = @"SELECT TOP 1 * 
            FROM USUARIOS 
            WHERE ROL = 'ADMIN_DQOT' 
            AND CARGO_DOCUMENTOS LIKE '%DIRECTOR%'";
            var data_direct = GetDatosGeneral(query_direct);

            Usuario direct = null;
            foreach (DataRow rowDirect in data_direct.Rows)
            {
                direct = new Usuario
                {
                    Nombre = rowDirect["NOMBRE"].ToString().ToUpper(),
                    Ap = rowDirect["AP"].ToString().ToUpper(),
                    Am = rowDirect["AM"].ToString().ToUpper(),
                    GradoAcademico = rowDirect["GRADO_ACADEMICO"].ToString().ToUpper(),
                    CargoDocumentos = rowDirect["CARGO_DOCUMENTOS"].ToString().ToUpper()
                };
            }

            // Obtener Visitador General según la Visitaduría
            string query_visitador = @"SELECT TOP 1 * FROM USUARIOS WHERE FK_ID_AREA = '" + model.AreaId + @"'AND CARGO_DOCUMENTOS LIKE '%VISITADOR%'";

            var data_visitador = GetDatosGeneral(query_visitador);

            Usuario visitador = null;

            foreach (DataRow row in data_visitador.Rows)
            {
                visitador = new Usuario
                {
                    Nombre = row["NOMBRE"].ToString().ToUpper(),
                    Ap = row["AP"].ToString().ToUpper(),
                    Am = row["AM"].ToString().ToUpper(),
                    GradoAcademico = row["GRADO_ACADEMICO"].ToString().ToUpper(),
                    CargoDocumentos = row["CARGO_DOCUMENTOS"].ToString().ToUpper()
                };
            }

            //Obtener el area de la visitaduria
            string query_area = "exec Sp_GetDataAreas '" + model.AreaId + "'";
            var data_area = GetDatosGeneral(query_area);

            string nombreArea = "";

            foreach (DataRow row in data_area.Rows)
            {
                nombreArea = row["DESCRIPCION"].ToString().ToUpper();
            }

            // Construir PDF
            var pdfModel = new List<PDF_Formato_Rechazo>();

            PDF_Formato_Rechazo itemPdf = new PDF_Formato_Rechazo
            {
                Visitaduría = nombreArea,
                Memorandum = model.Memorandum,
                PrimeraParte = model.PrimeraParte,
                SegundaParte = model.SegundaParte,
                TerceraParte = model.TerceraParte,
                listado = model.Observaciones
                .Select(o => new listadoObservaciones(o.IdExpediente, o.Justificacion))
                .ToList(),
                DirectQuejas = direct,
                Visitador = visitador
            };


            pdfModel.Add(itemPdf);

            return new ViewAsPdf("verPDFRechazo", pdfModel)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 20, Right = 20 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado + " --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html " + rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }


        public ViewAsPdf InfoRecabadaDQOT() 
        {
            var pdfescritoi = new List<CedulaQuejas>();
            var pdfescritoipet = new List<CedulaQuejasPeticionario>();
            var pdfescritoiAHV = new List<CedulaQuejasautoridad>();

            int? idei = (int?)TempData["idescritort"];

            /*Primera parte*/
            string query = "exec Sp_regresa_DQOT_Cedula_DQOT " + idei;
            var data = GetDatosGeneral(query);
            foreach (DataRow row in data.Rows)
            {

                CedulaQuejas itemPdfei = new CedulaQuejas();
                itemPdfei.id_expediente = int.Parse(row["id_expediente"].ToString());
                itemPdfei.Via_interpos = row["viainter"].ToString();
                //idactac
                //idescrito
                itemPdfei.id_abogado_recibe = row["abogadorecibe"].ToString();
                itemPdfei.hechos = row["hechos"].ToString();
                itemPdfei.id_lugar_hechos = row["lugar_hechos"].ToString();
                itemPdfei.visitaduria = row["visitaduria"].ToString();
                itemPdfei.fecha_registro = row["fecha_registrro"].ToString();
                itemPdfei.fecha_turno_vg = row["fechaturnovisitaduria"].ToString();
                itemPdfei.id_sede = row["sede"].ToString();
                itemPdfei.observaciones = row["observaciones"].ToString();

                pdfescritoi.Add(itemPdfei);
            }
            /*Primera parte*/

            /*Segunda parte*/
            query = "exec Sp_regresa_peticionario_Cedula_DQOTQ " + idei;
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                CedulaQuejasPeticionario itemPdfei = new CedulaQuejasPeticionario();

                itemPdfei.id = int.Parse(row["ID_REGISTRO"].ToString());
                itemPdfei.tipopet = row["TIPO_USUARIO"].ToString();
                itemPdfei.nombrepet = row["nombre_completo"].ToString();

                pdfescritoipet.Add(itemPdfei);
            }
            /*Segunda parte*/


            /*Tercera parte */
            query = "exec Sp_regresa_AutHV_Cedula_DQOTQ " + idei;
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                CedulaQuejasautoridad itemPdfei = new CedulaQuejasautoridad();

                itemPdfei.idautoridad = row["ID_AUTORIDAD"].ToString();
                itemPdfei.ambito = row["AMBITO"].ToString();
                itemPdfei.nombre = row["autoridad"].ToString();

                pdfescritoiAHV.Add(itemPdfei);
            }
            /*Tercera parte */

            pdfescritoi[0].listpeti = pdfescritoipet;
            pdfescritoi[0].listaut = pdfescritoiAHV;


            return new ViewAsPdf("Plantilla_Datos_DQOT", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 10, Right = 10 },
                // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF + ".pdf"),
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html "+rutaencabezado1+" --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html "+rutapie1+" --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }

        public ViewAsPdf Cedulac()
        {
            // 0) Recupera y valida el id desde TempData
            // TempData se "consume" al leer; si necesitas que persista, usa TempData.Peek("idescritort")
            int? idei = TempData.ContainsKey("idescritort") ? (int?)TempData.Peek("idescritort") : null;

            if (!idei.HasValue || idei.Value <= 0)
            {
                // Decide el manejo: BadRequest, NotFound, o PDF con estado vacío
                // Aquí retorno un PDF con mensaje de “sin datos”
                var vacio = new List<cedulaCalificacion>
        {
            new cedulaCalificacion
            {
                Expediente = "N/D",
                hechos = "No se encontró información del expediente (id ausente o inválido).",
                listpet = new List<peticionariocedula>(),
                listauth = new List<authecCedula>(),
                listacasa = new List<SelectCausaC>() // 👈JM
            }
        };

                return new ViewAsPdf("Plantilla_Cedula_Calificacion", vacio)
                {
                    PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                    PageMargins = { Left = 5, Right = 5 },
                    CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado1 +
                                     " --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html " + rutapie1 +
                                     " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
                };
            }

            var pdfescritoi = new List<cedulaCalificacion>();
            var pdfescritoipet = new List<peticionariocedula>();
            var pdfescritoiAHV = new List<authecCedula>();
            var pdfescritoconclu = new List<SelectCausaC>(); // 👈JM

            // 1) Primera parte
            string query = "exec Sp_regresa_DQOT_Cedula " + idei + ",'CALIFICACION'";
            var data = GetDatosGeneral(query);

            if (data != null && data.Rows.Count > 0)
            {
                foreach (DataRow row in data.Rows)
                {
                    var itemPdfei = new cedulaCalificacion
                    {
                        Expediente = row["expediente"].ToString(),
                        fecha_Hora_registro = row["fecha_registrro"].ToString(),
                        fecha_RFV = row["fecharecepfis"].ToString(),
                        VIA_ENTRADA = row["viainter"].ToString(),
                        materia = row["materia"].ToString(),
                        lugar_Hechos = row["lugar_hechos"].ToString(),
                        fecha_Hora_turnoe = row["fechaturnovisitaduriaelectronico"].ToString(),
                        fecha_TA = row["fechaturnoabogadovg"].ToString(),
                        fecha_calificacion = row["fecha_calificacion"].ToString(),
                        programa = row["programa"].ToString(),
                        id = int.TryParse(row["id_expediente"]?.ToString(), out var idExp) ? idExp : 0,
                        visitaduría = row["visitaduria"].ToString(),
                        abogado = row["abogado"].ToString(),
                        visitador = row["visitador"].ToString(),
                        hechos = row["hechos"].ToString(),
                        // Inicializa las listas para no tener nulls
                        listpet = new List<peticionariocedula>(),
                        listauth = new List<authecCedula>(),
                        listacasa = new List<SelectCausaC>() // 👈JM
                    };

                    pdfescritoi.Add(itemPdfei);
                }
            }

            // 2) Segunda parte
            query = "exec Sp_regresa_peticionario_Cedula " + idei + ",'CALIFICACION'";
            data = GetDatosGeneral(query);

            if (data != null && data.Rows.Count > 0)
            {
                foreach (DataRow row in data.Rows)
                {
                    var item = new peticionariocedula
                    {
                        id = int.TryParse(row["ID_REGISTRO"]?.ToString(), out var idReg) ? idReg : 0,
                        tipopet = row["TIPO_USUARIO"].ToString(),
                        nombrepet = row["nombre_completo"].ToString()
                    };
                    pdfescritoipet.Add(item);
                }
            }

            // 3) Tercera parte
            query = "exec Sp_regresa_AutHV_Cedula " + idei + ",'CALIFICACION'";
            data = GetDatosGeneral(query);

            if (data != null && data.Rows.Count > 0)
            {
                foreach (DataRow row in data.Rows)
                {
                    var item = new authecCedula
                    {
                        autoridad = row["AUTORIDAD"].ToString(),
                        HV = row["MATERIA"].ToString(),
                        DH = row["DESDH"].ToString()
                    };
                    pdfescritoiAHV.Add(item);
                }
            }

            // 🌟 3.5) Carga de Conclusiones mapeado a SelectCausaC

            /*🌟 3.5*/
            query = "exec Sp_regresa_causac_Cedula " + idei + ",'CALIFICACION'"; ;
            data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                SelectCausaC itemPdfei = new SelectCausaC(0, row["fechaa"].ToString(), row["causaa"].ToString(), row["conclusion"].ToString(), row["actorest"].ToString(), row["observar"].ToString());


                pdfescritoconclu.Add(itemPdfei);
            }
            /*🌟 3.5*/
            if (pdfescritoi.Count == 0)
            {
                pdfescritoi.Add(new cedulaCalificacion());
            }

            pdfescritoi[0].listpet = pdfescritoipet;
            pdfescritoi[0].listauth = pdfescritoiAHV;
            pdfescritoi[0].listacasa = pdfescritoconclu;

            // 4) Garantiza que exista al menos un elemento en pdfescritoi
            var primero = EnsureFirst(pdfescritoi);

            // 5) Asignaciones seguras
            primero.listpet = pdfescritoipet ?? new List<peticionariocedula>();
            primero.listauth = pdfescritoiAHV ?? new List<authecCedula>();
            primero.listacasa = pdfescritoconclu ?? new List<SelectCausaC>(); // 👈JM

            // 6) Render del PDF
            return new ViewAsPdf("Plantilla_Cedula_Calificacion", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 5, Right = 5 },
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado1 +
                                 " --header-spacing 15 --margin-bottom 3cm --footer-spacing 7 --footer-html " + rutapie1 +
                                 " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "
            };
        }

        private static cedulaCalificacion EnsureFirst(List<cedulaCalificacion> lista)
        {
            if (lista == null)
                lista = new List<cedulaCalificacion>();

            if (lista.Count == 0)
                lista.Add(new cedulaCalificacion
                {
                    // Inicializa para evitar nulls en la vista
                    Expediente = "N/D",
                    hechos = "Sin datos disponibles.",
                    listpet = new List<peticionariocedula>(),
                    listauth = new List<authecCedula>()
                });

            return lista[0];
        }

        public ViewAsPdf Escrito_Inicial_de_Queja()
        {
            
            var pdfescritoi = new List<PDF_Escrito_Inical>();

            string query_petiexp = "";
            string query_lugar = "";
            string query_enlaceea = "";
            string query_uploads = "";

            int? idei = (int?)TempData["idescritort"];
            string query = "exec Sp_Pdfescritoinicial " + idei;
            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                PDF_Escrito_Inical itemPdfei = new PDF_Escrito_Inical();
                itemPdfei.Id = Convert.ToInt32(row["id_escritoidq"]);
                itemPdfei.IdQueja = Convert.ToInt32(row["id_queja"]);
                itemPdfei.FechaHechos = Convert.ToDateTime(row["fecha_Hechos"]);
                itemPdfei.CircuntanciasHechos = (row["circuntancias_Hechos"]).ToString();
                itemPdfei.fechactual = DateTime.Now;

                // Quejosos y agraviados ligados a este escrito
                List<RegRecepcion> peticionariolist = new List<RegRecepcion>();
                query_petiexp = "exec Sp_Pdfescritoinicial_pet " + "'" + Convert.ToInt32(row["id_Peticionario"]) + "'";
                var data_petiexp = GetDatosGeneral(query_petiexp);

                foreach (DataRow row_petiexp in data_petiexp.Rows)
                {
                    RegRecepcion peticionario = new RegRecepcion();
                    peticionario.IdRegistro = Convert.ToInt32(row_petiexp["ID_REGISTRO"]);
                    peticionario.Nombre = (row_petiexp["NOMBRE"]).ToString();
                    peticionario.ApellidoPat = (row_petiexp["APELLIDO_PAT"]).ToString();
                    peticionario.ApellidoMat = (row_petiexp["APELLIDO_MAT"]).ToString();
                    peticionariolist.Add(peticionario);
                }

                // Lugares ligados a este escrito
                List<PDF_Lugarhechos> lugareslist = new List<PDF_Lugarhechos>();
                query_lugar = "exec Sp_Pdfescritoinicial_lughe " + "'" + Convert.ToInt32(row["id_lugar_hechos"]) + "'";
                var data_lugares = GetDatosGeneral(query_lugar);

                foreach (DataRow row_lugei in data_lugares.Rows)
                {
                    PDF_Lugarhechos itemlugei = new PDF_Lugarhechos();
                    itemlugei.estado = (row_lugei["ESTADO"]).ToString();
                    itemlugei.municipio = (row_lugei["MUNICIPIO"]).ToString();
                    itemlugei.calle = (row_lugei["calle"]).ToString();
                    itemlugei.num_ext = (row_lugei["numero_ext"]).ToString();
                    itemlugei.num_int = (row_lugei["numero_int"]).ToString();
                    itemlugei.cp = Convert.ToInt32(row_lugei["CP"]);
                    itemlugei.colonia = (row_lugei["colonia"]).ToString();
                    lugareslist.Add(itemlugei);
                }

                // Autoridades ligados a este escrito
                List<PDF_Autoridadesei> autoridadeslist = new List<PDF_Autoridadesei>();
                query_enlaceea = "exec Sp_Pdfescritoinicial_autoridades " + "'" + Convert.ToInt32(row["id_escritoidq"]) + "'";
                var data_auei = GetDatosGeneral(query_enlaceea);

                foreach (DataRow row_auei in data_auei.Rows)
                {
                    PDF_Autoridadesei itemauei = new PDF_Autoridadesei();
                    itemauei.autoridad = (row_auei["AUTORIDAD"]).ToString();
                    itemauei.cargo_persona = (row_auei["CARGO_PERSONA"]).ToString();
                    itemauei.nombre_persona = (row_auei["NOMBRE_PERSONA"]).ToString();
                    autoridadeslist.Add(itemauei);
                }


                // Archivos adjuntos ligados a este escrito
                List<EnlaceArchivoadjuntoEscritoi> uploadslist = new List<EnlaceArchivoadjuntoEscritoi>();
                query_uploads = "exec Sp_Pdfescritoinicial_uploads " + "'" + Convert.ToInt32(row["id_escritoidq"]) + "'";
                var data_uploads = GetDatosGeneral(query_uploads);

                foreach (DataRow row_upload in data_uploads.Rows)
                {
                    EnlaceArchivoadjuntoEscritoi itemupload = new EnlaceArchivoadjuntoEscritoi();
                    itemupload.RutaArchivo = (row_upload["RUTA_ARCHIVO"]).ToString();
                    uploadslist.Add(itemupload);
                }

                itemPdfei.reg_recepcion = peticionariolist;
                itemPdfei.lugar_hechos = lugareslist;
                itemPdfei.enlace_ea = autoridadeslist;
                itemPdfei.uploadsei = uploadslist;

                pdfescritoi.Add(itemPdfei);
            }

            //return Content("PDF saved successfully");
            var nombrePDF = "Escrito_I_" + idei;
            return new ViewAsPdf("VerPDF", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
               // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF+".pdf"),<----Error en El servidor
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html "+rutaencabezado+" --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html "+rutapie+" --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }




        // Inicio Buscardor Formatos
        public ActionResult UpdateComPetExpQujoso(IFormCollection form)
        {

            string idqueja = form["id_queja"].ToString();
            string idscomplementos = form["ids_complementos"].ToString();
            string[] idscomp = idscomplementos.Split(',');
            string query = "";
            bool resp = false;

            foreach (var id in idscomp)
            {
                query = "UPDATE COMPLEMENTO_PETICIONARIO SET ID_EXPEDIENTE = '" + idqueja + "' WHERE ID_COMPLEMENTO_PETICIONARIO = " + "'" + id + "'";
                resp = conexionsql.InsertUpdateDelete(query);
            }

            return Json(new { data = resp });
        }
        public ActionResult BuscardorFormatos(IFormCollection form)
        {
            string idqueja = form["txt_idqueja"].ToString();
            string curp = form["txt_idpet"].ToString();
            string nom_peticionario = form["txt_nombrepet"].ToString();
            string ap_peticionario = form["txt_appet"].ToString();
            string am_peticionario = form["txt_ampet"].ToString();
            string via_interposicion = form["txt_via"].ToString();
            string estatus_queja = form["txt_EstQueja"].ToString();
            string fecha_reg = form["txt_fecha"].ToString();
            string rolabogado = form["txt_abogado"].ToString();
            string rolabogadodesc = form["txt_abogado_rol"].ToString();
            string estatusFormatos = "";

            List<TablaBusquedaFormatos> listformatos = new List<TablaBusquedaFormatos>();
            List<TblActac> arreglo_actac = new List<TblActac>();
            string query = "";
            if (rolabogadodesc == "VA_DQOT")
            {
                query = "exec Sp_Select_Formatos_Queja_VADQOT '" + nom_peticionario + "' ,'" + ap_peticionario + "' ,'" + am_peticionario + "', '" + curp + "', '" + idqueja + "','" + via_interposicion + "','" + estatus_queja + "','" + fecha_reg + "'," + rolabogado + "";
            }
            else
            {
                query = "exec Sp_Select_Formatos_Queja '" + nom_peticionario + "' ,'" + ap_peticionario + "' ,'" + am_peticionario + "', '" + curp + "', '" + idqueja + "','" + via_interposicion + "','" + estatus_queja + "','" + fecha_reg + "'";
            }

            String query_petiexp = "";
            String query_actasc = "";
            String query_turnoexp = "";
            String query_escritosi = "";

            // 1. Traemos los 1,326 registros principales de golpe
            var data = GetDatosGeneral(query);

            // 🚀 OPTIMIZACIÓN ULTRA: Traer catálogos o subconsultas globales si es carga inicial 
            // (Esto evita que tu servidor muera haciendo 10,000 viajes a la BD)

            foreach (DataRow row in data.Rows)
            {
                TablaBusquedaFormatos itemformatos = new TablaBusquedaFormatos();
                int idExpedienteActual = Convert.ToInt32(row["ID_EXPEDIENTE"]);

                itemformatos.FkExpediente = idExpedienteActual;
                itemformatos.Nombre_agraviado = (row["NOMBRE_COMPLETO"]).ToString();

                // OBTENER DATOS COMPLEMENTARIOS
                query = "exec Sp_carga_informacion_Complementaria '" + idExpedienteActual + "'";
                string query1 = "exec Sp_carga_informacion_Complementaria_peticionario '" + idExpedienteActual + "'";
                string query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + idExpedienteActual + "'";
                string mensaje = "";
                itemformatos.informacioncomplementaria = conexionsql.datoscomplementarios(query, ref mensaje, query1, query2);

                // Quejosos y agraviados ligados a esta queja
                query_petiexp = "exec Sp_GetDataPeticionarioXExp " + "'" + idExpedienteActual + "'";
                var data_petiexp = GetDatosGeneral(query_petiexp);

                List<DatosEditPeticionario> peticionariolist = new List<DatosEditPeticionario>();
                List<DatosEditPeticionario> peticionariolistactac = new List<DatosEditPeticionario>();

                foreach (DataRow row_petiexp in data_petiexp.Rows)
                {
                    DatosEditPeticionario peticionario = new DatosEditPeticionario();
                    peticionario.IdComplementoPeticionario = Convert.ToInt32(row_petiexp["ID_COMPLEMENTO_PETICIONARIO"]);
                    peticionario.FkRegRecepcion = Convert.ToInt32(row_petiexp["FK_REG_RECEPCION"]);

                    if ((row_petiexp["TIPO_USUARIO"]).ToString() == "Peticionario")
                    { peticionario.Nombre = "(Q)" + (row_petiexp["NOMBRE"]).ToString(); }
                    else
                    { peticionario.Nombre = "(A)" + (row_petiexp["NOMBRE"]).ToString(); }

                    peticionario.ApellidoPat = (row_petiexp["APELLIDO_PAT"]).ToString();
                    peticionario.ApellidoMat = (row_petiexp["APELLIDO_MAT"]).ToString();
                    peticionario.TipoUsuario = (row_petiexp["TIPO_USUARIO"]).ToString();

                    query = "exec Sp_GetDataPeticionarioxIdComp " + "'" + peticionario.IdComplementoPeticionario + "'";
                    var dataPet = GetDatosGeneral(query);
                    peticionario.lPeticionario = ObtenerlistPeticionario(dataPet);
                    peticionariolist.Add(peticionario);
                }

                var query_petiexp1 = "exec Sp_GetDataPetiXExpCruceActaC " + "'" + idExpedienteActual + "'";
                var data_petiexpactac = GetDatosGeneral(query_petiexp1);

                foreach (DataRow row_petiexp in data_petiexpactac.Rows)
                {
                    DatosEditPeticionario listaselectmodalactac = new DatosEditPeticionario();
                    listaselectmodalactac.IdComplementoPeticionario = Convert.ToInt32(row_petiexp["ID_COMPLEMENTO_PETICIONARIO"]);
                    listaselectmodalactac.FkRegRecepcion = Convert.ToInt32(row_petiexp["FK_REG_RECEPCION"]);

                    if ((row_petiexp["TIPO_USUARIO"]).ToString() == "Peticionario")
                    { listaselectmodalactac.Nombre = "(Q)" + (row_petiexp["NOMBRE"]).ToString(); }
                    else
                    { listaselectmodalactac.Nombre = "(A)" + (row_petiexp["NOMBRE"]).ToString(); }

                    listaselectmodalactac.ApellidoPat = (row_petiexp["APELLIDO_PAT"]).ToString();
                    listaselectmodalactac.ApellidoMat = (row_petiexp["APELLIDO_MAT"]).ToString();
                    listaselectmodalactac.TipoUsuario = (row_petiexp["TIPO_USUARIO"]).ToString();

                    query = "exec Sp_GetDataPeticionarioxIdCompACTAC " + "'" + listaselectmodalactac.IdComplementoPeticionario + "'";
                    var dataPet = GetDatosGeneral(query);
                    listaselectmodalactac.lPeticionario = ObtenerlistPeticionario(dataPet);
                    peticionariolistactac.Add(listaselectmodalactac);
                }

                // Agregar Escrito inicial
                query_escritosi = "exec Sp_GetDataEscritoixExp " + "'" + idExpedienteActual + "'";
                var data_escritosi = GetDatosGeneral(query_escritosi);
                List<TblEscritoi> listEscritoi = new List<TblEscritoi>();
                foreach (DataRow row_actac in data_escritosi.Rows)
                {
                    TblEscritoi escritoiItem = new TblEscritoi();
                    escritoiItem.IdEscrito = (Convert.ToInt32(row_actac["ID_ESCRITOI"]));
                    escritoiItem.Nombre_petligadoei = (row_actac["NOMBRE_COMPLETOEI"]).ToString();
                    escritoiItem.Idcomplementopetei = (row_actac["Fk_IdComplementoPet"]).ToString();

                    query = "exec Sp_Regresa_Escrito_Inicial_Queja_Edición " + Convert.ToInt32(row_actac["ID_ESCRITOI"]);
                    var dataEscIni = GetDatosGeneral(query);
                    escritoiItem.lEscritoI = ObtenerlistEscriIni(dataEscIni);
                    listEscritoi.Add(escritoiItem);
                }

                //Agregar actas circunstanciadas
                query_actasc = "exec Sp_GetDataActacxExp " + "'" + idExpedienteActual + "'";
                var data_actascir = GetDatosGeneral(query_actasc);
                List<TblActac> listActasc = new List<TblActac>();

                foreach (DataRow row_actac in data_actascir.Rows)
                {
                    TblActac actacItem = new TblActac();
                    actacItem.IdActac = (Convert.ToInt32(row_actac["ID_ACTAC"]));
                    actacItem.Nombre_petligado = (row_actac["NOMBRE_COMPLETO"]).ToString();
                    actacItem.status = GetDataActaCircunstanciadaa(actacItem.IdActac);
                    listActasc.Add(actacItem);
                }

                // Agregar datos de turno
                query_turnoexp = "exec Sp_GetDataTurnoExp " + "'" + idExpedienteActual + "'";
                var data_turnoexp = GetDatosGeneral(query_turnoexp);
                List<ExpedienteTurnoModificado> listTurnoexp = new List<ExpedienteTurnoModificado>();

                foreach (DataRow row_turnoexp in data_turnoexp.Rows)
                {
                    ExpedienteTurnoModificado turnoexpItem = new ExpedienteTurnoModificado();
                    turnoexpItem.IdExpediente = (row_turnoexp["id_expediente"]).ToString();

                    if (!string.IsNullOrEmpty((row_turnoexp["fechaturnovisitaduria"]).ToString()))
                    { turnoexpItem.Fechaturnovisitaduria = Convert.ToDateTime(row_turnoexp["fechaturnovisitaduria"]); }
                    else
                    { turnoexpItem.Fechaturnovisitaduria = Convert.ToDateTime("1900-01-01 10:00:00 PM"); }

                    if (!string.IsNullOrEmpty((row_turnoexp["fechaturnovisitaduriaelectronico"]).ToString()))
                    { turnoexpItem.Fechaturnovisitaduriaelectronico = Convert.ToDateTime(row_turnoexp["fechaturnovisitaduriaelectronico"]); }
                    else
                    { turnoexpItem.Fechaturnovisitaduriaelectronico = Convert.ToDateTime("1900-01-01 10:00:00 PM"); }

                    if (!string.IsNullOrEmpty((row_turnoexp["clavevisitaduria"]).ToString()))
                    { turnoexpItem.Clavevisitaduria = (Convert.ToInt32(row_turnoexp["clavevisitaduria"])); }
                    else { turnoexpItem.Clavevisitaduria = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["claveabogadoturnado"]).ToString()))
                    { turnoexpItem.Claveabogadoturnado = (Convert.ToInt32(row_turnoexp["claveabogadoturnado"])); }
                    else { turnoexpItem.Claveabogadoturnado = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["fecharecepfis"]).ToString()))
                    { turnoexpItem.Fecharecepfis = Convert.ToDateTime(row_turnoexp["fecharecepfis"]); }
                    else { turnoexpItem.Fecharecepfis = Convert.ToDateTime("1900-01-01 10:00:00 PM"); }

                    if (!string.IsNullOrEmpty((row_turnoexp["descripcion"]).ToString()))
                    { turnoexpItem.Txtvisitaduria = (row_turnoexp["descripcion"]).ToString(); }
                    else { turnoexpItem.Txtvisitaduria = "No"; }

                    if (!string.IsNullOrEmpty((row_turnoexp["fk_memorandum"]).ToString()))
                    { turnoexpItem.FkMemorandum = (Convert.ToInt32(row_turnoexp["fk_memorandum"])); }
                    else { turnoexpItem.FkMemorandum = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["num_fojas"]).ToString()))
                    { turnoexpItem.NumFojas = (Convert.ToInt32(row_turnoexp["num_fojas"])); }
                    else { turnoexpItem.NumFojas = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["observaciones"]).ToString()))
                    { turnoexpItem.Txtvisitaduria = (row_turnoexp["observaciones"]).ToString(); }
                    else { turnoexpItem.Txtvisitaduria = "No"; }

                    if (!string.IsNullOrEmpty((row_turnoexp["NUM_MEMORANDUM"]).ToString()))
                    { turnoexpItem.memorandum = (row_turnoexp["NUM_MEMORANDUM"]).ToString(); }
                    else { turnoexpItem.memorandum = "No"; }

                    if (!string.IsNullOrEmpty((row_turnoexp["FECHA_FIN_DQOT"]).ToString()))
                    { turnoexpItem.FechaFinDqot = Convert.ToDateTime(row_turnoexp["FECHA_FIN_DQOT"]); }
                    else { turnoexpItem.FechaFinDqot = Convert.ToDateTime("1900-01-01 10:00:00 PM"); }

                    listTurnoexp.Add(turnoexpItem);
                }

                if (!row.IsNull("fecha_registrro"))
                { itemformatos.FechaRegistro = Convert.ToDateTime(row["fecha_registrro"]); }

                itemformatos.VIA_INTERPOSICION = (row["VIA_INTERPOSICIÓN"]).ToString();
                itemformatos.Status_Expediente = (row["STATUS_EXP"]).ToString();

                itemformatos.AgravQuej = peticionariolist;
                itemformatos.ActaCa = listActasc;
                itemformatos.Escritoia = listEscritoi;
                itemformatos.ExpedienteTurno = listTurnoexp;
                itemformatos.AgravQuejactac = peticionariolistactac;

                listformatos.Add(itemformatos);
            }

            return Json(new { data = listformatos });
        }

        //public ActionResult GuarDil(IFormCollection form)
        //{
        //    string viaDil = "0";
        //    string noOfMe = "";
        //    string Fecha_Soli = "";
        //    string plazo = "";
        //    string Fecha_Recib = "";
        //    string atentido = "";
        //    if (form["tipodil"].ToString() != "3")
        //    {
        //        viaDil = form["viaDil"].ToString();
        //        noOfMe = form["noOfMe"].ToString();
        //        Fecha_Soli = form["Fecha_Soli"].ToString();
        //        plazo = form["plazo"].ToString();
        //        Fecha_Recib = form["Fecha_Recib"].ToString();
        //        atentido = form["atentido"].ToString();
        //    }

        //    string query = "exec Sp_insertTblDil " + form["idqueja"].ToString() + ",'"+ form["tipodil"].ToString() + "', '"+ form["descripcion"].ToString() + "', '"+ form["fecEm"].ToString() + "', '"+ noOfMe + "', '"+ plazo + "', '', "+ form["fila"].ToString() + ", 0, 0, "+ viaDil + ", '"+ Fecha_Recib + "', '', '"+ Fecha_Soli + "', '"+ form["descEvi"].ToString() + "'";

        //    return Json(new { data = ejecutaInsertUpdate( query) });
        //}

        public ActionResult TurnoAbogado(int idqueja, int idabogado)
        {
            var status = "";
            string query = "";
            bool statusresp = false;

            query = "exec sp_update_turnoabogado " + idqueja + "," + idabogado;
            int idenlacequeja = conexionsql.InsertUpdateDeleteRegresaid(query);

            string queryupdatestatusext = "exec Sp_Update_Status_Expediente " + idqueja + ",'11'";
            int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);
            if (idenlacequeja > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }


            return Json(new { estatus = statusresp });

        }

        [HttpPost]
        public ActionResult listadovisitadorGeneral(int vis, int idabogado)
        {
            int visitaduria = vis;
            int idAbogado = idabogado;

            string rolUsuario = "";

            string queryRol = "SELECT ROL FROM USUARIOS WHERE ID_USUARIO = " + idAbogado;
            rolUsuario = conexionsql.ObtenerReader(queryRol);

            // 🔥 LÓGICA POR ROL
            if (rolUsuario == "ADMIN_DQOT_ESPECIAL")
            {
                // 👑 ADMIN → no tocar nada  -JM
            }
            else if (rolUsuario.Contains("VG"))
            {
                // 🏢 VISITADOR GENERAL → filtra por visitaduría -JM
                idAbogado = 0;
            }
            else if (rolUsuario == "VAV")
            {
                // 👤 ABOGADO → filtra por abogado -JM
                visitaduria = 0;
            }


            List<TablaGenerica> listformatos = new List<TablaGenerica>();
            List<selectGenerico> listformatos1 = new List<selectGenerico>();
            List<TblActac> arreglo_actac = new List<TblActac>();
            String query = "exec Sp_Select_id_turnados_vgs " + visitaduria + " ," + idAbogado + "";
            var data = GetDatosGeneral(query);
            foreach (DataRow row in data.Rows)
            {
                TablaGenerica itemformatos = new TablaGenerica();
                //itemformatos.IdUnionFormatosQueja = Convert.ToInt32(row["ID_UNION_FORMATOS_QUEJA"]);
                itemformatos.Id = Convert.ToInt32(row["id_expediente"]);
                itemformatos.Expediente = row["expediente"].ToString();
                itemformatos.FechaTurno = (row["fechaturnovisitaduria"]).ToString();
                itemformatos.FechaRecep= (row["fecharecepfis"]).ToString(); 
                itemformatos.Status = (row["status"]).ToString();
                itemformatos.otro = (row["abogadot"]).ToString();
                #region FechaRecep
                if ((row["fecharecepfis"]).ToString() != "")
                {
                    itemformatos.FechaRecep = (row["fecharecepfis"]).ToString();
                }
                else 
                {
                    itemformatos.FechaRecep = "<div class=\"badge status-badge\" style=\"background-color:#c06500;color:white;\">Sin Fecha de Recepción</div >";
                }
                if ((row["fechaturnovisitaduriaelectronico"]).ToString() != "")
                {
                   //itemformatos.FechaRecep = (row["fechaturnovisitaduriaelectronico"]).ToString();
                }
                else
                {
                    //itemformatos.FechaRecep = "<div class=\"badge status-badge\" style=\"background-color:#c06500;color:white;\">Sin Fecha de Recepción</div >";
                }
                #endregion
                #region FechaCalific
                if ((row["fecha_calificacion"]).ToString() != "")
                {
                    itemformatos.FechaCalific = (row["fecha_calificacion"]).ToString();
                }
                else
                {
                    itemformatos.FechaCalific = "<div class=\"badge status-badge\" style=\"background-color:#c06500;color:white;\">Sin Fecha de Calificación</div >";
                }
                #endregion
                #region FechaTunAbo
                if ((row["fechaturnoabogadovg"]).ToString() != "")
                {
                    itemformatos.FechaTunAbo = (row["fechaturnoabogadovg"]).ToString();
                }
                else
                {
                    itemformatos.FechaTunAbo = "<div class=\"badge status-badge\" style=\"background-color:#c06500;color:white;\">Sin Fecha de Turno Abogado</div >";
                }
                #endregion

                string paso = "";
                string mensaje = "";
                query = "EXEC Sp_GetPaso_ExpedienteSolo " + itemformatos.Id + "";
                paso = conexionsql.ObtenerReader(query);
                //CONCLUIDO
                query = "exec RegistrarConcluidos " + itemformatos.Id;
                itemformatos.Concluido = conexionsql.ObtenerReader(query);
                //FIN CONCLUIDO



                    if (itemformatos.FechaCalific.Contains("Sin"))
                    {
                        if (!itemformatos.FechaTunAbo.Contains("Sin"))
                        {
                            DateTime fechaUno = Convert.ToDateTime(itemformatos.FechaTunAbo);
                            DateTime fechaDos = DateTime.Now;
                            TimeSpan difFechas = fechaDos - fechaUno;
                            int diasTrans = difFechas.Days;
                            //SEMAFORO 1
                            query = "exec semaforo " + diasTrans + "," + 2 + "," + 4 + "," + 1;
                            itemformatos.semaforo1 = conexionsql.ObtenerReader(query) + "<small><strong> sin calificar</strong></small>";
                            //FIN SEMAFORO 1
                            //SEMAFORO 2
                            string resultado = "";
                            if (diasTrans < 0)
                            {
                                query = "exec semaforo " + 21 + "," + 10 + "," + 21 + "," + 1;
                                resultado = conexionsql.ObtenerReader(query).Replace("21", diasTrans.ToString());
                            }
                            else
                            {
                                query = "exec semaforo " + diasTrans + "," + 10 + "," + 21 + "," + 1;
                                resultado = conexionsql.ObtenerReader(query);
                            }

                            itemformatos.semaforo2 = resultado + "<small><strong> sin actuaciones</strong></small>";
                            //FIN SEMAFORO 2
                        }
                    }
                    else
                    {

                    if (paso == "Calificado"|| paso == "Concluido")
                    {
                        itemformatos.semaforo1 = "<div class=\"badge status-badge badge-success\">Calificado</div>";
                        itemformatos.semaforo2 = "<div class=\"badge status-badge badge-success\">Con Actuaciones</div>";
                    }
                    else
                    {
                        itemformatos.semaforo1 = "<div class=\"badge status-badge badge-success\">Calificado</div>";  //04-06-2026
                        itemformatos.semaforo2 = "<div class=\"badge status-badge badge-success\">Con Actuaciones</div>";
                    }
                    }
                    listformatos.Add(itemformatos);
                }

                switch (visitaduria)
                {
                    case 1:
                        query = "GET_ABOGADOS 'VAV','PVG'";
                        data = GetDatosGeneral(query);
                        break;
                    case 2:
                        query = "GET_ABOGADOS 'VAV','SVG'";
                        data = GetDatosGeneral(query);
                        break;
                    case 3:
                        query = "GET_ABOGADOS 'VAV','TVG'";
                        data = GetDatosGeneral(query);
                        break;
                    case 4:
                        query = "GET_ABOGADOS 'VAV','CVG'";
                        data = GetDatosGeneral(query);
                        break;
                    default:
                        break;

            }
            foreach (DataRow row in data.Rows)
            {
                selectGenerico itemformatos = new selectGenerico();

                // 🔥 VALIDAR COLUMNAS
                if (data.Columns.Contains("nombre"))
                {
                    itemformatos.s1 = row["nombre"].ToString();
                }
                else
                {
                    itemformatos.s1 = "SIN NOMBRE";
                }

                if (data.Columns.Contains("ID_USUARIO"))
                {
                    itemformatos.s2 = row["ID_USUARIO"].ToString();
                }
                else
                {
                    itemformatos.s2 = "0";
                }

                listformatos1.Add(itemformatos);
            }

            return Json(new { data = listformatos, data1 = listformatos1 });
        }
        // Fin Buscador Formatos

        // Lista
        // ciones
        [HttpPost]
        public ActionResult SelectExpeSC(int vis)
        {
            List<GeneralModel.Selectmaster> listaexsc = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_EXPED_SCON " + vis;
            string mensaje = "";
            listaexsc = conexionsql.selectMaestro(query, ref mensaje);

            if (listaexsc.Count > 0)
            {
                return Json(new { lisexsiconc = listaexsc });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin aportaciones

        // Fin Diligencias

        // Datos de un memorandum
        public ActionResult GetDataMemorandum(IFormCollection form)
        {
            string idqueja = form["idexpediente"].ToString();
            string num_memo = form["idmemo"].ToString();

            List<MemorandumModificado> listmemorandum = new List<MemorandumModificado>();
            List<Area> arreglo_areas = new List<Area>();
            List<Area> arreglo_areasdes = new List<Area>();
            List<Usuario> usuarios = new List<Usuario>();

            String query = "exec Sp_Select_Data_Memorandum '" + num_memo + "'";
            String query_areaor = "";
            String query_areades = "";
            String query_titularareades = "";
            String query_expxmemo = "";
            var data = GetDatosGeneral(query);


            foreach (DataRow row in data.Rows)
            {

                MemorandumModificado itemmemorandum = new MemorandumModificado();
                //itemformatos.IdUnionFormatosQueja = Convert.ToInt32(row["ID_UNION_FORMATOS_QUEJA"]);
                itemmemorandum.PkMemorandum = Int32.Parse(row["PK_MEMORANDUM"].ToString());
                itemmemorandum.NumMemorandum = (row["NUM_MEMORANDUM"]).ToString();
                itemmemorandum.FechaDeCreacion = Convert.ToDateTime(row["FECHA_DE_CREACION"]);

                // Datos de area origen memo
                query_areaor = "exec Sp_GetDataAreas " + "'" + Convert.ToInt32(row["FK_AREA_ORIGEN"]) + "'";
                var data_areaor = GetDatosGeneral(query_areaor);
                List<Area> areaorlist = new List<Area>();

                foreach (DataRow row_areaor in data_areaor.Rows)
                {
                    Area itemArea = new Area();
                    itemArea.IdArea = Convert.ToInt32(row_areaor["ID_AREA"]);
                    itemArea.Descripcion = (row_areaor["DESCRIPCION"]).ToString();
                    itemArea.Siglas = (row_areaor["SIGLAS"]).ToString();
                    areaorlist.Add(itemArea);
                }
                // Fin Datos de area origen memo

                // Datos de area destino memo
                query_areades = "exec Sp_GetDataAreas " + "'" + Convert.ToInt32(row["FK_AREA_DESTINATARIO"]) + "'";
                var data_areades = GetDatosGeneral(query_areades);
                List<Area> areadeslist = new List<Area>();

                foreach (DataRow row_areaor in data_areades.Rows)
                {
                    Area itemArea = new Area();
                    itemArea.IdArea = Convert.ToInt32(row_areaor["ID_AREA"]);
                    itemArea.Descripcion = (row_areaor["DESCRIPCION"]).ToString();
                    itemArea.Siglas = (row_areaor["SIGLAS"]).ToString();
                    areadeslist.Add(itemArea);
                }
                // Fin Datos de area destino memo

                // Agregar Titular de area
                query_titularareades = "exec Sp_GetDataUsuario " + "'" + Convert.ToInt32(row["fk_iduserdestinatario"]) + "'";
                var data_titulardes = GetDatosGeneral(query_titularareades);
                List<Usuario> listTitulardes = new List<Usuario>();

                foreach (DataRow row_tdes in data_titulardes.Rows)
                {
                    Usuario userItem = new Usuario();
                    userItem.IdUsuario = (Convert.ToInt32(row_tdes["ID_USUARIO"]));
                    userItem.Nombre = (row_tdes["NOMBRE"]).ToString();
                    userItem.Ap = (row_tdes["APELLIDO_PATERNO"]).ToString();
                    userItem.Am = (row_tdes["APELLIDO_MATERNO"]).ToString();
                    listTitulardes.Add(userItem);
                }
                // Fin Titular de area 

                // Agregar expedientes ligados a ese memo 
                query_expxmemo = "exec Sp_GetDataExpxmemo " + "'" + Convert.ToInt32(row["PK_MEMORANDUM"]) + "'";
                var data_expxmemo = GetDatosGeneral(query_expxmemo);
                List<ExpedienteTurno> listExpxmemo = new List<ExpedienteTurno>();

                foreach (DataRow row_tdes in data_expxmemo.Rows)
                {
                    ExpedienteTurno itemExp = new ExpedienteTurno();
                    itemExp.PkExpedienteTurno = (Convert.ToInt32(row_tdes["pk_expediente_turno"]));
                    itemExp.IdExpediente = (row_tdes["id_expediente"]).ToString();

                    if (!string.IsNullOrEmpty((row_tdes["num_fojas"]).ToString()))
                    { itemExp.NumFojas = (Convert.ToInt32(row_tdes["num_fojas"])); }
                    else { itemExp.NumFojas = 0; }

                    if (!string.IsNullOrEmpty((row_tdes["observaciones"]).ToString()))
                    { itemExp.Observaciones = (row_tdes["observaciones"]).ToString(); }
                    else { itemExp.Observaciones = "Ninguna"; }

                    listExpxmemo.Add(itemExp);
                }
                // Fin Agregar expedientes ligados a ese memo 

                itemmemorandum.lstArea = areaorlist;
                itemmemorandum.lstAreades = areadeslist;
                itemmemorandum.lstUsuario = listTitulardes;
                itemmemorandum.lstExpturnados = listExpxmemo;

                listmemorandum.Add(itemmemorandum);
            }

            return Json(new { data = listmemorandum });
        }
        // Fin Datos de un memorandum

        public static bool FechaVacio(DateTime? date)
        {
            return date == null ? true : false;
        }
        [HttpPost]
        public ActionResult UpdateConfirmaDQOT(int idqueja, string hechos, string lugar, string petic)
        {
            string query = "";
            query = "exec Sp_updateConfirmDQOT " + idqueja + ",'" + hechos + "','" + lugar + "','" + petic + "'";
            bool update = conexionsql.InsertUpdateDelete(query);

            return Json(new { estatus = update });
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
        // Fin Lista Escolaridad

        public ActionResult SelectMorales()
        {
            List<GeneralModel.Selectmaster> tipoMorales = new List<GeneralModel.Selectmaster>();
            String query = "exec Sp_Select_Morales";
            string mensaje = "";
            tipoMorales = conexionsql.selectMaestro(query, ref mensaje);

            if (tipoMorales.Count > 0)
            {
                return Json(new { tipomorales = tipoMorales });
            }
            else
            {
                return Json(new { tipomorales = "error" });
            }
        }

        // David 01 09 2025: Controlador nuevo: ejecuta un SP que hace un update en la columna de tipo_de_escrito dado el id de expediente
        [HttpPost]
        public JsonResult InsertarTipoEscrito(string idExpediente, string tipo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(idExpediente) || string.IsNullOrWhiteSpace(tipo))
                {
                    return Json(new { status = false, mensaje = "Parámetros inválidos." });
                }

                using (SqlConnection conn = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("Insert_tipo_escrito", conn);   // procedimiento almacenado creado
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID_EXPEDIENTE", idExpediente);
                    cmd.Parameters.AddWithValue("@TIPO_ESCRITO", tipo);

                    cmd.ExecuteNonQuery();
                }

                return Json(new { status = true });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, mensaje = ex.Message });
            }
        }

        // david 2/10/2025
        public ActionResult GuardarDatosPersonalesCedula(IFormCollection form, string nombreS, string Ipaccesible, string idComplemento, int index)
        {
            StringBuilder txtcontBuilder = new StringBuilder();
            string numFrm = form["numFrm"].ToString();
            //index++; /*PENDIENTE REVISAR ASIGNACION 20 10 2025*/
            //int numFrm = index;
            //int numFrm = 1;
            Console.WriteLine("Este es el num de index: "); Console.WriteLine(numFrm);
            string idcomplementopet;
            if (!string.IsNullOrWhiteSpace(idComplemento))
            {
                idcomplementopet = idComplemento;
            }
            else
            {
                idcomplementopet = form["idcomplementopet" + numFrm].ToString();
            }
            //string idcomplementopet = form["idcomplementopet" + numFrm].ToString();
            //string idcomplementopet = idComplemento;
            string idreg_recepcion = form["idpeticionarioi" + numFrm].ToString();
            string id_queja = form["idquejagenerado"].ToString();
            string VersionComplemento = "";
            if (form["versioncomplementopeticionario"].Count > 0)
            {
                VersionComplemento = form["versioncomplementopeticionario"].ToString();
                Console.WriteLine($"VersionComplemento: {VersionComplemento}");  // Imprimir el valor para verificar
            }
            else
            {
                Console.WriteLine("No se encontró la clave versioncomplementopeticionario en el formulario");
            }


            string tipoMod = "";
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
            string tipo_persona = "Física";
            string tipouser = form["qatu_petit-frmDatosPersonales" + numFrm].ToString();
            string curp = form["CURP_petit-frmDatosPersonales" + numFrm].ToString().ToUpper();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            if (curp == "NO PROPORCIONADO" && apellidop == "No Proporcionado" && apellidom == "No Proporcionado" && nombreS != null)
            {
                nombre = nombreS;
                tipo_persona = "Moral";
            }
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
            int idSexo = 3;
            if (form["radsexo_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idSexo = int.Parse(form["radsexo_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string genero = form["genero_petit-frmDatosPersonales" + numFrm].ToString();
            string otroGenero = form["ogenero_petit-frmDatosPersonales" + numFrm].ToString();
            int idEscolaridad = 14;
            if (form["escosel_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idEscolaridad = int.Parse(form["escosel_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idEstadoconyugal = 8;
            if (form["econyugal_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idEstadoconyugal = int.Parse(form["econyugal_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idOcupacion = 9;
            if (form["ocupacion_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idOcupacion = int.Parse(form["ocupacion_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string Otraocupacion = form["ocupacioninpt_petit-frmDatosPersonales" + numFrm].ToString();
            string nacionalidad = form["chknacionalidad_petit-frmDatosPersonales" + numFrm].ToString();
            string sabeleer = form["chksleer_petit-frmDatosPersonales" + numFrm].ToString();
            int idDiscapacidad = 7;
            if (form["discapacidad_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idDiscapacidad = int.Parse(form["discapacidad_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idGruposocial = 9;
            if (form["gsoci_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idGruposocial = int.Parse(form["gsoci_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string otroGruposocial = form["gsociinpt_petit-frmDatosPersonales" + numFrm].ToString();
            string idLenguaindigena = form["leindi_petit-frmDatosPersonales" + numFrm].ToString();
            string otraLenguaindigena = form["oleindi_petit-frmDatosPersonales" + numFrm].ToString();
            string fechanac = form["fenac_petit-frmDatosPersonales" + numFrm].ToString();
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

            ///

            var queryPeticionario = "";
            String query = "";
            int idPetit = 0;

            List<RegRecepcion> peticionariolist = new List<RegRecepcion>();
            List<ComplementoPeticionario> complPeticionariolist = new List<ComplementoPeticionario>();

            if (curp != "" && curp != "No proporcionado" && curp != "NO PROPORCIONADO")
            {
                Console.WriteLine("11");
                queryPeticionario = "EXEC Sp_GetPeticionarioc " + "'" + curp + "'";
            }
            else
            {
                Console.WriteLine("22");
                queryPeticionario = "EXEC Sp_GetPeticionariocXNombre " + "'" + nombre + "'," + "'" + apellidop + "'," + "'" + apellidom + "'";
            }

            var data_abog_dqot = GetDatosGeneral(queryPeticionario);
            foreach (DataRow row in data_abog_dqot.Rows)
            {
                RegRecepcion userItem = new RegRecepcion();
                userItem.IdRegistro = Convert.ToInt32(row["ID_REGISTRO"]);
                userItem.Nombre = (row["NOMBRE"].ToString());
                userItem.ApellidoPat = (row["APELLIDO_PAT"].ToString());
                userItem.ApellidoMat = (row["APELLIDO_MAT"].ToString());
                userItem.DocIdentificatorio = (row["DOC_IDENTIFICATORIO"].ToString());
                peticionariolist.Add(userItem);
                Console.WriteLine(userItem);
                Console.WriteLine(peticionariolist);

            }

            // Si el peticionario ya esta registrado se actualizan sus datos en caso de que hayan cambiado
            if (peticionariolist.Count > 0)
            {
                idPetit = Convert.ToInt32(peticionariolist[0].IdRegistro);
                // Se actualiza datos del peticionario que ingreso en la entrada si es necesario
                Console.WriteLine("33");
                String queryPet = "exec Sp_Update_Peticionario " + idPetit + ",'" + nombre + "','" + apellidop + "','" + apellidom + "', '" + curp + "' ";
                conexionsql.InsertUpdateDelete(queryPet);
                System.Diagnostics.Debug.WriteLine("ID COMPLEMENTO RECIBIDO: " + idcomplementopet);
                if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
                {
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", "-", curp, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", "-", nombre, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", "-", apellidop, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", "-", apellidom, Ipaccesible);
                }
                else
                {
                    tipoMod = "Modificación";
                    if (peticionariolist[0].DocIdentificatorio != curp) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", peticionariolist[0].DocIdentificatorio, curp, Ipaccesible); }
                    if (peticionariolist[0].Nombre != nombre) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", peticionariolist[0].Nombre, nombre, Ipaccesible); }
                    if (peticionariolist[0].ApellidoPat != apellidop) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", peticionariolist[0].ApellidoPat, apellidop, Ipaccesible); }
                    if (peticionariolist[0].ApellidoMat != apellidom) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", peticionariolist[0].ApellidoMat, apellidom, Ipaccesible); }
                }
            }
            // si no esta registrado se inserta el registro
            else
            {
                Console.WriteLine("44");
                string queryip = "EXEC insertRegistro " +
                                         "'" + nombre + "'," +
                                         "'" + apellidop + "'," +
                                         "'" + apellidom + "'," +
                                         "'" + curp + "', ''";
                idPetit = conexionsql.InsertUpdateDeleteRegresaid(queryip);
                tipoMod = "Alta";
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", "-", curp, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", "-", nombre, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", "-", apellidop, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", "-", apellidom, Ipaccesible);
            }

            // ---  Aqui termina la parte de agregar y editar info a la tabla de reg_recepcion  ---

            string sexo = idSexo == 1 ? "Masculino" : idSexo == 2 ? "Femenino" : idSexo == 3 ? "No proporcionado" : "";
            string Escolaridad = idEscolaridad == 1 ? "Sin escolaridad" : idEscolaridad == 2 ? "Preescolar" : idEscolaridad == 3 ? "Primaria" : idEscolaridad == 4 ? "Secundaria" : idEscolaridad == 5 ? "Preparatoria o Bachillerato" : idEscolaridad == 6 ? "Normal Básica" : idEscolaridad == 7 ? "Profesional" : idEscolaridad == 8 ? "Maestría" : idEscolaridad == 9 ? "Doctorado" : idEscolaridad == 10 ? "No especificado" : idEscolaridad == 11 ? "Primaria terminada" : idEscolaridad == 12 ? "Secundaria terminada" : idEscolaridad == 13 ? "Preparatoria terminada" : idEscolaridad == 14 ? "No especificado" : "";
            string Estadoconyugal = idEstadoconyugal == 1 ? "Casado(a)" : idEstadoconyugal == 2 ? "Soltero(a)" : idEstadoconyugal == 3 ? "Viudo(a)" : idEstadoconyugal == 4 ? "Divorciado(a)" : idEstadoconyugal == 5 ? "Unión libre" : idEstadoconyugal == 6 ? "Sociedad en convivencia" : idEstadoconyugal == 7 ? "Separado(a)" : idEstadoconyugal == 8 ? "No especificado" : idEstadoconyugal == 9 ? "Se desconoce" : "";
            string Ocupacion = idOcupacion == 1 ? "Trabajador(a) doméstico" : idOcupacion == 2 ? "Comerciante" : idOcupacion == 3 ? "Desempleado(a)" : idOcupacion == 4 ? "Empleado(a) de comercio" : idOcupacion == 5 ? "Estudiante" : idOcupacion == 6 ? "Funcionario(a) del sector público" : idOcupacion == 7 ? "Periodista" : idOcupacion == 8 ? "Otro" : idOcupacion == 9 ? "No especificado" : "";
            string Discapacidad = idDiscapacidad == 1 ? "Visual" : idDiscapacidad == 2 ? "Auditiva" : idDiscapacidad == 3 ? "Para hablar" : idDiscapacidad == 4 ? "Mental" : idDiscapacidad == 5 ? "Motriz" : idDiscapacidad == 6 ? "Ninguna" : idDiscapacidad == 7 ? "No especificado" : "";
            string Gruposocial = idGruposocial == 1 ? "Indígena" : idGruposocial == 2 ? "VIH/Sida" : idGruposocial == 3 ? "Internos en reclusorios" : idGruposocial == 4 ? "Migrante" : idGruposocial == 5 ? "No Heterosexual" : idGruposocial == 6 ? "Personas con discapacidad" : idGruposocial == 7 ? "No pertenece" : idGruposocial == 8 ? "Otro" : idGruposocial == 9 ? "No especificado" : "";
            string VioMujer = violenciamujer == 1 ? "Si" : violenciamujer == 0 ? "No" : "";
            string Hijosvivos = idHijosvivos == 1 ? "Sin hijos/as" : idHijosvivos == 2 ? "1 hijo/a" : idHijosvivos == 3 ? "2 hijos/as" : idHijosvivos == 4 ? "3 hijos/as" : idHijosvivos == 5 ? "4 hijos/as" : idHijosvivos == 6 ? "5 hijos/as" : idHijosvivos == 7 ? "No especifica" : "";
            string Modalidadvio = idModalidadvio == 1 ? "Familiar" : idModalidadvio == 2 ? "Laboral" : idModalidadvio == 3 ? "Docente (Escolar)" : idModalidadvio == 4 ? "Istitucional" : idModalidadvio == 5 ? "Feminicidio" : idModalidadvio == 6 ? "No especifica" : "";
            string Tipoviole = idTipoviole == 1 ? "Hijo(a)" : idTipoviole == 2 ? "Esposo(a) o Compañero(a)" : idTipoviole == 3 ? "Trabajador(a)" : idTipoviole == 4 ? "Sin parentesco" : idTipoviole == 5 ? "No especifica" : "";
            string Relacionagresor = idRelacionagresor == 1 ? "Hijo(a)" : idRelacionagresor == 2 ? "Esposo(a) o Compañero(a)" : idRelacionagresor == 3 ? "Trabajador(a) Doméstico(a)" : idRelacionagresor == 4 ? "Sin parentesco" : idRelacionagresor == 5 ? "Huésped" : idRelacionagresor == 6 ? "Otra relación" : idRelacionagresor == 7 ? "Otro Parentesco" : idRelacionagresor == 8 ? "No especificado" : "";
            string tipuser_bita = "";
            if (tipouser == "Peticionario")
            {
                tipuser_bita = "Quejoso";
            }
            else
            {
                tipuser_bita = tipouser;
            }
            Console.WriteLine($"Valor real de id_queja: '{id_queja}'");

            // Se valida si quiere editar el complemento actual de peticionario o si es uno nuevo
            if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
            {
                // Al insertar si no existe id de queja no se registra en el campo ID_EXPEDIENTE de la tabla complemento_peticionario
                if (id_queja == "")
                {
                    Console.WriteLine("55");
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
                    "'" + otroGenero + "'," +
                    "'" + VersionComplemento + "'";
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", "-", cp, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", "-", estado, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", "-", colonia, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", "-", municipio, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", "-", ciudad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", "-", calle, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", "-", nexterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", "-", ninterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Fecha Nacimiento", "-", fechanac, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", "-", edad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", "-", telefono, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", "-", email, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", "-", tipuser_bita, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", "-", sexo, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", "-", genero, Ipaccesible);
                    if (genero == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", "-", otroGenero, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", "-", nacionalidad, Ipaccesible);
                    if (nacionalidad == "Extranjero")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", "-", migOrigen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", "-", migDestino, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", "-", migidPrimeramex, Ipaccesible);
                    }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", "-", sabeleer, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", "-", Escolaridad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", "-", Estadoconyugal, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", "-", Ocupacion, Ipaccesible);
                    if (Ocupacion == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", "-", Otraocupacion, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", "-", Discapacidad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", "-", Gruposocial, Ipaccesible);
                    if (Gruposocial == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", "-", otroGruposocial, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", "-", idLenguaindigena, Ipaccesible);
                    if (idLenguaindigena == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", "-", otraLenguaindigena, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", "-", VioMujer, Ipaccesible);
                    if (VioMujer == "Si")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", "-", Canalizaciondepen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", "-", idEmbarazada, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", "-", IngresosMensuales, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", "-", Hijosvivos, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", "-", Modalidadvio, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", "-", Tipoviole, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", "-", Relacionagresor, Ipaccesible);
                    }
                }
                // Si el id de queja ya existe entonces se registra en el campo ID_EXPEDIENTE de la tabla complemento_peticionario 
                else
                {
                    Console.WriteLine("66");
                    Console.WriteLine("Enviando datos a Sp_InsertComplementoPeticionarioQueja...");
                    try
                    {
                        using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                        {
                            connection.Open();

                            // Crea el SqlCommand con el nombre del procedimiento almacenado y la conexión
                            using (SqlCommand cmd = new SqlCommand("Sp_InsertComplementoPeticionarioQueja", connection))
                            {
                                // Establecer el tipo de comando como procedimiento almacenado
                                cmd.CommandType = CommandType.StoredProcedure;

                                // Agregar los parámetros con manejo de valores nulos
                                cmd.Parameters.AddWithValue("@tipoUser", string.IsNullOrEmpty(tipouser) ? DBNull.Value : (object)tipouser);
                                cmd.Parameters.AddWithValue("@calle", string.IsNullOrEmpty(calle) ? DBNull.Value : (object)calle);
                                cmd.Parameters.AddWithValue("@nexterior", string.IsNullOrEmpty(nexterior) ? DBNull.Value : (object)nexterior);
                                cmd.Parameters.AddWithValue("@ninterior", string.IsNullOrEmpty(ninterior) ? DBNull.Value : (object)ninterior);
                                cmd.Parameters.AddWithValue("@colonia", string.IsNullOrEmpty(colonia) ? DBNull.Value : (object)colonia);
                                cmd.Parameters.AddWithValue("@ciudad", string.IsNullOrEmpty(ciudad) ? DBNull.Value : (object)ciudad);
                                cmd.Parameters.AddWithValue("@municipio", string.IsNullOrEmpty(municipio) ? DBNull.Value : (object)municipio);
                                cmd.Parameters.AddWithValue("@estado", string.IsNullOrEmpty(estado) ? DBNull.Value : (object)estado);
                                cmd.Parameters.AddWithValue("@cp", string.IsNullOrEmpty(cp) ? DBNull.Value : (object)cp);
                                cmd.Parameters.AddWithValue("@telefono", string.IsNullOrEmpty(telefono) ? DBNull.Value : (object)telefono);
                                cmd.Parameters.AddWithValue("@edad", string.IsNullOrEmpty(edad) ? DBNull.Value : (object)edad);
                                cmd.Parameters.AddWithValue("@email", string.IsNullOrEmpty(email) ? DBNull.Value : (object)email);
                                cmd.Parameters.AddWithValue("@fkSexo", idSexo != 0 ? (object)idSexo : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkEscolaridad", idEscolaridad != 0 ? (object)idEscolaridad : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkEstadoconyugal", idEstadoconyugal != 0 ? (object)idEstadoconyugal : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkOcupacion", idOcupacion != 0 ? (object)idOcupacion : DBNull.Value);
                                //cmd.Parameters.AddWithValue("@Otraocupacion", string.IsNullOrEmpty(Otraocupacion) ? DBNull.Value : (object)Otraocupacion);
                                cmd.Parameters.AddWithValue("@Otraocupacion", (object)(Otraocupacion ?? ""));
                                cmd.Parameters.AddWithValue("@nacionalidad", string.IsNullOrEmpty(nacionalidad) ? DBNull.Value : (object)nacionalidad);
                                cmd.Parameters.AddWithValue("@sabeleer", string.IsNullOrEmpty(sabeleer) ? DBNull.Value : (object)sabeleer);
                                cmd.Parameters.AddWithValue("@fkDiscapacidad", idDiscapacidad != 0 ? (object)idDiscapacidad : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkGruposocial", idGruposocial != 0 ? (object)idGruposocial : DBNull.Value);
                                //cmd.Parameters.AddWithValue("@otroGruposocial", string.IsNullOrEmpty(otroGruposocial) ? DBNull.Value : (object)otroGruposocial);
                                cmd.Parameters.AddWithValue("@otroGruposocial", (object)(otroGruposocial ?? ""));
                                //cmd.Parameters.AddWithValue("@fkLenguaindigena", string.IsNullOrEmpty(idLenguaindigena) ? DBNull.Value : (object)idLenguaindigena);
                                //cmd.Parameters.AddWithValue("@fkLenguaindigena", (object)(idLenguaindigena ?? ""));
                                cmd.Parameters.AddWithValue("@fkLenguaindigena", string.IsNullOrEmpty(idLenguaindigena) ? DBNull.Value : (object)idLenguaindigena);
                                cmd.Parameters.AddWithValue("@otraLenguaindigena", string.IsNullOrEmpty(otraLenguaindigena) ? DBNull.Value : (object)otraLenguaindigena);
                                cmd.Parameters.AddWithValue("@fechanac", string.IsNullOrEmpty(fechanac) ? DBNull.Value : (object)fechanac);
                                //cmd.Parameters.AddWithValue("@migOrigen", string.IsNullOrEmpty(migOrigen) ? DBNull.Value : (object)migOrigen);
                                cmd.Parameters.AddWithValue("@migOrigen", (object)(migOrigen ?? ""));
                                //cmd.Parameters.AddWithValue("@migDestino", string.IsNullOrEmpty(migDestino) ? DBNull.Value : (object)migDestino);
                                cmd.Parameters.AddWithValue("@migDestino", (object)(migDestino ?? ""));
                                //cmd.Parameters.AddWithValue("@migidPrimeramex", string.IsNullOrEmpty(migidPrimeramex) ? DBNull.Value : (object)migidPrimeramex);
                                cmd.Parameters.AddWithValue("@migidPrimeramex", (object)(migidPrimeramex ?? ""));
                                //cmd.Parameters.AddWithValue("@violenciamujer", violenciamujer != 1 ? (object)violenciamujer : DBNull.Value);
                                cmd.Parameters.AddWithValue("@violenciamujer", (violenciamujer == 0 || violenciamujer == 1) ? (object)violenciamujer : DBNull.Value);
                                //cmd.Parameters.AddWithValue("@canalizaciondepen", string.IsNullOrEmpty(Canalizaciondepen) ? DBNull.Value : (object)Canalizaciondepen);
                                cmd.Parameters.AddWithValue("@canalizaciondepen", (object)(Canalizaciondepen ?? ""));
                                //cmd.Parameters.AddWithValue("@fkEmbarazada", string.IsNullOrEmpty(idEmbarazada) ? DBNull.Value : (object)idEmbarazada);
                                cmd.Parameters.AddWithValue("@fkEmbarazada", (object)(idEmbarazada ?? ""));
                                cmd.Parameters.AddWithValue("@fkHijosvivos", idHijosvivos != 0 ? (object)idHijosvivos : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkModalidadvio", idModalidadvio != 0 ? (object)idModalidadvio : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkTipovio", idTipoviole != 0 ? (object)idTipoviole : DBNull.Value);
                                cmd.Parameters.AddWithValue("@fkRelacionagresor", idRelacionagresor != 0 ? (object)idRelacionagresor : DBNull.Value);
                                //cmd.Parameters.AddWithValue("@ingresosMensuales", string.IsNullOrEmpty(IngresosMensuales) ? DBNull.Value : (object)IngresosMensuales);
                                cmd.Parameters.AddWithValue("@ingresosMensuales", (object)(IngresosMensuales ?? ""));
                                cmd.Parameters.AddWithValue("@fkPeticionarioint", idPetit != 0 ? (object)idPetit : DBNull.Value);
                                cmd.Parameters.AddWithValue("@genero", string.IsNullOrEmpty(genero) ? DBNull.Value : (object)genero);
                                //cmd.Parameters.AddWithValue("@otroGenero", string.IsNullOrEmpty(otroGenero) ? DBNull.Value : (object)otroGenero);
                                cmd.Parameters.AddWithValue("@otroGenero", (object)(otroGenero ?? ""));
                                cmd.Parameters.AddWithValue("@idexpediente", string.IsNullOrEmpty(id_queja) ? DBNull.Value : (object)id_queja);

                                Console.WriteLine("Ejecutando el procedimiento almacenado...");

                                object result = cmd.ExecuteScalar();

                                if (result != null && result != DBNull.Value)
                                {
                                    int idInsertado = Convert.ToInt32(result);
                                    Console.WriteLine($"SP ejecutado correctamente. ID insertado: {idInsertado}");
                                }
                                else
                                {
                                    Console.WriteLine("SP ejecutado, pero no devolvió ningún valor.");
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error al ejecutar el SP 2: " + ex.Message);
                    }
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", "-", cp, Ipaccesible);
                    Console.WriteLine($"BITACORA CP: '{cp}'");

                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", "-", estado, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", "-", colonia, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", "-", municipio, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", "-", ciudad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", "-", calle, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", "-", nexterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", "-", ninterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Fecha Nacimiento", "-", fechanac, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", "-", edad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", "-", telefono, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", "-", email, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", "-", tipuser_bita, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", "-", sexo, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", "-", genero, Ipaccesible);
                    if (genero == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", "-", otroGenero, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", "-", nacionalidad, Ipaccesible);
                    if (nacionalidad == "Extranjero")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", "-", migOrigen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", "-", migDestino, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", "-", migidPrimeramex, Ipaccesible);
                    }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", "-", sabeleer, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", "-", Escolaridad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", "-", Estadoconyugal, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", "-", Ocupacion, Ipaccesible);
                    if (Ocupacion == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", "-", Otraocupacion, Ipaccesible); }


                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", "-", Discapacidad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", "-", Gruposocial, Ipaccesible);
                    if (Gruposocial == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", "-", otroGruposocial, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", "-", idLenguaindigena, Ipaccesible);
                    if (idLenguaindigena == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", "-", otraLenguaindigena, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", "-", VioMujer, Ipaccesible);
                    if (VioMujer == "Si")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", "-", Canalizaciondepen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", "-", idEmbarazada, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", "-", IngresosMensuales, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", "-", Hijosvivos, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", "-", Modalidadvio, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", "-", Tipoviole, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", "-", Relacionagresor, Ipaccesible);
                    }
                }
            }
            // Si el complemento peticionario ya existe entonces se actualiza
            else
            {
                // Es en este bloque donde necesito comprobar la informacion devuelta y enviada.
                ComplementoPeticionario compet = new ComplementoPeticionario();
                Console.WriteLine("77");
                Console.WriteLine(idcomplementopet);
                queryPeticionario = "Sp_GetDataPeticionarioxIdComp1 " + idcomplementopet;
                Console.WriteLine(queryPeticionario);
                var data_comp_pet = GetDatosGeneral(queryPeticionario);
                Console.WriteLine(data_comp_pet);
                foreach (DataRow row in data_comp_pet.Rows)
                {
                    compet.TipoUsuario = row["TIPO_USUARIO"].ToString();
                    compet.Calle = (row["CALLE"].ToString());
                    compet.NumExterior = (row["NUM_EXTERIOR"].ToString());
                    compet.NumInterior = (row["NUM_INTERIOR"].ToString());
                    compet.Colonia = (row["COLONIA"].ToString());
                    compet.Ciudad = (row["CIUDAD"].ToString());
                    compet.Municipio = (row["MUNICIPIO"].ToString());
                    compet.Estado = (row["ESTADO"].ToString());
                    compet.CodigoPostal = (row["CODIGO_POSTAL"].ToString());
                    compet.Telefono = (row["TELEFONO"].ToString());
                    compet.Edad = (row["EDAD"].ToString());
                    compet.Email = (row["EMAIL"].ToString());
                    compet.FkSexo = Convert.ToInt32(row["FK_SEXO"].ToString());
                    compet.FkEscolaridad = Convert.ToInt32(row["FK_ESCOLARIDAD"].ToString());
                    compet.FkEstadoConyugal = Convert.ToInt32(row["FK_ESTADO_CONYUGAL"].ToString());
                    compet.FkOcupacion = Convert.ToInt32(row["FK_OCUPACION"].ToString());
                    compet.OtraOcupacion = (row["OTRA_OCUPACION"].ToString());
                    compet.Nacionalidad = (row["NACIONALIDAD"].ToString());
                    compet.SabeLeer = (row["SABE_LEER"].ToString());
                    compet.FkDiscapacidad = Convert.ToInt32(row["FK_DISCAPACIDAD"].ToString());
                    compet.FkGrupoSocial = Convert.ToInt32(row["FK_GRUPO_SOCIAL"].ToString());
                    compet.OtroGsocial = (row["OTRO_GSOCIAL"].ToString());
                    compet.HablaLenguai = (row["HABLA_LENGUAI"].ToString());
                    compet.LenguaIndigena = (row["LENGUA_INDIGENA"].ToString());
                    compet.FechaNacimiento = Convert.ToDateTime(row["FECHA_NACIMIENTO"].ToString());
                    compet.OrigenMigrante = (row["ORIGEN_MIGRANTE"].ToString());
                    compet.DestinoMigrante = (row["DESTINO_MIGRANTE"].ToString());
                    compet.PrimeravmexMigrante = (row["PRIMERAVMEX_MIGRANTE"].ToString());
                    compet.ViolenciaVm = Convert.ToInt32(row["VIOLENCIA_VM"].ToString());
                    compet.CanalizacionVm = (row["CANALIZACION_VM"].ToString());
                    compet.EmbarazadaVm = (row["EMBARAZADA_VM"].ToString());
                    compet.FkHijosVivos = Convert.ToInt32(row["FK_HIJOS_VIVOS"].ToString());
                    compet.FkModalidadViolencia = Convert.ToInt32(row["FK_MODALIDAD_VIOLENCIA"].ToString());
                    compet.FkTipoViolencia = Convert.ToInt32(row["FK_TIPO_VIOLENCIA"].ToString());
                    compet.FkRelacionAgresor = Convert.ToInt32(row["FK_RELACION_AGRESOR"].ToString());
                    compet.IngresosMensuales = (row["INGRESOS_MENSUALES"].ToString());
                    compet.Genero = (row["GENERO"].ToString());
                    compet.OtroGenero = (row["OTRO_GENERO"].ToString());
                }
                Console.WriteLine("Enviando datos a Sp_UpdatePeticionarioCedula...");
                try
                {
                    using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                    {
                        connection.Open();

                        // Crea el SqlCommand con el nombre del procedimiento almacenado y la conexión
                        using (SqlCommand cmd = new SqlCommand("Sp_UpdatePeticionarioCedula", connection))
                        {
                            // Establecer el tipo de comando como procedimiento almacenado
                            cmd.CommandType = CommandType.StoredProcedure;

                            // Agregar los parámetros con manejo de valores nulos
                            cmd.Parameters.AddWithValue("@tipoUser", string.IsNullOrEmpty(tipouser) ? DBNull.Value : (object)tipouser);
                            cmd.Parameters.AddWithValue("@calle", string.IsNullOrEmpty(calle) ? DBNull.Value : (object)calle);
                            cmd.Parameters.AddWithValue("@nexterior", string.IsNullOrEmpty(nexterior) ? DBNull.Value : (object)nexterior);
                            cmd.Parameters.AddWithValue("@ninterior", string.IsNullOrEmpty(ninterior) ? DBNull.Value : (object)ninterior);
                            cmd.Parameters.AddWithValue("@colonia", string.IsNullOrEmpty(colonia) ? DBNull.Value : (object)colonia);
                            cmd.Parameters.AddWithValue("@ciudad", string.IsNullOrEmpty(ciudad) ? DBNull.Value : (object)ciudad);
                            cmd.Parameters.AddWithValue("@municipio", string.IsNullOrEmpty(municipio) ? DBNull.Value : (object)municipio);
                            cmd.Parameters.AddWithValue("@estado", string.IsNullOrEmpty(estado) ? DBNull.Value : (object)estado);
                            cmd.Parameters.AddWithValue("@cp", string.IsNullOrEmpty(cp) ? DBNull.Value : (object)cp);
                            cmd.Parameters.AddWithValue("@telefono", string.IsNullOrEmpty(telefono) ? DBNull.Value : (object)telefono);
                            cmd.Parameters.AddWithValue("@edad", string.IsNullOrEmpty(edad) ? DBNull.Value : (object)edad);
                            cmd.Parameters.AddWithValue("@email", string.IsNullOrEmpty(email) ? DBNull.Value : (object)email);
                            cmd.Parameters.AddWithValue("@fkSexo", idSexo != 0 ? (object)idSexo : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkEscolaridad", idEscolaridad != 0 ? (object)idEscolaridad : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkEstadoconyugal", idEstadoconyugal != 0 ? (object)idEstadoconyugal : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkOcupacion", idOcupacion != 0 ? (object)idOcupacion : DBNull.Value);
                            cmd.Parameters.AddWithValue("@Otraocupacion", string.IsNullOrEmpty(Otraocupacion) ? DBNull.Value : (object)Otraocupacion);
                            cmd.Parameters.AddWithValue("@nacionalidad", string.IsNullOrEmpty(nacionalidad) ? DBNull.Value : (object)nacionalidad);
                            cmd.Parameters.AddWithValue("@sabeleer", string.IsNullOrEmpty(sabeleer) ? DBNull.Value : (object)sabeleer);
                            cmd.Parameters.AddWithValue("@fkDiscapacidad", idDiscapacidad != 0 ? (object)idDiscapacidad : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkGruposocial", idGruposocial != 0 ? (object)idGruposocial : DBNull.Value);
                            cmd.Parameters.AddWithValue("@otroGruposocial", string.IsNullOrEmpty(otroGruposocial) ? DBNull.Value : (object)otroGruposocial);
                            cmd.Parameters.AddWithValue("@fkLenguaindigena", string.IsNullOrEmpty(idLenguaindigena) ? DBNull.Value : (object)idLenguaindigena);
                            cmd.Parameters.AddWithValue("@otraLenguaindigena", string.IsNullOrEmpty(otraLenguaindigena) ? DBNull.Value : (object)otraLenguaindigena);
                            cmd.Parameters.AddWithValue("@fechanac", string.IsNullOrEmpty(fechanac) ? DBNull.Value : (object)fechanac);
                            cmd.Parameters.AddWithValue("@migOrigen", string.IsNullOrEmpty(migOrigen) ? DBNull.Value : (object)migOrigen);
                            cmd.Parameters.AddWithValue("@migDestino", string.IsNullOrEmpty(migDestino) ? DBNull.Value : (object)migDestino);
                            cmd.Parameters.AddWithValue("@migidPrimeramex", string.IsNullOrEmpty(migidPrimeramex) ? DBNull.Value : (object)migidPrimeramex);
                            cmd.Parameters.AddWithValue("@violenciamujer", violenciamujer != 0 ? (object)violenciamujer : DBNull.Value);
                            cmd.Parameters.AddWithValue("@canalizaciondepen", string.IsNullOrEmpty(Canalizaciondepen) ? DBNull.Value : (object)Canalizaciondepen);
                            cmd.Parameters.AddWithValue("@fkEmbarazada", string.IsNullOrEmpty(idEmbarazada) ? DBNull.Value : (object)idEmbarazada);
                            cmd.Parameters.AddWithValue("@fkHijosvivos", idHijosvivos != 0 ? (object)idHijosvivos : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkModalidadvio", idModalidadvio != 0 ? (object)idModalidadvio : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkTipovio", idTipoviole != 0 ? (object)idTipoviole : DBNull.Value);
                            cmd.Parameters.AddWithValue("@fkRelacionagresor", idRelacionagresor != 0 ? (object)idRelacionagresor : DBNull.Value);
                            cmd.Parameters.AddWithValue("@ingresosMensuales", string.IsNullOrEmpty(IngresosMensuales) ? DBNull.Value : (object)IngresosMensuales);
                            cmd.Parameters.AddWithValue("@IdComplementoPeticionario", string.IsNullOrEmpty(idcomplementopet) ? DBNull.Value : (object)idcomplementopet);
                            cmd.Parameters.AddWithValue("@genero", string.IsNullOrEmpty(genero) ? DBNull.Value : (object)genero);
                            cmd.Parameters.AddWithValue("@otroGenero", string.IsNullOrEmpty(otroGenero) ? DBNull.Value : (object)otroGenero);
                            // Parámetro de salida
                            SqlParameter resultadoParam = new SqlParameter("@resultado", SqlDbType.Int)
                            {
                                Direction = ParameterDirection.Output
                            };
                            cmd.Parameters.Add(resultadoParam);

                            // Ejecutar el comando y capturar el valor de salida
                            cmd.ExecuteNonQuery();



                            // Obtener el valor del parámetro de salida
                            int result = (int)resultadoParam.Value;

                            if (result == 1)
                            {
                                Console.WriteLine("Actualización exitosa.");
                            }
                            else
                            {
                                Console.WriteLine("Hubo un error en la actualización.");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error al ejecutar el SP: " + ex.Message);
                }

                tipoMod = "Modificación";
                string sexoFK = compet.FkSexo == 1 ? "Masculino" : compet.FkSexo == 2 ? "Femenino" : compet.FkSexo == 3 ? "No proporcionado" : "";
                string EscolaridadFK = compet.FkEscolaridad == 1 ? "Sin escolaridad" : compet.FkEscolaridad == 2 ? "Preescolar" : compet.FkEscolaridad == 3 ? "Primaria" : compet.FkEscolaridad == 4 ? "Secundaria" : compet.FkEscolaridad == 5 ? "Preparatoria o Bachillerato" : compet.FkEscolaridad == 6 ? "Normal Básica" : compet.FkEscolaridad == 7 ? "Profesional" : compet.FkEscolaridad == 8 ? "Maestría" : compet.FkEscolaridad == 9 ? "Doctorado" : compet.FkEscolaridad == 10 ? "No especificado" : compet.FkEscolaridad == 11 ? "Primaria terminada" : compet.FkEscolaridad == 12 ? "Secundaria terminada" : compet.FkEscolaridad == 13 ? "Preparatoria terminada" : compet.FkEscolaridad == 14 ? "No especificado" : "";
                string EstadoconyugalFK = compet.FkEstadoConyugal == 1 ? "Casado(a)" : compet.FkEstadoConyugal == 2 ? "Soltero(a)" : compet.FkEstadoConyugal == 3 ? "Viudo(a)" : compet.FkEstadoConyugal == 4 ? "Divorciado(a)" : compet.FkEstadoConyugal == 5 ? "Unión libre" : compet.FkEstadoConyugal == 6 ? "Sociedad en convivencia" : compet.FkEstadoConyugal == 7 ? "Separado(a)" : compet.FkEstadoConyugal == 8 ? "No especificado" : compet.FkEstadoConyugal == 9 ? "Se desconoce" : "";
                string OcupacionFK = compet.FkOcupacion == 1 ? "Trabajador(a) doméstico" : compet.FkOcupacion == 2 ? "Comerciante" : compet.FkOcupacion == 3 ? "Desempleado(a)" : compet.FkOcupacion == 4 ? "Empleado(a) de comercio" : compet.FkOcupacion == 5 ? "Estudiante" : compet.FkOcupacion == 6 ? "Funcionario(a) del sector público" : compet.FkOcupacion == 7 ? "Periodista" : compet.FkOcupacion == 8 ? "Otro" : compet.FkOcupacion == 9 ? "No especificado" : "";
                string DiscapacidadFK = compet.FkDiscapacidad == 1 ? "Visual" : compet.FkDiscapacidad == 2 ? "Auditiva" : compet.FkDiscapacidad == 3 ? "Para hablar" : compet.FkDiscapacidad == 4 ? "Mental" : compet.FkDiscapacidad == 5 ? "Motriz" : compet.FkDiscapacidad == 6 ? "Ninguna" : compet.FkDiscapacidad == 7 ? "No especificado" : "";
                string GruposocialFK = compet.FkGrupoSocial == 1 ? "Indígena" : compet.FkGrupoSocial == 2 ? "VIH/Sida" : compet.FkGrupoSocial == 3 ? "Internos en reclusorios" : compet.FkGrupoSocial == 4 ? "Migrante" : compet.FkGrupoSocial == 5 ? "No Heterosexual" : compet.FkGrupoSocial == 6 ? "Personas con discapacidad" : compet.FkGrupoSocial == 7 ? "No pertenece" : compet.FkGrupoSocial == 8 ? "Otro" : compet.FkGrupoSocial == 9 ? "No especificado" : "";
                string VioMujerFK = compet.ViolenciaVm == 1 ? "Si" : compet.ViolenciaVm == 0 ? "No" : "";
                string HijosvivosFK = compet.FkHijosVivos == 1 ? "Sin hijos/as" : compet.FkHijosVivos == 2 ? "1 hijo/a" : compet.FkHijosVivos == 3 ? "2 hijos/as" : compet.FkHijosVivos == 4 ? "3 hijos/as" : compet.FkHijosVivos == 5 ? "4 hijos/as" : compet.FkHijosVivos == 6 ? "5 hijos/as" : compet.FkHijosVivos == 7 ? "No especifica" : "";
                string ModalidadvioFK = compet.FkModalidadViolencia == 1 ? "Familiar" : compet.FkModalidadViolencia == 2 ? "Laboral" : compet.FkModalidadViolencia == 3 ? "Docente (Escolar)" : compet.FkModalidadViolencia == 4 ? "Istitucional" : compet.FkModalidadViolencia == 5 ? "Feminicidio" : compet.FkModalidadViolencia == 6 ? "No especifica" : "";
                string TipovioleFK = compet.FkTipoViolencia == 1 ? "Hijo(a)" : compet.FkTipoViolencia == 2 ? "Esposo(a) o Compañero(a)" : compet.FkTipoViolencia == 3 ? "Trabajador(a)" : compet.FkTipoViolencia == 4 ? "Sin parentesco" : compet.FkTipoViolencia == 5 ? "No especifica" : "";
                string RelacionagresorFK = compet.FkRelacionAgresor == 1 ? "Hijo(a)" : compet.FkRelacionAgresor == 2 ? "Esposo(a) o Compañero(a)" : compet.FkRelacionAgresor == 3 ? "Trabajador(a) Doméstico(a)" : compet.FkRelacionAgresor == 4 ? "Sin parentesco" : compet.FkRelacionAgresor == 5 ? "Huésped" : compet.FkRelacionAgresor == 6 ? "Otra relación" : compet.FkRelacionAgresor == 7 ? "Otro Parentesco" : compet.FkRelacionAgresor == 8 ? "No especificado" : "";

                //ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de Persona", "tipo_persona", tipo_persona, Ipaccesible);
                if (compet.CodigoPostal != cp) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", compet.CodigoPostal, cp, Ipaccesible); }
                if (compet.Estado != estado) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", compet.Estado, estado, Ipaccesible); }
                if (compet.Colonia != colonia) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", compet.Colonia, colonia, Ipaccesible); }
                if (compet.Municipio != municipio) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", compet.Municipio, municipio, Ipaccesible); }
                if (compet.Ciudad != ciudad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", compet.Ciudad, ciudad, Ipaccesible); }
                if (compet.Calle != calle) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", compet.Calle, calle, Ipaccesible); }
                if (compet.NumExterior != nexterior) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", compet.NumExterior, nexterior, Ipaccesible); }
                if (compet.NumInterior != ninterior) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", compet.NumInterior, ninterior, Ipaccesible); }
                DateTime fechaNacConver = DateTime.Parse(fechanac);
                if (compet.FechaNacimiento != fechaNacConver) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "FeCPcha Nacimiento", compet.FechaNacimiento.ToString(), fechanac, Ipaccesible); }
                if (compet.Edad != edad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", compet.Edad, edad, Ipaccesible); }
                if (compet.Telefono != telefono) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", compet.Telefono, telefono, Ipaccesible); }
                if (compet.Email != email) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", compet.Email, email, Ipaccesible); }
                if (compet.TipoUsuario != tipouser) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", compet.TipoUsuario, tipuser_bita, Ipaccesible); }
                if (sexoFK != sexo) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", sexoFK, sexo, Ipaccesible); }
                if (compet.Genero != genero) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", compet.Genero, genero, Ipaccesible); }
                if (compet.OtroGenero != otroGenero) { if (genero == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", compet.OtroGenero, otroGenero, Ipaccesible); } }
                if (compet.Nacionalidad != nacionalidad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", compet.Nacionalidad, nacionalidad, Ipaccesible); }
                if (nacionalidad == "Extranjero")
                {
                    if (compet.OrigenMigrante != migOrigen) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", compet.OrigenMigrante, migOrigen, Ipaccesible); }
                    if (compet.DestinoMigrante != migDestino) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", compet.DestinoMigrante, migDestino, Ipaccesible); }
                    if (compet.PrimeravmexMigrante != migidPrimeramex) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", compet.PrimeravmexMigrante, migidPrimeramex, Ipaccesible); }
                }
                if (compet.SabeLeer != sabeleer) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", compet.SabeLeer, sabeleer, Ipaccesible); }
                if (EscolaridadFK != Escolaridad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", EscolaridadFK, Escolaridad, Ipaccesible); }
                if (EstadoconyugalFK != Estadoconyugal) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", EstadoconyugalFK, Estadoconyugal, Ipaccesible); }
                if (OcupacionFK != Ocupacion) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", OcupacionFK, Ocupacion, Ipaccesible); }
                if (compet.OtraOcupacion != Otraocupacion) { if (Ocupacion == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", compet.OtraOcupacion, Otraocupacion, Ipaccesible); } }
                if (DiscapacidadFK != Discapacidad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", DiscapacidadFK, Discapacidad, Ipaccesible); }
                if (GruposocialFK != Gruposocial) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", GruposocialFK, Gruposocial, Ipaccesible); }
                if (compet.OtroGsocial != otroGruposocial) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", compet.OtroGsocial, otroGruposocial, Ipaccesible); }
                if (compet.HablaLenguai != idLenguaindigena) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", compet.HablaLenguai, idLenguaindigena, Ipaccesible); }
                if (compet.LenguaIndigena != otraLenguaindigena) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", compet.LenguaIndigena, otraLenguaindigena, Ipaccesible); }
                if (VioMujerFK != VioMujer) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", VioMujerFK, VioMujer, Ipaccesible); }
                if (VioMujer == "Si")
                {
                    if (compet.CanalizacionVm != Canalizaciondepen) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", compet.CanalizacionVm, Canalizaciondepen, Ipaccesible); }
                    if (compet.EmbarazadaVm != idEmbarazada) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", compet.EmbarazadaVm, idEmbarazada, Ipaccesible); }
                    if (compet.IngresosMensuales != IngresosMensuales) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", compet.IngresosMensuales, IngresosMensuales, Ipaccesible); }
                    if (HijosvivosFK != Hijosvivos) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", HijosvivosFK, Hijosvivos, Ipaccesible); }
                    if (ModalidadvioFK != Modalidadvio) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", ModalidadvioFK, Modalidadvio, Ipaccesible); }
                    if (TipovioleFK != Tipoviole) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", TipovioleFK, Tipoviole, Ipaccesible); }
                    if (RelacionagresorFK != Relacionagresor) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", RelacionagresorFK, Relacionagresor, Ipaccesible); }
                }
                int idcomp = 0;

                if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
                {
                    // INSERT
                    idcomp = conexionsql.InsertUpdateDeleteRegresaid(query);
                }
                else
                {
                    // UPDATE
                    conexionsql.InsertUpdateDelete(query);

                    // conservar mismo ID
                    idcomp = Convert.ToInt32(idcomplementopet);
                }
                int id_quejaR = 0;
                if (id_queja == "")
                {
                    id_quejaR = int.Parse(conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"));
                }
                else
                {
                    id_quejaR = Convert.ToInt32(id_queja);
                }
                CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());

                return Json(new { idcomplemento = idcomp, idpeticionario = idPetit, idqueja = 1, tipousuario = tipouser, nombrepet = nombre + ' ' + apellidop + ' ' + apellidom });
            }

            // David 03 11 2025: Metodo aux que ayuda a mantener actualizados los datos de edad, genero, sexo en las tablas de cedulas
            // Se ejecuta y busca registros que coincidan con el id de expediente y el id del peticionario, busca en todas las tablas y si encuentra uno actualiza sus datos
            // Si el peticionario no tuviera cedula este metodo no le afecta, solo aplica cuando tiene cedula (activa o no)
            try
            {
                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();

                    // Crea el SqlCommand con el nombre del procedimiento almacenado y la conexión
                    using (SqlCommand cmd = new SqlCommand("Sp_ActualizarDatosTablasCedulas", connection))
                    {
                        // Establecer el tipo de comando como procedimiento almacenado
                        cmd.CommandType = CommandType.StoredProcedure;
                        // Convertir id_queja de string a int de manera segura
                        int idExpedienteInt = 0;
                        if (!string.IsNullOrEmpty(id_queja) && int.TryParse(id_queja, out int temp))
                        {
                            idExpedienteInt = temp;
                        }
                        else
                        {
                            // Si no se puede convertir, opcionalmente puedes lanzar excepción o usar DBNull
                            throw new Exception("IdExpedienteCedula inválido: " + id_queja);
                        }
                        cmd.Parameters.AddWithValue("@IdExpedienteCedula", idExpedienteInt);
                        cmd.Parameters.AddWithValue("@IdPeticionario", idPetit != 0 ? (object)idPetit : DBNull.Value);

                        // Ejecutar el SP
                        int filasAfectadas = cmd.ExecuteNonQuery();
                        Console.WriteLine("SP ejecutado correctamente. Filas afectadas: " + filasAfectadas);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al ejecutar el SP: " + ex.Message);
            }

            return Json(new
            {
                id_queja,
                curp,
                nombre,
                apellidop,
                apellidom,
                email,
                telefono,
                estado,
                municipio,
                Ipaccesible,
                tipouser,
                nacionalidad,
                idSexo,
                fechanac,
                idOcupacion,
                idEscolaridad
            });
        }

        public ActionResult GuardarDataComplPeticionario(IFormCollection form, string nombreS,string Ipaccesible)
        {

                StringBuilder txtcontBuilder = new StringBuilder();
            string numFrm = form["numFrm"].ToString();
            string idcomplementopet = form["idcomplementopet" + numFrm].ToString();
            string idreg_recepcion = form["idpeticionarioi" + numFrm].ToString();
            string id_queja = form["idquejagenerado"].ToString();
            string VersionComplemento = "";
            if (form["versioncomplementopeticionario"].Count > 0) { VersionComplemento = form["versioncomplementopeticionario"].ToString(); }

            string tipoMod = "";
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

            string tipo_persona = "Física";
            string tipouser = form["qatu_petit-frmDatosPersonales" + numFrm].ToString();
            string curp = form["CURP_petit-frmDatosPersonales" + numFrm].ToString().ToUpper();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            if (curp == "NO PROPORCIONADO" && apellidop == "No Proporcionado" && apellidom == "No Proporcionado" && nombreS != null)
            {
                nombre = nombreS;
                tipo_persona = "Moral";
            }
            string calle = form["calle_petit-frmDatosPersonales" + numFrm].ToString();
            string nexterior = form["nexterior_petit-frmDatosPersonales" + numFrm].ToString();
            string ninterior = form["ninterior_petit-frmDatosPersonales" + numFrm].ToString();
            string colonia = form["colonia_petit-frmDatosPersonales" + numFrm].ToString();
            string ciudad = form["ciudad_petit-frmDatosPersonales" + numFrm].ToString();
            string municipio = form["municipio_petit-frmDatosPersonales" + numFrm].ToString();
            string estado = form["estado_petit-frmDatosPersonales" + numFrm].ToString();
            string cp = form["cp_petit-frmDatosPersonales" + numFrm].ToString();
            string telefono = form["telefono_petit-frmDatosPersonales" + numFrm].ToString();
            string edadStr = form["edad_petit-frmDatosPersonales" + numFrm].ToString();
            string edad;

            if (edadStr == "No proporcionado")
            {
                edad = "0";
            }
            else
            {
                 edad = form["edad_petit-frmDatosPersonales" + numFrm].ToString();
            }
            string email = form["email_petit-frmDatosPersonales" + numFrm].ToString();
            int idSexo = 3;
            if (form["radsexo_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idSexo = int.Parse(form["radsexo_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string genero = form["genero_petit-frmDatosPersonales" + numFrm].ToString();
            string otroGenero = form["ogenero_petit-frmDatosPersonales" + numFrm].ToString();
            int idEscolaridad = 14;
            if (form["escosel_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idEscolaridad = int.Parse(form["escosel_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idEstadoconyugal = 8;
            if (form["econyugal_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idEstadoconyugal = int.Parse(form["econyugal_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idOcupacion = 9;
            if (form["ocupacion_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idOcupacion = int.Parse(form["ocupacion_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string Otraocupacion = form["ocupacioninpt_petit-frmDatosPersonales" + numFrm].ToString();
            string nacionalidad = form["chknacionalidad_petit-frmDatosPersonales" + numFrm].ToString();
            string sabeleer = form["chksleer_petit-frmDatosPersonales" + numFrm].ToString();
            int idDiscapacidad = 7;
            if (form["discapacidad_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idDiscapacidad = int.Parse(form["discapacidad_petit-frmDatosPersonales" + numFrm].ToString());
            }
            int idGruposocial = 9;
            if (form["gsoci_petit-frmDatosPersonales" + numFrm].Count <= 0) { }
            else
            {
                idGruposocial = int.Parse(form["gsoci_petit-frmDatosPersonales" + numFrm].ToString());
            }
            string otroGruposocial = form["gsociinpt_petit-frmDatosPersonales" + numFrm].ToString();
            string idLenguaindigena = form["leindi_petit-frmDatosPersonales" + numFrm].ToString();
            string otraLenguaindigena = form["oleindi_petit-frmDatosPersonales" + numFrm].ToString();
            string fechanac = form["fenac_petit-frmDatosPersonales" + numFrm].ToString();
            //DateTime fechafin = DateTime.ParseExact(fechanac, "yyyy-MM-dd", CultureInfo.InvariantCulture);

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

            // Se obtiene el id del peticionario registrado en la entrada a travez de la CURP o Nombre o id_reg_recepcion(este se cancelo pero funciona)
            if (idreg_recepcion != "")
            {
                queryPeticionario = "EXEC Sp_GetPeticionarioxid " + "'" + idreg_recepcion + "'";
            }
            else if (curp != "" && curp != "No proporcionado" && curp != "NO PROPORCIONADO")
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
                userItem.Nombre = (row["NOMBRE"].ToString());
                userItem.ApellidoPat = (row["APELLIDO_PAT"].ToString());
                userItem.ApellidoMat = (row["APELLIDO_MAT"].ToString());
                userItem.DocIdentificatorio = (row["DOC_IDENTIFICATORIO"].ToString());
                peticionariolist.Add(userItem);
            }
            if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0") { ContBitacora(txtcontBuilder, "Datos Personales", "Alta", "Tipo de Persona", "-", tipo_persona, Ipaccesible); }
            // Si el peticionario ya esta registrado se actualizan sus datos en caso de que hayan cambiado
            if (peticionariolist.Count > 0)
            {
                idPetit = Convert.ToInt32(peticionariolist[0].IdRegistro);
                // Se actualiza datos del peticionario que ingreso en la entrada si es necesario
                String queryPet = "exec Sp_Update_Peticionario " + idPetit + ",'" + nombre + "','" + apellidop + "','" + apellidom + "', '" + curp + "' ";
                conexionsql.InsertUpdateDelete(queryPet);
                if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
                {
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", "-", curp, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", "-", nombre, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", "-", apellidop, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", "-", apellidom, Ipaccesible);
                }
                else
                {
                    tipoMod = "Modificación";
                    if (peticionariolist[0].DocIdentificatorio != curp) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", peticionariolist[0].DocIdentificatorio, curp, Ipaccesible); }
                    if (peticionariolist[0].Nombre != nombre) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", peticionariolist[0].Nombre, nombre, Ipaccesible); }
                    if (peticionariolist[0].ApellidoPat != apellidop) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", peticionariolist[0].ApellidoPat, apellidop, Ipaccesible); }
                    if (peticionariolist[0].ApellidoMat != apellidom) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", peticionariolist[0].ApellidoMat, apellidom, Ipaccesible); }
                }
            }
            // si no esta registrado se inserta el registro
            else
            {
                string queryip = "EXEC insertRegistro " +
                                         "'" + nombre + "'," +
                                         "'" + apellidop + "'," +
                                         "'" + apellidom + "'," +
                                         "'" + curp + "', ''";
                idPetit = conexionsql.InsertUpdateDeleteRegresaid(queryip);
                tipoMod = "Alta";
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CURP", "-", curp, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nombre", "-", nombre, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Paterno", "-", apellidop, Ipaccesible);
                ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Apellido Materno", "-", apellidom, Ipaccesible);
            }
            string sexo = idSexo == 1 ? "Masculino" : idSexo == 2 ? "Femenino" : idSexo == 3 ? "No proporcionado" : "";
            string Escolaridad = idEscolaridad == 1 ? "Sin escolaridad" : idEscolaridad == 2 ? "Preescolar" : idEscolaridad == 3 ? "Primaria": idEscolaridad == 4 ? "Secundaria" : idEscolaridad == 5 ? "Preparatoria o Bachillerato" : idEscolaridad == 6 ? "Normal Básica" : idEscolaridad == 7 ? "Profesional" : idEscolaridad == 8 ? "Maestría" : idEscolaridad == 9 ? "Doctorado" : idEscolaridad == 10 ? "No especificado" : idEscolaridad == 11 ? "Primaria terminada" : idEscolaridad == 12 ? "Secundaria terminada" : idEscolaridad == 13 ? "Preparatoria terminada" : idEscolaridad == 14 ? "No especificado" : "";
            string Estadoconyugal = idEstadoconyugal == 1 ? "Casado(a)" : idEstadoconyugal == 2 ? "Soltero(a)" : idEstadoconyugal == 3 ? "Viudo(a)" : idEstadoconyugal == 4 ? "Divorciado(a)" : idEstadoconyugal == 5 ? "Unión libre" : idEstadoconyugal == 6 ? "Sociedad en convivencia" : idEstadoconyugal == 7 ? "Separado(a)" : idEstadoconyugal == 8 ? "No especificado" : idEstadoconyugal == 9 ? "Se desconoce" : "";
            string Ocupacion = idOcupacion == 1 ? "Trabajador(a) doméstico" : idOcupacion == 2 ? "Comerciante" : idOcupacion == 3 ? "Desempleado(a)" : idOcupacion == 4 ? "Empleado(a) de comercio" : idOcupacion == 5 ? "Estudiante" : idOcupacion == 6 ? "Funcionario(a) del sector público" : idOcupacion == 7 ? "Periodista" : idOcupacion == 8 ? "Otro" : idOcupacion == 9 ? "No especificado" : "";
            string Discapacidad = idDiscapacidad == 1 ? "Visual" : idDiscapacidad == 2 ? "Auditiva" : idDiscapacidad == 3 ? "Para hablar" : idDiscapacidad == 4 ? "Mental" : idDiscapacidad == 5 ? "Motriz" : idDiscapacidad == 6 ? "Ninguna" : idDiscapacidad == 7 ? "No especificado" : "";
            string Gruposocial = idGruposocial == 1 ? "Indígena" : idGruposocial == 2 ? "VIH/Sida" : idGruposocial == 3 ? "Internos en reclusorios" : idGruposocial == 4 ? "Migrante" : idGruposocial == 5 ? "No Heterosexual" : idGruposocial == 6 ? "Personas con discapacidad" : idGruposocial == 7 ? "No pertenece" : idGruposocial == 8 ? "Otro" : idGruposocial == 9 ? "No especificado" : "";
            string VioMujer = violenciamujer == 1 ? "Si" : violenciamujer == 0 ? "No" : "";
            string Hijosvivos = idHijosvivos == 1 ? "Sin hijos/as" : idHijosvivos == 2 ? "1 hijo/a" : idHijosvivos == 3 ? "2 hijos/as" : idHijosvivos == 4 ? "3 hijos/as" : idHijosvivos == 5 ? "4 hijos/as" : idHijosvivos == 6 ? "5 hijos/as" : idHijosvivos == 7 ? "No especifica" : "";
            string Modalidadvio = idModalidadvio == 1 ? "Familiar" : idModalidadvio == 2 ? "Laboral" : idModalidadvio == 3 ? "Docente (Escolar)" : idModalidadvio == 4 ? "Istitucional" : idModalidadvio == 5 ? "Feminicidio" : idModalidadvio == 6 ? "No especifica" : "";
            string Tipoviole = idTipoviole == 1 ? "Hijo(a)" : idTipoviole == 2 ? "Esposo(a) o Compañero(a)" : idTipoviole == 3 ? "Trabajador(a)" : idTipoviole == 4 ? "Sin parentesco" : idTipoviole == 5 ? "No especifica" : "";
            string Relacionagresor = idRelacionagresor == 1 ? "Hijo(a)" : idRelacionagresor == 2 ? "Esposo(a) o Compañero(a)" : idRelacionagresor == 3 ? "Trabajador(a) Doméstico(a)" : idRelacionagresor == 4 ? "Sin parentesco" : idRelacionagresor == 5 ? "Huésped" : idRelacionagresor == 6 ? "Otra relación" : idRelacionagresor == 7 ? "Otro Parentesco" : idRelacionagresor == 8 ? "No especificado" : "";
            string tipuser_bita = "";
            if (tipouser== "Peticionario")
            {
                tipuser_bita = "Quejoso";
            }
            else
            {
                tipuser_bita = tipouser;
            }
            // Se valida si quiere editar el complemento actual de peticionario o si es uno nuevo
            if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
            {
                // Al insertar si no existe id de queja no se registra en el campo ID_EXPEDIENTE de la tabla complemento_peticionario
                if (id_queja == "")
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
                    "'" + otroGenero + "'," +
                    "'" + VersionComplemento + "'";
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", "-", cp, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", "-", estado, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", "-", colonia, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", "-", municipio, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", "-", ciudad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", "-", calle, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", "-", nexterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", "-", ninterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Fecha Nacimiento", "-", fechanac, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", "-", edad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", "-", telefono, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", "-", email, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", "-", tipuser_bita, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", "-", sexo, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", "-", genero, Ipaccesible);
                    if (genero == "Otro"){ ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", "-", otroGenero, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", "-", nacionalidad, Ipaccesible);
                    if (nacionalidad == "Extranjero")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", "-", migOrigen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", "-", migDestino, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", "-", migidPrimeramex, Ipaccesible);
                    }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", "-", sabeleer, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", "-", Escolaridad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", "-", Estadoconyugal, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", "-", Ocupacion, Ipaccesible);
                    if (Ocupacion=="Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", "-", Otraocupacion, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", "-", Discapacidad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", "-", Gruposocial, Ipaccesible);
                    if (Gruposocial == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", "-", otroGruposocial, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", "-", idLenguaindigena, Ipaccesible);
                    if (idLenguaindigena == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", "-", otraLenguaindigena, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", "-", VioMujer, Ipaccesible);
                    if (VioMujer=="Si")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", "-", Canalizaciondepen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", "-", idEmbarazada, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", "-", IngresosMensuales, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", "-", Hijosvivos, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", "-", Modalidadvio, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", "-", Tipoviole, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", "-", Relacionagresor, Ipaccesible);
                    }
                }
                // Si el id de queja ya existe entonces se registra en el campo ID_EXPEDIENTE de la tabla complemento_peticionario
                else
                {
                    string idQuejaReal = id_queja.Split(',')[0];

                    query = "exec Sp_InsertComplementoPeticionarioQueja " +
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
                   "'" + otroGenero + "'," +
                  "" + Convert.ToInt32(idQuejaReal) + "";
                    tipoMod = "Alta";
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", "-", cp, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", "-", estado, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", "-", colonia, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", "-", municipio, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", "-", ciudad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", "-", calle, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", "-", nexterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", "-", ninterior, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Fecha Nacimiento", "-", fechanac, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", "-", edad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", "-", telefono, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", "-", email, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", "-", tipuser_bita, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", "-", sexo, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", "-", genero, Ipaccesible);
                    if (genero == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", "-", otroGenero, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", "-", nacionalidad, Ipaccesible);
                    if (nacionalidad == "Extranjero")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", "-", migOrigen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", "-", migDestino, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", "-", migidPrimeramex, Ipaccesible);
                    }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", "-", sabeleer, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", "-", Escolaridad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", "-", Estadoconyugal, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", "-", Ocupacion, Ipaccesible);
                    if (Ocupacion == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", "-", Otraocupacion, Ipaccesible); }


                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", "-", Discapacidad, Ipaccesible);
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", "-", Gruposocial, Ipaccesible);
                    if (Gruposocial == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", "-", otroGruposocial, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", "-", idLenguaindigena, Ipaccesible);
                    if (idLenguaindigena == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", "-", otraLenguaindigena, Ipaccesible); }
                    ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", "-", VioMujer, Ipaccesible);
                    if (VioMujer == "Si")
                    {
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", "-", Canalizaciondepen, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", "-", idEmbarazada, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", "-", IngresosMensuales, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", "-", Hijosvivos, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", "-", Modalidadvio, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", "-", Tipoviole, Ipaccesible);
                        ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", "-", Relacionagresor, Ipaccesible);
                    }
                }
            }
            // Si el complemento peticionario ya existe entonces se actualiza
            else
            {
                ComplementoPeticionario compet = new ComplementoPeticionario();
                queryPeticionario = "Sp_GetDataPeticionarioxIdComp1 " + idcomplementopet;
                var data_comp_pet = GetDatosGeneral(queryPeticionario);
                foreach (DataRow row in data_comp_pet.Rows)
                {
                    compet.TipoUsuario = row["TIPO_USUARIO"].ToString();
                    compet.Calle = (row["CALLE"].ToString());
                    compet.NumExterior = (row["NUM_EXTERIOR"].ToString());
                    compet.NumInterior = (row["NUM_INTERIOR"].ToString());
                    compet.Colonia = (row["COLONIA"].ToString());
                    compet.Ciudad = (row["CIUDAD"].ToString());
                    compet.Municipio = (row["MUNICIPIO"].ToString());
                    compet.Estado = (row["ESTADO"].ToString());
                    compet.CodigoPostal = (row["CODIGO_POSTAL"].ToString());
                    compet.Telefono = (row["TELEFONO"].ToString());
                    compet.Edad = (row["EDAD"].ToString());
                    compet.Email = (row["EMAIL"].ToString());
                    compet.FkSexo = Convert.ToInt32(row["FK_SEXO"].ToString());
                    compet.FkEscolaridad = Convert.ToInt32(row["FK_ESCOLARIDAD"].ToString());
                    compet.FkEstadoConyugal = Convert.ToInt32(row["FK_ESTADO_CONYUGAL"].ToString());
                    compet.FkOcupacion = Convert.ToInt32(row["FK_OCUPACION"].ToString());
                    compet.OtraOcupacion = (row["OTRA_OCUPACION"].ToString());
                    compet.Nacionalidad = (row["NACIONALIDAD"].ToString());
                    compet.SabeLeer = (row["SABE_LEER"].ToString());
                    compet.FkDiscapacidad = Convert.ToInt32(row["FK_DISCAPACIDAD"].ToString());
                    compet.FkGrupoSocial = Convert.ToInt32(row["FK_GRUPO_SOCIAL"].ToString());
                    compet.OtroGsocial = (row["OTRO_GSOCIAL"].ToString());
                    compet.HablaLenguai = (row["HABLA_LENGUAI"].ToString());
                    compet.LenguaIndigena = (row["LENGUA_INDIGENA"].ToString());
                    compet.FechaNacimiento = Convert.ToDateTime(row["FECHA_NACIMIENTO"].ToString());
                    compet.OrigenMigrante = (row["ORIGEN_MIGRANTE"].ToString());
                    compet.DestinoMigrante = (row["DESTINO_MIGRANTE"].ToString());
                    compet.PrimeravmexMigrante = (row["PRIMERAVMEX_MIGRANTE"].ToString());
                    compet.ViolenciaVm = Convert.ToInt32(row["VIOLENCIA_VM"].ToString());
                    compet.CanalizacionVm = (row["CANALIZACION_VM"].ToString());
                    compet.EmbarazadaVm = (row["EMBARAZADA_VM"].ToString());
                    compet.FkHijosVivos = Convert.ToInt32(row["FK_HIJOS_VIVOS"].ToString());
                    compet.FkModalidadViolencia = Convert.ToInt32(row["FK_MODALIDAD_VIOLENCIA"].ToString());
                    compet.FkTipoViolencia = Convert.ToInt32(row["FK_TIPO_VIOLENCIA"].ToString());
                    compet.FkRelacionAgresor = Convert.ToInt32(row["FK_RELACION_AGRESOR"].ToString());
                    compet.IngresosMensuales = (row["INGRESOS_MENSUALES"].ToString());
                    compet.Genero = (row["GENERO"].ToString());
                    compet.OtroGenero = (row["OTRO_GENERO"].ToString());
                }
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
                  "'" + otroGenero + "'," +
                  "'" + VersionComplemento + "'";
                tipoMod = "Modificación";
                string sexoFK = compet.FkSexo == 1 ? "Masculino" : compet.FkSexo == 2 ? "Femenino" : compet.FkSexo == 3 ? "No proporcionado" : "";
                string EscolaridadFK = compet.FkEscolaridad == 1 ? "Sin escolaridad" : compet.FkEscolaridad == 2 ? "Preescolar" : compet.FkEscolaridad == 3 ? "Primaria" : compet.FkEscolaridad == 4 ? "Secundaria" : compet.FkEscolaridad == 5 ? "Preparatoria o Bachillerato" : compet.FkEscolaridad == 6 ? "Normal Básica" : compet.FkEscolaridad == 7 ? "Profesional" : compet.FkEscolaridad == 8 ? "Maestría" : compet.FkEscolaridad == 9 ? "Doctorado" : compet.FkEscolaridad == 10 ? "No especificado" : compet.FkEscolaridad == 11 ? "Primaria terminada" : compet.FkEscolaridad == 12 ? "Secundaria terminada" : compet.FkEscolaridad == 13 ? "Preparatoria terminada" : compet.FkEscolaridad == 14 ? "No especificado" : "";
                string EstadoconyugalFK = compet.FkEstadoConyugal == 1 ? "Casado(a)" : compet.FkEstadoConyugal == 2 ? "Soltero(a)" : compet.FkEstadoConyugal == 3 ? "Viudo(a)" : compet.FkEstadoConyugal == 4 ? "Divorciado(a)" : compet.FkEstadoConyugal == 5 ? "Unión libre" : compet.FkEstadoConyugal == 6 ? "Sociedad en convivencia" : compet.FkEstadoConyugal == 7 ? "Separado(a)" : compet.FkEstadoConyugal == 8 ? "No especificado" : compet.FkEstadoConyugal == 9 ? "Se desconoce" : "";
                string OcupacionFK = compet.FkOcupacion == 1 ? "Trabajador(a) doméstico" : compet.FkOcupacion == 2 ? "Comerciante" : compet.FkOcupacion == 3 ? "Desempleado(a)" : compet.FkOcupacion == 4 ? "Empleado(a) de comercio" : compet.FkOcupacion == 5 ? "Estudiante" : compet.FkOcupacion == 6 ? "Funcionario(a) del sector público" : compet.FkOcupacion == 7 ? "Periodista" : compet.FkOcupacion == 8 ? "Otro" : compet.FkOcupacion == 9 ? "No especificado" : "";
                string DiscapacidadFK = compet.FkDiscapacidad == 1 ? "Visual" : compet.FkDiscapacidad == 2 ? "Auditiva" : compet.FkDiscapacidad == 3 ? "Para hablar" : compet.FkDiscapacidad == 4 ? "Mental" : compet.FkDiscapacidad == 5 ? "Motriz" : compet.FkDiscapacidad == 6 ? "Ninguna" : compet.FkDiscapacidad == 7 ? "No especificado" : "";
                string GruposocialFK = compet.FkGrupoSocial == 1 ? "Indígena" : compet.FkGrupoSocial == 2 ? "VIH/Sida" : compet.FkGrupoSocial == 3 ? "Internos en reclusorios" : compet.FkGrupoSocial == 4 ? "Migrante" : compet.FkGrupoSocial == 5 ? "No Heterosexual" : compet.FkGrupoSocial == 6 ? "Personas con discapacidad" : compet.FkGrupoSocial == 7 ? "No pertenece" : compet.FkGrupoSocial == 8 ? "Otro" : compet.FkGrupoSocial == 9 ? "No especificado" : "";
                string VioMujerFK = compet.ViolenciaVm == 1 ? "Si" : compet.ViolenciaVm == 0 ? "No" : "";
                string HijosvivosFK = compet.FkHijosVivos == 1 ? "Sin hijos/as" : compet.FkHijosVivos == 2 ? "1 hijo/a" : compet.FkHijosVivos == 3 ? "2 hijos/as" : compet.FkHijosVivos == 4 ? "3 hijos/as" : compet.FkHijosVivos == 5 ? "4 hijos/as" : compet.FkHijosVivos == 6 ? "5 hijos/as" : compet.FkHijosVivos == 7 ? "No especifica" : "";
                string ModalidadvioFK = compet.FkModalidadViolencia == 1 ? "Familiar" : compet.FkModalidadViolencia == 2 ? "Laboral" : compet.FkModalidadViolencia == 3 ? "Docente (Escolar)" : compet.FkModalidadViolencia == 4 ? "Istitucional" : compet.FkModalidadViolencia == 5 ? "Feminicidio" : compet.FkModalidadViolencia == 6 ? "No especifica" : "";
                string TipovioleFK = compet.FkTipoViolencia == 1 ? "Hijo(a)" : compet.FkTipoViolencia == 2 ? "Esposo(a) o Compañero(a)" : compet.FkTipoViolencia == 3 ? "Trabajador(a)" : compet.FkTipoViolencia == 4 ? "Sin parentesco" : compet.FkTipoViolencia == 5 ? "No especifica" : "";
                string RelacionagresorFK = compet.FkRelacionAgresor == 1 ? "Hijo(a)" : compet.FkRelacionAgresor == 2 ? "Esposo(a) o Compañero(a)" : compet.FkRelacionAgresor == 3 ? "Trabajador(a) Doméstico(a)" : compet.FkRelacionAgresor == 4 ? "Sin parentesco" : compet.FkRelacionAgresor == 5 ? "Huésped" : compet.FkRelacionAgresor == 6 ? "Otra relación" : compet.FkRelacionAgresor == 7 ? "Otro Parentesco" : compet.FkRelacionAgresor == 8 ? "No especificado" : "";

                //ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de Persona", "tipo_persona", tipo_persona, Ipaccesible);
                if (compet.CodigoPostal != cp) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "CP", compet.CodigoPostal, cp, Ipaccesible); }
                if (compet.Estado != estado) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado", compet.Estado, estado, Ipaccesible); }
                if (compet.Colonia != colonia) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Colonia", compet.Colonia, colonia, Ipaccesible); }
                if (compet.Municipio != municipio) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Municipio", compet.Municipio, municipio, Ipaccesible); }
                if (compet.Ciudad != ciudad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ciudad/Localidad", compet.Ciudad, ciudad, Ipaccesible); }
                if (compet.Calle != calle) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Calle", compet.Calle, calle, Ipaccesible); }
                if (compet.NumExterior != nexterior) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Exterior", compet.NumExterior, nexterior, Ipaccesible); }
                if (compet.NumInterior != ninterior) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "No. Interior", compet.NumInterior, ninterior, Ipaccesible); }
                DateTime fechaTemp;
                DateTime? fechaNacConver = null;

                if (DateTime.TryParse(fechanac, out fechaTemp))
                {
                    fechaNacConver = fechaTemp;
                }
                if (compet.FechaNacimiento != fechaNacConver) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "FeCPcha Nacimiento", compet.FechaNacimiento.ToString(), fechanac, Ipaccesible); }
                if (compet.Edad != edad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Edad", compet.Edad, edad, Ipaccesible); }
                if (compet.Telefono != telefono) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Teléfono", compet.Telefono, telefono, Ipaccesible); }
                if (compet.Email != email) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Correo Electrónico", compet.Email, email, Ipaccesible); }
                if (compet.TipoUsuario != tipouser) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo Usuario", compet.TipoUsuario, tipuser_bita, Ipaccesible); }
                if (sexoFK != sexo) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Sexo", sexoFK, sexo, Ipaccesible); }
                if (compet.Genero != genero) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Género", compet.Genero, genero, Ipaccesible); }
                if (compet.OtroGenero != otroGenero) { if (genero == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro género", compet.OtroGenero, otroGenero, Ipaccesible); } }
                if (compet.Nacionalidad != nacionalidad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Nacionalidad", compet.Nacionalidad, nacionalidad, Ipaccesible); }
                if (nacionalidad == "Extranjero")
                {
                    if (compet.OrigenMigrante != migOrigen) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Origen (Migrante)", compet.OrigenMigrante, migOrigen, Ipaccesible); }
                    if (compet.DestinoMigrante != migDestino) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Destino (Migrante)", compet.DestinoMigrante, migDestino, Ipaccesible); }
                    if (compet.PrimeravmexMigrante != migidPrimeramex) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Primera vez en Mex. (Migrante)", compet.PrimeravmexMigrante, migidPrimeramex, Ipaccesible); }
                }
                if (compet.SabeLeer != sabeleer) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "¿Sabe leer y escribir?", compet.SabeLeer, sabeleer, Ipaccesible); }
                if (EscolaridadFK != Escolaridad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Escolaridad", EscolaridadFK, Escolaridad, Ipaccesible); }
                if (EstadoconyugalFK != Estadoconyugal) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Estado Conyugal", EstadoconyugalFK, Estadoconyugal, Ipaccesible); }
                if (OcupacionFK != Ocupacion) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ocupación", OcupacionFK, Ocupacion, Ipaccesible); }
                if (compet.OtraOcupacion != Otraocupacion) { if (Ocupacion == "Otro") { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra Ocupación", compet.OtraOcupacion, Otraocupacion, Ipaccesible); } }
                if (DiscapacidadFK != Discapacidad) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Discapacidad", DiscapacidadFK, Discapacidad, Ipaccesible); }
                if (GruposocialFK != Gruposocial) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Grupo social", GruposocialFK, Gruposocial, Ipaccesible); }
                if (compet.OtroGsocial != otroGruposocial) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otro grupo social", compet.OtroGsocial, otroGruposocial, Ipaccesible); }
                if (compet.HablaLenguai != idLenguaindigena) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Lengua indigena", compet.HablaLenguai, idLenguaindigena, Ipaccesible); }
                if (compet.LenguaIndigena != otraLenguaindigena) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Otra lengua indigena", compet.LenguaIndigena, otraLenguaindigena, Ipaccesible); }
                if (VioMujerFK != VioMujer) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Violencia a la mujer", VioMujerFK, VioMujer, Ipaccesible); }
                if (VioMujer == "Si")
                {
                    if (compet.CanalizacionVm != Canalizaciondepen) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Canalizacion", compet.CanalizacionVm, Canalizaciondepen, Ipaccesible); }
                    if (compet.EmbarazadaVm != idEmbarazada) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Embarazada", compet.EmbarazadaVm, idEmbarazada, Ipaccesible); }
                    if (compet.IngresosMensuales != IngresosMensuales) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Ingreso Mensual", compet.IngresosMensuales, IngresosMensuales, Ipaccesible); }
                    if (HijosvivosFK != Hijosvivos) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Hijos vivos", HijosvivosFK, Hijosvivos, Ipaccesible); }
                    if (ModalidadvioFK != Modalidadvio) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Modalidad violencia", ModalidadvioFK, Modalidadvio, Ipaccesible); }
                    if (TipovioleFK != Tipoviole) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Tipo de violencia", TipovioleFK, Tipoviole, Ipaccesible); }
                    if (RelacionagresorFK != Relacionagresor) { ContBitacora(txtcontBuilder, "Datos Personales", tipoMod, "Relacion agresor", RelacionagresorFK, Relacionagresor, Ipaccesible); }
                }
            }
            int idcomp = 0;

            if (string.IsNullOrEmpty(idcomplementopet) || idcomplementopet == "0")
            {
                // 🔥 INSERT → correcto usar Regresaid
                Console.WriteLine("ID COMPLEMENTO: " + idcomplementopet);
                Console.WriteLine(query);
                idcomp = conexionsql.InsertUpdateDeleteRegresaid(query);
            }
            else
            {
                Console.WriteLine("ID COMPLEMENTO: " + idcomplementopet);
                Console.WriteLine(query);

                conexionsql.InsertUpdateDelete(query);

                int.TryParse(idcomplementopet, out idcomp);

                return Json(new
                {
                    idcomplemento = idcomp,
                    idpeticionario = idPetit,
                    idqueja = 1,
                    tipousuario = tipouser,
                    nombrepet = $"{nombre} {apellidop} {apellidom}"
                });
            }
            int id_quejaR = 0;
            Console.WriteLine("id_queja = [" + id_queja + "]");
            if (string.IsNullOrWhiteSpace(id_queja))
            {
                int.TryParse(
                    conexionsql.ObtenerReader("SELECT MAX(id_expediente)+1 FROM EXPEDIENTE"),
                    out id_quejaR
                );
            }
            else
            {
                int.TryParse(id_queja, out id_quejaR);
            }
            CrearBitacoraTXT(id_quejaR, txtcontBuilder.ToString());

            return Json(new { idcomplemento = idcomp, idpeticionario = idPetit, idqueja = 1, tipousuario = tipouser, nombrepet = nombre + ' ' + apellidop + ' ' + apellidom });

        }
        // -Fred 09/04/2026
        public async Task<ActionResult> GetDataPeticionario(IFormCollection form)
        {
            string curp = form["curp"].ToString();
            string idcomp = form["idcomp"].ToString();
            string nombre = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre"].ToString().ToLower());
            string apellidop = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop"].ToString().ToLower());
            string apellidom = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom"].ToString().ToLower());


            System.Diagnostics.Debug.WriteLine($"IDCOMP:{idcomp} CURP:{curp} LONG:{curp?.Length}"); //Retirar -Fred

            String query = "";
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();
            DataTable data = new DataTable();

            if (!string.IsNullOrWhiteSpace(idcomp))
            {
                query = "exec Sp_GetDataPeticionarioxIdComp1 '" + idcomp + "'";
                data = GetDatosGeneral(query);

                if (data.Rows.Count == 0 && !string.IsNullOrWhiteSpace(curp) && curp != "No proporcionado")
                {
                    System.Diagnostics.Debug.WriteLine("Fallback a CURP");
                    query = "exec Sp_GetDataPeticionario '" + curp.ToUpper() + "'";
                    data = GetDatosGeneral(query);
                }
            }
            else if (!string.IsNullOrWhiteSpace(curp) && curp != "No proporcionado")
            {
                query = "exec Sp_GetDataPeticionario '" + curp.ToUpper() + "'";
                data = GetDatosGeneral(query);
            }
            else
            {
                query = "exec Sp_GetDataPeticionarioXNombre '" + nombre + "','" + apellidop + "','" + apellidom + "'";
                data = GetDatosGeneral(query);
            }


            lPeticionario = ObtenerlistPeticionario(data);

            return Json(new { data = lPeticionario });
        }

        public async Task<ActionResult> Sp_Get_Auto_Pet(IFormCollection form)
        {
            string curp = form["curp"].ToString();
            string idcomp = form["idcomp"].ToString();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre"].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop"].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom"].ToString().ToLower()));
            string numRepPet = conexionsql.ObtenerReader("exec Sp_Get_Auto_Pet '" + idcomp + "','" + curp.ToUpper() + "','" + nombre + "','" + apellidop + "','" + apellidom + "'");
            return Json(new { numrep = numRepPet });
        }
        // -Fred 09/04/2026
        public List<PdfDatosPeticionario> ObtenerlistPeticionario(DataTable data)
        {
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();

            if (data == null || data.Rows.Count == 0)
            {
                System.Diagnostics.Debug.WriteLine("No hay registros en el DataTable");
                return lPeticionario;
            }

            System.Diagnostics.Debug.WriteLine("FILAS: " + data.Rows.Count);

            foreach (DataRow row in data.Rows)
            {
                PdfDatosPeticionario peticionario = new PdfDatosPeticionario();

                // Debug
                System.Diagnostics.Debug.WriteLine("ID_EXPEDIENTE: " + GetInt(row, "ID_EXPEDIENTE"));
                System.Diagnostics.Debug.WriteLine("NOMBRE: " + GetString(row, "NOMBRE"));

                peticionario.FkRegRecepcion = GetInt(row, "ID_REGISTRO");
                peticionario.Nombre = GetString(row, "NOMBRE");
                peticionario.ApellidoPat = GetString(row, "APELLIDO_PAT");
                peticionario.ApellidoMat = GetString(row, "APELLIDO_MAT");
                peticionario.DocIdentificatorio = GetString(row, "DOC_IDENTIFICATORIO");

                if (data.Columns.Contains("idSelect"))
                    peticionario.tipopet = GetString(row, "idSelect");

                peticionario.IdComplementoPeticionario = GetInt(row, "ID_COMPLEMENTO_PETICIONARIO");
                peticionario.CodigoPostal = GetString(row, "CODIGO_POSTAL");
                peticionario.Colonia = GetString(row, "COLONIA");
                peticionario.Ciudad = GetString(row, "CIUDAD");
                peticionario.Municipio = GetString(row, "MUNICIPIO");
                peticionario.Estado = GetString(row, "ESTADO");
                peticionario.Calle = GetString(row, "CALLE");
                peticionario.NumExterior = GetString(row, "NUM_EXTERIOR");
                peticionario.NumInterior = GetString(row, "NUM_INTERIOR");

                peticionario.FechaNacimiento = GetDate(row, "FECHA_NACIMIENTO");

                peticionario.Edad = GetString(row, "EDAD");
                peticionario.Telefono = GetString(row, "TELEFONO");
                peticionario.Email = GetString(row, "EMAIL");
                peticionario.TipoUsuario = GetString(row, "TIPO_USUARIO");

                peticionario.FkSexo = GetInt(row, "FK_SEXO");
                peticionario.Nacionalidad = GetString(row, "NACIONALIDAD");
                peticionario.SabeLeer = GetString(row, "SABE_LEER");

                peticionario.FkEscolaridad = GetInt(row, "FK_ESCOLARIDAD");
                peticionario.FkEstadoConyugal = GetInt(row, "FK_ESTADO_CONYUGAL");
                peticionario.FkOcupacion = GetInt(row, "FK_OCUPACION");

                peticionario.OtraOcupacion = GetString(row, "OTRA_OCUPACION");

                peticionario.FkDiscapacidad = GetInt(row, "FK_DISCAPACIDAD");
                peticionario.FkGrupoSocial = GetInt(row, "FK_GRUPO_SOCIAL");

                peticionario.OtroGsocial = GetString(row, "OTRO_GSOCIAL");
                peticionario.HablaLenguai = GetString(row, "HABLA_LENGUAI");
                peticionario.LenguaIndigena = GetString(row, "LENGUA_INDIGENA");

                peticionario.OrigenMigrante = GetString(row, "ORIGEN_MIGRANTE");
                peticionario.DestinoMigrante = GetString(row, "DESTINO_MIGRANTE");
                peticionario.PrimeravmexMigrante = GetString(row, "PRIMERAVMEX_MIGRANTE");

                peticionario.ViolenciaVm = GetInt(row, "VIOLENCIA_VM");

                peticionario.CanalizacionVm = GetString(row, "CANALIZACION_VM");
                peticionario.EmbarazadaVm = GetString(row, "EMBARAZADA_VM");
                peticionario.IngresosMensuales = GetString(row, "INGRESOS_MENSUALES");

                peticionario.FkHijosVivos = GetInt(row, "FK_HIJOS_VIVOS");
                peticionario.FkModalidadViolencia = GetInt(row, "FK_MODALIDAD_VIOLENCIA");
                peticionario.FkTipoViolencia = GetInt(row, "FK_TIPO_VIOLENCIA");
                peticionario.FkRelacionAgresor = GetInt(row, "FK_RELACION_AGRESOR");

                peticionario.Genero = GetString(row, "GENERO");
                peticionario.OtroGenero = GetString(row, "OTRO_GENERO");

                peticionario.IdExpediente = GetInt(row, "ID_EXPEDIENTE");

                lPeticionario.Add(peticionario);
            }

            return lPeticionario;
        }
        // -Fred 09/04/2026
        private string GetString(DataRow row, string column)
        {
            return row.Table.Columns.Contains(column) && row[column] != DBNull.Value
                ? row[column].ToString()
                : "";
        }
        // -Fred 09/04/2026
        private int GetInt(DataRow row, string column)
        {
            if (!row.Table.Columns.Contains(column) || row[column] == DBNull.Value)
                return 0;

            int.TryParse(row[column].ToString(), out int value);
            return value;
        }
        // -Fred 09/04/2026
        private DateTime GetDate(DataRow row, string column)
        {
            if (!row.Table.Columns.Contains(column) || row[column] == DBNull.Value)
                return DateTime.MinValue;

            DateTime.TryParse(row[column].ToString(), out DateTime value);
            return value;
        }
        public ActionResult DatosPeticionarioActac(IFormCollection form)
        {

            string idqueja = form["id_queja"].ToString();
            string idpeticionario = form["id_peticionario"].ToString();
            string idcomplementopet = form["id_complemento"].ToString();

            String query = "";
            bool status = false;
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();

            if (idcomplementopet != "" && idqueja != "")
            {
                query = "exec Sp_GetDataPeticionarioActac " + "'" + idcomplementopet + "', '" + idqueja + "'";
                status = true;
            }

            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {
                PdfDatosPeticionario peticionario = new PdfDatosPeticionario();
                peticionario.IdComplementoPeticionario = Convert.ToInt32(row["ID_COMPLEMENTO_PETICIONARIO"]);
                peticionario.FkRegRecepcion = Convert.ToInt32(row["FK_REG_RECEPCION"]);
                peticionario.Edad = (row["EDAD"]).ToString();
                peticionario.SabeLeer = (row["SABE_LEER"]).ToString();
                peticionario.nombreEscolaridad = (row["NOMBRE_ESCOLARIDAD"]).ToString();
                peticionario.Calle = (row["CALLE"]).ToString();
                peticionario.NumExterior = (row["NUM_EXTERIOR"]).ToString();
                peticionario.NumInterior = (row["NUM_INTERIOR"]).ToString();
                peticionario.CodigoPostal = (row["CODIGO_POSTAL"]).ToString();
                peticionario.Colonia = (row["COLONIA"]).ToString();
                peticionario.Municipio = (row["MUNICIPIO"]).ToString();
                peticionario.Estado = (row["ESTADO"]).ToString();
                peticionario.nombreOcupacion = (row["NOMBRE_OCUPACION"]).ToString();
                peticionario.Telefono = (row["TELEFONO"]).ToString();
                peticionario.Email = (row["EMAIL"]).ToString();
                lPeticionario.Add(peticionario);
            }

            return Json(new { data = lPeticionario, status = status });

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

        // Lista Autoridades
        public ActionResult SelectAutoridad()
        {
            List<GeneralModel.Selectmaster> autoridades = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_AUTORIDAD";
            string mensaje = "";
            autoridades = conexionsql.selectMaestro(query, ref mensaje);
            autoridades = autoridades.OrderBy(x => x.Descripcion).ToList();

            if (autoridades.Count > 0)
            {
                return Json(new { Sautoridades = autoridades });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Autoridades

        // Lista Autoridades con filtro
        public ActionResult SelectAutoridadFil(int tipo)
        {
            List<GeneralModel.Selectmaster> autoridades = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_AUTORIDAD_FIL " + tipo;
            string mensaje = "";
            autoridades = conexionsql.selectMaestro(query, ref mensaje);
            autoridades = autoridades.OrderBy(x => x.Descripcion).ToList();

            if (autoridades.Count > 0)
            {
                return Json(new { Sautoridades = autoridades });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Autoridades con filtro

        // Lista Autoridades
        public ActionResult SelectHechVio()
        {
            List<GeneralModel.Selectmaster> hechvio = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_HECHOSVI";
            string mensaje = "";
            hechvio = conexionsql.selectMaestro(query, ref mensaje);
            hechvio = hechvio.OrderBy(x => x.Descripcion).ToList();

            if (hechvio.Count > 0)
            {
                return Json(new { Shechvio = hechvio });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Autoridades

        // Lista Tipo Diligencias
        public ActionResult SelectDiligen()
        {
            List<GeneralModel.Selectmaster> diligencias = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_DILIGENCIAS";
            string mensaje = "";
            diligencias = conexionsql.selectMaestro(query, ref mensaje);
            diligencias = diligencias.OrderBy(x => x.Descripcion).ToList();

            if (diligencias.Count > 0)
            {
                return Json(new { Sdilige = diligencias });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Autoridades

        // Lista Tema
        public ActionResult SelectTema()
        {
            List<GeneralModel.Selectmaster> temas = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_TEMA";
            string mensaje = "";
            temas = conexionsql.selectMaestro(query, ref mensaje);
            temas = temas.OrderBy(x => x.Descripcion).ToList();

            if (temas.Count > 0)
            {
                return Json(new { Stemas = temas });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Tema

        // Lista Peticionario Moral
        public ActionResult SelectPetMoral()
        {
            List<GeneralModel.Selectmaster> PMoral = new List<GeneralModel.Selectmaster>();
            String query = "exec Sp_Select_Morales";
            string mensaje = "";
            PMoral = conexionsql.selectMaestro(query, ref mensaje);
            //PMoral = PMoral.OrderBy(x => x.Descripcion).ToList();

            if (PMoral.Count > 0)
            {
                return Json(new { petimoral = PMoral });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Peticionario Moral

        // Lista Programa
        public ActionResult SelectPrograma()
        {
            List<GeneralModel.Selectmaster> programas = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_PROGRAMA";
            string mensaje = "";
            programas = conexionsql.selectMaestro(query, ref mensaje);
            programas = programas.OrderBy(x => x.Descripcion).ToList();

            if (programas.Count > 0)
            {
                return Json(new { Sprogramas = programas });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Programa

        // Lista Materia
        public ActionResult SelectMateria()
        {
            List<GeneralModel.Selectmaster> materia = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_MATERIA";
            string mensaje = "";
            materia = conexionsql.selectMaestro(query, ref mensaje);
            materia = materia.OrderBy(x => x.Descripcion).ToList();

            if (materia.Count > 0)
            {
                return Json(new { smateria = materia });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Materia

        // Lista Materia
        public ActionResult SelectTipExpediente()
        {
            List<GeneralModel.Selectmaster> tiexped = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_TIPEXPEDIENTE";
            string mensaje = "";
            tiexped = conexionsql.selectMaestro(query, ref mensaje);

            if (tiexped.Count > 0)
            {
                return Json(new { stipexped = tiexped });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Materia

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

        // Lista Visitadurias
        public ActionResult SelectVisitadurias()
        {
            List<GeneralModel.SelecVisitaduria> visitaduriasl = new List<GeneralModel.SelecVisitaduria>();
            String query = "exec Sp_GetVisitadurias";
            string mensaje = "";
            visitaduriasl = conexionsql.selectVisitadurias(query, ref mensaje);

            if (visitaduriasl.Count > 0)
            {
                return Json(new { visitadurias = visitaduriasl });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Visitadurias

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

        public ActionResult SelectEstados()
        {
            List<GeneralModel.Selectmaster> relacionestados = new List<GeneralModel.Selectmaster>();
            String query = "exec GET_ESTADOS";
            string mensaje = "";
            relacionestados = conexionsql.selectMaestro(query, ref mensaje);

            if (relacionestados.Count > 0)
            {
                return Json(new { relacionestado = relacionestados });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Paises 
        // Lista Via de Interposición
        public ActionResult CausaConclu()
        {
            List<SelectGenericostr> causac = new List<SelectGenericostr>();
            string mensaje = "";
            String query = "exec Sp_Select_CausaC";
            causac = conexionsql.lista_SelectGenericaSelectstr(query, ref mensaje);

            if (causac.Count > 0)
            {
                return Json(new { listacausa = causac });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        public ActionResult SelectViaInter()
        {
            List<SelectGenerico> listaVia = new List<SelectGenerico>();
            string mensaje = "";
            String query = "exec Sp_Select_ViaInterposicionQ";
            listaVia = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);

            if (listaVia.Count > 0)
            {
                return Json(new { listviai = listaVia });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin Lista Via de Interposición 
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
            listaContenedora2 = conexionsql.lista_SelectAutori(query, ref mensaje);

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
        public ActionResult ActaPDF(int idactac)
        {
            TempData["idactact"] = idactac;
            return RedirectToAction("Acta_Circunstanciada", new { idactac = idactac }); 
        }

        public async Task<IActionResult> Acta_Circunstanciada(int idactac)
        {
            string query = $"exec Sp_Regresa_Acta_Circunstanciada {idactac}";
            string mensaje = "";

            var actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);

            var pdf = new ViewAsPdf("ActaPDF", actaC)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                CustomSwitches =
                    $" --page-offset 0 --header-html {rutaencabezado} --header-spacing 20 " +
                    $" --margin-bottom 4cm --footer-spacing 9 --footer-html {rutapie} " +
                    $" --footer-right Página-[page]/[toPage] --footer-font-size 8"
            };

            //  Construir PDF en memoria
            byte[] pdfBytes = await pdf.BuildFile(ControllerContext);

            //  Nombre y ruta física
            var nombrePDF = $"acta_c_{idactac}.pdf";
            var ruta = Path.Combine(
                _hostingEnvironment.WebRootPath,
                "Archivos",
                "AC",
                nombrePDF
            );

            //  Asegurar carpeta
            Directory.CreateDirectory(Path.GetDirectoryName(ruta));

            //  Guardar archivo
            System.IO.File.WriteAllBytes(ruta, pdfBytes);

            //  Mostrar PDF al usuario
            return File(pdfBytes, "application/pdf");
        }

        //21 01 2025 JM:
        public ViewAsPdf Escrito_mod_de_Queja()
        {

            var pdfescritoi = new List<PDF_Escrito_Inical>();

            string query_petiexp = "";
            string query_lugar = "";
            string query_enlaceea = "";
            string query_uploads = "";

            int? idei = (int?)TempData["idescritort"];
            string query = "exec Sp_Pdfescritoinicial " + idei;
            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                PDF_Escrito_Inical itemPdfei = new PDF_Escrito_Inical();
                itemPdfei.Id = Convert.ToInt32(row["id_escritoidq"]);
                itemPdfei.IdQueja = Convert.ToInt32(row["id_queja"]);
                itemPdfei.FechaHechos = Convert.ToDateTime(row["fecha_Hechos"]);
                itemPdfei.CircuntanciasHechos = (row["circuntancias_Hechos"]).ToString();
                itemPdfei.fechactual = DateTime.Now;

                // Quejosos y agraviados ligados a este escrito
                List<RegRecepcion> peticionariolist = new List<RegRecepcion>();
                query_petiexp = "exec Sp_Pdfescritoinicial_pet " + "'" + Convert.ToInt32(row["id_Peticionario"]) + "'";
                var data_petiexp = GetDatosGeneral(query_petiexp);

                foreach (DataRow row_petiexp in data_petiexp.Rows)
                {
                    RegRecepcion peticionario = new RegRecepcion();
                    peticionario.IdRegistro = Convert.ToInt32(row_petiexp["ID_REGISTRO"]);
                    peticionario.Nombre = (row_petiexp["NOMBRE"]).ToString();
                    peticionario.ApellidoPat = (row_petiexp["APELLIDO_PAT"]).ToString();
                    peticionario.ApellidoMat = (row_petiexp["APELLIDO_MAT"]).ToString();
                    peticionariolist.Add(peticionario);
                }

                // Lugares ligados a este escrito
                List<PDF_Lugarhechos> lugareslist = new List<PDF_Lugarhechos>();
                query_lugar = "exec Sp_Pdfescritoinicial_lughe " + "'" + Convert.ToInt32(row["id_lugar_hechos"]) + "'";
                var data_lugares = GetDatosGeneral(query_lugar);

                foreach (DataRow row_lugei in data_lugares.Rows)
                {
                    PDF_Lugarhechos itemlugei = new PDF_Lugarhechos();
                    itemlugei.estado = (row_lugei["ESTADO"]).ToString();
                    itemlugei.municipio = (row_lugei["MUNICIPIO"]).ToString();
                    itemlugei.calle = (row_lugei["calle"]).ToString();
                    itemlugei.num_ext = (row_lugei["numero_ext"]).ToString();
                    itemlugei.num_int = (row_lugei["numero_int"]).ToString();
                    itemlugei.cp = Convert.ToInt32(row_lugei["CP"]);
                    itemlugei.colonia = (row_lugei["colonia"]).ToString();
                    lugareslist.Add(itemlugei);
                }

                // Autoridades ligados a este escrito
                List<PDF_Autoridadesei> autoridadeslist = new List<PDF_Autoridadesei>();
                query_enlaceea = "exec Sp_Pdfescritoinicial_autoridades " + "'" + Convert.ToInt32(row["id_escritoidq"]) + "'";
                var data_auei = GetDatosGeneral(query_enlaceea);

                foreach (DataRow row_auei in data_auei.Rows)
                {
                    PDF_Autoridadesei itemauei = new PDF_Autoridadesei();
                    itemauei.autoridad = (row_auei["AUTORIDAD"]).ToString();
                    itemauei.cargo_persona = (row_auei["CARGO_PERSONA"]).ToString();
                    itemauei.nombre_persona = (row_auei["NOMBRE_PERSONA"]).ToString();
                    autoridadeslist.Add(itemauei);
                }


                // Archivos adjuntos ligados a este escrito
                List<EnlaceArchivoadjuntoEscritoi> uploadslist = new List<EnlaceArchivoadjuntoEscritoi>();
                query_uploads = "exec Sp_Pdfescritoinicial_uploads " + "'" + Convert.ToInt32(row["id_escritoidq"]) + "'";
                var data_uploads = GetDatosGeneral(query_uploads);

                foreach (DataRow row_upload in data_uploads.Rows)
                {
                    EnlaceArchivoadjuntoEscritoi itemupload = new EnlaceArchivoadjuntoEscritoi();
                    itemupload.RutaArchivo = (row_upload["RUTA_ARCHIVO"]).ToString();
                    uploadslist.Add(itemupload);
                }

                itemPdfei.reg_recepcion = peticionariolist;
                itemPdfei.lugar_hechos = lugareslist;
                itemPdfei.enlace_ea = autoridadeslist;
                itemPdfei.uploadsei = uploadslist;

                pdfescritoi.Add(itemPdfei);
            }

            //return Content("PDF saved successfully");
            var nombrePDF = "Escrito_I_" + idei;
            return new ViewAsPdf("VerPDF", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 0, Right = 20 },
                // FileName=nombrePDF,
                //SaveOnServerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", nombrePDF+".pdf"),<----Error en El servidor
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html " + rutaencabezado + " --header-spacing 20 --margin-bottom 4cm --footer-spacing 9 --footer-html " + rutapie + " --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }
        public ActionResult EscritoInicial(int idEscrito)
        {
            TempData["idescritort"] = idEscrito;
            return RedirectToAction("Escrito_Inicial_de_Queja");
        }

        //public ViewAsPdf EscritoInicialPDF()
        //{
        //    int? id = TempData["idEscrito"] as int?;

        //    if (id == null)
        //        return null; // o View("Error")

        //    string mensaje = "";
        //    string query = "exec Sp_Regresa_Escrito_Inicial_Queja " + id;

        //    var escrito = conexionsql.regresaEscritoInicial(
        //        id.Value,     //  parámetro que faltaba
        //        query,
        //        ref mensaje
        //    );

        //    // I🔹 JM
        //    var lista = new List<SistemaIntegralQuejas.Models.EscritoModificado>
        //    {
        //        escrito
        //    };
        //    // F🔹 JM


        //    return new ViewAsPdf("EscritoInicialPDF", lista)
        //    {
        //        PageSize = Rotativa.AspNetCore.Options.Size.Letter
        //    };
        //}


        public IActionResult ValidaCedulasActivas(string id_complemento)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();

                    using (SqlCommand cmd = new SqlCommand("Sp_ValidaCedulasActivasPorPeticionario", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id_complemento", Convert.ToInt32(id_complemento));

                        SqlDataReader reader = cmd.ExecuteReader();
                        if (reader.Read())
                        {
                            string resultado = reader["CedulaLigada"].ToString();
                            if (resultado != "noexiste")
                            {
                                return Json(new
                                {
                                    success = false,
                                    message = $"Este formulario está ligado a una cédula activa ({resultado}). No se puede eliminar."
                                });
                            }
                        }
                    }

                    return Json(new { success = true });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error del servidor: {ex.Message}" });
            }
        }
        // Eliminar Peticionario 
        public ActionResult VerificaPetLigado(IFormCollection form)
        {
            string idcomplemento = form["id_complemento"].ToString();


            string quey_verificalig = "EXEC Sp_VerificaPetligado '" + idcomplemento + "'";
            var data_verificacion = GetDatosGeneral(quey_verificalig);
            var resp = data_verificacion.Rows[0].ItemArray[0].ToString();

            return Json(new { status = resp });
        }
        // Fin Eliminar Peticionario

        // Eliminar Peticionario 
        public ActionResult DeleteComPeticionario(IFormCollection form, string Ipaccesible)
        {
            String query = "";
            string idcomplemento = form["id_complemento"].ToString();
            string quey_insertqueja = "EXEC Sp_DeleteComPeticionario '" + idcomplemento + "'";
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_insertqueja);
            bool statusresp = false;

            query = "Sp_Regresa_IdExp_ComplementoPet " + idcomplemento;
            string idExp = conexionsql.ObtenerReader(query);

            query = "Sp_GET_NOMBPET_COMPLEMENTO " + idcomplemento;
            string nomPet = conexionsql.ObtenerReader(query); 
            

            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "";
        
            


            if (idqueja > 0)
            {
                statusresp = true;

                tipoMod = "Eliminación";

                ContBitacora(txtcontBuilder, "Formato de Datos Personales", tipoMod, "Agraviado(a) / Quejoso(a)", nomPet.ToString(), "-", Ipaccesible);
            }
            else
            {
                statusresp = false;
            }

            CrearBitacoraTXT(Convert.ToInt32(idExp), txtcontBuilder.ToString());
            return Json(new { status = statusresp });
        }
        // Fin Eliminar Peticionario
        public ActionResult DeleteDatosPersonales(IFormCollection form, string Ipaccesible)
        {
            String query = "";
            string idcomplemento = form["id_complemento"].ToString();
            bool statusresp = false;

            // 1. Obtener el ID del expediente vinculado ANTES de eliminar
            query = $"Sp_Regresa_IdExp_ComplementoPet {idcomplemento}";
            string idExp = conexionsql.ObtenerReader(query);

            // 2. Obtener el nombre completo del peticionario
            query = $"Sp_GET_NOMBPET_COMPLEMENTO {idcomplemento}";
            string nombre = conexionsql.ObtenerReader(query);

            // 3. Ejecutar el procedimiento para eliminar el peticionario
            query = $"EXEC Sp_DeleteComPeticionario '{idcomplemento}'";
            int resultado = conexionsql.InsertUpdateDeleteRegresaid(query);

            // 4. Preparar bitácora
            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "Eliminación";

            if (resultado > 0)
            {
                statusresp = true;
                ContBitacora(txtcontBuilder, "Formato de Datos Personales", tipoMod,
                             "Agraviado(a) / Quejoso(a)", nombre, "-", Ipaccesible);

                // 5. Validar que idExp sea numérico antes de convertir
                if (int.TryParse(idExp, out int idExpInt))
                {
                    CrearBitacoraTXT(idExpInt, txtcontBuilder.ToString());
                }
                else
                {
                    Console.WriteLine("No se pudo obtener un idExp válido, bitácora no registrada.");
                }
            }

            // 6. Devolver respuesta al frontend
            return Json(new { status = statusresp });
        }



        // Eliminar Peticionario 
        public ActionResult DeleteComPeticionarioCalificacion(IFormCollection form)
        {
            string idcomplemento = form["id_complemento"].ToString();
            string quey_insertqueja = "EXEC Sp_DeleteComPeticionarioSp_DeleteComPeticionariocalifi '" + idcomplemento + "'";
            conexionsql.InsertUpdateDelete(quey_insertqueja);

            return Json(new { status = "OK" });
        }
        // Fin Eliminar Peticionario


        // Eliminar Peticionario 
        public ActionResult DeleteExpediente(IFormCollection form)
        {
            string idexpediente = form["id_expediente"].ToString();
            string motivo = form["motivo"].ToString();
            string quey_delexp = "EXEC Sp_DeleteExpediente '" + idexpediente + "','" + motivo + "'";
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
            bool statusresp = false;

            StringBuilder txtcontBuilder = new StringBuilder();
            int idqueja_get = Convert.ToInt32(idexpediente);
            string tipoMod = "Eliminación";
            string Ipaccesible = HttpContext.Connection.RemoteIpAddress?.ToString();

            if (idqueja > 0)
            {
                statusresp = true;
                ContBitacora(txtcontBuilder, "ID de Escrito Inicial", tipoMod, "ID de Escrito Inicial", idexpediente, "-", Ipaccesible);
            }
            else
            {
                statusresp = false;
            }
            CrearBitacoraTXT(idqueja_get, txtcontBuilder.ToString());
            return Json(new { status = statusresp });
        }
        // Eliminar Actac 
        public ActionResult DeleteActac(IFormCollection form, string Ipaccesible)
        {
            String query = "";
            string idactac = form["id_actac"].ToString();

            query = "exec Sp_Regresa_IdExp " + idactac;
            int idExp = Convert.ToInt32(conexionsql.ObtenerReader(query));


            string tipoMod = "";

            
            


            StringBuilder txtcontBuilder = new StringBuilder();

            string quey_delexp = "EXEC Sp_DeleteActac '" + idactac + "'";
            int idactamod = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
            bool statusresp = false;


            if (idactamod > 0)
            {

                statusresp = true;
               
                tipoMod = "Eliminación";

                ContBitacora(txtcontBuilder, "Formato de Acta Circunstanciada", tipoMod, "Formato de acta circunstanciada", idactamod.ToString(), "-", Ipaccesible); 
            }
            else
            {
                statusresp = false;
            }
            CrearBitacoraTXT(idExp, txtcontBuilder.ToString());

            return Json(new { status = statusresp });
           
        }
        // Fin Eliminar Actac

        //// Eliminar ActaC cris
        //public ActionResult DeleteActaC(IFormCollection form)
        //{
        //    string idexpediente = form["id_acta"].ToString();
        //    string quey_delexp = "EXEC Sp_DeleteActac "+ idexpediente;
        //    int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
        //    bool statusresp = false;

        //    if (idqueja > 0)
        //    {
        //        statusresp = true;
        //    }
        //    else
        //    {
        //        statusresp = false;
        //    }

        //    return Json(new { status = statusresp });
        //}

        //Eliminar Escrito
        public ActionResult DeleteEscrito(IFormCollection form, string Ipaccesible)
        {
         
            string idexpediente = form["id_escrito"].ToString();
            string idqueja_get = form["id_queja"].ToString();

            string quey_delexp = "EXEC Sp_DeleteEscrito '" + idexpediente + "', '" + idqueja_get + "'";
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);

            int idExp = Convert.ToInt32(idqueja_get);
            bool statusresp = false;

            StringBuilder txtcontBuilder = new StringBuilder();
            string tipoMod = "";

            if (idqueja > 0)
            {
                statusresp = true;
                tipoMod = "Eliminación";

                ContBitacora(txtcontBuilder, "Formato de Escrito Inicial de queja", tipoMod, "Formato de escrito inicial", idexpediente.ToString(), "-", Ipaccesible);
            }
            else
            {
                statusresp = false;
            }

            CrearBitacoraTXT(idExp, txtcontBuilder.ToString());
            return Json(new { status = statusresp });
        }
        // Fin Eliminar Peticionario

        //Eliminar Archivo adjunto
        public ActionResult EliminarArchivoAdj(IFormCollection form)
        {
            string idarchivo = form["id_archivoadj"].ToString();
            string quey_delexp = "EXEC Sp_DeleteArchivoAdjunto " + idarchivo;
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
            bool statusresp = false;

            if (idqueja > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }

            return Json(new { status = statusresp });
        }
        // Fin Eliminar Archivo adjunto

        // Alta de id de queja
        public ActionResult GeneraIdQueja(IFormCollection form)
        {
            string idcomplemento_agrv = (form["id_complemento"]).ToString();
            string iduseragraviado = (form["id_peticionario"]).ToString();
            string id_via_interposicion = (form["id_via_interposicion"]).ToString();
            int id_abogado_queja = 0;
             id_abogado_queja = Convert.ToInt32(form["id_Abogado_Queja"].ToString());
            int idqueja = 0;
            int idenlacequeja = 0;
            bool statusresp = false;

            string quey_insertqueja = "EXEC Sp_GeneraIdQueja " + id_via_interposicion+","+ id_abogado_queja;

            idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_insertqueja);

            if (idqueja > 0)
            {
                string query_InsertEnlaceFormarQueja = "EXEC Sp_InsertEnlaceFormatoQueja " + idqueja + ", " + iduseragraviado + ", " + idcomplemento_agrv;
                idenlacequeja = conexionsql.InsertUpdateDeleteRegresaid(query_InsertEnlaceFormarQueja);

                if (idenlacequeja > 0)
                {
                    statusresp = true;
                }
                else
                {
                    statusresp = false;
                }
            }

            return Json(new { status = statusresp, idqueja = idqueja, idcomplementoagrav = idcomplemento_agrv, idenlacequeja = idenlacequeja });
        }
        // Fin Alta de id de queja
        public ActionResult selects()
        {
            List<SelectGenerico> listaContenedora = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora1 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora2 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora3 = new List<SelectGenerico>();
            List<SelectGenerico> listaContenedora4 = new List<SelectGenerico>();

            String query = "exec select_Via_Interposicion";
            string mensaje = "";
            listaContenedora = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec select_Especializado";
            listaContenedora1 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec select_Materia";
            listaContenedora2 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);
            query = "exec select_NivRiesgo";
            listaContenedora3 = conexionsql.lista_SelectGenericaSelect(query, ref mensaje);


            if (listaContenedora.Count > 0)
            {
                return Json(
                    new
                    {
                        lista1 = listaContenedora,
                        lista2 = listaContenedora1,
                        lista3 = listaContenedora2,
                        lista4 = listaContenedora3
                    });
            }
            else
            {
                // ViewData["Mensaje"] = "Error al Accesar";

                return Json(new { mensaje = "error" });
                //return View();
            }
        }
        // GET: ExpedienteController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }
        // POST: ExpedienteController/Edit/5
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
        // GET: ExpedienteController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }
        // POST: ExpedienteController/Delete/5
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

        public ActionResult ConcluirExpediente(IFormCollection collection)
        {
            string query = "";
            string mensaje = "";
            string fechaconclu = "",causaconclu="",actorestconclu="",observaconcluobs="";
            int idexp = 0;
            idexp = Convert.ToInt32( collection["idexp"].ToString());
            int longitudtabla1 = Convert.ToInt32(collection["longitudtabla1"].ToString()); ;
            for (int i = 0; i < longitudtabla1; i++)
            {
                fechaconclu = collection["tablaCausasc[" + i + "][fechacon]"].ToString();
                causaconclu = collection["tablaCausasc[" + i + "][causacon]"].ToString();
                actorestconclu = collection["tablaCausasc[" + i + "][actorestitu]"].ToString();
                observaconcluobs = collection["tablaCausasc[" + i + "][observa]"].ToString();


                query = "exec Sp_insertCausasC '" + fechaconclu + "','" + causaconclu + "','" + actorestconclu + "','" + observaconcluobs + "'," + idexp;
                mensaje = ejecutaInsertUpdate(query);
            }

            return Json(new{ msg=mensaje});

        }
        //Llenar selects para crear formulario
        public ActionResult Llenarselects_tevi()
        {
            List<GeneralModel.Selectmaster> restipoescrito = new List<GeneralModel.Selectmaster>();
            List<GeneralModel.Selectmaster> resviainterpos = new List<GeneralModel.Selectmaster>();

            String query = "exec Sp_Select_ViaInterposicion";
            string mensaje = "";
            resviainterpos = conexionsql.selectMaestro(query, ref mensaje);

            String queryd = "exec Sp_Select_Tipoescrito";
            string mensajed = "";
            restipoescrito = conexionsql.selectMaestro(queryd, ref mensajed);

            if (restipoescrito.Count > 0 && resviainterpos.Count > 0)
            {
                return Json(
                    new
                    {
                        tipoescrito = restipoescrito,
                        viainterposicion = resviainterpos
                    });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        public IActionResult MiAccion()
        {
            List<GeneralModel.Selectmaster> restipoescrito = new List<GeneralModel.Selectmaster>();

            // Ejecutar el procedimiento almacenado
            string queryd = "exec Sp_Select_Tipoescrito";
            string mensajed = "";
            restipoescrito = conexionsql.selectMaestro(queryd, ref mensajed);

            // Filtrar para excluir "Queja"
            var tiposFiltrados = restipoescrito.Where(x => x.Descripcion != "Queja").ToList();

            if (tiposFiltrados.Count > 0)
            {
                return Json(tiposFiltrados);
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Adair 16 12 2025: Metodo que actualiza el estatus de una cedula para "eliminarla" del registro 123
        [HttpPost]
        public IActionResult actualizarEstatusCedula(int expediente_id, string expediente, int id_tipo)
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
                        if (totalActualizados > 0)
                        {
                            return Json(new
                            {
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



        // Adair 16/12/2025: Metodo conversion a entero no null, evita devolver nulos y campos vacios. Ej campos requeridos
        public IActionResult actualizarEstatusID(int expediente_id, string motivo, string expediente, int id_tipo)
        {
            Console.WriteLine("Expediente ID recibido: " + expediente_id);
            Console.WriteLine("Expediente ID recibido: " + expediente);

            try
            {
                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("[dbo].[Sp_Borrar_ID]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ID_EXP", expediente_id);
                        command.Parameters.AddWithValue("@Motivo", motivo ?? "Sin motivo especificado");
                        command.Parameters.AddWithValue("@ID_APORTACION", expediente);
                        command.Parameters.AddWithValue("@ID_TIPO", id_tipo);
                        int totalActualizados = 0;

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                totalActualizados = reader.GetInt32(0);
                            }
                        }

                        if (totalActualizados > 0)
                        {
                            return Json(new
                            {
                                success = true,
                                message = $"Se eliminó {totalActualizados} ID correctamente."
                            });
                        }
                        else
                        {
                            return Json(new
                            {
                                success = false,
                                message = "No se pudo eliminar el ID, o ya estaba inactiva."
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


        // David 08/09/2025: Metodo conversion a entero no null, evita devolver nulos y campos vacios. Ej campos requeridos
        private int TryParseInt(object value, int defaultValue = 0)
        {
            if (value == null || value == DBNull.Value) return defaultValue;

            var strValue = value.ToString()?.Trim();
            return int.TryParse(strValue, out int result) ? result : defaultValue;
        }
        // David 08/09/2025: Metodo conversion a enteros que pueden ser null, evita devolver nulos y campos vacios. Ej campos no requeridos
        private int? TryParseNullableInt(object value)
        {
            if (value == null || value == DBNull.Value) return null;

            var strValue = value.ToString()?.Trim();
            return int.TryParse(strValue, out int result) ? result : (int?)null;
        }


        //  David 25 08 2025: Controlador para la tabla de buscador de cedulas
        // Se lleva el siguiente flujo:
        // 1) Lectura de los campos del form (argumentos de busqueda)
        // 2) Ejecucion del SP que realiza la seleccion-union de tablas para obtener la info de las cedulas combinada con la info de datos personales
        // 3) Trae la info segun el archivo TablaBusquedaCedulas.cs (model), ambos lados deben coincidir
        // 4) Devuelve un JSON con la informacion extraida
        [HttpPost]
        public IActionResult TablaObtenerCedulas(IFormCollection form)
        {
            try
            {
                // Obtener valores del form
                int? idExpediente = string.IsNullOrEmpty(form["txt_idcedula"]) ? (int?)null : int.Parse(form["txt_idcedula"]);
                string curp = form["txt_idcurp"];
                string nombre = form["txt_nombre"];
                string estatusQueja = form["txt_EstCedula"];
                string viaInterposicion = form["txt_viaI"];
                string fechaReg = form["txt_fecha"];
                string tipoEscrito = form["txt_idtipo_escrito"];
                int idAbogado = string.IsNullOrEmpty(form["txt_abogado"]) ? 0 : int.Parse(form["txt_abogado"]);

                List<TablaBusquedaCedulas> listaCedulas = new List<TablaBusquedaCedulas>();

                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();
                    // OJO Aqui se define el Sp
                    using (SqlCommand command = new SqlCommand("Sp_Select_Cedulas_VADQO", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@ID_EXPEDIENTE", (object)idExpediente ?? DBNull.Value);
                        command.Parameters.AddWithValue("@CURP", string.IsNullOrEmpty(curp) ? (object)DBNull.Value : curp);
                        command.Parameters.AddWithValue("@NOMBRE", string.IsNullOrEmpty(nombre) ? (object)DBNull.Value : nombre);
                        command.Parameters.AddWithValue("@EstatusQueja", estatusQueja);
                        command.Parameters.AddWithValue("@VIA_INTERPOSICION", viaInterposicion);
                        command.Parameters.AddWithValue("@FECHA_REG", fechaReg);
                        command.Parameters.AddWithValue("@TIPO_ESCRITO", tipoEscrito);
                        command.Parameters.AddWithValue("@IDABOGADO", (object)idAbogado ?? DBNull.Value);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            DataTable data = new DataTable();
                            data.Load(reader);

                            foreach (DataRow row in data.Rows)
                            {
                                //  Extraccion de datos del SP segun nuestro programa model (el que incluye los get-set)
                                TablaBusquedaCedulas cedula = new TablaBusquedaCedulas
                                {
                                    //  En algunos campo se auxilia de algunas funciones para hacer las conversiones necesarias y evitar mensajes de error
                                    Id_escrito = TryParseInt(row["Id_escrito"]),
                                    Folio = row["folio"]?.ToString(),
                                    Lugar_hechos = row["lugar_hechos"]?.ToString(),
                                    Fecha_recepcion = row["fecha_recepcion"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["fecha_recepcion"]),
                                    Hora_recepcion = row["hora_recepcion"]?.ToString(),
                                    Autoridad = row["autoridad"]?.ToString(),
                                    Numero_oficio = row["numero_oficio"]?.ToString(),
                                    Institucion = row["institucion"]?.ToString(),
                                    Remitente = row["remitente"]?.ToString(),
                                    Explicacion = row["explicacion"]?.ToString(),
                                    Archivo = row["archivo"]?.ToString(),
                                    Tipo_Archivo = row["tipo_archivo"]?.ToString(),
                                    Sede_registro = row["sede_registro"]?.ToString(),
                                    Via_interposicion = row["via_interposicion"]?.ToString(),
                                    Abogado = row["abogado"]?.ToString(),
                                    Peticionario = row["peticionario"]?.ToString(),
                                    Expediente = row["expediente"]?.ToString(),
                                    Edad = TryParseInt(row["edad"]),
                                    Genero = row["genero"]?.ToString(),
                                    Sexo = row["sexo"]?.ToString(),
                                    id_tipo = TryParseInt(row["id_tipo"]),
                                    Tipo_usuario = row["tipo_usuario"]?.ToString(),
                                    Documento = row["documento"]?.ToString(),
                                    Id_personas = row["id_personas"]?.ToString(),
                                    Estatus = TryParseInt(row["estatus"]),
                                    estatus_columna = TryParseInt(row["estatus_columna"]),
                                    tipo_cedula = row["tipo_cedula"]?.ToString(),

                                    // Datos personales (REG_RECEPCION) 22 09 2025
                                    DP_Nombre = row["DP_Nombre"]?.ToString(),
                                    DP_ApellidoPaterno = row["DP_ApellidoPaterno"]?.ToString(),
                                    DP_ApellidoMaterno = row["DP_ApellidoMaterno"]?.ToString(),
                                    DP_CURP = row["DP_CURP"]?.ToString(),
                                    DP_FechaRegistro = row["DP_FechaRegistro"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["DP_FechaRegistro"]),
                                    DP_Via_interposicion = TryParseNullableInt(row["DP_Via_interposicion"]),

                                    // Datos personales (COMPLEMENTO_PETICIONARIO)
                                    DP_idCompPetit = TryParseInt(row["DP_idCompPetit"]),
                                    DP_TipoUsuario = row["DP_TipoUsuario"]?.ToString(),
                                    DP_Calle = row["DP_Calle"]?.ToString(),
                                    DP_NumExterior = row["DP_NumExterior"]?.ToString(),
                                    DP_NumInterior = row["DP_NumInterior"]?.ToString(),
                                    DP_Colonia = row["DP_Colonia"]?.ToString(),
                                    DP_Ciudad = row["DP_Ciudad"]?.ToString(),
                                    DP_Municipio = row["DP_Municipio"]?.ToString(),
                                    DP_Estado = row["DP_Estado"]?.ToString(),
                                    DP_CodigoPostal = row["DP_CodigoPostal"]?.ToString(),
                                    DP_Telefono = row["DP_Telefono"]?.ToString(),
                                    DP_Edad = TryParseNullableInt(row["DP_Edad"]),
                                    DP_Email = row["DP_Email"]?.ToString(),
                                    DP_Sexo = TryParseNullableInt(row["DP_Sexo"]),
                                    DP_Escolaridad = TryParseNullableInt(row["DP_Escolaridad"]),
                                    DP_EstadoConyugal = TryParseNullableInt(row["DP_EstadoConyugal"]),
                                    DP_Ocupacion = TryParseNullableInt(row["DP_Ocupacion"]),
                                    DP_OtraOcupacion = row["DP_OtraOcupacion"]?.ToString(),
                                    DP_Nacionalidad = row["DP_Nacionalidad"]?.ToString(),
                                    DP_SabeLeer = row["DP_SabeLeer"]?.ToString(),
                                    DP_Discapacidad = TryParseNullableInt(row["DP_Discapacidad"]),
                                    DP_GrupoSocial = TryParseNullableInt(row["DP_GrupoSocial"]),
                                    DP_OtroGrupoSocial = row["DP_OtroGrupoSocial"]?.ToString(),
                                    DP_HablaLengua = row["DP_HablaLengua"]?.ToString(),
                                    DP_LenguaIndigena = row["DP_LenguaIndigena"]?.ToString(),
                                    DP_FechaNacimiento = row["DP_FechaNacimiento"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["DP_FechaNacimiento"]),
                                    DP_OrigenMigrante = row["DP_OrigenMigrante"]?.ToString(),
                                    DP_DestinoMigrante = row["DP_DestinoMigrante"]?.ToString(),
                                    DP_PrimeraVezMexico = row["DP_PrimeraVezMexico"]?.ToString(),
                                    DP_ViolenciaVM = TryParseNullableInt(row["DP_ViolenciaVM"]),
                                    DP_Canalizacion = row["DP_Canalizacion"]?.ToString(),
                                    DP_Embarazada = row["DP_Embarazada"]?.ToString(),
                                    DP_HijosVivos = TryParseNullableInt(row["DP_HijosVivos"]),
                                    DP_ModalidadViolencia = TryParseNullableInt(row["DP_ModalidadViolencia"]),
                                    DP_TipoViolencia = TryParseNullableInt(row["DP_TipoViolencia"]),
                                    DP_RelacionAgresor = TryParseNullableInt(row["DP_RelacionAgresor"]),
                                    DP_IngresosMensuales = row["DP_IngresosMensuales"]?.ToString(),
                                    DP_Genero = row["DP_Genero"]?.ToString(),
                                    DP_OtroGenero = row["DP_OtroGenero"]?.ToString(),
                                    DP_status = TryParseInt(row["DP_status"]),
                                    DP_persona = TryParseInt(row["DP_persona"]),
                                    E_ExpEstatus = TryParseInt(row["E_ExpEstatus"]), //dato expediente AE


                                };

                                listaCedulas.Add(cedula);
                            }


                        }
                    }
                }

                return Json(new { data = listaCedulas });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        public IActionResult ObtenerArchivosCedulas(IFormCollection form)
        {
            try
            {
                int idExpediente = Convert.ToInt32(form["IdExpediente"]);
                string expediente = form["Expediente_Aportacion"];
                List<ArchivosAdjuntosCedulas> listaArchivos = new List<ArchivosAdjuntosCedulas>();

                using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand("Sp_ObtenerArchivosCedulas", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Argumentos para el Sp
                        command.Parameters.AddWithValue("@Id_Expediente", idExpediente);
                        command.Parameters.AddWithValue("@Expediente_Aportacion", expediente);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ArchivosAdjuntosCedulas archivo = new ArchivosAdjuntosCedulas
                                {
                                    // Informacion que el Sp me devuelve
                                    Id_Archivo_Cedulas = TryParseInt(reader["Id_Archivo_Cedulas"]),
                                    Nombre_Archivo = reader["Nombre_Archivo"]?.ToString(),
                                    Tipo_Archivo = reader["Tipo_Archivo"]?.ToString(),
                                    Estatus = TryParseInt(reader["Estatus"]),
                                };

                                listaArchivos.Add(archivo);
                            }
                        }
                    }
                }

                // Retornar los archivos como JSON
                return Json(new { success = true, archivos = listaArchivos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    stackTrace = ex.StackTrace,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        public ActionResult EliminarArchivoAdjCedula(IFormCollection form)
        {
            string idarchivo = form["id_archivoadj"].ToString();
            string quey_delexp = "EXEC Sp_EliminarArchivoAdjuntoCedulas " + idarchivo;
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
            bool statusresp = false;

            if (idqueja > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }

            return Json(new { status = statusresp });
        }

        //Llenar selects para crear formulario
        public class Selectmaster
        {
            public int Id_TIPOQUEJA { get; set; }
            public string Descripcion { get; set; }
        }

        public class SelectGenerico
        {
            public int idSelectGenerico { get; set; }
            public string Descripcion { get; set; }
            public bool seleccionable { get; set; }
            public string ruta { get; set; }
            public string Clave { get; set; }
            public SelectGenerico() { }
            public SelectGenerico(int i1, string s1, bool i2, string s2, string s3)
            {
                this.idSelectGenerico = i1;
                this.Descripcion = s1;
                this.seleccionable = i2;
                this.Clave = s3;
                if (s2 == "null")
                {
                    this.ruta = "#";
                }
                else
                {
                    this.ruta = s2;
                }

            }
        }
        public class SelectGenericostr
        {
            public string idSelect{ get; set; }
            public string Descripcion { get; set; }
            public bool seleccionable { get; set; }
            public string ruta { get; set; }
            public string Clave { get; set; }
            public SelectGenericostr() { }
            public SelectGenericostr(string i1, string s1, bool i2, string s2, string s3)
            {
                this.idSelect = i1;
                this.Descripcion = s1;
                this.seleccionable = i2;
                this.Clave = s3;
                if (s2 == "null")
                {
                    this.ruta = "#";
                }
                else
                {
                    this.ruta = s2;
                }

            }
        }
        public async Task<ActionResult> GetDataEscritoInicial(IFormCollection form)
        {

            int idescritoinicial = int.Parse(form["identificadorQueja"].ToString());

            String query = "";

            List<EscritoUpdate> lEscritoI = new List<EscritoUpdate>();
            int idRegistro = 0;

            query = "exec Sp_Regresa_Escrito_Inicial_Queja_Edición " + idescritoinicial;
            string mensaje = "ok";

            mensaje = "ok";
            var data = GetDatosGeneral(query);

            lEscritoI = ObtenerlistEscriIni(data);

            return Json(new { data = lEscritoI, idPeticionario = idRegistro });
        }



        public List<EscritoUpdate>  getEscritoBitacora(int idescritoinicial)
        {

            String query = "";

            List<EscritoUpdate> lEscritoI = new List<EscritoUpdate>();
            int idRegistro = 0;

            query = "exec Sp_Regresa_Escrito_Inicial_Queja_Edición " + idescritoinicial;
            string mensaje = "ok";

            mensaje = "ok";
            var data = GetDatosGeneral(query);

            lEscritoI = ObtenerlistEscriIni(data);

            return lEscritoI;
        }



        public List<EscritoUpdate> ObtenerlistEscriIni(DataTable data)
        {
            List<EscritoUpdate> lEscritoI = new List<EscritoUpdate>();
            string query_archivosadj = "";
            foreach (DataRow row in data.Rows)
            {
                EscritoUpdate escritoitem = new EscritoUpdate();
                escritoitem.Id = Convert.ToInt32(row["id"].ToString());
                escritoitem.Peticionarios = (row["nombre_pet"]).ToString();
                escritoitem.FechaHechos = (row["fecha_Hechos"]).ToString();
                escritoitem.Fechahd = Convert.ToDateTime(row["fecha_Hechos"]);
                //escritoitem.cvemun = int.Parse((row["CVEMUN"]).ToString());
                escritoitem.cvemun = row["CVEMUN"] != DBNull.Value ? Convert.ToInt32(row["CVEMUN"]) : 0;
                escritoitem.estado = (row["ESTADO"]).ToString();
                escritoitem.calle = (row["calle"]).ToString();
                escritoitem.numero_ext = (row["numero_ext"]).ToString();
                escritoitem.numero_int = (row["numero_int"]).ToString();
                escritoitem.CP = (row["CP"]).ToString();
                escritoitem.colonia = (row["colonia"]).ToString();
                escritoitem.circuns_Hechos = (row["circuntancias_Hechos"]).ToString();
                escritoitem.Nombre_persona = (row["NOMBRE_PERSONA"]).ToString();
                escritoitem.idpersona = int.Parse((row["idpeticionario"]).ToString());
                escritoitem.idcomlpe_persona = int.Parse((row["Fk_IdComplementoPet"]).ToString());
                escritoitem.cargo_persona = (row["CARGO_PERSONA"]).ToString();
                escritoitem.Autoridad = (row["AUTORIDAD"]).ToString();

                // Archivos adjuntos para el escrito inicial
                query_archivosadj = "exec Sp_GetDataUploadsxIdesi " + "'" + Convert.ToInt32(row["id"]) + "'";
                var data_uploadsesi = GetDatosGeneral(query_archivosadj);
                List<EnlaceArchivoadjuntoEscritoi> uploadslist = new List<EnlaceArchivoadjuntoEscritoi>();

                foreach (DataRow row_uploadsesi in data_uploadsesi.Rows)
                {
                    EnlaceArchivoadjuntoEscritoi itemUpload = new EnlaceArchivoadjuntoEscritoi();
                    itemUpload.PkEnlaceAdjescritoi = Convert.ToInt32(row_uploadsesi["PK_ENLACE_ADJESCRITOI"]);
                    itemUpload.IdEscritoinicial = Convert.ToInt32(row_uploadsesi["ID_ESCRITOINICIAL"]);
                    itemUpload.RutaArchivo = (row_uploadsesi["RUTA_ARCHIVO"]).ToString();
                    itemUpload.FkStatus = Convert.ToInt32(row_uploadsesi["FK_STATUS"]);
                    itemUpload.Type = (row_uploadsesi["TYPE"]).ToString();
                    uploadslist.Add(itemUpload);
                }
                // Fin Quejosos y agraviados ligados a esta queja

                escritoitem.Rutaarchivo = uploadslist;
                lEscritoI.Add(escritoitem);
            }

            return lEscritoI;

        }

        public ActionResult GetDataActaCircunstanciada(IFormCollection form)
        {

            int idActaC = int.Parse(form["identificadorActac"].ToString());
            int IdActaCircun = 0;

            String query = "";

            List<ActacModificado> lEscritoI = new List<ActacModificado>();
            List<string> Arreglo_autoridades = new List<string>(); 

            query = "exec Sp_Regresa_Acta_Circunstanciada_Edicion " + idActaC;
            string mensaje = "ok";
            // escrito = conexionsql.regresaEscritoInicial(1, query, ref mensaje);
            mensaje = "ok";


            var data = GetDatosGeneral(query);
            ActacModificado Acacircunstanciada = new ActacModificado();
            foreach (DataRow row in data.Rows)
            {
                //string[] hora_completa = (row["horaInicio"]).ToString().Split(" ");
                //string[] horaHechosC = (row["horaHechos"]).ToString().Split(" ");
                //string[] horaTerminoc = (row["horaTermino"]).ToString().Split(" ");
                //string[] hora_completa1 = hora_completa[1].Split(":");
                //string[] horaHechosC1;
                //int contador = horaHechosC.Count();
                //if (contador < 2)
                //{
                //    horaHechosC1 = "00:00".Split(":");
                //}
                //else
                //{
                //    horaHechosC1 = horaHechosC[1].Split(":");
                //}

                //string[] horaTerminoc1 = horaTerminoc[1].Split(":");

                DateTime dtHoraInicio = Convert.ToDateTime(row["horaInicio"]);

                DateTime dtHoraTermino = Convert.ToDateTime(row["horaTermino"]);

                string[] horaHechosC = (row["horaHechos"]).ToString().Split(" ");

                string[] horaHechosC1;

                int contador = horaHechosC.Count();

                if (contador < 2)

                {

                    horaHechosC1 = "00:00".Split(":");

                }

                else

                {

                    horaHechosC1 = horaHechosC[1].Split(":");

                }



                int Id = int.Parse((row["id"]).ToString());
                string lugar = (row["lugar"]).ToString();
                int Diafecha = int.Parse((row["diaFecha"]).ToString());
                string mes = (row["mes"]).ToString();
                string año = (row["anio"]).ToString();
                string abogado = (row["abogado"]).ToString();
                string cargo = (row["cargo"]).ToString();
                string siglas = (row["SIGLAS"]).ToString();
                //TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa1[0]), int.Parse(hora_completa1[1]));
                TimeOnly horaInicio = TimeOnly.FromDateTime(dtHoraInicio);
                string ubicacion = (row["ubicacion"]).ToString();
                string peticionario = (row["nombre_peticionario"]).ToString();
                string consentimiento = (row["consentimiento"]).ToString();
                string OrigenPeticionario = (row["origenPet"]).ToString();
                int edadPeticionario = int.Parse((row["edad_pet"]).ToString());
                string callePeticionario = (row["CALLE_pet"]).ToString();
                string Num_exterior_Peticionario = (row["NUM_EXTERIOR_pet"]).ToString();
                string Codigo_postalPeticionario = (row["CODIGO_POSTAL_pet"]).ToString();
                string COLONIA_Peticionario = (row["COLONIA_pet"]).ToString();
                string MUNICIPIO_Peticionario = (row["MUNICIPIO_pet"]).ToString();
                string Ocupacion_peticionario = (row["NOMBRE_OCUPACION_pet"]).ToString();
                string TELEFONO_Peticionario = (row["TELEFONO_pet"]).ToString();
                string email_peticionario = (row["EMAIL_pet"]).ToString();
                TimeOnly horaHechos = new TimeOnly(0, 0);
                if (!string.IsNullOrWhiteSpace(row["horaHechos"].ToString()))
                {
                    DateTime fechaHora = Convert.ToDateTime(row["horaHechos"].ToString());

                    horaHechos = TimeOnly.FromDateTime(fechaHora);
                }
                string fechaHechos = (row["horaHechos"]).ToString();
                string ubiHechos = (row["ubiHechos"]).ToString();
                string hechos = (row["hechos"]).ToString();
                //TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc1[0]), int.Parse(horaTerminoc1[1]));
                TimeOnly horaTermino = TimeOnly.FromDateTime(dtHoraTermino);
                string identificacionPet = (row["identificacionPet"]).ToString();
                string OrigenPetExt = (row["OrigenPetExt"]).ToString();
                string OrigenPetExtComp = (row["OrigenPetExtComp"]).ToString();
                string SABE_LEER = (row["SABE_pet"]).ToString();
                string ESTADO = (row["ESTADO_pet"]).ToString();
                string escolaridad = (row["escolaridad"]).ToString();
                int compet = int.Parse((row["ID_COMPLEMENTO_PETICIONARIO"]).ToString());
                int idpet = int.Parse((row["ID_REGISTRO"]).ToString());
                DateTime fechaActual = DateTime.Now;
                string Autoridad = row["AUTORIDAD"].ToString();



                Acacircunstanciada =
               new ActacModificado(Id, lugar, Diafecha, mes, año, abogado, cargo, siglas, horaInicio, ubicacion, peticionario, consentimiento, OrigenPeticionario, edadPeticionario, SABE_LEER, escolaridad, callePeticionario, Num_exterior_Peticionario, Codigo_postalPeticionario, COLONIA_Peticionario,
               MUNICIPIO_Peticionario, ESTADO, Ocupacion_peticionario, TELEFONO_Peticionario, email_peticionario, identificacionPet, fechaHechos, horaHechos, ubiHechos, hechos, horaTermino, OrigenPetExt, OrigenPetExtComp, idpet, compet, fechaActual, Autoridad);
                lEscritoI.Add(Acacircunstanciada);
                //arreglo
                Arreglo_autoridades.Add((row["AUTORIDAD"]).ToString());

                Console.WriteLine($"contenido pdf: {Acacircunstanciada.Autoridad}");


            }

            return Json(new { data = lEscritoI, data1 = Arreglo_autoridades });

        }
        #region Obtener datos de acta de circuntancias para validar que este completo el formato
        public string GetDataActaCircunstanciadaa(int identificadorActac)
        {
            int idActaC = identificadorActac;

            String query = "";
            String Estatus = "";

            query = "exec Sp_Regresa_Acta_Circunstanciada_Edicion " + idActaC;
            var data = GetDatosGeneral(query);
            foreach (DataRow row in data.Rows)
            {
                string[] hora_completa = (row["horaInicio"]).ToString().Split(" ");
                string[] horaHechosC = (row["horaHechos"]).ToString().Split(" ");
                string[] horaTerminoc = (row["horaTermino"]).ToString().Split(" ");
                string[] hora_completa1 = hora_completa[1].Split(":");
                string[] horaHechosC1;
                int contador = horaHechosC.Count();
                if (contador < 2)
                {
                    horaHechosC1 = "00:00".Split(":");
                }
                else
                {
                    horaHechosC1 = horaHechosC[1].Split(":");
                }

                string[] horaTerminoc1 = horaTerminoc[1].Split(":");
                TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC1[0]), int.Parse(horaHechosC1[1]));
                TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc1[0]), int.Parse(horaTerminoc1[1]));
                TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa1[0]), int.Parse(hora_completa1[1]));

                int Id = int.Parse((row["id"]).ToString());
                string lugar = (row["lugar"]).ToString();
                int Diafecha = int.Parse((row["diaFecha"]).ToString());
                string mes = (row["mes"]).ToString();
                string año = (row["anio"]).ToString();
                string abogado = (row["abogado"]).ToString();
                string cargo = (row["cargo"]).ToString();
                string siglas = (row["SIGLAS"]).ToString();
                string ubicacion = (row["ubicacion"]).ToString();
                string peticionario = (row["nombre_peticionario"]).ToString();
                string consentimiento = (row["consentimiento"]).ToString();
                string OrigenPeticionario = (row["origenPet"]).ToString();
                int edadPeticionario = int.Parse((row["edad_pet"]).ToString());
                string SABE_LEER = (row["SABE_pet"]).ToString();
                string escolaridad = (row["escolaridad"]).ToString();
                string callePeticionario = (row["CALLE_pet"]).ToString();
                string Num_exterior_Peticionario = (row["NUM_EXTERIOR_pet"]).ToString();

                string Codigo_postalPeticionario = (row["CODIGO_POSTAL_pet"]).ToString();
                string COLONIA_Peticionario = (row["COLONIA_pet"]).ToString();
                string MUNICIPIO_Peticionario = (row["MUNICIPIO_pet"]).ToString();
                string ESTADO = (row["ESTADO_pet"]).ToString();
                string Ocupacion_peticionario = (row["NOMBRE_OCUPACION_pet"]).ToString();
                string TELEFONO_Peticionario = (row["TELEFONO_pet"]).ToString();
                string email_peticionario = (row["EMAIL_pet"]).ToString();
                string identificacionPet = (row["identificacionPet"]).ToString();
                string fechaHechos = (row["horaHechos"]).ToString();
                string ubiHechos = (row["ubiHechos"]).ToString();
                string OrigenPetExt = (row["OrigenPetExt"]).ToString();
                string OrigenPetExtComp = (row["OrigenPetExtComp"]).ToString();
                string hechos = (row["hechos"]).ToString();

                int compet = int.Parse((row["ID_COMPLEMENTO_PETICIONARIO"]).ToString());
                int idpet = int.Parse((row["ID_REGISTRO"]).ToString());
                List<string> Arreglo_autoridades = new List<string>();
                Arreglo_autoridades.Add((row["AUTORIDAD"]).ToString());

                if ((row["lugar"]).ToString() != "" && int.Parse((row["diaFecha"]).ToString()) != 0 && (row["mes"]).ToString() != ""
                    && (row["anio"]).ToString() != "" && (row["abogado"]).ToString() != "" && (row["cargo"]).ToString() != "" && (row["SIGLAS"]).ToString() != ""
                    && (row["ubicacion"]).ToString() != "" && (row["nombre_peticionario"]).ToString() != "" && (row["consentimiento"]).ToString() != ""
                    && int.Parse((row["edad_pet"]).ToString()) != 0 && (row["SABE_pet"]).ToString() != ""
                    && (row["escolaridad"]).ToString() != "" && (row["CALLE_pet"]).ToString() != "" && (row["NUM_EXTERIOR_pet"]).ToString() != ""
                    && (row["CODIGO_POSTAL_pet"]).ToString() != "" && (row["COLONIA_pet"]).ToString() != "" && (row["MUNICIPIO_pet"]).ToString() != ""
                    && (row["ESTADO_pet"]).ToString() != "" && (row["NOMBRE_OCUPACION_pet"]).ToString() != "" && (row["TELEFONO_pet"]).ToString() != ""
                    && (row["EMAIL_pet"]).ToString() != "" && (row["identificacionPet"]).ToString() != "" && (row["horaHechos"]).ToString() != ""
                    && (row["ubiHechos"]).ToString() != "" && (row["hechos"]).ToString() != "")//&& (row["OrigenPetExt"]).ToString() != "" && (row["origenPet"]).ToString() != "" 
                {
                    Estatus = "completo";
                }
            }

            return Estatus;

        }
        #endregion

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

        public ActionResult obtenerValidacion(IFormCollection form)
        {
            string idExp = form["id_queja"].ToString();
            string resultado = "";

            string quey_verificalig = "EXEC Sp_ValidarAltaQueja '" + idExp + "'";
            resultado = conexionsql.ObtenerReader(quey_verificalig);



            return Json(new { status = resultado });
        }
		[HttpPost]
        public async Task<IActionResult> subirarchivoserver(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Json(new { message = "Por favor selecciona un archivo." });

            if (file.ContentType != "application/pdf")
                return Json(new { message = "Solo se permiten archivos PDF." });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Archivos");
            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, file.FileName);

            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Json(new { message = "Archivo PDF subido exitosamente", filename = file.FileName });
        }
        [HttpPost]
        public ActionResult subirarchivoserverAC(IFormFile file)
        {
            string UploadMessage = "";
            if (file != null && file.Length > 0)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/AC", file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyToAsync(stream);
                }

                UploadMessage = "File uploaded successfully!";
            }
            else
            {
                UploadMessage = "Please select a file.";
            }

            return Json(new { message = UploadMessage, filename = file.FileName });
        }
        [HttpPost]
        public ActionResult subirarchivoserverEI(IFormFile file)
        {
            string UploadMessage = "";
            if (file != null && file.Length > 0)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Archivos/EI", file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyToAsync(stream);
                }

                UploadMessage = "File uploaded successfully!";
            }
            else
            {
                UploadMessage = "Please select a file.";
            }

            return Json(new { message = UploadMessage, filename = file.FileName });
        }

        public string ejecutaInsertUpdate(string query)
        {
            string mensaje = "";
            using (SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng()))
            {
                try
                {
                    connection.Open();
                    using (SqlCommand command = new SqlCommand(query, connection)) { command.ExecuteNonQuery(); }
                    mensaje = "OK";
                }
                catch (Exception ex)
                {
                    mensaje = "ERROR";
                }
                finally
                {
                    connection.Close();
                }


            }
            return mensaje;
        }

        //09 01 2026 Ricardo
        public IActionResult ConsutlarArchivoCalificación(string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                {
                    Console.WriteLine(" fileName está vacío o nulo");
                    return BadRequest("Nombre de archivo no especificado");
                }

                Console.WriteLine($" Buscando archivo: {fileName}");

                // Solo una ruta: wwwroot/Archivos
                var filePath = Path.Combine(
                    _hostingEnvironment.WebRootPath,
                    "Archivos",
                    fileName
                );

                if (!System.IO.File.Exists(filePath))
                {
                    Console.WriteLine($" Archivo NO encontrado: {filePath}");
                    return NotFound("Archivo no encontrado");
                }

                Console.WriteLine($" Archivo encontrado: {filePath}");

                // Solo PDFs
                return PhysicalFile(filePath, "application/pdf");
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Error: {ex.Message}");
                return StatusCode(500, "Error al cargar el archivo");
            }
        }

        //29 12 2025 Ricardo
        public IActionResult ConsutlarArchivoAC(string fileName)
        {
            fileName = Path.GetFileName(fileName);

            var filePath = Path.Combine(
                _hostingEnvironment.WebRootPath,
                "Archivos",
                "AC",
                fileName
            );

            if (!System.IO.File.Exists(filePath))
                return View("Error");

            return PhysicalFile(filePath, "application/pdf");
        }
        // 29 12 2025 Ricardo:
        public IActionResult ConsutlarArchivoEI(string fileName)
        {
            fileName = Path.GetFileName(fileName);

            var filePath = Path.Combine(
                _hostingEnvironment.WebRootPath,
                "Archivos",
                "EI",
                fileName
            );

            if (!System.IO.File.Exists(filePath))
                return View("Error");

            return PhysicalFile(filePath, "application/pdf");
        }


        public ActionResult GuardaCalifQuej(IFormCollection form)
        {
            Console.WriteLine(">>> ENTRO A GuardaCalifQuej");
            Console.WriteLine("FILES COUNT: " + Request.Form.Files.Count);

            string query = "";
            int idqueja = 0;
            string hechos = "";
            string municipoqueja = "";
            string observaciones = "";
            int especializado = 0;
            int trasOpPublica = 0;
            string tipoexp = "";
            string materia = "0";
            string nivriesgo = "99";
            string autoridad = "";
            string hecho = "";
            string tipo = "";
            string TiGua = "";
            string expedsc = "";
            string descapo = "";
            string programa = "99";
            string tema = "";
            string otrotema = "";
            string[] arreglotemas;
            int linea = 0;
            int arreglo = 0;
            string noexp = "";
            int longitudtabla1 = int.Parse(form["longitudtabla1"].ToString());
            int longitudtabla2 = int.Parse(form["longitudtabla2"].ToString());
            int longitudtabla3 = int.Parse(form["longitudtabla3"].ToString());
            string mensaje = "";

            string fechaemi = "";
            string archemi = "";
            string fechaate = "";
            string archate = "";
            string noofic = "";
            string obsemi = "";
            string obsate = "";
            int statust = 0;
            int nomedidadC = 0;
            /*Sección de la actualización de la tabla de una queja*/

            idqueja = int.Parse(form["idqueja"].ToString());
            hechos = form["hechos"].ToString();
            municipoqueja = form["municipioqueja"].ToString();
            observaciones = form["observaciones"].ToString();
            tipoexp = form["tipexpediente"].ToString();
            expedsc = form["expedsc"].ToString();
            descapo = form["descapo"].ToString();
            TiGua = form["tipGuarda"].ToString();
            /*Sección de la actualización de la tabla de una queja*/
            string esp = form["especializado-frmDatosCalificacionE"];
            string trp = form["trancpub-frmDatosCalificacionE"];

            if (!string.IsNullOrEmpty(esp) && (esp == "Si" || esp == "1" || esp == "on" || esp == "true"))
            {
                especializado = 1;
            }

            if (!string.IsNullOrEmpty(trp) && (trp == "Si" || trp == "1" || trp == "on" || trp == "true"))
            {
                trasOpPublica = 1;
            }

            materia = form["materia-frmDatosCalificacionE"].ToString();
            nivriesgo = form["nivries-frmDatosCalificacionE"].ToString();
            programa = form["programa-frmDatosCalificacionE"].ToString();
            // 🛡️ REVISIÓN SEGURA DE TEMAS (Casteo explícito a string evita el NullReferenceException)
            // =========================================================================
            string temaRaw = (string)form["arreglotemas[]"];

            if (!string.IsNullOrEmpty(temaRaw))
            {
                tema = temaRaw;
                arreglotemas = tema.Split(',');
            }
            else
            {
                tema = "";
                arreglotemas = new string[0];
            }

            // 🛡️ Captura segura del cuadro de texto "Especifique el Tema"
            otrotema = (string)form["otroTema"] ?? "";

            Console.WriteLine(">>>> EL VALOR DE OTROTEMA RECIBIDO ES: " + otrotema);

            if (tipoexp == "1")
            {
                query = "exec Sp_ActualizaRegistroCalificacionQueja " + idqueja + ",'" + hechos + "'," + "'" + municipoqueja + "'," + "'" + observaciones + "'," + "" + especializado + "," + "" + trasOpPublica + "," + "'" + tipoexp + "'," + "'" + materia + "'," + "'" + nivriesgo + "','" + programa + "','" + TiGua + "'";
                mensaje = ejecutaInsertUpdate(query);

                // 1. Lo capturas de forma segura afuera del ciclo
                string otroTemaRaw = (string)form["otroTema"] ?? "";
                string otroTemaSeguro = otroTemaRaw.Replace("'", "''");

                query = "Sp_deleteTema " + idqueja;
                mensaje = ejecutaInsertUpdate(query);
                for (int i = 0; i < arreglotemas.Length; i++)
                {
                    string version = "CALIFICACION";

                    string temaActual = arreglotemas[i].ToString();

                    // 🟢 VALIDACIÓN : Si el ID del tema es 29 ("OTROS"), guarda el texto; si no, mándalo vacío.
                    string textoTemaAInsertar = (temaActual == "29") ? otroTemaSeguro : "";

                    query = "exec Sp_insertaTema " + idqueja + "," + temaActual + ",'" + textoTemaAInsertar + "','" + version + "','" + TiGua + "'," + i;

                    mensaje = ejecutaInsertUpdate(query);
                }

                /*Sección de la actualización de la tabla de una queja*/
                /*Actualizacion de tabla de autoridad y Hechos Violatorios*/
                query = "Sp_deleteAutoridad " + idqueja;
                mensaje = ejecutaInsertUpdate(query);

                for (int i = 0; i < longitudtabla1; i++)
                {
                    autoridad = form["tablaAutRe_HecVio[" + i + "][autoridad]"].ToString();
                    hecho = form["tablaAutRe_HecVio[" + i + "][hecho]"].ToString();
                    tipo = form["tablaAutRe_HecVio[" + i + "][tipoA]"].ToString();
                    linea = int.Parse(form["tablaAutRe_HecVio[" + i + "][idAutoHec]"].ToString());
                    query = "exec Sp_insertaAutoridad " + idqueja + "," + autoridad + "," + hecho + "," + linea + "," + tipo + ",'" + TiGua + "'";
                    mensaje = ejecutaInsertUpdate(query);
                }

                /*Actualizacion de tabla de autoridad y Hechos Violatorios*/
                /*Actualizacion de tabla de medidas Cautelares*/
                query = "Sp_deleteMedcaut " + idqueja;
                mensaje = ejecutaInsertUpdate(query);


                Console.WriteLine("longitudtabla2 = " + longitudtabla2); 

                for (int i = 0; i < longitudtabla2; i++)
                {
                    // 09 01 2026
                    Console.WriteLine(">>> ENTRO AL FOR MEDIDAS i=" + i);

                    fechaemi = form[$"tablaMedCaut[{i}][fechaEmision]"].ToString();
                    fechaate = form[$"tablaMedCaut[{i}][fechaAtencion]"].ToString();
                    noofic = form[$"tablaMedCaut[{i}][noOficio]"].ToString();
                    obsemi = form[$"tablaMedCaut[{i}][obsEmision]"].ToString();
                    obsate = form[$"tablaMedCaut[{i}][obsAtencion]"].ToString();
                    statust = Convert.ToInt32(form[$"tablaMedCaut[{i}][status]"].ToString());
                    nomedidadC = Convert.ToInt32(form[$"tablaMedCaut[{i}][idMedCaut]"].ToString());

                    // 👇 Aquí ya no usas Request.Form.Files
                    archemi = form[$"tablaMedCaut[{i}][archivoEmision]"].ToString();
                    archate = form[$"tablaMedCaut[{i}][archivoAtencion]"].ToString();



                    query = "exec Sp_insertTblMedidas '" +
                            fechaemi + "','" +
                            archemi + "','" +
                            fechaate + "','" +
                            archate + "'," +
                            idqueja + ",'" +
                            noofic + "','" +
                            obsemi + "','" +
                            obsate + "'," +
                            statust + "," +
                            nomedidadC + ",'" +
                            TiGua + "'";

                    //09 01 2026
                    Console.WriteLine("QUERY MEDIDA:");
                    Console.WriteLine(query);
                    mensaje = ejecutaInsertUpdate(query);
                }

                /*Actualizacion de tabla de medidas Cautelares*/
                #region Actualizacion de tabla de diligencias

                query = "Sp_deleteTblDil " + idqueja;
                mensaje = ejecutaInsertUpdate(query);

                for (int i = 0; i < longitudtabla3; i++)
                {
                    //if (TiGua != "preliminar")
                    //{

                    query = "exec Sp_insertTblDil "
                             + idqueja + ",'"
                             + int.Parse(form["tablaDilig[" + i + "][tipodilig]"].ToString()) + "','"
                             + form["tablaDilig[" + i + "][descrip]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][fechaAlta]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][numOfMe]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][atencion]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][archAdj]"].ToString() + "',"
                             + form["tablaDilig[" + i + "][idMedCaut]"].ToString() + ",1,0,"
                             + form["tablaDilig[" + i + "][viaint]"].ToString() + ", '"
                             + form["tablaDilig[" + i + "][fecReci]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][archEvi]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][fecha_soli]"].ToString() + "','"
                             + form["tablaDilig[" + i + "][desc_evi]"].ToString() + "','"
                             + TiGua + "'" + ";";
                    //}
                    //else
                    //{
                    //    query = "exec Sp_updateTblDil " + idqueja + ",'" + int.Parse(form["tablaDilig[" + i + "][tipodilig]"].ToString()) + "','" + form["tablaDilig[" + i + "][descrip]"].ToString() + "','" + form["tablaDilig[" + i + "][fechaAlta]"].ToString() + "','" + form["tablaDilig[" + i + "][numOfMe]"].ToString() + "','" + form["tablaDilig[" + i + "][atencion]"].ToString() + "','" + form["tablaDilig[" + i + "][archAdj]"].ToString() + "'," + form["tablaDilig[" + i + "][idMedCaut]"].ToString() + ",1,0," + form["tablaDilig[" + i + "][viaint]"].ToString() + ", '" + form["tablaDilig[" + i + "][fecReci]"].ToString() + "','" + form["tablaDilig[" + i + "][archEvi]"].ToString() + "','" + form["tablaDilig[" + i + "][fecha_soli]"].ToString() + "','" + form["tablaDilig[" + i + "][desc_evi]"].ToString() + "';";
                    //}
                    mensaje = ejecutaInsertUpdate(query);
                }
                #endregion

                if (TiGua != "preliminar")
                {
                    query = "exec SP_AsignaNumeroExpediente " + idqueja;
                    mensaje = ejecutaInsertUpdate(query);

                    query = "Sp_GetNumExp " + idqueja;
                    var noexpq = GetDatosGeneral(query);
                    foreach (DataRow row in noexpq.Rows)
                    {
                        if (row["numeroexp"] == DBNull.Value || string.IsNullOrWhiteSpace(row["numeroexp"].ToString()))
                        {
                            noexp = "";
                        }
                        else
                        {
                            noexp = row["numeroexp"].ToString();
                        }
                    }
                }
                return Json(new { status = mensaje, no_exp = noexp });
            }
            else if (tipoexp == "2")
            {
                if (expedsc == "99") { expedsc = ""; }
                query = "exec Sp_insertAporta " + idqueja + ",'" + expedsc + "','" + descapo + "', '" + hechos + "', '" + municipoqueja + "', '" + observaciones + "'";
                mensaje = ejecutaInsertUpdate(query);

                if (TiGua != "preliminar")
                {
                    query = "exec Sp_AsignaNumAport " + idqueja;
                    mensaje = ejecutaInsertUpdate(query);
                }
                return Json(new { status = mensaje, no_exp = idqueja });
            }
            else
            {
                return Json(new { status = mensaje, no_exp = noexp });
            }
        }

        public ActionResult RegresaDatos_Cedula(int idqueja)
        {


            return Json(new { mensaje = "error" });
        }

        // 07 01 2026 Ricardo
        // 09 01 2026 Ricardo Se obtiene el nombre del archivo para poder abrirlo a traves de su ruta
        [HttpPost]
        public IActionResult GuardarCalificacion(IFormCollection form)
        {
            try
            {
                Console.WriteLine(">>> ENTRO A GuardarCalificacion");

                // Detectar cuántas filas hay en tablaMedCaut
                int longitudTabla = 0;
                for (int i = 0; i < 100; i++) // límite razonable
                {
                    if (form[$"tablaMedCaut[{i}][archivoEmision]"].Count > 0 ||
                        form[$"tablaMedCaut[{i}][archivoAtencion]"].Count > 0)
                    {
                        longitudTabla = i + 1;
                    }
                    else
                    {
                        break;
                    }
                }

                Console.WriteLine($"Longitud tabla detectada: {longitudTabla}");

                // Procesar las rutas como STRINGS
                for (int i = 0; i < longitudTabla; i++)
                {
                    var rutaEmision = form[$"tablaMedCaut[{i}][archivoEmision]"].ToString();
                    var rutaAtencion = form[$"tablaMedCaut[{i}][archivoAtencion]"].ToString();

                    if (!string.IsNullOrEmpty(rutaEmision))
                    {
                        Console.WriteLine($"📎 Ruta emisión [{i}]: {rutaEmision}");
                    }

                    if (!string.IsNullOrEmpty(rutaAtencion))
                    {
                        Console.WriteLine($"📎 Ruta atención [{i}]: {rutaAtencion}");
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Rutas procesadas correctamente",
                    longitudTabla = longitudTabla
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error en GuardarCalificacion: {ex.Message}");
                return BadRequest(new { success = false, error = ex.Message });
            }
        }


        public class CedulaQuejas
        {
            public int id_expediente { get; set; }
            public string id_abogado_recibe { get; set; }
            public string hechos { get; set; }
            public string fecha_registro { get; set; }
            public string id_sede { get; set; }
            public string id_lugar_hechos { get; set; }
            public string Via_interpos { get; set; }
            public string visitaduria { get; set; }
            public string observaciones { get; set; }
            public string id_especializado { get; set; }
            public string id_tras_op_pub { get; set; }
            public string tipo_expediente { get; set; }
            public string id_materia { get; set; }
            public string id_niv_riesgo { get; set; }
            public string id_programa { get; set; }
            public string estatus_Expediente { get; set; }
            public string fecha_mod { get; set; }
            public string fecha_turno_vg { get; set; }
            public List<CedulaQuejasPeticionario> listpeti { get; set; }
            public List<CedulaQuejasautoridad> listaut { get; set; }


            public CedulaQuejas() { }
        }

        public class CedulaQuejasPeticionario 
        {
            public int id { get; set; }
            public string tipopet { get; set; }
            public string nombrepet { get; set; }

            public CedulaQuejasPeticionario() { }
            public CedulaQuejasPeticionario(int i, string s1, string s2)
            {
                id = i;
                tipopet = s1;
                nombrepet = s2;
            }
        }
        public class CedulaQuejasautoridad
        {
            public string idautoridad { get; set; }
            public string ambito { get; set; }
            public string nombre { get; set; }

            public CedulaQuejasautoridad () { }
            public CedulaQuejasautoridad(string i1,string s1,string s2) 
            {
                idautoridad = i1;
                ambito = s1;
                nombre = s2;
            }
        }
        public class SelectAUT_HEV
        {
            public int id_queja { get; set; }
            public int id_autoridad { get; set; }
            public int id_hechov { get; set; }
            public int id_linea { get; set; }
            public string Version { get; set; }
            public int Eliminado { get; set; }
            public int tipo { get; set; }
            public SelectAUT_HEV() { }
            public SelectAUT_HEV(int id_queja, int id_autoridad, int id_hechov, int id_linea, string Version, int Eliminado, int tipo)
            {
                this.id_queja = id_queja;
                this.id_autoridad = id_autoridad;
                this.id_hechov = id_hechov;
                this.id_linea = id_linea;
                this.Version = Version;
                this.Eliminado = Eliminado;
                this.tipo = tipo;
            }
        }

        public class SelectCausaC 
        {
            public int idqueja { get; set; }
            public string fechac { get; set; }
            public string causac { get; set; }
            public string causacdesc { get; set; }
            public string acto_rest { get; set; }
            public string obs { get; set; }

            public SelectCausaC() { }
            public SelectCausaC(int i, string fe,string cau,string caudes,string actor,string ob) 
            {
                this.idqueja = i;
                this.fechac = fe.Substring(0,10);
                this.causac = cau;
                this.causacdesc = caudes;
                this.acto_rest = actor;
                this.obs = ob;
            }
        }

        public class selectMED_CAUT
        { 

            public int idqueja { get; set; }
            public string no_oficio { get; set; }
			public string fecha_emision { get; set; }
			public string archivo_emision { get; set; }
			public string obs_emision { get; set; }
			public string fecha_atencion { get; set; }
			public string archivo_atencion { get; set; }
			public string obs_atencion { get; set; }
            public int status { get; set; }

            public selectMED_CAUT()
            { 
            }

            public selectMED_CAUT(int idq,string no_of,string fecha_em,string arch_emi,string obs_emi,string fecha_aten,string arch_aten,string obs_aten,int stat) 
            {
                idqueja = idq;
                no_oficio = no_of;
                fecha_emision = fecha_em;
                archivo_emision = arch_emi;
                obs_emision=obs_emi;
                fecha_atencion= fecha_aten;
				archivo_atencion= arch_aten;
                obs_atencion= obs_aten;
                status = stat;

			}
		}

        public class cedulaCalificacion
        {
            public int id { get; set; }
            public string Expediente { get; set; }
            public String fecha_Hora_registro { get; set; }
            public string fecha_Hora_turnoe { get; set; }
            public string fecha_RFV { get; set; }
            public string fecha_TA { get; set; }
            public string VIA_ENTRADA { get; set; }
            public string fecha_calificacion { get; set; }
            public string FECHA_ULTIMA_MODIFI { get; set; }
            public string lugar_Hechos { get; set; }
            public string ASUNTO { get; set; }
            public string materia { get; set; }
            public string programa { get; set; }
            public string caracter_pet { get; set; }
            public string hechos { get; set; }
            public List<peticionariocedula> listpet { get; set; }
            public List<authecCedula> listauth { get; set; }
            public string visitaduría { get; set; }
            public string abogado { get; set; }
            public string visitador { get; set; }
            public List<SelectCausaC> listacasa { get; set; }
            public DateTime? fechactual { get; set; }


            public cedulaCalificacion() { }
            public cedulaCalificacion(int i,string s1, string s2, string s3, string s4, string s5, string s6, string s7, string s8, string s9, string s10, string s11, string s12, string s13, List<peticionariocedula> lp,List<authecCedula> li)
            {
                id = i;
                Expediente = s1;
                fecha_Hora_registro = s2;

            }
        }

        public class CedulaBitacoraCambios
        {
            public string id_queja { get; set; }
            public DateTime? FechaHoraImpr { get; set; }
            public List<BitacoraCambio> biracambios { get; set; }

            public CedulaBitacoraCambios() { }
            public CedulaBitacoraCambios(string idqueja, DateTime? fehorImp, List<BitacoraCambio> bitcam)
            {
                id_queja = idqueja;
                FechaHoraImpr = fehorImp;
                biracambios = bitcam;
            }
        }

        public class BitacoraCambio
        {
            public string Apartado { get; set; }
            public string Tipo { get; set; }
            public string Campo { get; set; }
            public string Antes { get; set; }
            public string Despues { get; set; }
            public string FechaHora { get; set; }
            public string Usuario { get; set; }
            public string IP { get; set; }

            public BitacoraCambio() { }
            public BitacoraCambio(string apart, string tip, string cam, string ant, string desp, string fehor, string usu, string ip)
            {
                Apartado = apart;
                Tipo = tip;
                Campo = cam;
                Antes = ant;
                Despues = desp;
                FechaHora = fehor;
                Usuario = usu;
                IP = ip;
            }
        }

        public class peticionariocedula
        {
            public int id { get; set; }
            public string tipopet { get; set; }
            public string nombrepet { get; set; }

            public peticionariocedula() { }
            public peticionariocedula(int i, string s1,string s2) 
            {
                id = i;
                tipopet = s1;
                nombrepet = s2;
            }
        }

        public class authecCedula
        {
            public string autoridad { get; set; }
            public string HV { get; set; }
            public string DH { get; set; }
        }
        // Lista obtener datos de tabla Autoridades - Hechos Violatorios
        [HttpPost]
        public ActionResult SelectAutorHech(string idqueja, string version)
        {
            string version2 = "";
            List<SelectAUT_HEV> autorhech = new List<SelectAUT_HEV>();
            String query = "";
            if (version == "EDICION")
            {
                //version2 = "CALIFICACION";
                query = "exec Sp_obtener_aut_hecvio " + idqueja;
            }
            else
            {
                query = "exec Sp_obtener_aut_hecvio_version " + idqueja+",'"+ version + "'";
            }

            string mensaje = "";
            autorhech = conexionsql.SelectAutHec(query, ref mensaje);

            if (autorhech.Count > 0)
            {
                return Json(new { autoridhecho = autorhech });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        [HttpPost]
        public ActionResult SelectCausa(string idqueja)
        {
            System.Diagnostics.Debug.WriteLine("ID RECIBIDO: [" + idqueja + "]");

            List<SelectCausaC> autorhech = new List<SelectCausaC>();
            String query = "exec Sp_obtener_causac '" + idqueja + "'";
            string mensaje = "";
            autorhech = conexionsql.Selectcausa(query, ref mensaje);

            if (autorhech.Count > 0)
            {
                return Json(new { conclusiones  = autorhech });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin obtener datos de tabla Autoridades - Hechos Violatorios
        public class SelectDILIG
        {
            public int id_queja { get; set; }
            public int Tipo_diligencia { get; set; }
            public string descripcion { get; set; }
            public string fecha_emi { get; set; }
            public string oficioMemo { get; set; }
            public string plaz_aten { get; set; }
            public string ruta_archivo { get; set; }
            public int id_fila { get; set; }
            public string version { get; set; }
            public int eliminado { get; set; }
            public int id_viainter { get; set; }
            public string fecharecibo { get; set; }
            public string ruta_arch_eviden { get; set; }
            public string fecha_soli { get; set; }
            public string desc_evi { get; set; }
            public string semaforo { get; set; }
            public SelectDILIG() { }
            public SelectDILIG(int id_queja, int Tipo_diligencia, string descripcion, string fecha_emi, string oficioMemo, string plaz_aten, string ruta_archivo, int id_fila, string version, int eliminado, int id_viainter, string fecharecibo, string ruta_arch_eviden, string fecha_soli, string desc_evi, string semaforo)
            {
                this.id_queja = id_queja;
                this.Tipo_diligencia = Tipo_diligencia;
                this.descripcion = descripcion;
                this.fecha_emi = fecha_emi;
                this.oficioMemo = oficioMemo;
                this.plaz_aten = plaz_aten;
                this.ruta_archivo = ruta_archivo;
                this.id_fila = id_fila;
                this.version = version;
                this.eliminado = eliminado;
                this.id_viainter = id_viainter;
                this.fecharecibo = fecharecibo;
                this.ruta_arch_eviden = ruta_arch_eviden;
                this.fecha_soli = fecha_soli;
                this.desc_evi = desc_evi;
                this.semaforo = semaforo;
            }
        }
        // Lista obtener datos de tabla Diligencias
        [HttpPost]
        public ActionResult SelectDiligencias(string idqueja, string version)
        {

            String query = "";
            List<SelectDILIG> diligen = new List<SelectDILIG>();
            if (version == "EDICION")
            {
                query = "exec Sp_obtener_diligen " + idqueja;
            }
            else
            {
                query = "exec Sp_obtener_diligen_version " + idqueja + ",'" + version + "'";
            }

            string mensaje = "";
            diligen = conexionsql.SelectDilig(query, ref mensaje);

            foreach (SelectDILIG dil in diligen)
            {
                dil.semaforo = "<div class=\"badge status-badge badge-danger\">NO</div>";
                if (dil.Tipo_diligencia == 3 && !string.IsNullOrEmpty(dil.ruta_arch_eviden))
                {
                    dil.semaforo = "<div class=\"badge status-badge badge-success\">SI</div>";
                    continue;
                }
                if (dil.Tipo_diligencia != 3)
                {
                    DateTime fechaUno = Convert.ToDateTime(dil.fecha_soli);
                    DateTime fechaDos = string.IsNullOrEmpty(dil.plaz_aten) ? DateTime.Now : Convert.ToDateTime(dil.fecha_soli).AddDays(int.Parse(dil.plaz_aten));
                    DateTime fechahoy = DateTime.Today;
                    dil.semaforo = "<div class=\"badge status-badge badge-success\">SI</div>";
                    int diasTrans = (fechaDos - fechaUno).Days;
                    int diastranshoy = (fechahoy - fechaUno).Days;
                    int plazAten = Convert.ToInt16(dil.plaz_aten);



                    //Verificar el archivo de evidencia
                    if (!string.IsNullOrEmpty(dil.fecharecibo))
                    {
                        dil.semaforo = "<div class=\"badge status-badge badge-success\">SI</div>";
                    }
                    else if (diasTrans != plazAten || (diasTrans == plazAten && string.IsNullOrEmpty(dil.fecharecibo)))
                    {
                        if (diastranshoy > diasTrans)
                        {
                            query = $"exec semaforo {diastranshoy}, {plazAten - 1}, {plazAten}, 1";
                            dil.semaforo = "<small><strong>Se venció su plazo de atención hace: </strong></small>" + conexionsql.ObtenerReader(query);
                        }
                        else
                        {
                            if (diastranshoy < 0)
                            {
                                query = $"exec semaforo {diastranshoy}, {plazAten - 1}, {plazAten}, 1";
                                dil.semaforo = conexionsql.ObtenerReader(query) + "<small><strong>Días sin atender</strong></small>";
                            }
                            else
                            {
                                query = $"exec semaforo {diastranshoy}, {plazAten - 1}, {plazAten}, 1";
                                dil.semaforo = conexionsql.ObtenerReader(query) + "<small><strong> sin atender</strong></small>";
                            }
                        }
                    }
                }
            }
            if (diligen.Count > 0)
            {
                return Json(new { diligencias = diligen });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }
        // Fin obtener datos de tabla Diligencias
        [HttpPost]
        public ActionResult SelectMedc(string idqueja, string version)
        {
            String query = "";
            
            List<selectMED_CAUT> autorhech = new List<selectMED_CAUT>();
            if (version == "EDICION")
            {
                query = "exec Sp_obtener_med_caut " + idqueja;

            }
            else
            {
                query = "exec Sp_obtener_med_caut_version " + idqueja+",'"+ version + "'";
            }
            
            string mensaje = "";
            autorhech = conexionsql.Selectmedcaut(query, ref mensaje);
            if (autorhech.Count > 0)
            {
                return Json(new { medcaut = autorhech });
            }
            else
            {
                return Json(new { mensaje = "error" });
            }
        }

        public ActionResult VerificarPeticionarios(IFormCollection form, string nombreS)
        {
            string numFrm = form["numFrm"].ToString();
            string id_queja = form["idquejagenerado"].ToString();
            string curp = form["CURP_petit-frmDatosPersonales" + numFrm].ToString().ToUpper();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom_petit-frmDatosPersonales" + numFrm].ToString().ToLower()));
            string email = form["email_petit-frmDatosPersonales" + numFrm].ToString();
            string tipouser = form["qatu_petit-frmDatosPersonales" + numFrm].ToString();
            string mensaje = "";
            String query = "";
            if (tipouser == "")
            {
                tipouser = "Peticionario";
            }
            if ((curp == "" || curp.ToUpper() == "NO PROPORCIONADO") && (apellidop == "" || apellidop.ToUpper() == "NO PROPORCIONADO") && (apellidom == "" || apellidom.ToUpper() == "NO PROPORCIONADO"))
            {
                curp = ""; apellidop = ""; apellidom = "";
            }
            if (nombre == "" || nombre.ToUpper() == "NO PROPORCIONADO")
            {
                curp = ""; apellidop = ""; apellidom = ""; nombre = nombreS;
            }

            query = "EXEC Sp_VerificarPeticionariosQueja '" + id_queja + "', '" + curp + "', '" + nombre + "', '" + apellidop + "', '" + apellidom + "', '" + email + "', '" + tipouser + "';";

            var data_abog_dqot = GetDatosGeneral(query);
            if (data_abog_dqot.Rows.Count>0)
            {
                foreach (DataRow row in data_abog_dqot.Rows)
                {
                    mensaje = row["id"].ToString();
                }
            }
            else
            {
                mensaje = "error";
            }
            return Json(new { mensaje = mensaje });
        }


        public ActionResult ObtenerVia(string idqueja)
        {
            string mensaje = "";
            String query = "";

            query = "EXEC Sp_TipoInterpos_Queja '" + idqueja + "';";

            var data_abog_dqot = GetDatosGeneral(query);
            if (data_abog_dqot.Rows.Count > 0)
            {
                foreach (DataRow row in data_abog_dqot.Rows)
                {
                    mensaje = row["id_via_interposicion"].ToString();
                }
            }
            else
            {
                mensaje = "error";
            }
            return Json(new { mensaje = mensaje });
        }
        
        public ActionResult VerificarPeticionariosAgrav(string idqueja)
        {
            string mensaje = "";
            String query = "";

            query = "EXEC Sp_obtener_peticionarios_agraviados '" + idqueja + "';";

            var data_abog_dqot = GetDatosGeneral(query);
            if (data_abog_dqot.Rows.Count > 0)
            {
                foreach (DataRow row in data_abog_dqot.Rows)
                {
                    mensaje = row["TIPO_USUARIO"].ToString();
                }
            }
            else
            {
                mensaje = "error";
            }
            return Json(new { mensaje = mensaje });
        }
        // Fin obtener datos de tabla Diligencias

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
                if (contenido!="")
                {
                    var lista = "["+contenido+"]";
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

        public IActionResult ConsultarArchivoCalificacion(string fileName)
        {
            fileName = Path.GetFileName(fileName);

            var filePath = Path.Combine(
                _hostingEnvironment.WebRootPath,
                "Archivos",
                "Calificacion",
                fileName
            );

            if (!System.IO.File.Exists(filePath))
                return NotFound("Archivo no encontrado");

            return PhysicalFile(filePath, "application/pdf");
        }

    }
}
