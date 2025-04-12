import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.css']
})
export class WidgetsComponent {

     constructor(private bs :BlogService,private Ac:ActivatedRoute,private route:Router,private fb: FormBuilder){
    }//ActivatedRoute bch najmo nhezo l id m url
   
 
  listPosts!:Post[] 
  userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté
  id!:number;
  post!:Post;
  comments!:Comment[];
  commentsByPostId: { [key: number]: Comment[] } = {}; // Dictionnaire pour stocker les commentaires par ID de post

  ngOnInit() {
    // Récupérer tous les posts
    this.bs.getPosts().subscribe(posts => {
      this.listPosts = posts; // Stocke les posts dans listPosts

      // Pour chaque post, récupérer les commentaires associés
      this.listPosts.forEach(post => {
        this.bs.getcommentsByPostId(post.id).subscribe(comments => {
          // Assigner les commentaires au post spécifique
          this.commentsByPostId[post.id] = comments;
        });
      });
    });
  }
}
