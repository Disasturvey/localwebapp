var StatisticsComponent = ReactMeteor.createClass({
    templateName: "statisticsComponent",
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
    getAnswers: function(question) {
        var idx;
        for(var i = 0 ; i < this.state.questions.length ; i++) {
            if(this.state.questions[i]._id === question._id) {
                idx = i
                break
            }
        }

        if (!idx && idx !== 0) {
            return []
        }

        return this.state.answers.map(function(answer){
            console.log(answer)
            return answer.texts[idx]
        }.bind(this))
    },
    render: function(){
        return <div>
            <div className="page-header">
                <h1>Response Statistics</h1>
            </div>
            <p><strong>Number of respondence : </strong> { this.state.answers.length }</p>
            {this.state.questions.map(function(question, idx){
                return <div key={question._id}>
                    <QuestionAnalytics index={idx} question={question}  answers={this.getAnswers(question)} />
                </div>
            }.bind(this))}
        </div>
    }
})

var Histogram = ReactMeteor.createClass({
    obtainChartData: function(data){
        var hash = {}, obj, min = -1, max = -1;
        obj = {
            labels: [],
            datasets: [
                {
                    label: "Response",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ]
        }
        data.forEach(function(val){
            hash[val.toString()] = hash[val.toString()] || 0
            hash[val.toString()] += 1
        }.bind(this))

        for(var prop in hash) {
            var n = Number(prop)
            if(min === -1) { min = n }
            if(max === -1) { max = n }

            min = min < n ? min : n
            max = max > n ? max : n
        }
        console.log('a')
        console.log(min)
        console.log(max)
        console.log(obj)
        if(!(min === 0 && max === 1)) {
            min -= 1
            max += 1
        }


        for(var i = min ; i <= max ; i++) {
            if(i === -1) continue;

            obj.labels.push(i.toString())
            obj.datasets[0].data.push(hash[i.toString()] || 0)
        }

        console.log(obj)
        return obj
    },
    componentWillReceiveProps: function(){
        this.generateGraph()
    },
    generateGraph: function(){
        console.log("mounted")
        var ctx = React.findDOMNode(this.refs.chart).getContext("2d");
        var x = this.obtainChartData(this.props.data)
        console.log("evaled-x")
        var myBarChart = new Chart(ctx).Bar(x);
        // console.log()
        console.log(ctx)
        console.log("Success!")

    },
    componentDidMount: function(){
        this.generateGraph()
    },
    render: function(){
        return <canvas id="chart" ref="chart" width="600" height="250"></canvas>
    }
})

var StatisticalData = ReactMeteor.createClass({
    isBinary: function(data){
        return data.every(function(val){
            return val === 0 || val === 1
        });
    },
    render: function(){
        if (this.isBinary(this.props.data)) {
            var data = this.props.data
            var negative = data.reduce(function(memo, val){
                return memo + (val == 0)
            }, 0)
            var positive = data.reduce(function(memo, val){
                return memo + (val == 1)
            }, 0)
            return (
                <tbody>
                    <tr>
                        <td>Positive</td>
                        <td>{ positive.toFixed(2) }</td>
                    </tr>
                    <tr>
                        <td>Negative</td>
                        <td>{ negative.toFixed(2) }</td>
                    </tr>
                </tbody>
            )
        } else {
            var data = this.props.data
            var average = data.reduce(function(memo, val){
                return memo + val
            }, 0) / (data.length * 1.0)
            var standardDeviation = data.reduce(function(memo, val){
                return memo + (val - average) * (val - average) 
            }, 0)

            return (
                <tbody>
                    <tr>
                        <td>Mean</td>
                        <td>{ average.toFixed(2) }</td>
                    </tr>
                    <tr>
                        <td>Standard Deviation</td>
                        <td>{ standardDeviation.toFixed(2) }</td>
                    </tr>
                </tbody>
            )
        }
    }
})

var QuestionAnalytics = ReactMeteor.createClass({
    render: function(){
        console.log("die hwere")
        var question = this.props.question
        var answers = this.props.answers
        var index = this.props.index
        var audio_url = Audios.find(question.audio._id).fetch()[0].url()
        

        return <div>
            <div className="row">
                <div className="col-md-8">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h3 className="panel-title">Question { index + 1 }</h3>
                      </div>
                      <div className="panel-body">
                        <p>
                            { question.text }
                        </p>
                        <audio controls>
                            <source src={audio_url} type="audio/ogg" />
                        </audio>
                        <Histogram data={this.props.answers} />
                      </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        Simple Statistics
                      </div>
                      <div className="panel-body">
                        <table className="table">
                            <thead>
                                <th></th>
                                <th></th>
                            </thead>
                            <StatisticalData data={this.props.answers} />
                        </table>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    }
})