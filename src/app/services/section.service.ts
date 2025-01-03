// section.service.ts
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

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }

  findAll(): Observable<Section[]> {
    return this.http.get<Section[]>(this.apiUrl);
  }

  getSection(sectionName: string): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/${sectionName}`);
  }

  getAllSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}`);
  }

  createSection(section: Partial<Section>): Observable<Section> {
    return this.http.post<Section>(`${this.apiUrl}`, section);
  }

  updateSection(section: Partial<Section>): Observable<Section> {
    console.log('Section data:', section);
    if (!section.id) {
      return this.http.post<Section>(this.apiUrl, section);
    }
    console.log('potato');
    return this.http.put<Section>(`${this.apiUrl}/${section.id}`, section);
  }

  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
