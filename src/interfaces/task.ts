import { User } from "./user";

export interface Task {
    id?: string,
    name: string,
    phaseId?: number | string,
    start_date: string,
    deadline: string,
    end_date?: string,
    projectId?: number | string,
    users: User[]
}
