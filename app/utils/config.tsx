export const stats = [
    {
        name: 'Health',
        value: 0
    },
    {
        name: 'Intellect',
        value: 0
    },
    {
        name: 'Spirit',
        value: 0
    }
];

export const tasks = [
    {
        name: 'Exercise',
        description: 'some form of physical activity for 1 hour',
        stats: ['Health'],
        completed: false
    },
    {
        name: 'Diet',
        description: 'follow a healthy diet with no sugar',
        stats: ['Health'],
        completed: false
    },
    {
        name: 'Cold shower',
        description: 'take a cold shower',
        stats: ['Health', 'Intellect', 'Spirit'],
        completed: false
    },
    {
        name: 'Deep Work',
        description: 'do deep work or skill development for 2 hours',
        stats: ['Intellect'],
        completed: false
    },
    {
        name: 'Meditation',
        description: 'do meditation or breathing exercise for at least 10 minutes',
        stats: ['Spirit'],
        completed: false
    },
    {
        name: 'Journaling',
        description: 'journal your thoughts in a diary',
        stats: ['Intellect', 'Spirit'],
        completed: false
    },
    {
        name: 'Sleep',
        description: 'sleep for 7-8 hours',
        stats: ['Health', 'Intellect', 'Spirit'],
        completed: false
    }
];

export const rewards = [
    {
        name: 'Leisure Activity',
        description: 'enjoy a movie night or go out with friends',
        requirement: {
            task: 'Exercise',
            days: '6'
        },
        reset: [
            'Deep Work',
            'Sleep'
        ],
        count: 0,
        claim:0
    },
    {
        name: 'A Gift',
        description: 'buy something good for yourself',
        requirement: {
            task: 'Deep Work',
            days: '50'
        },
        reset: [
            'Meditation',
            'Journaling'
        ],
        count: 0,
        claim:0
    },
    {
        name: 'Cheat Meal',
        description: 'have a cheat meal',
        requirement: {
            task: 'Diet',
            days: '50'
        },
        reset: [
            'Diet'
        ],
        count: 0,
        claim:0
    }
];