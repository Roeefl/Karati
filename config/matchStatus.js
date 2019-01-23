/* *** Status codes ***
    3 - Pending / Available for selection
    4 - Proposed by one user for moving forward with the swap
    5 - Accepted by other user and re-notified to both for final approval before swap
    6 - Final approval by both participants
    7 - ITS A GO! match is underway and users have agreed to meet and swap the book!
    8 - SWAP COMPLETE! Users have met and swapped. congratuz! you are both now part of book swapping history.
*/

module.exports = {
    'INACTIVE'                      : 1,
    'CORRUPTED'                     : 0,
    'BLANK_FOR_FUTURE_DECISION'     : 2,

    'PENDING'                       : 3,
    'PROPOSED'                      : 4,
    'ACCEPTED'                      : 5,
    'MUTUALLY_APPROVED'             : 6,
    'ONGOING'                       : 7,
    'COMPLETE'                      : 8
};