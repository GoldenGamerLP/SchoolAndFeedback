import {isSchoolEnabled} from "~/server/utils/schoolUtils";
import * as z from "zod";

export default defineEventHandler(async (event) => {
    const { data, error } = await getValidatedQuery(
        event,
        validateSchoolIsEnabledQuery.safeParseAsync
    );

    if (error) {
        throw createError({
            status: 400,
            message: "Invalid query parameters",
        });
    }

    const schoolId = data.schoolnumber;

    return await isSchoolEnabled(schoolId);
});

export const validateSchoolIsEnabledQuery = z.object({
    schoolnumber: z.coerce.number().int().positive(),
});