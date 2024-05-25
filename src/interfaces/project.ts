import { Phase } from "./phase"
import { Task } from "./task"
import { User } from "./user"

export interface Project {
    id?: number,
    name: string,
    start_date: string,
    end_date: string
    project_user?: {
        role: string
    }
    Users?: User[],
    Phases?: Phase[],
    Tasks?: Task[]
}
