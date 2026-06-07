import React from 'react';
import { Hero } from '../components/Hero';
import { Property } from '../components/PropertyList';
import { motion } from 'motion/react';

interface HomeProps {
  properties: Property[];
}

export const Home: React.FC<HomeProps> = ({ properties }) => {
  return (
    <>
      <Hero />
      
      {/* Introduction Section & Justo a la Medida */}
      <section className="py-24 bg-bg-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <span className="text-brand-dark uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Enfoque Personalizado</span>
              <h2 className="text-4xl md:text-6xl font-serif text-text-dark leading-none mb-8 italic">
                Justo a <span className="not-italic text-brand-dark">la Medida</span>
              </h2>
              <p className="text-text-dark text-lg leading-relaxed font-light mb-8">
                RT Renta es una inmobiliaria especializada en la compra – venta de bienes inmuebles urbanos, con un enfoque de trabajo <strong className="font-semibold">“Justo a la Medida”</strong> de sus clientes, tanto propietarios como inversores.
              </p>
              
              <div className="space-y-6 border-t border-line-light pt-8">
                <div>
                  <h4 className="font-serif text-xl text-text-dark mb-2">Presencia en Barcelona con alcance Global</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Nuestro ámbito de actuación es tanto nacional como internacional, dando respuesta individualizada a cualquier petición de nuestros clientes desde nuestra oficina en Barcelona capital, manteniendo una amplia red de colaboradores y especialistas en los diferentes proyectos de actuación.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card-dark p-12 relative border border-line"
            >
              <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-brand/25"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-brand/25"></div>
              
              <span className="text-brand text-[10px] uppercase tracking-widest font-bold mb-3 block">Mitigación del Riesgo</span>
              <h3 className="text-2xl font-serif text-white mb-6 italic">Diversificación de Inversión</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                RT Renta ofrece a sus clientes una alternativa en la diversificación del riesgo de inversión, ofreciéndoles nuevas oportunidades atractivas en el sector del Real Estate.
              </p>
              
              <p className="text-text-muted text-xs leading-relaxed mb-6 italic">
                La rentabilidad, el riesgo asumido por perfil de inversor y el horizonte como plazo de inversión son nuestras variables críticas de gestión.
              </p>

              <div className="bg-bg-dark border-l-2 border-brand p-4 mt-6">
                <span className="text-white text-[10px] uppercase tracking-widest font-bold block mb-1">Mandatos de Compra</span>
                <p className="text-text-muted text-xs leading-relaxed">
                  Según el perfil del cliente, ofrecemos proyectos o búsquedas selectivas de aquellos activos inmobiliarios que nos son demandados bajo requerimientos exclusivos.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trajectory & Team Origins Section */}
      <section className="py-24 bg-white border-y border-line-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="text-brand-dark uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block underline underline-offset-8">Desde el año 2004</span>
              <h2 className="text-3xl md:text-5xl font-serif text-text-dark leading-tight italic">
                Nuestros Orígenes <span className="not-italic text-brand-dark">& Valores</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mt-6">
                En RT Renta estamos orientados al servicio de nuestros clientes en la búsqueda de soluciones en el ámbito del sector inmobiliario desde el año 2004.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mt-4">
                El equipo directivo de RT Renta tiene sus orígenes profesionales en la consultoría empresarial, inmobiliaria, industrial y financiera, aportando una amplia experiencia multisectorial que garantiza un asesoramiento de alta dirección.
              </p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border border-line-light p-8 rounded-sm hover:shadow-md transition-shadow">
                <div className="text-brand-dark font-serif text-4xl mb-4">01</div>
                <h4 className="font-serif text-lg text-text-dark mb-2">Consultoría Empresarial</h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  Metodologías analíticas rigurosas heredadas de la consultoría corporativa y estratégica de alto nivel.
                </p>
              </div>
              <div className="border border-line-light p-8 rounded-sm hover:shadow-md transition-shadow">
                <div className="text-brand-dark font-serif text-4xl mb-4">02</div>
                <h4 className="font-serif text-lg text-text-dark mb-2">Visión Industrial</h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  Comprensión y viabilidad a fondo de naves industriales, desarrollos logísticos y gestión de suelo urbano.
                </p>
              </div>
              <div className="border border-line-light p-8 rounded-sm hover:shadow-md transition-shadow">
                <div className="text-brand-dark font-serif text-4xl mb-4">03</div>
                <h4 className="font-serif text-lg text-text-dark mb-2">Estructuramiento Financiero</h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  Modelado financiero para optimizar la rentabilidad de las inversiones inmobiliarias bajo diferentes perfiles de rentabilidad/riesgo.
                </p>
              </div>
              <div className="border border-line-light p-8 rounded-sm hover:shadow-md transition-shadow">
                <div className="text-brand-dark font-serif text-4xl mb-4">04</div>
                <h4 className="font-serif text-lg text-text-dark mb-2">Asesoramiento Corporativo</h4>
                <p className="text-text-muted text-xs leading-relaxed">
                  Un sólido historial de asesoramiento, habiendo acompañado a un gran número de importantes empresas nacionales en sus estrategias de activos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Represents & Client Categories Section */}
      <section className="py-24 bg-card-dark border-b border-line">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block">Representación Premium</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white italic leading-tight">
              A quién <span className="text-brand not-italic">representamos</span>
            </h2>
            <p className="text-text-muted text-xs mt-4 leading-relaxed font-light">
              Nuestra firme discreción y relaciones nos han permitido posicionarnos como consultores de confianza para las organizaciones más exigentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-bg-dark border border-line p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-brand block mb-4 uppercase tracking-widest">Fondos de Inversión</span>
                <p className="text-text-muted text-sm leading-relaxed">
                  Asesoramiento estratégico e identificación de oportunidades de alto volumen adaptadas a sus mandatos específicos.
                </p>
              </div>
              <div className="w-10 h-[1px] bg-brand mt-6"></div>
            </div>
            
            <div className="bg-bg-dark border border-line p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-brand block mb-4 uppercase tracking-widest">Family Offices</span>
                <p className="text-text-muted text-sm leading-relaxed">
                  Gestión patrimonial enfocada en el largo plazo, la diversificación continua del riesgo y la preservación del capital.
                </p>
              </div>
              <div className="w-10 h-[1px] bg-brand mt-6"></div>
            </div>

            <div className="bg-bg-dark border border-line p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-brand block mb-4 uppercase tracking-widest">Clientes Privados & Propietarios</span>
                <p className="text-text-muted text-sm leading-relaxed">
                  Atención personalizada para propietarios e inversores privados exigentes bajo la premisa de exclusividad absoluta y trato "Off Market".
                </p>
              </div>
              <div className="w-10 h-[1px] bg-brand mt-6"></div>
            </div>
          </div>

          <div className="border border-line bg-bg-dark/50 p-8 rounded-sm">
             <p className="text-text-muted text-xs uppercase tracking-widest text-center mb-6">Amplio Catálogo de Tipologías de Activos en Gestión:</p>
             <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-serif text-white/90">
                <span>Hoteles & Resorts</span>
                <span className="text-brand">•</span>
                <span>Edificios Residenciales</span>
                <span className="text-brand">•</span>
                <span>Edificios de Oficinas</span>
                <span className="text-brand">•</span>
                <span>Inmuebles Singulares</span>
                <span className="text-brand">•</span>
                <span>Naves Industriales</span>
                <span className="text-brand">•</span>
                <span>Suelos Finalistas o Pendientes de Gestión</span>
             </div>
          </div>
        </div>
      </section>

      {/* Off-Market & Strategic Alliances */}
      <section className="py-24 bg-bg-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <span className="text-brand-dark uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block underline underline-offset-8">Exclusividad & Confidencialidad</span>
              <h2 className="text-3xl md:text-5xl font-serif text-text-dark leading-tight italic mb-6">
                Posicionamiento <span className="not-italic text-brand-dark">“Off Market”</span>
              </h2>
              <blockquote className="text-text-dark text-xl font-serif italic mb-6 border-l-2 border-brand-dark pl-6">
                “La mayoría de estos Activos los gestionamos dadas nuestras relaciones directas con la propiedad en una posición Off Market o de exclusividad.”
              </blockquote>
              <p className="text-text-muted text-sm leading-relaxed">
                Nuestros clientes propietarios depositan su confianza en nosotros sabiendo que sus activos no se publican en portales convencionales, manteniendo un proceso de desinversión discreto y eficiente, solo visible a inversores calificados.
              </p>
            </div>
            
            <div className="lg:col-span-6 bg-white border border-line-light p-10 shadow-sm">
              <span className="text-brand-dark uppercase tracking-widest text-[9px] font-bold block mb-2">Red de Alianzas Estratégicas</span>
              <h3 className="text-2xl font-serif text-text-dark mb-4">Relaciones Sólidas & Acuerdos</h3>
              <p className="text-text-muted text-xs leading-relaxed mb-6">
                Contamos con una amplia red de colaboradores y especialistas, manteniendo acuerdos firmados con distintos propietarios, agentes, banca privada, partners y colaboradores, por todo el territorio nacional e internacional.
              </p>
              <div className="p-4 bg-bg-light rounded-sm">
                 <p className="text-text-dark text-[11px] font-bold leading-relaxed">
                   ✔ Permite ofrecer a nuestro cliente un asesoramiento discrecional y personalizado en sus inversiones de principio a fin.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee or value keywords bar */}
      <section className="py-12 bg-bg-dark border-t border-line overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="font-serif text-2xl italic tracking-tight text-white">Estrategia</span>
          <span className="font-serif text-2xl italic tracking-tight text-white">Rigor</span>
          <span className="font-serif text-2xl italic tracking-tight text-white">Confidencialidad</span>
          <span className="font-serif text-2xl italic tracking-tight text-white">Excelencia</span>
          <span className="font-serif text-2xl italic tracking-tight text-white">Asesoramiento</span>
        </div>
      </section>

      {/* Commitment & Maximum Profitability */}
      <section className="py-28 bg-card-dark text-center border-y border-line overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none overflow-hidden flex items-center justify-center">
             <span className="text-[20vw] font-serif font-bold italic leading-none whitespace-nowrap text-white">RT RENTA</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <h3 className="text-3xl md:text-5xl font-serif text-white mb-8 italic">Compromiso con la Máxima Rentabilidad</h3>
           <p className="text-text-muted text-lg mb-12 font-light leading-relaxed max-w-2xl mx-auto">
             Optimización total. RT Renta se compromete en alcanzar la máxima rentabilidad del mercado optimizando todas sus operaciones con rigor técnico, agilidad y absoluta discreción.
           </p>
           <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col items-center">
                 <span className="text-brand text-4xl font-serif">2004</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-2">Fundación</span>
              </div>
              <div className="w-[1px] h-12 bg-line mx-4 hidden md:block"></div>
              <div className="flex flex-col items-center">
                 <span className="text-brand text-4xl font-serif">Barcelona</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-2">Sede Principal</span>
              </div>
              <div className="w-[1px] h-12 bg-line mx-4 hidden md:block"></div>
              <div className="flex flex-col items-center">
                 <span className="text-brand text-4xl font-serif">Off-Market</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-2">Adquisición Privada</span>
              </div>
           </div>
        </div>
      </section>
    </>
  );
};
