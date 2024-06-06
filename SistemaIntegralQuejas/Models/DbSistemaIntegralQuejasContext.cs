using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SistemaIntegralQuejas.Models;

public partial class DbSistemaIntegralQuejasContext : DbContext
{
    public DbSistemaIntegralQuejasContext()
    {
    }

    public DbSistemaIntegralQuejasContext(DbContextOptions<DbSistemaIntegralQuejasContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Actac> Actacs { get; set; }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Autoridad> Autoridads { get; set; }

    public virtual DbSet<CatAsuntovisitum> CatAsuntovisita { get; set; }

    public virtual DbSet<CatCargoab> CatCargoabs { get; set; }

    public virtual DbSet<CatEstado> CatEstados { get; set; }

    public virtual DbSet<CatEstadoturno> CatEstadoturnos { get; set; }

    public virtual DbSet<CatIdentificacion> CatIdentificacions { get; set; }

    public virtual DbSet<CatInterpo> CatInterpos { get; set; }

    public virtual DbSet<CatMunicipio> CatMunicipios { get; set; }

    public virtual DbSet<CatNivRiesgo> CatNivRiesgos { get; set; }

    public virtual DbSet<CatPaise> CatPaises { get; set; }

    public virtual DbSet<CatPrograma> CatProgramas { get; set; }

    public virtual DbSet<CatSede> CatSedes { get; set; }

    public virtual DbSet<CatTema> CatTemas { get; set; }

    public virtual DbSet<CatTipoqueja> CatTipoquejas { get; set; }

    public virtual DbSet<CatVisitaduria> CatVisitadurias { get; set; }

    public virtual DbSet<ComplementoPeticionario> ComplementoPeticionarios { get; set; }

    public virtual DbSet<Discapacidad> Discapacidads { get; set; }

    public virtual DbSet<EnlaceArchivoadjuntoEscritoi> EnlaceArchivoadjuntoEscritois { get; set; }

    public virtual DbSet<EnlaceEscritoAutoridad> EnlaceEscritoAutoridads { get; set; }

    public virtual DbSet<EnlaceFormatQueja> EnlaceFormatQuejas { get; set; }

    public virtual DbSet<EnlacePersonaEscrito> EnlacePersonaEscritos { get; set; }

    public virtual DbSet<Escolaridad> Escolaridads { get; set; }

    public virtual DbSet<Escrito> Escritos { get; set; }

    public virtual DbSet<EscritoOk> EscritoOks { get; set; }

    public virtual DbSet<EstadoConyugal> EstadoConyugals { get; set; }

    public virtual DbSet<Expediente> Expedientes { get; set; }

    public virtual DbSet<ExpedienteTurno> ExpedienteTurnos { get; set; }

    public virtual DbSet<GrupoEscolaridad> GrupoEscolaridads { get; set; }

    public virtual DbSet<GrupoSocial> GrupoSocials { get; set; }

    public virtual DbSet<HijosVivo> HijosVivos { get; set; }

    public virtual DbSet<HubConnection> HubConnections { get; set; }

    public virtual DbSet<LugarHecho> LugarHechos { get; set; }

    public virtual DbSet<Memorandum> Memoranda { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Mese> Meses { get; set; }

    public virtual DbSet<ModalidadViolencium> ModalidadViolencia { get; set; }

    public virtual DbSet<Moduloatenciondqot> Moduloatenciondqots { get; set; }

    public virtual DbSet<Municipio> Municipios { get; set; }

    public virtual DbSet<Notificacione> Notificaciones { get; set; }

    public virtual DbSet<Ocupacion> Ocupacions { get; set; }

    public virtual DbSet<RecepcionIdentificacion> RecepcionIdentificacions { get; set; }

    public virtual DbSet<RegRecepcion> RegRecepcions { get; set; }

    public virtual DbSet<RegistroAsistencium> RegistroAsistencia { get; set; }

    public virtual DbSet<RelacionAgresor> RelacionAgresors { get; set; }

    public virtual DbSet<Sexo> Sexos { get; set; }

    public virtual DbSet<StatusExpediente> StatusExpedientes { get; set; }

    public virtual DbSet<Submenu> Submenus { get; set; }

    public virtual DbSet<TipoViolencium> TipoViolencia { get; set; }

    public virtual DbSet<Turno> Turnos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Actac>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ACTAC__3213E83F22763FCC");

            entity.ToTable("ACTAC");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Anio).HasColumnName("anio");
            entity.Property(e => e.Consentimiento).HasColumnName("consentimiento");
            entity.Property(e => e.DiaFecha).HasColumnName("diaFecha");
            entity.Property(e => e.FkStatus)
                .HasDefaultValueSql("((4))")
                .HasColumnName("FK_STATUS");
            entity.Property(e => e.Hechos)
                .HasColumnType("text")
                .HasColumnName("hechos");
            entity.Property(e => e.HoraHechos)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("horaHechos");
            entity.Property(e => e.HoraInicio)
                .HasColumnType("datetime")
                .HasColumnName("horaInicio");
            entity.Property(e => e.HoraTermino)
                .HasColumnType("datetime")
                .HasColumnName("horaTermino");
            entity.Property(e => e.IdAbogado).HasColumnName("idAbogado");
            entity.Property(e => e.IdEscrito).HasColumnName("idEscrito");
            entity.Property(e => e.IdPet).HasColumnName("idPet");
            entity.Property(e => e.IdentificacionPet).HasColumnName("identificacionPet");
            entity.Property(e => e.Lugar).HasColumnName("lugar");
            entity.Property(e => e.Mes).HasColumnName("mes");
            entity.Property(e => e.OrigenPet)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("origenPet");
            entity.Property(e => e.OrigenPetExtComp)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.UbiHechos)
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ubiHechos");
            entity.Property(e => e.Ubicacion)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ubicacion");

            entity.HasOne(d => d.IdAbogadoNavigation).WithMany(p => p.Actacs)
                .HasForeignKey(d => d.IdAbogado)
                .HasConstraintName("FK__ACTAC__idAbogado__0EC8BBDB");

