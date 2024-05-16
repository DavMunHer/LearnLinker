import { Task } from "./task";

export interface Phase {
    name: string,
    deadline: string,
    start_date: string,
    end_date: string,
    Tasks: Task[]
}
