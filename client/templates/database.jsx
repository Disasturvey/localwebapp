var DatabaseComponent = ReactMeteor.createClass({
    templateName: "databaseComponent",
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
    render: function(){
        return <div>
            <div className="page-header">
                <h1>Survey Response Database</h1>
            </div>
            <table className="table">
                <TableHead questions={this.state.questions} />
                <tbody>
                    { this.state.answers.map(function(answer, index){
                        return <AnswerRow index={index} key={answer._id} answer={answer} /> 
                    })}
                </tbody>
            </table>
        </div>
    }
})

var TableHead = ReactMeteor.createClass({
    render: function(){
        var arr = this.props.questions.map(function(question, idx){
            console.log(question)
            var audio_url = Audios.find(question.audio._id).fetch()[0].url()
            return <th key={question._id}>
                <a href={audio_url} target="_blank">Question { idx + 1 }</a>
            </th>
        })
        arr.push(<th key={Math.random()}>Location</th>)
        return (<thead>
            {arr}
        </thead>)
    }
})

var AnswerRow = ReactMeteor.createClass({
    render: function(){
        var answer = this.props.answer
        return <tr>
            <td>{answer.texts[0] || "NA" }</td>
            <td>{answer.texts[1] || "NA" }</td>
            <td>{answer.texts[2] || "NA" }</td>
            <td>({answer.lat},{" "}{answer.lng})</td>
        </tr>
    }
})