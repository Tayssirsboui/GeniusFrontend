import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrlPost = 'http://localhost:5100/api/v1/posts';
  private baseUrlComment = 'http://localhost:5110/api/v1/comments';
  constructor(private http : HttpClient) { }
  getPostById(id:number){
    return this.http.get<Post>(this.baseUrlPost+id)
    
  } 
  getPosts() {
    return this.http.get<Post[]>(this.baseUrlPost)
    
  }
  

  addPost(post: Post): Observable<any> {
    return this.http.post(`${this.baseUrlPost}`, post);
  }
  updatePost(id: number,userId:number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrlPost}/${id}/user/${userId}` , post);
  }
  DeletePost(id: number) {
    return this.http.delete(`${this.baseUrlPost}/${id}`);
  }
    getPostsById(id:number){
      return this.http.get<Post>(`${this.baseUrlPost}/${id}`)
      
    } 
    getPostsByUserId(userId: number): Observable<Post[]> {
      const params = new HttpParams().set('userId', userId.toString());
      return this.http.get<Post[]>(this.baseUrlPost, { params });
    }
    // Comment
    
    getcommentsByPostId(postId: number): Observable<Comment[]> {
      const params = new HttpParams().set('postId', postId.toString());
      return this.http.get<Comment[]>(`${this.baseUrlComment}/post/${postId}`)
    }
    getComments() {
      return this.http.get<Comment[]>(this.baseUrlComment)
    }
    // addComment(c:Comment){
    //   return this.http.post<Comment>(this.baseUrlComment,c)
      
  
    //  }
     addComment(postId: number, userId: number, comment: any): Observable<Comment> {
      return this.http.post<Comment>(`${this.baseUrlComment}/${postId}/${userId}`, comment);
    }
    
     updateComment(commentId: number, userId: number, comment: any): Observable<any> {
      return this.http.put(`${this.baseUrlComment}/${commentId}/user/${userId}`, comment);
    }
    @Injectable({
      providedIn: 'root'
    })
  
      private baseUrl = 'http://localhost:5100/api/facebook';
    
    
      postToFacebook(message: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/post`, { message });
      }
    
    
  }
