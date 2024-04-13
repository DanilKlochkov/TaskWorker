import {ITestStrategy} from "./test.strategy";
import {Task} from "../task";
import {Test} from "../test";

export class CppTestStrategy implements ITestStrategy {
    generateTests(task: Task): string {
        const tests = task.testCases.map(it => this.generateTest(it)).join("\n")
        const testsRes: string = `
            #include <cassert>
            #include <cstdlib>
            ${task.code}
            
            int test_prog() {
                #ifdef NDEBUG
                    std::cerr << "Tests run with NDEBUG disabled";
                #endif
                ${tests}
                
                return 0;
            }
            
            int main() {
                test_prog();
                std::cout << "All tests succeeded";
                return 0;
            }
        `

        return task.code + "\n\n" + testsRes;
    }

    private generateTest(test: Test) {
        const input: string = test.input
            .map(it => it.value.toString())
            .join(", ")
        const output: string = test.output.value.toString()

        const chan = `sum(${input}) == ${output}`

        return `static_assert(${chan}, "${test.id}")`;
    }
}
