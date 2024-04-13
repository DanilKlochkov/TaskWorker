export type TValue = 'string' | 'number' | 'boolean' | 'array' | 'object';
export type TOperation = 'equals' | 'less' | 'more';

export type TestCaseValue = {
    type: TValue,
    value: any,
    position: number
}

export class Test {
    constructor(
        public id: string,
        public input: Array<TestCaseValue>,
        public output: TestCaseValue,
        public operation: TOperation
    ) {

    }

    operate(op: TOperation, input: string, output: string): string {
        switch (op) {
            case "less":
                return `${input} < ${output}`
            case "more":
                return `${input} > ${output}`
            case "equals":
                return `${input} == ${output}`
            default:
                return `${input} == ${output}`
        }
    }

    cast(caseValue: TestCaseValue): string {
        return caseValue.type == 'string' ? `\"${caseValue.value}\"` : caseValue.value.toString();
    }
}

// {
//     "userId": "1",
//     "language": "js",
//     "code": "function sum(a, b) { return a+b }",
//     "testCases": [
//         {
//             "id": "1",
//             "input": [
//                 { "type": "number", "value": 1, "position": 1 },
//                 { "type": "number", "value": 2, "position": 2 }
//             ],
//             "output": { "type": "number", "value": 3, "position": 1 },
//             "operation": "equals"
//         }
//     ]
// }