export const FetchStatuses = {
    None: 0,
    Loading: 1
};

export const QuizStatuses = {
    Draft: 0,
    Published: 1
};

export const FilterTypes = {
    Draft: 0,
    Published: 1,
    Recent: 2,
    Saved: 3
}

export const FilterTexts = {
    [FilterTypes.Draft]: "Draft",
    [FilterTypes.Published]: "Published",
    [FilterTypes.Recent]: "Recent",
    [FilterTypes.Saved]: "Saved"
}
