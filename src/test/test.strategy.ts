import {Task} from "../task";

export interface ITestStrategy {
    generateTests(task: Task): string;
}