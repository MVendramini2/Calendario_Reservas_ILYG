
// src/pages/Login.tsx
import React, { useState } from "react";
import logoIlyg from "../assets/logo-ilyg.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("admin");
  const [contrasena, setContrasena] = useState("123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError((data && data.message) || "Usuario o contraseña incorrectos");
        setLoading(false);
        return; // ⬅️ NO navegamos si falló
      }

      // Guardar datos de sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      navigate("/admin");
    } catch (err) {
      console.error("Error de red al iniciar sesión:", err);
      setError("Error de red al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-8">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src={logoIlyg}
            alt="Logo ILYG Kudos International"
            className="w-48"
          />
        </div>

        {/* Títulos */}
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Sistema de Reservas
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Ingrese sus credenciales para acceder
        </p>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200 text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Usuario */}
          <div>
            <label
              htmlFor="usuario"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
              }}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="contrasena"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
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
            disabled={loading}
            className="w-full rounded-md py-2.5 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-60"
            style={{ backgroundColor: "#0b43a8" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#093c92")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#0b43a8")
            }
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Usuarios de prueba (texto, pero el backend hoy valida solo el admin) */}
        <div className="mt-8 rounded-md bg-gray-50 p-4 border border-gray-200">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Usuarios de prueba:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>
              <strong>admin</strong> / admin123 (Administrador)
            </li>
            <li>
              <strong>colaborador1</strong> / 123 (Colaborador con vista
              completa)
            </li>
            <li>
              <strong>colaborador2</strong> / 123 (Colaborador vista limitada)
            </li>
            <li>
              <strong>viewer1</strong> / 123 (Solo lectura)
            </li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            *Por ahora, el backend solo valida el usuario configurado en
            <code className="ml-1">.env</code> (ej: admin / 123).
          </p>
        </div>
      </div>
    </div>
  );
}

