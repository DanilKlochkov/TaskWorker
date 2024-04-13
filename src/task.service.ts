    import * as amqp from "amqplib";
import {exec} from 'child_process';
import {join} from "path";
import {TestStrategyContext} from "./test/test.strategy.context";
import {jestConfig, Language, runCodeCommand} from "./language";
import {writeFileSync} from "fs";
import * as util from "util";

const execAsync = util.promisify(exec)

export type TExecDocker = {
    stdout?: string;
    stderr?: string;
    error?: string;
}

export class TaskService {
    constructor(
        public inputQueue: string,
        public outputQueue: string,
        public containerName: string,
    ) {

    }

    async start() {
        const configPath = join(__dirname, `jest.config.json`);
        writeFileSync(configPath, jestConfig);
        const initFiles = await this.copyFileToDocker(configPath, `/home/app/jest.config.json`);
        if (initFiles?.stderr) {
            return Promise.reject(new Error("Error while copy init files to Docker"));
        }
        return amqp.connect(undefined)
            .then(async (connection) => {
                return connection.createChannel()
                    .then(channel => {
                        const testGenerator = new TestStrategyContext(Language.JAVASCRIPT);

                        channel.assertQueue(this.inputQueue);
                        channel.assertQueue(this.outputQueue);

                        channel.consume(this.inputQueue, async (msg) => {
                            if (msg) {
                                const contentMsg = msg.content.toString();
                                try {
                                    const content = JSON.parse(contentMsg)
                                    testGenerator.setLang = content.language;
                                    console.log(content.language == Language.PYTHON)
                                    const tests = testGenerator.generateTests(content);
                                    console.log(tests)
                                    const fileName = `file${
                                        content.language == Language.PYTHON
                                            ? '_test.py'
                                            : '.test.js'
                                    }`;
                                    console.log('FM', fileName)
                                    const filePath = join(__dirname, fileName);
                                    writeFileSync(filePath, tests);

                                    const {
                                        stderr: se,
                                        stdout: so
                                    } = await this.copyFileToDocker(filePath, '/home/app/' + fileName);
                                    console.log("Err", se, so)

                                    const command = runCodeCommand(content.language, '/home/app/' + fileName);
                                    console.log('command', command)

                                    await this.execTests(command)
                                        .then(({stderr, stdout}) => {
                                            console.log('exec', stdout, stderr)
                                            channel.sendToQueue(this.outputQueue, Buffer.from(
                                                JSON.stringify({
                                                    stderr: stderr ?? "",
                                                    stdout: stdout ?? "",
                                                })
                                            ))
                                        })
                                        .catch(err => channel.sendToQueue(this.outputQueue, Buffer.from(JSON.stringify({
                                            error: err
                                        }))))
                                } catch (e) {
                                    console.error(e)
                                }
                                channel.ack(msg)
                            }
                        })
                    });
            }).catch(e => Promise.reject(new Error('Error connect to RabbitMQ: ' + e.message)))
    }

    private execTests(command: string) {
        return this.execInDocker(`docker exec ${this.containerName} ${command}`)
    }

    private copyFileToDocker(fileFrom: string, fileTo: string): Promise<TExecDocker> {
        return this.execInDocker(
            `docker cp ${fileFrom} ${this.containerName}:/${fileTo}`
        )
    }

    private async execInDocker(command: string): Promise<TExecDocker> {
        const {stderr, stdout} = await execAsync(command)
        return {
            stderr: stderr,
            stdout: stdout
        }
    }
}