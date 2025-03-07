// WordValidation component to check if a word is valid using Datamuse API
let message = "";
//function to fetch and validate the passed word
export function validateWord(word) {
    fetch(`https://api.datamuse.com/words?sp=${word}&max=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0 && data[0].word === word) {
                message = `${word} is valid`;
            } else {
                message = `${word} is invalid`;
            }
        })
        .catch(error => message = "Error validating the word");
        
        return message;
}
