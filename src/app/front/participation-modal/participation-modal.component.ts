import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Participation } from 'src/app/models/participation.model';
import { StatutParticipation } from 'src/app/models/statut-participation.enum';
import { Evenement } from 'src/app/models/evenement.model';
import { ParticipationService } from 'src/app/services/participation.service';

@Component({
  selector: 'app-participation-modal',
  templateUrl: './participation-modal.component.html'
})
export class ParticipationModalComponent {
  @Input() evenement!: Evenement;

  constructor(
    public activeModal: NgbActiveModal,
    private participationService: ParticipationService
  ) {}

  private formatLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  confirmerParticipation() {
    const participation: Participation = {
      dateInscription: this.formatLocalDateTime(new Date()), // ✅ format: yyyy-MM-dd'T'HH:mm
      statut: StatutParticipation.EN_ATTENTE,
      evenement: { id: this.evenement.id } as Evenement
    };

    this.participationService.ajouter(participation).subscribe({
      next: (data) => {
        console.log('✅ Participation enregistrée :', data);
        alert('Participation réussie 🎉');
        this.activeModal.close();
      },
      error: (err) => {
        console.error('❌ Erreur complète Angular :', err);
        alert("Erreur lors de l'inscription ❌");
      }
    });
  }
}
