
export const isValidWord = async (word) => {
    try {
      // Having issue with the API dictionary
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
  
    
      return Array.isArray(data);
    } catch (error) {
      console.error("Error validating word:", error);
      return false;
    }
  };