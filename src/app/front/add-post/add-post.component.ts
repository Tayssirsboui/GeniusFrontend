import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from 'src/app/services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  selectedImage: File | null = null;
  post!: Post;
  id!: number;
userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté


  constructor(
    private fb: FormBuilder,
    private bs: BlogService,
    private rt: Router,
    private act: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      userId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      createdBy: ['', Validators.required]
    });
  }

 
    ngOnInit(){
    //1-  recuper l'id de la residence
    this.id=this.act.snapshot.params['id']
    //2- recuperer l'objet residance
    this.bs.getPostsById(this.id).subscribe(
      (data)=> {
        this.post=data,
        console.log(this.post)
        //3- initialiser le formulaire
        this.postForm.patchValue(this.post)
      }
    )
  }
  
  

  addPosts() {
    const postData = {
      ...this.postForm.value,
      postId: this.id, // Assurez-vous que 'this.id' est défini et contient l'ID du post
      userId: this.userId // Assurez-vous que 'this.userId' contient l'ID de l'utilisateur connecté
    };
    if (this.id) {
      this.bs.updatePost(this.id, this.userId,postData).subscribe(() => {
        this.rt.navigateByUrl('/blog-details/' + this.id);
      });
    } else {
      // Create
      this.bs.addPost(this.postForm.value).subscribe(() => {
        this.rt.navigateByUrl('/blog');
      });
    }
  }
}
