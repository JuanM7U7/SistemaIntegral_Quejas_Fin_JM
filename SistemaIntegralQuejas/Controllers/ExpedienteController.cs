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

        public ExpedienteController(IWebHostEnvironment hostingEnvironment)
        {

            _hostingEnvironment = hostingEnvironment;

        }

        public ActionResult Index()
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

                CancelacionExpedientesActaC escritoitem = new CancelacionExpedientesActaC();
                escritoitem.IDexp = Convert.ToInt32(row["FK_EXPEDIENTE"].ToString());
                escritoitem.IDActaC = Convert.ToInt32(row["FK_ACTAC"].ToString());
                listformatos1.Add(escritoitem);
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
                cmd.Parameters.Add("@id_ultimo_insertadoLE ", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;
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

        public async Task<ActionResult> TurnoPreliminar(IFormCollection form)
        {
            string queryupdatestatusext = "";
            string queryupdatetblturno = "";
            string queryinsert_memo = "";
            int status_exp = 6;
            string mensajet = "no";

            string num_memorandum = form["num_memosendexp"].ToString();
            string fk_area_origen = form["area_origen"].ToString();
            string fk_usuario = form["usuario_registra"].ToString();

            List<ExpedienteTurnoModificado> lstExpedientesTurnados = JsonConvert.DeserializeObject<List<ExpedienteTurnoModificado>>(form["dataexpturno"].ToString());
            bool resp = false;

            if (lstExpedientesTurnados.Count > 0)
            {
                string asunto = "Remisión de escritos iniciales de quejas a la " + lstExpedientesTurnados[0].Txtvisitaduria + " Visitaduría";

                queryinsert_memo = "exec Sp_Insert_Memorandum '" + num_memorandum + "','" + fk_area_origen + "','" + lstExpedientesTurnados[0].Clavevisitaduria + "','" + asunto + "','" + fk_usuario + "', '" + lstExpedientesTurnados[0].fk_iduserdestinatario + "'";
                int n_memo = conexionsql.InsertUpdateDeleteRegresaid(queryinsert_memo);

                if (n_memo > 0)
                {
                    for (int i = 0; i < lstExpedientesTurnados.Count; i++)
                    {
                        queryupdatestatusext = "exec Sp_Update_Status_Expediente '" + lstExpedientesTurnados[i].IdExpediente + "','" + status_exp + "'";
                        int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);

                        if (sino > 0)
                        {
                            queryupdatetblturno = "exec Sp_Update_Expediente_Turno '" + lstExpedientesTurnados[i].IdExpediente + "','" + lstExpedientesTurnados[i].Fechaturnovisitaduriatxt + "', '" + lstExpedientesTurnados[i].Clavevisitaduria + "', '" + n_memo + "', '" + lstExpedientesTurnados[i].FechastrFinDqot + "'";
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

            return Json(new { mensaje = mensajet, data = resp });

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

        public async Task<ActionResult> GeneraEscritoInicialnuevo(IFormCollection form)
        {
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
            int numextLH = 0;
            int numintLH = 0;
            string cpLH = "";
            string CircunstanciasHechos = form["CircunstanciasHechos"].ToString() != "" ? form["CircunstanciasHechos"].ToString() : "";
            string tipofrm = form["tipoform"].ToString();

            // Subir archivo adjunto escrito inicial
            var uploaded_files = Request.Form.Files;
            int iCounter = 0;
            int iCounteredit = int.Parse(form["conteditfiles"].ToString());
            string sFiles_uploaded = "";
            List<string> list_Files = new List<string>();

            // --------------------------------------------------- Registrar escrito inicial 
            try
            {
                if (direccionCompleta)
                {
                    calleLH = form["calleLH"].ToString();
                    numextLH = int.Parse(form["numextLH"].ToString());
                    if (form["numintLH"].ToString() != "") numintLH = int.Parse(form["numintLH"].ToString());
                    cpLH = form["cpLH"].ToString();
                    coloniaLH = form["coloniaLH"].ToString();
                }

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
                idescritoinicial = Convert.ToInt32(cmd.Parameters["@id_escrito"].Value);

                // --------------------------------------------------- Fin Registrar escrito inical


                // --------------------------------------------------- Subir archivo adjunto escrito inicial

                if (uploaded_files.Count > 0)
                {
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
                        string uploaded_Filename = "";
                        if (tipofrm == "buscadorfirmatos")
                        {
                            uploaded_Filename = "escritoInicial_" + idQueja + "_" + iCounteredit + type_archivo;
                        }
                        else
                        {
                            uploaded_Filename = "escritoInicial_" + idQueja + "_" + iCounter + type_archivo;
                        }
                        string new_Filename_on_Server = path_for_Uploaded_Files + "\\" + uploaded_Filename;
                        //</ FIN  Renombrar nombre del archivo nomenclatura escritoi  >

                        // Copiar a carpeta
                        using (FileStream stream = new FileStream(new_Filename_on_Server, FileMode.Create))
                        {
                            await uploaded_file.CopyToAsync(stream);
                        }

                        // Registrar ruta a la base de datos
                        queryenlaceescritoiuploads = "exec Sp_Insert_Enlace_Archivosaj_Escritoi " + idescritoinicial + " ,'" + uploaded_Filename + "' ,'" + type_archivo + "'";
                        bool sinoc = conexionsql.InsertUpdateDelete(queryenlaceescritoiuploads);

                    }

                }


                // --------------------------------------------------- Si hay autoridades se registran
                string queryenlaceautoridad = "";
                string queryeliminaautoridad = "";
                if (lstAutoridades.Count > 0)
                {
                    queryeliminaautoridad = "UPDATE ENLACE_ESCRITO_AUTORIDAD SET Fk_Status = 3 WHERE Id_queja = " + idQueja;
                    bool eliminado = conexionsql.InsertUpdateDelete(queryeliminaautoridad);

                    for (int i = 0; i < lstAutoridades.Count; i++)
                    {
                        queryenlaceautoridad = "exec SP_insertEnlaceAutoridadEscrito " + idescritoinicial + " ,'" + lstAutoridades[i].IdAutoridad + "' ,'" + lstAutoridades[i].NombrePersona + "' ,'" + lstAutoridades[i].CargoPersona + "', '" + idQueja + "'";
                        bool sino = conexionsql.InsertUpdateDelete(queryenlaceautoridad);
                    }

                }

                queryf = "exec Sp_Regresa_Escrito_Inicial_Queja " + idescritoinicial;
                mensaje = "ok";
                escrito = conexionsql.regresaEscritoInicial(1, queryf, ref mensaje);
                mensaje = "ok";

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
        public ActionResult GeneraActaCircunstanciadaNuevo(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
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
            string origenPet = form["origenPetval" + nformulario].ToString();
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
            string fechaHechos = form["fechaHechos" + nformulario].ToString() + ' ' + horaHechos;
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
                query = "[dbo].[InsertActacAlta]";

                SqlCommand cmd = new SqlCommand(query, conexionsql.conexion(ref mensajet));

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

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }
            actaC = new ActacModificado();

            query = "exec Sp_Regresa_Acta_CircunstanciadaNuevo " + UltimoID_Recuperado;
            string mensaje = "";
            actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
            mensajet = "ok";


            return Json(new { mensaje = mensajet, listat = actaC });


        }
        public ActionResult ActualizaEnlaceFormatoQueja(IFormCollection form)
        {
            string idActaC = form["id_documento"].ToString(); // id escrito
            string idEnlace = form["id_enlace"].ToString(); // id queja
            string documento = form["documento"].ToString(); // tipo documento
            string query = "";
            bool statusresp = false;

            query = "exec Sp_UpdateEnlaceFormatoQueja '" + idActaC + "','" + idEnlace + "', '" + documento + "'";
            int idenlacequeja = conexionsql.InsertUpdateDeleteRegresaid(query);

            if (idenlacequeja > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }


            return Json(new { status = statusresp, respidenlacequeja = idenlacequeja });
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

        public ActionResult GuardaActaC(IFormCollection form)
        {
            String query = "";
            string mensajet = "";
            string[] hora_completa = form["horaInicio"].ToString().Split(":");
            string[] horaHechosC = form["horaHechos"].ToString().Split(":");
            string[] horaTerminoc = form["horaTermino"].ToString().Split(":");
            int idActaC = 0;
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

                query = "[dbo].[InsertActac]";
                SqlConnection connection = new SqlConnection(conexionsql.ConnectionStrng());
                SqlCommand cmd = new SqlCommand(query, connection);
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
                cmd.Parameters.Add("@idPet", System.Data.SqlDbType.Int).Value = idPet;
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

            }
            catch (Exception e)
            {
                mensajet = e.Message;
            }

            if (form["idqueja"].ToString() != "")
            {

            }

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
            return RedirectToAction("Memorandum_Eidq_Dqot");
        }

        public ViewAsPdf Memorandum_Eidq_Dqot()
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
                query_titularareades = "exec Sp_GetDataUsuario " + "'" + Convert.ToInt32(row["fk_iduserdestinatario"]) + "'";
                var data_titulardes = GetDatosGeneral(query_titularareades);
                List<Usuario> listTitulardes = new List<Usuario>();

                foreach (DataRow row_tdes in data_titulardes.Rows)
                {
                    Usuario userItem = new Usuario();
                    userItem.IdUsuario = (Convert.ToInt32(row_tdes["ID_USUARIO"]));
                    userItem.Nombre = (row_tdes["NOMBRE"]).ToString().ToUpper();
                    userItem.Ap = (row_tdes["APELLIDO_PATERNO"]).ToString().ToUpper();
                    userItem.Am = (row_tdes["APELLIDO_MATERNO"]).ToString().ToUpper();
                    userItem.GradoAcademico = (row_tdes["GRADO_ACADEMICO"]).ToString().ToUpper();
                    userItem.CargoDocumentos = (row_tdes["CARGO_DOCUMENTOS"]).ToString().ToUpper();
                    listTitulardes.Add(userItem);
                }
                // Fin Titular de area a la visitaduria que se le asigno

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
                CustomSwitches = " --page-offset 0 --header-html https://localhost:7126/Encabezado/Index --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html https://localhost:7126/PieDePagina/Index --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
        }

        public ActionResult VerPDF(int idescrito)
        {
            TempData["idescritort"] = idescrito;
            return RedirectToAction("Escrito_Inicial_de_Queja");
        }

        public ActionResult verPDFRechazo(int idqueja, string visd, string memo, string p1, string p2, string p3, string just, string idsa, string vg, string acep)
        {
            string[] desarrolloidsaacpt = null;
            string[] desarrolloJust = null;
            string[] desarrolloidsa = null;
            bool hayidsAceptados = false;




            if (just is not null) { desarrolloJust = just.Split(','); }
            if (idsa is not null) { desarrolloidsa = idsa.Split(','); }
            if (acep is not null) { desarrolloidsaacpt = acep.Split(','); hayidsAceptados = true; }
            TempData["idescritort"] = idqueja;
            TempData["vis"] = visd;
            TempData["memo"] = memo;
            TempData["p1"] = p1;
            TempData["p2"] = p2;
            TempData["p3"] = p3;
            TempData["just"] = desarrolloJust;
            TempData["idsa"] = desarrolloidsa;
            TempData["vg"] = vg;
            TempData["acep"] = desarrolloidsaacpt;
            TempData["hayidsAceptados"] = hayidsAceptados;


            if (visd is null && memo is null && p1 is null && p2 is null && p3 is null && just is null && idsa is null && vg is null)
            {
                return RedirectToAction("ActualizaAceptados");
            }
            else
            {
                return RedirectToAction("FormatoRechazo");
            }
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

        public ViewAsPdf FormatoRechazo()
        {
            var pdfescritoi = new List<PDF_Formato_Rechazo>();

            int? idei = (int?)TempData["idescritort"];
            string vis = (string)TempData["vis"];
            string memo = (string)TempData["memo"];
            string p1 = (string)TempData["p1"];
            string p2 = (string)TempData["p2"];
            string p3 = (string)TempData["p3"];
            string[] just = (string[])TempData["just"];
            string[] idsa = (string[])TempData["idsa"];
            string[] idsacept = (string[])TempData["acep"];
            string vg = (string)TempData["vg"];
            bool hayidsAceptados = (bool)TempData["hayidsAceptados"];

            string query = "exec Sp_Pdfescritoinicial " + idei;
            string query2 = "exec Sp_Pdfescritoinicial " + idei;
            var data = GetDatosGeneral(query);

            if (hayidsAceptados)
            {
                for (int i = 0; i < idsacept.Length; i++)
                {
                    string queryupdatestatusext = "exec Sp_Update_Status_Expediente '" + idsacept[i] + "','7'";
                    int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);
                }
            }

            foreach (DataRow row in data.Rows)
            {

                PDF_Formato_Rechazo itemPdfei = new PDF_Formato_Rechazo();
                List<listadoObservaciones> listadoC = new List<listadoObservaciones>();

                itemPdfei.Visitaduría = vis;
                itemPdfei.Memorandum = memo;
                itemPdfei.NumeroExp = idei.ToString();
                itemPdfei.PrimeraParte = p1;
                itemPdfei.SegundaParte = p2;
                itemPdfei.TerceraParte = p3;
                itemPdfei.Firma_Parte = vg;


                for (int i = 0; i < just.Length; i++)
                {
                    listadoObservaciones listadod = new listadoObservaciones(idsa[i], just[i]);


                    string queryupdatestatusext = "exec Sp_Update_Status_Expediente '" + idsa[i] + "','8'";
                    int sino = conexionsql.InsertUpdateDeleteRegresaid(queryupdatestatusext);
                    listadoC.Add(listadod);

                }
                itemPdfei.listado = listadoC;

                // Quejosos y agraviados ligados a este escrito);


                pdfescritoi.Add(itemPdfei);
            }
            //Calificacion();
            return new ViewAsPdf("verPDFRechazo", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 20, Right = 20 },

                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html https://localhost:7126/Encabezado/Index --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html https://localhost:7126/PieDePagina/Index --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

            };
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



            return new ViewAsPdf("VerPDF", pdfescritoi)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 20, Right = 20 },

                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html https://localhost:7126/Encabezado/Index --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html https://localhost:7126/PieDePagina/Index --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

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
            string estatusFormatos = "";

            List<TablaBusquedaFormatos> listformatos = new List<TablaBusquedaFormatos>();
            List<TblActac> arreglo_actac = new List<TblActac>();
            String query = "exec Sp_Select_Formatos_Queja '" + nom_peticionario + "' ,'" + ap_peticionario + "' ,'" + am_peticionario + "', '" + curp + "', '" + idqueja + "','" + via_interposicion + "','" + estatus_queja + "','" + fecha_reg + "'";
            String query_petiexp = "";
            String query_actasc = "";
            String query_turnoexp = "";
            String query_escritosi = "";
            var data = GetDatosGeneral(query);

            foreach (DataRow row in data.Rows)
            {

                TablaBusquedaFormatos itemformatos = new TablaBusquedaFormatos();
                //itemformatos.IdUnionFormatosQueja = Convert.ToInt32(row["ID_UNION_FORMATOS_QUEJA"]);
                itemformatos.FkExpediente = Convert.ToInt32(row["ID_EXPEDIENTE"]);
                itemformatos.Nombre_agraviado = (row["NOMBRE_COMPLETO"]).ToString();

                //OBTENER DATOS COMPLEMENTARIOS
                query = "exec Sp_carga_informacion_Complementaria '" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                string query1 = "exec Sp_carga_informacion_Complementaria_peticionario '" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                string query2 = "exec Sp_carga_informacion_Complementaria_Autoridad '" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                string mensaje = "";
                itemformatos.informacioncomplementaria = conexionsql.datoscomplementarios(query, ref mensaje, query1, query2);
                //FIN DE OBTENER DATOS COMPLEMENTARIOS

                // Quejosos y agraviados ligados a esta queja
                query_petiexp = "exec Sp_GetDataPeticionarioXExp " + "'" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                var data_petiexp = GetDatosGeneral(query_petiexp);
                List<DatosEditPeticionario> peticionariolist = new List<DatosEditPeticionario>();

                foreach (DataRow row_petiexp in data_petiexp.Rows)
                {
                    DatosEditPeticionario peticionario = new DatosEditPeticionario();
                    peticionario.IdComplementoPeticionario = Convert.ToInt32(row_petiexp["ID_COMPLEMENTO_PETICIONARIO"]);
                    peticionario.FkRegRecepcion = Convert.ToInt32(row_petiexp["FK_REG_RECEPCION"]);
                    peticionario.Nombre = (row_petiexp["NOMBRE"]).ToString();
                    peticionario.ApellidoPat = (row_petiexp["APELLIDO_PAT"]).ToString();
                    peticionario.ApellidoMat = (row_petiexp["APELLIDO_MAT"]).ToString();
                    peticionario.TipoUsuario = (row_petiexp["TIPO_USUARIO"]).ToString();
                    //OBTENER DATOS PETICIONARIO FORMATO
                    query = "exec Sp_GetDataPeticionarioxIdComp " + "'" + peticionario.IdComplementoPeticionario + "'";
                    var dataPet = GetDatosGeneral(query);
                    peticionario.lPeticionario = ObtenerlistPeticionario(dataPet);
                    //FIN DE OBTENER DATOS PETICIONARIO FORMATO
                    peticionariolist.Add(peticionario);
                }

                // Fin Quejosos y agraviados ligados a esta queja

                // Agregar Escrito inicial
                query_escritosi = "exec Sp_GetDataEscritoixExp " + "'" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                var data_escritosi = GetDatosGeneral(query_escritosi);
                List<TblEscritoi> listEscritoi = new List<TblEscritoi>();
                foreach (DataRow row_actac in data_escritosi.Rows)
                {
                    TblEscritoi escritoiItem = new TblEscritoi();
                    escritoiItem.IdEscrito = (Convert.ToInt32(row_actac["ID_ESCRITOI"]));
                    escritoiItem.Nombre_petligadoei = (row_actac["NOMBRE_COMPLETOEI"]).ToString();
                    escritoiItem.Idcomplementopetei = (row_actac["Fk_IdComplementoPet"]).ToString();

                    //OBTENER DATOS DE FORMATO DE ESCRITO INICIAL
                    query = "exec Sp_Regresa_Escrito_Inicial_Queja_Edición " + Convert.ToInt32(row_actac["ID_ESCRITOI"]);
                    var dataEscIni = GetDatosGeneral(query);

                    escritoiItem.lEscritoI = ObtenerlistEscriIni(dataEscIni);
                    //FIN DE OBTENER DATOS DE FORMATO DE ESCRITO INICIAL
                    listEscritoi.Add(escritoiItem);
                }
                // Fin Agregar Escrito inicial

                //Agregar actas circunstanciadas
                query_actasc = "exec Sp_GetDataActacxExp " + "'" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
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
                //Fin Agregar actas circunstanciadas

                // Agregar datos de turno
                query_turnoexp = "exec Sp_GetDataTurnoExp " + "'" + Convert.ToInt32(row["ID_EXPEDIENTE"]) + "'";
                var data_turnoexp = GetDatosGeneral(query_turnoexp);
                List<ExpedienteTurnoModificado> listTurnoexp = new List<ExpedienteTurnoModificado>();

                foreach (DataRow row_turnoexp in data_turnoexp.Rows)
                {
                    ExpedienteTurnoModificado turnoexpItem = new ExpedienteTurnoModificado();

                    turnoexpItem.IdExpediente = (row_turnoexp["id_expediente"]).ToString();
                    //turnoexpItem.Fechaturnovisitaduria = FechaVacio(Convert.ToDateTime(row_turnoexp["fechaturnovisitaduria"])) == true ? Convert.ToDateTime("1900-01-01 10:00:00 PM") : Convert.ToDateTime(row_turnoexp["fechaturnovisitaduria"]);
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
                    else
                    { turnoexpItem.Clavevisitaduria = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["claveabogadoturnado"]).ToString()))
                    { turnoexpItem.Claveabogadoturnado = (Convert.ToInt32(row_turnoexp["claveabogadoturnado"])); }
                    else
                    { turnoexpItem.Claveabogadoturnado = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["fecharecepfis"]).ToString()))
                    { turnoexpItem.Fecharecepfis = Convert.ToDateTime(row_turnoexp["fecharecepfis"]); }
                    else
                    { turnoexpItem.Fecharecepfis = Convert.ToDateTime("1900-01-01 10:00:00 PM"); }

                    if (!string.IsNullOrEmpty((row_turnoexp["descripcion"]).ToString()))
                    { turnoexpItem.Txtvisitaduria = (row_turnoexp["descripcion"]).ToString(); }
                    else { turnoexpItem.Txtvisitaduria = "No"; }

                    if (!string.IsNullOrEmpty((row_turnoexp["fk_memorandum"]).ToString()))
                    { turnoexpItem.FkMemorandum = (Convert.ToInt32(row_turnoexp["fk_memorandum"])); }
                    else
                    { turnoexpItem.FkMemorandum = 0; }

                    if (!string.IsNullOrEmpty((row_turnoexp["num_fojas"]).ToString()))
                    { turnoexpItem.NumFojas = (Convert.ToInt32(row_turnoexp["num_fojas"])); }
                    else
                    { turnoexpItem.NumFojas = 0; }

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
                // Fin de agregar datos de turno

                itemformatos.FechaRegistro = Convert.ToDateTime(row["fecha_registrro"]);
                itemformatos.VIA_INTERPOSICION = (row["VIA_INTERPOSICIÓN"]).ToString();
                itemformatos.Status_Expediente = (row["STATUS_EXP"]).ToString();

                itemformatos.AgravQuej = peticionariolist;
                itemformatos.ActaCa = listActasc;
                itemformatos.Escritoia = listEscritoi;
                itemformatos.ExpedienteTurno = listTurnoexp;

                listformatos.Add(itemformatos);
            }


            // contadorActaC = listActasc.Count;

            return Json(new { data = listformatos });
        }


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

        public ActionResult listadovisitadorGeneral(int vis, int idabogado)
        {
            int visitaduria = vis;
            int idAbogado = idabogado;

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
                itemformatos.FechaTurno = (row["fechaturnovisitaduria"]).ToString();
                itemformatos.Status = (row["status"]).ToString();
                itemformatos.otro = (row["abogadot"]).ToString();
                #region FechaRecep
                if ((row["fechaturnovisitaduriaelectronico"]).ToString() != "")
                {
                    itemformatos.FechaRecep = (row["fechaturnovisitaduriaelectronico"]).ToString();
                }
                else
                {
                    itemformatos.FechaRecep = "<div class=\"badge status-badge\" style=\"background-color:#c06500;color:white;\">Sin Fecha de Recepción</div >";
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

                //CONCLUIDO
                query = "exec RegistrarConcluidos " + 143;
                itemformatos.Concluido = conexionsql.ObtenerReader(query);
                //FIN CONCLUIDO
                if (itemformatos.FechaCalific.Contains("Sin"))
                {
                    DateTime fechaUno = Convert.ToDateTime(itemformatos.FechaTurno);
                    DateTime fechaDos = DateTime.Now;
                    TimeSpan difFechas = fechaDos - fechaUno;
                    int diasTrans = difFechas.Days;
                    //SEMAFORO 1
                    query = "exec semaforo " + diasTrans + "," + 3 + "," + 15 + "," + 1;
                    itemformatos.semaforo1 = conexionsql.ObtenerReader(query);
                    //FIN SEMAFORO 1
                }
                else
                {
                    itemformatos.semaforo1 = "<div class=\"badge status-badge badge-success\">Calificado</div>";
                }
                if (itemformatos.FechaTunAbo.Contains("Sin"))
                {
                    DateTime fechaUno = Convert.ToDateTime(itemformatos.FechaTurno);
                    DateTime fechaDos = DateTime.Now;
                    TimeSpan difFechas = fechaDos - fechaUno;
                    int diasTrans = difFechas.Days;
                    //SEMAFORO 2
                    query = "exec semaforo " + diasTrans + "," + 3 + "," + 9 + "," + 2;
                    itemformatos.semaforo2 = conexionsql.ObtenerReader(query);
                    //FIN SEMAFORO 2
                }
                else
                {
                    itemformatos.semaforo2 = "<div class=\"badge status-badge badge-success\">Con Actuaciones</div>";
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
                //itemformatos.IdUnionFormatosQueja = Convert.ToInt32(row["ID_UNION_FORMATOS_QUEJA"]);
                itemformatos.s1 = row["nombre"].ToString();
                itemformatos.s2 = row["ID_USUARIO"].ToString();
                listformatos1.Add(itemformatos);
            }
            return Json(new { data = listformatos, data1 = listformatos1 });
        }
        // Fin Buscador Formatos

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
        public ActionResult GuardarDataComplPeticionario(IFormCollection form)
        {
            string numFrm = form["numFrm"].ToString();
            string idcomplementopet = form["idcomplementopet" + numFrm].ToString();
            string idreg_recepcion = form["idpeticionarioi" + numFrm].ToString();
            string id_queja = form["idquejagenerado"].ToString();

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

            // Se obtiene el id del peticionario registrado en la entrada a travez de la CURP o Nombre o id_reg_recepcion(este se cancelo pero funciona)
            if (idreg_recepcion != "")
            {
                queryPeticionario = "EXEC Sp_GetPeticionarioxid " + "'" + idreg_recepcion + "'";
            }
            else if (curp != "" && curp != "No proporcionado")
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
            // Si el peticionario ya esta registrado se actualizan sus datos en caso de que hayan cambiado
            if (peticionariolist.Count > 0)
            {
                idPetit = Convert.ToInt32(peticionariolist[0].IdRegistro);

                // Se actualiza datos del peticionario que ingreso en la entrada si es necesario
                String queryPet = "exec Sp_Update_Peticionario " + idPetit + ",'" + nombre + "','" + apellidop + "','" + apellidom + "', '" + curp + "' ";
                conexionsql.InsertUpdateDelete(queryPet);
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

            }

            // Se valida si quiere editar el complemento actual de peticionario o si es uno nuevo
            if (idcomplementopet == "")
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
                    "'" + otroGenero + "'";

                }
                // Si el id de queja ya existe entonces se registra en el campo ID_EXPEDIENTE de la tabla complemento_peticionario
                else
                {
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
                   "'" + id_queja + "'";
                }

            }
            // Si el complemento peticionario ya existe entonces se actualiza
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

            return Json(new { idcomplemento = conexionsql.InsertUpdateDeleteRegresaid(query), idpeticionario = idPetit, idqueja = 1, tipousuario = tipouser, nombrepet = nombre + ' ' + apellidop + ' ' + apellidom });

        }
        public async Task<ActionResult> GetDataPeticionario(IFormCollection form)
        {

            string curp = form["curp"].ToString();
            string idcomp = form["idcomp"].ToString();
            string nombre = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["nombre"].ToString().ToLower()));
            string apellidop = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidop"].ToString().ToLower()));
            string apellidom = (CultureInfo.InvariantCulture.TextInfo.ToTitleCase(form["apellidom"].ToString().ToLower()));

            String query = "";
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();


            if (idcomp != "")
            {
                query = "exec Sp_GetDataPeticionarioxIdComp " + "'" + idcomp + "'";

            }
            else if (curp != "" && curp != "No proporcionado")
            {
                query = "exec Sp_GetDataPeticionario " + "'" + curp.ToUpper() + "'";
            }
            else
            {
                query = "exec Sp_GetDataPeticionarioXNombre " + "'" + nombre + "'," + "'" + apellidop + "'," + "'" + apellidom + "'";
            }

            var data = GetDatosGeneral(query);

            lPeticionario = ObtenerlistPeticionario(data);

            return Json(new { data = lPeticionario });

        }

        public List<PdfDatosPeticionario> ObtenerlistPeticionario(DataTable data)
        {
            List<PdfDatosPeticionario> lPeticionario = new List<PdfDatosPeticionario>();
            foreach (DataRow row in data.Rows)
            {
                PdfDatosPeticionario peticionario = new PdfDatosPeticionario();


                peticionario.FkRegRecepcion = Convert.ToInt32(row["ID_REGISTRO"]);
                peticionario.Nombre = (row["NOMBRE"]).ToString();
                peticionario.ApellidoPat = (row["APELLIDO_PAT"]).ToString();
                peticionario.ApellidoMat = (row["APELLIDO_MAT"]).ToString();
                peticionario.DocIdentificatorio = (row["DOC_IDENTIFICATORIO"]).ToString();

                if (!(row["ID_COMPLEMENTO_PETICIONARIO"] is DBNull))
                {
                    peticionario.IdComplementoPeticionario = Convert.ToInt32(row["ID_COMPLEMENTO_PETICIONARIO"]);
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
                }

                lPeticionario.Add(peticionario);

            }


            return lPeticionario;

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
        public ActionResult ActaPDF(int idactac)
        {
            TempData["idactact"] = idactac;
            return RedirectToAction("Acta_Circunstanciada");
        }

        public ViewAsPdf Acta_Circunstanciada()
        {

            int? idacta = (int?)TempData["idactact"];

            string query = "exec Sp_Regresa_Acta_Circunstanciada " + idacta;
            string mensaje = "";
            actaC = conexionsql.regresaActaCircunstanciada(1, query, ref mensaje);
            string mensajet = "ok";
            //return new ViewAsPdf("VerPDF", escrito) 
            return new ViewAsPdf("ActaPDF", actaC)
            {
                PageSize = Rotativa.AspNetCore.Options.Size.Letter,
                PageMargins = { Left = 20, Right = 20 },
                //CustomSwitches= "  --page-offset 0 --footer-center [page] --footer-font-size 8"

                //CustomSwitches= "--header-html https://www.cdhpuebla.org.mx/images/COVID19.png"
                //PageMargins = new Rotativa.AspNetCore.Options.Margins(2, 3, 2, 3)
                //NOTA: Cambiar rutas de encabezado y pie de página ya que las rutras son de localhost
                CustomSwitches = " --page-offset 0 --header-html https://localhost:7126/Encabezado/Index --header-spacing 30 --margin-bottom 4cm --footer-spacing 7 --footer-html https://localhost:7126/PieDePagina/Index --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial "

                // CustomSwitches = "  --page-offset 0 --footer-spacing 10 --margin-bottom 5cm --footer-right Página-[page]/[toPage]  --footer-font-size 8 --footer-font-name Arial --footer-html https://localhost:7126/PieDePagina/Index --margin-top 5cm --header-html https://localhost:7126/Encabezado/Index"

            };
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
        public ActionResult DeleteComPeticionario(IFormCollection form)
        {
            string idcomplemento = form["id_complemento"].ToString();
            string quey_insertqueja = "EXEC Sp_DeleteComPeticionario '" + idcomplemento + "'";
            int idqueja = conexionsql.InsertUpdateDeleteRegresaid(quey_insertqueja);
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
        // Fin Eliminar Peticionario

        // Eliminar Peticionario 
        public ActionResult DeleteExpediente(IFormCollection form)
        {
            string idexpediente = form["id_expediente"].ToString();
            string motivo = form["motivo"].ToString();
            string quey_delexp = "EXEC Sp_DeleteExpediente '" + idexpediente + "','" + motivo + "'";
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
        // Eliminar Actac 
        public ActionResult DeleteActac(IFormCollection form)
        {
            string idactac = form["id_actac"].ToString();

            string quey_delexp = "EXEC Sp_DeleteActac '" + idactac + "'";
            int idactamod = conexionsql.InsertUpdateDeleteRegresaid(quey_delexp);
            bool statusresp = false;

            if (idactamod > 0)
            {
                statusresp = true;
            }
            else
            {
                statusresp = false;
            }

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
        public ActionResult DeleteEscrito(IFormCollection form)
        {
            string idexpediente = form["id_escrito"].ToString();
            string idqueja_get = form["id_queja"].ToString();

            string quey_delexp = "EXEC Sp_DeleteEscrito '" + idexpediente + "', '" + idqueja_get + "'";
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
            int idqueja = 0;
            int idenlacequeja = 0;
            bool statusresp = false;

            string quey_insertqueja = "EXEC Sp_GeneraIdQueja " + id_via_interposicion;

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
        //Llenar selects para crear formulario
        public class SelectGenerico
        {
            public int idSelectGenerico { get; set; }
            public string Descripcion { get; set; }
            public bool seleccionable { get; set; }
            public string ruta { get; set; }
            public SelectGenerico() { }
            public SelectGenerico(int i1, string s1, bool i2, string s2)
            {
                this.idSelectGenerico = i1;
                this.Descripcion = s1;
                this.seleccionable = i2;
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
                escritoitem.cvemun = int.Parse((row["CVEMUN"]).ToString());
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
            List<string> Arreglo_autoridades = new List<string>(); ;

            query = "exec Sp_Regresa_Acta_Circunstanciada_Edicion " + idActaC;
            string mensaje = "ok";
            // escrito = conexionsql.regresaEscritoInicial(1, query, ref mensaje);
            mensaje = "ok";


            var data = GetDatosGeneral(query);
            ActacModificado Acacircunstanciada = new ActacModificado();
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


                int Id = int.Parse((row["id"]).ToString());
                string lugar = (row["lugar"]).ToString();
                int Diafecha = int.Parse((row["diaFecha"]).ToString());
                string mes = (row["mes"]).ToString();
                string año = (row["anio"]).ToString();
                string abogado = (row["abogado"]).ToString();
                string cargo = (row["cargo"]).ToString();
                string siglas = (row["SIGLAS"]).ToString();
                TimeOnly horaInicio = new TimeOnly(int.Parse(hora_completa1[0]), int.Parse(hora_completa1[1]));
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
                TimeOnly horaHechos = new TimeOnly(int.Parse(horaHechosC1[0]), int.Parse(horaHechosC1[1]));
                string fechaHechos = (row["horaHechos"]).ToString();
                string ubiHechos = (row["ubiHechos"]).ToString();
                string hechos = (row["hechos"]).ToString();
                TimeOnly horaTermino = new TimeOnly(int.Parse(horaTerminoc1[0]), int.Parse(horaTerminoc1[1]));
                string identificacionPet = (row["identificacionPet"]).ToString();
                string OrigenPetExt = (row["OrigenPetExt"]).ToString();
                string OrigenPetExtComp = (row["OrigenPetExtComp"]).ToString();
                string SABE_LEER = (row["SABE_pet"]).ToString();
                string ESTADO = (row["ESTADO_pet"]).ToString();
                string escolaridad = (row["escolaridad"]).ToString();
                int compet = int.Parse((row["ID_COMPLEMENTO_PETICIONARIO"]).ToString());
                int idpet = int.Parse((row["ID_REGISTRO"]).ToString());
                DateTime fechaActual = DateTime.Now;

                Acacircunstanciada =
               new ActacModificado(Id, lugar, Diafecha, mes, año, abogado, cargo, siglas, horaInicio, ubicacion, peticionario, consentimiento, OrigenPetExt, edadPeticionario, SABE_LEER, escolaridad, callePeticionario, Num_exterior_Peticionario, Codigo_postalPeticionario, COLONIA_Peticionario,
               MUNICIPIO_Peticionario, ESTADO, Ocupacion_peticionario, TELEFONO_Peticionario, email_peticionario, identificacionPet, fechaHechos, horaHechos, ubiHechos, hechos, horaTermino, OrigenPetExt, OrigenPetExtComp, idpet, compet, fechaActual);
                lEscritoI.Add(Acacircunstanciada);
                Arreglo_autoridades.Add((row["AUTORIDAD"]).ToString());
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
    }
}
