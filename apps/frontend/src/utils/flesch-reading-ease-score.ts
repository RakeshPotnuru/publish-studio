export interface IReadabilityScore {
    score: number;
    schoolLevel: string;
    notes: string;
}

const findReadabilityScore = (score: number): IReadabilityScore | null => {
    if (score >= 90) {
        return {
            score,
            schoolLevel: "👦 5th grade",
            notes: "Very easy to read. Easily understood by an average 11-year-old student.",
        };
    } else if (score >= 80) {
        return {
            score,
            schoolLevel: "👦 6th grade",
            notes: "Easy to read. Conversational English for consumers.",
        };
    } else if (score >= 70) {
        return {
            score,
            schoolLevel: "👦 7th grade",
            notes: "Fairly easy to read.",
        };
    } else if (score >= 60) {
        return {
            score,
            schoolLevel: "👦 8th & 9th grade",
            notes: "Plain English. Easily understood by 13- to 15-year-old students.",
        };
    } else if (score >= 50) {
        return {
            score,
            schoolLevel: "👦 10th to 12th grade",
            notes: "Fairly difficult to read.",
        };
    } else if (score >= 30) {
        return {
            score,
            schoolLevel: "👨‍🎓 College",
            notes: "Difficult to read.",
        };
    } else if (score >= 10) {
        return {
            score,
            schoolLevel: "👨‍🎓 College graduate",
            notes: "Very difficult to read. Best understood by university graduates.",
        };
    } else if (score >= 0) {
        return {
            score,
            schoolLevel: "👨‍🎓 Professional",
            notes: "Extremely difficult to read. Best understood by university graduates.",
        };
    } else {
        return null;
    }
};

const countSyllables = (word: string): number => {
    const syllableRegex = /[aeiouy]+/gi;
    const matches = word.match(syllableRegex);
    return matches ? matches.length : 0;
};

export default function fleschReadingEaseScore(text: string): IReadabilityScore | null {
    const words = text.split(/\s+/).filter(word => word.length > 0);

    const sentences = text.split(/[!.?]+/).length - 1;
    const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

    const fleschReadingEase =
        206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length);

    return findReadabilityScore(fleschReadingEase);
}
