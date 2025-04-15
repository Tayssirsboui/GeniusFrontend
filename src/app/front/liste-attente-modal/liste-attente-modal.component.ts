import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evenement } from 'src/app/models/evenement.model';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ListeAttenteService } from 'src/app/services/liste-attente.service.ts.service';

@Component({
  selector: 'app-liste-attente-modal',
  templateUrl: './liste-attente-modal.component.html',
  styleUrls: ['./liste-attente-modal.component.css']
})
export class ListeAttenteModalComponent implements OnInit {
  @Input() evenement!: Evenement;
  form!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private listeAttenteService: ListeAttenteService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  envoyerDemande(): void {
    if (this.form.invalid) return;

    const dto = {
      email: this.form.value.email,
      evenement: this.evenement  // ⚠️ L'objet complet est attendu par Spring
    };

    this.listeAttenteService.inscrire(dto).subscribe({
      next: () => {
        alert("✅ Vous avez été inscrit à la liste d'attente !");
        this.activeModal.close();
      },
      error: () => {
        alert("❌ Une erreur est survenue.");
      }
    });
  }
}
