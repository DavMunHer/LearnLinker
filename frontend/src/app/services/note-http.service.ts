import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteHttpService {

    constructor(private http: HttpClient) { }

    getTaskNotes(taskId: string): Observable<any> {
        return this.http.get(`task/${taskId}/notes`);
    }

    createNote(note: any): Observable<any> {
        return this.http.post('create/note', note);
    }

    deleteNote(noteId: string): Observable<any> {
        return this.http.delete(`delete/note/${noteId}`);
    }

    checkIfUserHasCommented(taskId: string, userEmail: string): Observable<any> {
        return this.http.get(`check/task/${taskId}/user/${userEmail}`);
    }
}
