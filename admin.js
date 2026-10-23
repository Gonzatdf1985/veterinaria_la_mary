document.addEventListener("DOMContentLoaded", () => {
  // 1. Verificamos si la sesión está activa en el navegador
  const sesionActiva = localStorage.getItem("sesion");

  if (sesionActiva !== "activa") {
    // Si no está logueado, lo redirigimos al login por seguridad
    window.location.href = "./login.html";
    return;
  }

  // 2. Manejar el botón de cerrar sesión
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", (e) => {
      e.preventDefault();
      // Limpiamos los datos de sesión del LocalStorage
      localStorage.removeItem("sesion");
      localStorage.removeItem("token");
      
      // Redirigimos al login
      window.location.href = "./login.html";
    });
  }
});
