import {ITestStrategy} from "./test.strategy";
import {Language} from "../language";
import {JsTestStrategy} from "./js.test.strategy";
import {Task} from "../task";
import {PythonTestStrategy} from "./python.test.strategy";
import {CppTestStrategy} from "./cpp.test.strategy";

export class TestStrategyContext {
    private strategy: ITestStrategy;

    constructor(public lang: Language) {
        this.strategy = this.setStrategy(lang);
    }

    private setStrategy(lang: Language): ITestStrategy {
        switch (lang) {
            case Language.JAVASCRIPT:
                return new JsTestStrategy();
            case Language.PYTHON:
                return new PythonTestStrategy();
            case Language.CPP:
                return new CppTestStrategy();
        }
    }

    set setLang(lang: Language) {
        this.strategy = this.setStrategy(lang);
    }

    generateTests(task: Task) {
        return this.strategy.generateTests(task);
    }
}