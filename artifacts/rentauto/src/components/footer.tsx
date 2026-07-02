import { Link } from "wouter";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Car className="h-6 w-6" />
              <span>RentAuto</span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              La plataforma premium de alquiler de vehículos en América Latina. Confianza, claridad y rapidez.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link href="/flota" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Nuestra Flota</Link></li>
              <li><Link href="/como-funciona" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Cómo Funciona</Link></li>
              <li><Link href="/contacto" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/admin" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Portal Admin</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-white transition-colors">Políticas de Seguro</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-sm text-primary-foreground/70">Av. Reforma 1234, CDMX</li>
              <li className="text-sm text-primary-foreground/70">+52 (55) 1234-5678</li>
              <li className="text-sm text-primary-foreground/70">contacto@rentauto.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          &copy; {new Date().getFullYear()} RentAuto. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
