import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../Interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey: string = 'h0rcNOErivYXzBq9MvfVpIg38MxC9qR5';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service ready');
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((t) => t !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('tagsHistory', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('tagsHistory')) {
      return;
    }
    this._tagsHistory = JSON.parse(localStorage.getItem('tagsHistory')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this.tagsHistory[0]);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
        console.log({ gifs: this.gifList });
      });
  }
}
