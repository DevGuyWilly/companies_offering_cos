export const PaginationController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const response = await fetch('https://h1bdata.info/index.php?job=software+developer&year=2024', {
            method: 'GET',
        });

        const html = await response.text();

        // Extract href and content from <a> tags using regex
        const matches = [...html.matchAll(/<a href="[^"]*?em=([^"&]+).*?">(.*?)<\/a>/gi)];

        // avoiding duplicates using Set
        const normalizedHrefSet = new Set();

        matches.forEach(([_, hrefEm]) => {
            // Normalize href text by replacing + with space and decoding %XX patterns
            const normalizedHref = decodeURIComponent(hrefEm.replace(/\+/g, ' ')).toUpperCase();
            normalizedHrefSet.add(normalizedHref);
        });

        // Convert the Set back to an array and constructing a new object from each item in the Set
        const uniqueNormalizedHrefs = Array.from(normalizedHrefSet, (val, index) => ({
            id: index + 1,
            name: val,
        }));

        // Implement pagination logic
        const startIndex = (page - 1) * limit;
        const paginatedData = uniqueNormalizedHrefs.slice(startIndex, startIndex + limit);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            companies: paginatedData,
            totalPages: Math.ceil(uniqueNormalizedHrefs.length / limit),
        });
    } catch (error) {
        next(error); // Handle errors appropriately
    }
};