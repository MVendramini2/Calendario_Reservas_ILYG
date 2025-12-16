import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface NavCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType; // Tipo para componentes icono (como los de Lucide)
  to: string;
  isExternal?: boolean; // Opcional: para links que salen de la app
}

const NavCard: React.FC<NavCardProps> = ({ title, subtitle, icon: Icon, to, isExternal }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isExternal) {
      window.open(to, '_blank'); 
    } else { 
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full bg-white rounded-2xl p-4 flex items-center justify-between 
                 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer mb-4"
    >
      {/* Contenedor Izquierdo: Icono + Texto */}
      <div className="flex items-center gap-4 text-left">
        {/* Cuadrado azul del icono */}
        <div className="bg-[#1e40af] p-3 rounded-xl flex items-center justify-center shadow-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Textos */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900 font-bold text-lg leading-tight">
              {title}
            </h3>
            {/* Muestra icono de link externo solo si es true */}
            {isExternal && <ExternalLink className="w-3 h-3 text-gray-400" />}
          </div>
          <p className="text-gray-500 text-sm font-medium mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Flecha a la derecha */}
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#1e40af] transition-colors" />
    </button>
  );
};

export default NavCard;