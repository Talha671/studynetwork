angular.module('newsFeedModule', ['userServices', 'authServices'])
app.controller('newsFeedCtrl', function (Auth, $http, $location) {
    _t = this;
    this.message = "Works Fine!";
    this.newPost = {}
    this.feed = [];
    this.moment = moment;
    Auth.getUser().then(function (user) {
            _t.current_user = user.data.email
        })
        .catch(function (e) {

        });
    $http.get('/api/feed').then(function (feeds) {
            _t.feed = feeds.data;
            console.log(_t.feed)
        })
        .catch(function (err) {
            console.log(err)
        })

    this.submitPost = function () {

        $http.post('/api/feed', _t.newPost).then(function (result) {
                _t.feed.unshift(result.data)
            })
            .catch(function (err) {
                console.log(err)
            })
    }
    this.deletePost = function (id, index) {
        if (confirm('Are You Sure ?')) {
            _t.feed.splice(index, 1);
            $http.delete('/api/feed/' + id)
                .then(function (res) {

                })
                .catch(function (e) {

                })
        }
    }
});