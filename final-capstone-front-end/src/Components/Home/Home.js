import { Link } from "react-router-dom";
function Home() {
    return(
        <div>
            <p>Home.js - If you're seeing this, you're logged in</p>
            <Link to='/eventView/1' >EventView 1</Link>
            <br/>
            <Link to='/myEvents' >My Events</Link>    
            <br/>
            <Link to="/Restaurants">Restaurants</Link>
        </div>
    )
}

export default Home;
