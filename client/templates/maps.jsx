var MapsComponent = ReactMeteor.createClass({
    templateName: "mapsComponent",
    getInitialState: function(){
        return {
            comparisonVector: []
        }
    },
    startMeteorSubscriptions: function(){
        Meteor.subscribe("Answers")
        Meteor.subscribe("Questions")
    },
    getMeteorState: function() {
        return {
            answers:    Answers.find({}).fetch(),
            questions:  Questions.find({}).fetch()
        };
    },
    handleChangeQuestion: function(e){
        e.preventDefault()
        var id = React.findDOMNode(this.refs.select).value
        var idx;

        for(var i =0  ; i < this.state.questions.length ; i++) {
            if(this.state.questions[i]._id === id){
                idx = i;
                break;
            }
        }

        console.log(id)
        console.log(idx)

        if(!id || (!idx && idx !== 0)) {
            this.setState({
                selectedQuestion: null,
                comparisonVector: []
            })
            return 
        }

        var question = this.state.questions[idx]
        this.setState({
            selectedQuestion: JSON.parse(JSON.stringify(question)),
            comparisonVector: this.state.answers.map(function(answer){
                return {
                    mag:    answer.texts[idx],
                    lat:    answer.lat,
                    lng:    answer.lng
                }
                return answer.texts[idx] || 0
            })
        })
    },
    render: function(){
        return <div>
            <div className="page-header">
                <h1>MapView</h1>
            </div>
            <div className="row">
                <div className="col-md-9">
                    <GoogleMapComponent ref="googleMap" comparisonVector={this.state.comparisonVector} />
                </div>
                <div className="col-md-3">
                    <select onChange={this.handleChangeQuestion} className="form-control" ref="select">
                        <option>None</option>
                        { this.state.questions.map(function(question, idx){
                            return (
                                <option value={question._id}>
                                    <a target="_blank">Question { idx + 1 }</a>
                                </option>
                            )
                        })}
                    </select>
                    <br />
                    <div className="page-header"></div>
                    <div>
                        { (this.state.selectedQuestion || {}).text }
                    </div>
                </div>
            </div>
        </div>
    }
})

var GoogleMapComponent = ReactMeteor.createClass({
    initializeMap: function(){
        console.log("My latest state:")
        console.log(this.props.comparisonVector)

        var map, mapOptions;

        function getCircle(magnitude) {
            return {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'red',
                fillOpacity: .2,
                scale: magnitude * 1.5,
                strokeColor: 'white',
                strokeWeight: .5
            }
        }

        mapOptions = {
            zoom: 5,
            center: {lat: 28.374190, lng: 84.106500},
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        function eqfeed_callback(results) {
            map.data.addGeoJson(results);
        }

        map = new google.maps.Map(React.findDOMNode(this.refs.map),
          mapOptions);

        map.data.addGeoJson({ 
            "type": "FeatureCollection",
            "features": this.props.comparisonVector.map(function(answer){
                return {
                    "type": "Feature",
                    "properties": {
                        "mag": answer.mag
                    },
                    "geometry": {"type": "Point", "coordinates": [answer.lng, answer.lat, 0]}
                }
            })
        });

        map.data.setStyle(function(feature) {
            console.log(feature)
            var magnitude = feature.getProperty('mag');
            console.log(magnitude)
            return {
                icon: getCircle(magnitude)
            };
        })
    },
    componentWillReceiveProps: function(){
        console.log('ah')
        this.initializeMap();
    },
    componentDidMount: function(){
        this.initializeMap();
    },
    render: function(){
        console.log(this.props.comparisonVector)
        return <div style={{"height":  "450px" }} ref='map'></div>
        
    }
})