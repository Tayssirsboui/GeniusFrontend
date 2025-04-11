import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Evenement } from 'src/app/models/evenement.model';
import { EvenementService } from 'src/app/services/evenement.service';
import { EvenementDetailComponent } from '../evenement-detail/evenement-detail.component';
@Component({
  selector: 'app-evenement-list',
  templateUrl: './evenement-list.component.html',
  styleUrls: ['./evenement-list.component.css']
})
export class EvenementListComponent implements OnInit{
  evenements: Evenement[] = [];

  constructor(private evenementService: EvenementService,private modalService: NgbModal,) {}

  ngOnInit(): void {
    this.evenementService.getAll().subscribe({
      next: data => {
        this.evenements = data;
        console.log(this.evenements);  // Check if e.image contains the correct path
      },
      error: err => console.error('Error loading events', err)
    });
  }
  ouvrirDetail(evenement: any) {
    const modalRef = this.modalService.open(EvenementDetailComponent, { centered: true });
    modalRef.componentInstance.evenement = evenement;
  }
  

  getDuration(debut: any, fin: any): string {
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60);
    return `${Math.round(diff)} Hours`;
  }
  
}

