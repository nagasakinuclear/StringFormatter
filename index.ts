import express from 'express';

class VariableReplacer {
    constructor(private mappingConfig: MappingConfig) { }

    public replace(obj: any): any {
        if (obj instanceof Array) {
            return this.replaceVariablesInArray(obj);
        }
        else if (obj instanceof Object) {
            return this.replaceVariablesInObject(obj);
        } else if (typeof obj === 'string' || obj instanceof String) {
            return this.replaceVariablesInString(obj as string);
        }

        return obj;
    }

    private replaceVariablesInObject(obj: any): Object {
        const copy = JSON.parse(JSON.stringify(obj));

        Object.getOwnPropertyNames(copy).forEach(prop => {
            copy[prop] = this.replace(copy[prop]);
        });

        return copy;
    }

    private replaceVariablesInArray(array: any[]): any[] {
        return array.map((elem) => this.replace(elem));
    }

    private replaceVariablesInString(str: string): string {
        const json = JsonExtensions.TryGetJson(str);
        if (json) {
            const replaceResult = this.replace(JSON.parse(str));
            return JSON.stringify(replaceResult);
        } else {
            return StringFormatter.format(str, this.mappingConfig);
        }
    }
}

class StringFormatter {
    public static format(stringToParse: string, mappingConfig: MappingConfig) {
        if (!mappingConfig) {
            console.error("Mapping config was not provided");
            return stringToParse;
        }

        const stringReplacer = (match: string): string => {
            return mappingConfig.getValue(match.substring(1)) || match;
        }

        return stringToParse.replace(/\$[A-Za-z0-9\_]+/g, stringReplacer);
    }
}

class MappingConfig {
    private mappings: { [key: string]: string } = {};

    public addMapping(key: string, value: string): MappingConfig {
        this.mappings[key] = value;
        return this;
    }

    public getValue(key: string): string {
        return this.mappings[key];
    }
}

class JsonExtensions {
    public static TryGetJson(str: string): any {
        let result = null;

        try {
            result = JSON.parse(str);
        } catch (e) {
            return false;
        }

        return result;
    }
}

const app = express();

// TEST SECTION

const mappingConfig =
    new MappingConfig()
        .addMapping('Name', 'SAM')
        .addMapping('name', 'SAM')
        .addMapping('name', 'SAM')
        .addMapping('1name', 'SAM')
        .addMapping('name1', 'SAM')
        .addMapping('FName', 'SAM');

const testObj1 = {
    test: {
        test: "$Name $name $noVar $1name $a"
    },
    array: [
        "$Name $name $noVar $1name $a",
        "asdadasdadsd $name"
    ],
    str: "$Name $name $noVar $1name $a",
    bool: true,
    num: 5
}

const testArray = [
    "$Name $name $noVar $1name $a",
    "asdadasdadsd $name",
    testObj1
]

const testStr = "$Name $name $noVar $1name $a";
const testJson = JSON.stringify(testObj1);

const toTest = [testObj1, testArray, testStr, testJson, null, {}, [], undefined];

app.get('/', (req, res) => {
    const varReplacer = new VariableReplacer(mappingConfig);
    const result = toTest.map(x => varReplacer.replace(x));

    res.send(JSON.stringify(result));
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})