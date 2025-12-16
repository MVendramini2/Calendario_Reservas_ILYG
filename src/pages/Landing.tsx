import React from 'react';
import { Calendar, ClipboardClock, IdCardLanyard, Gift, FileUser } from 'lucide-react';
import NavCard from '../Componentes/NavCard';
import backgroundpc from '../assets/Background PC.png';
import logoilygclaro from '../assets/logoilygclaro.png';

const Landing: React.FC = () => {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundpc})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        
        {/* --- Encabezado --- */}
        <div className="flex flex-col items-center mb-10 text-center">
          {/* Círculo del icono principal */}
        <div className="mb-6 flex justify-center">
          <img
            src={logoilygclaro}
            alt="Logo ILYG Kudos International"
            className="w-48"
          />
        </div>
          
          <h1 className="text-white text-2xl md:text-3xl font-medium mb-2 tracking-wide">
            Portal de Colaboradores
          </h1>
          <p className="text-blue-100/80 text-sm md:text-base font-light">
            Accede a todas nuestras plataformas en un solo lugar
          </p>
        </div>

        {/* --- Lista de Tarjetas --- */}
        <div className="w-full space-y-4">
          
          <NavCard 
            title="Calendario de Reservas" 
            subtitle="Reserva salas grande y chica para tus reuniones"
            icon={Calendar} 
            to="/login" 
          />

          <NavCard 
            title="Time Report" 
            subtitle="Registro y control de horarios"
            icon={ClipboardClock} 
            to="http://172.16.0.1/TIME/index.php" 
            isExternal={true}
          />

          <NavCard 
            title="Naaloo" 
            subtitle="Tu portal del colaborador"
            icon={IdCardLanyard} 
            to="https://app.naaloo.com/user" 
            isExternal={true}
          />

            <NavCard 
            title="Club de Beneficios" 
            subtitle="Disfruta los beneficios exclusivos para empleados ILYG"
            icon={Gift} 
            to="https://clubdebeneficios.com/" 
            isExternal={true}
          />

          <NavCard 
            title="Hiring Room" 
            subtitle="Programa de Referidos"
            icon={FileUser} 
            to="https://ilyg.hiringroom.com/" 
            isExternal={true}
          />

        </div>
      </div>
    </div>
  );
};

export default Landing;