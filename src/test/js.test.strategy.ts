import {ITestStrategy} from "./test.strategy";
import {Task} from "../task";
import {Test} from "../test";

export class JsTestStrategy implements ITestStrategy {
    generateTests(task: Task): string {
        const tests = task.testCases.map(it => this.generateTest(it)).join("\n")
        const testsRes: string = `describe('test-u#${task.userId}', () => {
            ${tests}
        })`

        return task.code + "\n\n" + testsRes;
    }

    private generateTest(test: Test) {
        const input: string = test.input
            .map(it => it.value.toString())
            .join(", ")
        const output: string = test.output.value.toString()

        const chan = `sum(${input}) == ${output}`

        return `test("${test.id}", () => {
            expect(${chan}).toBeTruthy()
        })`;
    }
}