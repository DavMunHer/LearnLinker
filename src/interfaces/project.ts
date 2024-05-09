export interface Project {
    id?: number,
    name: string,
    start_date: string,
    end_date: string
    project_user?: {
        role: string
    }
}
