export const PushTheButtonFrank = {
    name: 'push-the-button',
    setup: (ctx) => ({ 
        buttonValue: 1
    }),

    turn: {
        minMoves: 1,
        maxMoves: 1

    },
    moves: {
        clickButton: (G, ctx) => {
            if (G.buttonValue === 1) {
                G.buttonValue = 2;
            }
            else {
                G.buttonValue = 1;
            }

        }
    }
}