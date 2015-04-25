Router.configure({
    layoutTemplate: 'appBody',
    loadingTemplate: "appLoading"
})

Router.map(function(){
    var array = [
        { name: "index",      path: "/",            component: "indexComponent" },
        { name: "database",   path: "/database",    component: "databaseComponent" },
        { name: "maps",       path: "/maps",        component: "mapsComponent" },
        { name: "statistics", path: "/statistics",  component: "statisticsComponent"}
    ]
    array.forEach(function(obj){
        this.route(obj.component, {
            path: obj.path, 
            layoutTemplate: "appBody",
            action: function(){
                console.log("here")
                this.render(obj.component)
                if(Meteor.isClient) {
                    try {
                        var dom = document.getElementById("page-wrapper").children[0]
                        React.unmountComponentAtNode(dom.parentNode)
                        React.unmountComponentAtNode(dom)
                        dom.parentNode.removeChild(dom)

                    } catch(e) {
                        
                    }
                }
            }
        })
    }.bind(this))    
})

Router.route("/api/", { where: "server" })
.post(function(){
    this.response.setHeader('Content-Type', 'application/json')
    var texts = this.request.body.texts || []
    var lat = ""
    var lng = ""
    Answers.insert({
        "texts": texts,
        "lat": lat,
        "lng": lng
    })
    this.response.end(JSON.stringify({ notice: texts }))
})

// using the gem "rest0client'"
// RestClient.post({
//     texts: [
//         true,       // answer to q1
//         10,         // answer to q2
//         false       // answer to q3
//     ],
//     lat: 29.3,
//     lng: 10.29
// }, :content_type => :json)
