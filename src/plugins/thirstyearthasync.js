/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */
// import { Plugin } from 'boardgame.io/src/types'
// import info from 'boardgame.io/core/logger'

export const TEPlugin = {
  name: 'AsyncPlumberCall',
  fnWrap:
  (moveFn, gameMethod) =>
  (G, ctx, ...args) => {
    console.log("Woah hey there async plumber call")
    console.log(gameMethod)
    new Promise((resolve, reject) => {
      setTimeout(() => {
      resolve(moveFn(G, ctx, ...args));
    }, 2000)}).then((G) => {
      return G;
    })

    // G = moveFn(G, ctx, ...args);
    // if (G.endTurn && type === GameMethod.MOVE) {
    //   ctx.events.endTurn();
    // }
    // if (G.endGame) {
    //   ctx.events.endGame(G.endGame);
    // }
    
  }
}

// export default TEPlugin;
