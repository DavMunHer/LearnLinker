import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Phase } from '../../interfaces/phase';

@Injectable({
  providedIn: 'root'
})
export class PhasesHttpService {

    constructor(private http: HttpClient) { }

    createPhase(projectId: string, phase: Phase) {
        return this.http.post(`project/${projectId}/phase`, phase);
    }

    deletePhase(phaseId: string | number) {
        return this.http.delete(`phase/${phaseId}`);
    }
}
