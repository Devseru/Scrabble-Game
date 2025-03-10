// WordValidation component to check if a word is valid using Datamuse API
let message = "";

// Function to fetch and validate the passed word
export async function validateWordFn(word) {
    try {
        //fetch
        const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
        const data = await response.json();

        if (data.length > 0 && data[0].word === word) {
            console.log(data);
            message = `is valid`;
        } else {
            message = `is invalid`;
        }
    } catch (error) {
        message = "Error validating the word";
    }

    return message;
}
