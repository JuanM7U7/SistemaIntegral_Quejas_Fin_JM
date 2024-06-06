using NuGet.ContentModel;
using System;
using System.Collections.Generic;

namespace SistemaIntegralQuejas.Models;

public partial class ActacModificado
{
    public int Id { get; set; }
    public string Lugar { get; set; }
    public int DiaFecha { get; set; }
    public string Mes { get; set; }
    public string Anio { get; set; }
    public string NomAbogado { get; set; }
    public string PuestoAbogado { get; set; }
    public string AreaAbogado { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public string Ubicacion { get; set; }
    public string NombrePet { get; set; }
    public string Consentimiento { get; set; }
    public string OrigenPet { get; set; }
    public int EdadPet { get; set; }

    //CAMPOS AGREGADOS
    public string SabePet { get; set; }
    public string EscolaridadPet { get; set; }
    //----------------------------------------
    public string CallePet { get; set; }
    public string NumextPet { get; set; }
    public string CpPet { get; set; }
    public string ColoniaPet { get; set; }
    public string MunicipioPet { get; set; }
    //CAMPO AGREGADO---------------------------
    public string EstadoPet { get; set; }
    //-----------------------------------------
    public string OcupacionPet { get; set; }
    public string TelPet { get; set; }
    public string CorreoPet { get; set; }
    public string IdentificacionPet { get; set; }
    public string FechaHechos { get; set; }
    public TimeOnly HoraHechos { get; set; }
    public string UbiHechos { get; set; }
    public string Hechos { get; set; }
    public TimeOnly HoraTermino { get; set; }
    public string OrigenPeticionarioExterno { get; set; }
    public string ComplementoOrigenPeticionarioExterno { get; set; }
    public int? ComplementoPeticionario { get; set; }
    public int? idPet { get; set; }
    public DateTime? fechaActual { get; set; }

    public ActacModificado() { }
    public ActacModificado(
       int id, string lugar, int diaFecha, string mes, string anio, string nomAbogado, string puestoAbogado, string areaAbogado, TimeOnly horaInicio,
        string ubicacion, string nombrePet, string consentimiento, string origenPet, int edadPet, string sabePet, string escolaridadPet, string callePet, string numextPet, string cpPet,
        string coloniaPet, string municipioPet, string estadoPet, string ocupacionPet, string telPet, string correoPet, string identificacionPet, string fechaHechos,
        TimeOnly horaHechos, string ubiHechos, string hechos, TimeOnly horaTermino, string OPE, string COPE, int idp, int compet, DateTime? fechaActual)

    {
        Id = id;
        Lugar = lugar;
        DiaFecha = diaFecha;
        Mes = mes;
        Anio = anio;
        NomAbogado = nomAbogado;
        PuestoAbogado = puestoAbogado;
        AreaAbogado = areaAbogado;
        HoraInicio = horaInicio;
        Ubicacion = ubicacion;
        NombrePet = nombrePet;
        Consentimiento = consentimiento;
        OrigenPet = origenPet;
        EdadPet = edadPet;
        SabePet = sabePet;
        EscolaridadPet = escolaridadPet;
        CallePet = callePet;
        NumextPet = numextPet;
        CpPet = cpPet;
        ColoniaPet = coloniaPet;
        MunicipioPet = municipioPet;
        EstadoPet = estadoPet;
        OcupacionPet = ocupacionPet;
        TelPet = telPet;
        CorreoPet = correoPet;
        IdentificacionPet = identificacionPet;
        FechaHechos = fechaHechos;
        HoraHechos = horaHechos;
        UbiHechos = ubiHechos;
        Hechos = hechos;
        HoraTermino = horaTermino;
        OrigenPeticionarioExterno = OPE;
        ComplementoOrigenPeticionarioExterno = COPE;
        idPet = idp;
        ComplementoPeticionario = compet;
        this.fechaActual = fechaActual;
    }
}
