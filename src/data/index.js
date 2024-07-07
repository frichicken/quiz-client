import { getRandomDate, getRandomString } from 'utils';

export const quizzes = [
    {
        id: getRandomString(),
        title: 'You know what?',
        description: 'They are just silly questions',
        createdAt: getRandomDate(),
        questions: [
            {
                id: getRandomString(),
                text: 'How many cats do you have?',
                answers: [
                    { id: getRandomString(), isCorrect: true, text: '1' },
                    { id: getRandomString(), isCorrect: true, text: '3' }
                ],
                isOpen: true
            },
            {
                id: getRandomString(),
                text: 'How are you?',
                answers: [
                    { id: getRandomString(), isCorrect: true, text: "I'm you" },
                    { id: getRandomString(), isCorrect: false, text: "I'm me" },
                    { id: getRandomString(), isCorrect: false, text: "I'm good" },
                    { id: getRandomString(), isCorrect: false, text: 'And you?' }
                ],
                isOpen: true
            }
        ]
    },
    {
        id: getRandomString(),
        title: 'Friends',
        description: 'A challenge to know your friends better',
        createdAt: getRandomDate(),
        questions: [
            {
                id: getRandomString(),
                text: 'How many cats do you have?',
                answers: [
                    { id: getRandomString(), isCorrect: true, text: '1' },
                    { id: getRandomString(), isCorrect: true, text: '3' }
                ],
                isOpen: true
            },
            {
                id: getRandomString(),
                text: 'How are you?',
                answers: [
                    { id: getRandomString(), isCorrect: true, text: "I'm you" },
                    { id: getRandomString(), isCorrect: false, text: "I'm me" },
                    { id: getRandomString(), isCorrect: false, text: "I'm good" },
                    { id: getRandomString(), isCorrect: false, text: 'And you?' }
                ],
                isOpen: true
            }
        ]
    }
];
