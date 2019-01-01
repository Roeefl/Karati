module.exports = ( match, matchUserIdLink ) => {
    return `
        <html>
            <body>
                <div style="text-align: center;">
                    <h3>You have a new match in Karati app.</h3>
                    <div>Open the app to view the book you matched with.</div>
                    <div>Matched on: ${match.dateMatched}</div>
                    <div>
                        <a href="${process.env.REDIRECT_DOMAIN}/myMatches/${matchUserIdLink}">See my new match</a>
                    </div>
                </div>
            </body>
        </html>            
    `;
};