import { useState } from "react";
import { useListVehicles } from "@workspace/api-client-react";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleModal } from "@/components/vehicle-modal";
import { FaqSection } from "@/components/faq-section";
import { HeroVideo } from "@/components/hero-video";
import { Vehicle } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Gauge,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  heroContent,
  highlights,
  qualitySection,
  services,
  servicesIntro,
  siteConfig,
} from "@/lib/site-content";

const highlightIcons = [ShieldCheck, Gauge, User, Tag];
const serviceIcons = [Plane, Gauge, Sparkles, User];

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();

  const { data: featuredVehicles, isLoading } = useListVehicles({});

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setLocation("/flota");
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url("${heroContent.poster}")` }}
        />
        <div className="absolute inset-0 puffin-hero-overlay" />

        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                {heroContent.eyebrow}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight uppercase">
                {heroContent.title}
              </h1>
              <p className="text-white/75 text-lg mt-6 max-w-xl leading-relaxed">
                {heroContent.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Button
                  asChild
                  className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wide px-8 h-12"
                >
                  <Link href="/flota">
                    {heroContent.ctaFleet}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white font-semibold uppercase tracking-wide px-8 h-12"
                >
                  <Link href="/contacto">{heroContent.ctaQuote}</Link>
                </Button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <HeroVideo className="w-full h-auto object-cover aspect-[4/3]" />
              </div>
              <p className="text-white/50 text-xs mt-3 text-center uppercase tracking-wider">
                <a
                  href={heroContent.instagramReel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {heroContent.videoCaption}
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 w-full max-w-5xl bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Lugar de recogida"
                className="pl-12 h-14 border-0 focus-visible:ring-0 shadow-none text-foreground text-base rounded-xl"
              />
            </div>
            <div className="hidden md:block w-px bg-border my-2" />
            <div className="flex-1 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 justify-start text-left font-normal text-base rounded-xl",
                      !pickupDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {pickupDate ? format(pickupDate, "dd MMM", { locale: es }) : "Recogida"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 justify-start text-left font-normal text-base rounded-xl",
                      !dropoffDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {dropoffDate ? format(dropoffDate, "dd MMM", { locale: es }) : "Entrega"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dropoffDate} onSelect={setDropoffDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              onClick={handleSearch}
              className="h-14 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wide"
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#0f1d3d] border-t border-white/10 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map(({ title, desc }, index) => {
            const Icon = highlightIcons[index];
            return (
              <div key={title} className="text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">{title}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              ¿Por qué elegirnos?
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-primary mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{servicesIntro}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map(({ title, desc }, index) => {
              const Icon = serviceIcons[index];
              return (
                <div
                  key={title}
                  className="rounded-2xl border bg-background p-8 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Catálogo Destacado
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-primary mb-4">
              Nuestros Vehículos Disponibles
            </h2>
            <p className="text-muted-foreground text-lg">
              Nuestra selección premium para tu próximo viaje en Florida.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVehicles?.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onClick={handleVehicleClick}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              asChild
              className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wide px-10 h-12"
            >
              <Link href="/flota">
                Ver Catálogo Completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-6">
                {qualitySection.title}
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                {qualitySection.description}
              </p>
              <ul className="space-y-3 mb-8">
                {qualitySection.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-8 lg:p-10">
              <p className="text-lg leading-relaxed text-primary-foreground/90">
                {qualitySection.cta}
              </p>
              <Button
                asChild
                className="mt-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wide px-8 h-12"
              >
                <Link href="/contacto">Reservar Ahora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <FaqSection />
        </div>
      </section>

      <VehicleModal
        vehicle={selectedVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