            entity.HasOne(d => d.IdEscritoNavigation).WithMany(p => p.Actacs)
                .HasForeignKey(d => d.IdEscrito)
                .HasConstraintName("FK__ACTAC__idEscrito__10B1044D");

            entity.HasOne(d => d.IdPetNavigation).WithMany(p => p.Actacs)
                .HasForeignKey(d => d.IdPet)
                .HasConstraintName("FK__ACTAC__idPet__11A52886");

            entity.HasOne(d => d.IdentificacionPetNavigation).WithMany(p => p.Actacs)
                .HasForeignKey(d => d.IdentificacionPet)
                .HasConstraintName("FK__ACTAC__identific__0FBCE014");

            entity.HasOne(d => d.LugarNavigation).WithMany(p => p.Actacs)
                .HasForeignKey(d => d.Lugar)
                .HasConstraintName("FK__ACTAC__lugar__12994CBF");
        });

        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.IdArea);

            entity.ToTable("AREA");

            entity.Property(e => e.IdArea)
                .ValueGeneratedNever()
                .HasColumnName("ID_AREA");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
            entity.Property(e => e.Siglas)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("SIGLAS");
        });

        modelBuilder.Entity<Autoridad>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("AUTORIDAD");

            entity.Property(e => e.Ambito)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("AMBITO");
            entity.Property(e => e.Autoridad1)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("AUTORIDAD");
            entity.Property(e => e.Consecutivo)
                .ValueGeneratedOnAdd()
                .HasColumnName("CONSECUTIVO");
            entity.Property(e => e.Cveautoridad)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CVEAUTORIDAD");
        });

        modelBuilder.Entity<CatAsuntovisitum>(entity =>
        {
            entity.HasKey(e => e.IdAsunto).HasName("PK_CAT_ASUNTO");

            entity.ToTable("CAT_ASUNTOVISITA");

            entity.Property(e => e.IdAsunto)
                .ValueGeneratedNever()
                .HasColumnName("ID_ASUNTO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleeccionable).HasColumnName("SELEECCIONABLE");
        });

        modelBuilder.Entity<CatCargoab>(entity =>
        {
            entity.HasKey(e => e.IdCargo).HasName("PK__CAT_CARG__6F4DBE2BEFE11AC4");

            entity.ToTable("CAT_CARGOAB");

            entity.Property(e => e.IdCargo)
                .ValueGeneratedNever()
                .HasColumnName("ID_CARGO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatEstado>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("CAT_ESTADOS");

            entity.Property(e => e.CveEstado)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CVE_ESTADO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.IdEstado).HasColumnName("ID_ESTADO");
            entity.Property(e => e.Seleccionable)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatEstadoturno>(entity =>
        {
            entity.HasKey(e => e.IdEstado);

            entity.ToTable("CAT_ESTADOTURNO");

            entity.Property(e => e.IdEstado)
                .ValueGeneratedNever()
                .HasColumnName("ID_ESTADO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
        });

        modelBuilder.Entity<CatIdentificacion>(entity =>
        {
            entity.HasKey(e => e.IdIdentificacion);

            entity.ToTable("CAT_IDENTIFICACION");

            entity.Property(e => e.IdIdentificacion)
                .ValueGeneratedNever()
                .HasColumnName("ID_IDENTIFICACION");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleeccionable).HasColumnName("SELEECCIONABLE");
        });

        modelBuilder.Entity<CatInterpo>(entity =>
        {
            entity.HasKey(e => e.IdViainterpo);

            entity.ToTable("CAT_INTERPOS");

            entity.Property(e => e.IdViainterpo)
                .ValueGeneratedNever()
                .HasColumnName("ID_VIAINTERPO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatMunicipio>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("CAT_MUNICIPIOS");

            entity.Property(e => e.Consecutivo).HasColumnName("CONSECUTIVO");
            entity.Property(e => e.Cveestado)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CVEESTADO");
            entity.Property(e => e.Cvemun)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CVEMUN");
            entity.Property(e => e.Municipio)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("MUNICIPIO");
        });

        modelBuilder.Entity<CatNivRiesgo>(entity =>
        {
            entity.HasKey(e => e.IdNivRiesgo);

            entity.ToTable("CAT_NIV_RIESGO");

            entity.Property(e => e.IdNivRiesgo)
                .ValueGeneratedNever()
                .HasColumnName("ID_NIV_RIESGO");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatPaise>(entity =>
        {
            entity.HasKey(e => e.PkPaises).HasName("PK__CAT_PAIS__18033503953C9BBB");

            entity.ToTable("CAT_PAISES");

            entity.Property(e => e.PkPaises).HasColumnName("PK_PAISES");
            entity.Property(e => e.NombrePais)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_PAIS");
            entity.Property(e => e.Siglas)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("SIGLAS");
        });

        modelBuilder.Entity<CatPrograma>(entity =>
        {
            entity.HasKey(e => e.IdPrograma);

            entity.ToTable("CAT_PROGRAMA");

            entity.Property(e => e.IdPrograma)
                .ValueGeneratedNever()
                .HasColumnName("ID_PROGRAMA");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatSede>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("CAT_SEDES");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.IdSede)
                .ValueGeneratedOnAdd()
                .HasColumnName("id_sede");
            entity.Property(e => e.Status).HasColumnName("status");
        });

        modelBuilder.Entity<CatTema>(entity =>
        {
            entity.HasKey(e => e.IdTema);

            entity.ToTable("CAT_TEMA");

            entity.Property(e => e.IdTema)
                .ValueGeneratedNever()
                .HasColumnName("ID_TEMA");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatTipoqueja>(entity =>
        {
            entity.HasKey(e => e.IdTipoqueja);

            entity.ToTable("CAT_TIPOQUEJA");

            entity.Property(e => e.IdTipoqueja)
                .ValueGeneratedNever()
                .HasColumnName("ID_TIPOQUEJA");
            entity.Property(e => e.Descripción)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCIÓN");
            entity.Property(e => e.Seleccionable).HasColumnName("SELECCIONABLE");
        });

        modelBuilder.Entity<CatVisitaduria>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("CAT_VISITADURIAS");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Estatus).HasColumnName("estatus");
            entity.Property(e => e.FkIdTitular).HasColumnName("fk_idTitular");
            entity.Property(e => e.IdVisitaduria).HasColumnName("id_visitaduria");
        });

        modelBuilder.Entity<ComplementoPeticionario>(entity =>
        {
            entity.HasKey(e => e.IdComplementoPeticionario).HasName("PK__PETICION__B73692D6F95EEE06");

            entity.ToTable("COMPLEMENTO_PETICIONARIO");

            entity.Property(e => e.IdComplementoPeticionario).HasColumnName("ID_COMPLEMENTO_PETICIONARIO");
            entity.Property(e => e.Calle)
                .HasMaxLength(70)
                .IsUnicode(false)
                .HasColumnName("CALLE");
            entity.Property(e => e.CanalizacionVm)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("CANALIZACION_VM");
            entity.Property(e => e.Ciudad)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CIUDAD");
            entity.Property(e => e.CodigoPostal)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("CODIGO_POSTAL");
            entity.Property(e => e.Colonia)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("COLONIA");
            entity.Property(e => e.DestinoMigrante)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("DESTINO_MIGRANTE");
            entity.Property(e => e.Edad)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("EDAD");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.EmbarazadaVm)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("EMBARAZADA_VM");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("ESTADO");
            entity.Property(e => e.FechaNacimiento)
                .HasColumnType("date")
                .HasColumnName("FECHA_NACIMIENTO");
            entity.Property(e => e.FkDiscapacidad).HasColumnName("FK_DISCAPACIDAD");
            entity.Property(e => e.FkEscolaridad).HasColumnName("FK_ESCOLARIDAD");
            entity.Property(e => e.FkEstadoConyugal).HasColumnName("FK_ESTADO_CONYUGAL");
            entity.Property(e => e.FkGrupoSocial).HasColumnName("FK_GRUPO_SOCIAL");
            entity.Property(e => e.FkHijosVivos).HasColumnName("FK_HIJOS_VIVOS");
            entity.Property(e => e.FkModalidadViolencia).HasColumnName("FK_MODALIDAD_VIOLENCIA");
            entity.Property(e => e.FkOcupacion).HasColumnName("FK_OCUPACION");
            entity.Property(e => e.FkRegRecepcion).HasColumnName("FK_REG_RECEPCION");
            entity.Property(e => e.FkRelacionAgresor).HasColumnName("FK_RELACION_AGRESOR");
            entity.Property(e => e.FkSexo).HasColumnName("FK_SEXO");
            entity.Property(e => e.FkTipoViolencia).HasColumnName("FK_TIPO_VIOLENCIA");
            entity.Property(e => e.Genero)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("GENERO");
            entity.Property(e => e.HablaLenguai)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("HABLA_LENGUAI");
            entity.Property(e => e.IdExpediente).HasColumnName("ID_EXPEDIENTE");
            entity.Property(e => e.IdUltimoUserMod).HasColumnName("ID_ULTIMO_USER_MOD");
            entity.Property(e => e.IngresosMensuales)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("INGRESOS_MENSUALES");
            entity.Property(e => e.LenguaIndigena)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("LENGUA_INDIGENA");
            entity.Property(e => e.Municipio)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("MUNICIPIO");
            entity.Property(e => e.Nacionalidad)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NACIONALIDAD");
            entity.Property(e => e.NumExterior)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("NUM_EXTERIOR");
            entity.Property(e => e.NumInterior)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("NUM_INTERIOR");
            entity.Property(e => e.OrigenMigrante)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("ORIGEN_MIGRANTE");
            entity.Property(e => e.OtraOcupacion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("OTRA_OCUPACION");
            entity.Property(e => e.OtroGenero)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("OTRO_GENERO");
            entity.Property(e => e.OtroGsocial)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("OTRO_GSOCIAL");
            entity.Property(e => e.PrimeravmexMigrante)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("PRIMERAVMEX_MIGRANTE");
            entity.Property(e => e.SabeLeer)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("SABE_LEER");
            entity.Property(e => e.Status).HasColumnName("STATUS");
            entity.Property(e => e.StatusComplementoPeticionario).HasColumnName("STATUS_COMPLEMENTO_PETICIONARIO");
            entity.Property(e => e.Telefono)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("TELEFONO");
            entity.Property(e => e.TipoUsuario)
                .HasMaxLength(70)
                .IsUnicode(false)
                .HasColumnName("TIPO_USUARIO");
            entity.Property(e => e.ViolenciaVm).HasColumnName("VIOLENCIA_VM");

            entity.HasOne(d => d.FkDiscapacidadNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkDiscapacidad)
                .HasConstraintName("fk_Peticionario_Discapacidad");

            entity.HasOne(d => d.FkEscolaridadNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkEscolaridad)
                .HasConstraintName("fk_Peticionario_Escolaridad");

            entity.HasOne(d => d.FkEstadoConyugalNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkEstadoConyugal)
                .HasConstraintName("fk_Peticionario_EstadoConyugal");

            entity.HasOne(d => d.FkGrupoSocialNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkGrupoSocial)
                .HasConstraintName("fk_Peticionario_GrupoSocial");

            entity.HasOne(d => d.FkHijosVivosNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkHijosVivos)
                .HasConstraintName("fk_Peticionario_HijosVivos");

            entity.HasOne(d => d.FkModalidadViolenciaNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkModalidadViolencia)
                .HasConstraintName("fk_Peticionario_ModalidadViolencia");

            entity.HasOne(d => d.FkOcupacionNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkOcupacion)
                .HasConstraintName("fk_Peticionario_Ocupacion");

            entity.HasOne(d => d.FkRegRecepcionNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkRegRecepcion)
                .HasConstraintName("fk_Peticionario_Regrecepcion");

            entity.HasOne(d => d.FkRelacionAgresorNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkRelacionAgresor)
                .HasConstraintName("fk_Peticionario_RelacionAgresor");

            entity.HasOne(d => d.FkSexoNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkSexo)
                .HasConstraintName("fk_Peticionario_Sexo");

            entity.HasOne(d => d.FkTipoViolenciaNavigation).WithMany(p => p.ComplementoPeticionarios)
                .HasForeignKey(d => d.FkTipoViolencia)
                .HasConstraintName("fk_Peticionario_TipoViolencia");
        });

        modelBuilder.Entity<Discapacidad>(entity =>
        {
            entity.HasKey(e => e.IdDiscapacidad).HasName("PK__SEXO__F5FF4DDC19F29753");

            entity.ToTable("DISCAPACIDAD");

            entity.Property(e => e.IdDiscapacidad).HasColumnName("ID_DISCAPACIDAD");
            entity.Property(e => e.NombreDiscapacidad)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_DISCAPACIDAD");
        });

        modelBuilder.Entity<EnlaceArchivoadjuntoEscritoi>(entity =>
        {
            entity.HasKey(e => e.PkEnlaceAdjescritoi).HasName("PK__ENLACE_A__C9DE4A50E55F72E2");

            entity.ToTable("ENLACE_ARCHIVOADJUNTO_ESCRITOI");

            entity.Property(e => e.PkEnlaceAdjescritoi).HasColumnName("PK_ENLACE_ADJESCRITOI");
            entity.Property(e => e.FkStatus).HasColumnName("FK_STATUS");
            entity.Property(e => e.IdEscritoinicial).HasColumnName("ID_ESCRITOINICIAL");
            entity.Property(e => e.RutaArchivo)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("RUTA_ARCHIVO");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TYPE");
        });

        modelBuilder.Entity<EnlaceEscritoAutoridad>(entity =>
        {
            entity.HasKey(e => e.IdUnionAutEscrito).HasName("PK__ENLACE_E__4196A7D427B11A02");

            entity.ToTable("ENLACE_ESCRITO_AUTORIDAD");

            entity.Property(e => e.IdUnionAutEscrito).HasColumnName("ID_UNION_AUT_ESCRITO");
            entity.Property(e => e.CargoPersona)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("CARGO_PERSONA");
            entity.Property(e => e.FkStatus).HasColumnName("Fk_Status");
            entity.Property(e => e.IdAutoridad).HasColumnName("ID_AUTORIDAD");
            entity.Property(e => e.IdEscrito).HasColumnName("ID_ESCRITO");
            entity.Property(e => e.IdQueja).HasColumnName("Id_queja");
            entity.Property(e => e.NombrePersona)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_PERSONA");
        });

        modelBuilder.Entity<EnlaceFormatQueja>(entity =>
        {
            entity.HasKey(e => e.IdUnionFormatosQueja).HasName("PK__ENLACE_F__51DA2FFFECC71EE7");

            entity.ToTable("ENLACE_FORMAT_QUEJA");

            entity.Property(e => e.IdUnionFormatosQueja).HasColumnName("ID_UNION_FORMATOS_QUEJA");
            entity.Property(e => e.FkActac).HasColumnName("FK_ACTAC");
            entity.Property(e => e.FkComplementoPeticionario).HasColumnName("FK_COMPLEMENTO_PETICIONARIO");
            entity.Property(e => e.FkEscritoOk).HasColumnName("FK_ESCRITO_OK");
            entity.Property(e => e.FkExpediente).HasColumnName("FK_EXPEDIENTE");
            entity.Property(e => e.FkPeticionario).HasColumnName("FK_PETICIONARIO");

            entity.HasOne(d => d.FkActacNavigation).WithMany(p => p.EnlaceFormatQuejas)
                .HasForeignKey(d => d.FkActac)
                .HasConstraintName("FK__ENLACE_FO__FK_AC__3E90D649");

            entity.HasOne(d => d.FkComplementoPeticionarioNavigation).WithMany(p => p.EnlaceFormatQuejas)
                .HasForeignKey(d => d.FkComplementoPeticionario)
                .HasConstraintName("FK__ENLACE_FO__FK_CO__3CA88DD7");

            entity.HasOne(d => d.FkEscritoOkNavigation).WithMany(p => p.EnlaceFormatQuejas)
                .HasForeignKey(d => d.FkEscritoOk)
                .HasConstraintName("FK__ENLACE_FO__FK_ES__3D9CB210");

            entity.HasOne(d => d.FkExpedienteNavigation).WithMany(p => p.EnlaceFormatQuejas)
                .HasForeignKey(d => d.FkExpediente)
                .HasConstraintName("FK__ENLACE_FO__FK_EX__3BB4699E");

            entity.HasOne(d => d.FkPeticionarioNavigation).WithMany(p => p.EnlaceFormatQuejas)
                .HasForeignKey(d => d.FkPeticionario)
                .HasConstraintName("FK__ENLACE_FO__FK_PE__3F84FA82");
        });

        modelBuilder.Entity<EnlacePersonaEscrito>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ENLACE_PERSONA_ESCRITO");

            entity.Property(e => e.Cargo)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("CARGO");
            entity.Property(e => e.IdEnlacePersonaEscrito)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID_ENLACE_PERSONA_ESCRITO");
            entity.Property(e => e.IdEscrito).HasColumnName("ID_ESCRITO");
            entity.Property(e => e.NombrePersona)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_PERSONA");
        });

        modelBuilder.Entity<Escolaridad>(entity =>
        {
            entity.HasKey(e => e.IdEscolaridad).HasName("PK__ESCOLARI__F21810B4D6479CC2");

            entity.ToTable("ESCOLARIDAD");

            entity.Property(e => e.IdEscolaridad).HasColumnName("ID_ESCOLARIDAD");
            entity.Property(e => e.IdGrupoEscolaridad).HasColumnName("ID_GRUPO_ESCOLARIDAD");
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");

            entity.HasOne(d => d.IdGrupoEscolaridadNavigation).WithMany(p => p.Escolaridads)
                .HasForeignKey(d => d.IdGrupoEscolaridad)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Grupoesco_Escolaridad");
        });

        modelBuilder.Entity<Escrito>(entity =>
        {
            entity.ToTable("Escrito");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Autoridades)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("autoridades");
            entity.Property(e => e.CircunstanciasHechos)
                .HasColumnType("text")
                .HasColumnName("circunstancias_hechos");
            entity.Property(e => e.FechaHechos)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("fecha_hechos");
            entity.Property(e => e.LugarHechos)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("lugar_hechos");
            entity.Property(e => e.NombresFinales)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombres_finales");
            entity.Property(e => e.Peticionarios)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("peticionarios");
            entity.Property(e => e.RutaDocumento)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ruta_documento");
        });

        modelBuilder.Entity<EscritoOk>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ESCRITO___3213E83F1B173C01");

            entity.ToTable("ESCRITO_OK");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CircuntanciasHechos)
                .HasColumnType("text")
                .HasColumnName("circuntancias_Hechos");
            entity.Property(e => e.FechaHechos)
                .HasColumnType("datetime")
                .HasColumnName("fecha_Hechos");
            entity.Property(e => e.FkIdComplementoPet).HasColumnName("Fk_IdComplementoPet");
            entity.Property(e => e.FkStatus)
                .HasDefaultValueSql("((4))")
                .HasColumnName("FK_STATUS");
            entity.Property(e => e.IdLugarHechos).HasColumnName("id_lugar_hechos");
            entity.Property(e => e.IdPeticionario).HasColumnName("id_Peticionario");
            entity.Property(e => e.IdQueja).HasColumnName("id_queja");
            entity.Property(e => e.IdSecundario).HasColumnName("id_secundario");
            entity.Property(e => e.NombresFinales)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("nombres_finales");
            entity.Property(e => e.RutaDocumento)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ruta_documento");
            entity.Property(e => e.Version).HasColumnName("version");
        });

        modelBuilder.Entity<EstadoConyugal>(entity =>
        {
            entity.HasKey(e => e.IdEstadoConyugal).HasName("PK__ESTADO_C__5D4C7A392B7F3EC2");

            entity.ToTable("ESTADO_CONYUGAL");

            entity.Property(e => e.IdEstadoConyugal).HasColumnName("ID_ESTADO_CONYUGAL");
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");
        });

        modelBuilder.Entity<Expediente>(entity =>
        {
            entity.HasKey(e => e.IdExpediente);

            entity.ToTable("EXPEDIENTE");

            entity.Property(e => e.IdExpediente)
                .ValueGeneratedNever()
                .HasColumnName("id_expediente");
            entity.Property(e => e.Expediente1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("expediente");
            entity.Property(e => e.FechaCalificacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_calificacion");
            entity.Property(e => e.FechaRegistrro)
                .HasColumnType("datetime")
                .HasColumnName("fecha_registrro");
            entity.Property(e => e.Fecharfv)
                .HasColumnType("datetime")
                .HasColumnName("fecharfv");
            entity.Property(e => e.Fechata)
                .HasColumnType("datetime")
                .HasColumnName("fechata");
            entity.Property(e => e.Fechatev)
                .HasColumnType("datetime")
                .HasColumnName("fechatev");
            entity.Property(e => e.FkStatus).HasColumnName("Fk_Status");
            entity.Property(e => e.Folio)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("folio");
            entity.Property(e => e.Hechos)
                .HasMaxLength(2500)
                .IsUnicode(false)
                .HasColumnName("hechos");
            entity.Property(e => e.IdAbogadoRecibe).HasColumnName("id_abogado_recibe");
            entity.Property(e => e.IdAbogadoTurna).HasColumnName("id_abogado_turna");
            entity.Property(e => e.IdEspecializado).HasColumnName("id_especializado");
            entity.Property(e => e.IdMateria).HasColumnName("id_materia");
            entity.Property(e => e.IdNivRiesgo).HasColumnName("id_niv_riesgo");
            entity.Property(e => e.IdPrograma).HasColumnName("id_programa");
            entity.Property(e => e.IdSede).HasColumnName("id_sede");
            entity.Property(e => e.IdTema).HasColumnName("id_tema");
            entity.Property(e => e.IdTipoQueja).HasColumnName("id_tipo_queja");
            entity.Property(e => e.IdTrasOpPub).HasColumnName("id_tras_op_pub");
            entity.Property(e => e.IdViaInterposicion).HasColumnName("id_via_interposicion");
            entity.Property(e => e.LugarHechos)
                .HasMaxLength(800)
                .IsUnicode(false)
                .HasColumnName("lugar_hechos");
            entity.Property(e => e.MotivoEliminado)
                .HasMaxLength(300)
                .IsUnicode(false)
                .HasColumnName("motivo_eliminado");
            entity.Property(e => e.Observaciones)
                .HasMaxLength(2500)
                .IsUnicode(false)
                .HasColumnName("observaciones");

            entity.HasOne(d => d.FkStatusNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.FkStatus)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Expediente_Status");

            entity.HasOne(d => d.IdAbogadoRecibeNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdAbogadoRecibe)
                .HasConstraintName("FK__EXPEDIENT__id_ab__2EDAF651");

            entity.HasOne(d => d.IdNivRiesgoNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdNivRiesgo)
                .HasConstraintName("FK_EXPEDIENTE_CAT_NIV_RIESGO");

            entity.HasOne(d => d.IdProgramaNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdPrograma)
                .HasConstraintName("FK_EXPEDIENTE_CAT_PROGRAMA");

            entity.HasOne(d => d.IdTemaNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdTema)
                .HasConstraintName("FK_EXPEDIENTE_CAT_TEMA");

            entity.HasOne(d => d.IdTipoQuejaNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdTipoQueja)
                .HasConstraintName("FK_EXPEDIENTE_CAT_TIPOQUEJA");

            entity.HasOne(d => d.IdViaInterposicionNavigation).WithMany(p => p.Expedientes)
                .HasForeignKey(d => d.IdViaInterposicion)
                .HasConstraintName("FK__EXPEDIENT__id_vi__718A631D");
        });

        modelBuilder.Entity<ExpedienteTurno>(entity =>
        {
            entity.HasKey(e => e.PkExpedienteTurno).HasName("PK__EXPEDIEN__F37BCEDB272A5EFA");

            entity.ToTable("EXPEDIENTE_TURNO");

            entity.Property(e => e.PkExpedienteTurno).HasColumnName("pk_expediente_turno");
            entity.Property(e => e.Claveabogadoturnado).HasColumnName("claveabogadoturnado");
            entity.Property(e => e.Clavevisitaduria).HasColumnName("clavevisitaduria");
            entity.Property(e => e.FechaFinDqot)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_FIN_DQOT");
            entity.Property(e => e.Fecharecepfis)
                .HasColumnType("date")
                .HasColumnName("fecharecepfis");
            entity.Property(e => e.Fechaturnovisitaduria)
                .HasColumnType("datetime")
                .HasColumnName("fechaturnovisitaduria");
            entity.Property(e => e.Fechaturnovisitaduriaelectronico)
                .HasColumnType("date")
                .HasColumnName("fechaturnovisitaduriaelectronico");
            entity.Property(e => e.FkMemorandum).HasColumnName("fk_memorandum");
            entity.Property(e => e.IdExpediente)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("id_expediente");
            entity.Property(e => e.NumFojas).HasColumnName("num_fojas");
            entity.Property(e => e.Observaciones)
                .HasColumnType("text")
                .HasColumnName("observaciones");
        });

        modelBuilder.Entity<GrupoEscolaridad>(entity =>
        {
            entity.HasKey(e => e.IdGrupoEscolaridad).HasName("PK__ESCOLARI__F21810B4D6479CC9");

            entity.ToTable("GRUPO_ESCOLARIDAD");

            entity.Property(e => e.IdGrupoEscolaridad).HasColumnName("ID_GRUPO_ESCOLARIDAD");
            entity.Property(e => e.Descripcion)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
        });

        modelBuilder.Entity<GrupoSocial>(entity =>
        {
            entity.HasKey(e => e.IdGrupoSocial).HasName("PK__SEXO__F5FF4DDC19F29755");

            entity.ToTable("GRUPO_SOCIAL");

            entity.Property(e => e.IdGrupoSocial).HasColumnName("ID_GRUPO_SOCIAL");
            entity.Property(e => e.NombreGrupoSocial)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_GRUPO_SOCIAL");
        });

        modelBuilder.Entity<HijosVivo>(entity =>
        {
            entity.HasKey(e => e.IdHijosVivos).HasName("PK__SEXO__F5RF4DDC19F29755");

            entity.ToTable("HIJOS_VIVOS");

            entity.Property(e => e.IdHijosVivos).HasColumnName("ID_HIJOS_VIVOS");
            entity.Property(e => e.NombreHijosVivos)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_HIJOS_VIVOS");
        });

        modelBuilder.Entity<HubConnection>(entity =>
        {
            entity.ToTable("HubConnection");

            entity.Property(e => e.ConnectionId)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Grupo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Hub)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LugarHecho>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__LugarHec__3213E83F9C1962F2");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Calle)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("calle");
            entity.Property(e => e.Colonia)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("colonia");
            entity.Property(e => e.Cp).HasColumnName("CP");
            entity.Property(e => e.IdMunicipio).HasColumnName("id_municipio");
            entity.Property(e => e.NumeroExt)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("numero_ext");
            entity.Property(e => e.NumeroInt)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("numero_int");
        });

        modelBuilder.Entity<Memorandum>(entity =>
        {
            entity.HasKey(e => e.PkMemorandum).HasName("PK__Memorand__8104D5A50BF6C30F");

            entity.ToTable("Memorandum");

            entity.Property(e => e.PkMemorandum).HasColumnName("PK_MEMORANDUM");
            entity.Property(e => e.Asunto)
                .HasColumnType("text")
                .HasColumnName("ASUNTO");
            entity.Property(e => e.FechaDeCreacion)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_DE_CREACION");
            entity.Property(e => e.FkAreaDestinatario).HasColumnName("FK_AREA_DESTINATARIO");
            entity.Property(e => e.FkAreaOrigen).HasColumnName("FK_AREA_ORIGEN");
            entity.Property(e => e.FkIduserdestinatario).HasColumnName("fk_iduserdestinatario");
            entity.Property(e => e.FkStatus).HasColumnName("Fk_Status");
            entity.Property(e => e.NumMemorandum)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("NUM_MEMORANDUM");
            entity.Property(e => e.UltimoUsuarioModifica).HasColumnName("ULTIMO_USUARIO_MODIFICA");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("MENU");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Habilitado).HasColumnName("HABILITADO");
            entity.Property(e => e.IdMenu).HasColumnName("ID_MENU");
            entity.Property(e => e.Ruta)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("RUTA");
        });

        modelBuilder.Entity<Mese>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("meses");

            entity.Property(e => e.IdMes).HasColumnName("Id_mes");
            entity.Property(e => e.Mes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("mes");
            entity.Property(e => e.Seleccionable).HasColumnName("seleccionable");
        });

        modelBuilder.Entity<ModalidadViolencium>(entity =>
        {
            entity.HasKey(e => e.IdModalidadViolencia).HasName("PK__SEXO__F5RF4DDCO9F29755");

            entity.ToTable("MODALIDAD_VIOLENCIA");

            entity.Property(e => e.IdModalidadViolencia).HasColumnName("ID_MODALIDAD_VIOLENCIA");
            entity.Property(e => e.NombreModalidadViolencia)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_MODALIDAD_VIOLENCIA");
        });

        modelBuilder.Entity<Moduloatenciondqot>(entity =>
        {
            entity.HasKey(e => e.IdModuloDqot).HasName("PK__ModuloAt__33CBFCF5C093338C");

            entity.ToTable("MODULOATENCIONDQOT", tb =>
                {
                    tb.HasTrigger("tr_dbo_Moduloatenciondqot_046a18f8-699b-4dd9-a72a-8ca74f5b28a1_Sender");
                    tb.HasTrigger("tr_dbo_Moduloatenciondqot_e2ddc040-9a32-42a7-81ab-89418f711dba_Sender");
                });

            entity.Property(e => e.IdModuloDqot).HasColumnName("idModuloDqot");
            entity.Property(e => e.NombreModulo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombreModulo");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.StatusDisponible).HasColumnName("STATUS_DISPONIBLE");
        });

        modelBuilder.Entity<Municipio>(entity =>
        {
            entity.HasKey(e => e.Consecutivo);

            entity.ToTable("Municipio");

            entity.Property(e => e.Consecutivo)
                .ValueGeneratedNever()
                .HasColumnName("CONSECUTIVO");
            entity.Property(e => e.ClaveMunicipio).HasColumnName("Clave Municipio");
            entity.Property(e => e.Cvemun)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("CVEMUN");
            entity.Property(e => e.Estado)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ESTADO");
            entity.Property(e => e.Municipio1)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("MUNICIPIO");
        });

        modelBuilder.Entity<Notificacione>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Notification");

            entity.ToTable("NOTIFICACIONES", tb =>
                {
                    tb.HasTrigger("tr_dbo_Notificaciones_47273658-a941-415f-ae3c-05e4c3ee9d40_Sender");
                    tb.HasTrigger("tr_dbo_Notificaciones_c04e410b-a827-44a4-a74a-64ecd6eea25b_Sender");
                });

            entity.Property(e => e.Grupo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Message)
                .IsRequired()
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.MessageType)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Nombreuser)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.NotificationDateTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Titulo)
                .IsRequired()
                .HasMaxLength(80)
                .IsUnicode(false);
            entity.Property(e => e.Url)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Ocupacion>(entity =>
        {
            entity.HasKey(e => e.IdOcupacion).HasName("PK__SEXO__F5FF4DDC19F59753");

            entity.ToTable("OCUPACION");

            entity.Property(e => e.IdOcupacion).HasColumnName("ID_OCUPACION");
            entity.Property(e => e.NombreOcupacion)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_OCUPACION");
        });

        modelBuilder.Entity<RecepcionIdentificacion>(entity =>
        {
            entity.HasKey(e => e.IdRelacion);

            entity.ToTable("RECEPCION_IDENTIFICACION");

            entity.Property(e => e.IdRelacion).HasColumnName("ID_RELACION");
            entity.Property(e => e.FotoIdentificacion)
                .IsRequired()
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("FOTO_IDENTIFICACION");
            entity.Property(e => e.IdIdentificacion).HasColumnName("ID_IDENTIFICACION");
            entity.Property(e => e.IdRegistro).HasColumnName("ID_REGISTRO");

            entity.HasOne(d => d.IdIdentificacionNavigation).WithMany(p => p.RecepcionIdentificacions)
                .HasForeignKey(d => d.IdIdentificacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RECEPCION__ID_ID__49D07A5D");

            entity.HasOne(d => d.IdRegistroNavigation).WithMany(p => p.RecepcionIdentificacions)
                .HasForeignKey(d => d.IdRegistro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RECEPCION__ID_RE__4AC49E96");
        });

        modelBuilder.Entity<RegRecepcion>(entity =>
        {
            entity.HasKey(e => e.IdRegistro).HasName("PK__REG_RECE__C7B81E68ACD7D684");

            entity.ToTable("REG_RECEPCION");

            entity.Property(e => e.IdRegistro).HasColumnName("ID_REGISTRO");
            entity.Property(e => e.ApellidoMat)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("APELLIDO_MAT");
            entity.Property(e => e.ApellidoPat)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("APELLIDO_PAT");
            entity.Property(e => e.DocIdentificatorio)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("DOC_IDENTIFICATORIO");
            entity.Property(e => e.FinguerPrint).HasMaxLength(2500);
            entity.Property(e => e.FotoIdentificacion).HasColumnType("image");
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");
            entity.Property(e => e.Procedencia)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PROCEDENCIA");
        });

        modelBuilder.Entity<RegistroAsistencium>(entity =>
        {
            entity.HasKey(e => e.IdRegistroAsistencia).HasName("PK__REGISTRO__FB2B71EC564AD33F");

            entity.ToTable("REGISTRO_ASISTENCIA");

            entity.Property(e => e.IdRegistroAsistencia).HasColumnName("ID_REGISTRO_ASISTENCIA");
            entity.Property(e => e.FechaHoraSalida)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_HORA_SALIDA");
            entity.Property(e => e.FechaVisita)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("FECHA_VISITA");
            entity.Property(e => e.FkIdAsunto).HasColumnName("FK_ID_ASUNTO");
            entity.Property(e => e.FkIdDepartamento).HasColumnName("FK_ID_DEPARTAMENTO");
            entity.Property(e => e.FkIdVisitante).HasColumnName("FK_ID_VISITANTE");

            entity.HasOne(d => d.FkIdAsuntoNavigation).WithMany(p => p.RegistroAsistencia)
                .HasForeignKey(d => d.FkIdAsunto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fkiidasunto");

            entity.HasOne(d => d.FkIdDepartamentoNavigation).WithMany(p => p.RegistroAsistencia)
                .HasForeignKey(d => d.FkIdDepartamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fkiiddepartamento");

            entity.HasOne(d => d.FkIdVisitanteNavigation).WithMany(p => p.RegistroAsistencia)
                .HasForeignKey(d => d.FkIdVisitante)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fkiidpersona");
        });

        modelBuilder.Entity<RelacionAgresor>(entity =>
        {
            entity.HasKey(e => e.IdRelacionAgresor).HasName("PK__SEXO__F5RF4DDBO9F79755");

            entity.ToTable("RELACION_AGRESOR");

            entity.Property(e => e.IdRelacionAgresor).HasColumnName("ID_RELACION_AGRESOR");
            entity.Property(e => e.NombreRelacionAgresor)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_RELACION_AGRESOR");
        });

        modelBuilder.Entity<Sexo>(entity =>
        {
            entity.HasKey(e => e.IdSexo).HasName("PK__SEXO__F5FF4DDC19F59713");

            entity.ToTable("SEXO");

            entity.Property(e => e.IdSexo).HasColumnName("ID_SEXO");
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");
        });

        modelBuilder.Entity<StatusExpediente>(entity =>
        {
            entity.HasKey(e => e.PkStatusExpediente).HasName("PK__STATUS_E__1B8F5C0A27CEB1C5");

            entity.ToTable("STATUS_EXPEDIENTE");

            entity.Property(e => e.PkStatusExpediente)
                .ValueGeneratedNever()
                .HasColumnName("PK_STATUS_EXPEDIENTE");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
        });

        modelBuilder.Entity<Submenu>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("SUBMENU");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("DESCRIPCION");
            entity.Property(e => e.Habilitado).HasColumnName("HABILITADO");
            entity.Property(e => e.IdMenu).HasColumnName("ID_MENU");
            entity.Property(e => e.IdSubmenu).HasColumnName("ID_SUBMENU");
            entity.Property(e => e.Ruta)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("RUTA");
        });

        modelBuilder.Entity<TipoViolencium>(entity =>
        {
            entity.HasKey(e => e.IdTipoViolencia).HasName("PK__SEXO__F5RF4DDCO9F79755");

            entity.ToTable("TIPO_VIOLENCIA");

            entity.Property(e => e.IdTipoViolencia).HasColumnName("ID_TIPO_VIOLENCIA");
            entity.Property(e => e.NombreTipoViolencia)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NOMBRE_TIPO_VIOLENCIA");
        });

        modelBuilder.Entity<Turno>(entity =>
        {
            entity.HasKey(e => e.IdTurno);

            entity.ToTable("TURNO", tb =>
                {
                    tb.HasTrigger("tr_dbo_Turno_7b9b362a-3da9-4fcb-b9bc-a3131114bfe1_Sender");
                    tb.HasTrigger("tr_dbo_Turno_dd5f2b41-9dd2-412c-b769-e05d7d797a86_Sender");
                });

            entity.Property(e => e.IdTurno).HasColumnName("ID_TURNO");
            entity.Property(e => e.Estado).HasColumnName("ESTADO");
            entity.Property(e => e.FechaHoraAtención)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_HORA_ATENCIÓN");
            entity.Property(e => e.FechaHoraTerminaAtencion)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_HORA_TERMINA_ATENCION");
            entity.Property(e => e.FechaHoraTomaAtn)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_HORA_TOMA_ATN");
            entity.Property(e => e.FkIdModulo).HasColumnName("FK_ID_MODULO");
            entity.Property(e => e.Grupo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("GRUPO");
            entity.Property(e => e.IdAbogadoAtendio).HasColumnName("ID_ABOGADO_ATENDIO");
            entity.Property(e => e.IdAsistencia).HasColumnName("ID_ASISTENCIA");
            entity.Property(e => e.IdRegistro).HasColumnName("ID_REGISTRO");
            entity.Property(e => e.NumTurno).HasColumnName("NUM_TURNO");
            entity.Property(e => e.Typemsg)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TYPEMSG");
            entity.Property(e => e.Username)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("USERNAME");

            entity.HasOne(d => d.EstadoNavigation).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.Estado)
                .HasConstraintName("FK__TURNO__ESTADO__45BE5BA9");

            entity.HasOne(d => d.FkIdModuloNavigation).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.FkIdModulo)
                .HasConstraintName("FK__TURNO__MODULO__40058253");

            entity.HasOne(d => d.IdAbogadoAtendioNavigation).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.IdAbogadoAtendio)
                .HasConstraintName("FK__TURNO__ABOGADO_A__40058253");

            entity.HasOne(d => d.IdRegistroNavigation).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.IdRegistro)
                .HasConstraintName("FK__TURNO__ID_REGIST__6DCC4D03");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario);

            entity.ToTable("USUARIOS", tb =>
                {
                    tb.HasTrigger("tr_dbo_Usuarios_0329dbee-00dd-4ccd-99c4-3ddde76f6d11_Sender");
                    tb.HasTrigger("tr_dbo_Usuarios_a65ea957-016c-480f-8655-d098d9ea5f9e_Sender");
                });

            entity.Property(e => e.IdUsuario)
                .ValueGeneratedNever()
                .HasColumnName("ID_USUARIO");
            entity.Property(e => e.Activo).HasColumnName("ACTIVO");
            entity.Property(e => e.Am)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("AM");
            entity.Property(e => e.Ap)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("AP");
            entity.Property(e => e.Cargo).HasColumnName("CARGO");
            entity.Property(e => e.CargoDocumentos)
                .HasMaxLength(120)
                .IsUnicode(false)
                .HasColumnName("CARGO_DOCUMENTOS");
            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FkIdArea).HasColumnName("FK_ID_AREA");
            entity.Property(e => e.GradoAcademico)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("GRADO_ACADEMICO");
            entity.Property(e => e.Grupo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("GRUPO");
            entity.Property(e => e.IdArea)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("ID_AREA");
            entity.Property(e => e.Logueo).HasColumnName("LOGUEO");
            entity.Property(e => e.Nombre)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");
            entity.Property(e => e.Ocupado).HasColumnName("OCUPADO");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("PASSWORD");
            entity.Property(e => e.Rol)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ROL");
            entity.Property(e => e.Telefono)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("TELEFONO");
            entity.Property(e => e.Usuario1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("USUARIO");

            entity.HasOne(d => d.CargoNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.Cargo)
                .HasConstraintName("FK__USUARIOS__CARGO__070607D4");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
