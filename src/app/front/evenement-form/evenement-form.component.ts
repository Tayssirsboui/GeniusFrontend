import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Evenement } from 'src/app/models/evenement.model';
import { StatutEvenement } from 'src/app/models/statut-evenement.enum';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-evenement-form',
  templateUrl: './evenement-form.component.html',
  styleUrls: ['./evenement-form.component.css']
})
export class EvenementFormComponent implements OnInit {
  form!: FormGroup;
  imageFile!: File;
  statutOptions = Object.values(StatutEvenement);
  imagePreview: string | null = null;
  
 

  // Champs dynamiques pour le HTML
  fields = [
    { name: 'titre', label: 'Titre', type: 'text', placeholder: 'Titre de l\'événement', required: true, error: 'Le titre est obligatoire' },
    { name: 'dateDebut', label: 'Date de début', type: 'datetime-local', required: true, error: 'La date de début est obligatoire' },
    { name: 'lieu', label: 'Lieu', type: 'text', placeholder: 'Lieu de l\'événement', required: true, error: 'Le lieu est obligatoire' },
    { name: 'dateFin', label: 'Date de fin', type: 'datetime-local', required: true, error: 'La date de fin est obligatoire' },
    { name: 'categorie', label: 'Catégorie', type: 'text', placeholder: 'Catégorie', required: true, error: 'La catégorie est obligatoire' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description', required: true, error: 'La description est obligatoire' },
    { name: 'nbMaxParticipants', label: 'Nombre max de participants', type: 'number', placeholder: 'Ex : 100', required: true, error: 'Ce champ est requis et doit être > 0' },
  

  ];
  constructor(
    private fb: FormBuilder,
    private evenementService: EvenementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['',Validators.required],
      lieu: ['',Validators.required],
      categorie: ['',Validators.required],
      nbMaxParticipants: [0, [Validators.required, Validators.min(1)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
     
    });
  }
  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    }
  }
  private formatLocalDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}




  submit(): void {
    if (this.form.invalid) return;
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
  });
    
    formData.append('statut', 'A_VENIR');
    formData.append('dateCreation', this.formatLocalDateTime(new Date()));
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
    this.evenementService.createWithFormData(formData).subscribe({
      next: () => {
        alert('Événement créé avec succès 🎉');
        this.form.reset();
        this.router.navigate(['/evenement']);
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la création');
      }
    });
  }

  

}
