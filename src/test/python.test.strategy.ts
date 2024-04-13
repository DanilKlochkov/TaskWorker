import {ITestStrategy} from "./test.strategy";
import {Task} from "../task";
import {Test} from "../test";

export class PythonTestStrategy implements ITestStrategy {
    generateTests(task: Task): string {
        const tests = task.testCases.map(it => this.generateTest(it)).join("\n");
        return task.code + "\n\n" + tests;
    }

    private generateTest(test: Test) {
        const input: string = test.input
            .map(it => it.value.toString())
            .join(", ");
        const output: string = test.output.value.toString();

        return `def test_${test.id}(): assert sum(${input}) == ${output}`;
    }
}