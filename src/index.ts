import * as process from "process";
import * as dotenv from 'dotenv';
import {TaskService} from "./task.service";

async function main() {
    dotenv.config()
    console.log(process.env.INPUT_QUEUE,
        process.env.OUTPUT_QUEUE,
        process.env.CONTAINER_NAME)
    const taskService = new TaskService(
        process.env.INPUT_QUEUE,
        process.env.OUTPUT_QUEUE,
        process.env.CONTAINER_NAME
    );

    await taskService.start()
}

main()