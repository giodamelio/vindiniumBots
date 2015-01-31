var React = require("react");

var SayHello = React.createClass({
    render: function(){
        if (this.props.name) {
            return (
                <h1>Hello {this.props.name}!</h1>
            );
        } else {
            return (
                <h1>Hello World!</h1>
            );
        }
    }
});

React.render(
    <SayHello name="Gio"/>,
    document.getElementById("app")
);

