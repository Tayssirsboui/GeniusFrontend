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
  listPosts!:Post[] 
  userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté
  message: string = '';
  level:string='';
  selectedPostId: number | null = null;

  showLView: { [key: number]: boolean } = {};
  searchTerm: string = '';

  constructor(private bs :BlogService,private toastr: ToastrService){}

  get filteredPosts(): Post[] {
    return this.listPosts.filter(p => p.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  
toggleView(id: number) {
  this.showLView[id] = !this.showLView[id];
}
ngOnInit(){
  this.toastr.info("Toastr is working!", "Info");
  this.bs.getPosts().subscribe((data) =>this.listPosts = data);
}
confirmDelete(id: number) {
  this.selectedPostId = id;  // Stocker l'ID du post à supprimer
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
  modal.show();  // Afficher le modal
}

// ✅ Cette méthode doit être dehors, ici à la suite :
deletePost() {
  this.message = '';
  this.level = 'success';

  if (this.selectedPostId !== null) {
    this.bs.DeletePost(this.selectedPostId).subscribe({
      next: () => {
        this.ngOnInit();  // Rafraîchir la liste des posts
        const modalElement = document.getElementById('confirmDeleteModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();  // Fermer le modal après la suppression
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


// supp(id:number){
//   this.bs.DeletePost(id).subscribe(()=>this.ngOnInit())

// }
scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  }); }
}


