var Newsfeed = require('../../models/newsfeed');
module.exports = function (router) {
    router.get('/feed', async function (req, res) {
        // var feed = await Newsfeed.find().lean()
        var feed = await Newsfeed.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_email',
                    foreignField: 'email',
                    as: 'user_details'
                }
            },
            {
                $project: {
                    'user_details.password': 0
                }
            },
            {
                $sort: {
                    '_id': -1
                }
            }
        ])
        res.send(feed);
    })
    router.post('/feed', async function (req, res) {
        var data = req.body;
        data.user_email = req.decoded.email;
        try {
            var saved = await new Newsfeed(data).save()
            saved['user_details'] = [req.decoded]
            res.send(saved);
        }
        catch (e) {
            res.send({
                success: false,
                message: 'Could not create post.'
            })
        }
    })

    router.delete('/feed/:id', async function (req, res) {
        if (req.params.id) {
            try {
                await Newsfeed.findOneAndRemove({ _id: req.params.id, user_email: req.decoded.email });
                res.send({
                    status: 'ok'
                })
            } catch (error) {
                res.send({ status: 'error' })
            }
        }
    })
}