// src/pages/AdminCalendarPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import NewReservationModal from "../pages/NewReservationModal";
import { useNavigate } from "react-router-dom";
import ReservasHistorial from "./ReservaHistorial";

export type Sala = "A" | "B";

export type EventoSinId = Omit<Evento, "id">;

export type Evento = {
  id: number;
  sala: Sala;
  date: string;   // yyyy-mm-dd
  start: string;  // HH:mm
  end: string;    // HH:mm
  persona: string;
  area: string;
  motivo: string;
};

export default function AdminCalendarPage() {

  const navigate = useNavigate();

  // --- helpers de fecha ---
  const today = new Date();
  const startOfWeek = (d: Date) => {
    const copy = new Date(d);
    const day = (copy.getDay() + 6) % 7; // lunes=0
    copy.setDate(copy.getDate() - day);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const addDays = (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
  const fmtISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // estado de pestañas y sala
  const [activeTab, setActiveTab] =
    useState<"calendario" | "mis" | "admin">("calendario");
  const [sala, setSala] = useState<Sala>("A");

  // modal detalle
  const [showModal, setShowModal] = useState(false);
  const [modalEvento, setModalEvento] = useState<Evento | null>(null);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  // modal nueva reserva
  const [showNewModal, setShowNewModal] = useState(false);

  // fecha de inicio de la semana visible
  const [viewStart, setViewStart] = useState<Date>(startOfWeek(today));

  // eventos en estado (dos de ejemplo + los que se creen)
  const [eventos, setEventos] = useState<Evento[]>([]);

  const handleLogout = () => {
  
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  navigate("/login");
};

  useEffect(() => {
  const fetchReservas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const res = await fetch("http://localhost:3001/api/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      // token vencido o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      navigate("/login");
      return;
    }

    if (!res.ok) {
      console.error("Error al obtener reservas", await res.text());
      return;
    }

    const data = await res.json();
    setEventos(data);
  };

  fetchReservas();
}, [navigate]);

  const handleDeleteReserva = async (id: number) => {
    const ok = window.confirm("¿Seguro que querés eliminar esta reserva?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3001/api/reservas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // por si viene vacío
      }

      if (!res.ok) {
        alert(
          (data && data.message) ||
          `No se pudo eliminar la reserva (código ${res.status})`
        );
        return;
      }

      // si salió bien, actualizamos el estado
      setEventos((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error("Error de red al eliminar reserva:", err);
      alert("Error de red al eliminar la reserva");
    }
  };

  const goPrevWeek = () => setViewStart(addDays(viewStart, -7));
  const goNextWeek = () => setViewStart(addDays(viewStart, 7));
  const goToday = () => setViewStart(startOfWeek(new Date()));

  // semana actual para render
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(viewStart, i)),
    [viewStart]
  );

  const times = useMemo(() => {
    // 08:00 a 20:00 cada 30 minutos
    const out: string[] = [];
    for (let h = 8; h <= 20; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`);
      if (h !== 20) out.push(`${String(h).padStart(2, "0")}:30`);
    }
    return out;
  }, []);

  // rango de semana para cabecera
  const rangoTexto = useMemo(() => {
    const ini = weekDays[0];
    const fin = weekDays[6];
    return `${ini.getDate()} de ${meses[ini.getMonth()]} - ${fin.getDate()
      } de ${meses[fin.getMonth()]}, ${fin.getFullYear()}`;
  }, [weekDays]);

  const isTodayCol = (d: Date) => fmtISO(d) === fmtISO(today);

  // eventos de la sala seleccionada
  const eventosSala = eventos.filter((e) => e.sala === sala);

  const onOpenEvento = (ev: Evento) => {
    setModalEvento(ev);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Topbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-[#0b43a8] text-lg font-semibold">
              Sistema de Reservas de Salas
            </h1>
            <p className="text-sm text-gray-600">
              Bienvenido/a, Administrador Sistema (Administrador)
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            title="Cerrar Sesión"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M13 17l5-5-5-5m5 5H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 19a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h7a2 2 0 012 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-4 flex gap-2">
          <TabButton
            active={activeTab === "calendario"}
            onClick={() => setActiveTab("calendario")}
            icon={CalendarIcon}
          >
            Calendario
          </TabButton>
          <TabButton
            active={activeTab === "mis"}
            onClick={() => setActiveTab("mis")}
            icon={ListIcon}
          >
            Mis Reservas
          </TabButton>
        </div>

        {activeTab === "calendario" && (

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Calendario de Reservas
                </h2>
                <p className="text-sm text-gray-500">
                  Seleccione una sala para ver su disponibilidad
                </p>
              </div>

              <button
                className="btn-azul inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white shadow-sm"

                onClick={() => {
                  setEditingEvento(null);
                  setShowNewModal(true);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Nueva Reserva
              </button>
            </div>

            {/* Select de Salas */}
            <div className="mb-4 flex items-center gap-3">
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm  ${sala === "A" ? "text-white" : "text-gray-700 bg-white border hover:bg-gray-200"
                  }`}
                style={sala === "A" ? { backgroundColor: "#0b43a8" } : {}}
                onClick={() => setSala("A")}
              >
                Sala Grande
              </button>
              <button
                className={`rounded-md px-4 py-2 text-sm font-medium shadow-sm ${sala === "B" ? "text-white" : "text-gray-700 bg-white border hover:bg-gray-200"
                  }`}
                style={sala === "B" ? { backgroundColor: "#0b43a8" } : {}}
                onClick={() => setSala("B")}
              >
                Sala Chica
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={goPrevWeek}
                  className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  &lt;
                </button>
                <button
                  onClick={goToday}
                  className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Hoy
                </button>
                <button
                  onClick={goNextWeek}
                  className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  &gt;
                </button>
              </div>
            </div>

            {/* Rango de semana */}
            <div className="mb-2 text-right text-sm text-gray-600">
              {rangoTexto}
            </div>

            {/* Calendario – Week Grid */}
            <div
              key={sala}
              className="overflow-hidden rounded-xl border border-gray-200 calendar-anim-enter">
              {/* Header de días */}
              <div className="grid grid-cols-8 border-b bg-gray-50 border-gray-200">
                <div className="p-3 text-sm text-gray-500">&nbsp;</div>
                {weekDays.map((d, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-center text-sm ${isTodayCol(d) ? "text-white" : "text-gray-700"
                      }`}
                    style={
                      isTodayCol(d) ? { backgroundColor: "#0b43a8" } : {}
                    }
                  >
                    <div className="capitalize">
                      {["lun", "mar", "mié", "jue", "vie", "sáb", "dom"][idx]}
                    </div>
                    <div className="text-base font-medium">{d.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Body: horas x días */}
              <div className="grid grid-cols-8">
                {/* Columna de horas */}
                <div className="bg-gray-50">
                  {times.map((t) => (
                    <div
                      key={t}
                      className="h-14 border-b p-3 text-xs text-gray-600 border-gray-200"
                    >
                      {t}
                    </div>
                  ))}
                </div>

                {/* 7 columnas de días */}
                {weekDays.map((dayDate, dayIdx) => {
                  const eventosDelDia = eventosSala.filter(
                    (e) => e.date === fmtISO(dayDate)
                  );

                  // cálculo en píxeles: cada fila son 30 min y h-14 = 56px
                  const calcPos = (e: { start: string; end: string }) => {
                    const toMin = (hhmm: string) => {
                      const [h, m] = hhmm.split(":").map(Number);
                      return h * 60 + m;
                    };

                    const start = toMin(e.start);
                    const end = toMin(e.end);

                    const startDayMin = 8 * 60; // 08:00
                    const minuteHeight = 56 / 30; // px por minuto

                    const topPx = (start - startDayMin) * minuteHeight;
                    const heightPx = (end - start) * minuteHeight;

                    return {
                      top: `${topPx}px`,
                      height: `${Math.max(heightPx, 20)}px`, // altura mínima
                    };
                  };

                  return (
                    <div key={dayIdx} className="relative">
                      {/* líneas de la grilla */}
                      {times.map((t, rowIdx) => (
                        <div
                          key={t}
                          className={`h-14 border-b border-l border-gray-300 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        />
                      ))}

                      {/* overlay de eventos del día */}
                      {eventosDelDia.map((e, i) => {
                        const { top, height } = calcPos(e);

                        return (
                          <button
                            key={i}
                            onClick={() => onOpenEvento(e)}
                            className="absolute left-2 right-2 z-10 rounded-md px-3 py-2 text-left text-xs text-white shadow focus:outline-none"
                            style={{
                              backgroundColor: "#0b43a8",
                              top,
                              height,
                            }}
                            title="Ver reserva"
                          >
                            <div className="font-medium">
                              {e.start} - {e.end}
                            </div>
                            <div>{e.persona}</div>
                            <div className="opacity-90">{e.area}</div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-700">
              <Legend color="#0b43a8" label="Reservada" />
              <Legend border label="Fuera de horario" />
              <Legend checkbox label="Disponible" />
            </div>
          </section>
        )}
        {activeTab === "mis" && (
          <ReservasHistorial
            eventos={eventos}
            onVerDetalle={onOpenEvento}
            onEliminar={handleDeleteReserva}
          />
        )}
      </main>

      {/* Modal DETALLE de reserva */}
      {showModal && modalEvento && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              Reserva – Sala {modalEvento.sala}
            </h3>
            <p className="mb-4 text-sm text-gray-500">Detalle de la reserva</p>

            <div className="space-y-2 text-sm">
              <Item label="Fecha">
                {formatFechaLarga(modalEvento.date)}
              </Item>
              <Item label="Horario">
                {modalEvento.start} – {modalEvento.end}
              </Item>
              <Item label="Solicitante">{modalEvento.persona}</Item>
              <Item label="Sector">{modalEvento.area}</Item>
              <Item label="Motivo">{modalEvento.motivo}</Item>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>

              <button
                className="rounded-md px-4 py-2 text-sm text-white hover:bg-[#0b43a8]/80"
                style={{ backgroundColor: "#0b43a8" }}
                onClick={() => {
                  setEditingEvento(modalEvento);
                  setShowModal(false);
                  setShowNewModal(true);
                }}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal NUEVA RESERVA */}
      <NewReservationModal
        isOpen={showNewModal}
        onClose={() => {
          setShowNewModal(false);
          setEditingEvento(null);
        }}
        onCreate={(data) => {
          const nuevo: EventoSinId = {
            sala: data.sala,
            date: data.date,
            start: data.start,
            end: data.end,
            persona: data.persona,
            area: data.area,
            motivo: data.motivo,
          };

          if (haySolape(nuevo as Evento, eventos, editingEvento)) {
            return "Ya existe una reserva en esa sala para un horario que se solapa.";
          }

          if (editingEvento) {
            (async () => {
              try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                  `http://localhost:3001/api/reservas/${editingEvento.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(nuevo),
                  }
                );

                if (!res.ok) {
                  const data = await res.json().catch(() => null);
                  alert(
                    (data && data.message) ||
                    `No se pudo actualizar la reserva (código ${res.status})`
                  );
                  return;
                }

                const actualizada: Evento = await res.json();

                setEventos((prev) =>
                  prev.map((ev) =>
                    ev.id === actualizada.id ? actualizada : ev
                  )
                );
              } catch (err) {
                console.error("Error de red al actualizar reserva:", err);
                alert("Error de red al actualizar la reserva");
              }
            })();
          } else {
            // Crear en el backend
            (async () => {
              try {

                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:3001/api/reservas", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(nuevo),
                });


                if (!res.ok) {
                  console.error("Error al crear reserva:", res.status, res.statusText);
                  return;
                }

                const creada: Evento = await res.json();
                // añadimos la reserva con id devuelto por el backend
                setEventos((prev) => [...prev, creada]);

                // ajustar sala y semana visible
                setSala(creada.sala);
                setViewStart(startOfWeek(new Date(creada.date)));
              } catch (err) {
                console.error("Error de red al crear reserva:", err);
              }
            })();
          }

          setEditingEvento(null);
          setShowNewModal(false);
        }}

        // valores iniciales según si estoy editando o creando
        initialSala={editingEvento?.sala ?? sala}
        initialNombre={editingEvento?.persona ?? ""}
        initialSector={editingEvento?.area ?? ""}
        initialMotivo={
          editingEvento?.motivo ??
          "Completar motivo de la reunión (Cliente, Capacitación, Otros) y aclarar si se necesita catering"
        }
      />
    </div>
  );
}

/* helpers UI */


const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const haySolape = (
  nuevo: Evento,
  eventos: Evento[],
  ignorar?: Evento | null
) => {
  const nuevoInicio = toMinutes(nuevo.start);
  const nuevoFin = toMinutes(nuevo.end);

  return eventos.some((ev) => {
    if (ignorar && ev === ignorar) return false; // para edición, no me comparo conmigo mismo
    if (ev.sala !== nuevo.sala) return false;
    if (ev.date !== nuevo.date) return false;

    const evInicio = toMinutes(ev.start);
    const evFin = toMinutes(ev.end);

    // solapan si se pisan en algún tramo
    const seSolapan = nuevoInicio < evFin && nuevoFin > evInicio;
    return seSolapan;
  });
};

function TabButton({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${active ? "shadow-sm" : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
      style={active ? { backgroundColor: "#0b43a8", color: "#fff" } : {}}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

const formatFechaLarga = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day); // 👈 constructor local, sin UTC
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};


function Legend({
  color,
  label,
  border,
  checkbox,
}: {
  color?: string;
  label: string;
  border?: boolean;
  checkbox?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {checkbox ? (
        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
      ) : (
        <span
          className={`inline-block h-3 w-3 rounded ${border ? "border" : ""
            }`}
          style={color ? { backgroundColor: color } : {}}
        />
      )}
      <span>{label}</span>
    </div>
  );
}

function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="min-w-24 text-gray-500">{label}:</span>
      <span className="font-medium text-gray-800">{children}</span>
    </div>
  );
}

// Iconos simples en SVG
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 3v3m10-3v3M4 8h16M5 6h14a1 1 0 011 1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}


