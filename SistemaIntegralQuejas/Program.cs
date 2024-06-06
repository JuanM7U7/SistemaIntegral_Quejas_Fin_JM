using Microsoft.EntityFrameworkCore;
using SistemaIntegralQuejas.Hubs;
using SistemaIntegralQuejas.MiddlewareExtensions;
using SistemaIntegralQuejas.Models;
using SistemaIntegralQuejas.Repos;
using SistemaIntegralQuejas.SubscribeTableDependencies;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

//DB CONTEXT
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DbSistemaIntegralQuejasContext>(options =>
	options.UseSqlServer(connectionString),
	ServiceLifetime.Singleton
);

// DI

// NOTIFICACIONES
//builder.Services.AddSingleton<UsuarioRepo>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<LayoutHub>();
builder.Services.AddSingleton<SucscribeNotificacionesTableDependency>();
// TURNO
builder.Services.AddSingleton<TurnosHub>();
builder.Services.AddSingleton<SucscribeTurnosTableDependency>();
// MODULO_ATENCION_DQOT
builder.Services.AddSingleton<SucscribeModulosatnTableDependency>();
// USUARIOS
builder.Services.AddSingleton<SucscribeUsuariosTableDependency>();

// FIN DI

// Autenticación
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(option => {
        option.LoginPath = "/Login/IniciarSesion";
        option.ExpireTimeSpan = TimeSpan.FromDays(6);
        option.Cookie.MaxAge = TimeSpan.FromDays(6);
        option.AccessDeniedPath = "/Login/CerrarSesion";
    });

//Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(6);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();
// Hubs
app.MapHub<LayoutHub>("/layoutHub");
app.MapHub<TurnosHub>("/turnosHub");

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Login}/{action=IniciarSesion}/{id?}");

app.UseTableDependency<SucscribeNotificacionesTableDependency>(connectionString);
app.UseTableDependency<SucscribeTurnosTableDependency>(connectionString);
app.UseTableDependency<SucscribeModulosatnTableDependency>(connectionString);
app.UseTableDependency<SucscribeUsuariosTableDependency>(connectionString);

IWebHostEnvironment env = app.Environment;
Rotativa.AspNetCore.RotativaConfiguration.Setup(env.WebRootPath,"../Rotativa");

app.Run();
