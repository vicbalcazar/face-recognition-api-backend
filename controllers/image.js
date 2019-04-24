const Clarifai = require('clarifai');


const app = new Clarifai.App({
    apiKey: '358c8f951173479280f6afd9f873327a'
});

const handleApiCall = (req, res) => {
    app.models
            .predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
            .then(data => {
                res.json(data);
            })
            .catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'))
   
}

module.exports = {
    handleImage : handleImage,
    handleApiCall: handleApiCall
};