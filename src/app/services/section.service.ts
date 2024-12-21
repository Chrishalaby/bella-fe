import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Section } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  getSection(sectionName: string): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/section/${sectionName}`);
  }

  updateSection(id: number, section: Partial<Section>): Observable<Section> {
    return this.http.put<Section>(`${this.apiUrl}/${id}`, section);
  }
}
