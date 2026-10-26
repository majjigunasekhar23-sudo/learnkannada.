import { Coffee, MapPin, ShoppingCart } from 'lucide-react';
import type { ComponentType } from 'react';
import AutoIcon from './AutoIcon';

const ICONS: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  auto: AutoIcon,
  market: ShoppingCart,
  cafe: Coffee,
  directions: MapPin,
};

export default function SituationIcon({
  name,
  className = 'w-7 h-7',
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? MapPin;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
