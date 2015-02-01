var React = require("react");
var Router = require("react-router");

var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    Link=Router.Link,
    RouteHandler = Router.RouteHandler;

var App = React.createClass({
    render: function() {
        return <RouteHandler/>;
    }
});

var Dashboard = React.createClass({
    render: function() {
        return <div>
            <h1>Dashboard</h1>
            <Link to="haha">HAHA</Link>
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
var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Dashboard}/>
        <Route name="haha" handler={HAHA}/>
    </Route>
);

// Startup the app
Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(
        <Handler />,
        document.getElementById("app")
    );
});

