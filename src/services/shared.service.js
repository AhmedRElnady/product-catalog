const Seasons = require('../models/seasons/season.model');
const Users = require('../models/users/user.model');
const mongoose = require('mongoose');
const  { ObjectId } = mongoose.Types;
const { v4: uuidv4 } = require('uuid');

const { MEDIA_TYPE, S3, S3_PREFIX, SEASON_STATUS } = require('../config'),
    { INPUT_HOST, OUTPUT_HOST, MP4_VIDEO_FOLDER, ORIGINAL_VIDEO_FOLDER, VIDEO_THUMBS_FOLDER } = S3, 
    { _400_THUMB_PRE } = S3_PREFIX;
    
module.exports = {
    prepareObj: (serveOriginal, vidExt)=> {
        // ALWAYS KEEP a mp4 version from any uploaded video 

        let s3_UID = uuidv4(),
            s3_URLs = {
                original_URL: `${INPUT_HOST}/${ORIGINAL_VIDEO_FOLDER}/${s3_UID}.${vidExt}`,
                _mp4_URL: `${OUTPUT_HOST}/${MP4_VIDEO_FOLDER}/${s3_UID}.mp4`,
                _400_thumb_URL: `${OUTPUT_HOST}/${VIDEO_THUMBS_FOLDER}/${_400_THUMB_PRE}${s3_UID}.jpg`,
            },
            URL = (serveOriginal) ? s3_URLs.original_URL : s3_URLs._mp4_URL;

        return { s3_UID, s3_URLs, URL }
    }, // end prepareObj

    confirmMediaUpload: () => {

    }, // end confirmMediaUpload

    getCurrentOpenSeason: async ()=> {
        const currentOpenSeason = await Seasons.findOne({
            status: SEASON_STATUS.OPEN
        });
        console.log("$$$$ ", currentOpenSeason);
        const currentSeasonID = currentOpenSeason._id.toString();
        console.log('111 inside shared 111', currentSeasonID);
        return currentSeasonID;
    },

    giveUserExtraPoints: async (userID, pointsCount)=> {
        const currentSeasonID = await module.exports.getCurrentOpenSeason();
        console.log("TT TTT",userID, pointsCount, currentSeasonID);

        const updatedUser = await Users.findOneAndUpdate({ _id: userID, 'rewards.seasonID': currentSeasonID }, {
            $inc: {
                "rewards.$.xp": pointsCount,
                xp: pointsCount, 
            }
        }, {new: true});

        console.log("!!! updatedUser !!!", updatedUser);
    },

    getUserRewardsForCurrentSeason: async (userID) => {
        const currentSeasonID = await module.exports.getCurrentOpenSeason(); // 5fd756fd0230691ebca12315
        
        const user = await Users.aggregate([{
                $match: {
                    'rewards.seasonID': currentSeasonID,
                    _id: ObjectId(userID)
                }
            },
            {
                $project: {
                    rewards: {
                        $filter: {
                            input: '$rewards',
                            as: 'seasonRewards',
                            cond: {
                                $eq: ['$$seasonRewards.seasonID', currentSeasonID]
                            }
                        }
                    },
                    name: 1,
                    school: 1,
                    age: 1,
                    favSports: 1,
                    nationality: 1,
                    xp: 1
                }

            }
        ]);

        return user;
    }

}