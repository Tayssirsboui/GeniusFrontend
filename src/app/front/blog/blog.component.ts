import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  activeCardId: number | null = null;
  listPosts!: Post[];
  userId: number = 1;
  message: string = '';
  level: string = '';
  selectedPostId: number | null = null;
  showLView: { [key: number]: boolean } = {};

  // Pagination properties
  currentPage: number = 1;
  postsPerPage: number = 4;
  totalPosts: number = 0;
  totalPages: number = 0;
  paginatedPosts: Post[] = [];
  previousSearchTerm: string = '';


  constructor(private bs: BlogService, private toastr: ToastrService) {}
  //methodes pour calculer le nombre de commentaires
  loadCommentsCount(): void {
    this.paginatedPosts.forEach(post => {
      this.bs.getcommentsByPostId(post.id).subscribe(comments => {
        post.commentsCount = comments.length;
      });
    });}
   // Modifiez la fonction onSearchChange comme ceci
   onSearchChange() {
    // Ne réinitialisez la page que si le terme de recherche a vraiment changé
    if (this.searchTerm.trim() !== this.previousSearchTerm) {
      this.currentPage = 1;
      this.previousSearchTerm = this.searchTerm.trim();
    }
    this.updatePaginatedPosts();
  }

  // Ajoutez cette propriété pour suivre le terme de recherche précédent
  ngOnInit() {
    this.toastr.info("Toastr is working!", "Info");
    this.loadPosts();
  }

  loadPosts() {
    this.bs.getPosts().subscribe((data) => {
      this.listPosts = data;
      this.totalPosts = data.length;
      this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
      this.updatePaginatedPosts();
      this.loadCommentsCount();
      
    });
  }

   // Modifiez votre getter filteredPosts comme ceci
   get filteredPosts(): Post[] {
    if (!this.searchTerm) {
      return this.listPosts || [];
    }
    return (this.listPosts || []).filter(p => 
      p.title && p.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

//pagiantion 
private _searchTerm: string = '';

get searchTerm(): string {
  return this._searchTerm;
}

set searchTerm(value: string) {
  if (this._searchTerm !== value) {
    this._searchTerm = value;
    this.currentPage = 1; // Réinitialise seulement quand le terme change
    this.updatePaginatedPosts();
  }
}
  // Modifiez updatePaginatedPosts pour une meilleure stabilité
  updatePaginatedPosts() {
    const filtered = this.filteredPosts;
    this.totalPosts = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalPosts / this.postsPerPage));
    
    // Gardez la page actuelle si possible, sinon ajustez
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    this.paginatedPosts = filtered.slice(startIndex, startIndex + this.postsPerPage);
    this.loadCommentsCount();
  }
  

  // Pagination navigation methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  // Other existing methods...
  toggleCard(id: number) {
    this.activeCardId = this.activeCardId === id ? null : id;
  }

  toggleView(id: number) {
    this.showLView[id] = !this.showLView[id];
  }

  confirmDelete(id: number) {
    this.selectedPostId = id;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  deletePost() {
    this.message = '';
    this.level = 'success';

    if (this.selectedPostId !== null) {
      this.bs.DeletePost(this.selectedPostId).subscribe({
        next: () => {
          this.loadPosts();
          const modalElement = document.getElementById('confirmDeleteModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }
          this.toastr.success('Le post a été supprimé avec succès', 'Succès');
        },
        error: (error) => {
          this.level = 'danger';
          this.message = 'Error deleting post!';
          this.toastr.error(this.message, 'Erreur');
        }
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}