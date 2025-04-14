import { Evenement } from "./evenement.model";
import { StatutParticipation } from "./statut-participation.enum";



  export interface Participation {
    id?: number; // optionnel à la création
    dateInscription: string; // ISO string
    statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
    evenement: {
      id: number;
    };
  }
  