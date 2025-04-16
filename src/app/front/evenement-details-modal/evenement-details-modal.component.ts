import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ParticipationService } from 'src/app/services/participation.service';

@Component({
  selector: 'app-evenement-details-modal',
  templateUrl: './evenement-details-modal.component.html',
})
export class EvenementDetailsModalComponent {
  @Input() titre!: string;
  @Input() lieu!: string;
  @Input() start!: string;
  @Input() end!: string;
  @Input() participationId!: number;
  @Input() calendarEventId!: string; // ID FullCalendar pour suppression directe

  constructor(
    public activeModal: NgbActiveModal,
    private participationService: ParticipationService
  ) {}

  supprimerParticipation(): void {
    if (confirm('Confirmer la suppression de votre participation ?')) {
      this.participationService.annuler(this.participationId).subscribe({
        next: () => {
          // On ferme le modal et retourne un objet avec info de suppression
          this.activeModal.close({
            deleted: true,
            calendarEventId: this.calendarEventId
          });
        },
        error: err => {
          alert("❌ Erreur lors de la suppression !");
          console.error(err);
        }
      });
    }
  }
}
