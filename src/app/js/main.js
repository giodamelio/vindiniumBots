var React = require("react");

var Router = require("./router");

var HomePage = React.createClass({
    render: function() {
        return <div>
            <h1>Home page</h1>
            <a href="/haha">HAHA</a>
        </div>;
    }
});

var HAHA = React.createClass({
    render: function() {
        return <div>
            <h1>HAHA</h1>
            <pre>{this.props.querystring}</pre>
        </div>;
    }
});

// Define our routes
var routes = [
    ["/", HomePage],
    ["/haha", HAHA]
];

React.render(
    <Router routes={routes} />,
    document.getElementById("app")
);

