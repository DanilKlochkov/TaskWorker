import {Language} from "./language";
import {Test} from "./test";

export class Task {
    constructor(
        public userId: string,
        public language: Language,
        public code: string,
        public testCases: Test[]
    ) {

    }

}