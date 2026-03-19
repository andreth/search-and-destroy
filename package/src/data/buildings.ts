/**
 * Catalogue des bâtiments de la base.
 * Débloqués en fonction du niveau du joueur (Level.levelNumber).
 * production + mapX/mapY mockés (logique backend à venir).
 */
export interface BuildingDef {
  id: string
  code: string
  name: string
  description: string
  levelRequired: number
  /** Mock: production affichée (ex. "+120 Acier/h") */
  production: string
  /** Position sur la map radar (pourcent 0–100) */
  mapX: number
  mapY: number
}

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'hq',
    code: 'QG',
    name: 'Quartier général',
    description: 'Centre de commandement. Débloque la base.',
    levelRequired: 1,
    production: '—',
    mapX: 50,
    mapY: 45
  },
  {
    id: 'barracks',
    code: 'CAS',
    name: 'Caserne',
    description: 'Recrutement et entraînement des troupes.',
    levelRequired: 2,
    production: '+80 Infanterie/j',
    mapX: 28,
    mapY: 55
  },
  {
    id: 'research',
    code: 'R&D',
    name: 'Centre de recherche',
    description: 'Développement des technologies et armements.',
    levelRequired: 3,
    production: '+1 Tech/j',
    mapX: 72,
    mapY: 35
  },
  {
    id: 'refinery',
    code: 'RAF',
    name: 'Raffinerie',
    description: 'Production de carburant et ressources.',
    levelRequired: 4,
    production: '+120 Carburant/h',
    mapX: 35,
    mapY: 28
  },
  {
    id: 'tank-hangar',
    code: 'HBT',
    name: 'Hangar blindés',
    description: 'Maintenance et déploiement des véhicules blindés.',
    levelRequired: 5,
    production: '+40 Blindés/j',
    mapX: 22,
    mapY: 72
  },
  {
    id: 'air-hangar',
    code: 'HAV',
    name: 'Hangar aérien',
    description: 'Stationnement et préparation des appareils.',
    levelRequired: 6,
    production: '+24 Appareils/j',
    mapX: 78,
    mapY: 68
  },
  {
    id: 'depot',
    code: 'DEP',
    name: 'Dépôt de munitions',
    description: 'Stockage et approvisionnement en munitions.',
    levelRequired: 7,
    production: '+200 Munitions/h',
    mapX: 55,
    mapY: 78
  },
  {
    id: 'control-tower',
    code: 'TCO',
    name: 'Tour de contrôle',
    description: 'Coordination tactique et surveillance du secteur.',
    levelRequired: 8,
    production: 'Détection +30%',
    mapX: 50,
    mapY: 18
  }
]
