import { getAllModules } from '~/server/utils/schoolUtils';

export default defineEventHandler(async (event) => {
    return getAllModules();
});