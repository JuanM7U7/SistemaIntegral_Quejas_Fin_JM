
$(document).ready(function () {

    $("#formLogin").on("submit", function (e) {
        e.preventDefault();
        var usuario = $('#username').val().trim();
        var passwd = $('#password').val();

        $.ajax({
            type: "post",
            url: 'Login/IniciarSesion',
            data: { username: usuario, password: passwd },
            dataType: "json",
            success: function (data) {
                console.log(data)
                if (data.page == "Nouser")  {

                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Usuario o Contraseña Iconrrecta',
                        showConfirmButton: false,
                        timer: 1500
                    });

                } else if (data.page == "Userlogueado") {

                    Swal.fire({
                        title: 'Se inicio sesión con su cuenta en otro dispositivo ¿Desea cerrarla?',
                        showCancelButton: true,
                        icon: 'warning',
                        confirmButtonText: 'Si',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'No',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $.ajax({
                                type: "POST",
                                url: "Login/DeslogueaUserl",
                                data: { username: usuario },
                                dataType: "json",
                                success: function (response) {
                                    if (response.data) {
                                        if (data.login_page == "Calificacion") { window.location.href = "/Expediente/" + data.login_page; } else { window.location.href = "/Home/" + data.login_page; }
                                   

                                    }
                                }
                            });
                        } 
                    })

                } else {
                    $.ajax({
                        type: "POST",
                        url: "Login/ActivaUsuarioLogueo",
                        data: { username: usuario },
                        dataType: "json",
                        success: function (response) {
                            if (response.data) {
                                if (data.login_page == "Calificacion") { window.location.href = "/Expediente/" + data.login_page; } else { window.location.href = "/Home/" + data.login_page; }
                            }
                        }
                    });
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

                if (jqXHR.status == 500 || jqXHR.status == 404) {
                    window.location.href = window.location.protocol + "//" + window.location.host
                } 
            }
        })

    });

 });

