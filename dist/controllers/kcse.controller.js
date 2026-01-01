"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KCSE = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const KCSE = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({
            status: "error",
            message: "No data posted to the backend",
        });
    }
    const { indexNumber, studentName } = req.body;
    if (!indexNumber || !studentName) {
        return res.status(400).json({
            status: "error",
            message: "Invalid data submitted",
        });
    }
    try {
        const url = "https://results.knec.ac.ke/Home/CheckResults";
        const data = {
            indexNumber,
            name: studentName,
        };
        const response = await axios_1.default.post(url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const $ = cheerio.load(response.data);
        const tableData = [];
        const studentDetails = $("table.table-borderless tbody tr");
        const indexNumberAndName = $(studentDetails[0]).text().trim();
        const schoolName = $(studentDetails[1]).text().trim();
        const meanGradeText = $(studentDetails[2]).text().trim();
        const meanGrade = meanGradeText.split(":")[1].trim();
        $("table#grid tbody tr").each((index, element) => {
            tableData.push({
                code: $(element).find("td").eq(1).text().trim(),
                subject: $(element).find("td").eq(2).text().trim(),
                grade: $(element).find("td").eq(3).text().trim(),
            });
        });
        const sortedData = tableData.sort((a, b) => Number(a.code) - Number(b.code));
        const respData = {
            student: indexNumberAndName,
            school: schoolName,
            mean_grade: meanGrade,
            subjects: sortedData,
        };
        return res.status(200).json({
            status: "success",
            message: "Results fetched successfully",
            data: respData,
        });
    }
    catch (error) {
        console.error("Error fetching KCSE results:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch results",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.KCSE = KCSE;
