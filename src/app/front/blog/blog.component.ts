import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  listPosts!:Post[] 
  userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté
  
  selectedPostId: number | null = null;

  showLView: { [key: number]: boolean } = {};
  searchTerm: string = '';

  constructor(private bs :BlogService){}


toggleView(id: number) {
  this.showLView[id] = !this.showLView[id];
}
ngOnInit(){
  this.bs.getPosts().subscribe((data) =>this.listPosts = data);
}
confirmDelete(id: number) {
  this.selectedPostId = id;  // Stocker l'ID du post à supprimer
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
  modal.show();  // Afficher le modal
}

deletePost() {
  if (this.selectedPostId !== null) {
    this.bs.DeletePost(this.selectedPostId).subscribe(() => {
      this.ngOnInit();  // Rafraîchir la liste des posts
      const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')!);
      modal.hide();  // Fermer le modal après la suppression
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


