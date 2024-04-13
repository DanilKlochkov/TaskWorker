export enum Language {
    PYTHON = "python",
    JAVASCRIPT = "javascript",
    CPP = "c++"
}

export const runCodeCommand = (lang: Language, fileName: string): string => {
    switch (lang) {
        case Language.JAVASCRIPT:
            return `jest ${fileName} --notify --config=jest.config.json`
        case Language.PYTHON:
            return `pytest ${fileName}`
        case Language.CPP:
            return ``
    }
}

export const jestConfig: string = `{
  "notify": true
}`