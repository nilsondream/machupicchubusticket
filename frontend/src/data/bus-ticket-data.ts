export const busTicketData = [
    {
        id: "roundtrip",
        name: "Round trip",
        typeTravel: "roundtrip",
        popular: true,
        prices: {
            adult: {
                foreign: 34,
                national: 22,
            },
            child: {
                foreign: 18,
                national: 13,
                description: "Ages 0 to 11",
            },
        },
    },
    {
        id: "oneway-go",
        name: "Outward journey",
        typeTravel: "oneway-go",
        popular: false,
        prices: {
            adult: {
                foreign: 19,
                national: 14,
            },
            child: {
                foreign: 13,
                national: 13,
                description: "Ages 0 to 11",
            },
        },
    },
    {
        id: "oneway-return",
        name: "Return journey",
        typeTravel: "oneway-return",
        popular: false,
        prices: {
            adult: {
                foreign: 19,
                national: 14,
            },
            child: {
                foreign: 13,
                national: 13,
                description: "Ages 0 to 11",
            },
        },
    },
] as const;