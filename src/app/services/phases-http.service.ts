import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Phase } from '../../interfaces/phase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhasesHttpService {

    constructor(private http: HttpClient) { }

    getPhase(phaseId: string | undefined): Observable<Phase> {
        return this.http.get<Phase>(`phase/${phaseId}`);
    }


    createPhase(projectId: string, phase: Phase) {
        return this.http.post(`project/${projectId}/create/phase`, phase);
    }

    updatePhase(phaseId: number | undefined, phase: Phase) {
        return this.http.patch(`edit/phase/${phaseId}`, phase);
    }

    deletePhase(phaseId: string | number) {
        return this.http.delete(`phase/${phaseId}`);
    }
}
