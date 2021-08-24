import { words } from "../common/dict";

export class OneWord {
    constructor() {

    }

    findByRegularExpression(str) {
        const regularExpression = eval(`/${str}/`);
        for(let patten in words) {
            if(!patten)continue;
            for(let word of words[patten]) {
                if(regularExpression.test(word)) {
                    console.info(word);
                }
            }
        }
    }
}