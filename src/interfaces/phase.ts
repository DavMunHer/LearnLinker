import { Task } from "./task";

export interface Phase {
    id?: number,
    name: string,
    deadline: string,
    start_date: string,
    end_date: string,
    Tasks: Task[]
}
