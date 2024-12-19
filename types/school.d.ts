export interface School {
    _id: string;
    kurz_bezeichnung: string;
    ort: string;
    plz: number;
    schulname: string;
    schulnummer: number;
    tele: string;
    tele_vorwahl: number;
}

export interface SchoolSettings {
    _id: string;
    schoolId: number;
    moderators: string[];
    modules: number[];
}

export interface SchoolModule {
    id: number;
    icon: string;
    name: string;
    route: string;
    description: string;
}

export interface SuggestedModerator {
    schoolId: number;
    email: string;
    message: string;
}

export interface ModeratorEntry {
    school: School;
    email: string;
    message: string;
}