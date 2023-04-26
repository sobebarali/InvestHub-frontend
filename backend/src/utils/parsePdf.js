"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require("fs");
const pdf = require("pdf-parse");
function readPDFFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const pdfBuffer = fs.readFileSync(filePath);
        const parsedPDF = yield pdf(pdfBuffer);
        const pdfText = parsedPDF.text;
        const lines = pdfText.split("\n").slice(5);
        const names = lines
            .filter((line) => /^[A-Za-z]/.test(line))
            .map((name) => name.replace(/[0-9]/g, ""))
            .map((name) => name.slice(1));
        return names;
    });
}
readPDFFile("../pdf/test.pdf");
