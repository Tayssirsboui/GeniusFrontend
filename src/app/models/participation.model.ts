import { Evenement } from "./evenement.model";
import { StatutParticipation } from "./statut-participation.enum";


export class Participation {
    id!: number;
    dateInscription: Date = new Date(); 
    statut!: StatutParticipation;
    evenement!: Evenement; //  relation : participation liée à un événement
  }