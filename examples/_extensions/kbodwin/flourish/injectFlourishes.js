function injectFlourishes(chunkString, target, className = "flr-default", mask = false) {
        // RegEx to find tag boundaries
        // Create list of pieces
        const splitPattern = /(?<=>)|(?=<)/g;
        const chop = chunkString.split(splitPattern);

        // Returns table of pieces, with length and start and end
        const splitTable = getSplitInfo(chop);

        // Take only text elements, find their start and ends
        const textOnlyOrig = splitTable.filter(row => row.type === "text");

        // Extract just the text strings
        const textOnly = textOnlyOrig.map(row => row.original);

        // Recalculate positions within flattened text-only segments
        let textOnlyTable = getSplitInfo(textOnly);

        // Copy over the label field from the original
        textOnlyTable = textOnlyTable.map((row, i) => ({
                ...row,
                label: textOnlyOrig[i].label
        }));

        // Smoosh text together, find indices of targets
        const combinedText = textOnly.join('');
        const whereTargets = findTargets(combinedText, target);

        // Loop through pieces adding flourish
        const updatedTextTable = textOnlyTable.map(row => ({
                ...row,
                newText: addFlourishes(row, whereTargets, className, mask)
        }));

        // Insert alterted text back into original splitTable
        const updatedSplitTable = splitTable.map(row => {
                if (row.type === "text") {
                        const match = updatedTextTable.find(t => t.label === row.label);
                        return {
                                ...row,
                                original: match ? match.newText : row.original
                        };
                } else {
                        return row; // tags stay the same
                }
        });

        // Rebuild full string and return
        const finalString = updatedSplitTable.map(row => row.original).join('');

        return finalString

}

// Takes list of pieces
// Returns table of pieces, with length and start and end
function getSplitInfo(splitsList) {
        // Get length of each piece
        const lengths = splitsList.map(str => str.length);

        // Find string index of end of piece
        const ends = getCumSum(lengths)

        // Find string index of beginning of piece
        const starts = [0, ...ends.slice(0, -1)];

        // Construct table with all info and remove empty rows
        const result = splitsList.map((original, i) => {
                return {
                        label: i,
                        original,
                        length: lengths[i],
                        start: starts[i],
                        end: ends[i],
                        type: /^<.*>$/.test(original) ? "tags" : "text"
                };
        }).filter(row => row.original.length > 0);

        return result;
}

// Helper function for CumSum
function getCumSum(arr) {
        let sum = 0;
        return arr.map(num => sum += num);
}

// Find all matches in a string, return a table.
function findTargets(str, target) {
        const matchesWithIndices = [...str.matchAll(target)].map(match => {
                const start = match.index;
                const end = start + match[0].length;
                return {
                        match: match[0],
                        start,
                        end
                };
        });
        return matchesWithIndices
}

// Add all flourishes to a single row
function addFlourishes(row, whereTargets, className, mask) {
        let toDo = whereTargets.map(match => ({
                flrFrom: Math.max(row.start, match.start) - row.start,
                flrTo: Math.min(row.end, match.end) - row.start
        })).filter(t => t.flrFrom < t.flrTo);

        return wrapMatches(row.original, toDo, className, mask);
}

// Helper for addFlourishes
function wrapMatches(str, toDo, className, mask) {
        let result = '';
        let here = 0;

        const getContent = mask
                ? (start, end) => ' '.repeat(end - start)
                : (start, end) => str.slice(start, end);

        for (const { flrFrom: start, flrTo: end } of toDo) {
                result += str.slice(here, start); // Add skipped text
                result += `<span class="${className}">${getContent(start, end)}</span>`;
                here = end;
        }

        return result + str.slice(here);
}