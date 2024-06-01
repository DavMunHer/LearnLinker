import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
    private projectId: any;

    setProjectId(projectId: any) {
        this.projectId = projectId;
      }

      getProjectId() {
        return this.projectId;
      }

      clearprojectId() {
        this.projectId = null;
      }
  constructor() { }
}
