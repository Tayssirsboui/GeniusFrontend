
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { CategorieService } from 'src/app/front/services/service-categories.service';
@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.css']
})
export class EditCategorieComponent implements OnInit {



  form!: FormGroup;
  categoryId!: number;
  selectedFile: File | null = null;
  existingImage: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  message: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.extractCategoryId();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      nomCategorie: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      domaine: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private extractCategoryId(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.categoryId = parseInt(idParam, 10);
        if (!isNaN(this.categoryId)) {
          this.loadCategoryData();
        }
      } else {
        this.extractCategoryIdFromParams();
      }
    });
  }

  private extractCategoryIdFromParams(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.categoryId = parseInt(idParam, 10);
        if (!isNaN(this.categoryId)) {
          this.loadCategoryData();
        }
      }
    });
  }

  private loadCategoryData(): void {
    if (!this.categoryId) return;

    this.categorieService.getCategoryById(this.categoryId).subscribe(
      (category) => {
        if (category) {
          this.form.patchValue({
            nomCategorie: category.nomCategorie,
            description: category.description,
            domaine: category.domaine
          });

          this.existingImage = category.image ? `data:image/png;base64,${category.image}` : null;
          this.imagePreview = this.existingImage; // Initialisation de l'image
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement de la catégorie:', error);
        this.isLoading = false;
      }
    );
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Mise à jour immédiate de l'aperçu
      };
      reader.readAsDataURL(file);
  
      this.message = `Image "${file.name}" sélectionnée avec succès.`;
    } else {
      this.imagePreview = this.existingImage; // Remet l'ancienne image si aucun fichier n'est sélectionné
    }
  }
  
  
  onSubmit(): void {
    if (this.form.invalid) {
      console.error('Formulaire invalide');
      return;
    }

    const formData = new FormData();
    formData.append('idCategorie', this.categoryId.toString());
    formData.append('nomCategorie', this.form.value.nomCategorie);
    formData.append('description', this.form.value.description);
    formData.append('domaine', this.form.value.domaine);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categorieService.updateCategory(this.categoryId, formData).subscribe(
      () => {
        alert('Catégorie modifiée avec succès !');
        
        // Rediriger vers le composant d'affichage
        this.router.navigate(['/affichage-categorie'], { queryParams: { id: this.categoryId } });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
      }
    );
  }
}
