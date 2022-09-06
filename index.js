"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Well done!');
});
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});
class Parser {
    static parseString(stringToParse) {
        const stringReplacer = (match) => {
            console.log(match);
            return match;
        };
        stringToParse.replace(new RegExp('$w'), stringReplacer);
    }
}
exports.Parser = Parser;
Parser.parseString('$asd $qweqwe $ASadsAS $ $zxcAS');
