import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RessourceService } from 'src/app/front/services/ressource.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajout-ressources',
  templateUrl: './ajout-ressources.component.html',
  styleUrls: ['./ajout-ressources.component.css']
})
export class AjoutRessourcesComponent implements OnInit {
  form: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isPayantSelected = false;
  selectedOption: string = 'all';
  statusOptions: string[] = ['LIEN', 'ARTICLE', 'PDF', 'IMAGE'];
  message: string = '';
  idCategorie: number | null = null;
  fileNames: string[] = [];

  constructor(private fb: FormBuilder, private ressourceService: RessourceService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      type: [''],
      lien: [''],
      article: [''],
      file: [null],
      montant: [{ value: '', disabled: true }, [Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idCategorie');
    if (id) {
      this.idCategorie = +id;
      console.log('idCategorie récupéré :', this.idCategorie);
    } else {
      console.error('idCategorie est manquant dans l\'URL.');
    }
  }

  onTypeChange(type: string): void {
    this.isPayantSelected = type === 'Payant';
    if (this.isPayantSelected) {
      this.form.get('montant')?.enable();
    } else {
      this.form.get('montant')?.disable();
      this.form.get('montant')?.reset();
    }
  }

  onOptionChange(option: string): void {
    this.selectedOption = option;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.fileNames = files.map(file => file.name); // Stocker les noms des fichiers pour affichage
      this.form.patchValue({ file: files }); // Mettre à jour le formulaire avec les fichiers
      this.form.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('titre', this.form.get('nom')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('status', this.isPayantSelected ? 'Payant' : 'Gratuit');
      if (this.isPayantSelected) {
        formData.append('prix', this.form.get('montant')?.value || '0');
      }
      if (this.selectedOption === 'LIEN') {
        formData.append('lien', this.form.get('lien')?.value || '');
      } else if (this.selectedOption === 'ARTICLE') {
        formData.append('text', this.form.get('article')?.value || '');
      }

      const files = this.form.get('file')?.value;
      if (files) {
        for (const file of files) {
          formData.append('files', file);
        }
      }

      this.ressourceService.addRessource(formData, this.idCategorie).subscribe(
        (response) => {
          console.log('Ressource ajoutée avec succès :', response);
          this.message = 'Ajout réussi !';
          this.form.reset();
          this.imagePreview = null;
          this.fileNames = [];
          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Réinitialiser le champ file
          }
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la ressource :', error);
          this.message = 'Une erreur est survenue. Veuillez réessayer.';
        }
      );
    } else {
      this.message = 'Veuillez corriger les erreurs du formulaire.';
    }
  }
}