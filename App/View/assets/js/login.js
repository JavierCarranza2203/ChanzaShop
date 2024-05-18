document.addEventListener('DOMContentLoaded', function () {
    
    const loginForm = document.getElementById('loginForm'); // Obtén el formulario de inicio de sesión por su ID
    const txtUsuario = document.getElementById('txtUsuario');
    const txtContrasenia = document.getElementById('txtPassword');

    // Agrega un event listener para el evento 'submit' del formulario
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Crea un objeto FormData para recopilar los datos del formulario
        const formData = new FormData();
        formData.append('username', txtUsuario.value);
        formData.append('password', txtContrasenia.value);
        formData.append('action', 'login');

        // Realiza una solicitud POST al servidor con los datos del formulario
        fetch('http://localhost/ChanzaShop/App/Service/UserService.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            // Verifica si la respuesta del servidor indica un error
            if (!response.ok) {
                // Lanza un error para ser capturado por el siguiente bloque catch
                throw new Error('Error al iniciar sesión');
            }
            // Devuelve la respuesta como JSON para ser procesada en el siguiente bloque then
            return response.json();
        })
        .then(data => {
            // Verifica si la respuesta indica un inicio de sesión exitoso
            if (data && data.estaLoggeado) {
                // Redirige al usuario a la página de inicio o al panel de control
                window.location.href = 'http://localhost/ChanzaShop/App/';
            } else {
                // Muestra un mensaje de error al usuario si el inicio de sesión falla
                console.error('Error 1:', data);
                alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        })
        .catch(error => {
            // Muestra un mensaje de error genérico si ocurre algún problema durante la solicitud
            console.error('Error: 2', error);
            alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        });
    });
});
