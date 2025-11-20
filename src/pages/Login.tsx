
import React, { useState } from "react";
import logoIlyg from "../assets/logo-ilyg.png";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [usuario, setUsuario] = useState("admin");
  const [contrasena, setContrasena] = useState("123");
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", { usuario, contrasena });
    // Aquí iría la lógica real de autenticación
    // Por ahora, simplemente navegamos a la página de admin
    navigate("/admin");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-8">
        {/* Icono circular */}
        <div className="mb-6 flex justify-center">
          <img 
            src={logoIlyg} 
            alt="ILYG" 
            className="w-48" // Ajusta el tamaño según sea necesario
          />
        </div>

        {/* Títulos */}
        <h1 className="text-center text-2xl font-semibold text-gray-800">Sistema de Reservas</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Ingrese sus credenciales para acceder</p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Usuario */}
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
                       // uso ring con color arbitrario
                       // tailwind arbitrary color via style for compatibility
              }}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Contraseña"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full rounded-md py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: "#0b43a8" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#093c92")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0b43a8")}
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="mt-8 rounded-md bg-gray-50 p-4 border border-gray-200">
          <p className="mb-2 text-sm font-medium text-gray-700">Usuarios de prueba:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li><strong>admin</strong> / 123 (Administrador)</li>
            <li><strong>colaborador1</strong> / 123 (Colaborador con vista completa)</li>
            <li><strong>colaborador2</strong> / 123 (Colaborador vista limitada)</li>
            <li><strong>viewer1</strong> / 123 (Solo lectura)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
