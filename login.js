document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const mensajeError = document.getElementById("mensaje-error");

  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const password = document.getElementById("password").value.trim();

      // Petición POST a la API de DummyJSON para autenticar
      fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usuario,
          password: password,
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("Credenciales inválidas");
        }
        return res.json();
      })
      .then(data => {
        // Si el login es exitoso, guardamos el token y el estado en localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("sesion", "activa");

        // Redirigimos al panel de administración con las 4 tarjetas
        window.location.href = "admin.html";
      })
      .catch(error => {
        console.error("Error:", error);
        // Mostramos el mensaje de error en el HTML
        mensajeError.classList.remove("d-none");
      });
    });
  }
});