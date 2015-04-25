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
    this.response.end(JSON.stringify({ notice: texts }))
})