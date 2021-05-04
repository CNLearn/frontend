export function extractChineseCharacters(sentence) {
    const re = new RegExp('[\\u4e00-\\u9fa5]', 'g')
    // the following returns an iterator
    const matches = sentence.matchAll(re)
    // now let's create a set to store the characters occurring
    const characters = new Set()
    for (const match of matches) {
        characters.add(match[0])
    }
    return characters
};


export function extractChineseCharactersToString(sentence) {
    const re = new RegExp('[\\u4e00-\\u9fa5]', 'g')
    // the following returns an iterator
    const matches = sentence.matchAll(re)
    // now let's create a set to store the characters occurring
    const characters = Array.from(matches)
    const chineseString = characters.join('')
    return chineseString
};