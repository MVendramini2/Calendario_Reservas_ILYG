// src/pages/ReservasHistorial.tsx
import React, { useMemo, useState } from "react";
import type { Evento, Sala } from "./Admin";

type ReservasHistorialProps = {
  eventos: Evento[];
  onVerDetalle: (ev: Evento) => void;  
};

const ReservasHistorial: React.FC<ReservasHistorialProps> = ({
  eventos,
  onVerDetalle,
}) => {
  const [search, setSearch] = useState("");
  const [salaFilter, setSalaFilter] = useState<"todas" | Sala>("todas");
  const [page, setPage] = useState(1);
  const pageSize = 1; 

  const nombreSala = (s: "A" | "B") => (s === "A" ? "Grande" : "Chica");

  const reservasFiltradas = useMemo(() => {
    const term = search.toLowerCase().trim();

    return [...eventos]
      .filter((ev) => {
        if (salaFilter !== "todas" && ev.sala !== salaFilter) return false;
        if (!term) return true;

        return (
          ev.persona.toLowerCase().includes(term) ||
          ev.area.toLowerCase().includes(term) ||
          ev.date.includes(term)
        );
      })
      .sort((a, b) => {
        // orden por fecha y luego por hora
        const d = a.date.localeCompare(b.date);
        if (d !== 0) return d;
        return a.start.localeCompare(b.start);
      });
  }, [eventos, salaFilter, search]);

  const formatFecha = (iso: string) => {
    const [year, month, day] = iso.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatHorario = (ev: Evento) => `${ev.start} - ${ev.end}`;

  // 📄 Paginación
  const total = reservasFiltradas.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = safePage * pageSize;
  const reservasPagina = reservasFiltradas.slice(startIndex, endIndex);

  // si cambian filtros/busqueda y la página queda alta, la bajamos a 1
  // (opcional pero prolijo)
  // Podés dejar así si no querés useEffect.

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header de la card */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Todas las Reservas
        </h2>
        <p className="text-sm text-gray-500">
          Gestione y visualice el histórico de reservas de salas.
        </p>
      </div>

      {/* Filtros y buscador */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        {/* Buscador */}
        <div className="flex-1">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="6" strokeWidth="2" />
                <path
                  d="M16 16l3 3"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="text"
              className="w-full rounded-md border border-gray-200 px-9 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0b43a8] focus:outline-none focus:ring-1 focus:ring-[#0b43a8]"
              placeholder="Buscar por nombre, sector o fecha…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset página cuando cambia búsqueda
              }}
            />
          </div>
        </div>

        {/* Filtro de sala */}
        <div className="flex gap-2">
          <select
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0b43a8] focus:outline-none focus:ring-1 focus:ring-[#0b43a8]"
            value={salaFilter}
            onChange={(e) => {
              setSalaFilter(e.target.value as "todas" | Sala);
              setPage(1); // reset página cuando cambia filtro
            }}
          >
            <option value="todas">Todas las salas</option>
            <option value="A">Sala Grande</option>
            <option value="B">Sala Chica</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Sala</Th>
              <Th>Fecha</Th>
              <Th>Horario</Th>
              <Th>Solicitante</Th>
              <Th>Sector</Th>
              <Th className="text-right">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {reservasPagina.length === 0 && (
              <tr>
                <td
                  className="px-4 py-4 text-center text-gray-500"
                  colSpan={6}
                >
                  No hay reservas que coincidan con los filtros.
                </td>
              </tr>
            )}

            {reservasPagina.map((ev, idx) => (
              <tr key={`${ev.date}-${ev.start}-${ev.sala}-${idx}`}>
                {/* Sala */}
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0b43a8]" />
                    <span className="font-medium text-gray-800">
                      Sala {nombreSala(ev.sala)}
                    </span>
                  </div>
                </Td>

                {/* Fecha */}
                <Td>{formatFecha(ev.date)}</Td>

                {/* Horario */}
                <Td>
                  <div className="flex items-center gap-1 text-gray-700">
                    <span className="text-gray-400">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        stroke="currentColor"
                      >
                        <circle cx="12" cy="12" r="9" strokeWidth="2" />
                        <path
                          d="M12 7v5l3 2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{formatHorario(ev)}</span>
                  </div>
                </Td>

                {/* Solicitante */}
                <Td>{ev.persona}</Td>

                {/* Sector */}
                <Td>{ev.area}</Td>

                {/* Acción */}
                <Td className="text-right">
                  <button
                    className="text-sm font-medium text-[#0b43a8] hover:underline"
                    onClick={() => onVerDetalle(ev)}
                  >
                    Ver Detalle
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer cantidad + paginación */}
      <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
        <p>
          Mostrando {reservasPagina.length} de {total} reserva
          {total !== 1 && "s"}
        </p>

        {total > pageSize && (
          <div className="flex items-center gap-2 text-sm">
            <button
              className="rounded-md border px-3 py-1 text-xs text-gray-700 disabled:opacity-40 hover:bg-gray-200"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              &lt; Anterior
            </button>
            <span className="text-xs text-gray-600">
              Página {safePage} de {totalPages}
            </span>
            <button
              className="rounded-md border px-3 py-1 text-xs text-gray-700 disabled:opacity-40 hover:bg-gray-200"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 align-middle text-gray-800 ${className}`}>
      {children}
    </td>
  );
}

export default ReservasHistorial;