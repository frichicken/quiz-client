export const FetchStatuses = {
    None: 0,
    Loading: 1
};

export const QuizStatuses = {
    Draft: 0,
    Published: 1
};

export const FilterTypes = {
    Recent: 2,
    Draft: 0,
    Published: 1,
    Saved: 3
};

export const FilterTexts = {
    [FilterTypes.Draft]: 'Draft',
    [FilterTypes.Published]: 'Published',
    [FilterTypes.Recent]: 'Recent',
    [FilterTypes.Saved]: 'Saved'
};

export const QuestionTabs = {
    All: 0,
    Starred: 1
};

export const QuestionTypes = {
    Single: 0,
    Short: 1,
    Multiple: 2
};

export const QuestionTypeTexts = {
    [QuestionTypes.Single]: 'Single choice',
    [QuestionTypes.Short]: 'Short answer',
    [QuestionTypes.Multiple]: 'Multitple choices'
};

export const url = 'http://localhost:5184';
