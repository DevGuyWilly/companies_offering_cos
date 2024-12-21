export const ScrapperController = async (req, res, next) => {
    try {
        const response = await fetch('https://h1bdata.info/index.php?job=software+developer&year=2024', {
            method: 'GET',
        });

        const html = await response.text();

        // Use regex to extract href and content from <a> tags
        const matches = [...html.matchAll(/<a href="[^"]*?em=([^"&]+).*?">(.*?)<\/a>/gi)];

        // Use a Set to store unique normalized href values
        const normalizedHrefSet = new Set();

        matches.forEach(([_, hrefEm]) => {
            // Normalize href text by replacing + with space and decoding %XX patterns
            const normalizedHref = decodeURIComponent(hrefEm.replace(/\+/g, ' ')).toUpperCase();
            normalizedHrefSet.add(normalizedHref);
        });

        // Convert the Set back to an array for the response
        const uniqueNormalizedHrefs = Array.from(normalizedHrefSet, ((val, index) => {
            return { "id" : index + 1, "name" : val };
        }));

        res.status(200).json({
            "companies": uniqueNormalizedHrefs,
            "totalPages": 176,
        });
    } catch (error) {
        next(error); // Handle errors appropriately
    }
};