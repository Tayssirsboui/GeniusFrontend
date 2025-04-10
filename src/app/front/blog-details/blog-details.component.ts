import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  commentForm: FormGroup;
  editMode: boolean = false;
selectedCommentId: number | null = null;
userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté
  constructor(private bs :BlogService,private Ac:ActivatedRoute,private route:Router,private fb: FormBuilder){//ActivatedRoute bch najmo nhezo l id m url
  
    this.commentForm = this.fb.group({
          description: ['', [Validators.required]],
          createdBy: ['', Validators.required]
        });
  }
    id!:number;
    post!:Post;
    comments!:Comment[];



    ngOnInit() {
      this.id = +this.Ac.snapshot.paramMap.get('id')!;
    
      this.bs.getPostsById(this.id).subscribe(data => {
        this.post = data;
      });
    
      this.bs.getcommentsByPostId(this.id).subscribe(data => {
        this.comments = data;
      });
    }
    
  //   addComment() {
   
  //     this.bs.addComment(this.commentForm.value).subscribe(
  //     ()=> this.route.navigateByUrl('blog-details/'+this.id)
  // );
  //  }
  
  addComment() {
    const commentData = {
      ...this.commentForm.value,
      postId: this.id, // Assurez-vous que 'this.id' est défini et contient l'ID du post
      userId: this.userId // Assurez-vous que 'this.userId' contient l'ID de l'utilisateur connecté
    };
  
    if (this.editMode && this.selectedCommentId) {
      console.log("Mise à jour du commentaire ID :", this.selectedCommentId); // 👈 debug
      this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe(() => {
        alert("Commentaire modifié avec succès !");
        this.ngOnInit(); // Recharger les commentaires après modification
        this.resetForm(); // Réinitialiser le formulaire après modification
      });
    } else {
      this.bs.addComment(this.id, this.userId, commentData).subscribe(() => {
        alert("Commentaire ajouté avec succès !");
        this.ngOnInit(); // Recharger les commentaires après ajout
        this.resetForm(); // Réinitialiser le formulaire après ajout
      });
    }
  }
  
  
   editComment(comment: any) {
    console.log("Édition du commentaire :", comment); // 👈 vérifie dans la console
  
    this.editMode = true;
    this.selectedCommentId = comment.idComment; // attention ici : peut-être que c'est `idComment`, pas `id`
  
    this.commentForm.patchValue({
      description: comment.description
    });
  }
  resetForm() {
    this.commentForm.reset();
    this.editMode = false;
    this.selectedCommentId = null;
  }
   
  }