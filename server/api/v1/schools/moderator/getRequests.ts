import { getSuggestedModerators } from "~/server/utils/schoolUtils";

export default defineEventHandler(async (event) => {
    return (await getSuggestedModerators());
});