import type { School } from "~/types/school";

export const useCurrentSchool = () => {
  const school = useState<School | null>(() => null);
  return school;
};
