import React, { useMemo, useState } from "react";

export type NewReservationData = {
  sala: "A" | "B";
  date: string;   // yyyy-mm-dd
  start: string;  // HH:mm
  end: string;    // HH:mm
  persona: string;
  area: string;
  motivo: string;
};

type NewReservationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewReservationData) => void;
  /** sala seleccionada actualmente en el calendario (para pre-seleccionar) */
  initialSala?: "A" | "B";
  /** nombre por defecto (ej: Administrador Sistema) */
  initialNombre?: string;
  /** sector por defecto (ej: IT) */
  initialSector?: string;
  initialMotivo?: string;
};

const NewReservationModal: React.FC<NewReservationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialSala = "A",
  initialNombre = "Administrador Sistema",
  initialSector = "IT",
  initialMotivo = "",
}) => {
  // si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  const todayISO = new Date().toISOString().slice(0, 10);

  // opciones de horario 08:00–20:00 cada 30'
  const horaOptions = useMemo(() => {
    const out: string[] = [];
    for (let h = 8; h <= 20; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`);
      if (h !== 20) out.push(`${String(h).padStart(2, "0")}:30`);
    }
    return out;
  }, []);

  const [sala, setSala] = useState<"A" | "B">(initialSala);
  const [nombre, setNombre] = useState(initialNombre);
  const [sector, setSector] = useState(initialSector);
  const [fecha, setFecha] = useState(todayISO);
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin,   setHoraFin]   = useState("10:00");
  const [motivo, setMotivo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({
  sala: "",
  nombre: "",
  sector: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  });

  const validate = () => {
  const newErrors = {
  sala: "",
  nombre: "",
  sector: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
};

if (!sala) newErrors.sala = "Seleccione una sala.";
if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
if (!sector.trim()) newErrors.sector = "El sector es obligatorio.";
if (!fecha) newErrors.fecha = "Seleccione una fecha.";
if (!horaInicio) newErrors.horaInicio = "Seleccione un horario de inicio.";
if (!horaFin) {newErrors.horaFin = "Seleccione un horario de fin."} else if (horaInicio && horaFin <= horaInicio) {
  newErrors.horaFin = "La hora de fin debe ser mayor que la hora de inicio.";
}
if (fecha < todayISO) newErrors.fecha = "La fecha no puede ser anterior a hoy.";


setErrors(newErrors);

return !(
  newErrors.sala ||
  newErrors.nombre ||
  newErrors.sector ||
  newErrors.fecha ||
  newErrors.horaInicio ||
  newErrors.horaFin
);
  }
  

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  setErrorMsg("");   // limpia solapamiento
  setErrors({
  sala: "",
  nombre: "",
  sector: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  });     // limpia errores de campos

  if (!validate()) {
    return; // NO cerramos modal
  }

  const result = onCreate({
    sala,
    date: fecha,
    start: horaInicio,
    end: horaFin,
    persona: nombre,
    area: sector,
    motivo: motivo || "Reserva de sala",
  });

  if (typeof result === "string") {
    setErrorMsg(result);
    return;
  }

  onClose();
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800">Nueva Reserva</h3>
        <p className="mb-4 text-sm text-gray-500">
          Complete los datos para crear una nueva reserva
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sala *
            </label>
            <select
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              value={sala}
              onChange={(e) => setSala(e.target.value as "A" | "B")}
            >
              <option value="A">Grande</option>
              <option value="B">Chica</option>
            </select>
            {errors.sala && <p className="text-red-600 text-sm">{errors.sala}</p>}
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo *
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre}</p>}
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sector *
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
            {errors.sector && <p className="text-red-600 text-sm">{errors.sector}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
              value={fecha}
              min={todayISO}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errors.fecha && <p className="text-red-600 text-sm">{errors.fecha}</p>}
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora Inicio *
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              >
                {horaOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            {errors.horaInicio && <p className="text-red-600 text-sm">{errors.horaInicio}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora Fin *
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              >
                {horaOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            {errors.horaFin && <p className="text-red-600 text-sm">{errors.horaFin}</p>}
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400"
              rows={3}
              placeholder={initialMotivo}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="mt-6 flex justify-end gap-3">
            {errorMsg && (
                <p className="text-red-600 text-sm font-medium">
                    {errorMsg}
            </p>
            )}
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-200"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-azul rounded-md px-4 py-2 text-sm text-white"
            >
              Crear Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReservationModal;
