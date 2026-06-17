// Единый набор line-иконок (lucide) вместо эмодзи — для профессионального вида.
import {
  Sofa,
  BedDouble,
  DoorOpen,
  Utensils,
  Trees,
  Briefcase,
  Bath,
  Baby,
  Tv,
  Home,
  type LucideIcon,
} from 'lucide-react'

export const categoryIcon: Record<string, LucideIcon> = {
  mebel: Sofa,
  tekhnika: Tv,
  'tovary-doma': Home,
  'tovary-deti': Baby,
}

export const roomIcon: Record<string, LucideIcon> = {
  gostinaya: Sofa,
  spalnya: BedDouble,
  detskaya: Baby,
  kuhnya: Utensils,
  prihozhaya: DoorOpen,
  'dom-sad': Trees,
  ofis: Briefcase,
  vannaya: Bath,
}
