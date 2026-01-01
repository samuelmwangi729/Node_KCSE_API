import { RequestHandler } from "express";
import axios from "axios";
import * as cheerio from "cheerio";

export const KCSE: RequestHandler = async (req, res, next): Promise<any> => {
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

        const response = await axios.post<string>(url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const $ = cheerio.load(response.data);
        const tableData: { code: string; subject: string; grade: string }[] = [];

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

        const sortedData = tableData.sort(
            (a, b) => Number(a.code) - Number(b.code)
        );

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
    } catch (error) {
        console.error("Error fetching KCSE results:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch results",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
